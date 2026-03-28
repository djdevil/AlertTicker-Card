/**
 * AlertTicker Card Editor v1.0.1
 * Visual editor for the AlertTicker Card custom Lovelace component.
 */

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Must match the version in alert-ticker-card.js
const CARD_VERSION = "1.0.1";

// ---------------------------------------------------------------------------
// Theme metadata — mirrors alert-ticker-card.js
// ---------------------------------------------------------------------------
const THEME_META = {
  emergency:    { icon: "🚨", category: "critical" },
  fire:         { icon: "🔥", category: "critical" },
  alarm:        { icon: "🔴", category: "critical" },
  lightning:    { icon: "🌩️", category: "critical" },
  warning:      { icon: "⚠️", category: "warning"  },
  caution:      { icon: "🟡", category: "warning"  },
  info:         { icon: "ℹ️", category: "info"     },
  notification: { icon: "🔔", category: "info"     },
  aurora:       { icon: "🌌", category: "info"     },
  success:      { icon: "✅", category: "ok"       },
  check:        { icon: "🟢", category: "ok"       },
  confetti:     { icon: "🎉", category: "ok"       },
  ticker:       { icon: "📰", category: "style"    },
  neon:         { icon: "⚡", category: "style"    },
  glass:        { icon: "🔮", category: "style"    },
  matrix:       { icon: "💻", category: "style"    },
  minimal:      { icon: "📋", category: "style"    },
};

// ---------------------------------------------------------------------------
// Default messages per theme per language
// ---------------------------------------------------------------------------
const DEFAULT_MSG = {
  it: {
    emergency:    "Emergenza attiva",
    fire:         "Allarme incendio",
    alarm:        "Allarme attivo",
    lightning:    "Interruzione elettrica",
    warning:      "Avviso importante",
    caution:      "Prestare attenzione",
    info:         "Informazione disponibile",
    notification: "Nuova notifica",
    aurora:       "Notifica di sistema",
    success:      "Stato normale",
    check:        "Verifica completata",
    confetti:     "Operazione riuscita",
    ticker:       "Aggiornamento in corso",
    neon:         "Avviso neon",
    glass:        "Avviso glass",
    matrix:       "Messaggio terminale",
    minimal:      "Avviso",
  },
  en: {
    emergency:    "Emergency active",
    fire:         "Fire alarm",
    alarm:        "Alarm triggered",
    lightning:    "Power outage",
    warning:      "Important warning",
    caution:      "Caution required",
    info:         "Information available",
    notification: "New notification",
    aurora:       "System notification",
    success:      "Normal state",
    check:        "Check passed",
    confetti:     "Operation successful",
    ticker:       "Update in progress",
    neon:         "Neon alert",
    glass:        "Glass alert",
    matrix:       "Terminal message",
    minimal:      "Alert",
  },
  fr: {
    emergency:    "Urgence active",
    fire:         "Alarme incendie",
    alarm:        "Alarme déclenchée",
    lightning:    "Coupure électrique",
    warning:      "Avertissement important",
    caution:      "Attention requise",
    info:         "Information disponible",
    notification: "Nouvelle notification",
    aurora:       "Notification système",
    success:      "État normal",
    check:        "Vérification réussie",
    confetti:     "Opération réussie",
    ticker:       "Mise à jour en cours",
    neon:         "Alerte neon",
    glass:        "Alerte glass",
    matrix:       "Message terminal",
    minimal:      "Alerte",
  },
  de: {
    emergency:    "Notfall aktiv",
    fire:         "Feueralarm",
    alarm:        "Alarm ausgelöst",
    lightning:    "Stromausfall",
    warning:      "Wichtige Warnung",
    caution:      "Vorsicht erforderlich",
    info:         "Information verfügbar",
    notification: "Neue Benachrichtigung",
    aurora:       "Systembenachrichtigung",
    success:      "Normaler Zustand",
    check:        "Prüfung bestanden",
    confetti:     "Vorgang erfolgreich",
    ticker:       "Aktualisierung läuft",
    neon:         "Neon-Warnung",
    glass:        "Glas-Warnung",
    matrix:       "Terminal-Nachricht",
    minimal:      "Warnung",
  },
};

