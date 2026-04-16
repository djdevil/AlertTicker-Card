# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.13] - 2026-04-16

### Added

- **`auto_dismiss_after` shown for all alerts** — moved from on_change-only to always visible in the editor, after the conditions section. Works for both `on_change` and normal condition-based alerts.
- **`text_align: center` card option** — centers the message text in all themes. Useful when using the "Panel (1 card)" dashboard layout where the card is very wide and text appears left-aligned. Toggle available in the card editor under the vertical layout setting. ([#41](https://github.com/djdevil/AlertTicker-Card/issues/41))

---

## [1.1.12] - 2026-04-16

### Fixed

- **`on_change` alert disappeared after 30 seconds even without `auto_dismiss_after`** — the dismiss timer now starts only when `auto_dismiss_after` is explicitly set. Without it, an `on_change` alert stays visible until the next state change. ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))

---

## [1.1.11] - 2026-04-16

### Added

- **`on_change: true` — trigger on state change** — when enabled the alert fires whenever the monitored entity's state changes to any value, regardless of the `operator`/`state` fields. Useful for showing a transient notification when a media track changes, a door opens, motion is detected, etc. The alert stays visible until the next state change (or until `auto_dismiss_after` expires). ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))
- **`auto_dismiss_after: N` — auto-hide after N seconds** — works on any alert type. For `on_change` alerts: the alert disappears after N seconds (default 30 if not set). For normal condition-based alerts: the alert auto-hides N seconds after the condition first becomes true; the timer resets if the condition goes false and becomes true again. Both fields are configurable in the visual editor with full 6-language support. ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))
- **MDI icon invisible in HA light mode even with `ha_theme` off** — `.atc-ha-icon` used `color: inherit` which in HA light mode resolved to a dark colour from the HA global stylesheet, invisible against the card's dark background. Now defaults to `rgba(255,255,255,0.9)` so it is always visible on dark-background themes. `ha_theme` overrides it to `--primary-text-color`; `icon_color` inline style takes precedence over both. ([#37](https://github.com/djdevil/AlertTicker-Card/issues/37))
- **Secondary entity value text invisible in HA light mode** — `.atc-secondary-value` had no explicit colour, inheriting dark text from HA's global stylesheet in light mode. Now defaults to `rgba(255,255,255,0.85)`. `ha_theme` overrides it to `--secondary-text-color`. ([#37](https://github.com/djdevil/AlertTicker-Card/issues/37))

---

## [1.1.10] - 2026-04-16

### Fixed

- **`ha_theme` broken in HA light mode** — all UI chrome elements used hardcoded dark-mode colours (`rgba(255,255,255,…)`) that became invisible on a light card background. Fixed with `var()` overrides scoped to `.atc-ha-theme` for: MDI icon colour, history panel ✕ and Clear buttons, snooze dropdown menu (background, labels, options), snoozed-all indicator bar and text, snoozed-all reset button, and snoozed pill. All elements now use HA CSS variables (`--primary-text-color`, `--secondary-text-color`, `--divider-color`, `--card-background-color`, `--secondary-background-color`) so they adapt correctly to any HA theme in both light and dark mode. ([#37](https://github.com/djdevil/AlertTicker-Card/issues/37))


---

## [1.1.9] - 2026-04-16

### Added

- **`icon_color` — custom colour for MDI icons** — when `use_ha_icon: true` is set, an optional `icon_color` field lets you specify any CSS color value (`#ff0000`, `red`, `var(--error-color)`, etc.) to override the icon's default theme colour. The visual editor shows a native colour picker swatch alongside a text field (for CSS variables and named colours) that appears automatically when the HA icon toggle is enabled. ([#35](https://github.com/djdevil/AlertTicker-Card/issues/35))

### Fixed

- **MDI icon colour glow/streak on some themes** — themes like `caution` apply a `filter: drop-shadow` to their icon container for an emoji glow effect. When an MDI `ha-icon` (SVG path) was used instead, the coloured glow radiated visibly below the icon as a streak. The fix no longer relies on the CSS `:has()` selector (limited browser/WebView support); instead, `updated()` stamps the class `atc-has-mdi-icon` directly onto the icon container via JavaScript, then CSS removes `background`, `border-color`, `box-shadow`, and `filter` on that element. Covers all 40 themes and both `-icon` and `-icon-wrap` class patterns. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))
- **`radar` theme layout broken in vertical mode** — the sonar display (`.rd-display`) and counter (`.rd-right`) were both `position: absolute` anchored to the right edge of the card. In vertical mode they overlapped the centred content. The sonar display is now hidden in vertical mode; the counter reverts to normal flow positioning; and the content's `padding-right: 86px` (reserved for the sonar circle) is reset to zero. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))
- **`lightning` theme decorative bolt overlapping in vertical mode** — the large decorative ⚡ element (`.lt-bolt`) was absolutely positioned at the right edge. Hidden in vertical mode. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))

