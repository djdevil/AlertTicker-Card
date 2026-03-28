# AlertTicker Card for Home Assistant

A custom Lovelace card to display alerts based on entity states, with **9 visual themes** and a complete visual editor.

[![HACS Default](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/djdevil/alert-ticker-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

- **9 visual themes** — from a scrolling news ticker to a cyberpunk neon card
- **Multiple entities** per card — each with its own trigger state and custom message
- **Priority system** — alerts sorted by priority (1=Critical → 4=Low)
- **Auto-cycle** — cycles through active alerts automatically
- **Visual editor** — configure everything without writing YAML
- **Bilingual** — Italian and English, auto-detected from HA settings
- **HACS compatible**

---

## Themes

| Theme | Preview | Description |
|-------|---------|-------------|
| `ticker` | 📰 | Scrolling news ticker bar with all active alerts |
| `emergency` | 🚨 | Dark red pulsing card with flashing icon |
| `warning` | ⚠️ | Amber card with animated pulsing dot |
| `info` | ℹ️ | Blue card with circular icon |
| `success` | ✅ | Green card for resolved/OK states |
| `neon` | ⚡ | Cyberpunk dark card with cyan/magenta glow |
| `glass` | 🔮 | Glassmorphism card with gradient backdrop |
| `matrix` | 💻 | Terminal-style monospace card |
| `minimal` | 📋 | Clean light-mode card with accent border |

---

## Installation

### Via HACS (recommended)

1. Open HACS → Frontend
2. Click **+ Explore & Download Repositories**
3. Search for **AlertTicker Card**
4. Click Download
5. Reload your browser

### Manual

1. Copy `alert-ticker-card.js` and `alert-ticker-card-editor.js` to `/config/www/`
2. In HA go to **Settings → Dashboards → Resources**
3. Add `/local/alert-ticker-card.js` as a JavaScript module
4. Reload the browser

---

## Configuration

### Using the Visual Editor

Click **+ Add Card**, search for **AlertTicker Card**, then use the editor:

- **General tab**: choose theme, cycle interval, "show when clear" option
- **Alerts tab**: add entities, set trigger state, write custom message, choose priority

### YAML Configuration

```yaml
type: custom:alert-ticker-card
theme: emergency
cycle_interval: 5
show_when_clear: false
clear_message: "Tutto ok"
alerts:
  - entity: binary_sensor.power_ground_floor
    state: "off"
    message: "Mancanza corrente al piano terra"
    priority: 1
  - entity: sensor.coffee_machine
    state: "empty"
    message: "Caffè esaurito nella macchinetta"
    priority: 2
    icon: "☕"
  - entity: binary_sensor.garage_door
    state: "on"
    message: "Porta garage aperta"
    priority: 3
```

---

## Configuration Options

### Card options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `emergency` | Visual theme (see list above) |
| `cycle_interval` | number | `5` | Seconds between alerts when multiple are active |
| `show_when_clear` | boolean | `false` | Show card when no alerts are active |
| `clear_message` | string | `"Tutto ok"` / `"All clear"` | Message shown when no alerts are active |
| `alerts` | list | `[]` | List of alert configurations |

### Alert options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `entity` | string | Yes | Entity ID (e.g. `binary_sensor.smoke_detector`) |
| `state` | string | Yes | State that triggers the alert (e.g. `"on"`, `"off"`, `"unavailable"`) |
| `message` | string | Yes | Custom text to display when the alert is active |
| `priority` | number | No | Priority level: `1`=Critical, `2`=Warning, `3`=Info, `4`=Low (default: `1`) |
| `icon` | string | No | Emoji icon override (leave empty for automatic icon) |

---

## Priority System

Alerts are automatically sorted by priority. The most critical alert is always shown first.

| Priority | Label | Auto icon | Use case |
|----------|-------|-----------|----------|
| `1` | Critical | 🚨 | Power outage, fire alarm, intrusion |
| `2` | Warning | ⚠️ | Low battery, door left open, water leak |
| `3` | Info | ℹ️ | Firmware update available, reminder |
| `4` | Low | 🔔 | Routine notifications |

When multiple alerts are active, the card shows the highest-priority one and automatically cycles through the others every N seconds (configurable).

---

## Multiple Active Alerts

When more than one alert is active simultaneously:

- The **highest-priority** alert is shown first
- A **counter indicator** (e.g. `2/3`) shows how many alerts are active
- The card **auto-cycles** through all active alerts at the configured interval
- The **ticker theme** shows all alerts scrolling simultaneously

---

## Examples

### Emergency — power outage

```yaml
type: custom:alert-ticker-card
theme: emergency
alerts:
  - entity: binary_sensor.power_sensor
    state: "off"
    message: "Power outage detected on ground floor"
    priority: 1
```

### Warning — low battery devices

```yaml
type: custom:alert-ticker-card
theme: warning
cycle_interval: 8
alerts:
  - entity: binary_sensor.smoke_detector_battery
    state: "on"
    message: "Smoke detector battery low"
    priority: 2
  - entity: binary_sensor.motion_sensor_battery
    state: "on"
    message: "Motion sensor battery low"
    priority: 2
```

### Ticker — multiple notifications

```yaml
type: custom:alert-ticker-card
theme: ticker
show_when_clear: true
clear_message: "No active alerts"
alerts:
  - entity: binary_sensor.front_door
    state: "on"
    message: "Front door is open"
    priority: 2
  - entity: update.bridge_firmware
    state: "on"
    message: "Firmware update available"
    priority: 3
    icon: "🔄"
```

### Neon — security system

```yaml
type: custom:alert-ticker-card
theme: neon
alerts:
  - entity: alarm_control_panel.home
    state: "triggered"
    message: "SECURITY ALARM TRIGGERED"
    priority: 1
    icon: "🔒"
```

---

## Languages

The card automatically detects the language from your Home Assistant settings.

| Language | Code |
|----------|------|
| Italian | `it` |
| English | `en` (default) |

---

## License

MIT License — see [LICENSE](LICENSE) for details.
