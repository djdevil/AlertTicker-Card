# 👤 Person Tracker Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![Version](https://img.shields.io/badge/version-1.4.12-blue.svg)](https://github.com/djdevil/person-tracker-card)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/divil17f)

Advanced card for Home Assistant that displays detailed information about people with complete visual editor and **eleven layout modes**.

---

### 📐 Classic
![Classic Layout](images/preview.png)

---

### 📦 Compact
![Compact Layout](images/compact2.png)

---

### ✨ Modern
![Modern Layout](images/modern.png)

---

### ✦ Neon
![Neon Layout](images/neon.png)

---

### ◈ Glass
![Glass Layout](images/glass.png)

---

### ◉ Bioluminescence
![Bioluminescence Layout](images/bio.png)

---

### ◈ Holographic 3D
![Holographic 3D Layout](images/holo.png)

---

### 🌦️ Weather Station
![Weather Station Layout](images/wxstation.png)

---

### 🖥️ Matrix Rain
![Matrix Rain Layout](images/matrix.png)

---

### 🪐 Orbital
![Orbital Layout](images/orbital.png)

---

### 🖋️ Liquid Ink
![Liquid Ink Layout](images/ink.png)

---

**[🇬🇧 English](#english-version) | [🇮🇹 Versione Italiana](#versione-italiana)**

---

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=djdevil&repository=person-tracker-card&category=plugin)  [![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)

<a name="english-version"></a>
## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🎨 Layout Modes](#-layout-modes)
- [🌦️ Weather Animations](#️-weather-animations)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📱 Mobile App Integration](#-mobile-app-integration)
- [🗺️ Smart Travel Mode](#️-smart-travel-mode)
- [📍 Maps Integration](#-maps-integration)
- [🎭 Examples](#-examples)
- [🎬 Animated Emoji Avatar](#-animated-emoji-avatar-memoji--ar-emoji)
- [🔍 Troubleshooting](#-troubleshooting)
- [📝 Changelog](#-changelog)

---

## ✨ Key Features

- 🎨 **Eleven Layout Modes** — Classic, Compact, Modern, Neon, Glass, Bioluminescence, Holographic 3D, Weather Station, Matrix Rain, Orbital, Liquid Ink
- 🪐 **Geocoded Location** — Shows reverse-geocoded street address when away from home (enabled by default)
- 🗺️ **Maps Integration** — Click the zone or address to open Google Maps, Apple Maps, or OpenStreetMap with the person's live GPS coordinates
- 🌦️ **Rich Weather Animations** — 15 fully animated weather states as card background
- 📱 **Auto Sensor Detection** — Automatically finds battery, activity, connection sensors from the HA Companion App
- 🔋 **Battery Monitoring** — Phone battery with dynamic icon and color
- ⌚ **Watch Battery** — Apple Watch and smartwatch support
- 🚶 **Activity Tracking** — Walking, Running, Automotive, Stationary, Cycling
- 📍 **Distance from Home** — Waze / Google Routes integration
- ⏱️ **Smart Travel Mode** — Two-direction sensor system (home↔work)
- 📶 **Connection Type** — WiFi or mobile network indicator
- 🎨 **Customizable States** — Different colors and images for each location
- 🖼️ **Custom Images** — PNG/GIF with transparency support
- 🎯 **Complete Visual Editor** — User-friendly GUI configuration in 4 languages
- 🌍 **Multilanguage** — Italian, English, French, German

---

## 🎨 Layout Modes

### Classic
Full-size card with freely positionable elements. Ideal for large dashboard cards.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 60
battery_position: top-right
activity_position: bottom-left
```

### Compact
Horizontal grid layout with fixed structure. Perfect for tracking multiple people side by side.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300
```

### Modern
Sleek horizontal card with SVG circular progress rings for battery, distance, and travel time.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
modern_picture_size: 45
modern_name_font_size: '16px'
modern_state_font_size: '13px'
```

### Neon ✦
Dark cyberpunk theme with glowing neon badges, monospace font, and scanline overlay.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: neon
```

### Glass ◈
Frosted glassmorphism card with translucent chips, gradient orbs, and animated status dot. Accent color adapts to the person's state.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: glass
```

### Bioluminescence ◉
Deep-ocean theme with animated glowing orbs, rising particles, double pulsing avatar ring, SVG battery fill, and weather footer bar.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: bio
```

### Holographic 3D ◈
Futuristic card with real CSS 3D perspective — the card floats and tilts continuously in 3D space. Features rotating rings + orbital dots around the avatar, iridescent conic-gradient shimmer, animated scan bar, corner tech decorations, and metric chips. Hover flattens to front view.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: holo
```

### Weather Station 🌦️
A dedicated dashboard for personal weather data. Weather animation fills the top section, with a dynamic 4-column gauge grid (battery, watch, wind, humidity, pressure, feels like — priority order). Overflow sensors appear as chips below the grid. Travel and distance chips animate at the bottom.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: wxstation
weather_entity: weather.home
show_weather: true
```

### Matrix Rain 🖥️
Terminal/hacker theme with animated falling katakana and hexadecimal characters as background. Square avatar with CRT scanlines and animated scan bar. Monospace stats blocks with phosphor green progress bars. Avatar border and scan bar color follow the state color picker.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: matrix
```

### Orbital 🪐
Sci-fi space theme with a spinning 3D coin (front = photo, back = battery levels of all devices), three tilted orbital rings, up to four orbiting satellite badges (connection, activity, distance/travel time), animated pulse rings, twinkling stars, and a perspective grid overlay. Accent color adapts to state: teal when home, violet when not home, blue for custom zones.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: orbital
show_weather: true
weather_entity: weather.home
show_geocoded_location: true
```

### Liquid Ink 🖋️
The only **light mode** theme. Pure white background with crisp shadows and elevated elements. Horizontal layout: avatar circle with state-colored accent ring on the left, name / zone / time / geocoded address in the center, battery pill panel on the right. Below, an accent gradient separator divides the info row from the sensor chips. State accent colors: blue (home), violet (away), teal (other zones) — overrideable per state. Full geocoded address, maps integration, and weather support — when weather is active the background is replaced by the animated weather scene and text switches to high-contrast white.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: ink
maps_provider: google
show_geocoded_location: true
```

---

## 🌦️ Weather Animations

Enable animated weather backgrounds by providing a `weather` entity:

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern          # works on all 10 layouts
weather_entity: weather.home
show_weather: true
show_weather_background: true   # animated scene
show_weather_temperature: true  # temperature label
```

### Supported Weather States

| State | Animation |
|-------|-----------|
| ☀️ `sunny` | Glowing sun with 18 rotating rays and pulsing halo |
| 🌙 `clear-night` | Moon with craters, aurora ribbons, stars, falling meteor |
| ⛅ `partlycloudy` | Day: sun + clouds · Night: moon + stars + clouds |
| ☁️ `cloudy` | 5 animated grey clouds at different depths |
| 🌫️ `fog` | 8 drifting blur bands layered for depth |
| 💨 `windy` / `windy-variant` | 10 wind sweep lines with fading gradient |
| 🌧️ `rainy` | Dark clouds + 26 rain drops with splash animations |
| 🌨️ `snowy-rainy` | Dark clouds + mixed rain + 8 Unicode snowflakes |
| 🌧️ `pouring` | Storm clouds + 40 heavy rain drops (accelerated) |
| ❄️ `snowy` | Clouds + 18 snowflakes (❄❅❆✻✼) + snow ground layer |
| 🌩️ `lightning` | Storm clouds + SVG bolt + sky flash |
| ⛈️ `lightning-rainy` | Storm clouds + 36 drops + lightning + sky flash |
| 🌪️ `exceptional` | Dust swirl particles + hot wind lines |
| 🧊 `hail` | Dark clouds + 22 glossy hail spheres |

> **Note:** Gradients are vivid and opaque — weather IS the card background. A deterministic seeded PRNG ensures the same particle positions on every render, preventing LitElement re-render loops.

---

## 📦 Installation

### Via HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=djdevil&repository=person-tracker-card&category=plugin)  [![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)

> [!NOTE]
> If the button above doesn't work, follow the manual steps below.

<details>
<summary>📋 Manual HACS installation steps</summary>

**HACS v2 (new interface):**
1. Open HACS
2. Click the **⋮** menu (top right) → **Custom repositories**
3. Repository URL: `https://github.com/djdevil/person-tracker-card`
4. Category: **Dashboard** → **Add**
5. Search for `Person Tracker Card` → **Download**
6. Restart Home Assistant

**HACS v1 (old interface):**
1. HACS → Frontend → **⋮** → **Custom repositories**
2. Repository URL: `https://github.com/djdevil/person-tracker-card`
3. Category: **Dashboard** → **Add**
4. Search for `Person Tracker Card` → **Install**
5. Restart Home Assistant

</details>

### Manual Installation

1. Download `person-tracker-card.js` and `person-tracker-card-editor.js`
2. Copy to `config/www/person-tracker-card/`
3. Add resource:
   - Settings → Dashboards → ⋮ → Resources → **+ ADD RESOURCE**
   - URL: `/local/person-tracker-card/person-tracker-card.js`
   - Type: **JavaScript Module**
4. Hard refresh browser (Ctrl+Shift+R)

---

## 🔧 Configuration

### Quick Start (GUI Editor)

1. Edit dashboard → Add card
2. Search **Person Tracker Card**
3. Select a **person** entity
4. Choose a **layout**
5. Configure sensors and style — sensors are auto-detected from the Companion App

### Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | required | `person.xxx` entity |
| `layout` | string | `classic` | `classic` / `compact` / `modern` / `neon` / `glass` / `bio` / `holo` / `wxstation` / `matrix` / `orbital` / `ink` |
| `show_entity_picture` | bool | `true` | Show avatar |
| `show_name` | bool | `true` | Show person name |
| `show_last_changed` | bool | `true` | Show last state change time |
| `show_battery` | bool | `true` | Show phone battery |
| `show_watch_battery` | bool | `true` | Show watch battery |
| `show_activity` | bool | `true` | Show activity sensor |
| `show_connection` | bool | `true` | Show connection type |
| `show_distance` | bool | `true` | Show distance from home |
| `show_travel_time` | bool | `true` | Show estimated travel time |
| `show_weather` | bool | `false` | Enable weather section |
| `show_weather_background` | bool | `true` | Animated weather background |
| `show_weather_temperature` | bool | `true` | Temperature label |
| `weather_entity` | string | — | `weather.xxx` entity |
| `show_device_2_battery` | bool | `true` | Show second device (tablet/laptop) battery. Auto-detected; manual override via `device_2_battery_sensor` |
| `show_geocoded_location` | bool | `true` | Show reverse-geocoded street address when away from home |
| `geocoded_location_entity` | string | auto | Manual override for geocoded location sensor |
| `maps_provider` | string | — | Open GPS location on click: `google` / `apple` / `osm`. Disabled if not set |
| `show_particles` | bool | `true` | Show animated particles/orbs (Glass and Bio only) |
| `transparent_background` | bool | `false` | Transparent card background (Glass and Bio only) |
| `pair_travel_animation` | bool | `true` | Alternate distance/travel chips. When `false`, both show simultaneously |
| `card_background` | string | — | CSS background value |
| `card_border_radius` | string | — | CSS border-radius value |
| `distance_unit` | string | auto | Override distance unit (`km`, `mi`) |
| `state_entity` | string | — | Override the displayed location text with any HA sensor. Home/away logic is unaffected |
| `tap_action` | object | `more-info` | Action on card tap: `more-info` / `navigate` / `url` / `call-service` / `none` |
| `extra_chips` | list | — | Custom entity chips added to all 11 layouts. See [Extra Chips](#-extra-chips) |

### Sensor Options

| Option | Description |
|--------|-------------|
| `battery_sensor` | Phone battery sensor (auto-detected) |
| `watch_battery_sensor` | Watch battery sensor (auto-detected) |
| `device_2_battery_sensor` | Second device battery sensor (auto-detected from 2nd device tracker) |
| `device_2_battery_state_sensor` | Second device charging state sensor |
| `activity_sensor` | Activity sensor (auto-detected) |
| `connection_sensor` | Connection type sensor (auto-detected) |
| `wifi_ssid_sensor` | Sensor that reports the Wi-Fi SSID name (e.g. `sensor.phone_wi_fi_connection`). Displays the network name instead of "WiFi" when connected. Optional. |
| `distance_sensor` | Distance/travel time sensor (Waze/Google Routes) |
| `travel_sensor` | Travel time sensor (may be same as distance) |
| `distance_sensor_2` | Second direction sensor (smart travel mode) |
| `travel_sensor_2` | Second direction travel time sensor |
| `zone_2` | Zone name for second direction (e.g. `work`) |

### Classic Layout — Specific Options

```yaml
aspect_ratio: '1/0.7'        # Card aspect ratio
picture_size: 60              # Avatar size in px
battery_position: top-right   # top-left/right, bottom-left/right, *-2 variants
watch_battery_position: top-right-2
activity_position: bottom-left
distance_position: top-left
travel_position: top-left-2
connection_position: bottom-right
name_font_size: '20px'
state_font_size: '14px'
battery_font_size: '13px'
activity_font_size: '13px'
```

**Available positions:** `top-left`, `top-right`, `bottom-left`, `bottom-right`, `top-left-2`, `top-right-2`, `bottom-left-2`, `bottom-right-2`

### Compact Layout — Specific Options

```yaml
compact_width: 300            # Width in pixels (200–500)
```

### Modern Layout — Specific Options

```yaml
modern_picture_size: 45       # Avatar size in px (30–80)
modern_name_font_size: '16px'
modern_state_font_size: '13px'
modern_travel_max_time: 60    # Max travel time for ring % calculation
```

### Custom States with Colors

```yaml
state:
  - value: home
    name: 🏡 Home
    styles:
      name:
        color: '#50A14F'

  - value: not_home
    name: 🚗 Away
    styles:
      name:
        color: '#e45649'

  - value: work
    name: 🏢 Office
    entity_picture: /local/images/office.png
    styles:
      name:
        color: '#FFD700'
```

> The accent color (avatar border, rings, glow effects) in Neon, Glass, Bio, and Holo layouts automatically follows the state color defined here.

---

## 📱 Mobile App Integration

### Required Permissions

**iOS — Home Assistant Companion App:**
1. Location: Settings → App → Location → **Always**
2. Motion & Fitness: Settings → Privacy → Motion & Fitness → **ON**

**Android — Home Assistant Companion App:**
1. Location: Always allow
2. Physical Activity: Enable in app settings

### Auto-Detection

The card automatically detects sensors from the HA Companion App by reading `person.attributes.device_trackers`, finding the first device tracker with a `sensor.{prefix}_battery_level`, and using that prefix for all other sensors.

**Example for `person.davide` with iPhone (`iphonedavide`):**
```
sensor.iphonedavide_battery_level   → phone battery
sensor.iphonedavide_activity        → activity
sensor.iphonedavide_connection_type → connection type
```

The visual editor pre-fills all sensor pickers automatically — no manual configuration needed.

### Waze / Google Routes Integration

1. Settings → Devices & Services → Add Integration
2. Search **Waze Travel Time** (or Google Routes)
3. Configure:
   - Origin: `zone.home`
   - Destination: `person.name`
   - Name: `waze_name`

---

## 🗺️ Smart Travel Mode

Configure two travel sensors for automatic direction switching:

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern

# Direction 1: home → work
distance_sensor: sensor.waze_davide_to_work
travel_sensor: sensor.waze_davide_to_work
show_distance: true
show_travel_time: true

# Direction 2: work → home
distance_sensor_2: sensor.waze_davide_to_home
travel_sensor_2: sensor.waze_davide_to_home
show_distance_2: true
show_travel_time_2: true

# Zone name for direction 1
zone_2: work
```

**Logic:**
- Person **at home** → show direction 2 (home→work), hide direction 1
- Person **at `zone_2`** (work) → show direction 1 (work→home), hide direction 2
- Person **elsewhere** → both directions visible (with alternating animation)

Supported in all 11 layouts.

---

## 🧩 Extra Chips

Add any Home Assistant entity as a custom chip to all 11 layouts. Useful for Bluetooth, Android Auto, call state, ringer mode, NFC, or any binary/sensor entity from the Companion App.

```yaml
extra_chips:
  - entity: binary_sensor.iphonedavide_bluetooth       # required
    icon: mdi:bluetooth                                 # optional — auto-detected from entity icon
    label: BT                                           # optional — shown as text; omit to show translated state
    show_when: "on"                                     # optional — only display when state matches
    color: "#4a9eff"                                    # optional — icon and text color
    tap_action:                                         # optional — default: more-info
      action: more-info                                 # more-info | call-service | navigate | url | none

  - entity: light.corridor
    icon: mdi:lightbulb
    show_when: "on"
    color: "#ffcc44"
    tap_action:
      action: call-service
      service: light.toggle                             # service saved by ha-service-control picker

  - entity: input_boolean.work_mode
    tap_action:
      action: navigate
      navigation_path: /lovelace/work
```

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | Any HA entity ID |
| `icon` | string | `mdi:xxx` — falls back to entity's HA icon |
| `label` | string | Custom text label. If omitted, shows the translated entity state |
| `show_when` | string | Only render chip when `entity.state === show_when` |
| `color` | string | Hex color applied to both icon and text |
| `tap_action` | object | `action`: `more-info` / `call-service` / `navigate` / `url` / `none` |

**Layout placement:**
- **Classic / Neon / Glass / Bio / Matrix / Ink**: chips appended to the existing chip row
- **Compact**: icon-only mini badges in the top badge row
- **Modern**: ring-style circles matching the layout's ring theme
- **Holo / WxStation / Orbital**: dedicated section below the main metrics

Fully configurable from the **visual editor** — Sensors tab → Custom Extra Chips.

---

## 📍 Maps Integration

When `maps_provider` is set, clicking the **zone/state name** or the **geocoded address strip** opens the person's live GPS position in the chosen map app (new tab). Uses `person.attributes.latitude` / `longitude` — no additional sensors required.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
maps_provider: google       # google | apple | osm
show_geocoded_location: true
```

| Value | Opens |
|-------|-------|
| `google` | `https://www.google.com/maps?q=lat,lon` |
| `apple` | `https://maps.apple.com/?ll=lat,lon` |
| `osm` | `https://www.openstreetmap.org/?mlat=lat&mlon=lon` |

> **Tip:** On mobile, `apple` opens the native Maps app on iOS; `google` opens the Google Maps app if installed.

---

## 🎭 Examples

### Family Dashboard — Modern Layout

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: modern
    weather_entity: weather.home
    show_weather: true
    modern_picture_size: 50
    state:
      - value: home
        name: 🏡 Home
        styles:
          name:
            color: '#50A14F'
      - value: not_home
        name: 🚗 Away
        styles:
          name:
            color: '#e45649'

  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: modern
    weather_entity: weather.home
    show_weather: true
    modern_picture_size: 50
```

### Multiple People — Compact Grid

```yaml
type: grid
columns: 2
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.child
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.grandpa
    layout: compact
    compact_width: 280
```

### Futuristic — Holographic 3D with Weather

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: holo
weather_entity: weather.home
show_weather: true
state:
  - value: home
    name: 🏡 Home
    styles:
      name:
        color: '#00ff88'
  - value: not_home
    name: 🚀 Away
    styles:
      name:
        color: '#ff6b35'
```

### Minimal Sidebar Card

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
show_watch_battery: false
show_travel_time: false
show_distance: false
show_activity: false
show_connection: false
```

---

## 🎬 Animated Emoji Avatar (Memoji / AR Emoji)

You can use a **real animated GIF of your Memoji or AR Emoji** as the person's avatar — it will loop automatically inside the card, giving it a very personal and lively look.

### How to create it (iPhone — Memoji)

1. **Open iMessage** on your iPhone and start a new message
2. Tap the **Memoji button** (the smiley face icon in the keyboard bar)
3. Select your Memoji → tap **Record** (hold the big button to record a short animation — wave, nod, thumbs up, etc.)
4. Send it to yourself or **AirDrop** the sticker pack to your Mac
5. On your Mac, open the received file and **export the frame/clip** as a video or image sequence
6. Go to **remove.bg** and upload the video/frame to remove the background → download as PNG
7. Convert PNG sequence or clip to **GIF** using any free tool (e.g. ezgif.com — upload frames → make GIF)
8. Copy the GIF to your Home Assistant `/config/www/` folder (e.g. `/config/www/marco-home.gif`)

> **Tip:** Create one GIF per state — wave for `home`, thumbs up for arriving, neutral/idle for `away`.

### How to create it (Android — AR Emoji / Bitmoji)

The process is identical:
1. **Samsung AR Emoji** or **Snapchat Bitmoji** → record a short animation
2. Export the video clip to PC
3. Remove background on **remove.bg**
4. Convert to GIF on **ezgif.com**
5. Upload to `/config/www/`

### How to use it in the card

```yaml
entity_picture: /local/marco-home.gif
```

Or set it dynamically using a template sensor that swaps GIF based on state:

```yaml
# configuration.yaml
template:
  - sensor:
      - name: marco_avatar
        state: >
          {% if is_state('person.marco', 'home') %}
            /local/marco-home.gif
          {% elif states('sensor.marco_distance') | float(0) < 2 %}
            /local/marco-arriving.gif
          {% else %}
            /local/marco-away.gif
          {% endif %}
```

Then in the card config:
```yaml
entity_picture: "{{ states('sensor.marco_avatar') }}"
```

---

## 🔍 Troubleshooting

### Card doesn't appear
- Check browser console (F12) for errors
- Verify resource is loaded: Settings → Dashboards → ⋮ → Resources
- Hard refresh: Ctrl+Shift+R

### Sensors not found
- Check Companion App is installed and has permissions
- Verify sensor names in Developer Tools → States
- Manually specify sensors in configuration

### Editor shows old version after HACS update
- The editor is loaded with a version-specific cache-busting parameter (`?v=1.3.9`)
- Hard refresh the browser after any update

### Images don't show
- Place files in `config/www/`
- Use correct path: `/local/folder/file.png`
- Restart Home Assistant if needed

### Weather background not visible
- Ensure `weather_entity` is set and `show_weather: true`
- Check that `show_weather_background: true`
- Verify the weather entity is in Developer Tools → States

### Layout doesn't change
- Values are case-sensitive: `classic`, `compact`, `modern`, `neon`, `glass`, `bio`, `holo`
- Clear cache and reload

---

## 📝 Changelog

### v1.4.12 (2026-05-01)
- ⏱️ **Travel time hours:minutes** — Travel time ≥ 60 min now shows as `Xh Ym` (e.g. `3h 27m`). Template sensors returning `h:mm` or `HH:MM:SS` strings are now parsed correctly (previously `3:27` was silently truncated to `3 min`).

### v1.4.11 (2026-04-09)
- 🐛 **Charging indicator fix** — WxStation, Holo, Matrix, Orbital, and Ink layouts now correctly show the charging animation/icon for phone battery, watch battery, and second device when charging. Ink layout also had a typo (`_watchCharging`) that prevented the watch indicator from ever showing.
- 📶 **`wifi_ssid_sensor`** — Shows actual Wi-Fi network name instead of "WiFi" in all 11 layouts
- 📡 **Classic & Neon** — Connection chip now shows icon + text label (was icon-only)
- 🐛 Extra chips no longer hidden behind weather background in classic layout

### v1.4.10 (2026-04-04)
- 🧩 **`extra_chips` — Tap actions** — Each extra chip now supports a configurable `tap_action`: `more-info` (default), `call-service`, `navigate`, `url`, or `none`
- 🔧 **`call-service` via HA native picker** — `ha-service-control` is used in both the chip tap action editor and the main card tap action editor, showing the full HA service UI (service picker, target entity selector, schema-based data fields)
- 🎨 **Chip color applies to icon + text** — `color` now tints both the icon and the label simultaneously
- 📶 **`wifi_ssid_sensor`** — Shows the actual Wi-Fi SSID name instead of "WiFi" across all 11 layouts when the device is connected to Wi-Fi
- 📡 **Classic & Neon connection chip** — Now shows icon + connection text label (was icon-only)
- 🐛 Fixed delete button (✕) not rendering in extra chips editor
- 🐛 Fixed `call-service` not executing in some HA versions
- 🐛 Fixed extra chips invisible when weather background is active (classic layout)
- 🐛 Fixed color picker showing misleading default blue when no color is set

### v1.4.9 (2026-04-03)
- 🧩 **`extra_chips`** — Add any HA entity as a custom chip in all 11 layouts. Supports `icon`, `show_when`, `color`, `label`. Fully configurable from the visual editor.

### v1.4.8 (2026-03-31)
- 🗂️ **`state_entity`** — Override the displayed location text with any HA sensor. Home/away logic unaffected.

### v1.4.1 (2026-03-17)
- ✨ **`pair_travel_animation`** — Toggle to disable the alternating distance/travel animation; when off, both chips are shown separately
- ✨ **`transparent_background`** — Glass and Bio layouts: remove the dark background to blend into any dashboard
- 🐛 Fixed HACS install button type (`dashboard` → `plugin`)

### v1.4.0 (2026-03-15)
- 🎨 **`weather_text_color`** — New option to override the color of weather text (temperature, icon, condition label) across all 7 layouts
- 🎨 **`last_changed_color`** — New option to override the color of the last-updated timestamp (classic, neon, holo)
- 🖊️ Both colors exposed in the visual editor's Weather section (color swatch + hex input, 4 languages)

### v1.3.9 (2026-03-14)
- ✨ **New Holographic 3D Layout (`holo`)** — Futuristic card with CSS 3D perspective, rotating rings + orbital dots, iridescent shimmer overlay, animated scan bar, corner tech decorations, and metric chips. Accent color adapts to state. Hover flattens to front view.
- 🐛 Fixed holo layout picker not applying on click
- 🐛 Fixed holo metric chips empty space (height alignment)
- 🐛 Fixed holo pair animation overlap on travel/distance chips
- 🐛 Fixed holo weather background z-index (now visible above shimmer)
- 🐛 Fixed holo distance reading wrong property
- 🐛 Fixed editor cache with HACS — editor now inherits `hacstag` from `import.meta.url`
- 🌤️ Neon layout now shows weather icon + temperature + translated condition label

### v1.3.7 (2026-03-13)
- 🌊 **New Bioluminescence Layout (`bio`)** — Deep ocean theme with glowing orbs, rising particles, double pulsing ring, SVG battery fill, weather footer
- 🌤️ Weather background/temperature split controls — show animated scene and temperature independently
- 🌡️ Weather condition label in compact and modern layouts (icon + temp + translated state)
- 🐛 Fixed state color picker not updating avatar border in classic/compact
- 🐛 Fixed bio layout accent color not applied to avatar border
- 🐛 Fixed dir2 pair animation desync
- 🐛 Fixed weather text unreadable on light/bright backgrounds
- 🐛 Fixed weather-active contrast class now applied to classic and modern

### v1.3.6 (2026-03-11)
- 🐛 Fixed editor not updating after HACS update (dynamic import now includes `?v=` parameter)
- 🔧 `CARD_VERSION` promoted to top-level constant
- 🏷️ Version badge added to visual editor header

### v1.3.5 (2026-03-11)
- 🔋 Glass layout: battery icon redesigned as SVG fill with percentage text; charging pulsing glow
- 📶 Glass layout: connection type moved to header pill next to battery
- 🌦️ Glass layout: weather bar at bottom with icon + temp + translated condition

### v1.3.4 (2026-03-11)
- ✨ **New Glassmorphism Layout (`glass`)** — Dark frosted-glass card with translucent chips, gradient orbs, animated status dot, per-state accent color
- 🔧 `distance_unit` config option — override displayed unit (`km`, `mi`)

### v1.3.3 (2026-03-11)
- 🐛 Fixed distance sensor reading `state` instead of `attributes.distance` (Waze/Google Routes)
- 🐛 Fixed modern layout pair-b ring overflow during alternating animation

### v1.3.2 (2026-03-09)
- 🏢 **Dual Travel Direction** — Smart home/work two-sensor system with automatic direction switching
- 🌦️ **Rich Weather Animations** — 15 fully animated weather states (sunny, clear-night, cloudy, rainy, snowy, lightning, hail, fog, windy, and more)
- 📍 Weather temperature positioning per layout
- Seeded PRNG (`_rng(seed)`) for deterministic particle rendering

### v1.3.1 (2026-03-07)
- ✨ **New Neon Layout (`neon`)** — Cyberpunk dark theme with glowing neon badges and monospace font

### v1.2.0 (2025-05-30)
- ✨ **New Modern Layout** with circular SVG progress rings
- 🟢 State-colored picture border
- 🎯 Icon badges for activity and connection
- 📐 Auto-expanding responsive design

### v1.1.2 (2025-01-25)
- 📏 Dynamic distance unit from entity attributes
- 🔤 State and last-changed font customization
- 🤖 Fixed Android WiFi detection

### v1.1.1 (2024-11-24)
- 🌍 Complete multilanguage support (EN, IT, FR, DE)

### v1.1.0 (2024-11-23)
- ✨ New compact layout mode
- ⌚ Watch battery support

### v1.0.0 (2024-11-22)
- 🎉 Initial release — visual editor, Companion App support, custom states, Waze integration

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 💝 Support

If you find this card useful:
- ⭐ Star the repository
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features
- 🤝 Contribute code

---

## 🙏 Credits

- Home Assistant Community
- HACS Team
- All contributors

---

**Made with ❤️ for the Home Assistant Community**

---

<a name="versione-italiana"></a>
# 👤 Person Tracker Card per Home Assistant

**[🇬🇧 English](#english-version) | [🇮🇹 Versione Italiana](#versione-italiana)**

---

## ✨ Caratteristiche Principali

- 🎨 **Undici Modalità di Layout** — Classic, Compact, Modern, Neon, Glass, Bioluminescence, Holographic 3D, Weather Station, Matrix Rain, Orbital, Liquid Ink
- 🪐 **Posizione Geocodificata** — Mostra l'indirizzo stradale quando la persona non è a casa (attivo per impostazione predefinita)
- 🗺️ **Integrazione Mappe** — Clicca sulla zona o sull'indirizzo per aprire Google Maps, Apple Maps o OpenStreetMap con le coordinate GPS in tempo reale
- 🌦️ **Animazioni Meteo Ricche** — 15 stati meteo completamente animati come sfondo della card
- 📱 **Rilevamento Automatico Sensori** — Trova automaticamente batteria, attività, connessione dall'app Companion
- 🔋 **Monitoraggio Batteria** — Batteria telefono con icona e colore dinamici
- ⌚ **Batteria Smartwatch** — Supporto Apple Watch e altri smartwatch
- 🚶 **Tracciamento Attività** — Walking, Running, Automotive, Stationary, Cycling
- 📍 **Distanza da Casa** — Integrazione Waze / Google Routes
- ⏱️ **Modalità Viaggio Intelligente** — Sistema a due sensori bidirezionale (casa↔lavoro)
- 📶 **Tipo Connessione** — Indicatore WiFi o rete mobile
- 🎨 **Stati Personalizzabili** — Colori e immagini diverse per ogni posizione
- 🖼️ **Immagini Personalizzate** — Supporto PNG/GIF con trasparenza
- 🎯 **Editor Visuale Completo** — Configurazione tramite GUI in 4 lingue
- 🌍 **Multilingua** — Italiano, Inglese, Francese, Tedesco

---

## 🎨 Modalità Layout

### Classic
Card a dimensione intera con elementi posizionabili liberamente.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: classic
aspect_ratio: '1/0.7'
picture_size: 60
battery_position: top-right
activity_position: bottom-left
```

### Compact
Layout a griglia orizzontale. Ideale per più persone affiancate.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: compact
compact_width: 300
```

### Modern
Card orizzontale elegante con anelli SVG circolari di progresso per batteria, distanza e tempo di viaggio.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
modern_picture_size: 45
modern_name_font_size: '16px'
modern_state_font_size: '13px'
```

### Neon ✦
Tema cyberpunk scuro con badge neon luminosi e font monospace.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: neon
```

### Glass ◈
Card glassmorphism con chip traslucidi, orb a gradiente e punto di stato animato. Il colore accentato si adatta allo stato della persona.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: glass
```

### Bioluminescence ◉
Tema oceano profondo con orb luminosi animati, particelle ascendenti, doppio anello pulsante intorno all'avatar, riempimento batteria SVG e barra meteo in basso.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: bio
```

### Holographic 3D ◈
Card futuristica con prospettiva CSS 3D reale — la card fluttua e si inclina nello spazio 3D con animazione continua. Anelli rotanti + punti orbitali intorno all'avatar, shimmer iridescente, barra di scansione animata, decorazioni tech agli angoli e chip metrici. Al passaggio del mouse si appiattisce.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: holo
```

### Weather Station 🌦️
Dashboard meteo personale con animazione meteo nella sezione superiore e griglia di gauge (batteria, orologio, vento, umidità, pressione, temperatura percepita). I sensori in overflow appaiono come chip sotto la griglia.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: wxstation
weather_entity: weather.home
show_weather: true
```

### Matrix Rain 🖥️
Tema terminale/hacker con caratteri katakana ed esadecimali animati in caduta libera. Avatar quadrato con scanline CRT e barra di scansione animata. Blocchi statistici monospace con barre di progresso verde fosforo.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: matrix
```

### Orbital 🪐
Tema spaziale sci-fi con una moneta 3D rotante (fronte = foto, retro = livelli batteria di tutti i dispositivi), tre anelli orbitali inclinati, fino a quattro satellite badge in orbita (connessione, attività, distanza/tempo di viaggio), anelli di impulso animati, stelle scintillanti e griglia in prospettiva. Il colore accentato si adatta allo stato: verde acqua quando a casa, viola quando lontano, blu per zone personalizzate.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: orbital
show_weather: true
weather_entity: weather.home
show_geocoded_location: true
```

### Liquid Ink 🖋️
L'unico tema in **modalità chiara**. Sfondo bianco puro con ombre nette ed elementi in rilievo. Layout orizzontale: foto avatar con anello colorato in base allo stato a sinistra, nome / zona / ora / indirizzo geocodificato al centro, pannello batteria a destra. Sotto, un separatore sfumato con il colore accent divide la riga info dai chip sensori. Colori accent per stato: blu (a casa), viola (lontano), teal (altre zone) — personalizzabili per stato. Supporto completo per indirizzo geocodificato, integrazione mappe e meteo — quando il meteo è attivo lo sfondo viene sostituito dalla scena meteo animata e il testo passa in bianco ad alto contrasto.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: ink
maps_provider: google
show_geocoded_location: true
```

---

## 🌦️ Animazioni Meteo

Abilita lo sfondo meteo animato fornendo un'entità `weather`:

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
weather_entity: weather.home
show_weather: true
show_weather_background: true
show_weather_temperature: true
```

Funziona su tutti e 11 i layout. Le opzioni `show_weather_background` e `show_weather_temperature` sono indipendenti — puoi mostrare solo la scena animata, solo la temperatura, o entrambe.

---

## 📦 Installazione

### Via HACS (Consigliato)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=djdevil&repository=person-tracker-card&category=plugin)  [![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)

> [!NOTE]
> Se il pulsante non funziona, segui i passaggi manuali qui sotto.

<details>
<summary>📋 Istruzioni installazione manuale HACS</summary>

**HACS v2 (nuova interfaccia):**
1. Apri HACS
2. Clicca il menu **⋮** (in alto a destra) → **Repository personalizzati**
3. URL repository: `https://github.com/djdevil/person-tracker-card`
4. Categoria: **Dashboard** → **Aggiungi**
5. Cerca `Person Tracker Card` → **Scarica**
6. Riavvia Home Assistant

**HACS v1 (vecchia interfaccia):**
1. HACS → Frontend → **⋮** → **Repository personalizzati**
2. URL repository: `https://github.com/djdevil/person-tracker-card`
3. Categoria: **Dashboard** → **Aggiungi**
4. Cerca `Person Tracker Card` → **Installa**
5. Riavvia Home Assistant

</details>

### Installazione Manuale

1. Scarica `person-tracker-card.js` e `person-tracker-card-editor.js`
2. Copia in `config/www/person-tracker-card/`
3. Aggiungi risorsa:
   - Impostazioni → Dashboard → ⋮ → Risorse → **+ AGGIUNGI RISORSA**
   - URL: `/local/person-tracker-card/person-tracker-card.js`
   - Tipo: **Modulo JavaScript**
4. Ricarica forzata browser (Ctrl+Shift+R)

---

## 🔧 Configurazione

### Quick Start (Editor GUI)

1. Modifica dashboard → Aggiungi card
2. Cerca **Person Tracker Card**
3. Seleziona entità **person**
4. Scegli il **layout**
5. Configura sensori e stile — i sensori vengono rilevati automaticamente dall'app Companion

### YAML Base

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: orbital   # classic / compact / modern / neon / glass / bio / holo / wxstation / matrix / orbital
```

### Configurazione Completa con Meteo

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern

# Meteo
weather_entity: weather.home
show_weather: true
show_weather_background: true
show_weather_temperature: true

# Visualizzazione
show_entity_picture: true
show_name: true
show_battery: true
show_watch_battery: true
show_activity: true
show_connection: true
show_distance: true
show_travel_time: true

# Sensori personalizzati (opzionale — rilevati automaticamente)
battery_sensor: sensor.iphonedavide_battery_level
watch_battery_sensor: sensor.watch_davide_battery_level
activity_sensor: sensor.iphonedavide_activity
connection_sensor: sensor.iphonedavide_connection_type
wifi_ssid_sensor: sensor.iphonedavide_wi_fi_connection  # opzionale: mostra nome rete Wi-Fi
distance_sensor: sensor.waze_davide

# Stile
card_background: 'rgba(255,255,255,0.05)'
card_border_radius: '15px'

# Stati personalizzati
state:
  - value: home
    name: 🏡 Casa
    styles:
      name:
        color: '#50A14F'
  - value: not_home
    name: 🚗 Fuori
    styles:
      name:
        color: '#e45649'
  - value: work
    name: 🏢 Lavoro
    styles:
      name:
        color: '#ffa229'
```

---

## 📱 Integrazione App Mobile

### Permessi Richiesti

**iOS — App Home Assistant Companion:**
1. Posizione: Impostazioni → App → Posizione → **Sempre**
2. Movimento e Fitness: Impostazioni → Privacy → Movimento e Fitness → **ON**

**Android — App Home Assistant Companion:**
1. Posizione: Consenti sempre
2. Attività Fisica: Abilita nelle impostazioni app

### Rilevamento Automatico

La card rileva automaticamente i sensori leggendo `person.attributes.device_trackers`, trovando il primo tracker con `sensor.{prefisso}_battery_level` e usando quel prefisso per tutti gli altri sensori.

**Esempio per `person.davide` con iPhone (`iphonedavide`):**
```
sensor.iphonedavide_battery_level   → batteria telefono
sensor.iphonedavide_activity        → attività
sensor.iphonedavide_connection_type → tipo connessione
```

L'editor visuale pre-compila tutti i picker automaticamente.

### Integrazione Waze / Google Routes

1. Impostazioni → Dispositivi e Servizi → Aggiungi Integrazione
2. Cerca **Waze Travel Time** (o Google Routes)
3. Configura:
   - Origine: `zone.home`
   - Destinazione: `person.nome`
   - Nome: `waze_nome`

---

## 🗺️ Modalità Viaggio Intelligente

Configura due sensori per il cambio automatico di direzione:

```yaml
type: custom:person-tracker-card
entity: person.davide

# Direzione 1: casa → lavoro
distance_sensor: sensor.waze_davide_al_lavoro
travel_sensor: sensor.waze_davide_al_lavoro
show_distance: true
show_travel_time: true

# Direzione 2: lavoro → casa
distance_sensor_2: sensor.waze_davide_a_casa
travel_sensor_2: sensor.waze_davide_a_casa
show_distance_2: true
show_travel_time_2: true

zone_2: work
```

**Logica:**
- Persona **a casa** → mostra direzione 2 (casa→lavoro), nasconde direzione 1
- Persona **a `zone_2`** (lavoro) → mostra direzione 1 (lavoro→casa), nasconde direzione 2
- Persona **altrove** → entrambe le direzioni visibili con animazione alternata

---

## 🧩 Chip Extra

Aggiungi qualsiasi entità di Home Assistant come chip personalizzato in tutti gli 11 layout. Utile per Bluetooth, Android Auto, stato chiamata, modalità silenziosa, NFC e qualsiasi sensore binario/sensore dell'app Companion.

```yaml
extra_chips:
  - entity: binary_sensor.iphonedavide_bluetooth       # obbligatorio
    icon: mdi:bluetooth                                 # opzionale — rilevato dall'icona entità
    label: BT                                           # opzionale — testo mostrato; ometti per mostrare lo stato tradotto
    show_when: "on"                                     # opzionale — mostra solo quando lo stato corrisponde
    color: "#4a9eff"                                    # opzionale — colore icona e testo
    tap_action:                                         # opzionale — default: more-info
      action: more-info                                 # more-info | call-service | navigate | url | none

  - entity: light.corridoio
    icon: mdi:lightbulb
    show_when: "on"
    color: "#ffcc44"
    tap_action:
      action: call-service
      service: light.toggle

  - entity: input_boolean.modalita_lavoro
    tap_action:
      action: navigate
      navigation_path: /lovelace/lavoro
```

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `entity` | string | Qualsiasi entity ID di HA |
| `icon` | string | `mdi:xxx` — usa l'icona reale dell'entità se non specificato |
| `label` | string | Testo personalizzato. Se omesso, mostra lo stato tradotto |
| `show_when` | string | Mostra il chip solo quando `entity.state === show_when` |
| `color` | string | Colore esadecimale applicato sia all'icona che al testo |
| `tap_action` | object | `action`: `more-info` / `call-service` / `navigate` / `url` / `none` |

**Posizione nei layout:**
- **Classic / Neon / Glass / Bio / Matrix / Ink**: chip aggiunti alla riga chip esistente
- **Compact**: mini badge solo icona nella riga superiore
- **Modern**: cerchi stile anello coerenti con il tema del layout
- **Holo / WxStation / Orbital**: sezione dedicata sotto le metriche principali

Configurabile completamente dall'**editor visuale** — Tab Sensori → Chip Extra Personalizzati.

---

## 📍 Integrazione Mappe

Quando `maps_provider` è impostato, cliccando sul **nome della zona/stato** o sulla **strip dell'indirizzo geocodificato** si apre la posizione GPS in tempo reale nell'app mappa scelta (nuova scheda). Usa `person.attributes.latitude` / `longitude` — nessun sensore aggiuntivo necessario.

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
maps_provider: google       # google | apple | osm
show_geocoded_location: true
```

| Valore | Apre |
|--------|------|
| `google` | Google Maps con coordinate GPS |
| `apple` | Apple Maps (apre l'app nativa su iOS) |
| `osm` | OpenStreetMap |

> **Suggerimento:** Su mobile, `apple` apre direttamente l'app Mappe di iOS; `google` apre l'app Google Maps se installata.

---

## 🎭 Esempi

### Dashboard Famiglia — Modern con Meteo

```yaml
type: vertical-stack
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: modern
    weather_entity: weather.home
    show_weather: true
    modern_picture_size: 50
    state:
      - value: home
        name: 🏡 Casa
        styles:
          name:
            color: '#50A14F'
      - value: not_home
        name: 🚗 Fuori
        styles:
          name:
            color: '#e45649'

  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: modern
    weather_entity: weather.home
    show_weather: true
    modern_picture_size: 50
```

### Griglia Compact — Più Persone

```yaml
type: grid
columns: 2
cards:
  - type: custom:person-tracker-card
    entity: person.davide
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.nunzia
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.bambino
    layout: compact
    compact_width: 280

  - type: custom:person-tracker-card
    entity: person.nonno
    layout: compact
    compact_width: 280
```

### Card Minimal Sidebar

```yaml
type: custom:person-tracker-card
entity: person.davide
layout: modern
show_watch_battery: false
show_travel_time: false
show_distance: false
show_activity: false
show_connection: false
```

---

## 🎬 Avatar Emoji Animato (Memoji / AR Emoji)

Puoi usare una **GIF animata del tuo Memoji o AR Emoji** come avatar della persona — si ripeterà automaticamente nella card, rendendola viva e personalissima.

### Come crearla (iPhone — Memoji)

1. **Apri iMessage** sul tuo iPhone e inizia un nuovo messaggio
2. Tocca il **pulsante Memoji** (faccina nella barra della tastiera)
3. Seleziona il tuo Memoji → tocca **Registra** (tieni premuto il tasto grande per registrare una breve animazione — saluto, annuire, pollice su, ecc.)
4. Invialo a te stesso oppure usa **AirDrop** per mandarlo al Mac
5. Sul Mac, apri il file ricevuto ed **esporta il frame/clip** come video o sequenza di immagini
6. Vai su **remove.bg**, carica il video/frame per rimuovere lo sfondo → scarica come PNG
7. Converti la sequenza PNG o il clip in **GIF** con un tool gratuito (es. ezgif.com — carica i frame → crea GIF)
8. Copia la GIF nella cartella `/config/www/` di Home Assistant (es. `/config/www/marco-casa.gif`)

> **Consiglio:** Crea una GIF per ogni stato — saluto per `home`, pollice su per l'arrivo, neutro/idle per `away`.

### Come crearla (Android — AR Emoji / Bitmoji)

Il procedimento è identico:
1. **Samsung AR Emoji** o **Snapchat Bitmoji** → registra una breve animazione
2. Esporta il clip video sul PC
3. Rimuovi lo sfondo su **remove.bg**
4. Converti in GIF su **ezgif.com**
5. Carica in `/config/www/`

### Come usarla nella card

```yaml
entity_picture: /local/marco-casa.gif
```

Oppure in modo dinamico con un template sensor che cambia GIF in base allo stato:

```yaml
# configuration.yaml
template:
  - sensor:
      - name: marco_avatar
        state: >
          {% if is_state('person.marco', 'home') %}
            /local/marco-casa.gif
          {% elif states('sensor.marco_distanza') | float(0) < 2 %}
            /local/marco-arrivo.gif
          {% else %}
            /local/marco-fuori.gif
          {% endif %}
```

Poi nella config della card:
```yaml
entity_picture: "{{ states('sensor.marco_avatar') }}"
```

---

## 🔍 Risoluzione Problemi

### La card non appare
- Controlla console browser (F12) per errori
- Verifica risorsa caricata in Impostazioni → Dashboard → Risorse
- Ricarica forzata: Ctrl+Shift+R

### Sensori non trovati
- Controlla che l'app Companion sia installata e abbia i permessi
- Verifica nomi sensori in Strumenti Sviluppatore → Stati
- Specifica manualmente i sensori nella configurazione

### Editor mostra versione vecchia dopo aggiornamento HACS
- Il file editor viene caricato con parametro cache-busting (`?v=1.3.9`)
- Esegui ricarica forzata del browser dopo ogni aggiornamento

### Immagini non appaiono
- Inserisci file in `config/www/`
- Usa percorso corretto: `/local/cartella/file.png`
- Riavvia Home Assistant se necessario

### Sfondo meteo non visibile
- Verifica che `weather_entity` sia impostata e `show_weather: true`
- Controlla `show_weather_background: true`
- Verifica l'entità meteo in Strumenti Sviluppatore → Stati

### Layout non cambia
- I valori sono case-sensitive: `classic`, `compact`, `modern`, `neon`, `glass`, `bio`, `holo`
- Svuota cache e ricarica

---

## 📝 Changelog

### v1.4.12 (2026-05-01)
- ⏱️ **Tempo di viaggio ore:minuti** — Il tempo di viaggio ≥ 60 min viene ora mostrato come `Xh Ym` (es. `3h 27m`). I sensori template che restituiscono stringhe `h:mm` o `HH:MM:SS` vengono ora interpretati correttamente (in precedenza `3:27` veniva silenziosamente troncato a `3 min`).

### v1.4.11 (2026-04-09)
- 🐛 **Fix indicatore di ricarica** — Layout WxStation, Holo, Matrix, Orbital e Ink mostrano ora correttamente l'animazione/icona di ricarica per telefono, smartwatch e secondo dispositivo. Nel layout Ink era presente un typo (`_watchCharging`) che impediva lo showing dell'indicatore watch.
- 📶 **`wifi_ssid_sensor`** — Mostra il nome reale della rete Wi-Fi invece di "WiFi" in tutti gli 11 layout
- 📡 **Classic e Neon** — Il chip connessione mostra ora icona + testo (prima era solo icona)
- 🐛 I chip extra non vengono più nascosti dallo sfondo meteo nel layout classic

### v1.4.10 (2026-04-04)
- 🧩 **`extra_chips` — Azioni al tocco** — Ogni chip extra ora supporta un `tap_action` configurabile: `more-info` (default), `call-service`, `navigate`, `url`, `none`
- 🔧 **`call-service` tramite picker nativo HA** — `ha-service-control` usato sia nell'editor azioni chip che nell'editor azione card principale (picker servizio, selettore entità target, campi dati basati sullo schema)
- 🎨 **Colore chip su icona e testo** — `color` colora simultaneamente sia l'icona che l'etichetta
- 📶 **`wifi_ssid_sensor`** — Mostra il nome reale della rete Wi-Fi al posto di "WiFi" in tutti gli 11 layout quando il dispositivo è connesso al Wi-Fi
- 📡 **Chip connessione Classic e Neon** — Ora mostrano icona + testo del tipo di connessione (prima era solo icona)
- 🐛 Fix pulsante elimina chip (✕) non visibile nell'editor
- 🐛 Fix `call-service` non eseguito in alcune versioni di HA
- 🐛 Fix chip extra non visibili quando lo sfondo meteo è attivo (layout classic)
- 🐛 Fix color picker che mostrava blu di default quando nessun colore era impostato

### v1.4.9 (2026-04-03)
- 🧩 **`extra_chips`** — Aggiungi qualsiasi entità HA come chip personalizzato in tutti gli 11 layout. Supporta `icon`, `show_when`, `color`, `label`. Configurabile dall'editor visuale.

### v1.4.8 (2026-03-31)
- 🗂️ **`state_entity`** — Sovrascrive il testo della posizione visualizzata con qualsiasi sensore HA. La logica home/away rimane invariata.

### v1.4.1 (2026-03-17)
- ✨ **`pair_travel_animation`** — Toggle per disabilitare l'animazione alternata distanza/tempo; quando disattivato mostra entrambi i chip separati
- ✨ **`transparent_background`** — Layout Glass e Bio: rimuove lo sfondo scuro per integrarsi con qualsiasi dashboard
- 🐛 Fix pulsante HACS: tipo corretto da `plugin` a `dashboard`

### v1.4.0 (2026-03-15)
- 🎨 **`weather_text_color`** — Nuova opzione per sovrascrivere il colore del testo meteo (temperatura, icona, condizione) su tutti e 7 i layout
- 🎨 **`last_changed_color`** — Nuova opzione per sovrascrivere il colore del timestamp di aggiornamento (classic, neon, holo)
- 🖊️ Entrambi i colori esposti nell'editor visuale nella sezione Meteo (swatch + input hex, 4 lingue)

### v1.3.9 (2026-03-14)
- ✨ **Nuovo Layout Holographic 3D (`holo`)** — Card futuristica con prospettiva CSS 3D, anelli rotanti, shimmer iridescente, barra di scansione e chip metrici
- 🐛 Vari fix per il layout holo (picker, chip, animazioni, meteo, distanza)
- 🐛 Fix cache editor con HACS
- 🌤️ Neon: ora mostra icona meteo + temperatura + etichetta condizione tradotta

### v1.3.7 (2026-03-13)
- 🌊 **Nuovo Layout Bioluminescence (`bio`)** — Tema oceano profondo con orb luminosi, particelle, anello pulsante, batteria SVG, barra meteo
- 🌤️ Controlli separati per sfondo meteo e temperatura
- 🌡️ Etichetta condizione meteo in compact e modern
- 🐛 Vari fix (colore stato su bordo avatar, desync animazione dir2, contrasto testo meteo)

### v1.3.6 (2026-03-11)
- 🐛 Fix editor non aggiornato dopo HACS update
- 🏷️ Badge versione nell'editor visuale

### v1.3.5 (2026-03-11)
- 🔋 Glass: icona batteria SVG con percentuale; barra meteo in basso

### v1.3.4 (2026-03-11)
- ✨ **Nuovo Layout Glassmorphism (`glass`)** — Card vetro satinato con chip traslucidi e accento per stato

### v1.3.3 (2026-03-11)
- 🐛 Fix lettura distanza da `attributes.distance` (Waze/Google Routes)

### v1.3.2 (2026-03-09)
- 🏢 **Modalità Viaggio Doppia Direzione** — Sistema automatico casa↔lavoro
- 🌦️ **Animazioni Meteo Ricche** — 15 stati animati (sole, notte, pioggia, neve, fulmine, grandine, nebbia, vento…)

### v1.3.1 (2026-03-07)
- ✨ **Nuovo Layout Neon (`neon`)** — Tema cyberpunk scuro con badge neon e font monospace

### v1.2.0 (2025-05-30)
- ✨ **Nuovo Layout Modern** con anelli SVG circolari di progresso

### v1.1.x (2024–2025)
- Multilingua (EN, IT, FR, DE), layout compact, supporto smartwatch, rilevamento WiFi Android

### v1.0.0 (2024-11-22)
- 🎉 Prima release — editor visuale, supporto Companion App, stati personalizzabili, integrazione Waze

---

## 🤝 Contribuire

Contributi benvenuti!

1. Fai Fork del repository
2. Crea un feature branch (`git checkout -b feature/FunzionalitàFica`)
3. Committa (`git commit -m 'Aggiungi FunzionalitàFica'`)
4. Push (`git push origin feature/FunzionalitàFica`)
5. Apri una Pull Request

---

## 📄 Licenza

Licenza MIT — vedi file [LICENSE](LICENSE)

---

## 💝 Supporto

Se trovi utile questa card:
- ⭐ Stella il repository
- 🐛 Segnala bug tramite GitHub Issues
- 💡 Suggerisci funzionalità
- 🤝 Contribuisci al codice

---

## 🙏 Ringraziamenti

- Home Assistant Community
- HACS Team
- Tutti i contributori

---

**Realizzato con ❤️ per la Community Home Assistant**