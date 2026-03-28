# AlertTicker Card for Home Assistant

A custom Lovelace card to display alerts and notifications based on entity states. Supports **17 visual themes** with per-alert theme assignment, 3D fold animation cycling, priority ordering, and a complete visual editor — all without writing a single line of YAML.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/djdevil/AlertTicker-Card)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/divil17f)

---

## Features at a Glance

| Feature | Details |
|---------|---------|
| **Themes** | 17 visual themes grouped by category |
| **Per-alert theme** | Each alert has its own independent theme |
| **Multiple entities** | Unlimited alerts per card |
| **Priority system** | 4 levels — Critical, Warning, Info, Low |
| **Fold animation** | 3D page-turn transition when cycling alerts |
| **Visual editor** | Full GUI — no YAML required |
| **Languages** | Italian, English, French, German |
| **HACS compatible** | Cache-busting via `import.meta.url` |
| **Performance** | Signature-based dirty check — no unnecessary re-renders |

---

## Themes

Themes are grouped by category. Selecting a theme automatically sets the matching icon and default message. You can always override the icon with any emoji.

### 🚨 Critical

| Theme | Icon | Visual style |
|-------|------|-------------|
| `emergency` | 🚨 | Dark red card with pulsing red glow and flashing siren icon |
| `fire` | 🔥 | Deep orange card with flame flicker animation |
| `alarm` | 🔴 | Black card with rapid red strobe effect |
| `lightning` | 🌩️ | Dark purple card with electric glow and lightning flash |

### ⚠️ Warning

| Theme | Icon | Visual style |
|-------|------|-------------|
| `warning` | ⚠️ | Dark amber card with orange left border and pulsing dot |
| `caution` | 🟡 | Black/yellow card with diagonal stripe bar and blinking dot |

### ℹ️ Info

| Theme | Icon | Visual style |
|-------|------|-------------|
| `info` | ℹ️ | Dark blue card with blue left border and circular icon wrap |
| `notification` | 🔔 | Deep navy card with blue app-icon bubble and pulsing red badge |
| `aurora` | 🌌 | Dark card with shifting aurora gradient background |

### ✅ OK / All Clear

| Theme | Icon | Visual style |
|-------|------|-------------|
| `success` | ✅ | Dark green card with green left border |
| `check` | 🟢 | Dark green card with pulsing ring around icon |
| `confetti` | 🎉 | Dark green card with floating coloured particles |

### 🎨 Style

| Theme | Icon | Visual style |
|-------|------|-------------|
| `ticker` | 📰 | Full-width scrolling news ticker bar with all active alerts |
| `neon` | ⚡ | Cyberpunk black card with cyan/magenta glow and scanning line |
| `glass` | 🔮 | Glassmorphism card with purple/pink gradient and frosted border |
| `matrix` | 💻 | Terminal-style green-on-black monospace card with blinking cursor |
| `minimal` | 📋 | Clean light card with dynamic accent left border |

> **Note:** The `clear_theme` (all-clear state) only accepts `success`, `check`, or `confetti`.

---

## How It Works

### Alert lifecycle

1. You configure one or more **alerts**, each linked to an entity + trigger state
2. When an entity reaches its trigger state, the alert becomes **active**
3. Active alerts are **sorted by priority** (1=most critical)
4. The card **displays** the highest-priority active alert
5. If multiple alerts are active, it **auto-cycles** through them with a 3D fold transition
6. When no alerts are active and `show_when_clear: true`, the card shows the **all-clear message**
7. When no alerts are active and `show_when_clear: false`, the **card hides itself** completely

### Per-alert theme

Each alert in the list has its own `theme` field. This means:
- Alert 1 (power outage) → `emergency` (red, pulsing)
- Alert 2 (door open) → `caution` (yellow stripes)
- Alert 3 (firmware update) → `info` (blue)

They all coexist on the same card and cycle between each other automatically.

### Theme → icon coherence

When you select a theme in the editor, the icon is automatically set to the theme's default:
- `emergency` → 🚨, `fire` → 🔥, `alarm` → 🔴, `lightning` → 🌩️
- `warning` → ⚠️, `caution` → 🟡
- `info` → ℹ️, `notification` → 🔔, `aurora` → 🌌
- `success` → ✅, `check` → 🟢, `confetti` → 🎉
- `ticker` → 📰, `neon` → ⚡, `glass` → 🔮, `matrix` → 💻, `minimal` → 📋

You can override any icon with a custom emoji in the `icon` field.

### Priority system

Alerts are sorted automatically. You only configure the priority number — the card does the rest.

| Priority | Label | Auto-sort position | Typical use case |
|----------|-------|--------------------|-----------------|
| `1` | Critical | First | Power outage, fire alarm, intrusion detected |
| `2` | Warning | Second | Door left open, water leak, low battery |
| `3` | Info | Third | Firmware update available, calendar reminder |
| `4` | Low | Last | Routine notifications, status messages |

