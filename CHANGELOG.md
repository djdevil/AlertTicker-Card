# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.12] - 2026-05-01

### Added
- ⏱️ **Travel time in hours:minutes format** — Travel time is now displayed as `Xh Ym` when ≥ 60 minutes (e.g. `3h 27m` instead of `207 min`). Sensors that return a numeric value in minutes continue to work unchanged. Sensors that return an `h:mm` or `HH:MM:SS` string (template sensors) are now parsed correctly — previously `parseFloat("3:27")` silently truncated to `3 min`. All 11 layouts updated. Modern ring shows `3h` / `27m` split across value and unit lines.
- 📏 **`modern_distance_max`** — New config option (default: `100`) that sets the maximum distance for the Modern layout distance progress ring, analogous to `modern_travel_max_time`. Configurable from the visual editor under **Layout → Modern Options** ("Max distance (km)"). The color thresholds (green → orange → red) scale proportionally with this value.

### Fixed
- 🐛 **Classic layout — chips overflow on narrow cards** — Absolutely positioned chips (distance, battery, travel, etc.) could extend beyond the card edge on narrow columns. Added `overflow: hidden` to the card content container so all chips are always clipped within card bounds. Use `distance_position: top-right` (or via the editor) to anchor the distance chip to the right edge.
- 🐛 **Modern layout — rings overflow on narrow cards** — When many rings were visible (battery + watch + device2 + distance + travel) on a narrow card, the rings row could extend beyond the right edge. Rings now wrap to a second row instead of overflowing.
- 🐛 **Modern layout — `modern_width` option had no effect** — The `modern_width` config option was defined in the editor but was never applied to the card. Now sets `max-width` on the card when configured.

---

## [1.4.11] - 2026-04-09

### Fixed
- 🐛 **Charging indicator missing in WxStation** — Battery, watch battery, and second device gauges now show a green charging icon and turn green when charging. Battery icon switches to `mdi:battery-charging` with a `⚡` badge overlay.
- 🐛 **Charging indicator missing in Holo** — Battery, watch battery, and device 2 metrics now turn green and show `⚡` when charging.
- 🐛 **Charging indicator missing in Matrix** — Battery stat blocks (BATTERY / WATCH / DEV.2) now turn green with `⚡` in the label and the progress bar fills green when charging.
- 🐛 **Charging indicator missing in Orbital** — Coin back-face battery rows now turn green and show `⚡` when charging.
- 🐛 **Charging indicator broken in Ink** — `_watchCharging` typo fixed to `_watchBatteryCharging` (watch charging indicator was never showing); device 2 chip now also shows `⚡` when charging.

### Added
- 📶 **`wifi_ssid_sensor`** — Shows the actual Wi-Fi SSID name instead of "WiFi" across all 11 layouts (see v1.4.10 notes). Configurable from the visual editor.
- 📡 **Classic & Neon connection chip now shows text** — Icon + connection type label side by side (was icon-only). WiFi = green, mobile = orange.

### Fixed (also in this release)
- 🐛 **Extra chips invisible when weather background is active** (classic layout) — `.extra-chips-row` now has `position:relative; z-index:1`.

---

## [1.4.10] - 2026-04-04

### Added
- 🧩 **`extra_chips` config option** — Add any HA entity as a custom chip in all 11 layouts. Each chip supports: `entity` (required), `icon` (mdi:xxx, auto-detected if omitted), `show_when` (only display when entity state matches), `color` (icon+text color), `label` (custom text, defaults to translated entity state). Classic, Modern, Neon, Glass, Bio, Matrix, Orbital, Ink: chips appended to existing chip row. Compact: icon-only mini badges. WxStation, Holo, Orbital: dedicated section. Fully configurable from the visual editor (Sensors tab) with add/remove UI and tap_action.
- 🧩 **`extra_chips` — tap_action** — Each extra chip now supports a `tap_action` object: `more-info` (default), `call-service`, `navigate`, `url`, `none`. Configured from the visual editor with action-type dropdown and conditional fields per action.
- 🔧 **`ha-service-control` for `call-service`** — Both the extra chip tap action editor and the main card tap action editor now use HA's native `ha-service-control` component (full service picker, target entity selector, schema-based data fields, `.showAdvanced=true`). Value format: `{ action: 'domain.service', target: {…}, data: {…} }`.
- 📶 **`wifi_ssid_sensor`** — Optional sensor that reports the Wi-Fi network name the device is connected to (e.g. `sensor.phone_wi_fi_connection`). When set, the card displays the actual SSID instead of the generic "WiFi" label in all 11 layouts. When on mobile data the raw connection type is shown as before. Configurable from the visual editor (Sensors tab → Connection section). All 4 languages translated.

### Changed
- 🎨 **Chip color applies to icon + text** — `extra_chips[].color` now tints both the icon and the text label simultaneously (applied to the container via CSS inheritance, removing the per-icon inline style).
- 🖊️ **Editor — icon and label auto-populate**: removed auto-fill of label from entity friendly name; icon now auto-fills only from the real HA entity attribute (`ent.attributes.icon`) on first entity selection. Pattern-matching inference removed.
- 🎨 **Editor — color picker default**: shows a striped "no color" pattern when no color is configured, instead of a misleading blue default swatch.
- 📡 **Classic layout — connection chip now shows text label** — Previously only the icon was visible. Now shows icon + connection type text (or SSID when `wifi_ssid_sensor` is set), colored green for WiFi / orange for mobile.
- 📡 **Neon layout — connection badge now shows text label** — Previously only the icon was visible inside the neon badge. Now shows icon + text side by side with the neon accent color.

