# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-03-29

### Fixed

- **Cycling animation** — fold animation played but always returned to the first alert. Root cause: `_computeActiveAlerts()` was calling `_stopCycleTimer()` + `_startCycleTimer()` whenever the alert list changed, resetting both the interval and `_currentIndex` mid-fold. The timer is now started once (on `connectedCallback`) and never restarted by entity state updates. Each tick checks internally whether there is more than one active alert before advancing the index.

---

## [1.0.0] - 2026-03-28

### Added

#### Themes — 17 visual themes grouped by category

- **Critical** — `emergency` 🚨 · `fire` 🔥 · `alarm` 🔴 · `lightning` 🌩️
- **Warning** — `warning` ⚠️ · `caution` 🟡
- **Info** — `info` ℹ️ · `notification` 🔔 · `aurora` 🌌
- **OK / All Clear** — `success` ✅ · `check` 🟢 · `confetti` 🎉
- **Style** — `ticker` 📰 · `neon` ⚡ · `glass` 🔮 · `matrix` 💻 · `minimal` 📋

#### Per-alert theme system

- Each alert has its own `theme` field — no global theme
- Selecting a theme automatically sets the matching icon (coherent visual identity)
- Changing theme also updates the default message if it hasn't been customized
- `clear_theme` at card root level controls the all-clear state (only `success`, `check`, `confetti`)

#### Priority system

- Alerts sorted by priority: `1`=Critical → `4`=Low
- Highest-priority alert always shown first
- Counter indicator (e.g. `2/3`) when multiple alerts are active

#### Auto-cycle with fold animation

- Configurable cycle interval (default 5 s)
- 3D page-turn (fold) transition between active alerts
- `ticker` theme shows all alerts scrolling simultaneously instead of cycling

#### Default messages per theme

- Each theme provides a language-specific default message when a new alert is added
- Default message is automatically updated when changing theme (if not customized yet)

#### Visual editor — two tabs

- **General tab**: cycle interval, show-when-clear toggle, clear message and clear theme
- **Alerts tab**: entity picker (`ha-entity-picker`), trigger state, priority (1–4), message, theme, icon override
- Move up / move down reordering
- Expand / collapse per alert
- Priority badge with color coding

#### Languages — 4 languages auto-detected from HA settings

- Italian (`it`)
- English (`en`) — default fallback
- French (`fr`)
- German (`de`)

#### HACS compatibility

- Dynamic editor import via `import.meta.url` with cache-bust version tag
- `hui-glance-card.getConfigElement()` pattern to force-load `ha-entity-picker` reliably
- `customElements.whenDefined()` + `Promise.race()` fallback with 3 s timeout

#### Other

- `set hass()` uses entity-state signature comparison to skip unnecessary re-renders
- Show-when-clear: optional all-clear card with configurable message and OK theme
- Custom icon override per alert (leave empty for automatic icon from theme)
