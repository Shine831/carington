# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Git Flow strategy (main, develop, feature/* branches).
- `.env.example` for environment variable configuration.
- `CHANGELOG.md` for project tracking.

### Changed
- Renamed `master` branch to `main`.
- Updated `README.md` with enhanced technical documentation and security improvements.

### Security
- Removed hardcoded Firebase credentials from `src/lib/firebase/config.ts` and `README.md`.
