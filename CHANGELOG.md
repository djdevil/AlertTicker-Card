# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.7] - 2026-04-25

### Added

- **Persistent alerts (`persistent: true`)** — a new per-alert flag that keeps the alert card visible even after the sensor returns to its idle state. Once the condition becomes active the alert latches until the user explicitly dismisses it. The 💤 snooze button is replaced with a small **✕ Dismiss** button, styled differently from snooze to signal the different action. Swiping left also dismisses a persistent alert. The latch is stored in `localStorage` per browser so the card survives page reloads. All layouts supported: standard, `large_buttons`, vertical, and vertical + large_buttons. Available in the visual editor under the alert's timing section.
  ```yaml
  alerts:
    - entity: binary_sensor.smoke_detector
      state: "on"
      persistent: true      # stays visible until ✕ is tapped
      message: "Smoke detected!"
      theme: fire
  ```

- **Configurable weather/forecast alternation interval (`weather_forecast_interval`)** — when using `clear_display_mode: weather_forecast`, the panel now alternates at a user-defined interval instead of the hardcoded 5 seconds. Set any value from 1 to 60 seconds. The card always completes a full weather + forecast cycle before advancing to the next alert when `show_widget_in_cycle: true`. Configurable in the visual editor (All Clear tab → interval field visible when `weather_forecast` mode is selected). Default: `5`. Translated in all 10 supported languages.
  ```yaml
  clear_display_mode: weather_forecast
  weather_forecast_interval: 10   # seconds per panel, default 5
  ```

### Fixed

