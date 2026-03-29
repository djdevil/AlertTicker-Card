# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3] - 2026-03-29

### Added

- **5 new spectacular themes** (total now 22):
  - `nuclear` ☢️ — rotating radiation icon with amber pulsing glow (Critical)
  - `radar` 🎯 — circular sonar display with sweeping cone + concentric rings (Warning)
  - `hologram` 🔷 — holographic grid + horizontal scan beam + glitch flicker (Info)
  - `heartbeat` 💓 — scrolling ECG line + beating pulse ring on icon (OK)
  - `retro` 📺 — CRT amber phosphor display with scanlines and screen flicker (Style)
- **Font size increase** for all 22 themes: badge labels 0.65→0.72 rem, message text 0.90→0.98 rem, critical themes 0.95→1.05 rem.
- **Numeric / comparison conditions** — the `operator` field on each alert now accepts `=` (default, exact match), `!=`, `>`, `<`, `>=`, `<=`. Enables sensors with % or numeric values (e.g. `humidity < 40`, `co2 > 1000`). Visual editor exposes an operator dropdown next to the value field; YAML backward-compatible (omitting `operator` defaults to `=`).
- **Snooze / suspend alert** — a 💤 button appears on hover over any active alert. Clicking it opens a duration menu (1 h / 4 h / 8 h / 24 h). Snoozed alerts are hidden for the chosen duration without touching the underlying entity. State is persisted to `localStorage` so it survives page reloads. The card restores the alert automatically when the snooze expires, even with no entity state change.
- **Snoozed indicator + reset button** — when all matching alerts are snoozed the card no longer disappears silently. Instead it shows a minimal dark bar "💤 N alerts snoozed" with a **↩ Resume all** button. Clicking it instantly clears all snooze state and restores the matching alerts. This prevents the confusing scenario where the card vanishes with no indication of why.

### Fixed

- **Counter / alert number invisible** — `backdrop-filter: blur(4px)` on the snooze button was blurring the counter text behind it even when the button was `opacity: 0`. Removed `backdrop-filter`; added `pointer-events: none` to the snooze wrap so it never captures mouse events when invisible.
- **Editor closes when changing priority** (reported in [#1](https://github.com/djdevil/AlertTicker-Card/issues/1)) — The `ha-select` priority dropdown uses `mwc-select` internally. When the dropdown closes after a selection, it fires a `closed` event that bubbled up through the shadow DOM and was caught by HA's outer `mwc-dialog`, closing the card editor. Fixed by adding `@closed="${(e) => e.stopPropagation()}"` on the `ha-select` element.
- **State value hint in editor** (reported in [#2](https://github.com/djdevil/AlertTicker-Card/issues/2)) — the alert state field now shows the entity's actual current HA state value below the input (e.g. `Current state: "on"`). This prevents the common mistake of entering the UI display label (e.g. "Geöffnet") instead of the real state string ("on"). Also added `.trim()` on the state value to avoid invisible whitespace mismatches.

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