### Fixed
- 🐛 **Delete button (✕) not rendering** in extra chips editor — replaced `<ha-icon>` inside `<button>` (unreliable in HA editor context) with a plain Unicode ✕ character.
- 🐛 **`call-service` not executing** — `hass.callService` 4th `target` param is ignored in some HA versions; entity_id now always included in `serviceData` as compatibility fallback.
- 🐛 **Extra chips invisible when weather background active** (classic layout) — `.extra-chips-row` now has `position:relative; z-index:1` so it always renders above the weather background layer.




## [1.4.8] - 2026-03-31

### Added
- 🗂️ **`state_entity` config option** — Override the displayed location/state text with any HA sensor entity (e.g. `sensor.my_custom_location`). Internal home/away detection, zone logic, and travel sensors are unaffected — only the display text changes. Configurable from the editor (Sensors tab). Supported in all 11 layouts.

---

## [1.4.7] - 2026-03-25

### Added
- 🖋️ **Liquid Ink layout (`ink`)** — First light-mode theme. Pure white background with crisp shadows and elevated elements. Horizontal layout: avatar with state-colored accent ring (left) · name / zone / time / geocoded address (center) · battery pill panel with shadow (right). Accent gradient separator divides the info row from sensor chip pills. State accent colors: blue (home), violet (away), teal (other zones). Full support for geocoded address, maps provider click, weather (contrast overrides when weather background active), device 2 battery, pair travel animation, transparent background.

### Fixed
- 🐛 **Liquid Ink — separator flash**: `ink-sep` now uses `var(--ink-accent)` CSS variable instead of a per-render inline `background` style — eliminates DOM update flicker. Height `1.5px` → `2px`, `transition:none`, `transform:translateZ(0)` on `.ink-main` for GPU compositing layer.
- 🐛 **Liquid Ink — card background ignored by HA theme**: Added `--ha-card-background:#ffffff` so the HA theme's internal CSS variable is properly overridden alongside the `background` inline style.
- 🐛 **Liquid Ink — low readability on white card**: Chip background changed to `#f1f3f5` (was white-on-white). Text colors darkened: zone `#4b5563`, time/geo/weather `#6b7280`, chip text `#1f2937` weight 600. Photo accent ring and chip shadows strengthened.

---

## [1.4.6] - 2026-03-24

### Added
- 🗺 **Maps integration** — New `maps_provider` config option (`google` / `apple` / `osm`). When set, clicking the zone/state name or the geocoded address strip opens the person's current GPS location in the chosen map app (new tab). Uses `person.attributes.latitude/longitude`. Disabled by default (opt-in). Configurable from the editor via a dropdown in the Sensors tab (all 4 languages).
- 📍 **`show_geocoded_location` enabled by default** — New cards now show the geocoded address automatically without requiring manual activation.

### Fixed
- 🐛 **Maps dropdown showed empty on load** — Added `label`, `fixedMenuPosition`, `naturalMenuWidth` to `ha-select`; replaced `value=""` with `value="none"` sentinel to avoid `ha-select` empty-string matching issues.
- 🐛 **Maps dropdown selection not saving** — Changed event from `@selected` to `@request-selected` with `getAttribute('value')` pattern, matching the rest of the editor.
- 🐛 **Geocoded location switch showed OFF despite being enabled** — Changed check from `=== true` to `!== false` so that `undefined` (legacy cards without the key) is treated as ON.
- 🐛 **GPS coords always null** — Fixed `this._hass` typo → `this.hass` in `_updateSensorData()`, which caused `_gpsLat`/`_gpsLon` to always be `null` and the maps click handler to never attach.

---

## [1.4.5] - 2026-03-22

### Added
- 🪐 **Orbital layout** — A spectacular new layout centered around a 3D spinning photo coin (continuous Y-axis rotation revealing key stats on the back face). Three concentric orbital rings tilt in 3D at different angles and spin at different speeds. Three satellite badges orbit the photo (battery, connection, activity) and fade when passing "behind". Expanding pulse rings emanate from the photo center. A seeded star field fills the background with deterministic twinkling. Chips row centered below the sphere. State-based accent colour: teal (home), violet (away), blue (other zones). Full support for geocoded address, weather, pair animation, and `show_particles` toggle.

---

## [1.4.4] - 2026-03-21

