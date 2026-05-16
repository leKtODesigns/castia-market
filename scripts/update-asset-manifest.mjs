import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "assets", "asset-manifest.csv");
const OVERRIDES_PATH = path.join(ROOT, "assets", "asset-source-overrides.json");
const PATTERNS_ARG = process.argv.find((arg) => arg.startsWith("--patterns="));
const PATTERNS_PATH = PATTERNS_ARG ? PATTERNS_ARG.slice("--patterns=".length) : null;

const HEADERS = [
  "local_path",
  "source_type",
  "original_source_url",
  "author_or_uploader",
  "license_or_permission_basis",
  "modified",
  "review_status",
];

function slugify(text) {
  return String(text || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => {
        const value = values[index] || "";
        return [header, /^"+$/.test(value) ? "" : value];
      }),
    );
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function writeCsv(rows) {
  const lines = [
    HEADERS.map(csvEscape).join(","),
    ...rows.map((row) => HEADERS.map((header) => csvEscape(row[header] || "")).join(",")),
  ];
  fs.writeFileSync(MANIFEST_PATH, `${lines.join("\n")}\n`);
}

function relativeFolder(localPath) {
  const parts = localPath.split("/");
  return parts[3] || "";
}

function applyValues(row, values) {
  for (const [key, value] of Object.entries(values || {})) {
    if (HEADERS.includes(key) && value !== "") row[key] = value;
  }
}

function toWikiFilePage(imageUrl) {
  try {
    const filename = decodeURIComponent(new URL(imageUrl).pathname.split("/").pop() || "");
    return filename ? `https://minecraft.wiki/w/File:${filename}` : imageUrl;
  } catch {
    return imageUrl;
  }
}

const rows = parseCsv(fs.readFileSync(MANIFEST_PATH, "utf8"));
const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"));
const patterns = PATTERNS_PATH
  ? JSON.parse(fs.readFileSync(PATTERNS_PATH, "utf8"))
  : {};
const patternMap = new Map(
  Object.entries(patterns).map(([name, url]) => [slugify(name), url]),
);

const stats = {
  rows: rows.length,
  wikiPatternMatches: 0,
  fileOverrides: 0,
  folderDefaults: 0,
  folderFallbacks: 0,
};

for (const row of rows) {
  const folder = relativeFolder(row.local_path);
  const fileStem = path.parse(row.local_path).name;
  const patternUrl = patternMap.get(fileStem);

  if (folder === "vanilla" && patternUrl) {
    applyValues(row, {
      source_type: "minecraft-wiki",
      original_source_url: toWikiFilePage(patternUrl),
      license_or_permission_basis: "probable Mojang asset; Minecraft Usage Guidelines review needed",
      review_status: "source-recovered",
    });
    stats.wikiPatternMatches += 1;
  }

  if (overrides.folderDefaults[folder]) {
    applyValues(row, overrides.folderDefaults[folder]);
    stats.folderDefaults += 1;
  }

  if (overrides.folderFileFallbacks[folder]) {
    applyValues(row, overrides.folderFileFallbacks[folder]);
    stats.folderFallbacks += 1;
  }

  if (overrides.files[row.local_path]) {
    applyValues(row, overrides.files[row.local_path]);
    if (!row.original_source_url && patternUrl) row.original_source_url = toWikiFilePage(patternUrl);
    stats.fileOverrides += 1;
  }
}

writeCsv(rows);
console.log(JSON.stringify(stats, null, 2));
