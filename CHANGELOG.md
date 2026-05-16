# Changelog

This project uses grouped public-update entries instead of dates. Small fixes made close together stay under the same update batch, which keeps the history readable while still showing what changed.

## Unreleased

- Make backend category authoritative for market rows while keeping legacy frontend inference as a fallback.
- Suppress roman numerals for single-level enchantments in UI note formatting.
- Add dedicated Music Disc item images under the new backend category folder.
- Normalize percentage-suffixed runestone names for prepared card-note lookup.
- Normalize tier-suffixed runestone names for prepared card-note lookup.
- Correct the Ruby's Fire runestone note key to match the canonical item name.
- Preserve accented characters during image slugging and keep backend runestone categories from inheriting stale set-gear metadata.
- Defensively route known runestones away from incorrect Set Gear aggregate labels.

## Public update 04

### Improved

- Reworked the mobile Listings toolbar into clearer grouped controls.
- Refined the Detail Panel controls and replaced `Include Flagged` with a labeled animated switch.
- Improved Sellers panel header layout so seller names and multiple badges align cleanly on desktop as well as mobile.

### Fixed

- Corrected public-site asset routing so the live `/castia-market/` site loads its own build instead of `/castia-market-dev-build/`.
- Hardened Knowledge Cap note lookup and variant-note matching.

## Public update 03

### Changed

- Improved CSS organization with better spacing, comments, and structure.
- Enhanced mobile responsiveness for search suggestions and item displays.
- Restructured table styling for better visual hierarchy.

## Public update 02

### Added

- Added support for all vanilla Minecraft blocks and items.
- Added the `Vanilla` category with dedicated styling.
- Added descriptions for runestones and utility items.

### Changed

- Improved category badge styling and organization.
- Enhanced UI hierarchy and readability.

### Fixed

- Updated `.gitignore` to exclude the sprite downloader folder.
- Removed an unused fish asset.

## Public update 01

### Added

- Added the `Fish` category and related item support.
- Added multi-format image fallback support.
- Added new resources, utility items, Christmas Cap variants, and detailed set-gear descriptions.

### Changed

- Improved image loading behavior and image slug handling.
- Improved price rounding.
- Simplified seller flagging logic.

### Fixed

- Fixed the panel-body gradient artifact.
- Fixed image path generation for variant items.
