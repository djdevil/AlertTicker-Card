## AlertTicker Card

Custom Lovelace card for Home Assistant to display alerts and notifications based on entity states, with **17 visual themes**, per-alert theme assignment, 3D fold animation cycling, priority ordering, and a complete visual editor in 4 languages.

### Features

- **17 Visual Themes** — Critical, Warning, Info, OK/All-Clear, Style categories
- **Per-alert theme** — each alert has its own independent theme and icon
- **Multiple entities** per card, each with configurable trigger state and message
- **Priority system** (1=Critical → 4=Low) with automatic sorting
- **3D fold animation** when cycling between active alerts
- **All-clear state** — optional message shown when no alerts are active
- **Full visual editor** — no YAML required
- **Languages** — Italian, English, French, German (auto-detected)
- **HACS compatible** — cache-busting via `import.meta.url`

### Themes

| Category | Themes |
|----------|--------|
| Critical | `emergency` 🚨 · `fire` 🔥 · `alarm` 🔴 · `lightning` 🌩️ |
| Warning  | `warning` ⚠️ · `caution` 🟡 |
| Info     | `info` ℹ️ · `notification` 🔔 · `aurora` 🌌 |
| OK       | `success` ✅ · `check` 🟢 · `confetti` 🎉 |
| Style    | `ticker` 📰 · `neon` ⚡ · `glass` 🔮 · `matrix` 💻 · `minimal` 📋 |

### Basic Configuration

```yaml
type: custom:alert-ticker-card
cycle_interval: 5
show_when_clear: true
clear_message: "All systems operational"
clear_theme: success
alerts:
  - entity: binary_sensor.power_sensor
    state: "off"
    message: "Power outage detected"
    priority: 1
    theme: emergency
  - entity: binary_sensor.garage_door
    state: "on"
    message: "Garage door left open"
    priority: 2
    theme: warning
  - entity: update.zigbee_bridge
    state: "on"
    message: "Firmware update available"
    priority: 3
    theme: info
```