// ---------------------------------------------------------------------------
// Editor translations
// ---------------------------------------------------------------------------
const ET = {
  it: {
    tab_general: "Generale",
    tab_alerts: "Avvisi",
    cycle_interval: "Intervallo ciclo (secondi)",
    cycle_interval_help: "Secondi tra un avviso e l'altro quando ce ne sono più di uno attivi",
    show_when_clear: "Mostra quando non ci sono avvisi",
    clear_message: "Messaggio quando nessun avviso attivo",
    clear_theme: "Tema per stato 'tutto ok'",
    alerts_list: "Lista avvisi configurati",
    add_alert: "Aggiungi avviso",
    alert_entity: "Entità",
    alert_state: "Stato che attiva l'avviso",
    alert_message: "Messaggio da visualizzare",
    alert_priority: "Priorità",
    alert_theme: "Tema",
    alert_icon: "Icona (emoji opzionale)",
    alert_icon_help: "Lascia vuoto per icona automatica",
    delete: "Elimina",
    priority_1: "1 — Critico (rosso)",
    priority_2: "2 — Attenzione (arancione)",
    priority_3: "3 — Info (blu)",
    priority_4: "4 — Bassa priorità (grigio)",
    no_alerts: "Nessun avviso configurato. Clicca 'Aggiungi avviso' per iniziare.",
    alert_num: "Avviso",
    collapse: "Chiudi",
    expand: "Modifica",
    move_up: "Su",
    move_down: "Giù",
    version: "Versione",
  },
  en: {
    tab_general: "General",
    tab_alerts: "Alerts",
    cycle_interval: "Cycle interval (seconds)",
    cycle_interval_help: "Seconds between alerts when multiple are active",
    show_when_clear: "Show when no alerts are active",
    clear_message: "Message when no alerts active",
    clear_theme: "Theme for 'all clear' state",
    alerts_list: "Configured alerts",
    add_alert: "Add alert",
    alert_entity: "Entity",
    alert_state: "State that triggers the alert",
    alert_message: "Message to display",
    alert_priority: "Priority",
    alert_theme: "Theme",
    alert_icon: "Icon (optional emoji)",
    alert_icon_help: "Leave empty for automatic icon",
    delete: "Delete",
    priority_1: "1 — Critical (red)",
    priority_2: "2 — Warning (orange)",
    priority_3: "3 — Info (blue)",
    priority_4: "4 — Low priority (gray)",
    no_alerts: "No alerts configured. Click 'Add alert' to get started.",
    alert_num: "Alert",
    collapse: "Close",
    expand: "Edit",
    move_up: "Up",
    move_down: "Down",
    version: "Version",
  },
  fr: {
    tab_general: "Général",
    tab_alerts: "Alertes",
    cycle_interval: "Intervalle de cycle (secondes)",
    cycle_interval_help: "Secondes entre les alertes quand plusieurs sont actives",
    show_when_clear: "Afficher quand aucune alerte n'est active",
    clear_message: "Message quand aucune alerte active",
    clear_theme: "Thème pour l'état 'tout va bien'",
    alerts_list: "Liste des alertes configurées",
    add_alert: "Ajouter une alerte",
    alert_entity: "Entité",
    alert_state: "État qui déclenche l'alerte",
    alert_message: "Message à afficher",
    alert_priority: "Priorité",
    alert_theme: "Thème",
    alert_icon: "Icône (emoji optionnel)",
    alert_icon_help: "Laisser vide pour icône automatique",
    delete: "Supprimer",
    priority_1: "1 — Critique (rouge)",
    priority_2: "2 — Attention (orange)",
    priority_3: "3 — Info (bleu)",
    priority_4: "4 — Basse priorité (gris)",
    no_alerts: "Aucune alerte configurée. Cliquez sur 'Ajouter une alerte' pour commencer.",
    alert_num: "Alerte",
    collapse: "Fermer",
    expand: "Modifier",
    move_up: "Haut",
    move_down: "Bas",
    version: "Version",
  },
  de: {
    tab_general: "Allgemein",
    tab_alerts: "Warnungen",
    cycle_interval: "Zyklusintervall (Sekunden)",
    cycle_interval_help: "Sekunden zwischen Warnungen wenn mehrere aktiv sind",
    show_when_clear: "Anzeigen wenn keine Warnung aktiv",
    clear_message: "Nachricht wenn keine Warnungen aktiv",
    clear_theme: "Thema für 'Alles in Ordnung'",
    alerts_list: "Konfigurierte Warnungen",
    add_alert: "Warnung hinzufügen",
    alert_entity: "Entität",
    alert_state: "Zustand der die Warnung auslöst",
    alert_message: "Anzuzeigende Nachricht",
    alert_priority: "Priorität",
    alert_theme: "Thema",
    alert_icon: "Symbol (optionales Emoji)",
    alert_icon_help: "Leer lassen für automatisches Symbol",
    delete: "Löschen",
    priority_1: "1 — Kritisch (rot)",
    priority_2: "2 — Warnung (orange)",
    priority_3: "3 — Info (blau)",
    priority_4: "4 — Niedrige Priorität (grau)",
    no_alerts: "Keine Warnungen konfiguriert. Klicken Sie auf 'Warnung hinzufügen'.",
    alert_num: "Warnung",
    collapse: "Schließen",
    expand: "Bearbeiten",
    move_up: "Hoch",
    move_down: "Runter",
    version: "Version",
  },
};

