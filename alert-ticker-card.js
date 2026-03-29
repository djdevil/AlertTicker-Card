/**
 * AlertTicker Card v1.0.3
 * A Home Assistant custom Lovelace card to display alerts based on entity states.
 * Supports 22 visual themes with per-alert theme assignment, priority ordering,
 * fold animation cycling, snooze, numeric conditions, and a full visual editor.
 *
 * Author: djdevil
 * License: MIT
 */

// ---------------------------------------------------------------------------
// LitElement bootstrap — resolves against the running HA instance
// ---------------------------------------------------------------------------
const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// ---------------------------------------------------------------------------
// Card version — declared early so getConfigElement() can reference it
// ---------------------------------------------------------------------------
const CARD_VERSION = "1.0.3";

// ---------------------------------------------------------------------------
// Theme metadata — drives default icons and category labels
// ---------------------------------------------------------------------------
const THEME_META = {
  // --- Critical ---
  emergency:    { icon: "🚨", category: "critical" },
  fire:         { icon: "🔥", category: "critical" },
  alarm:        { icon: "🔴", category: "critical" },
  lightning:    { icon: "🌩️", category: "critical" },
  // --- Warning ---
  warning:      { icon: "⚠️", category: "warning" },
  caution:      { icon: "🟡", category: "warning" },
  // --- Info ---
  info:         { icon: "ℹ️", category: "info"     },
  notification: { icon: "🔔", category: "info"     },
  aurora:       { icon: "🌌", category: "info"     },
  // --- OK / Success ---
  success:      { icon: "✅", category: "ok"       },
  check:        { icon: "🟢", category: "ok"       },
  confetti:     { icon: "🎉", category: "ok"       },
  // --- Style ---
  ticker:       { icon: "📰", category: "style"    },
  neon:         { icon: "⚡", category: "style"    },
  glass:        { icon: "🔮", category: "style"    },
  matrix:       { icon: "💻", category: "style"    },
  minimal:      { icon: "📋", category: "style"    },
  retro:        { icon: "📺", category: "style"    },
  // --- New spectacular ---
  nuclear:      { icon: "☢️", category: "critical" },
  radar:        { icon: "🎯", category: "warning"  },
  hologram:     { icon: "🔷", category: "info"     },
  heartbeat:    { icon: "💓", category: "ok"       },
};

// ---------------------------------------------------------------------------
// Translations (IT / EN / FR / DE)
// ---------------------------------------------------------------------------
const T = {
  it: {
    alerts: "Avvisi",
    critical: "Critico",
    warning_label: "Attenzione",
    info_label: "Informazione",
    success_label: "Risolto",
    no_alerts: "Nessun avviso attivo",
    all_clear: "Tutto ok",
    priority_short: "P",
    alert_system: "SISTEMA AVVISI",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alert --leggi",
    snooze: "Sospendi",
    snoozed: "Sospeso",
    snooze_1h: "1 ora",
    snooze_4h: "4 ore",
    snooze_8h: "8 ore",
    snooze_24h: "24 ore",
    snooze_reset: "Riattiva tutti",
    alerts_snoozed: "avvisi sospesi",
  },
  en: {
    alerts: "Alerts",
    critical: "Critical",
    warning_label: "Warning",
    info_label: "Information",
    success_label: "Resolved",
    no_alerts: "No active alerts",
    all_clear: "All clear",
    priority_short: "P",
    alert_system: "ALERT SYSTEM",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alert --read",
    snooze: "Snooze",
    snoozed: "Snoozed",
    snooze_1h: "1 hour",
    snooze_4h: "4 hours",
    snooze_8h: "8 hours",
    snooze_24h: "24 hours",
    snooze_reset: "Resume all",
    alerts_snoozed: "alerts snoozed",
  },
  fr: {
    alerts: "Alertes",
    critical: "Critique",
    warning_label: "Attention",
    info_label: "Information",
    success_label: "Résolu",
    no_alerts: "Aucune alerte active",
    all_clear: "Tout va bien",
    priority_short: "P",
    alert_system: "SYSTÈME D'ALERTE",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alerte --lire",
    snooze: "Suspendre",
    snoozed: "Suspendue",
    snooze_1h: "1 heure",
    snooze_4h: "4 heures",
    snooze_8h: "8 heures",
    snooze_24h: "24 heures",
    snooze_reset: "Réactiver tout",
    alerts_snoozed: "alertes suspendues",
  },
  de: {
    alerts: "Warnungen",
    critical: "Kritisch",
    warning_label: "Warnung",
    info_label: "Information",
    success_label: "Gelöst",
    no_alerts: "Keine aktiven Warnungen",
    all_clear: "Alles in Ordnung",
    priority_short: "P",
    alert_system: "WARNSYSTEM",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alarm --lesen",
    snooze: "Pausieren",
    snoozed: "Pausiert",
    snooze_1h: "1 Stunde",
    snooze_4h: "4 Stunden",
    snooze_8h: "8 Stunden",
    snooze_24h: "24 Stunden",
    snooze_reset: "Alle fortsetzen",
    alerts_snoozed: "Warnungen pausiert",
  },
  nl: {
    alerts: "Meldingen",
    critical: "Kritiek",
    warning_label: "Waarschuwing",
    info_label: "Informatie",
    success_label: "Opgelost",
    no_alerts: "Geen actieve meldingen",
    all_clear: "Alles in orde",
    priority_short: "P",
    alert_system: "MELDINGSSYSTEEM",
    cmd_prefix: "root@ha:~$",
    cmd_read: "melding --lees",
    snooze: "Sluimer",
    snoozed: "Gesluimerd",
    snooze_1h: "1 uur",
    snooze_4h: "4 uur",
    snooze_8h: "8 uur",
    snooze_24h: "24 uur",
    snooze_reset: "Alles hervatten",
    alerts_snoozed: "meldingen gesluimerd",
  },
};

// ---------------------------------------------------------------------------
// AlertTickerCard — main card class
// ---------------------------------------------------------------------------
class AlertTickerCard extends LitElement {

  // ---- LitElement reactive properties -------------------------------------
  static get properties() {
    return {
      _hass: { type: Object },
      _config: { type: Object },
      _activeAlerts: { type: Array },
      _currentIndex: { type: Number },
      _lang: { type: String },
      _animPhase: { type: String },
      _snoozeMenuOpen: { type: String },
      _snoozedCount: { type: Number },
    };
  }

  // ---- Constructor ---------------------------------------------------------
  constructor() {
    super();
    this._hass = null;
    this._config = {};
    this._activeAlerts = [];
    this._currentIndex = 0;
    this._lang = "en";
    this._cycleTimer = null;
    this._lastSignature = "";
    this._animPhase = "";
    this._snoozeMenuOpen = null;
    this._snoozedCount = 0;
    this._snoozed = new Map(); // snoozeKey → expiry timestamp
  }

  // ---- Lovelace card static helpers ----------------------------------------

  static getStubConfig() {
    return {
      cycle_interval: 5,
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [
        {
          entity: "binary_sensor.smoke_detector",
          state: "on",
          message: "Smoke detected!",
          priority: 1,
          theme: "emergency",
          icon: "🚨",
        },
      ],
    };
  }

  /**
   * Lazy-load the editor element.
   * Uses import.meta.url so the correct URL (including HACS tag) is forwarded.
   */
  static async getConfigElement() {
    try {
      const _mainUrl = new URL(import.meta.url);
      const _hacstag = _mainUrl.searchParams.get("hacstag");
      const _editorUrl = new URL("./alert-ticker-card-editor.js", import.meta.url);
      if (_hacstag) _editorUrl.searchParams.set("hacstag", _hacstag);
      else _editorUrl.searchParams.set("v", CARD_VERSION);
      await import(_editorUrl.href);
      return document.createElement("alert-ticker-card-editor");
    } catch (error) {
      console.error("AlertTicker Card Editor not found:", error);
    }
  }

  // ---- Config --------------------------------------------------------------

  setConfig(config) {
    if (!config) throw new Error("AlertTicker Card: invalid configuration");
    this._config = {
      cycle_interval: 5,
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [],
      ...config,
    };
    // Re-compute alerts if hass is already set
    if (this._hass) {
      this._computeActiveAlerts();
    }
  }

