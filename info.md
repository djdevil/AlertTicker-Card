# 🔔 AlertTicker Card

The most complete alert & notification card for Home Assistant — **52 visual themes**, TTS, push notifications, global overlay banner, media player mode, weather widget, and a full visual editor. **Zero YAML required.**

![AlertTicker Card demo](https://raw.githubusercontent.com/djdevil/AlertTicker-Card/main/images/demo.gif)

## ✨ Highlights

- 🎨 **52 themes** — from subtle `info` to cinematic 3D, timer countdowns, weather badges, music player mode
- ⚡ **Trigger on anything** — entity state, attribute, template, device class, entity filter with wildcards, AND/OR conditions
- 📢 **Notify everywhere** — in-dashboard ticker, **global overlay banner** visible from any view, **TTS** (Alexa / Google / any speaker), **push notifications**, **live camera streams**
- 🌍 **12 languages** — IT · EN · FR · DE · NL · VI · RU · DA · CS · PT-BR · ES · TR
- 🎯 **Per-alert control** — themes, time windows, user visibility, snooze, priority, actions, group/collapse, `active_state_entity` for HA automations
- 🖼️ **Full visual editor** — every option configurable in the GUI

## 🚀 Quick example

```yaml
type: custom:alert-ticker-card
cycle_interval: 5
show_when_clear: true
clear_display_mode: weather_clock
alerts:
  - entity: binary_sensor.smoke
    state: "on"
    message: "🔥 Smoke detected in {area}!"
    priority: 1
    theme: emergency
  - entity: binary_sensor.garage_door
    state: "on"
    message: "🚪 Garage door left open"
    priority: 2
    theme: warning
  - device_class: battery
    operator: "<"
    state: "15"
    message: "🪫 Low battery: {friendly_name} ({state}%)"
    priority: 3
    theme: caution
```

## 📚 Full documentation

See the full [README](https://github.com/djdevil/AlertTicker-Card#readme) for every option, theme, and advanced configuration example.

## 💬 Support & Community

- 📢 [Official thread on Home Assistant Community Forum](https://community.home-assistant.io/t/alertticker-card-for-home-assistant/1005906)
- 🐛 [Report a bug](https://github.com/djdevil/AlertTicker-Card/issues/new/choose)
- 💡 [Request a feature](https://github.com/djdevil/AlertTicker-Card/discussions)
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/divil17f) — keeps the updates coming!
