# Changelog
All notable changes to this project will be documented here.

## [2026-05-10] - unreleased

### Added
- New "Fish" category with 40+ fish items including anthias, blue eel, salmon, tropical fish, etc.
- Support for multiple image formats (PNG, GIF, WEBP) with automatic fallback
- New resources: ancient debris, legendary/epic/rare/common essence, and more
- New utility items: armor trims, tracking oils, skill-specific mushrooms, and ore seeds

### Changed
- Improved image loading with existence checking to avoid 404 errors
- Enhanced image slug generation to better handle item variants
- Improved price rounding for more user-friendly values
- Simplified seller flagging logic by removing redundant flagged state

### Fixed
- CSS issue with panel body gradient that was causing visual artifacts
- Image path generation for variant items