  // ---- Hass setter ---------------------------------------------------------

  set hass(hass) {
    this._hass = hass;
    // Detect language (default to "en" if HA language is not IT)
    const raw = (hass.language || "en").toLowerCase().split("-")[0];
    const lang = T[raw] ? raw : "en";
    if (lang !== this._lang) {
      this._lang = lang;
    }
    this._computeActiveAlerts();
  }

  // ---- Translation helper --------------------------------------------------

  _t(key) {
    return (T[this._lang] || T["en"])[key] || key;
  }

  // ---- Active alert computation -------------------------------------------

  /**
   * Filters config.alerts to those whose entity state matches the trigger.
   * Sorts by priority (lower = higher priority = first).
   * Only triggers requestUpdate() when the list actually changes.
   */
  _computeActiveAlerts() {
    if (!this._hass || !this._config || !Array.isArray(this._config.alerts)) return;

    let snoozedCount = 0;
    const active = this._config.alerts.filter((alert) => {
      const entityState = this._hass.states[alert.entity];
      if (!entityState) return false;
      if (!this._matchesState(entityState.state, alert)) return false;
      if (this._isSnoozed(alert)) { snoozedCount++; return false; }
      return true;
    });

    // Sort by priority (lower number = first; undefined priority goes last)
    active.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    // Build a lightweight signature to detect changes
    const signature = active.map((a) => `${a.entity}:${a.message}:${a.priority}`).join("|");
    if (signature === this._lastSignature && snoozedCount === this._snoozedCount) return;

    this._lastSignature = signature;
    this._activeAlerts = active;
    this._snoozedCount = snoozedCount;

    // Clamp index — don't blindly reset to 0 on every state update
    if (this._currentIndex >= active.length) {
      this._currentIndex = 0;
    }

    // Never stop/restart the timer on entity updates — that would reset the
    // 5-second interval before it fires (common with dimmers that push rapid
    // attribute updates). Instead, start it once if it isn't already running.
    if (!this._cycleTimer) {
      this._startCycleTimer();
    }

    this.requestUpdate();
  }

  // ---- Cycle timer ---------------------------------------------------------

  _startCycleTimer() {
    if (this._cycleTimer) return; // Already running — never start twice
    const interval = ((this._config && this._config.cycle_interval) || 5) * 1000;
    const FOLD_MS = 340;
    this._cycleTimer = setInterval(() => {
      // Skip tick if there is nothing to cycle
      if (!this._activeAlerts || this._activeAlerts.length <= 1) return;
      // 1. Fold out
      this._animPhase = "fold-out";
      this.requestUpdate();
      // 2. Mid-fold: swap content
      setTimeout(() => {
        this._currentIndex = (this._currentIndex + 1) % this._activeAlerts.length;
        this._animPhase = "fold-in";
        this.requestUpdate();
        // 3. Done: clear phase
        setTimeout(() => {
          this._animPhase = "";
          this.requestUpdate();
        }, FOLD_MS);
      }, FOLD_MS);
    }, interval);
  }

  _stopCycleTimer() {
    if (this._cycleTimer) {
      clearInterval(this._cycleTimer);
      this._cycleTimer = null;
    }
  }

  // ---- State-matching helper -----------------------------------------------

  /**
   * Returns true when the entity's state matches the alert's condition.
   * Supports: exact string/array (=), != > < >= <= with numeric comparison.
   */
  _matchesState(entityStateValue, alert) {
    const trigger = alert.state;
    const operator = alert.operator || "=";

    // Legacy array form — treated as "is one of" regardless of operator
    if (Array.isArray(trigger)) {
      return trigger.map(String).includes(entityStateValue);
    }

    const triggerStr = String(trigger);

    if (operator === "=" || operator === "==") {
      return entityStateValue === triggerStr;
    }
    if (operator === "!=") {
      return entityStateValue !== triggerStr;
    }

    // Numeric comparison
    const entityNum = parseFloat(entityStateValue);
    const triggerNum = parseFloat(triggerStr);
    if (isNaN(entityNum) || isNaN(triggerNum)) return false;

    if (operator === ">")  return entityNum > triggerNum;
    if (operator === "<")  return entityNum < triggerNum;
    if (operator === ">=") return entityNum >= triggerNum;
    if (operator === "<=") return entityNum <= triggerNum;

    return entityStateValue === triggerStr;
  }

  // ---- Snooze helpers -------------------------------------------------------

  /** Unique key per alert config entry used as snooze map key */
  _snoozeKey(alert) {
    return `${alert.entity}||${alert.operator || "="}||${JSON.stringify(alert.state)}`;
  }

  /** Returns the expiry timestamp if currently snoozed, otherwise 0 */
  _isSnoozed(alert) {
    const exp = this._snoozed.get(this._snoozeKey(alert));
    return exp && exp > Date.now() ? exp : 0;
  }

  /** Load snooze state from localStorage, discarding expired entries */
  _loadSnooze() {
    try {
      const raw = localStorage.getItem("atc-snooze");
      if (!raw) return;
      const obj = JSON.parse(raw);
      const now = Date.now();
      this._snoozed = new Map(
        Object.entries(obj).filter(([, exp]) => exp > now)
      );
    } catch (_) {
      this._snoozed = new Map();
    }
  }

  /** Persist snooze state to localStorage */
  _saveSnooze() {
    try {
      localStorage.setItem("atc-snooze", JSON.stringify(Object.fromEntries(this._snoozed)));
    } catch (_) {}
  }

  /**
   * Snooze the given alert for `durationH` hours.
   * Schedules a re-check at expiry so the card comes back automatically.
   */
  _snoozeAlert(alert, durationH) {
    const expiry = Date.now() + durationH * 3_600_000;
    this._snoozed.set(this._snoozeKey(alert), expiry);
    this._saveSnooze();
    this._snoozeMenuOpen = null;
    // Re-check at expiry so the alert reappears without needing an entity update
    setTimeout(() => {
      this._loadSnooze();
      this._lastSignature = ""; // force recompute
      this._computeActiveAlerts();
    }, durationH * 3_600_000 + 200);
    this._lastSignature = ""; // force recompute now
    this._computeActiveAlerts();
  }

  /** Toggle the snooze duration menu for the given alert */
  _toggleSnoozeMenu(alert) {
    const key = this._snoozeKey(alert);
    this._snoozeMenuOpen = this._snoozeMenuOpen === key ? null : key;
  }

  /** Render the snooze button + dropdown for the current alert */
  _renderSnoozeButton(alert) {
    if (!alert || !alert.entity) return html``;
    const key = this._snoozeKey(alert);
    const menuOpen = this._snoozeMenuOpen === key;
    return html`
      <div class="atc-snooze-wrap">
        <button
          class="atc-snooze-btn"
          title="${this._t("snooze")}"
          @click="${(e) => { e.stopPropagation(); this._toggleSnoozeMenu(alert); }}"
        >💤</button>
        ${menuOpen ? html`
          <div class="atc-snooze-menu">
            <div class="atc-snooze-label">${this._t("snooze")}</div>
            ${[[1, "snooze_1h"], [4, "snooze_4h"], [8, "snooze_8h"], [24, "snooze_24h"]].map(
              ([h, key]) => html`
                <button class="atc-snooze-option" @click="${() => this._snoozeAlert(alert, h)}">
                  ${this._t(key)}
                </button>
              `
            )}
          </div>
        ` : ""}
      </div>
    `;
  }

  /** Clear all snooze state and immediately reshow matching alerts */
  _resetSnooze() {
    this._snoozed.clear();
    try { localStorage.removeItem("atc-snooze"); } catch (_) {}
    this._snoozeMenuOpen = null;
    this._lastSignature = ""; // force full recompute
    this._computeActiveAlerts();
  }

  /** Minimal bar shown when all matching alerts are snoozed */
  _renderSnoozedIndicator() {
    return html`
      <ha-card class="at-card atc-snoozed-bar">
        <div class="atc-snoozed-inner">
          <span class="atc-snoozed-icon">💤</span>
          <span class="atc-snoozed-text">${this._snoozedCount} ${this._t("alerts_snoozed")}</span>
          <button class="atc-snoozed-reset" @click="${() => this._resetSnooze()}">
            ↩ ${this._t("snooze_reset")}
          </button>
        </div>
      </ha-card>
    `;
  }

