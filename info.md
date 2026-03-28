## AlertTicker Card

Custom Lovelace card for Home Assistant to display alerts based on entity states, with 9 visual themes and a full visual editor.

### Features

- 9 Visual Themes: Ticker, Emergency, Warning, Info, Success, Neon, Glass, Matrix, Minimal
- Multiple entities per card, each with a configurable trigger state
- Custom message per alert
- Priority system (1=Critical → 4=Low)
- Automatic cycling between active alerts
- Full visual editor (no YAML required)
- Languages: Italian, English

### Installation

1. Install via HACS
2. Add the card to your Lovelace dashboard
3. Configure using the visual editor

### Basic Configuration

```yaml
type: custom:alert-ticker-card
theme: emergency
cycle_interval: 5
alerts:
  - entity: binary_sensor.power_sensor
    state: "off"
    message: "Power outage detected"
    priority: 1
  - entity: sensor.coffee_machine
    state: "empty"
    message: "Coffee machine is empty"
    priority: 2
```

### Themes

| Theme | Style |
|-------|-------|
| `ticker` | Scrolling news ticker bar |
| `emergency` | Red pulsing critical alert |
| `warning` | Amber attention card |
| `info` | Blue informational card |
| `success` | Green resolved/OK card |
| `neon` | Cyberpunk glowing card |
| `glass` | Glassmorphism card |
| `matrix` | Terminal/hacker style |
| `minimal` | Clean light-mode card |