---

## [1.1.8.1] - 2026-04-15

### Fixed

- **`vertical` mode card not filling grid cell when enlarged** — the card host element now sets `height: 100%` via `updated()` and the height propagates through `.atc-vertical`, `.at-fold-wrapper`, and `ha-card` so the card fully fills the HA grid cell when the row height is increased. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))
- **MDI icon background not transparent in vertical and other layouts** — icon-wrap elements containing an `ha-icon` (MDI) now get `background: transparent` and `border-color: transparent` applied automatically via `:has(.atc-ha-icon)`, preventing the coloured circle from clipping the card background. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))

---

## [1.1.8] - 2026-04-15

### Added

- **`ha_theme` option — HA global theme adaptation** — when `ha_theme: true` is set, the card adapts its colors to the active Home Assistant theme. Card backgrounds use `--card-background-color`, text uses `--primary-text-color`, and badge/border accents use the semantic HA color variables (`--error-color`, `--warning-color`, `--success-color`, `--info-color`). Compatible with any HA theme including Mushroom, Material, iOS, and custom themes. All 40 visual themes retain their unique animations and layouts — only the color palette adapts. Toggle available in the visual editor. ([#33](https://github.com/djdevil/AlertTicker-Card/issues/33))
- **`vertical: true` option — vertical layout for all themes** — stacks icon on top, badge + message + secondary text centered below. Works with all 40 themes via a single CSS class override. The Ticker theme keeps its horizontal scrolling behaviour. Toggle available in the visual editor. ([#32](https://github.com/djdevil/AlertTicker-Card/issues/32))
- **`swipe_to_snooze` option — left-swipe gesture to snooze on mobile** — when `swipe_to_snooze: true` is set, swiping left on the card silently snoozes the current alert using the configured duration (or 1h as default). Works independently of `tap_action` and `hold_action`, resolving the conflict between tap interactions and snooze access on touch screens. Toggle available in the visual editor. ([#34](https://github.com/djdevil/AlertTicker-Card/issues/34))

### Fixed

- **Theme description labels were Italian-only in the visual editor** — the parenthetical descriptions in the theme dropdown (e.g. "Red button", "Amber border", "Progress bar") are now translated into all 6 supported languages (IT, EN, FR, DE, NL, VI). Category group headings in the dropdown are also fully localised.
- **`large_buttons` + `vertical` layout conflict** — when both options were active together, the always-visible buttons were vertically centred on the right side of a tall card. They now anchor to the top-right corner to avoid overlapping the centred content.
- **`vertical` and `ha_theme` not applied to "All Clear" and snoozed-indicator banners** — the early-return render paths for `show_when_clear` and the snoozed-all indicator bypassed the `atc-snooze-host` wrapper, so neither `atc-vertical` nor `atc-ha-theme` classes were applied. Both paths now share the same `_hostClass` getter as the main render path.
- **`disconnectedCallback` conflict** — a duplicate method definition introduced in v1.1.7 caused `_stopTimerTick()` to never be called when the card was removed from the page. Merged the template subscription cleanup into the single existing `disconnectedCallback`.
- **`large_buttons` mode content overlap** — with `large_buttons: true`, the always-visible 💤 and 📋 buttons were overlapping the alert message text in some themes. All theme cards now get `padding-right: 88px` in this mode, ensuring the message remains fully readable. ([#34](https://github.com/djdevil/AlertTicker-Card/issues/34))

---

## [1.1.7] - 2026-04-13

### Added

- **Full HA template support in `message` and `secondary_text`** — fields containing `{{ }}` are now rendered server-side by Home Assistant via the WebSocket `render_template` API. This means any Jinja2 syntax that works in HA automations and templates works here too: `{{ states('sensor.x') }}`, `{{ state_attr('entity','attr') }}`, `{% if %}...{% endif %}`, `{{ now() }}`, `| round()`, `| int`, etc. Templates update live whenever the underlying entities change. A lightweight client-side fallback (`states()`, `state_attr()`, `is_state()` with common filters) is shown immediately while the WebSocket response is pending.

### Fixed

- **`secondary_entity` silently showed nothing when the entity ID was wrong** — the card now shows a subtle `⚠ entity.id` warning in amber so the user knows the entity was not found instead of seeing a blank space.

---

## [1.1.6] - 2026-04-06

### Fixed

- **Preview jumps back to first alert when editing a field** — two root causes, both fixed:
  1. **Spurious `ha-service-control` events on edit panel open**: `_initializing` was only set on the editor's first `connectedCallback`. When the user opened an alert that has a `call-service` action, new `ha-service-control` components mounted and fired spurious `value-changed` events (confirmed HA bug: `oldValue` is `undefined` on `willUpdate`). Fixed by re-setting `_initializing = true` (two microtask ticks) every time a new alert panel is opened in `_editAlert`.
  2. **`_preview_index` not re-sent on field changes**: `_updateAlert` now re-attaches `_preview_index` to every dispatch when test mode is active and the edited alert is the currently previewed one.
- **History showed only message without entity context** — `_recordHistory` now also saves the entity's friendly name, its formatted/translated state, and the secondary entity name + state. The history view renders them as additional lines below the message.
- **`timer_ring` theme: snooze and history buttons overlapping the ring SVG in `large_buttons` mode** — the two circular buttons were positioned absolutely at `right: 8px` / `right: 46px`, covering the ring entirely. Fixed by adding `padding-right: 90px` to `.at-timer-ring` when `large_buttons` is active.

### Changed

- **Theme and priority moved to top of alert edit form** — shown as a compact side-by-side row at the very top of the edit panel, before all other sections, so the visual result is immediately visible in the card preview without scrolling.

---

## [1.1.5] - 2026-04-06

### Fixed

- **`_preview_index` broken for `entity_filter` alerts** — when an alert uses `entity_filter`, the card expands it into multiple concrete alert objects (one per matched entity). These new objects have a different reference than the original config alert, so `active.findIndex(a => a === target)` always returned `-1`, leaving the preview stuck on the first alert regardless of which row was clicked in the editor. Fixed by storing a `_sourceAlert` reference on every expanded alert and checking `a === target || a._sourceAlert === target` during the preview lookup.

---

## [1.1.4] - 2026-04-06

### Fixed

- **Alert not recorded in history on page load** — if an alert was already active when the card loaded (e.g. an automation already `off`), `_initialLoadDone` was `false` on the first `_computeActiveAlerts` call, causing history recording to be skipped entirely. Since the entity state didn't change afterwards, the signature dedup prevented any subsequent recording. Fixed by recording history on first load too, with a 5-minute deduplication window per entity to avoid duplicate entries on page reload. Sound playback is still suppressed on first load.

---

## [1.1.3] - 2026-04-06

### Added

- **`show_filter_state`** — new toggle in the editor (visible when `entity_filter` is set). When enabled, shows the translated/formatted entity state next to the entity name in the card's secondary line (e.g. "Bathroom Radar Sensor  On").
- **`show_secondary_name`** — new toggle in the editor (visible when `secondary_entity` is set). When enabled, shows the entity's friendly name next to the value (e.g. "Living Room Temperature  22.5 °C").

### Fixed

- **`{state}` now shows the translated/formatted value** — previously `{state}` substituted the raw HA state string (e.g. `"on"`, `"off"`, `"2"`). Now uses `hass.formatEntityState()` and `hass.formatEntityAttributeValue()` (available from HA 2023.3) to return the localized string (e.g. `"On"`, `"Off"`, `"22.5 °C"`). Falls back to the raw value on older HA versions. Applies to regular messages, `entity_filter` expansion, and `secondary_entity`.
- **Notification counter correctly positioned in `large_buttons` mode** — the "X/Y" counter is now shown as an overlay at `top: 5px; right: 7px` (top-right corner), always visible and never outside the card. Theme `*-right` columns are fully hidden to prevent layout shift.

### Changed

- **Removed 📍 icon before entity name in filters** — when `entity_filter` + `show_filter_name` is active, the pin icon has been removed. Text is now larger (`0.92rem`, weight `600`, no italic).
- **`secondary_entity` now uses translated state** — same system as `{state}`, uses `formatEntityState()` / `formatEntityAttributeValue()`. Text is now larger (`0.92rem`, weight `500`).
- **`large_buttons` are now circular and side by side** — two 30×30px circles centered vertically on the right side, showing only the icon (💤 / 📋). No text, no overlap with card content.
- **Notification counter larger** — the "2/3" badge increased from `0.62rem` to `0.85rem` for better visibility (normal mode).

---

## [1.1.2] - 2026-04-06

### Fixed

- **Editor preview opened the wrong alert** — root cause: `ha-service-control.willUpdate` always fires `value-changed` on first render (HA bug: `oldValue` is `undefined`), triggering a `_fireConfig` → `config-changed` → `setConfig` → re-render loop that corrupted expansion state. Fixed with:
  - **New "edit panel" architecture** — the edit panel is separate from the alert list and driven by a single `_editingIndex: Number`, impossible to corrupt via LitElement or HA re-renders.
  - **`_initializing` flag** — silences all `ha-service-control` `value-changed` events during the first render burst (two microtask ticks).
  - **`setConfig` preserves alert object references** — JSON deduplication to avoid unnecessary re-renders.
- **`_preview_index` pointed to the wrong alert** — the card was applying `_preview_index` against the priority-sorted array instead of the config array. Fixed using `active.findIndex(a => a === target)` to resolve position via object reference.
- **`_preview_index` and `_preview_anim` permanently saved to YAML** — `_fireConfig` was dispatching these transient editor fields to HA which saved them to the user's config, corrupting JSON deduplication. Fixed by stripping them in `setConfig` via destructuring.

---

## [1.1.1] - 2026-04-06

### Added

- **9 new themes to align all categories** — closes [#22](https://github.com/djdevil/AlertTicker-Card/issues/22). All main categories now have 9 themes each (previously critical and style had 9, while warning/info/ok had only 6):
  - **Warning:** `smoke` 🌫️ (drifting grey puffs), `wind` 💨 (fast horizontal streaks), `leak` 💧 (blue drip animation)
  - **Info:** `cloud` ☁️ (soft floating pulse), `satellite` 📡 (radiating signal waves), `tips` 💡 (amber lightbulb glow)
  - **Ok:** `sunrise` 🌅 (warm golden rising light), `plant` 🌱 (green growing pulse), `lock` 🔒 (deep blue secure pulse)
- Default messages for all 9 new themes in all 6 supported languages (it, en, fr, de, nl, vi)

---

## [1.1.0] - 2026-04-03

### Added

- **Message placeholders in any alert** — `{state}`, `{name}`, `{entity}` now work in the `message` field of any alert that has an entity set, not just `entity_filter` alerts. ([#11](https://github.com/djdevil/AlertTicker-Card/issues/11))
- **Nested attribute dot-notation** — `attribute` and `secondary_attribute` now accept dot-notation paths for deeply nested HA attributes (e.g. `activity.0.forecast`, `weather.temperature`). ([#7](https://github.com/djdevil/AlertTicker-Card/issues/7))
- **Wildcard `*` in `entity_filter`** — glob-style wildcards are now supported in filter patterns (e.g. `sensor.battery_*_level`). ([#16](https://github.com/djdevil/AlertTicker-Card/issues/16))
- **"Invert selection" button in filter preview** — one click to exclude all currently matched entities and include all previously excluded ones. ([#16](https://github.com/djdevil/AlertTicker-Card/issues/16))
- **`secondary_text`** — static text shown as a second line below the alert message. Supports `{state}`, `{name}`, `{entity}` placeholders. Does not require a secondary entity. ([#14](https://github.com/djdevil/AlertTicker-Card/issues/14))
- **`show_filter_name: false`** — hides the entity friendly name automatically shown below the message when using `entity_filter`. ([#14](https://github.com/djdevil/AlertTicker-Card/issues/14))
- **`show_badge` / `badge_label`** — per-alert toggle to hide the category badge, or replace its text with a custom label. ([#13](https://github.com/djdevil/AlertTicker-Card/issues/13))
- **`show_snooze_bar: false`** — global option to hide the amber snooze reactivation bar and pill. ([#15](https://github.com/djdevil/AlertTicker-Card/issues/15))
- **`large_buttons: true`** — always-visible 💤 and 📋 buttons on the right side of the card (no hover required). ([#23](https://github.com/djdevil/AlertTicker-Card/issues/23))
- **Per-alert `snooze_duration`** — override the global snooze setting for any individual alert. ([#17](https://github.com/djdevil/AlertTicker-Card/issues/17))
- **Per-alert sound notifications** — `sound: true` plays an auto-generated tone when the alert becomes active. Tone varies by category. `sound_url` accepts a custom `.mp3` / `.wav` URL. Uses the Web Audio API. ([#20](https://github.com/djdevil/AlertTicker-Card/issues/20))
- **Test mode** (`test_mode: true`) — forces all configured alerts to display as active regardless of entity state. A yellow banner is shown on the card as a reminder. ([#21](https://github.com/djdevil/AlertTicker-Card/issues/21))
- **Native `ha-icon-picker` in editor** — the icon field becomes a native HA icon picker component when `use_ha_icon` is enabled. ([#18](https://github.com/djdevil/AlertTicker-Card/issues/18))
- **Native `ha-service-control` in editor** — the `call-service` action block now uses the native HA service control component. ([#19](https://github.com/djdevil/AlertTicker-Card/issues/19))
- **Animation preview in editor** — changing the transition animation dropdown immediately plays a one-shot preview of the selected animation.

### Fixed

- History entries displayed raw `{state}` placeholder text instead of the resolved entity state value.
- Sound replayed for already-active alerts after a card reload triggered by editor config changes.

---

## [1.0.5] - 2026-03-31

### Added

- **`secondary_entity` / `secondary_attribute`** — display a live entity value as a second line below the alert message. ([#7](https://github.com/djdevil/AlertTicker-Card/issues/7))
- **`tap_action` / `hold_action`** — standard Lovelace card interactions per alert. Tap and hold (500 ms) can independently trigger `call-service`, `navigate`, `more-info`, or `url`. ([#6](https://github.com/djdevil/AlertTicker-Card/issues/6))
- **`use_ha_icon` toggle** — per-alert switch to use a native Home Assistant `mdi:` icon instead of an emoji.
- **`snooze_default_duration`** (General tab) — fixed duration for the 💤 button or "Menu" (default).
- **`snooze_action`** — Lovelace action executed when the 💤 button is tapped, in addition to snoozing. ([#8](https://github.com/djdevil/AlertTicker-Card/issues/8))
- **Alert history** — a 📋 button opens a history view showing every alert that became active, with date and time. Includes a "Clear" button. Stored in `localStorage`. ([#5](https://github.com/djdevil/AlertTicker-Card/issues/5))
- **`entity_filter`** — text-based entity filter that expands one alert config into one alert per matched entity. Supports `{name}`, `{entity}`, `{state}` placeholders. ([#10](https://github.com/djdevil/AlertTicker-Card/issues/10))
- **`entity_filter_exclude`** — list of entity IDs to exclude from a filter match.
- **Entity filter preview in editor** — live match counter with expandable entity list. Each entity can be clicked to exclude/re-include it.
- **4 dedicated Timer themes** — `countdown`, `hourglass`, `timer_pulse`, `timer_ring`. All update every second using `finishes_at`. ([#9](https://github.com/djdevil/AlertTicker-Card/issues/9))
- **`{timer}` placeholder** — displays the live countdown (`mm:ss` or `h:mm:ss`) in the alert message.
- **Auto-fill message** — the message field is automatically pre-filled with the entity's `friendly_name` when selecting an entity if the message is still empty.
- **Timer entity auto-config** — when a `timer.*` entity is selected: `state` is set to `active`, theme switches to `countdown`, and the `{timer}` placeholder hint appears.
- **Vietnamese language** (`vi`) — full translation. ([#12](https://github.com/djdevil/AlertTicker-Card/pull/12))

### Fixed

- The 📋 history button remained visible while history was open.
- Cycle animation continued playing while history view was open.
- Editor showed `mdi:home` as raw text when `use_ha_icon` was enabled.

---

## [1.0.3] - 2026-03-29

### Added

- **5 new spectacular themes** (total now 22): `nuclear` ☢️, `radar` 🎯, `hologram` 🔷, `heartbeat` 💓, `retro` 📺.
- **Font size increase** for all 22 themes: badge labels `0.65→0.72rem`, message text `0.90→0.98rem`, critical themes `0.95→1.05rem`.
- **Numeric / comparison conditions** — `operator` accepts `=`, `!=`, `>`, `<`, `>=`, `<=`. Enables numeric sensors (e.g. `humidity < 40`, `co2 > 1000`).
- **Snooze / suspend alert** — a 💤 button appears on hover. Clicking opens a duration menu (1h / 4h / 8h / 24h). Persisted in `localStorage`.
- **Dutch language** (`nl`). ([#3](https://github.com/djdevil/AlertTicker-Card/issues/3))
- **Snoozed indicator + reset button** — when all matching alerts are snoozed the card shows a minimal bar "💤 N alerts snoozed" with a **↩ Resume all** button.

### Fixed

- **Counter / alert number invisible** — `backdrop-filter: blur(4px)` on the snooze button was blurring the counter behind it even at `opacity: 0`. Removed `backdrop-filter`; added `pointer-events: none` to the snooze wrap.
- **Editor closes when changing priority** ([#1](https://github.com/djdevil/AlertTicker-Card/issues/1)) — the `closed` event from `ha-select` bubbled up to HA's `mwc-dialog`, closing the editor. Fixed with `@closed="${(e) => e.stopPropagation()}"`.
- **State value hint in editor** ([#2](https://github.com/djdevil/AlertTicker-Card/issues/2)) — the state field now shows the entity's actual current HA state value below the input.

---

## [1.0.1] - 2026-03-29

### Fixed

- **Cycling animation** — the fold animation played but always returned to the first alert. The timer is now started once on `connectedCallback` and never restarted by entity state updates.

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
- Selecting a theme automatically sets the matching icon
- Changing theme also updates the default message if it hasn't been customized

#### Priority system

- Alerts sorted by priority: `1`=Critical → `4`=Low
- Highest-priority alert always shown first
- Counter indicator (e.g. `2/3`) when multiple alerts are active

#### Auto-cycle with fold animation

- Configurable cycle interval (default 5s)
- 3D page-turn (fold) transition between active alerts
- `ticker` theme shows all alerts scrolling simultaneously instead of cycling

#### Visual editor — two tabs

- **General tab**: cycle interval, show-when-clear toggle, clear message and clear theme
- **Alerts tab**: entity picker, trigger state, priority (1–4), message, theme, icon override
- Move up / move down reordering
- Expand / collapse per alert

#### Languages — 4 languages auto-detected from HA settings

- Italian (`it`), English (`en`), French (`fr`), German (`de`)

#### HACS compatibility

- Dynamic editor import via `import.meta.url` with cache-bust version tag
- `hui-glance-card.getConfigElement()` pattern to force-load `ha-entity-picker`

#### Other

- `set hass()` uses entity-state signature comparison to skip unnecessary re-renders
- Show-when-clear: optional all-clear card with configurable message and OK theme
- Custom icon override per alert