  // ---- LitElement lifecycle ------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this._loadSnooze();
    this._startCycleTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopCycleTimer();
  }

  // ---- Helpers -------------------------------------------------------------

  /** Returns the currently visible alert object */
  get _current() {
    if (!this._activeAlerts || this._activeAlerts.length === 0) return null;
    return this._activeAlerts[this._currentIndex % this._activeAlerts.length];
  }

  /** Returns the icon for an alert: explicit override first, then theme default, then fallback */
  _getIcon(alert) {
    if (alert.icon) return alert.icon;
    return (THEME_META[alert.theme] || {}).icon || "🔔";
  }

  /** Returns a localised label based on the theme's category */
  _getCategoryLabel(theme) {
    const cat = (THEME_META[theme] || {}).category || "info";
    switch (cat) {
      case "critical": return this._t("critical");
      case "warning":  return this._t("warning_label");
      case "info":     return this._t("info_label");
      case "ok":       return this._t("success_label");
      default:         return this._t("info_label");
    }
  }

  /** Returns a "2/3" counter badge when there are multiple alerts, else empty */
  _renderCounter() {
    if (this._activeAlerts.length <= 1) return html``;
    return html`
      <div class="alert-counter">
        ${this._currentIndex + 1}<span class="counter-sep">/</span>${this._activeAlerts.length}
      </div>
    `;
  }

  /** Returns an accent colour based on the theme category (used by minimal theme) */
  _getAccentColor(theme) {
    const cat = (THEME_META[theme] || {}).category || "style";
    switch (cat) {
      case "critical": return "#e53935";
      case "warning":  return "#ff9800";
      case "info":     return "#29b6f6";
      case "ok":       return "#4caf50";
      default:         return "#9e9e9e";
    }
  }

  // ---- Theme render methods ------------------------------------------------

  /**
   * TICKER — horizontal scrolling marquee.
   * Shows all active alerts together in a single scrolling bar.
   */
  _renderTicker(alert) {
    // Collect all active alerts; fall back to the single passed alert for clear state
    const list = this._activeAlerts.length > 0 ? this._activeAlerts : (alert ? [alert] : []);
    const duration = Math.max(12, list.length * 7);

    // Build items once, then repeat them twice for seamless loop
    const items = list.map(
      (a) => html`
        <span class="tk-item">${this._getIcon(a)}&nbsp;${a.message}</span>
        <span class="tk-sep">●</span>
      `
    );

    return html`
      <ha-card class="at-card at-ticker">
        <div class="tk-label">${this._t("alerts")}</div>
        <div class="tk-track">
          <div class="tk-scroll" style="--tk-duration: ${duration}s">
            ${items}
            ${items}
          </div>
        </div>
      </ha-card>
    `;
  }

  /**
   * EMERGENCY — dark-red pulsing card for critical alerts.
   */
  _renderEmergency(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-emergency">
        <div class="em-icon">${icon}</div>
        <div class="em-content">
          <div class="em-badge">${label}</div>
          <div class="em-title">${alert.message}</div>
        </div>
        <div class="em-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * WARNING — orange/amber theme for warning-level alerts.
   */
  _renderWarning(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-warning">
        <div class="wn-icon">${icon}</div>
        <div class="wn-content">
          <div class="wn-badge">${label}</div>
          <div class="wn-title">${alert.message}</div>
        </div>
        <div class="wn-right">
          <div class="wn-dot"></div>
          ${this._renderCounter()}
        </div>
      </ha-card>
    `;
  }

  /**
   * INFO — blue theme for informational alerts.
   */
  _renderInfo(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-info">
        <div class="in-icon-wrap">${icon}</div>
        <div class="in-content">
          <div class="in-badge">${label}</div>
          <div class="in-title">${alert.message}</div>
        </div>
        <div class="in-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * SUCCESS — green theme for resolved/success states.
   */
  _renderSuccess(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-success">
        <div class="su-icon-wrap">${icon}</div>
        <div class="su-content">
          <div class="su-badge">${label}</div>
          <div class="su-title">${alert.message}</div>
        </div>
        <div class="su-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * NEON — cyberpunk cyan/magenta aesthetic.
   */
  _renderNeon(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-neon">
        <div class="ne-scan"></div>
        <div class="ne-icon">${icon}</div>
        <div class="ne-content">
          <div class="ne-badge">// ${label.toUpperCase()}_ALERT</div>
          <div class="ne-title">${alert.message}</div>
        </div>
        <div class="ne-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * GLASS — frosted glass morphism aesthetic.
   */
  _renderGlass(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-glass">
        <div class="gl-icon-wrap">${icon}</div>
        <div class="gl-content">
          <div class="gl-badge">${label}</div>
          <div class="gl-title">${alert.message}</div>
        </div>
        <div class="gl-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * MATRIX — terminal / green-on-black retro aesthetic.
   */
  _renderMatrix(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const timeStr = new Date().toTimeString().slice(0, 8);

    return html`
      <ha-card class="at-matrix">
        <div class="mx-icon">${icon}</div>
        <div class="mx-content">
          <div class="mx-header">${this._t("alert_system")} &nbsp;|&nbsp; ${timeStr}</div>
          <div class="mx-prompt">
            <span>${this._t("cmd_prefix")}</span>
            <span class="mx-cmd">&nbsp;${this._t("cmd_read")}</span>
          </div>
          <div class="mx-msg">${alert.message}<span class="mx-cursor"></span></div>
        </div>
        <div class="mx-right">
          ${this._renderCounter()}
        </div>
      </ha-card>
    `;
  }

  /**
   * MINIMAL — clean light-background card with accent left border.
   */
  _renderMinimal(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    const accent = this._getAccentColor(alert.theme);
    return html`
      <ha-card class="at-minimal" style="--minimal-accent: ${accent}">
        <div class="mn-icon">${icon}</div>
        <div class="mn-content">
          <div class="mn-badge">${label}</div>
          <div class="mn-title">${alert.message}</div>
        </div>
        <div class="mn-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  // ---- New themes -----------------------------------------------------------

  /** FIRE — orange/red flame flicker, critical */
  _renderFire(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-fire">
        <div class="fi-icon">${icon}</div>
        <div class="fi-content">
          <div class="fi-badge">${label}</div>
          <div class="fi-title">${alert.message}</div>
        </div>
        <div class="fi-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** ALARM — fast red strobe, critical */
  _renderAlarm(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-alarm">
        <div class="al-strobe"></div>
        <div class="al-icon">${icon}</div>
        <div class="al-content">
          <div class="al-badge">${label}</div>
          <div class="al-title">${alert.message}</div>
        </div>
        <div class="al-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** LIGHTNING — electric glow + flash, critical/spectacular */
  _renderLightning(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-lightning">
        <div class="lt-bg"></div>
        <div class="lt-bolt">⚡</div>
        <div class="lt-icon">${icon}</div>
        <div class="lt-content">
          <div class="lt-badge">${label}</div>
          <div class="lt-title">${alert.message}</div>
        </div>
        <div class="lt-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CAUTION — yellow/black diagonal stripe top bar, warning */
  _renderCaution(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-caution">
        <div class="ca-icon">${icon}</div>
        <div class="ca-content">
          <div class="ca-badge">${label}</div>
          <div class="ca-title">${alert.message}</div>
        </div>
        <div class="ca-right">
          <div class="ca-dot"></div>
          ${this._renderCounter()}
        </div>
      </ha-card>
    `;
  }

  /** NOTIFICATION — blue gradient bubble with pulsing red dot, info */
  _renderNotification(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-notification">
        <div class="no-icon-wrap">
          ${icon}
          <div class="no-dot"></div>
        </div>
        <div class="no-content">
          <div class="no-badge">${label}</div>
          <div class="no-title">${alert.message}</div>
        </div>
        <div class="no-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** AURORA — shifting colour gradient background, info/spectacular */
  _renderAurora(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-aurora">
        <div class="au-bg"></div>
        <div class="au-icon-wrap">${icon}</div>
        <div class="au-content">
          <div class="au-badge">${label}</div>
          <div class="au-title">${alert.message}</div>
        </div>
        <div class="au-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CHECK — pulsing green ring, ok/success */
  _renderCheck(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-check">
        <div class="ck-icon-wrap">${icon}</div>
        <div class="ck-content">
          <div class="ck-badge">${label}</div>
          <div class="ck-title">${alert.message}</div>
        </div>
        <div class="ck-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CONFETTI — floating coloured particles, ok/success/spectacular */
  _renderConfetti(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-confetti">
        <div class="cf-particles">
          <div class="cf-p cf-p1"></div><div class="cf-p cf-p2"></div>
          <div class="cf-p cf-p3"></div><div class="cf-p cf-p4"></div>
          <div class="cf-p cf-p5"></div><div class="cf-p cf-p6"></div>
          <div class="cf-p cf-p7"></div><div class="cf-p cf-p8"></div>
        </div>
        <div class="cf-icon-wrap">${icon}</div>
        <div class="cf-content">
          <div class="cf-badge">${label}</div>
          <div class="cf-title">${alert.message}</div>
        </div>
        <div class="cf-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** NUCLEAR — rotating radiation symbol, amber glow, critical */
  _renderNuclear(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-nuclear">
        <div class="nc-bg"></div>
        <div class="nc-icon">${icon}</div>
        <div class="nc-content">
          <div class="nc-badge">${label}</div>
          <div class="nc-title">${alert.message}</div>
        </div>
        <div class="nc-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** RADAR — sweeping sonar cone + concentric rings, warning */
  _renderRadar(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-radar">
        <div class="rd-display">
          <div class="rd-r rd-r1"></div>
          <div class="rd-r rd-r2"></div>
          <div class="rd-r rd-r3"></div>
          <div class="rd-sweep"></div>
          <div class="rd-center"></div>
        </div>
        <div class="rd-icon">${icon}</div>
        <div class="rd-content">
          <div class="rd-badge">${label}</div>
          <div class="rd-title">${alert.message}</div>
        </div>
        <div class="rd-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** HOLOGRAM — holographic grid + scanning line + glitch, info */
  _renderHologram(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-hologram">
        <div class="hg-grid"></div>
        <div class="hg-scan"></div>
        <div class="hg-icon-wrap">${icon}</div>
        <div class="hg-content">
          <div class="hg-badge">${label}</div>
          <div class="hg-title">${alert.message}</div>
        </div>
        <div class="hg-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** HEARTBEAT — scrolling ECG line + pulse ring, ok */
  _renderHeartbeat(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-heartbeat">
        <div class="hb-ecg">
          <svg viewBox="0 0 400 30" preserveAspectRatio="none">
            <polyline class="hb-line"
              points="0,15 30,15 42,3 54,27 66,15 96,15 108,3 120,27 132,15 200,15
                      200,15 230,15 242,3 254,27 266,15 296,15 308,3 320,27 332,15 400,15"/>
          </svg>
        </div>
        <div class="hb-icon-wrap">${icon}</div>
        <div class="hb-content">
          <div class="hb-badge">${label}</div>
          <div class="hb-title">${alert.message}</div>
        </div>
        <div class="hb-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** RETRO — CRT amber phosphor display with scanlines, style */
  _renderRetro(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert.theme);
    return html`
      <ha-card class="at-retro">
        <div class="rt-scanlines"></div>
        <div class="rt-icon">${icon}</div>
        <div class="rt-content">
          <div class="rt-badge">${label}</div>
          <div class="rt-title">${alert.message}</div>
        </div>
        <div class="rt-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * Dispatch to a theme renderer by name, passing the alert object.
   */
  _renderForTheme(theme, alert) {
    switch ((theme || "emergency").toLowerCase()) {
      case "ticker":       return this._renderTicker(alert);
      case "emergency":    return this._renderEmergency(alert);
      case "fire":         return this._renderFire(alert);
      case "alarm":        return this._renderAlarm(alert);
      case "lightning":    return this._renderLightning(alert);
      case "warning":      return this._renderWarning(alert);
      case "caution":      return this._renderCaution(alert);
      case "info":         return this._renderInfo(alert);
      case "notification": return this._renderNotification(alert);
      case "aurora":       return this._renderAurora(alert);
      case "success":      return this._renderSuccess(alert);
      case "check":        return this._renderCheck(alert);
      case "confetti":     return this._renderConfetti(alert);
      case "neon":         return this._renderNeon(alert);
      case "glass":        return this._renderGlass(alert);
      case "matrix":       return this._renderMatrix(alert);
      case "minimal":      return this._renderMinimal(alert);
      case "nuclear":      return this._renderNuclear(alert);
      case "radar":        return this._renderRadar(alert);
      case "hologram":     return this._renderHologram(alert);
      case "heartbeat":    return this._renderHeartbeat(alert);
      case "retro":        return this._renderRetro(alert);
      default:             return this._renderEmergency(alert);
    }
  }

  // ---- render() -----------------------------------------------------------

  render() {
    if (!this._config) return html``;

    // No active alerts
    if (this._activeAlerts.length === 0) {
      // Some alerts match but are snoozed — show a minimal indicator with reset button
      if (this._snoozedCount > 0) {
        return this._renderSnoozedIndicator();
      }
      if (this._config.show_when_clear) {
        // Build a virtual "all clear" alert and render it with the chosen clear theme
        const clearAlert = {
          message: this._config.clear_message || this._t("all_clear"),
          icon: "✅",
          priority: 0,
          entity: null,
          theme: this._config.clear_theme || "success",
        };
        return this._renderForTheme(clearAlert.theme, clearAlert);
      }
      return html``; // hide card completely
    }

    // Use the current alert's own theme, wrapped with fold animation
    const current = this._current;
    const inner = this._renderForTheme(current.theme || "emergency", current);
    const snoozeBtn = this._renderSnoozeButton(current);

    // Ticker has its own scroll animation — skip fold wrapper
    if ((current.theme || "").toLowerCase() === "ticker") {
      return html`<div class="atc-snooze-host">${inner}${snoozeBtn}</div>`;
    }
    return html`
      <div class="atc-snooze-host">
        <div class="at-fold-wrapper ${this._animPhase}">${inner}</div>
        ${snoozeBtn}
      </div>
    `;
  }

  // ---- Styles -------------------------------------------------------------

  static get styles() {
    return css`
      /* -----------------------------------------------------------------------
       * BASE
       * --------------------------------------------------------------------- */
      ha-card.at-card {
        padding: 0;
        overflow: hidden;
        position: relative;
        --ha-card-border-radius: 10px;
      }

      /* Shared content flex regions */
      .em-content,
      .wn-content,
      .in-content,
      .su-content,
      .ne-content,
      .gl-content,
      .mx-content,
      .mn-content {
        flex: 1;
        min-width: 0;
      }

      /* -----------------------------------------------------------------------
       * ALERT COUNTER  (e.g. "2/3")
       * --------------------------------------------------------------------- */
      .alert-counter {
        font-size: 0.62rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
      .alert-counter .counter-sep {
        opacity: 0.4;
      }

      /* -----------------------------------------------------------------------
       * TICKER THEME
       * --------------------------------------------------------------------- */
      .at-ticker {
        display: flex;
        align-items: center;
        height: 46px;
        background: #111;
        border: 1px solid #333;
        border-radius: 8px;
      }

      .tk-label {
        background: #e53935;
        color: #fff;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 0 14px;
        flex-shrink: 0;
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
      }

      .tk-track {
        flex: 1;
        overflow: hidden;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .tk-scroll {
        display: inline-flex;
        align-items: center;
        height: 100%;
        white-space: nowrap;
        gap: 40px;
        animation: tickerScroll var(--tk-duration, 20s) linear infinite;
        padding-left: 40px;
      }

      .tk-item {
        color: #f0f0f0;
        font-size: 0.85rem;
        flex-shrink: 0;
      }

      .tk-sep {
        color: #e53935;
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      @keyframes tickerScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* -----------------------------------------------------------------------
       * EMERGENCY THEME
       * --------------------------------------------------------------------- */
      .at-emergency {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 18px;
        background: linear-gradient(135deg, #1a0000, #3d0000);
        border: 2px solid #e53935;
        border-radius: 12px;
        box-shadow:
          0 0 20px rgba(229, 57, 53, 0.4),
          inset 0 0 30px rgba(229, 57, 53, 0.05);
        animation: emergencyPulse 1.2s ease-in-out infinite;
      }

      @keyframes emergencyPulse {
        0%,  100% { box-shadow: 0 0 20px rgba(229, 57, 53, 0.4); }
        50%        { box-shadow: 0 0 45px rgba(229, 57, 53, 0.8); }
      }

      .em-icon {
        font-size: 2rem;
        flex-shrink: 0;
        animation: emFlash 0.8s step-end infinite;
      }

      @keyframes emFlash {
        0%,  49% { opacity: 1; }
        50%, 100% { opacity: 0.3; }
      }

      .em-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #ff6b6b;
        margin-bottom: 3px;
      }

      .em-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
        line-height: 1.3;
      }

      .em-sub {
        font-size: 0.75rem;
        color: #ff6b6b;
        margin-top: 3px;
        opacity: 0.7;
      }

      .em-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex-shrink: 0;
      }

      .em-prio {
        background: #e53935;
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
      }

      /* -----------------------------------------------------------------------
       * WARNING THEME
       * --------------------------------------------------------------------- */
      .at-warning {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #1a1000, #2d1f00);
        border-left: 4px solid #ff9800;
        border-top: 1px solid rgba(255, 152, 0, 0.2);
        border-right: 1px solid rgba(255, 152, 0, 0.2);
        border-bottom: 1px solid rgba(255, 152, 0, 0.2);
        border-radius: 12px;
      }

      .wn-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
      }

      .wn-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #ff9800;
        margin-bottom: 3px;
      }

      .wn-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #ffe0b2;
      }

      .wn-sub {
        font-size: 0.72rem;
        color: #ffb74d;
        margin-top: 3px;
        opacity: 0.7;
      }

      .wn-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .wn-dot {
        width: 8px;
        height: 8px;
        background: #ff9800;
        border-radius: 50%;
        animation: warnBlink 2s ease-in-out infinite;
      }

      @keyframes warnBlink {
        0%,  100% { opacity: 1;   transform: scale(1); }
        50%        { opacity: 0.3; transform: scale(0.6); }
      }

      /* -----------------------------------------------------------------------
       * INFO THEME
       * --------------------------------------------------------------------- */
      .at-info {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #001a2d, #002340);
        border-left: 4px solid #29b6f6;
        border-top: 1px solid rgba(41, 182, 246, 0.15);
        border-right: 1px solid rgba(41, 182, 246, 0.15);
        border-bottom: 1px solid rgba(41, 182, 246, 0.15);
        border-radius: 12px;
      }

      .in-icon-wrap {
        width: 40px;
        height: 40px;
        background: rgba(41, 182, 246, 0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
        border: 1px solid rgba(41, 182, 246, 0.3);
      }

      .in-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #29b6f6;
        margin-bottom: 3px;
      }

      .in-title {
        font-size: 0.9rem;
        font-weight: 500;
        color: #e1f5fe;
      }

      .in-sub {
        font-size: 0.72rem;
        color: #4fc3f7;
        margin-top: 4px;
        opacity: 0.75;
      }

      .in-right {
        flex-shrink: 0;
      }

      /* -----------------------------------------------------------------------
       * SUCCESS THEME
       * --------------------------------------------------------------------- */
      .at-success {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #001a0a, #002d14);
        border-left: 4px solid #4caf50;
        border-top: 1px solid rgba(76, 175, 80, 0.15);
        border-right: 1px solid rgba(76, 175, 80, 0.15);
        border-bottom: 1px solid rgba(76, 175, 80, 0.15);
        border-radius: 12px;
      }

      .su-icon-wrap {
        width: 40px;
        height: 40px;
        background: rgba(76, 175, 80, 0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .su-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #4caf50;
        margin-bottom: 3px;
      }

      .su-title {
        font-size: 0.9rem;
        font-weight: 500;
        color: #c8e6c9;
      }

      .su-sub {
        font-size: 0.72rem;
        color: #81c784;
        margin-top: 4px;
        opacity: 0.75;
      }

      .su-right {
        flex-shrink: 0;
      }

      /* -----------------------------------------------------------------------
       * NEON THEME
       * --------------------------------------------------------------------- */
      .at-neon {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: #0a0a0f;
        border: 1px solid rgba(0, 255, 255, 0.25);
        border-radius: 10px;
        overflow: hidden;
        box-shadow:
          0 0 12px rgba(0, 255, 255, 0.1),
          inset 0 0 30px rgba(0, 255, 255, 0.03);
        position: relative;
      }

      /* Scanning line across the top */
      .ne-scan {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          #00ffff 45%,
          #ff00ff 55%,
          transparent 100%
        );
        animation: neonScan 3s linear infinite;
        pointer-events: none;
      }

      @keyframes neonScan {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .ne-icon {
        font-size: 1.6rem;
        flex-shrink: 0;
        filter: drop-shadow(0 0 8px #00ffff);
      }

      .ne-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 3px;
        color: #00ffff;
        text-shadow: 0 0 8px #00ffff;
        margin-bottom: 4px;
      }

      .ne-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #e0e0ff;
        text-shadow: 0 0 6px rgba(200, 200, 255, 0.4);
      }

      .ne-sub {
        font-size: 0.72rem;
        color: #ff00ff;
        margin-top: 4px;
        text-shadow: 0 0 6px #ff00ff;
        opacity: 0.85;
      }

      .ne-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex-shrink: 0;
      }

      .ne-prio {
        border: 1px solid #ff00ff;
        color: #ff00ff;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        text-shadow: 0 0 6px #ff00ff;
        box-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
      }

      /* -----------------------------------------------------------------------
       * GLASS THEME
       * --------------------------------------------------------------------- */
      .at-glass {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 18px;
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.4) 0%,
          rgba(118, 75, 162, 0.4) 50%,
          rgba(246, 79, 89, 0.35) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 14px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .gl-icon-wrap {
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .gl-badge {
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 4px;
      }

      .gl-title {
        font-size: 0.92rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
      }

      .gl-sub {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.55);
        margin-top: 4px;
      }

      .gl-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex-shrink: 0;
      }

      .gl-chip {
        background: rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.65rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.22);
      }

      /* -----------------------------------------------------------------------
       * MATRIX THEME
       * --------------------------------------------------------------------- */
      .at-matrix {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 16px;
        background: #000;
        border: 1px solid #00ff41;
        border-radius: 8px;
        box-shadow:
          0 0 15px rgba(0, 255, 65, 0.15),
          inset 0 0 30px rgba(0, 255, 65, 0.03);
        font-family: 'Courier New', Courier, monospace;
      }

      .mx-icon {
        font-size: 1.6rem;
        flex-shrink: 0;
        filter: hue-rotate(90deg) saturate(2);
      }

      .mx-header {
        font-size: 0.68rem;
        color: #00ff41;
        letter-spacing: 2px;
        margin-bottom: 6px;
        opacity: 0.65;
      }

      .mx-prompt {
        font-size: 0.8rem;
        color: #00ff41;
        margin-bottom: 3px;
      }

      .mx-cmd {
        opacity: 0.45;
      }

      .mx-msg {
        font-size: 0.88rem;
        font-weight: bold;
        color: #00ff41;
      }

      .mx-cursor {
        display: inline-block;
        width: 8px;
        height: 14px;
        background: #00ff41;
        animation: mxBlink 1s step-end infinite;
        vertical-align: text-bottom;
        margin-left: 2px;
      }

      @keyframes mxBlink {
        0%,  100% { opacity: 1; }
        50%        { opacity: 0; }
      }

      .mx-sub {
        font-size: 0.68rem;
        color: #00ff41;
        opacity: 0.4;
        margin-top: 5px;
      }

      .mx-right {
        flex-shrink: 0;
      }

      /* -----------------------------------------------------------------------
       * MINIMAL THEME
       * --------------------------------------------------------------------- */
      .at-minimal {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: #f8f9fa;
        border-left: 5px solid var(--minimal-accent, #e53935);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      }

      .mn-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .mn-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--minimal-accent, #e53935);
        margin-bottom: 3px;
      }

      .mn-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #212121;
      }

      .mn-right { flex-shrink: 0; }

      /* -----------------------------------------------------------------------
       * FOLD TRANSITION WRAPPER
       * --------------------------------------------------------------------- */
      .at-fold-wrapper {
        transform-origin: top center;
        perspective: 900px;
      }
      .at-fold-wrapper.fold-out {
        animation: atFoldOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper.fold-in {
        animation: atFoldIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atFoldOut {
        0%   { transform: perspective(900px) rotateX(0deg)   scaleY(1);    opacity: 1; }
        100% { transform: perspective(900px) rotateX(-88deg) scaleY(0.05); opacity: 0; }
      }
      @keyframes atFoldIn {
        0%   { transform: perspective(900px) rotateX(88deg)  scaleY(0.05); opacity: 0; }
        100% { transform: perspective(900px) rotateX(0deg)   scaleY(1);    opacity: 1; }
      }

      /* -----------------------------------------------------------------------
       * TICKER — bigger font
       * --------------------------------------------------------------------- */
      .tk-item { color: #f0f0f0; font-size: 1.05rem; flex-shrink: 0; font-weight: 500; }
      .at-ticker { height: 52px; }

      /* -----------------------------------------------------------------------
       * FIRE — orange flame, critical
       * --------------------------------------------------------------------- */
      .at-fire {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #1a0500, #2d0a00);
        border: 2px solid #ff6d00; border-radius: 12px;
        box-shadow: 0 0 22px rgba(255,109,0,0.35);
        animation: firePulse 0.9s ease-in-out infinite;
      }
      @keyframes firePulse {
        0%,100% { box-shadow: 0 0 22px rgba(255,109,0,0.35); }
        50%      { box-shadow: 0 0 42px rgba(255,109,0,0.75); }
      }
      .fi-icon {
        font-size: 2rem; flex-shrink: 0;
        animation: fireFlicker 0.4s ease-in-out infinite alternate;
      }
      @keyframes fireFlicker {
        0%   { transform: scale(1) rotate(-3deg);   filter: drop-shadow(0 0 6px #ff6d00); }
        100% { transform: scale(1.08) rotate(3deg); filter: drop-shadow(0 0 14px #ff3d00); }
      }
      .fi-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff9100; margin-bottom: 3px; }
      .fi-title { font-size: 0.95rem; font-weight: 600; color: #fff; line-height: 1.3; }
      .fi-content { flex: 1; min-width: 0; }
      .fi-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }

      /* -----------------------------------------------------------------------
       * ALARM — fast red strobe, critical
       * --------------------------------------------------------------------- */
      .at-alarm {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: #0d0000; border: 2px solid #ff1744; border-radius: 12px;
        position: relative; overflow: hidden;
      }
      .al-strobe {
        position: absolute; inset: 0; background: #ff1744; border-radius: inherit;
        animation: alarmStrobe 0.5s step-end infinite; pointer-events: none;
      }
      @keyframes alarmStrobe { 0%,49%{ opacity:0; } 50%,100%{ opacity:0.10; } }
      .al-icon { font-size: 2rem; flex-shrink: 0; position: relative; animation: alFlash 0.5s step-end infinite; }
      @keyframes alFlash { 0%,49%{ opacity:1; } 50%,100%{ opacity:0.25; } }
      .al-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff5252; margin-bottom: 3px; position: relative; }
      .al-title { font-size: 0.95rem; font-weight: 600; color: #fff; line-height: 1.3; position: relative; }
      .al-content { flex: 1; min-width: 0; position: relative; }
      .al-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * LIGHTNING — electric purple/white flash, critical/spectacular
       * --------------------------------------------------------------------- */
      .at-lightning {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: #050510; border: 2px solid #7c4dff; border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 20px rgba(124,77,255,0.3);
      }
      .lt-bg {
        position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(135deg, rgba(124,77,255,0.06), rgba(0,200,255,0.06));
        animation: ltFlash 3s ease-in-out infinite; pointer-events: none;
      }
      @keyframes ltFlash {
        0%,84%,100% { opacity:1; }
        88%          { opacity:0; background: rgba(255,255,255,0.18); }
        90%          { opacity:1; }
        94%          { opacity:0; background: rgba(255,255,255,0.10); }
      }
      .lt-bolt {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        font-size: 3.5rem; opacity: 0.05; pointer-events: none;
        animation: ltBoltFade 3s ease-in-out infinite;
      }
      @keyframes ltBoltFade { 0%,84%,100%{ opacity:0.05; } 88%{ opacity:0.45; filter:drop-shadow(0 0 16px #fff); } }
      .lt-icon {
        font-size: 1.8rem; flex-shrink: 0; position: relative;
        animation: ltGlow 1.4s ease-in-out infinite;
      }
      @keyframes ltGlow {
        0%,100% { filter: drop-shadow(0 0 5px #7c4dff); }
        50%      { filter: drop-shadow(0 0 16px #00e5ff); }
      }
      .lt-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #b388ff; margin-bottom: 3px; position: relative; }
      .lt-title { font-size: 0.95rem; font-weight: 600; color: #e8eaff; position: relative; }
      .lt-content { flex: 1; min-width: 0; position: relative; }
      .lt-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * CAUTION — yellow/black diagonal stripe, warning
       * --------------------------------------------------------------------- */
      .at-caution {
        display: flex; align-items: center; gap: 14px; padding: 18px 16px 14px;
        background: #1a1400; border: 2px solid #ffc107; border-radius: 10px;
        position: relative; overflow: hidden;
      }
      .at-caution::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 5px;
        background: repeating-linear-gradient(-45deg, #ffc107 0, #ffc107 8px, #1a1400 8px, #1a1400 16px);
      }
      .ca-icon { font-size: 1.8rem; flex-shrink: 0; filter: drop-shadow(0 0 5px #ffc107); }
      .ca-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffc107; margin-bottom: 3px; }
      .ca-title { font-size: 0.9rem; font-weight: 600; color: #fff8e1; }
      .ca-content { flex: 1; min-width: 0; }
      .ca-right { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
      .ca-dot { width: 8px; height: 8px; background: #ffc107; border-radius: 50%; animation: warnBlink 1.5s ease-in-out infinite; }

      /* -----------------------------------------------------------------------
       * NOTIFICATION — blue bubble with red pulsing dot, info
       * --------------------------------------------------------------------- */
      .at-notification {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: linear-gradient(135deg, #001428, #001e3c);
        border: 1px solid rgba(33,150,243,0.3); border-radius: 14px;
      }
      .no-icon-wrap {
        width: 46px; height: 46px;
        background: linear-gradient(135deg, #1565c0, #1976d2);
        border-radius: 14px; display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem; flex-shrink: 0;
        box-shadow: 0 4px 14px rgba(21,101,192,0.5); position: relative;
      }
      .no-dot {
        position: absolute; top: -4px; right: -4px;
        width: 11px; height: 11px; background: #ff5252; border-radius: 50%;
        border: 2px solid #001428; animation: noDot 2s ease-in-out infinite;
      }
      @keyframes noDot { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.4); } }
      .no-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64b5f6; margin-bottom: 3px; }
      .no-title { font-size: 0.9rem; font-weight: 500; color: #e3f2fd; }
      .no-content { flex: 1; min-width: 0; }
      .no-right { flex-shrink: 0; }

      /* -----------------------------------------------------------------------
       * AURORA — shifting colour gradient, info/spectacular
       * --------------------------------------------------------------------- */
      .at-aurora {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: #020c14; border: 1px solid rgba(100,255,218,0.3); border-radius: 14px;
        position: relative; overflow: hidden;
      }
      .au-bg {
        position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(135deg,
          rgba(0,200,140,0.13) 0%, rgba(0,150,255,0.11) 33%,
          rgba(120,0,255,0.09) 66%, rgba(0,200,140,0.13) 100%);
        background-size: 200% 200%;
        animation: auroraShift 6s ease-in-out infinite; pointer-events: none;
      }
      @keyframes auroraShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .au-icon-wrap {
        width: 42px; height: 42px; background: rgba(0,200,140,0.15);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem; flex-shrink: 0; border: 1px solid rgba(0,200,140,0.4);
        position: relative;
      }
      .au-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64ffda; margin-bottom: 3px; position: relative; }
      .au-title { font-size: 0.9rem; font-weight: 500; color: #e0f7fa; position: relative; }
      .au-content { flex: 1; min-width: 0; position: relative; }
      .au-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * CHECK — pulsing green ring, ok/success
       * --------------------------------------------------------------------- */
      .at-check {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: linear-gradient(135deg, #001408, #003018);
        border: 2px solid #00c853; border-radius: 12px;
        box-shadow: 0 0 16px rgba(0,200,83,0.2);
      }
      .ck-icon-wrap {
        width: 46px; height: 46px; background: rgba(0,200,83,0.15);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem; flex-shrink: 0; border: 2px solid rgba(0,200,83,0.4);
        animation: ckPulse 2s ease-in-out infinite;
      }
      @keyframes ckPulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(0,200,83,0.4); }
        50%      { box-shadow: 0 0 0 10px rgba(0,200,83,0); }
      }
      .ck-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00c853; margin-bottom: 3px; }
      .ck-title { font-size: 0.9rem; font-weight: 600; color: #b9f6ca; }
      .ck-content { flex: 1; min-width: 0; }
      .ck-right { flex-shrink: 0; }

      /* -----------------------------------------------------------------------
       * CONFETTI — floating coloured particles, ok/spectacular
       * --------------------------------------------------------------------- */
      .at-confetti {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: linear-gradient(135deg, #001408, #003020);
        border: 2px solid #69f0ae; border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(105,240,174,0.2);
      }
      .cf-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
      .cf-p {
        position: absolute; bottom: -8px; width: 5px; height: 5px; border-radius: 50%;
        animation: cfFloat 2.8s ease-in-out infinite;
      }
      .cf-p1{ left:8%;  background:#69f0ae; animation-delay:0s;   }
      .cf-p2{ left:20%; background:#ffeb3b; animation-delay:0.35s; width:4px; height:4px; }
      .cf-p3{ left:35%; background:#f48fb1; animation-delay:0.7s;  width:6px; height:6px; }
      .cf-p4{ left:50%; background:#64b5f6; animation-delay:1.05s; }
      .cf-p5{ left:65%; background:#ffcc02; animation-delay:1.4s;  width:4px; height:4px; }
      .cf-p6{ left:80%; background:#ce93d8; animation-delay:1.75s; }
      .cf-p7{ left:15%; background:#80cbc4; animation-delay:2.1s;  width:3px; height:3px; }
      .cf-p8{ left:58%; background:#ffcc02; animation-delay:2.45s; width:5px; height:5px; }
      @keyframes cfFloat {
        0%  { transform: translateY(0) rotate(0deg);   opacity:0; }
        8%  { opacity: 1; }
        92% { opacity: 1; }
        100%{ transform: translateY(-58px) rotate(200deg); opacity:0; }
      }
      .cf-icon-wrap {
        width: 44px; height: 44px; background: rgba(105,240,174,0.15);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem; flex-shrink: 0; position: relative;
        animation: cfBounce 1.2s ease-in-out infinite;
      }
      @keyframes cfBounce { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.12); } }
      .cf-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #69f0ae; margin-bottom: 3px; position: relative; }
      .cf-title { font-size: 0.9rem; font-weight: 600; color: #e8f5e9; position: relative; }
      .cf-content { flex: 1; min-width: 0; position: relative; }
      .cf-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * GLOBAL FONT SIZE REFINEMENT (all themes — overrides per-theme values)
       * --------------------------------------------------------------------- */
      .em-badge,.fi-badge,.al-badge,.lt-badge,.nc-badge { font-size: 0.72rem; }
      .wn-badge,.ca-badge,.rd-badge { font-size: 0.72rem; }
      .in-badge,.no-badge,.au-badge,.hg-badge { font-size: 0.72rem; }
      .su-badge,.ck-badge,.cf-badge,.hb-badge { font-size: 0.72rem; }
      .ne-badge,.gl-badge,.mn-badge,.rt-badge { font-size: 0.72rem; }
      .mx-header { font-size: 0.72rem; }

      .em-title,.fi-title,.al-title,.lt-title,.nc-title { font-size: 1.05rem; }
      .wn-title,.ca-title,.rd-title { font-size: 0.98rem; }
      .in-title,.no-title,.au-title,.hg-title { font-size: 0.98rem; }
      .su-title,.ck-title,.cf-title,.hb-title { font-size: 0.98rem; }
      .ne-title,.gl-title,.mn-title,.rt-title { font-size: 0.98rem; }
      .mx-msg  { font-size: 0.96rem; }
      .mx-prompt { font-size: 0.88rem; }

      /* -----------------------------------------------------------------------
       * NUCLEAR — rotating ☢ icon, amber glow, critical
       * --------------------------------------------------------------------- */
      .at-nuclear {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: radial-gradient(ellipse at center, #0f0d00, #060500);
        border: 2px solid #f9a825; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: ncGlow 2.5s ease-in-out infinite;
      }
      @keyframes ncGlow {
        0%,100% { box-shadow: 0 0 22px rgba(249,168,37,0.35); border-color: #f9a825; }
        50%      { box-shadow: 0 0 52px rgba(249,168,37,0.7);  border-color: #ffca28; }
      }
      .nc-bg {
        position: absolute; inset: 0; border-radius: inherit;
        background: radial-gradient(ellipse 55% 55% at 50% 50%,
          rgba(249,168,37,0.12) 0%, transparent 70%);
        animation: ncPulse 2.5s ease-in-out infinite; pointer-events: none;
      }
      @keyframes ncPulse { 0%,100%{ opacity:0.45; } 50%{ opacity:1; } }
      .nc-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: ncSpin 7s linear infinite;
        filter: drop-shadow(0 0 10px #f9a825);
      }
      @keyframes ncSpin { to { transform: rotate(360deg); } }
      .nc-content { flex: 1; min-width: 0; position: relative; }
      .nc-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * RADAR — sonar sweep with concentric rings, warning
       * --------------------------------------------------------------------- */
      .at-radar {
        display: flex; align-items: center; gap: 14px;
        padding: 14px 16px 14px 16px;
        background: #000f08; border: 1px solid rgba(0,230,118,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: inset 0 0 30px rgba(0,230,118,0.04);
      }
      /* Circular radar display on the right */
      .rd-display {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        width: 72px; height: 72px; border-radius: 50%;
        border: 1px solid rgba(0,230,118,0.25);
        pointer-events: none; overflow: hidden;
      }
      .rd-r {
        position: absolute; top: 50%; left: 50%; border-radius: 50%;
        border: 1px solid rgba(0,230,118,0.2);
        transform: translate(-50%,-50%);
      }
      .rd-r1 { width: 100%; height: 100%; }
      .rd-r2 { width: 66%; height: 66%; border-color: rgba(0,230,118,0.25); }
      .rd-r3 { width: 33%; height: 33%; border-color: rgba(0,230,118,0.3); }
      /* Sweeping cone */
      .rd-sweep {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: conic-gradient(rgba(0,230,118,0.55) 0deg, transparent 80deg);
        animation: rdSweep 3s linear infinite;
        border-radius: 50%;
      }
      @keyframes rdSweep { to { transform: rotate(360deg); } }
      /* Center blip */
      .rd-center {
        position: absolute; top: 50%; left: 50%;
        width: 5px; height: 5px; background: #00e676; border-radius: 50%;
        transform: translate(-50%,-50%);
        box-shadow: 0 0 8px #00e676;
      }
      .rd-icon {
        font-size: 1.8rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 6px #00e676);
        animation: rdPing 3s ease-in-out infinite;
      }
      @keyframes rdPing {
        0%,85%,100% { filter: drop-shadow(0 0 4px #00e676); }
        90%          { filter: drop-shadow(0 0 14px #00e676) brightness(1.6); }
      }
      .rd-content { flex: 1; min-width: 0; padding-right: 86px; }
      .rd-right { flex-shrink: 0; position: absolute; right: 92px; top: 50%; transform: translateY(-50%); }

      /* -----------------------------------------------------------------------
       * HOLOGRAM — blue holographic grid + scan + glitch flicker, info
       * --------------------------------------------------------------------- */
      .at-hologram {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: #000d1a; border: 1px solid rgba(0,200,255,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 22px rgba(0,200,255,0.1), inset 0 0 30px rgba(0,200,255,0.04);
      }
      .hg-grid {
        position: absolute; inset: 0; border-radius: inherit;
        background-image:
          linear-gradient(rgba(0,200,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,255,0.06) 1px, transparent 1px);
        background-size: 22px 22px;
        pointer-events: none;
      }
      .hg-scan {
        position: absolute; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, rgba(0,200,255,0.85), transparent);
        pointer-events: none;
        animation: hgScan 2.8s ease-in-out infinite;
      }
      @keyframes hgScan {
        0%   { top: -3px; opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      .hg-icon-wrap {
        width: 44px; height: 44px; background: rgba(0,200,255,0.1);
        border: 1px solid rgba(0,200,255,0.45); border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.3rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(0,200,255,0.5));
        animation: hgFlicker 5s step-end infinite;
      }
      @keyframes hgFlicker {
        0%,91%,100%{ opacity:1; }
        92%{ opacity:0.3; }
        93%{ opacity:1; }
        95%{ opacity:0.5; }
        96%{ opacity:1; }
      }
      .hg-badge { text-shadow: 0 0 8px rgba(0,200,255,0.7); color: #00c8ff !important; }
      .hg-title { color: #b3ecff; position: relative; }
      .hg-content { flex: 1; min-width: 0; position: relative; }
      .hg-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * HEARTBEAT — scrolling ECG + pulse ring on icon, ok
       * --------------------------------------------------------------------- */
      .at-heartbeat {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: linear-gradient(135deg, #001008, #001e10);
        border: 1px solid rgba(0,200,83,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,200,83,0.12);
      }
      .hb-ecg {
        position: absolute; bottom: 0; left: 0; right: 0; height: 28px;
        opacity: 0.45; overflow: hidden; pointer-events: none;
      }
      .hb-ecg svg { width: 200%; height: 100%; animation: hbScroll 2.2s linear infinite; }
      @keyframes hbScroll { to { transform: translateX(-50%); } }
      .hb-line { stroke: #00c853; stroke-width: 1.5; fill: none; filter: drop-shadow(0 0 3px #00c853); }
      .hb-icon-wrap {
        width: 46px; height: 46px; background: rgba(0,200,83,0.12);
        border: 2px solid rgba(0,200,83,0.45); border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.6rem; flex-shrink: 0; position: relative;
        animation: hbBeat 1.1s ease-in-out infinite;
      }
      @keyframes hbBeat {
        0%,100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(0,200,83,0.4); }
        15%      { transform: scale(1.14); box-shadow: 0 0 0 0   rgba(0,200,83,0.5); }
        30%      { transform: scale(1);    box-shadow: 0 0 0 10px rgba(0,200,83,0);  }
      }
      .hb-content { flex: 1; min-width: 0; position: relative; }
      .hb-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * RETRO — amber CRT phosphor with scanlines + flicker, style
       * --------------------------------------------------------------------- */
      .at-retro {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px;
        background: #080600;
        border: 2px solid #e65100; border-radius: 8px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 22px rgba(230,81,0,0.28), inset 0 0 40px rgba(230,81,0,0.05);
        font-family: 'Courier New', Courier, monospace;
        animation: rtGlow 4s ease-in-out infinite;
      }
      @keyframes rtGlow {
        0%,100%{ box-shadow: 0 0 18px rgba(230,81,0,0.25); }
        50%    { box-shadow: 0 0 36px rgba(230,81,0,0.5); }
      }
      .rt-scanlines {
        position: absolute; inset: 0; border-radius: inherit;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px
        );
        pointer-events: none;
        animation: rtFlicker 9s step-end infinite;
      }
      @keyframes rtFlicker {
        0%,92%,100%{ opacity:1; }
        93%{ opacity:0.4; }
        94%{ opacity:1; }
        96%{ opacity:0.7; }
        97%{ opacity:1; }
      }
      .rt-icon {
        font-size: 1.8rem; flex-shrink: 0; position: relative;
        filter: sepia(1) saturate(4) hue-rotate(-15deg) drop-shadow(0 0 7px #ff8f00);
      }
      .rt-badge { color: #ff8f00 !important; text-shadow: 0 0 7px #ff8f00; letter-spacing: 3px !important; }
      .rt-title { color: #ffe0b2 !important; text-shadow: 0 0 4px rgba(255,143,0,0.45); }
      .rt-content { flex: 1; min-width: 0; position: relative; }
      .rt-right { flex-shrink: 0; position: relative; }

      /* -----------------------------------------------------------------------
       * SNOOZE HOST + BUTTON + MENU
       * --------------------------------------------------------------------- */
      .atc-snooze-host {
        position: relative;
        display: block;
      }
      .atc-snooze-wrap {
        position: absolute;
        top: 7px;
        right: 7px;
        z-index: 10;
        pointer-events: none; /* invisible until card is hovered */
      }
      .atc-snooze-host:hover .atc-snooze-wrap {
        pointer-events: auto;
      }
      .atc-snooze-btn {
        background: rgba(0, 0, 0, 0.45);
        border: none;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        cursor: pointer;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.18s;
        /* NO backdrop-filter — it blurs content behind even at opacity:0 */
        padding: 0;
        line-height: 1;
      }
      .atc-snooze-host:hover .atc-snooze-btn {
        opacity: 0.65;
      }
      .atc-snooze-btn:hover {
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.65);
      }
      .atc-snooze-menu {
        position: absolute;
        top: 32px;
        right: 0;
        z-index: 20;
        background: #1a1a2e;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 8px 6px 6px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 110px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
      }
      .atc-snooze-label {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.35);
        padding: 0 6px 4px;
      }
      .atc-snooze-option {
        background: rgba(255, 255, 255, 0.06);
        border: none;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.85);
        padding: 6px 10px;
        cursor: pointer;
        font-size: 0.82rem;
        text-align: left;
        transition: background 0.12s;
        white-space: nowrap;
      }
      .atc-snooze-option:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      /* -----------------------------------------------------------------------
       * SNOOZED INDICATOR BAR (shown when all matching alerts are snoozed)
       * --------------------------------------------------------------------- */
      .atc-snoozed-bar {
        background: rgba(30, 30, 50, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.10);
      }
      .atc-snoozed-inner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        min-height: 36px;
      }
      .atc-snoozed-icon {
        font-size: 1rem;
        flex-shrink: 0;
        opacity: 0.7;
      }
      .atc-snoozed-text {
        flex: 1;
        font-size: 0.80rem;
        color: rgba(255, 255, 255, 0.50);
        font-style: italic;
        letter-spacing: 0.3px;
      }
      .atc-snoozed-reset {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.70);
        cursor: pointer;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        padding: 4px 10px;
        transition: background 0.15s, color 0.15s;
        white-space: nowrap;
      }
      .atc-snoozed-reset:hover {
        background: rgba(255, 200, 80, 0.20);
        border-color: rgba(255, 200, 80, 0.45);
        color: #ffd060;
      }
    `;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
if (!customElements.get("alert-ticker-card")) {
  customElements.define("alert-ticker-card", AlertTickerCard);
  console.info(
    "%c ALERT-TICKER-CARD %c v" + CARD_VERSION + " %c",
    "background:#e53935;color:white;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
    "background:#333;color:white;padding:2px 6px;border-radius:0 3px 3px 0",
    ""
  );
}

window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === "alert-ticker-card")) {
  window.customCards.push({
    type: "alert-ticker-card",
    name: "AlertTicker Card",
    description: "Display alerts based on entity states with 22 visual themes, snooze, numeric conditions, fold animation cycling, and a full visual editor.",
    preview: false,
  });
}