When two alerts share the same priority, they appear in configuration order.

### Auto-cycle with 3D fold animation

When multiple alerts are active:
- A **counter** (e.g. `2/3`) appears in the top-right corner
- The card waits `cycle_interval` seconds, then plays a **3D fold-out** animation
- The content swaps to the next alert in priority order
- A **fold-in** animation reveals the new alert
- The loop continues indefinitely until alerts are resolved

The `ticker` theme is the exception — it scrolls all active alerts simultaneously in a single bar without cycling.

### All-clear state

When `show_when_clear: true`:
- The card remains visible even when no alerts are active
- It shows a configurable `clear_message` (e.g. "Everything is fine")
- It uses the `clear_theme` to style the all-clear card (limited to OK themes)
- This is useful to confirm to the user that the card is working and there is genuinely nothing to worry about

---

## Installation

### Via HACS (recommended)

1. Open **HACS → Frontend**
2. Click **⋮ → Custom repositories**
3. Add `https://github.com/djdevil/AlertTicker-Card` as type **Lovelace**
4. Find **AlertTicker Card** and click **Download**
5. **Reload** your browser

### Manual

1. Download `alert-ticker-card.js` and `alert-ticker-card-editor.js` from the [latest release](https://github.com/djdevil/AlertTicker-Card/releases)
2. Copy both files to `/config/www/`
3. Go to **Settings → Dashboards → Resources**
4. Add `/local/alert-ticker-card.js` as a **JavaScript module**
5. **Reload** the browser

---

## Visual Editor

No YAML knowledge required. The editor has two tabs:

### General tab

| Field | Description |
|-------|-------------|
| **Cycle interval** | How many seconds between alerts when multiple are active (default: 5) |
| **Show when no alerts** | Toggle to keep the card visible when everything is OK |
| **Message when clear** | Text to show in the all-clear state |
| **Theme for all-clear** | Visual theme for the all-clear card (OK themes only) |

### Alerts tab

For each alert you can configure:

| Field | Description |
|-------|-------------|
| **Entity** | Select any entity from your HA instance via the native entity picker |
| **Trigger state** | The state value that activates the alert (e.g. `on`, `off`, `unavailable`) |
| **Priority** | 1 (Critical) → 4 (Low) |
| **Message** | The text displayed when this alert is active. Pre-filled with a theme default |
| **Theme** | Visual theme for this specific alert |
| **Icon** | Optional emoji override — leave empty for automatic icon from theme |

You can **reorder** alerts with the ↑ Su / ↓ Giù buttons. The priority number is what controls display order in the card — the list order in the editor is just for your own organisation.

---

## YAML Configuration

Full reference for manual configuration:

```yaml
type: custom:alert-ticker-card
cycle_interval: 5           # seconds between alerts (default: 5)
show_when_clear: false      # show card when no alerts active (default: false)
clear_message: "Tutto ok"   # message when all clear
clear_theme: success        # theme for all-clear (success | check | confetti)
alerts:
  - entity: binary_sensor.power_ground_floor
    state: "off"
    message: "Mancanza corrente al piano terra"
    priority: 1
    theme: emergency
  - entity: sensor.coffee_machine
    state: "empty"
    message: "Caffè esaurito nella macchinetta"
    priority: 2
    theme: warning
    icon: "☕"            # optional emoji override
  - entity: binary_sensor.garage_door
    state: "on"
    message: "Porta garage aperta"
    priority: 3
    theme: caution
```

### Card-level options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cycle_interval` | `number` | `5` | Seconds between alerts when cycling |
| `show_when_clear` | `boolean` | `false` | Show card when no alerts are active |
| `clear_message` | `string` | `""` | Message shown in all-clear state |
| `clear_theme` | `string` | `success` | Theme for all-clear (`success`, `check`, `confetti`) |
| `alerts` | `list` | `[]` | List of alert objects (see below) |

### Alert-level options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | `string` | ✅ | — | Entity ID, e.g. `binary_sensor.smoke_detector` |
| `state` | `string` | ✅ | — | Trigger state value, e.g. `"on"`, `"off"`, `"unavailable"` |
| `message` | `string` | ✅ | — | Text shown when alert is active |
| `theme` | `string` | ✅ | `emergency` | Visual theme (see theme table) |
| `priority` | `number` | ❌ | `1` | 1=Critical · 2=Warning · 3=Info · 4=Low |
| `icon` | `string` | ❌ | *(theme default)* | Emoji override, e.g. `"☕"` |

---

## Examples

### Emergency — power outage

```yaml
type: custom:alert-ticker-card
alerts:
  - entity: binary_sensor.power_sensor
    state: "off"
    message: "Power outage on ground floor"
    priority: 1
    theme: emergency
```

### Fire alarm

```yaml
type: custom:alert-ticker-card
alerts:
  - entity: binary_sensor.smoke_detector
    state: "on"
    message: "Smoke detected in kitchen!"
    priority: 1
    theme: fire
```

### Multiple warnings with cycling

```yaml
type: custom:alert-ticker-card
cycle_interval: 8
alerts:
  - entity: binary_sensor.smoke_detector_battery
    state: "on"
    message: "Smoke detector battery low"
    priority: 2
    theme: warning
  - entity: binary_sensor.motion_sensor_battery
    state: "on"
    message: "Motion sensor battery low"
    priority: 2
    theme: caution
  - entity: binary_sensor.window_contact
    state: "on"
    message: "Living room window left open"
    priority: 3
    theme: info
```

### Scrolling ticker with all active alerts

```yaml
type: custom:alert-ticker-card
show_when_clear: true
clear_message: "No active alerts — all systems normal"
clear_theme: success
alerts:
  - entity: binary_sensor.front_door
    state: "on"
    message: "Front door is open"
    priority: 2
    theme: ticker
  - entity: update.bridge_firmware
    state: "on"
    message: "Firmware update available for Zigbee bridge"
    priority: 3
    theme: ticker
    icon: "🔄"
  - entity: calendar.reminders
    state: "on"
    message: "Appointment reminder: dentist at 3pm"
    priority: 4
    theme: ticker
```

### Neon — security system

```yaml
type: custom:alert-ticker-card
alerts:
  - entity: alarm_control_panel.home
    state: "triggered"
    message: "SECURITY ALARM TRIGGERED"
    priority: 1
    theme: neon
    icon: "🔒"
```

### All-priorities mixed — full example

```yaml
type: custom:alert-ticker-card
cycle_interval: 6
show_when_clear: true
clear_message: "Tutti i sistemi operativi"
clear_theme: confetti
alerts:
  - entity: binary_sensor.fire_sensor
    state: "on"
    message: "Rilevato fumo in cucina"
    priority: 1
    theme: fire
  - entity: binary_sensor.door_lock
    state: "off"
    message: "Porta di ingresso aperta"
    priority: 2
    theme: alarm
  - entity: binary_sensor.water_leak
    state: "on"
    message: "Perdita d'acqua sotto il lavandino"
    priority: 2
    theme: lightning
  - entity: sensor.temperature_outdoor
    state: "unavailable"
    message: "Sensore temperatura non disponibile"
    priority: 3
    theme: notification
  - entity: calendar.home_reminders
    state: "on"
    message: "Promemoria in scadenza oggi"
    priority: 4
    theme: minimal
```

---

## Languages

The card automatically detects the language from your Home Assistant settings (`configuration.yaml → homeassistant: language`). No manual configuration needed.

| Language | Code | Fallback |
|----------|------|---------|
| Italian | `it` | — |
| English | `en` | ✅ default |
| French | `fr` | — |
| German | `de` | — |

All UI labels, category names, default messages, and editor strings are fully translated in all four languages. Any unsupported language automatically falls back to English.

---

## Technical Notes

### Entity picker in the editor

The card uses the native `ha-entity-picker` component from Home Assistant. This component is loaded lazily by HA. To ensure it is available when the editor opens, the card uses the `hui-glance-card.getConfigElement()` technique — the standard community pattern for forcing HA to load the picker before the editor renders.

### Cache busting

Both `alert-ticker-card.js` and `alert-ticker-card-editor.js` use `import.meta.url` with a `?v=` version query parameter. This ensures browsers always load the latest version after an update, even if the file is cached.

### Performance

The `set hass()` setter uses a **signature string** (all entity IDs concatenated with their current states) to detect whether any relevant entity has changed. If the signature is identical to the previous update, the re-render is skipped entirely. This avoids unnecessary DOM updates when unrelated entities change in HA.

---

## Troubleshooting

**Card not appearing after installation**
- Make sure you added `alert-ticker-card.js` as a JavaScript module resource in Settings → Dashboards → Resources
- Hard-reload the browser (Ctrl+Shift+R / Cmd+Shift+R)

**Entity picker not showing in editor**
- This is a known HA lazy-loading issue. The card handles it automatically via `hui-glance-card.getConfigElement()`. If it still doesn't appear, try closing and reopening the editor.

**Card disappears when alerts resolve**
- This is by design. Set `show_when_clear: true` to keep the card visible with an all-clear message.

**Trigger state not matching**
- State values are case-sensitive and must be exact strings. Check the entity state in Developer Tools → States. Common values: `"on"`, `"off"`, `"unavailable"`, `"home"`, `"away"`, `"triggered"`.

**All alerts cycling too fast**
- Increase `cycle_interval`. Minimum is 1 second, recommended is 5–10 seconds.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting bugs, suggesting features, and contributing code.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Support

If you find this card useful, consider buying me a coffee ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/divil17f)
