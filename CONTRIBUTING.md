# Contributing to AlertTicker Card

Thank you for your interest in contributing! Every contribution is welcome.

## How to Contribute

### Reporting Bugs

If you find a bug, open an [Issue](https://github.com/djdevil/alert-ticker-card/issues) including:

- **Clear description** of the problem
- **Steps to reproduce**
- **Expected behavior** vs actual behavior
- **Screenshots** (if applicable)
- **Version** of Home Assistant and the card
- **Configuration** (anonymized YAML)
- **Browser console logs** (F12 → Console)

### Suggesting Features

For new features, open an Issue with:

- **Detailed description** of the feature
- **Concrete use cases** (what entity, what state, what theme)
- **Mock-ups or sketches** (optional but appreciated)

### Contributing Code

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-new-theme
   ```
3. **Develop** your feature
4. **Test** on at least one recent Home Assistant version
5. **Commit** with clear messages:
   ```bash
   git commit -m 'feat: Add new theme XYZ'
   ```
6. **Open a Pull Request** with description of changes

## Code Guidelines

- **ES6+** — use `const`/`let`, arrow functions, template literals
- **2-space indentation**
- **LitElement patterns** — use reactive properties, avoid direct DOM manipulation
- **No external dependencies** — the card must work with only what HA provides
- **CSS custom properties** — use `var(--xxx)` for HA theme integration

## Project Structure

```
alert-ticker-card.js          ← Main card (LitElement, all 9 themes)
alert-ticker-card-editor.js   ← Visual editor (LitElement, two tabs)
hacs.json                     ← HACS metadata
info.md                       ← HACS quick description
README.md                     ← Full documentation
CHANGELOG.md                  ← Version history
```

## Adding a New Theme

1. Add the theme key to the `THEMES` constant in `alert-ticker-card.js`
2. Add a `_renderMyTheme()` method with the ha-card HTML
3. Add a `case "mytheme":` in the `render()` switch
4. Add CSS for `.at-mytheme` and child elements in `static get styles()`
5. Add the theme to `THEME_OPTIONS` in `alert-ticker-card-editor.js`
6. Test with 1, 2, and 3+ active alerts
7. Document the new theme in `README.md` and `CHANGELOG.md`
