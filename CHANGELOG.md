# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-03-28

### Added

- 🎉 **Initial release** of AlertTicker Card for Home Assistant
- 📰 **Ticker theme** — Horizontal scrolling news ticker bar showing all active alerts
- 🚨 **Emergency theme** — Dark red pulsing card with flashing icon for critical alerts
- ⚠️ **Warning theme** — Amber card with animated dot for attention-level alerts
- ℹ️ **Info theme** — Blue card with circular icon wrap for informational messages
- ✅ **Success theme** — Green card with circular icon wrap for resolved/OK state
- ⚡ **Neon theme** — Cyberpunk dark card with cyan/magenta glow and scanning line animation
- 🔮 **Glass theme** — Glassmorphism card with gradient backdrop and frosted border
- 💻 **Matrix theme** — Terminal-style monospace card with blinking cursor and green-on-black
- 📋 **Minimal theme** — Clean light-mode card with dynamic accent border color
- 🔢 **Priority system** — Alerts sorted by priority (1=Critical → 4=Low); highest priority shown first
- 🔄 **Auto-cycle** — Configurable cycle interval (default 5s) when multiple alerts are active
- 🧮 **Alert counter** — "2/3" indicator shown when multiple alerts are active
- 🌐 **Bilingual** — Full Italian and English support, auto-detected from HA language settings
- 🖊️ **Custom messages** — Per-alert custom text defined in the editor
- 🎨 **Custom icons** — Per-alert emoji icon override, with automatic icons by priority
- 👁️ **Show when clear** — Optional "all clear" state when no alerts are active
- 🎛️ **Visual editor** — Full GUI configuration with two tabs (General + Alerts)
  - Theme selector with emoji labels
  - Add / edit / delete alerts
  - Entity picker (HA native `ha-entity-picker`)
  - Trigger state input
  - Priority selector (4 levels)
  - Move up / down reordering
- ⚡ **Performance** — `set hass()` uses signature comparison to skip unnecessary re-renders
- 🔌 **HACS compatible** — Dynamic editor import via `import.meta.url` with cache-bust support
