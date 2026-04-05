# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.2] - 2026-04-05

### Added

- **9 new themes to align all categories** — closes [#22](https://github.com/djdevil/AlertTicker-Card/issues/22). All main categories now have 9 themes each (previously critical and style had 9, while warning/info/ok had only 6):
  - **Warning:** `smoke` 🌫️ (drifting grey puffs), `wind` 💨 (fast horizontal streaks), `leak` 💧 (blue drip animation)
  - **Info:** `cloud` ☁️ (soft floating pulse), `satellite` 📡 (radiating signal waves), `tips` 💡 (amber lightbulb glow)
  - **Ok:** `sunrise` 🌅 (warm golden rising light), `plant` 🌱 (green growing pulse), `lock` 🔒 (deep blue secure pulse)
- Default messages for all 9 new themes in all 6 supported languages (it, en, fr, de, nl, vi)

---

## [1.1.1] - 2026-04-04

### Fixed

- **Editor opened the wrong alert when clicking to expand** — the expansion state was tracked by array index. When lit-html re-rendered the list after any config change, stale index bindings could cause a different alert to appear expanded than the one actually clicked. Fixed by assigning a stable internal UID to each alert and tracking expansion by UID instead of index. The click handler also now reads the index from a `data-idx` DOM attribute at event time, eliminating any closure-capture mismatch.

  > ⚠️ **Migration note:** due to the new UID system, alerts already present in existing card configurations will be assigned UIDs the first time the editor is opened. No YAML changes are required — your existing `alerts:` block is fully compatible. However, if you notice the editor still behaving unexpectedly after upgrading, **delete and re-add the affected alerts** in the visual editor to force a clean UID assignment.

---

## [1.1.0] - 2026-04-03

### Added

- **Message placeholders in any alert** — `{state}`, `{name}`, `{entity}` now work in the `message` field of any alert that has an entity set, not just `entity_filter` alerts. ([#11](https://github.com/djdevil/AlertTicker-Card/issues/11))

- **Nested attribute dot-notation** — `attribute` and `secondary_attribute` now accept dot-notation paths for deeply nested HA attributes (e.g. `activity.0.forecast`, `weather.temperature`). ([#7](https://github.com/djdevil/AlertTicker-Card/issues/7))

- **Wildcard `*` in `entity_filter`** — glob-style wildcards are now supported in filter patterns (e.g. `sensor.battery_*_level`). ([#16](https://github.com/djdevil/AlertTicker-Card/issues/16))

- **"Invert selection" button in filter preview** — one click to exclude all currently matched entities and include all previously excluded ones. ([#16](https://github.com/djdevil/AlertTicker-Card/issues/16))

- **`secondary_text`** — static text shown as a second line below the alert message. Supports `{state}`, `{name}`, `{entity}` placeholders. Does not require a secondary entity. ([#14](https://github.com/djdevil/AlertTicker-Card/issues/14))
  ```yaml
  secondary_text: "Last seen: {state}"
  ```

- **`show_filter_name: false`** — hides the entity friendly name automatically shown below the message when using `entity_filter`. ([#14](https://github.com/djdevil/AlertTicker-Card/issues/14))

- **`show_badge` / `badge_label`** — per-alert toggle to hide the category badge, or replace its text with a custom label. ([#13](https://github.com/djdevil/AlertTicker-Card/issues/13))
  ```yaml
  show_badge: false        # hide completely
  badge_label: "CUSTOM"   # or override label text
  ```

- **`show_snooze_bar: false`** — global option to hide the amber snooze reactivation bar and pill. ([#15](https://github.com/djdevil/AlertTicker-Card/issues/15))

- **`large_buttons: true`** — always-visible pill-shaped 💤 and 📋 buttons at the bottom-right of the card (no hover required). Stacked vertically, right-aligned. ([#23](https://github.com/djdevil/AlertTicker-Card/issues/23))

- **Per-alert `snooze_duration`** — override the global snooze setting for any individual alert. Set to hours (`1`, `4`, `8`, `24`), `null` for menu, or omit to inherit the global setting. ([#17](https://github.com/djdevil/AlertTicker-Card/issues/17))

- **Per-alert sound notifications** — `sound: true` plays an auto-generated tone when the alert becomes active. Tone varies by category: Critical = double high beep, Warning = medium beep, Info = soft beep, OK = rising chime. `sound_url` accepts a custom `.mp3` / `.wav` URL. Uses the Web Audio API — no external files required for default tones. ([#20](https://github.com/djdevil/AlertTicker-Card/issues/20))
  ```yaml
  sound: true
  sound_url: "https://example.com/alert.mp3"  # optional
  ```

- **Test mode** (`test_mode: true`) — forces all configured alerts to display as active regardless of entity state. Cycling animation is paused. Expand any alert in the editor to instantly jump the card preview to that alert. A yellow banner is displayed on the card as a reminder. ([#21](https://github.com/djdevil/AlertTicker-Card/issues/21))

- **Native `ha-icon-picker` in editor** — when `use_ha_icon` is enabled the icon field becomes a native HA icon picker component instead of a plain text field. ([#18](https://github.com/djdevil/AlertTicker-Card/issues/18))

- **Native `ha-service-control` in editor** — the `call-service` action block now uses the native HA service control component for service and target selection. ([#19](https://github.com/djdevil/AlertTicker-Card/issues/19))

- **Animation preview in editor** — changing the transition animation dropdown in the General tab immediately plays a one-shot preview of the selected animation on the card.

### Fixed

- History entries displayed raw `{state}` placeholder text instead of the resolved entity state value.
- Sound replayed for already-active alerts after a card reload triggered by editor config changes.

---

## [1.0.5] - 2026-03-31

### Added

- **`secondary_entity` / `secondary_attribute`** — display a live entity value as a second line below the alert message. Use any entity or attribute (e.g. a sensor listing open zones, a weather description). Configurable in the visual editor per alert. ([#7](https://github.com/djdevil/AlertTicker-Card/issues/7))
  ```yaml
  - entity: sensor.unmet_conditions_list
    operator: "!="
    state: ""
    message: "Active alerts"
    secondary_entity: sensor.unmet_conditions_list
  ```

- **`tap_action` / `hold_action`** — standard Lovelace card interactions per alert. Tap and hold (500 ms) can independently trigger `call-service`, `navigate`, `more-info`, or `url`. Fully configurable from the visual editor. ([#6](https://github.com/djdevil/AlertTicker-Card/issues/6))
  ```yaml
  - entity: binary_sensor.front_door
    state: "on"
    message: "Front door open"
    tap_action:
      action: more-info
      entity_id: binary_sensor.front_door
    hold_action:
      action: navigate
      navigation_path: /lovelace/security
  ```

- **`use_ha_icon` toggle** — per-alert switch to use a native Home Assistant `mdi:` icon instead of an emoji. When enabled, the icon is automatically read from the entity's `attributes.icon`. The icon field accepts any `mdi:` or `hass:` icon string. Toggling off restores the theme's default emoji.

- **`snooze_default_duration`** (General tab) — configures the behaviour of the 💤 snooze button. Set to a fixed duration (30 min / 1h / 4h / 8h / 24h) for one-tap immediate snooze, or leave as "Menu" (default) to keep the duration picker visible on the card.

- **`snooze_action`** — per-alert Lovelace action executed when the 💤 button is tapped, in addition to snoozing. Useful for resetting sensors or calling any HA service directly from the snooze button. ([#8](https://github.com/djdevil/AlertTicker-Card/issues/8))
  ```yaml
  - entity: binary_sensor.mailbox
    state: "on"
    message: "Mail arrived"
    snooze_action:
      action: call-service
      service: input_boolean.turn_off
      target:
        entity_id: input_boolean.mailbox_flag
  ```

- **Alert history** — a 📋 button appears on each card. Tapping it flips the card (fold animation) to a history view showing every alert that became active, with date and time. Includes a "Clear" button. History is stored in `localStorage`, survives page reloads, and is configurable (max events: 25 / 50 / 100 / 200). The 📋 button automatically hides when history is open. Cycle animation is paused while history is visible. ([#5](https://github.com/djdevil/AlertTicker-Card/issues/5))

- **`entity_filter`** — text-based entity filter that expands one alert config into one alert per matched entity. Matches entity IDs and friendly names (case-insensitive). Supports `{name}`, `{entity}`, `{state}` placeholders in the message. The card automatically shows the matched entity's friendly name below the message. Snooze and history work independently per entity. ([#10](https://github.com/djdevil/AlertTicker-Card/issues/10))
  ```yaml
  - entity_filter: "battery"
    attribute: battery_level
    operator: "<="
    state: "20"
    message: "Low battery: {name} ({state}%)"
    theme: battery
  ```

- **`entity_filter_exclude`** — list of entity IDs to exclude from a filter match. Configurable directly in the editor by clicking on any entity in the preview list.
  ```yaml
    entity_filter_exclude:
      - sensor.battery_test_device
  ```

- **Entity filter preview in editor** — when `entity_filter` is set, the editor shows a live match counter (green = found, red = none). Clicking the counter expands a list of all matched entities with name, entity ID and current state. Each entity can be clicked to exclude/re-include it (✓/✗ toggle with strikethrough).

- **4 dedicated Timer themes** — shown only when the entity is `timer.*`. All themes update every second using `finishes_at` and color-transition green→orange→red as time runs out. ([#9](https://github.com/djdevil/AlertTicker-Card/issues/9))

  | Theme | Description |
  |-------|-------------|
  | `countdown` | Horizontal progress bar at the bottom that shrinks left. Pulses when < 20% remaining. |
  | `hourglass` | Vertical background fill that drains from top to bottom. |
  | `timer_pulse` | Card glows and pulses — pulse speed increases as time runs out. |
  | `timer_ring` | SVG circular ring on the right with countdown in the center. |

- **`{timer}` placeholder** — use `{timer}` in the message of a timer alert to display the live countdown (`mm:ss` or `h:mm:ss`):
  ```yaml
  message: "Ad blocking disabled for {timer}"
  ```

- **Auto-fill message** — when selecting an entity in the editor, the message field is automatically pre-filled with the entity's `friendly_name` if the message is still empty or at the theme default.

- **Timer entity auto-config** — when a `timer.*` entity is selected in the editor: `state` is automatically set to `active`, the theme switches to `countdown`, and the `{timer}` placeholder hint appears below the message field.

- **Vietnamese language** (`vi`) — full translation contributed by @vdt2210, covering all card strings, editor labels, operator descriptions, and default theme messages. ([#12](https://github.com/djdevil/AlertTicker-Card/pull/12))

### Fixed

- 📋 history button remained visible while history was open — now returns `html\`\`` when `_historyOpen` is true
- Cycle animation continued playing while history view was open — tick now skips when `_historyOpen`
- Editor alert list showed `mdi:home` as raw text when `use_ha_icon` was enabled — now renders `<ha-icon>` in the preview row

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
- **Dutch language** (requested in [#3](https://github.com/djdevil/AlertTicker-Card/issues/3)) — full `nl` translation contributed by @peterpijpelink, covering all card strings, editor labels, operator descriptions, and default theme messages.
- **Snoozed indicator + reset button** — when all matching alerts are snoozed the card no longer disappears silently. Instead it shows a minimal dark bar "💤 N alerts snoozed" with a **↩ Resume all** button. Clicking it instantly clears all snooze state and restores the matching alerts.

### Fixed

- **Counter / alert number invisible** — `backdrop-filter: blur(4px)` on the snooze button was blurring the counter text behind it even when the button was `opacity: 0`. Removed `backdrop-filter`; added `pointer-events: none` to the snooze wrap so it never captures mouse events when invisible.
- **Editor closes when changing priority** (reported in [#1](https://github.com/djdevil/AlertTicker-Card/issues/1)) — The `ha-select` priority dropdown uses `mwc-select` internally. When the dropdown closes after a selection, it fires a `closed` event that bubbled up through the shadow DOM and was caught by HA's outer `mwc-dialog`, closing the card editor. Fixed by adding `@closed="${(e) => e.stopPropagation()}"` on the `ha-select` element.
- **State value hint in editor** (reported in [#2](https://github.com/djdevil/AlertTicker-Card/issues/2)) — the alert state field now shows the entity's actual current HA state value below the input (e.g. `Current state: "on"`). This prevents the common mistake of entering the UI display label (e.g. "Geöffnet") instead of the real state string ("on"). Also added `.trim()` on the state value to avoid invisible whitespace mismatches.

---

## [1.0.1] - 2026-03-29

### Fixed

- **Cycling animation** — fold animation played but always returned to the first alert. Root cause: `_computeActiveAlerts()` was calling `_stopCycleTimer()` + `_startCycleTimer()` whenever the alert list changed, resetting both the interval and `_currentIndex` mid-fold. The timer is now started once (on `connectedCallback`) and never restarted by entity state updates.

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

#### Priority system

- Alerts sorted by priority: `1`=Critical → `4`=Low
- Highest-priority alert always shown first
- Counter indicator (e.g. `2/3`) when multiple alerts are active

#### Auto-cycle with fold animation

- Configurable cycle interval (default 5 s)
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
