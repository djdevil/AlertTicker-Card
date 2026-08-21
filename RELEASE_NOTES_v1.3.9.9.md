# AlertTicker Card — v1.3.9.9

## What's new

### 🔗 Active state entity — wire each alert to its own HA automation ([#196](https://github.com/djdevil/AlertTicker-Card/discussions/196))

New **per-alert** option `active_state_entity` — each alert can write `on` or `off` to its own dedicated `input_boolean` when it becomes active or clears. Different alerts can target different booleans, enabling independent automations per alert.

```yaml
alerts:
  - entity: sensor.temperature
    operator: '>'
    state: '30'
    message: "🌡️ Temperature too high!"
    active_state_entity: input_boolean.alert_temperature

  - entity: sensor.smoke
    operator: '='
    state: 'detected'
    message: "🔥 Smoke detected!"
    active_state_entity: input_boolean.alert_smoke
```

**Use cases:**
- Turn on a specific coloured lamp for a specific alert
- Trigger different HA scripts depending on which alert fires
- Drive conditional cards or badges independently per alert

**How it works:**  
The card tracks the previous active/inactive state per alert index and calls `input_boolean.turn_on` or `input_boolean.turn_off` only when the state *changes* — no redundant service calls on every entity update.

> **⚠️ Note:** This runs client-side, so it only works while the browser tab with this dashboard is open. For a reliable server-side alternative, use a `binary_sensor` with a template that checks your entity states directly.

Available in the **visual editor** inside each alert panel under the new **🔗 Automation** section, with entity picker filtered to `input_boolean.*`. The caveat warning appears inline when a value is set.

---

### Also in this patch series (1.3.9.8.x → 1.3.9.9)

| Version | Fix / Feature |
|---------|---------------|
| 1.3.9.8.9 | `=` / `!=` numeric comparison fix for template sensors returning `"0.0"` |
| 1.3.9.8.8 | Music compact controls redesign; vol+ clickable; editor compact section; vol number |
| 1.3.9.8.7 | `music_compact_show_badge` toggle; controls z-index fix |
| 1.3.9.8.6 | Single-line metadata; −/vol%/+ buttons; NOW PLAYING restored |
| 1.3.9.8.5 | Compact layout: cover art as full background, no blur |
| 1.3.9.8.4 | `=` condition fix for `input_number`; battery theme UI; music power button |

---

## Upgrade

Replace `alert-ticker-card.js` and `alert-ticker-card-editor.js` with the v1.3.9.9 files and clear the browser cache.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/divil17f)