// ---------------------------------------------------------------------------
// Theme options
// ---------------------------------------------------------------------------
// Grouped theme options with category separators
const THEME_OPTIONS = [
  { sep: true,  label: "── 🚨 CRITICO ──" },
  { value: "emergency",    label: "🚨 Emergency (Pulsante rosso)" },
  { value: "fire",         label: "🔥 Fire (Fiamma)" },
  { value: "alarm",        label: "🔴 Alarm (Strobo)" },
  { value: "lightning",    label: "🌩️ Lightning (Fulmine)" },
  { sep: true,  label: "── ⚠️ ATTENZIONE ──" },
  { value: "warning",      label: "⚠️ Warning (Bordo ambra)" },
  { value: "caution",      label: "🟡 Caution (Nastro giallo)" },
  { sep: true,  label: "── ℹ️ INFORMAZIONE ──" },
  { value: "info",         label: "ℹ️ Info (Bordo blu)" },
  { value: "notification", label: "🔔 Notification (Bubble)" },
  { value: "aurora",       label: "🌌 Aurora (Animato)" },
  { sep: true,  label: "── ✅ TUTTO OK ──" },
  { value: "success",      label: "✅ Success (Verde)" },
  { value: "check",        label: "🟢 Check (Anello pulsante)" },
  { value: "confetti",     label: "🎉 Confetti (Coriandoli)" },
  { sep: true,  label: "── 🎨 STILE ──" },
  { value: "ticker",       label: "📰 Ticker (Scorrevole)" },
  { value: "neon",         label: "⚡ Neon (Cyberpunk)" },
  { value: "glass",        label: "🔮 Glass (Glassmorphism)" },
  { value: "matrix",       label: "💻 Matrix (Terminale)" },
  { value: "minimal",      label: "📋 Minimal (Pulito)" },
];