- **Hold action not firing on mobile** ([#95](https://github.com/djdevil/AlertTicker-Card/issues/95)) — on touch devices, the browser fires a `pointercancel` event as soon as it takes over the touch gesture for scrolling, silently cancelling the hold timer before it expires. Fixed by calling `e.preventDefault()` in `_onPointerDown` when a hold action is configured for that alert, preventing the browser from hijacking the touch event. Standard tap, double-tap and swipe remain unaffected.

---

## [1.2.6] - 2026-04-25

### Added

- **Music player mode (`show_player_controls`)** — when the alert entity is a `media_player.*` and `show_player_controls: true` is enabled, the `music` theme switches to a full graphical player UI: blurred album art fills the background with a directional gradient overlay, a spinning vinyl thumbnail is shown on the right (rotates only when playing), animated equalizer bars pulse next to the "NOW PLAYING" label, and glassmorphism buttons provide ⏮ previous, ⏸/▶ play-pause, ⏭ next, 🔇/🔊 mute toggle, and a live volume slider. All colors use the `--mu-accent` CSS custom property so the entire UI follows the chosen accent color. Incompatible editor fields (message, icon, badge, secondary entity) are automatically hidden when player mode is active.
  ```yaml
  alerts:
    - entity: media_player.spotify_davide
      theme: music
      show_player_controls: true
      music_player_color: "#e040fb"   # optional, default purple
  ```

  
- **Forecast & Weather+Forecast widgets (`clear_display_mode: forecast` / `weather_forecast`)** — two new clear-state display modes. `forecast` fills the card with a full 7-day weather forecast: each day shows a weather emoji, high/low temperatures (color-coded by range), a date label, and a precipitation probability bar for days ≥20%; today's column is elevated with a frosted glass effect, a floating emoji animation, and an accent glow line. `weather_forecast` alternates every 5 seconds between the current weather view (icon, temperature, condition, wind/humidity, date and clock) and the 7-day grid using a smooth fade+slide transition. Both modes share the same `clear_weather_entity`, are compatible with all weather styles and `show_widget_in_cycle: true`, and render day labels via `Intl.DateTimeFormat` for automatic locale-correct output in all 11 supported languages. Data is fetched via the HA WebSocket `weather/subscribe_forecast` API (HA 2023.9+). When used in the alert cycle the card always shows both the weather panel and the forecast panel in full before advancing to the next alert.

  ```yaml
  clear_display_mode: weather_forecast   # or: forecast
  clear_weather_entity: weather.home
  show_when_clear: true
  ```

- **Tap / double-tap / hold actions on clear widget** ([#93](https://github.com/djdevil/AlertTicker-Card/issues/93)) — the existing `clear_tap_action`, `clear_double_tap_action`, and `clear_hold_action` settings now work for all clear display modes (clock, weather, weather+clock, forecast, weather+forecast), both when the widget is the only thing shown (`show_when_clear: true`) and when it appears as a slide in the alert cycle (`show_widget_in_cycle: true`). Previously, actions only fired on the plain text "all-clear" message card. Configure in the visual editor under the same tap/hold sections already present.

- **`device_class: timestamp` sensor support for timer themes** ([#94](https://github.com/djdevil/AlertTicker-Card/issues/94)) — timer themes (`countdown`, `hourglass`, `timer_pulse`, `timer_ring`) now work directly with any sensor whose `device_class` is `timestamp` (state = ISO datetime of expiry). The card reads the state as the finish time and shows a live countdown, updating every second. Since the total duration is unknown the progress bar/ring shows empty with a neutral blue accent instead of the red/orange/green scale used for `timer.*` entities. Useful for Alexa Media Player timer sensors, washing machine end-time sensors, and similar integrations.
  ```yaml
  alerts:
    - entity: sensor.kitchen_echo_pop_next_timer
      theme: countdown
      operator: "!="
      state: "unknown"
      conditions:
        - entity: sensor.kitchen_echo_pop_next_timer
          operator: "!="
          state: "unavailable"
        - entity: sensor.kitchen_echo_pop_next_timer
          operator: "!="
          state: "none"
      conditions_logic: and
      message: "⏱ Kitchen timer: {timer}"
  ```
  The visual editor auto-detects timestamp sensors, switches to timer-only themes, and pre-fills all three idle-state conditions (`unknown`, `unavailable`, `none`) automatically. A `timer.*` helper entity remains the better choice when a progress bar is needed, since only timer entities expose the total duration.

- **12-hour clock format (`clear_clock_12h`)** ([#93](https://github.com/djdevil/AlertTicker-Card/issues/93)) — new toggle for clock-based clear display modes (`clock`, `weather_clock`, `weather_forecast`). When enabled the time is shown as `3:45:22 PM` instead of `15:45:22`. Configurable via a switch in the visual editor (shown alongside the existing "Show date" toggle), translated in all 11 supported languages.

- **`music` theme** — new info-category theme with dark purple/magenta color scheme. Four musical notes (♪ ♫ ♩ ♬) float upward with staggered timing; the icon pulses with a bright magenta drop-shadow glow. Fully integrated with the visual editor, all TTS languages, and HA theme compatibility. Default message translated in all 11 supported languages.



- **Accent color picker for music player (`music_player_color`)** — a native color swatch picker + hex text field in the editor lets you choose any accent color for the player UI (buttons, glow, equalizer bars, vinyl ring, accent line). All player CSS uses `var(--mu-accent)` and `color-mix()` so the entire UI updates with a single value. Default `#e040fb` (purple). Translated label in all 11 supported languages.

- **Volume slider in music player** — an `<input type="range">` slider appears to the right of the mute button in the player controls row. The filled-track gradient updates in real time while dragging (`@input`) and sends `media_player.volume_set` to HA on release (`@change`). Becomes semi-transparent when the player is muted. Thumb and track follow the accent color.

- **Auto-theme to `music` when selecting a `media_player` entity** — in the visual editor, picking a `media_player.*` entity automatically sets the theme to `music`, the state condition to `playing`, and enables `show_player_controls`. Switching back to a non-media-player entity reverts the theme to `emergency`.

- **Auto-theme for `timer.*` filter mode** — in filter/multi-entity mode, typing a `timer.*` pattern in the entity filter field now automatically switches the theme to `countdown` (the same auto-theme logic that already worked for single-entity mode). Implemented via a new `_alertFilterChanged` editor method that mirrors `_alertEntityChanged`. Switching back to a non-timer filter reverts to `emergency`.

- **Spanish language support (`es`)** — all card runtime strings, weather condition labels, editor UI labels, TTS prefix messages, and per-theme default messages are now available in Spanish. The language is detected automatically from the HA `language` setting.

### Fixed

- **Music player accent color not applied to card border and animations** — the base `.at-music` CSS rules for border, `muGlow` box-shadow, `muPulse` drop-shadow, and `.mu-badge` text color used hardcoded `rgba(224,64,251,…)` values instead of `var(--mu-accent)`. Since `.at-music--player` inherits from `.at-music`, these elements remained purple regardless of the chosen accent color. All hardcoded values replaced with `var(--mu-accent, #e040fb)` and `color-mix()`.

- **`split` weather style missing from editor when `weather_forecast` mode is selected** — the style picker hid the "Split" option when `clear_display_mode` was `weather_forecast`, but the style works correctly in that mode (the split layout shows weather + clock on the first panel, then alternates with the 7-day forecast). The exclusion condition has been removed so `split` is selectable in all weather modes.

---

## [1.2.5] - 2026-04-24

### Added

- **`label_filter` and `area_filter` — HA label and area filtering** ([#92](https://github.com/djdevil/AlertTicker-Card/issues/92)) — two new optional filter fields for `entity_filter`-style alerts. `label_filter` matches entities that carry a specific HA label (uses entity registry); `area_filter` matches entities assigned to a specific HA area (checks entity area first, then device area as fallback). Both accept a single value or an array (OR logic within the filter, AND logic between filters). Fully configurable in the visual editor via native `ha-selector` pickers with 9-language translations.
  ```yaml
  alerts:
    - device_class: battery
      label_filter: controller        # only "controller"-labelled devices
      area_filter: [living_room, kitchen]  # in any of these areas
      operator: "<"
      state: "20"
      message: "{name} battery low ({state}%)"
  ```

- **`trigger_delay` — state duration before alert activates** ([#88](https://github.com/djdevil/AlertTicker-Card/issues/88)) — new per-alert option that works like HA automation's `for:` field: the alert only becomes visible if its condition has been continuously true for at least N seconds. If the condition goes false before the delay elapses the timer is cancelled and the alert never fires. Fully configurable in the visual editor (timing section) with translated help text in all 9 languages.
  ```yaml
  alerts:
    - entity: binary_sensor.door
      operator: "="
      state: "on"
      trigger_delay: 300   # only alert if door has been open for 5+ minutes
  ```

- **New theme: `light`** — warm incandescent bulb glow for smart home light entity alerts. Features a conical light beam expanding from the icon, a pulsing warm-yellow drop-shadow flare on the bulb (🔆), and a gently breathing box-shadow on the card. Category `info`, compatible with `ha_theme`. Translated default message in all 10 supported languages.

- **Portuguese (pt-BR) translation** ([#90](https://github.com/djdevil/AlertTicker-Card/issues/90)) — full Brazilian Portuguese translation contributed by [@Bsector](https://github.com/Bsector). All runtime strings (card labels, snooze, history, weather states, timer, test mode), all visual editor labels and help texts, all 46 theme default messages, and the theme category group names are now available in Portuguese. Activated automatically when HA's language is set to `pt-BR` or `pt`.

### Fixed

- **Theme card backgrounds and borders not rendering** — all themed alert cards (`alarm`, `emergency`, `fire`, `lightning`, `neon`, and all others) were rendered as `<ha-card>` custom elements. The `ha-card` shadow DOM applies its own `background` from inside, overriding any CSS background, border or box-shadow applied from outside the shadow boundary. This made every theme card display with the HA default card background, with no custom background color, border, or glow effects. Fixed by rendering all theme cards as `<div>` elements instead, so CSS applies directly without shadow DOM interference. All vertical mode and large-buttons CSS selectors updated accordingly.

- **Overlay banner: `secondary_text` Jinja2 templates now fully resolved** — `secondary_text` containing `{{ }}` expressions was still using synchronous `_evalTemplate` with `…` fallback for complex patterns. It now uses the same async WebSocket `render_template` engine as the main message. Both message and secondary text are resolved in parallel via `Promise.all` before the banner is shown. ([#70](https://github.com/djdevil/AlertTicker-Card/issues/70))

- **Overlay keeps firing after an alert is deleted from config** — the overlay watcher tracks active alerts by array index. When an alert was removed the remaining alerts shifted positions, causing the watcher's stale index set to miss them and re-fire already-notified alerts on the next tick. `register()` now detects when the alerts array has structurally changed and resets the watcher state (forcing a clean re-baseline with no spurious banners).

- **`trigger_delay` respected by overlay watcher** — the overlay evaluation is independent of the card instance when the card is not mounted, so it was firing the banner immediately regardless of `trigger_delay`. The overlay now maintains its own `_ovDelayTimers` / `_ovDelayActive` state and applies the same delay logic as the card.

- **Chromecast / cast environment: card fails with "Configuration error"** ([#89](https://github.com/djdevil/AlertTicker-Card/issues/89)) — on cast the script resolves `LitElement` from already-registered HA elements (`ha-panel-lovelace`, `hui-view`). In the cast browser these may not yet be registered when the card script executes, causing `Object.getPrototypeOf(undefined)` to throw and the entire script to fail silently. Added `ha-card` as a third fallback — a core HA element that is reliably available even in the cast environment.

- **`conditions_logic: or` now correctly includes the primary condition in the OR pool** ([#87](https://github.com/djdevil/AlertTicker-Card/issues/87)) — previously the primary operator/state acted as a mandatory gate even when `conditions_logic: or` was set, so `(primary AND (cond1 OR cond2))` was evaluated instead of `(primary OR cond1 OR cond2)`. Both `_evalAlert` (overlay) and `_computeActiveAlerts` fixed.

- **History log now scoped per card instance** ([#86](https://github.com/djdevil/AlertTicker-Card/issues/86)) — the history was stored under a single shared `localStorage` key (`atc-history`), so when multiple card instances were on the same page the last one to initialize would overwrite every other card's log. Each instance now gets its own key derived from its sorted entity IDs (e.g. `atc-history-sensor.battery|sensor.ink`), keeping histories completely independent.

- **Split weather style divider line removed** — the vertical separator between the weather and clock panels in the `split` clear widget style has been removed for a cleaner look.

- **Clear widget rounded corners and card-mod compatibility** ([#84](https://github.com/djdevil/AlertTicker-Card/issues/84)) — the card was hardcoding `--ha-card-border-radius: 10px` which prevented the HA theme value and card-mod overrides from applying. Removed the hardcoded value. All inner containers (`atc-card-root`, `atc-inner-clip`) now use `var(--ha-card-border-radius, 12px)` directly so the correct value flows through the shadow DOM. Added `:host { overflow: hidden; border-radius: var(--ha-card-border-radius, 12px) }` so content clips correctly to the rounded corners at the host level, matching the behavior expected by card-mod and HA's native "Show card border" option.

---

## [1.2.4] - 2026-04-23

### Fixed

- **Jinja2 templates shown raw in alert history** — when an alert with `{{ }}` templates first became active, the history entry was written before the WebSocket template result arrived, storing the raw template string (e.g. `{% set elev = ... %}`). The entry is now created immediately with a best-effort fallback, then patched with the fully resolved text once HA's `render_template` responds (~50–150 ms). The history panel and localStorage are updated automatically.

---

## [1.2.3] - 2026-04-23

### Fixed

- **Full Jinja2 support in overlay banner** — the overlay watcher now resolves any Jinja2 template expression via HA's WebSocket `render_template` API. Simple patterns (`{{ state_attr(...) }}`, `{{ states(...) }}`) are evaluated synchronously from `hass.states` with no delay; complex expressions (filters, math, `now()`, `{% if %}` blocks, etc.) are sent to the HA template engine and resolved before the banner is shown. Fallback to plain text on timeout (3 s) or error. Previously all `{{ }}` expressions were unconditionally replaced with `…`.

- **Snooze menu clipped by card boundary** — removed `overflow: hidden` from `.atc-card-root` (added in 1.2.2 to fix cinematic overflow). The clip is now applied via `atc-inner-clip` (already `overflow: hidden; position: relative`) which wraps the clear widget in every render path. The snooze dropdown can now extend beyond the card edge as intended.

- **Cinematic clear widget potentially overflowing** — clear widget render path now wraps the widget in `atc-inner-clip`, consistent with alert render paths. `overflow: visible` override on `.atc-cw-style--cinematic` removed; clipping is handled at the `atc-inner-clip` level.

---

## [1.2.2] - 2026-04-22

### Added


- **Text-to-Speech (TTS) announcements** — new per-alert `tts: true` toggle makes HA read the alert message aloud when it becomes active. Global default speaker (`tts_entity`, `media_player` domain) and TTS engine (`tts_engine`, auto-detected if not set) are configurable in the General tab. For Alexa, Google Home via notify, or mobile push: set `tts_notify_service` to any `notify.*` service (populated via a dropdown from all available notify services). Per-alert overrides for speaker, engine, notify service, and a custom `tts_message` are available in each alert's configuration panel. A global master toggle (`tts_enabled`) in the General tab disables all TTS at once without losing individual alert settings. When no `tts_message` is set, the card generates a natural-language sentence from a built-in dictionary (9 languages) based on the alert's theme category — e.g. "Allarme critico: Sensore fumo cucina" for a `critical` theme alert in Italian. 


- **Date show/hide + position for clear widget** — new `clear_clock_show_date` toggle to enable or disable the date display in clock and weather+clock modes. When enabled, `clear_clock_date_position` allows choosing whether the date appears `above` or `below` the time. Configurable in the editor (All Clear tab). All 8 languages translated. ([#73](https://github.com/djdevil/AlertTicker-Card/issues/73))

- **Card visible in dashboard edit mode** — when Home Assistant UI is in edit mode, the card now stays visible (placeholder shown) even if no alerts are active and "show when clear" is off. Consistent with the existing `card_border` behaviour. ([#71](https://github.com/djdevil/AlertTicker-Card/issues/71))

- **Invisible touch zone for mobile** — replaces the previous first-tap interception model. A 22%-wide invisible zone on the right side of the card (min 56 px) toggles the action buttons (snooze / history / nav arrows) on tap and auto-dismisses after 4 seconds. Never interferes with `tap_action`, `hold_action`, or `double_tap_action`. ([#70](https://github.com/djdevil/AlertTicker-Card/issues/70))

- **6 new visual themes for the clear widget:**
  - *Clock-only* — `aurora` (animated northern-lights background, green glow), `gold` (warm golden hue, thin weight digits), `matrix` (black background, monospace green digits with scanline glow)
  - *Weather badge layout* — `stage` (large centered clock on top; weather compacted into a single horizontal frosted pill below), `split` (card divided into two equal full-height panels — left: weather icon + temperature, right: clock), `cinematic` (animated weather background fills the entire card; all info condensed into a transparent caption bar pinned to the bottom)
  - Selectable in the editor (All Clear tab) via dedicated *Clock style* and *Weather badge style* selects; clock style is shown only for clock-only mode. All 8 languages translated.

- **Czech (CS) language support** — full translation of all card labels, editor UI strings, theme default messages, operator names, overlay notification strings, and weather conditions into Czech, contributed by [@feixm1](https://github.com/feixm1). ([#74](https://github.com/djdevil/AlertTicker-Card/pull/74))

- **Weather/time as slide in alert cycle** — new `show_widget_in_cycle` option inserts the configured clear widget (clock / weather / weather+clock) as an extra slide in the alert rotation, using the same fold/slide/fade animation as alerts. The toggle appears in the editor (Cycling & Animation section) only when `clear_display_mode` is already configured. All 8 languages translated. ([#73](https://github.com/djdevil/AlertTicker-Card/issues/73) comment by @No-DNS)

- **`device_class` filter for alerts** — new `device_class` field auto-discovers all entities with a given HA device class (e.g. `smoke`, `battery`, `motion`) and creates one individual alert per matched entity. Includes the same include/exclude panel as `entity_filter`. Mutually exclusive with `entity_filter`. All 9 languages translated. ([#80](https://github.com/djdevil/AlertTicker-Card/issues/80))

- **Jinja2 templates in `state` field** — the `state` comparison value now supports `{{ }}` HA templates (e.g. `{{ states('input_number.global_threshold') }}`), allowing thresholds to be driven by helper entities. Uses the same dual-engine as the `message` field. All 9 languages updated in editor hint. ([#78](https://github.com/djdevil/AlertTicker-Card/issues/78))

- **Overlay banner scale** — new `overlay_scale` option (`1`, `1.5`, `2`, `3`) enlarges the overlay banner's text, icon and spacing proportionally for better visibility from a distance. Max-width grows with the scale while staying within the viewport. Selectable in the editor (Overlay section). All 9 languages translated. ([#81](https://github.com/djdevil/AlertTicker-Card/issues/81))

- **Custom icon namespace support** — any icon namespace is now accepted (e.g. `hue:ceiling-adore-flush`, `phu:`, `cil:`), not just `mdi:` and `hass:`. The check is now a generic regex `/^[\w-]+:/` that passes any `namespace:icon-name` string to `<ha-icon>`, which handles all icon sets registered via `extra_module_url`. ([#82](https://github.com/djdevil/AlertTicker-Card/issues/82))



- **⭐ GitHub star prompt in editor footer** — a styled button now appears in the editor footer inviting users to star the repository on GitHub. Translated in all 9 languages.

- **Camera snapshot in overlay banner** — new per-alert `camera_entity` field attaches a live snapshot from any HA camera to the overlay toast. When set, the toast restructures into a column layout: the icon/badge/message row stays at the top, and the camera image is displayed below it. The image height scales proportionally with `overlay_scale` so it is never cropped when the banner is enlarged.

### Fixed

- **Overlay banner blocked on cross-view navigation** — `if (reg.disconnected) continue` in `_ATC_OVERLAY._tick()` prevented the overlay from firing when the user was on a view other than the one containing the card. Guard removed; the `disconnected` flag is still used exclusively for `register()` deduplication/cleanup.

- **Overlay showing raw Jinja2 template code** — `{% if %}` / `{% for %}` control blocks were not stripped from the message, only `{{ }}` expressions. Added regex stripping for both patterns; when the resolved message is empty after stripping the card falls back to `badge_label`, the entity's `friendly_name`, or the entity ID. ([#70](https://github.com/djdevil/AlertTicker-Card/issues/70))

- **Editor fields not updating after YAML paste** — icon, badge_label, and tap_action fields retained stale values when the configuration was changed externally (e.g. by pasting raw YAML). Root cause: MWC components (`ha-textfield`, `ha-service-control`) ignore `.value` property updates after first render. Fixed by closing and reopening the alert panel via `updateComplete.then()` whenever the underlying alert object changes from outside the editor.

- **Alert icon rendered as text in editor list** — when an alert had an `mdi:` icon, the editor list showed the raw string (e.g. `mdi:floor-lamp`) instead of the icon glyph. Removed an erroneous `use_ha_icon &&` guard; all `mdi:` / `hass:` icons are now always rendered as `<ha-icon>`.

- **Date and time side-by-side in weather+clock mode** — date and time appeared horizontally instead of stacking vertically. Added `flex-direction: column` to `.atc-cw-badge--clock`.

- **Clock style selector visible in weather+clock mode** — the style select was inside the shared `clock || weather_clock` conditional block. Moved into its own `=== 'clock'` block so it only appears when clock-only mode is selected.

- **`{entity}` / `{state}` placeholders not resolved inside HA templates** — when `message` contained both `{entity}` and `{{ }}` blocks (e.g. `{{ area_name('{entity}') }}`), plain placeholders were substituted *after* the template was sent to HA's engine, so HA received the literal string `{entity}` instead of the real entity ID. Placeholders are now resolved before the WebSocket subscription is created. ([#76](https://github.com/djdevil/AlertTicker-Card/issues/76))

- **`entity_filter` wildcard not anchored** — patterns like `sensor.*battery` matched entities containing "battery" *anywhere* (e.g. `sensor.device_battery_type`) because the generated regex was unanchored. Regex is now wrapped in `^…$` so the pattern must match the full entity ID, consistent with standard glob behaviour. ([#77](https://github.com/djdevil/AlertTicker-Card/issues/77))

- **`on_change` alerts ignoring `conditions`** — when `on_change: true` was set together with a `conditions` block, the conditions were never evaluated: the alert fired on every state change regardless of the condition result. Conditions are now evaluated inside the `on_change` branch (respecting `conditions_logic: and/or`) before the alert is shown. ([#83](https://github.com/djdevil/AlertTicker-Card/issues/83))

- **Cinematic weather theme layout** — clock/date now pinned top-left, weather conditions bottom-left, wind row re-enabled. Content no longer overflows outside the card boundary (`overflow: hidden` moved to `.atc-card-root`).

---

## [1.2.1] - 2026-04-21

### Fixed

- **Overlay watcher stopped on view navigation** — when navigating away from the view containing the card, both cards received `disconnectedCallback()` causing the watcher interval to be cleared. Overlay banners would never fire on any other view. Root cause was introduced in v1.2.0 by a misguided optimization; reverted. The watcher now stays alive for the page session once started.
- **Overlay continued firing after card deletion** — `_tick` was not checking `reg.disconnected`, so deleted cards kept triggering banners. Added `if (reg.disconnected) continue` guard.
- **History panel right side clipped in `large_buttons` mode** — `padding-right: 88px` was applied to all `ha-card` elements including the history panel. Fixed with `:not(.atc-history-card)` selector.
- **Large buttons flickering during fold animation** — buttons stayed visible while card content animated, appearing to float. Buttons now fneade out during animation via `atc-animating` host class and reappear when animation completes.
- **Right nav arrow (▶) overlapping snooze button in `large_buttons` mode** — arrow pushed to `right: 84px` to clear both circular buttons.
- **Nav arrow and counter mispositioned in `vertical` + `large_buttons` mode** — arrow reverts to `right: 3px` (large buttons are top-right, not center-right); counter moves to bottom-right.

---

## [1.2.0] - 2026-04-19

### Added

- **Global overlay / toast notification** — new `overlay_mode` option that shows a floating banner **anywhere on the dashboard** when a new alert triggers, regardless of which view or tab is currently open. A smart visibility check suppresses the banner when the card itself is already visible on screen (no redundant notification). A lightweight independent watcher (`setInterval` 2 s) reads entity states directly from the always-present `<home-assistant>` element, so the overlay fires even when the card's view is not mounted. Dedup mechanism prevents double-firing on both same-view and cross-view paths. Configurable via the visual editor: position (`top` / `center` / `bottom`), auto-dismiss duration in seconds (0 = manual close only). All 7 languages translated. Falls back silently if anything fails.

- **Overlay banner center position** — new `center` option for `overlay_position` displays the banner in the middle of the screen with a pop-in scale animation instead of the slide-from-top used by the `top` position.

- **Dedicated Overlay tab in editor** — overlay notification settings moved from the General tab into their own **🔔 Overlay** tab between General and Alerts, with an "ON" badge on the tab when active, for faster discovery and cleaner layout.
- **`card_border` toggle** — simple on/off switch that shows the standard Home Assistant border (`--ha-card-border-width` / `--ha-card-border-color`) around the card at all times, solving the discoverability problem of the hover-only edit border. Default: off. Configurable via the editor under 🖼️ Layout & Appearance. ([#56](https://github.com/djdevil/AlertTicker-Card/issues/56))

- **Placeholder frame when no alerts are active** — when `card_border` is enabled and no alerts are active (and "Show when clear" is off), the card now renders a subtle dashed-border placeholder with a 🔔 icon and "AlertTicker Card" label instead of being completely invisible. Makes the card discoverable and editable for new users who have just added it. Without `card_border`, the original collapse-the-grid-slot behaviour (issue [#50](https://github.com/djdevil/AlertTicker-Card/issues/50)) is preserved. ([#56](https://github.com/djdevil/AlertTicker-Card/issues/56))

- **Animated `door` and `window` themes** — the `door` theme now renders an animated `mdi:door-open` icon that pivots on its hinge (CSS `perspective rotateY`) to simulate a door swinging open and closed. New `window` theme added with `mdi:window-open-variant` and a top-pivot swing animation (`rotateX`). Both run automatically when the theme is selected — no `use_ha_icon` setting needed. Custom icons and `icon_color` still fully supported. ([#59](https://github.com/djdevil/AlertTicker-Card/issues/59))

- **Per-alert `visible_to` filter** — each alert can now be restricted to specific HA users without needing separate cards or conditional visibility wrappers. Accepts `admin` (admins only), `non_admin` (non-admin users only), a single user display-name string, or a list of names. Omit the field (or leave it empty) to show the alert to everyone. Works for both the card display and the overlay banner. Fully configurable in the editor under a dedicated 👤 User Visibility section per alert. ([#58](https://github.com/djdevil/AlertTicker-Card/issues/58))

- **Manual alert navigation (◀ ▶ buttons + swipe)** — when 2 or more alerts are active, `◀` and `▶` buttons appear on the left/right edges of the card on hover (and on first touch on mobile). Clicking them immediately jumps to the previous/next alert and resets the auto-cycle timer so it counts from zero. On mobile, left/right swipe also navigates (swipe left = next, swipe right = prev). If `swipe_to_snooze: true` is enabled, left swipe keeps its existing snooze behaviour and only right swipe navigates. The swipe gesture is now always registered regardless of `swipe_to_snooze`. ([#65](https://github.com/djdevil/AlertTicker-Card/issues/65))

- **Per-alert `time_range` filter** — each alert can now be restricted to a specific time window using `from` and `to` fields (format `HH:MM`). Supports midnight crossing (e.g. `22:00`–`06:00`). When both fields are empty the alert is always active. The card re-evaluates the condition automatically at each minute boundary so alerts appear and disappear on time without any entity state change. Configurable via the editor under a dedicated 🕐 section per alert. All 8 languages translated. ([#61](https://github.com/djdevil/AlertTicker-Card/issues/61))

- **Per-alert `name` label** — optional `name` field on each alert that replaces the generic "Alert N: entity" header in the editor panel with a descriptive custom name (e.g. "Motion sensors floor 1"). The entity ID is shown as a subtitle when a name is set. Purely an editor UI label — does not affect the card display. Configurable as the first field in the alert panel. All 8 languages translated. ([#64](https://github.com/djdevil/AlertTicker-Card/issues/64))

- **Auto-icon from HA entity** — when no `icon` is set on an alert, the card now automatically uses the entity's icon from Home Assistant (entity registry override or `attributes.icon`). Any `mdi:` / `hass:` icon is rendered as a native `<ha-icon>` element and respects `icon_color`. Particularly useful with `entity_filter` alerts (e.g. multiple trash sensors) where each entity already has a distinct icon in HA — no manual `icon` field needed per alert. Falls back to the theme emoji or 🔔 if the entity has no icon. ([#62](https://github.com/djdevil/AlertTicker-Card/issues/62))

- **Danish (DA) language support** — full translation of all card labels, editor UI strings, theme default messages, operator names, and overlay notification strings into Danish, contributed by [@kgn3400](https://github.com/kgn3400). ([#57](https://github.com/djdevil/AlertTicker-Card/pull/57))

- **Clear widget — animated weather & clock display** — when `show_when_clear` is enabled, a new `clear_display_mode` option replaces the static all-clear message with a live display. Modes: `message` (default, unchanged), `clock` (digital clock updated every second), `weather` (animated weather background + condition + temperature + wind speed + humidity), `weather_clock` (weather + clock together). Weather backgrounds include full particle animations for sun, stars/moon/aurora, clouds, fog, wind, rain, snow, hail, lightning, and exceptional. Content is shown in frosted-glass corner badges (weather info top-left, clock top-right) so the animated sky stays fully visible. Configure the weather entity via a `ha-entity-picker` filtered to `weather.*` in the editor. Placeholder shown if no entity is selected. All 8 languages translated. ([#63](https://github.com/djdevil/AlertTicker-Card/issues/63))

- **Editor hub redesign** — the hub (main menu) is completely redesigned: an Alerts tile spans the full width at the top; a welcome/description text appears between the header and tiles; each tile shows a short description label in 8 languages; a new 🖼️ Layout & Appearance tile is extracted from the General tile (ha_theme, vertical, text_align, large_buttons, card_height, card_border) so the two concerns are cleanly separated; the hub shows a header with the card title + version badge and a footer with author credit, a Buy-Me-a-Coffee badge, and a GitHub issues link.

### Fixed

- **Snooze menu closes on tap outside** — previously the snooze duration menu could only be dismissed by tapping the 💤 button again, which was awkward especially on mobile. Now a `pointerdown` listener is registered on `document` (capture phase) when the menu opens and uses `composedPath()` to detect taps outside the menu wrapper across the shadow DOM boundary — closing the menu immediately on any outside interaction. The listener self-removes on close and is also cleaned up in `disconnectedCallback` to prevent memory leaks.

- **Tap/hold/double-tap actions blocked on first touch on mobile** — on touch devices the snooze and history buttons are hidden until the card is hovered (CSS `:hover`), but mobile browsers simulate hover on the first tap. This caused the first tap that revealed the buttons to simultaneously fire `tap_action` or start the hold timer. Fixed with a two-step touch model: the first touch on a card that has actions activates a `atc-touch-active` state (revealing buttons) without firing any action; subsequent touches behave normally. The active state auto-resets after 3 seconds of inactivity.

- **`tap_action: toggle` silently did nothing** — `_handleAction` was missing the `toggle` case entirely. Added `homeassistant.toggle` service call with entity resolution from `cfg.entity` falling back to the current alert's entity.

- **`setPointerCapture` on shadow host broke `pointerup` handler** — `this.setPointerCapture(e.pointerId)` captured pointer events to the custom element host, so subsequent `pointerup` events were dispatched to the host rather than the inner div where `_onPointerUp` was registered. Changed to `e.currentTarget.setPointerCapture(e.pointerId)` to capture on the actual listener element.

- **`more-info` action ignored `entity` field** — `_handleAction` for `more-info` only checked `cfg.entity_id`, but the standard YAML key is `entity`. Now checks `cfg.entity` first, then `cfg.entity_id`, then falls back to the current alert's entity.

- **Snooze menu clipped by card container** — the snooze duration menu was cut off or hidden behind adjacent dashboard cards. Root cause: `overflow: hidden` on the outermost card wrapper also clipped absolutely-positioned overlays (snooze menu, history button). Fixed by introducing an inner `.atc-inner-clip` wrapper that clips only the content area, leaving the snooze menu free to extend beyond the card's visual boundary. ([#60](https://github.com/djdevil/AlertTicker-Card/issues/60))

- **Tap bleed-through on `navigate` actions** — using `double_tap_action` or `hold_action` with `action: navigate` could inadvertently trigger an element on the newly loaded view at the same screen coordinates (ghost click). Fixed by: (1) calling `setPointerCapture()` in `pointerdown` to anchor the pointer event stream to the card element; (2) calling `preventDefault()` on `pointerup` to suppress the browser's synthetic `click` event; (3) temporarily disabling pointer events on the document for 350 ms after a hold-navigate fires, covering the window between the hold firing and the user lifting their finger. ([#45](https://github.com/djdevil/AlertTicker-Card/issues/45))

- **Inconsistent card height across themes** — different themes (fire, rain, confetti, door, etc.) rendered at slightly different heights due to varying internal padding and icon sizes. All themes now share a common `min-height: 68 px` on the `ha-card` wrapper, ensuring a uniform baseline height across every theme. Cards with `card_height` set are unaffected (explicit height takes precedence).

---

## [1.1.22] - 2026-04-19

### Added

- **Russian (RU) language support** — full translation of all card labels and editor UI strings into Russian, contributed by community member [@edwardtich1](https://github.com/edwardtich1). Covers all themes, operators, action types, snooze, history, and every editor field including `{device}`, `card_height`, `contains`/`not_contains`, and `double_tap_action`. ([#53](https://github.com/djdevil/AlertTicker-Card/issues/53))

---

## [1.1.21] - 2026-04-18

### Added

- **`card_height` config option** — sets a fixed height (in px) on the card, preventing layout shifts when cycling between alerts of different sizes or text lengths. Content is vertically centered and clipped symmetrically if it exceeds the set height. Leave unset for automatic height. Configurable via the editor under 🖼️ Layout & Appearance. ([#52](https://github.com/djdevil/AlertTicker-Card/issues/52))

### Fixed

- **Alert sound silent on iOS / iPad HA companion app** — iOS Safari suspends `AudioContext` until a user gesture. Added `ctx.resume()` before tone generation, which unlocks the context when it was previously warmed by any prior interaction (e.g. a tap on the dashboard). Note: on a completely fresh page load with zero interaction, iOS will still block audio — this is an OS-level restriction. ([#51](https://github.com/djdevil/AlertTicker-Card/issues/51))

---

## [1.1.20] - 2026-04-18

### Added

- **`{device}` message placeholder** — resolves the HA device name for the alert's entity directly from the device registry (`hass.devices`), with no WebSocket template subscription required. Eliminates flickering when using `device_name()` Jinja2 templates across many entities. Use `{device}` alongside `{name}`, `{state}`, and `{entity}` in the message field. ([#47](https://github.com/djdevil/AlertTicker-Card/issues/47))

---

## [1.1.19] - 2026-04-18

### Fixed

- **Empty space in sections/grid dashboard when card is hidden** — previous attempts (`display: none` on element and parent) were not enough for HA's CSS grid sections layout. Now uses `toggleAttribute("hidden")` on the host element, which `hui-card` observes to collapse the grid slot entirely — the same technique used by HA's own conditional-card fix (frontend PR #20117). `display: none` is kept as a fallback for older HA versions. ([#50](https://github.com/djdevil/AlertTicker-Card/issues/50))

---

## [1.1.18] - 2026-04-18

### Added

- **`contains` / `not_contains` operators** — substring matching for state and attribute values (case-insensitive). Available on both the main alert condition and additional conditions. Useful for filtering out placeholder values like "none", "unavailable", or ad markers. ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))

### Fixed

- **Residual gap in masonry/grid layout when card is hidden** — hiding only the custom element itself was not enough; the HA card wrapper (`hui-card`) still held its grid slot. Now both the element and its parent wrapper are set to `display: none`, fully removing the card from the layout with no gap. ([#50](https://github.com/djdevil/AlertTicker-Card/issues/50))

---

## [1.1.17] - 2026-04-18

### Fixed

- **Empty space when card is hidden** — when there are no active alerts and `show_when_clear` is off, the card now sets `display: none` on the host element so it takes up zero space in the dashboard layout. Previously the card returned an empty template but still occupied a small amount of vertical space, pushing other cards downward. ([#50](https://github.com/djdevil/AlertTicker-Card/issues/50))

---

## [1.1.16] - 2026-04-18

### Added

- **`double_tap_action`** — double-tap gesture on any alert card fires a separate action (navigate, call-service, more-info, url). When a `double_tap_action` is configured, a single tap waits 300 ms before firing to distinguish the two gestures. Configurable in the visual editor alongside tap/hold actions. ([#45](https://github.com/djdevil/AlertTicker-Card/issues/45))
- **`clear_double_tap_action`** — same double-tap support for the "all clear" card. Appears in the editor under the ✅ All clear card section. ([#45](https://github.com/djdevil/AlertTicker-Card/issues/45))

---

## [1.1.15] - 2026-04-18

### Added

- **`clear_badge_label` config option** — customize the badge text on the "all clear" card (default: "Resolved"). Configurable via editor under the clear message/theme fields. ([#46](https://github.com/djdevil/AlertTicker-Card/issues/46))
- **`clear_tap_action` / `clear_hold_action`** — tap and hold actions for the "all clear" card. Supports navigate, call-service, more-info, url. Configurable via editor. ([#45](https://github.com/djdevil/AlertTicker-Card/issues/45))
- **`on_change` monitors attribute changes** — when `attribute` is set on an alert with `on_change: true`, the trigger fires on attribute value changes instead of entity state changes. Useful for detecting track changes on media players. ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))

### Improved

- **General settings tab reorganized** — settings are now grouped into labeled sections with emoji headers: ✅ All clear card (moved to top), 🖼️ Layout & Appearance, 🔄 Cycling & Animation, 💤 Snooze, 📋 History. The "all clear" section with its subfields now appears at the very top for easier discovery. ([#41](https://github.com/djdevil/AlertTicker-Card/issues/41))
- **`on_change` label clarified** — editor label now reads "Trigger on ANY state change (ignores conditions)" to make it clear conditions are bypassed when this is enabled.
- **Conditions hidden when `on_change` active** — the operator/state condition fields are hidden while `on_change` is enabled, avoiding confusion since they have no effect in that mode. ([#41](https://github.com/djdevil/AlertTicker-Card/issues/41))

---

## [1.1.14] - 2026-04-17

### Fixed

- **Test mode preview not switching to the selected alert** — the alert match used object reference (`===`) which always failed because expanded alerts are spread copies. Fixed by matching on `_configIdx` instead. ([#43](https://github.com/djdevil/AlertTicker-Card/issues/43))
- **Alert counter ("2/3") invisible in HA theme light mode** — counter had hardcoded white color. Now uses `var(--secondary-text-color)` when `ha_theme` is active. ([#44](https://github.com/djdevil/AlertTicker-Card/issues/44))
- **`on_change` now detects attribute changes** — when `attribute` is set on an alert with `on_change: true`, the trigger fires when that attribute value changes (not just the entity state). Enables use cases like "notify when track title changes on a media player". ([#39](https://github.com/djdevil/AlertTicker-Card/issues/39))

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