### Added
- 📍 **Geocoded location** (issue #29) — Shows the human-readable GPS address from `sensor.xxx_geocoded_location` (Home Assistant Mobile App) in all 9 layouts when the person is not at home. Auto-detected from the mobile app device prefix; manual override via `geocoded_location_entity`. Clickable to open the sensor's more-info dialog. If the text overflows its container it scrolls with a smooth bounce marquee; otherwise it is static.
- 📍 **Compact layout**: address alternates with the zone state using a vertical slide animation (no extra space used).
- 📍 **Editor**: new toggle `show_geocoded_location` and entity picker in the Sensors tab, with description and auto-population from the detected device prefix.

### Fixed
- 🐛 **Neon / Glass / Bio pair chip misalignment** — Animated distance↔travel chips now follow the same stacking pattern as the Weather Station layout: `pair-a` stays in flow to define the container size; `pair-b` overlays with `position:absolute;inset:0` + `justify-content:center`. For Bio, position is applied inline to override the `position:relative` on `.bio-chip`.
- 🐛 **Weather-active text shadow missing on Glass, Bio, Holo** — Added `weather-active` class to the `ha-card` of these three layouts and added contrast CSS rules (text-shadow + frosted chip background) matching the Classic layout behaviour.
- 🐛 **Classic geocoded text missing shadow when weather background is active** — Added `.weather-active .geo-marquee-outer/inner` rule to match the shadow on name and last-changed.
- 🐛 **Wxstation double 📍 icon** — The static `📍` in `wx-location` is now hidden when geocoded location is active and the person is not home.
- 🐛 **Classic/Neon geocoded text not centred** — Applied `text-align:center` via style parameter; `geo-scrolling` class overrides to `left` only during animation.
- 🐛 **Glass geocoded text had leading space** — Removed spurious `padding-left:10px`.
- 🐛 **Classic layout default `picture_size`** — Changed from 45 → 40.

---

## [1.4.3] - 2026-03-20

### Added
- 🖥️ **Matrix Rain layout (`matrix`)** — Terminal/hacker-style theme with animated falling katakana and hex characters as background. Features a square avatar with CRT scanlines and an animated scan bar (color driven by state picker), monospace stats blocks with green phosphor progress bars (battery, watch, device 2, weather temp), activity and connection chips, animated travel/distance pair chips, and a `SYS::TRACKER` footer. The avatar border and scan bar color follow the configured state color.

### Fixed
- 🐛 **Matrix activity sensor not showing** — Was reading `this._activityType` (non-existent). Corrected to `this._activity` and `this._activityIcon`, matching all other layouts.
- 🐛 **Matrix state color picker had no effect** — `accentColor` was not read from `stateConfig`. Now applied exclusively to the avatar box border, glow and scan bar — the matrix green theme is otherwise unchanged.

---

## [1.4.2] - 2026-03-19

### Added
- ✨ **`show_particles`** — New toggle (Glass and Bio layouts only) to disable the animated particles and orbs. When off, the rising bioluminescent particles (Bio) and background orbs (Glass) are hidden. Default: `true`.
- 🌦️ **Weather Station layout (`wxstation`)** — New layout with a dynamic weather background, 4-column gauge grid (battery, watch, wind, humidity, pressure, feels like — priority order), overflow sensors as chips, animated travel/distance chips, and a status footer with last-updated time. Fully integrated with all existing config options.
- 📱 **Second device battery (`show_device_2_battery`)** — Display battery for a second device (tablet, laptop, phone) alongside the primary device. Auto-detected from `device_trackers` (second entry); manual override via `device_2_battery_sensor` and `device_2_battery_state_sensor` entity pickers in the Sensors tab. Device icon auto-detected from entity name (tablet/laptop/phone). Supported across all 8 layouts.

### Fixed
- 🐛 **`weather_text_color` not applying to °C/°F unit** — Temperature unit (`.wx-temp-unit`) had a hardcoded `color: rgba(255,255,255,0.5)` that overrode the inherited color. Now uses `color: inherit; opacity: 0.55`.

---

## [1.4.1] - 2026-03-17

### Added
- ✨ **`pair_travel_animation`** — New toggle to disable the alternating distance/travel animation. When off, distance and travel time are shown as two separate chips simultaneously (all 7 layouts). Toggle available in the editor next to Smart Mode.
- ✨ **`transparent_background`** — New toggle (Glass and Bio layouts only) to remove the dark card background and box-shadow, making the card blend into any HA dashboard background. Visible in the Style tab only when Glass or Bio is selected.


### Fixed
- 🐛 **HACS install button wrong type** — README links used `category=dashboard`, corrected to `category=plugin`.

---

## [1.4.0] - 2026-03-15

### Added
- 🎨 **`weather_text_color`** — New config option to override the color of weather text (temperature, icon and condition label) across all 7 layouts. Leave empty to use the layout's default color.
- 🎨 **`last_changed_color`** — New config option to override the color of the last-updated timestamp (classic, neon, holo). Leave empty to use the layout's default color.
- 🖊️ **Editor color pickers** — `weather_text_color` in the Weather section; `last_changed_color` in the Style tab. Color swatch + hex input, translations in IT/EN/FR/DE.

### Fixed
- 🐛 **`weather_text_color` / `last_changed_color` not applying in neon and holo** — Invalid lit-html v2 pattern: conditional attribute injection (`<div${condition ? ' style="..."' : ''}>`) is silently ignored. Changed to valid expression inside existing attribute value (`style="${...}"`).
- 🐛 **Classic `last_changed_color` overridden by weather** — `.weather-active .entity-last-changed` had `color: #fff !important` which overrode any inline style. Removed `!important` so custom color wins.
- 🐛 **Classic layout: clicking weather text did nothing** — `.weather-bg-temp-classic` had `pointer-events: none`. Added `@click` handler, `pointer-events: auto` and `cursor: pointer` to the weather div.
- 🐛 **Holo layout: metric chips not clickable** — Battery, watch battery, connection, travel and distance chips had no `@click` handlers. All chips now open their respective entity's more-info panel on click.
- 🐛 **Bio layout: `last_changed_color` not applied** — The timestamp div had a hardcoded `rgba` color in the inline style, ignoring `last_changed_color`. Now uses the config value with the accent-based rgba as fallback.
- 🐛 **Glass layout: `last_changed_color` not applied** — The `glass-time` div had no inline style. Now applies `last_changed_color` when set.
- 🐛 **Compact layout: last-changed timestamp missing** — `show_last_changed` was not rendered at all in the compact layout. Now shows as a small sub-line below the location, respecting `last_changed_color` and `show_last_changed` toggle.

---

## [1.3.9] - 2026-03-14

### Added
- ✨ **New Holographic 3D Layout (`holo`)** — Futuristic holographic card with real CSS 3D perspective: the card floats and tilts in 3D space with a continuous animation. Features rotating rings + orbital dots around the avatar, iridescent shimmer overlay (conic gradient), animated scan bar, corner tech decorations, metric chips with top glow lines, and a weather/time subline. Accent color (rings, shimmer tint, separator) adapts automatically to the person's state and supports custom state colors. Hover flattens the card to front view.

### Fixed
- 🐛 **Holo layout picker not applying on click** — `request-selected` fires twice (select + deselect); the deselect event was resetting the layout back to the previous value. Fixed with a guard on `ev.detail.selected === false`. Also added `'holo'` to the whitelist and improved value reading with multiple fallback sources.
- 🐛 **Holo metric chips empty space** — Chips were stretching to match the tallest sibling due to flex default `align-items:stretch`. Fixed with explicit `height:42px` on all chips and `align-items:flex-start` on the metrics row.
- 🐛 **Holo pair animation overlap ("613km")** — Both travel and distance values were briefly visible during keyframe crossover. Tightened keyframes to 2% overlap and switched to `linear` timing for near-instant transition.
- 🐛 **Holo weather background not visible** — Weather animation was rendered at `z-index:0`, same layer as the shimmer overlay. Raised to `z-index:2` so it shows above the shimmer but below the card content.
- 🐛 **Holo distance showing wrong property** — Used non-existent `this._distance1/2` instead of `this._distanceFromHome` / `this._distanceFromHome2` + `_distanceUnit`.
- 🐛 **Editor cache with HACS** — The editor JS file now inherits the `hacstag` query parameter from the main card file via `import.meta.url`, ensuring HACS cache busting is correctly propagated to the editor on every update. Fallback to `?v=CARD_VERSION` for non-HACS installations.
- 🌤️ **Neon layout: weather conditions added** — The neon layout now shows the weather icon, temperature and translated condition label (e.g. `☀ 14°C · Soleggiato`) instead of just the temperature value.

## [1.3.7] - 2026-03-13

### Added
- 🌊 **New Bioluminescence Layout (`bio`)** — Deep ocean theme inspired by bioluminescent deep-sea life. Features three animated glowing orbs, five rising particles, a double pulsing ring around the avatar, SVG battery fill, chip-glow animation and a weather footer bar. Accent color (rings, chips, particles) changes automatically based on the person's zone and supports custom state colors defined in the card config.
- 🌤️ **Weather background/temperature split controls** — Two new toggles in the editor weather section: "Show animated background" and "Show temperature". Allows showing only the animated scene, only the temperature text, or both independently. Available for all layouts (classic, compact, modern, neon, glass, bio).
- 🌡️ **Weather condition label in all layouts** — Compact and modern now show weather icon + temperature + translated condition (e.g. `☀ 14°C · Soleggiato`) directly below the location name instead of a floating overlay. Classic layout also shows condition label next to the temperature.

### Fixed
- 🐛 **State color picker not applying to avatar border** — In classic and compact layouts, changing a state color in the editor now correctly updates the border color of the circular avatar photo.
- 🐛 **Bio layout: accent color not applied to avatar border** — The avatar ring border was using a hardcoded sensor color instead of the custom state accent color. Now correctly follows the state color picker.
- 🐛 **Dir2 pair animation desync** — When smart travel mode is disabled and both directions are visible simultaneously, direction-2 animated chips were in perfect sync with direction-1 (making them look static). Fixed with a `−4 s` animation offset so both pairs alternate independently.
- 🐛 **Weather text unreadable on light backgrounds** — States like `sunny`, `snowy`, `fog` and `partlycloudy` used very bright gradients that made text invisible. Fixed with darker gradient stops and a universal dark scrim overlay (`::after`) on all weather backgrounds.
- 🐛 **Weather contrast missing in classic and modern layouts** — `weather-active` class (which applies frosted-glass badges and text-shadow) was only applied to the compact layout. Now extends to classic and modern as well.


---

## [1.3.6] - 2026-03-11

### Fixed
- 🐛 **Editor not updated after HACS update** — The browser was caching the old `person-tracker-card-editor.js` because the dynamic `import()` didn't include the `?v=` parameter. It now uses `import('./person-tracker-card-editor.js?v=1.3.6')`, which changes with each version and forces a reload of the correct file.
- 🔧 **`CARD_VERSION` promoted to top-level constant** — Previously, it was only declared in the cache-busting IIFE. Now it's available globally and reused in the dynamic import, eliminating the double declaration.
- 🏷️ **Version badge in the editor** — `Person Tracker Card v1.3.6` appears at the top of the visual editor, making it easy to check if the editor is up to date.

---

## [1.3.5] - 2026-03-11

### Changed (Glass layout)
- 🔋 **Battery icon redesigned** — SVG battery that fills up based on level, with the percentage displayed as text next to it. When charging, the icon pulses with a green glow animation instead of showing a text label.
- 📶 **Connection in header** — Connection type (Wi-Fi / cellular) moved to the header pill next to the battery, with icon + label. Chip removed from the bottom row when battery is shown.
- 🌦️ **Weather bar at bottom** — New bottom strip showing weather icon, temperature and translated condition label (IT/EN/FR/DE). Replaces the inline temperature in the header.
- 🌍 **Weather state translations** — All 15 HA weather states translated in Italian, English, French and German via the existing `_t()` system.

---

## [1.3.4] - 2026-03-11

### Added
- ✨ **New Glassmorphism Layout** — Dark frosted-glass card with translucent chips, colored gradient orbs, animated status dot, and per-state accent color. Select `glass` in the layout picker. Supports all sensors: battery, watch battery, connection, distance, travel time (both directions + smart mode), activity, steps.
- 🔧 **`distance_unit` config option** — Override the distance unit displayed (e.g. `km`, `mi`). Leave empty for auto-detection: reads `attributes.distance` unit from HA unit system for Waze/Google sensors, or `unit_of_measurement` for native HA distance sensors.


## [1.3.3] - 2026-03-11

### Fixed
- 🐛 **Fix #24 Distance sensor reads wrong value** — Distance sensors were reading `state` instead of `attributes.distance`. Waze and Google Routes sensors store travel time (minutes) in `state` and actual distance in `attributes.distance`. Now the card reads `attributes.distance` first, falling back to `state` for native HA distance sensors.
- 🐛 **Modern layout pair-b ring overflow** — Second direction ring (travel_2) was appearing below the card during the alternating animation. Fixed by applying `position:absolute;top:0;left:0` as inline style to override the `.ring-container` CSS class.

## [1.3.2] - 2026-03-09

### Added
- 🏢 **Dual Travel Direction (Issue #22)** — Smart home/work dual-sensor system. Configure a second set of distance and travel time sensors (e.g. Waze/Google Routes towards home). Logic:
  - When person is **at home** (`state = 'home'`) and sensor 2 is configured → sensor 1 (home→work direction) is hidden, sensor 2 (work→home direction) is shown
  - When person is **at work** (`zone_2`) → sensor 2 is hidden, sensor 1 is shown
  - All 4 layouts supported: Classic, Compact, Modern (ring indicators), Neon (neon badges)
  - New config: `distance_sensor_2`, `travel_sensor_2`, `zone_2`, `show_distance_2`, `show_travel_time_2`
  - Editor section added (Sensors tab) with entity pickers, toggle switches, and zone field in IT/EN/FR/DE
- 🌦️ **Rich Weather Animations** — Complete rebuild of weather background system with fully animated scenes for every state:
  - ☀️ **Sunny** — Glowing sun with 18 rotating rays and pulsing halo
  - 🌙 **Clear Night** — Moon with craters, aurora borealis ribbons, twinkling stars and falling meteor (fixed direction: top-right → bottom-left)
  - ⛅ **Partly Cloudy** — Day: sun + 2 clouds; Night: moon + stars + 2 night clouds
  - ☁️ **Cloudy** — 5 animated grey clouds at different depths
  - 🌫️ **Fog** — 8 drifting blur bands layered for depth effect
  - 💨 **Windy / Windy-variant** — 10 wind sweep lines with fading gradient
  - 🌧️ **Rainy** — Dark clouds + 26 rain drops with splash animations
  - 🌨️ **Snowy-rainy** — Dark clouds + mixed rain + 8 Unicode snowflakes
  - 🌧️ **Pouring** — Storm clouds + 40 heavy rain drops (accelerated animation)
  - ❄️ **Snowy** — Grey clouds + 18 Unicode snowflakes (❄❅❆✻✼) + snow ground layer
  - 🌩️ **Lightning** — Storm clouds + rain + SVG bolt paths + sky flash effect
  - ⛈️ **Lightning-rainy** — Storm clouds + 36 heavy drops + SVG lightning + sky flash
  - 🌪️ **Exceptional** — Dust swirl particles + hot wind lines
  - 🧊 **Hail** — Dark clouds + 22 glossy sphere hail drops
  - Vivid opaque gradients per state (sunny=blue-to-amber, night=deep navy, storm=dark purple…)
  - Seeded deterministic PRNG (`_rng(seed)`) — same weather state always produces identical particles, preventing LitElement re-render loops
- 📍 **Weather Temperature — layout-aware positioning**:
  - **Classic layout**: temperature shown inline below the last-changed timestamp
  - **Neon layout**: temperature shown inline below the last-changed timestamp, styled with monospace neon font
  - **Modern/Compact layouts**: temperature shown as absolute bottom-right label

### Fixed
- 🐛 **Mobile App Auto-Detection** — sensors are now resolved from `person.attributes.device_trackers` instead of a guessed `sensor.phone_{name}_*` pattern. The card reads the actual device tracker (e.g. `device_tracker.iphonedavide`), extracts the prefix, and builds correct entity IDs (`sensor.iphonedavide_battery_level`, `sensor.iphonedavide_activity`, etc.). Falls back to name-scan if device_trackers attribute is absent.
- 🐛 **Battery/Watch charging state auto-detection** — `sensor.{prefix}_battery_state` and `sensor.{prefix}_watch_battery_state` are now auto-detected without requiring manual config
- 🐛 **Distance sensor** — now resolves to `sensor.{prefix}_distance` (mobile_app) instead of `sensor.waze_{name}`
- 🐛 **Shooting star direction** — was moving horizontally left; now falls diagonally downward (top-right → bottom-left) with correct vertical gradient (bright head, fading tail)
- 🐛 **Modern layout rings** — circular indicators now have a dark frosted-glass background (`rgba(0,0,0,0.45)` + `backdrop-filter: blur`) to remain readable over any weather background
- 🐛 **Compact layout contrast** — when weather background is active (`.weather-active` class), badges get dark frosted background, name gets white text-shadow, icons get drop-shadow, profile picture gets contrast border

### Changed
- 🎨 **Classic layout default picture size** — reduced from 55% to 45% for better proportions
- 🌍 **Editor auto-detection** — sensor fields now show the auto-detected value immediately (without requiring the auto-detect button). Pickers display `sensor.{prefix}_battery_level` etc. as soon as a person entity is selected
- 🌍 **Sensor description text** — updated in all languages to reflect mobile_app prefix detection

### Translations
- 🌍 **New keys added in IT/EN/FR/DE**:
  - `section.neon_options` — Neon Layout Options
  - `section.neon_description` — Neon layout description
  - `section.weather` — Weather section title
  - `editor.show_weather` — Show weather background toggle
  - `editor.weather_entity` — Weather entity picker label
  - `section.weather_description` — Weather background description
  - `section.travel_sensor_2` — Work Direction Sensors section title
  - `section.travel_sensor_2_description` — Work direction sensors description
  - `editor.distance_sensor_2` — Distance sensor 2 label
  - `editor.travel_sensor_2` — Travel time sensor 2 label
  - `editor.zone_2` — Work zone ID field label
  - `editor.show_distance_2` — Show distance direction 2 toggle
  - `editor.show_travel_time_2` — Show travel time direction 2 toggle
- 🌍 **Updated key** `section.sensors_description` — now describes mobile_app prefix auto-detection in all 4 languages

---

## [1.3.1] - 2026-03-08

### Added
- 🌟 **Neon Layout** - New cyberpunk-inspired dark theme layout:
  - Animated pulsing glow ring around profile picture (color adapts to person state)
  - Neon corner brackets framing the card
  - CRT scanlines overlay for retro-futuristic effect
  - Neon status dot next to person name with color glow
  - State label in neon color with text-shadow glow
  - Last changed timestamp in muted style
  - Neon badges row for battery, watch battery, activity, connection, distance, and travel time
  - Charging animation on battery badges
  - Vivid state colors: green (home), red/pink (away), cyan/orange (other states)
- 🎨 **Neon Layout Editor UI** — dedicated section in Style tab with layout description and options panel

---

## [1.3.0] - 2026-03-07

### Added
- 🔧 **Configurable Distance Precision** - New `distance_precision` option to control decimal places shown for distance (0=integer, 1=one decimal, 2=two decimals; default: 1). Works across all three layouts.
- 🖱️ **Tap Action Support** - New `tap_action` config option to override the default click behavior on the card:
  - `more-info` (default) — opens the more-info dialog for the person entity (or a custom entity)
  - `navigate` — navigates to a Lovelace path (e.g. `/lovelace/home`)
  - `url` — opens an external URL in a new tab
  - `call-service` — calls a HA service with optional `service_data`
  - `none` — disables click entirely
- 🛠️ **Tap Action Editor UI** — dedicated section in the Base tab to configure tap action without YAML
- 🔄 **Automatic Cache Busting** — the card now automatically updates its Lovelace resource URL with the current version query param (`?v=X.X.X`) on load. After a HACS update, admin users no longer need to manually clear the browser cache — the page reloads automatically.

### Fixed
- 🐛 **iOS Connection Type** (issue #14) — iOS Companion App uses `sensor.*_network_type` instead of `sensor.*_connection_type`. The card now auto-detects which sensor exists and falls back gracefully, so connection status works on both iOS and Android without manual configuration.
- 🐛 **Sensors Not Showing in Classic/Compact** (issue #15) — distance was hidden when value was `0` or unavailable/unknown state string. The card now tracks sensor existence separately (`_distanceSensorFound`) and shows the distance indicator whenever the sensor is present.
- 🐛 **ha-entity-picker Not Loading in Editor** (issue #20) — `ha-entity-picker` is lazy-loaded by HA and was sometimes undefined when the editor opened first. Fixed by requesting the config element of `hui-glance-card` (which depends on `ha-entity-picker`), forcing HA to register the component before the editor renders.

### Changed
- 📦 **`hacs.json`** — added `"filename"` field so HACS correctly identifies the main resource file for URL management

## [1.2.4] - 2025-12-04

### Fixed
- Fixed German (de) translations encoding issues (ä, ö, ü, ß characters were corrupted)
- Fixed French (fr) translations encoding issues (é, è, à characters)

### Changed
- Activity sensor is now automatically hidden when state is "unknown"

## [1.2.2] - 2025-11-30

### Added
- 📐 **Configurable Indicator Sizes** - New options to customize indicator dimensions for all layouts
  - `classic_icon_size` - Icon size for Classic layout (12-32px, default: 16px)
  - `compact_icon_size` - Icon size for Compact layout (12-32px, default: 16px)
  - `modern_ring_size` - Ring size for Modern layout (28-60px, default: 38px)
- 🔄 **Proportional Scaling (Compact)** - Entire card scales proportionally with icon size:
  - Badge circles: `iconSize × 2`
  - Profile picture: `iconSize × 2.5`
  - Name font: `iconSize × 0.875`
  - Location font: `iconSize × 0.625`
  - Card padding and gaps scale automatically
- 🔄 **Proportional Scaling (Modern)** - Ring content scales with ring size:
  - Value font: ~29% of ring size
  - Unit font: ~18% of ring size
  - Icon size: ~58% of ring size
- 🎨 **Layout-Specific Editor Sections** - New dedicated sections in Style tab:
  - "Classic Layout Options" with icon size and font settings
  - "Compact Layout Options" with proportional icon size
  - "Modern Layout Options" with ring size and font settings
- ⚡ **Battery Charging Animation** - Visual indicator when device is charging
  - Pulse animation on battery indicators (all layouts)
  - Lightning bolt icon ⚡ appears when charging
  - Ring glows green when charging (Modern layout)
  - Icon changes to `mdi:battery-charging` (Classic layout)
- 🔌 **Charging State Sensors** - New configuration options:
  - `battery_state_sensor` - Entity to monitor phone charging state
  - `battery_charging_value` - Custom value for charging state (optional)
  - `watch_battery_state_sensor` - Entity to monitor watch charging state
  - `watch_battery_charging_value` - Custom value for watch charging (optional)
- 🔍 **Auto-Detection of Charging States** - Recognizes multiple states:
  - iOS: `Charging`,`Full`
  - Android: `charging`, `discharging`, `full`
  - Binary: `on`, `off`, `true`, `false`, `1`, `0`
  - Power types: `ac`, `usb`, `wireless`
  - Multilingual: `in carica`, `en charge`, `laden`, `aufladen`

### Fixed
- 🌓 **Light Theme Support** - Card now properly adapts to light/dark themes
  - Ring background color adapts automatically (dark on light theme, light on dark theme)
  - Text colors use HA CSS variables (`--primary-text-color`, `--secondary-text-color`)
  - Badge backgrounds use `--secondary-background-color`
  - Dividers use `--divider-color`
  - Automatic theme detection based on `--primary-background-color` luminance
- 🔧 **Watch Battery Badge Alignment** - Fixed vertical alignment in Compact layout

### Changed
- 📝 **Editor Helper Text** - Updated to explain proportional scaling behavior
- 🔧 **Default Values** - Added proper defaults for all new size options

### Translations
- 🌍 **New Translation Keys** (IT/EN/FR/DE):
  - `editor.classic_icon_size` - Classic icon size
  - `editor.compact_icon_size` - Compact icon size
  - `editor.modern_ring_size` - Modern ring size
  - `editor.battery_font_size` - Battery font size
  - `editor.activity_font_size` - Activity font size
  - `editor.battery_state_sensor` - Phone charging state sensor
  - `editor.battery_charging_value` - Charging state value
  - `editor.watch_battery_state_sensor` - Watch charging state sensor
  - `editor.watch_battery_charging_value` - Watch charging state value
  - `editor.charging_helper` - Helper text for auto-detection
  - `section.classic_options` - Classic Layout Options
  - `section.compact_options` - Compact Layout Options

---

## [1.2.1] - 2025-11-30

### Added
- 🖱️ **Clickable Indicators** - All indicators now open their respective entity's more-info dialog
  - Picture and name/state → opens person entity
  - Battery → opens battery sensor
  - Watch battery → opens watch battery sensor
  - Activity → opens activity sensor
  - Connection → opens connection sensor
  - Distance → opens distance sensor
  - Travel time → opens travel sensor
- ✨ **Hover Effects** - Visual feedback on clickable elements (scale + opacity)
- 🎨 **Dynamic Icons** - All icons now read from entity attributes with smart fallbacks
  - Connection icon from entity or auto-detect WiFi/Signal
  - Distance icon from entity or `mdi:map-marker-distance`
  - Travel icon from entity or `mdi:car-clock`

### Fixed
- 🐛 **Editor Sensors Tab** - Entity pickers now always visible when editing saved cards
  - Previously, sensor pickers disappeared after saving the card
  - Pickers now show placeholder with default sensor pattern
- 🐛 **Entity Picker Improvements**
  - Added `allow-custom-entity` for manual entity input
  - Extended supported domains: `sensor`, `input_number`, `binary_sensor`
  - Empty default value prevents unwanted auto-selection

### Changed
- 🔧 **Sensor Flexibility** - Any entity type can now be used for any sensor slot
- 📝 **Editor UX** - Sensor pickers always visible with default pattern as placeholder label

---

## [1.2.0] - 2025-11-30

### Added
- 🎨 **Modern Layout** - New stylish layout with circular progress indicators
  - Circular SVG rings for battery, watch battery, distance, and travel time
  - Icon badges for activity and connection status
  - State-colored border around profile picture (green=home, red=not_home, orange=other)
  - Clean horizontal design: Picture | Name/State | Indicators
- ⚙️ **Modern Layout Customization**:
  - `modern_picture_size` - Profile picture size (30-80px, default: 40px)
  - `modern_name_font_size` - Person name font size (default: 14px)
  - `modern_state_font_size` - State/location font size (default: 12px)
  - `modern_travel_max_time` - Max travel time for ring calculation (default: 60 min)
- 🔋 **Enhanced Battery Display** - Circular progress rings show percentage visually
- 📍 **Enhanced Distance Display** - Circular ring with distance value and unit
- 🚗 **Enhanced Travel Time Display** - Color-coded ring (green/orange/red based on time)
- 🎯 **Improved Activity Icons**:
  - Now reads icon from entity attributes first
  - Extended icon mapping with Italian translations
  - Fallback to `mdi:human-male` for unknown states
  - Case-insensitive state matching

### Changed
- 📐 **Responsive Modern Layout** - Card automatically expands based on number of indicators
- 🔤 **Larger Default Fonts** - Modern layout uses 14px for name, 12px for state (more readable)
- ⭕ **Larger Indicator Rings** - 38px rings with 11px text for better visibility
- 🎨 **Improved Ring Design** - Rounded stroke caps, better contrast colors

### Fixed
- 🐛 **Activity Icon Always Visible** - Removed condition that hid icon when empty
- 🐛 **Ring Overlap Prevention** - Indicators no longer overlap with name/state text
- 🐛 **Editor Cleanup** - Removed redundant "show ring" toggles from Modern options

### Technical Improvements
- ⚡ **Flexbox Layout** - Modern layout uses flexbox for better responsiveness
- 🎨 **CSS Variables** - Ring sizes and colors defined in static styles
- 🔧 **Simplified Conditions** - Cleaner render logic for all layouts

---

## [1.1.2] - 2025-01-25

### Added
- 📏 **Dynamic Distance Unit** - Distance sensor now reads unit of measurement from entity attributes
- 🎯 **Dynamic Activity Icon** - Activity icon follows entity's `icon` attribute with fallback to predefined mapping
- 🔤 **State Font Customization** - Added option to customize state text font size (Classic layout)
- 🕐 **Last Changed Font Customization** - Added option to customize last changed text font size (Classic layout)

### Fixed
- 🤖 **Android WiFi Detection** - Fixed connection type detection for Android devices
  - iOS uses `Wi-Fi` while Android Companion App uses `wifi`
  - Added case-insensitive check that handles all variations (`wifi`, `Wi-Fi`, `WIFI`, `wi-fi`, etc.)
  - New helper method `_isWifiConnection()` normalizes connection type before comparison
- 👤 **Person Name Display** - Fixed person name visualization in Classic layout

### Technical Improvements
- ⚡ **Normalized WiFi Check** - Removes spaces, hyphens, and underscores before lowercase comparison
- 🔧 **Cross-Platform Compatibility** - Now works identically on iOS and Android devices

---

## [1.1.1] - 2024-11-24

### Added - Multilanguage Support 🌍
- 🌍 **Complete Multilanguage System** - Full internationalization support
- 🇮🇹 **Italian** - Complete translation (Italiano)
- 🇬🇧 **English** - Complete translation (default fallback)
- 🇫🇷 **French** - Complete translation (Français)
- 🇩🇪 **German** - Complete translation (Deutsch)
- 🔄 **Automatic Language Detection** - Reads from Home Assistant settings
- 🎯 **Smart Fallback System** - English as default for unsupported languages
- 📝 **Translated Elements**:
  - Person states (Home, Away, Not Home, Unknown)
  - Editor interface (all tabs and labels)
  - Sensor names and descriptions
  - Position labels
  - Custom state defaults
  - Time relative strings (hours ago, minutes ago, etc.)
  - All buttons and actions

### Changed
- 🔤 **Default Language** - Changed from hardcoded to English fallback
- 🎨 **Editor Organization** - All UI elements now multilingual
- 📱 **User Experience** - Seamless language switching based on HA settings

### Technical Improvements
- ⚡ **Embedded Translations** - Zero latency with embedded translation dictionaries
- 🏗️ **LocalizationHelper Class** - Centralized translation management
- 🔧 **Type-safe Code** - Removed TypeScript annotations for JavaScript compatibility
- 📦 **No External Dependencies** - All translations included in JS files

---

## [1.1.0] - 2024-11-23

### Added
- ✨ **Compact Layout Mode** - New space-efficient horizontal grid layout
- 📏 **Configurable Width** - Adjustable card width for compact layout (200-500px)
- ⌚ **Watch Battery Support** - Display smartwatch battery level
- 🎨 **Conditional UI** - Editor adapts based on selected layout
- 📐 **Position Tab** - Dedicated tab for element positioning (Classic mode only)
- 🎯 **Smart Field Visibility** - Fields appear/hide based on layout selection

### Changed
- 🎨 Improved editor organization with layout-specific options
- 📱 Enhanced mobile dashboard compatibility with compact mode
- 🔧 Better default values for all configuration options
- 📝 Separated person name from location display in compact layout

### Fixed
- 🐛 Fixed crash when selecting layout from dropdown menu
- 🐛 Fixed person name disappearing with custom states in compact mode
- 🐛 Fixed irrelevant style fields showing in compact mode
- 🔧 Improved event handling for ha-select components

---

## [1.0.0] - 2024-11-22

### Added
- 🎉 **Initial Public Release**
- ✨ **Complete Visual Editor** with organized tabs (Base, Sensors, Position, States, Style)
- 📱 **Full Companion App Support**:
  - Battery monitoring with dynamic icon
  - Activity tracking (Walking, Running, Automotive, Stationary, Cycling)
  - Connection type detection (WiFi/Mobile)
  - Distance from home
  - Travel time estimation
- 🎨 **Customizable States**:
  - Custom names with emoji support
  - Personalized colors
  - Custom images per state
  - Support for transparent PNG and animated GIF
- 📍 **Waze Integration** for distance calculation
- 🎯 **Free Element Positioning** - 8 available positions
- 📐 **Configurable Aspect Ratio**
- 🖼️ **Custom Images** - Transparent PNG and animated GIF support
- 🎨 **Fully Customizable Styling**:
  - Card background and border radius
  - Font sizes for each element
  - Element colors
  - Picture size control
- 🔄 **Update Control** - Choose update mode (all/entity/custom)
- 📱 **Responsive Design**
- 🌙 **Dark/Light Theme Support**

### Technical Features
- ⚡ Performance optimized with `shouldUpdate()`
- 🔧 YAML and UI configuration support
- 🎨 Modular and maintainable CSS
- 📝 Well-documented code
- 🧪 Tested across multiple configurations

---

## Features Summary

### Layout Modes

#### Classic Layout (v1.0.0)
- Fully customizable element positioning
- Configurable aspect ratio
- Adjustable image size
- 8 position options for each element
- **Configurable icon size** (v1.2.2)
- Perfect for large dashboard cards

#### Compact Layout (v1.1.0)
- Space-efficient horizontal grid
- Configurable image size (scales with icons)
- Bottom icon bar with all indicators
- Configurable width (200-500px)
- **Proportional scaling** (v1.2.2)
- Perfect for multiple person tracking

#### Modern Layout (v1.2.0)
- Circular progress indicators for numeric values
- Icon badges for activity and connection
- State-colored profile picture border
- Auto-expanding responsive design
- **Configurable ring size** (v1.2.2)
- Perfect for modern, minimal dashboards

#### Clickable Indicators (v1.2.1)
- All elements open more-info dialog on click
- Visual hover feedback
- Works across all layouts

#### Configurable Sizes (v1.2.2)
- Classic: `classic_icon_size` (12-32px)
- Compact: `compact_icon_size` (12-32px) with proportional scaling
- Modern: `modern_ring_size` (28-60px) with proportional scaling

#### Neon Layout (v1.3.1)
- Cyberpunk dark theme with animated glow ring and neon badges
- Vivid state-colored glows, corner brackets, scanlines overlay
- Adapts to person state (home/away/other) with matching neon color

#### Weather Animations (v1.3.2) 🆕
- Rich animated weather backgrounds for all 14 weather states
- Seeded PRNG for stable rendering in LitElement
- Layout-aware temperature display (inline in Classic/Neon, absolute in Modern/Compact)
- Contrast-safe: frosted glass on Modern rings and Compact badges when weather is active

#### Tap Action & Cache Busting (v1.3.0)
- Configurable `tap_action` with 5 modes (more-info, navigate, url, call-service, none)
- Automatic browser cache invalidation after HACS updates

---

## Supported Languages

| Language | Code | Status | Version |
|----------|------|--------|---------|
| 🇬🇧 English | en | ✅ Complete | 1.1.1 |
| 🇮🇹 Italiano | it | ✅ Complete | 1.1.1 |
| 🇫🇷 Français | fr | ✅ Complete | 1.1.1 |
| 🇩🇪 Deutsch | de | ✅ Complete | 1.1.1 |

---

## Change Types
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for bug fixes
- `Security` for vulnerability fixes

---

## Version Links
- [1.3.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.2
- [1.3.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.1
- [1.3.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.3.0
- [1.2.4]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.4
- [1.2.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.2
- [1.2.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.1
- [1.2.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.2.0
- [1.1.2]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.2
- [1.1.1]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.1
- [1.1.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.1.0
- [1.0.0]: https://github.com/djdevil/person-tracker-card/releases/tag/v1.0.0