// ---------------------------------------------------------------------------
// Editor class
// ---------------------------------------------------------------------------
class AlertTickerCardEditor extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      _hass: {},
      _activeTab: { type: String },
      _expandedAlerts: { type: Object },
      _lang: { type: String },
    };
  }

  constructor() {
    super();
    this._activeTab = "general";
    this._expandedAlerts = new Set();
    this._lang = "en";
  }

  // -------------------------------------------------------------------------
  // HA lifecycle
  // -------------------------------------------------------------------------
  setConfig(config) {
    this._config = {
      cycle_interval: 5,
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [],
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (hass && hass.language) {
      const lang = hass.language.split("-")[0].toLowerCase();
      this._lang = ET[lang] ? lang : "en";
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    // Force ha-entity-picker to load by requesting config element of hui-glance-card.
    // hui-glance-card depends on ha-entity-picker so this is the standard HA pattern.
    // See: https://community.home-assistant.io/t/re-using-existing-frontend-components-in-lovelace-card-editor/103415
    if (!customElements.get("ha-entity-picker")) {
      const GlanceCard = customElements.get("hui-glance-card");
      if (GlanceCard) {
        await GlanceCard.getConfigElement();
      } else {
        await Promise.race([
          customElements.whenDefined("hui-glance-card").then(async () => {
            const Card = customElements.get("hui-glance-card");
            if (Card) await Card.getConfigElement();
          }),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
      }
      this.requestUpdate();
    }
  }

  // -------------------------------------------------------------------------
  // Translation helper
  // -------------------------------------------------------------------------
  _t(key) {
    return (ET[this._lang] && ET[this._lang][key]) || ET.en[key] || key;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  render() {
    if (!this._config) return html``;

    return html`
      <div class="editor-wrapper">
        ${this._renderTabs()}
        ${this._activeTab === "general" ? this._renderGeneralTab() : this._renderAlertsTab()}
        <div class="version-badge">${this._t("version")}: ${CARD_VERSION}</div>
      </div>
    `;
  }

  _renderTabs() {
    return html`
      <div class="tabs">
        <button
          class="tab-btn ${this._activeTab === "general" ? "active" : ""}"
          @click="${() => this._tabChanged("general")}"
        >
          ${this._t("tab_general")}
        </button>
        <button
          class="tab-btn ${this._activeTab === "alerts" ? "active" : ""}"
          @click="${() => this._tabChanged("alerts")}"
        >
          ${this._t("tab_alerts")}
          ${this._config.alerts && this._config.alerts.length > 0
            ? html`<span class="tab-count">(${this._config.alerts.length})</span>`
            : ""}
        </button>
      </div>
    `;
  }

  /**
   * Renders a native <select> with <optgroup> for theme categories.
   * onlyOk=true shows only "ok" category themes (for the clear_theme selector).
   */
  _renderThemeSelect(labelKey, currentValue, handler, onlyOk = false) {
    const GROUPS = [
      { cat: "critical", label: "🚨 Critico / Critical" },
      { cat: "warning",  label: "⚠️ Attenzione / Warning" },
      { cat: "info",     label: "ℹ️ Informazione / Info" },
      { cat: "ok",       label: "✅ Tutto OK / All Clear" },
      { cat: "style",    label: "🎨 Stile / Style" },
    ];

    const allThemes = THEME_OPTIONS.filter((o) => !o.sep);
    const groups = onlyOk
      ? [{ cat: "ok", label: "✅ Tutto OK / All Clear" }]
      : GROUPS;

    return html`
      <div class="native-select-wrap">
        <label class="native-select-label">${this._t(labelKey)}</label>
        <select
          class="native-select"
          @change="${(e) => handler(e.target.value)}"
        >
          ${groups.map((g) => html`
            <optgroup label="${g.label}">
              ${allThemes
                .filter((o) => (THEME_META[o.value] || {}).category === g.cat)
                .map((o) => html`
                  <option value="${o.value}" ?selected="${currentValue === o.value}">
                    ${o.label}
                  </option>
                `)}
            </optgroup>
          `)}
        </select>
      </div>
    `;
  }

  _renderGeneralTab() {
    const cfg = this._config;

    return html`
      <!-- Cycle interval -->
      <div class="form-row">
        <ha-textfield
          .label="${this._t("cycle_interval")}"
          type="number"
          min="1"
          max="60"
          .value="${String(cfg.cycle_interval ?? 5)}"
          @change="${(e) => this._cycleIntervalChanged(e.target.value)}"
        ></ha-textfield>
        <div class="helper-text">${this._t("cycle_interval_help")}</div>
      </div>

      <!-- Show when clear toggle -->
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("show_when_clear")}</span>
          <ha-switch
            .checked="${cfg.show_when_clear === true}"
            @change="${(e) => this._showWhenClearChanged(e.target.checked)}"
          ></ha-switch>
        </div>
      </div>

      <!-- Clear message + theme (only when show_when_clear is true) -->
      ${cfg.show_when_clear
        ? html`
            <div class="form-row">
              <ha-textfield
                .label="${this._t("clear_message")}"
                .value="${cfg.clear_message || ""}"
                @change="${(e) => this._clearMessageChanged(e.target.value)}"
              ></ha-textfield>
            </div>
            <div class="form-row">
              ${this._renderThemeSelect("clear_theme", cfg.clear_theme || "success", (v) => this._clearThemeChanged(v), true)}
            </div>
          `
        : ""}
    `;
  }

  _renderAlertsTab() {
    const alerts = this._config.alerts || [];

    return html`
      <div class="alerts-header">
        <span>${this._t("alerts_list")}</span>
        <span class="alerts-count">${alerts.length} ${alerts.length === 1 ? "item" : "items"}</span>
      </div>

      ${alerts.length === 0
        ? html`<div class="empty-alerts">${this._t("no_alerts")}</div>`
        : alerts.map((alert, index) => this._renderAlertItem(alert, index))}

      <button class="btn-add-alert" @click="${() => this._addAlert()}">
        + ${this._t("add_alert")}
      </button>
    `;
  }

  _renderAlertItem(alert, index) {
    const isExpanded = this._expandedAlerts.has(index);
    const alerts = this._config.alerts || [];
    const prio = alert.priority || 1;
    const icon = alert.icon || (THEME_META[alert.theme] || {}).icon || "🔔";
    const entityLabel = alert.entity || (this._lang === "it" ? "(non impostato)" : "(not set)");
    const msgSnippet = alert.message
      ? alert.message.length > 40
        ? alert.message.substring(0, 40) + "…"
        : alert.message
      : "";

    return html`
      <div class="alert-item">
        <!-- Summary row -->
        <div class="alert-summary">
          <span class="alert-icon-badge">${icon}</span>
          <div class="alert-summary-text">
            <div class="alert-entity-label">${this._t("alert_num")} ${index + 1}: ${entityLabel}</div>
            ${msgSnippet ? html`<div class="alert-msg-label">${msgSnippet}</div>` : ""}
          </div>
          <span class="alert-prio-badge prio-${prio}">P${prio}</span>
          <div class="alert-actions">
            <button
              class="btn-icon"
              title="${isExpanded ? this._t("collapse") : this._t("expand")}"
              @click="${() => this._toggleAlert(index)}"
            >
              ${isExpanded ? "▲" : "▼"} ${isExpanded ? this._t("collapse") : this._t("expand")}
            </button>
            <button
              class="btn-icon btn-delete"
              title="${this._t("delete")}"
              @click="${() => this._deleteAlert(index)}"
            >
              🗑 ${this._t("delete")}
            </button>
          </div>
        </div>

        <!-- Expanded form -->
        ${isExpanded
          ? html`
              <div class="alert-form">
                <!-- Entity picker — connectedCallback garantisce ha-entity-picker già caricato -->
                <ha-entity-picker
                  .label="${this._t("alert_entity")}"
                  .hass="${this._hass}"
                  .value="${alert.entity || ""}"
                  allow-custom-entity
                  @value-changed="${(e) => this._alertEntityChanged(e.detail.value, index)}"
                ></ha-entity-picker>

                <div class="form-row-2col">
                  <!-- Trigger state -->
                  <ha-textfield
                    .label="${this._t("alert_state")}"
                    .value="${alert.state || "on"}"
                    @change="${(e) => this._alertStateChanged(e.target.value, index)}"
                  ></ha-textfield>

                  <!-- Priority select -->
                  <ha-select
                    .label="${this._t("alert_priority")}"
                    .value="${String(alert.priority || 1)}"
                    fixedMenuPosition
                    naturalMenuWidth
                  >
                    ${[1, 2, 3, 4].map(
                      (p) => html`
                        <mwc-list-item
                          value="${String(p)}"
                          ?selected="${(alert.priority || 1) === p}"
                          @request-selected="${(e) => {
                            if (e.detail.source !== "interaction") return;
                            this._alertPriorityChanged(e.target.getAttribute("value"), index);
                          }}"
                        >${this._t("priority_" + p)}</mwc-list-item>
                      `
                    )}
                  </ha-select>
                </div>

                <!-- Message -->
                <ha-textfield
                  .label="${this._t("alert_message")}"
                  .value="${alert.message || ""}"
                  @change="${(e) => this._alertMessageChanged(e.target.value, index)}"
                ></ha-textfield>

                <!-- Theme per alert -->
                ${this._renderThemeSelect("alert_theme", alert.theme || "emergency", (v) => this._alertThemeChanged(v, index))}

                <!-- Icon override -->
                <div>
                  <ha-textfield
                    .label="${this._t("alert_icon")}"
                    .value="${alert.icon || ""}"
                    @change="${(e) => this._alertIconChanged(e.target.value, index)}"
                  ></ha-textfield>
                  <div class="helper-text">${this._t("alert_icon_help")}</div>
                </div>

                <!-- Move up/down buttons -->
                <div class="move-btns">
                  <button
                    class="btn-move"
                    ?disabled="${index === 0}"
                    @click="${() => this._moveAlertUp(index)}"
                  >
                    ↑ ${this._t("move_up")}
                  </button>
                  <button
                    class="btn-move"
                    ?disabled="${index === alerts.length - 1}"
                    @click="${() => this._moveAlertDown(index)}"
                  >
                    ↓ ${this._t("move_down")}
                  </button>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Config change helpers
  // -------------------------------------------------------------------------
  _fireConfig(newConfig) {
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  _updateAlert(index, changes) {
    const alerts = [...(this._config.alerts || [])];
    alerts[index] = { ...alerts[index], ...changes };
    this._fireConfig({ ...this._config, alerts });
  }

  // -------------------------------------------------------------------------
  // Event handlers — tabs & general
  // -------------------------------------------------------------------------
  _tabChanged(tab) {
    this._activeTab = tab;
    this.requestUpdate();
  }

  _clearThemeChanged(value) {
    if (!value) return;
    this._fireConfig({ ...this._config, clear_theme: value });
  }

  _cycleIntervalChanged(value) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.min(60, Math.max(1, parsed));
    this._fireConfig({ ...this._config, cycle_interval: clamped });
  }

  _showWhenClearChanged(checked) {
    this._fireConfig({ ...this._config, show_when_clear: checked });
  }

  _clearMessageChanged(value) {
    this._fireConfig({ ...this._config, clear_message: value });
  }

  // -------------------------------------------------------------------------
  // Event handlers — alert list
  // -------------------------------------------------------------------------
  _toggleAlert(index) {
    const next = new Set(this._expandedAlerts);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    this._expandedAlerts = next;
    this.requestUpdate();
  }

  _addAlert() {
    const alerts = [...(this._config.alerts || [])];
    const newIndex = alerts.length;
    const defaultTheme = "emergency";
    const defaultMsg = (DEFAULT_MSG[this._lang] || DEFAULT_MSG.en)[defaultTheme] || "";
    alerts.push({ entity: "", state: "on", message: defaultMsg, priority: 1, theme: defaultTheme, icon: "" });
    this._expandedAlerts = new Set([...this._expandedAlerts, newIndex]);
    this._fireConfig({ ...this._config, alerts });
  }

  _deleteAlert(index) {
    const alerts = [...(this._config.alerts || [])];
    alerts.splice(index, 1);

    // Re-map expanded indices: remove deleted, shift down indices above deleted
    const next = new Set();
    for (const i of this._expandedAlerts) {
      if (i < index) next.add(i);
      else if (i > index) next.add(i - 1);
      // i === index is dropped
    }
    this._expandedAlerts = next;
    this._fireConfig({ ...this._config, alerts });
  }

  // -------------------------------------------------------------------------
  // Event handlers — individual alert fields
  // -------------------------------------------------------------------------
  _alertEntityChanged(value, index) {
    this._updateAlert(index, { entity: value });
  }

  _alertStateChanged(value, index) {
    this._updateAlert(index, { state: value });
  }

  _alertMessageChanged(value, index) {
    this._updateAlert(index, { message: value });
  }

  _alertPriorityChanged(value, index) {
    if (!value) return;
    this._updateAlert(index, { priority: parseInt(value, 10) });
  }

  _alertIconChanged(value, index) {
    this._updateAlert(index, { icon: value });
  }

  _alertThemeChanged(value, index) {
    if (!value) return;
    const alert = (this._config.alerts || [])[index] || {};
    const changes = { theme: value };
    // Auto-update icon if it's still the previous theme's default (or empty)
    const prevDefaultIcon = (THEME_META[alert.theme] || {}).icon || "";
    if (!alert.icon || alert.icon === prevDefaultIcon) {
      changes.icon = (THEME_META[value] || {}).icon || "";
    }
    // Auto-update message if it's still the previous theme's default (or empty)
    const msgs = DEFAULT_MSG[this._lang] || DEFAULT_MSG.en;
    const prevDefaultMsg = msgs[alert.theme] || "";
    if (!alert.message || alert.message === prevDefaultMsg) {
      changes.message = msgs[value] || "";
    }
    this._updateAlert(index, changes);
  }

  // -------------------------------------------------------------------------
  // Event handlers — reorder
  // -------------------------------------------------------------------------
  _moveAlertUp(index) {
    if (index === 0) return;
    const alerts = [...(this._config.alerts || [])];
    [alerts[index - 1], alerts[index]] = [alerts[index], alerts[index - 1]];

    // Swap expanded state for the two affected indices
    const next = new Set(this._expandedAlerts);
    const aExpanded = next.has(index);
    const bExpanded = next.has(index - 1);
    if (aExpanded) next.add(index - 1); else next.delete(index - 1);
    if (bExpanded) next.add(index);     else next.delete(index);
    this._expandedAlerts = next;

    this._fireConfig({ ...this._config, alerts });
  }

  _moveAlertDown(index) {
    const alerts = this._config.alerts || [];
    if (index >= alerts.length - 1) return;
    const copy = [...alerts];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];

    const next = new Set(this._expandedAlerts);
    const aExpanded = next.has(index);
    const bExpanded = next.has(index + 1);
    if (aExpanded) next.add(index + 1); else next.delete(index + 1);
    if (bExpanded) next.add(index);     else next.delete(index);
    this._expandedAlerts = next;

    this._fireConfig({ ...this._config, alerts: copy });
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------
  static get styles() {
    return css`
      .editor-wrapper {
        padding: 16px;
        font-family: var(--paper-font-body1_-_font-family, sans-serif);
      }

      /* ---- Tabs ---- */
      .tabs {
        display: flex;
        border-bottom: 2px solid var(--divider-color, #e0e0e0);
        margin-bottom: 20px;
        gap: 0;
      }
      .tab-btn {
        flex: 1;
        padding: 10px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        color: var(--secondary-text-color, #888);
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.2s;
      }
      .tab-btn.active {
        color: var(--primary-color, #03a9f4);
        border-bottom-color: var(--primary-color, #03a9f4);
      }
      .tab-count {
        margin-left: 4px;
        font-size: 0.9rem;
        opacity: 0.75;
      }

      /* ---- Form rows ---- */
      .form-row {
        margin-bottom: 16px;
      }
      .form-row ha-select,
      .form-row ha-textfield {
        width: 100%;
      }
      .form-row-inline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }
      .helper-text {
        font-size: 0.85rem;
        color: var(--secondary-text-color, #888);
        margin-top: 4px;
      }

      /* ---- Alert list ---- */
      .alerts-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .alerts-count {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .alert-item {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 10px;
        margin-bottom: 10px;
        overflow: hidden;
      }
      .alert-summary {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        cursor: pointer;
        background: var(--card-background-color, #fff);
      }
      .alert-summary:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .alert-icon-badge {
        font-size: 1.3rem;
        flex-shrink: 0;
      }
      .alert-summary-text {
        flex: 1;
        min-width: 0;
      }
      .alert-entity-label {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--primary-text-color, #212121);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .alert-msg-label {
        font-size: 0.85rem;
        color: var(--secondary-text-color, #888);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .alert-prio-badge {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 20px;
        flex-shrink: 0;
        white-space: nowrap;
      }
      .prio-1 { background: #ffebee; color: #e53935; }
      .prio-2 { background: #fff3e0; color: #e65100; }
      .prio-3 { background: #e3f2fd; color: #1565c0; }
      .prio-4 { background: #f5f5f5; color: #757575; }

      .alert-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }
      .btn-icon {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .btn-icon:hover {
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color, #212121);
      }
      .btn-delete {
        color: #e53935 !important;
      }

      .alert-form {
        padding: 14px;
        background: var(--secondary-background-color, #f9f9f9);
        border-top: 1px solid var(--divider-color, #e0e0e0);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .alert-form ha-entity-picker,
      .alert-form ha-textfield,
      .alert-form ha-select {
        width: 100%;
      }
      .form-row-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .move-btns {
        display: flex;
        gap: 6px;
        margin-top: 4px;
      }
      .btn-move {
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        padding: 4px 10px;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .btn-move:disabled {
        opacity: 0.4;
        cursor: default;
      }

      /* ---- Add button ---- */
      .btn-add-alert {
        width: 100%;
        padding: 10px;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        margin-top: 8px;
        transition: opacity 0.2s;
      }
      .btn-add-alert:hover {
        opacity: 0.9;
      }

      /* ---- Empty state ---- */
      .empty-alerts {
        text-align: center;
        padding: 24px 16px;
        color: var(--secondary-text-color, #888);
        font-size: 0.95rem;
        border: 2px dashed var(--divider-color, #e0e0e0);
        border-radius: 10px;
        margin-bottom: 12px;
      }

      /* ---- Native theme select ---- */
      .native-select-wrap {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .native-select-label {
        font-size: 0.85rem;
        color: var(--secondary-text-color, #888);
        font-weight: 500;
      }
      .native-select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 6px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        font-size: 1rem;
        cursor: pointer;
        appearance: auto;
      }
      .native-select:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      /* ---- Version badge ---- */
      .version-badge {
        font-size: 0.7rem;
        color: var(--secondary-text-color, #aaa);
        text-align: right;
        margin-top: 20px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color, #f0f0f0);
      }
    `;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
if (!customElements.get("alert-ticker-card-editor")) {
  customElements.define("alert-ticker-card-editor", AlertTickerCardEditor);
}
