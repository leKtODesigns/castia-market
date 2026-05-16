# Asset Licenses and Provenance

The MIT license in `LICENSE` applies to original site code only. Third-party assets are excluded from that code license and remain subject to their own ownership, licenses, permissions, or usage rules.

## Current policy

- Local item images remain hosted in this repository for reliability and auditability.
- New copied assets should not be added unless their provenance is recorded at import time.
- Minecraft Wiki-derived files must be reviewed file by file; do not assume every wiki-hosted file has the same license status.
- CastiaMC-origin server-specific assets require written permission or later replacement if permission is not granted.
- Crafty avatar renders are external service responses, not bundled local assets.

## Asset manifest

`assets/asset-manifest.csv` is the source-of-truth inventory for local item images.

Required columns:

| Column | Meaning |
| --- | --- |
| `local_path` | Repository path of the local asset |
| `source_type` | Provenance bucket such as `minecraft-wiki`, `castiamc-origin`, `self-made`, or `pending-review` |
| `original_source_url` | Original source or file page URL |
| `author_or_uploader` | Original author/uploader if known |
| `license_or_permission_basis` | License name, ownership basis, or permission reference |
| `modified` | Whether the local copy was modified |
| `review_status` | `pending`, `cleared`, `replace`, or another explicit review result |

The current manifest is intentionally initialized with `pending-review` rows for the existing library. A row is not considered cleared until its source and reuse basis are documented.

## Future additions

Prefer:

1. Self-made artwork.
2. Files with clear compatible licensing.
3. Assets used with explicit written permission.

If the project is ever monetized, re-review the full asset library first and treat any `NC`-licensed or permission-pending dependency as a blocker until resolved.

## Manifest automation

Use `node scripts/update-asset-manifest.mjs --patterns="PATH_TO/discovered-patterns.json"` to recover probable source data from the existing Minecraft Wiki scraper output and local override rules.

The updater intentionally uses statuses such as `source-recovered`, `license-review-needed`, and `permission-pending`. It does not mark rows as legally `cleared`; that final status still requires human confirmation of the actual file license or written permission.
