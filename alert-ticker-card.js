/**
 * AlertTicker Card v1.0.5
 * A Home Assistant custom Lovelace card to display alerts based on entity states.
 * Supports 36 visual themes with per-alert theme assignment, priority ordering,
 * fold animation cycling, snooze, numeric conditions, attribute triggers,
 * multi-entity AND/OR conditions, action buttons, and a full visual editor.
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
const CARD_VERSION = "1.0.5";

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
  // --- New spectacular (v1.0.3) ---
  nuclear:      { icon: "☢️", category: "critical" },
  radar:        { icon: "🎯", category: "warning"  },
  hologram:     { icon: "🔷", category: "info"     },
  heartbeat:    { icon: "💓", category: "ok"       },
  // --- New spectacular (v1.0.4) ---
  flood:        { icon: "🌊", category: "critical" },
  motion:       { icon: "👁️", category: "critical" },
  intruder:     { icon: "🚷", category: "critical" },
  toxic:        { icon: "☠️", category: "critical" },
  temperature:  { icon: "🌡️", category: "warning"  },
  battery:      { icon: "🔋", category: "warning"  },
  door:         { icon: "🚪", category: "warning"  },
  presence:     { icon: "🏠", category: "info"     },
  update:       { icon: "🔄", category: "info"     },
  shield:       { icon: "🛡️", category: "ok"       },
  power:        { icon: "⚡", category: "ok"       },
  cyberpunk:    { icon: "🤖", category: "style"    },
  vapor:        { icon: "🌸", category: "style"    },
  lava:         { icon: "🌋", category: "style"    },
  // --- Timer (only shown when entity is timer.*) ---
  countdown:    { icon: "⏱️", category: "timer"    },
  hourglass:    { icon: "⏳", category: "timer"    },
  timer_pulse:  { icon: "💥", category: "timer"    },
  timer_ring:   { icon: "🔵", category: "timer"    },
};

// ---------------------------------------------------------------------------
// Translations (IT / EN / FR / DE / NL / VI)
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
    history: "Cronologia",
    history_clear: "Svuota",
    history_empty: "Nessun evento registrato",
    timer_active: "In corso",
    timer_done: "Scaduto",
    test_mode_active: "MODALITÀ TEST ATTIVA — disattivala prima di salvare",
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
    history: "History",
    history_clear: "Clear",
    history_empty: "No events recorded yet",
    timer_active: "Running",
    timer_done: "Expired",
    test_mode_active: "TEST MODE ACTIVE — disable it before saving",
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
    history: "Historique",
    history_clear: "Effacer",
    history_empty: "Aucun événement enregistré",
    timer_active: "En cours",
    timer_done: "Expiré",
    test_mode_active: "MODE TEST ACTIF — désactivez-le avant de sauvegarder",
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
    history: "Verlauf",
    history_clear: "Leeren",
    history_empty: "Noch keine Ereignisse aufgezeichnet",
    timer_active: "Läuft",
    timer_done: "Abgelaufen",
    test_mode_active: "TESTMODUS AKTIV — vor dem Speichern deaktivieren",
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
    history: "Geschiedenis",
    history_clear: "Wissen",
    history_empty: "Nog geen gebeurtenissen opgeslagen",
    timer_active: "Actief",
    timer_done: "Verlopen",
    test_mode_active: "TESTMODUS ACTIEF — schakel uit voor het opslaan",
  },
  vi: {
    alerts: "Báo động",
    critical: "Nghiêm trọng",
    warning_label: "Cảnh báo",
    info_label: "Thông tin",
    success_label: "Mọi thứ ổn",
    no_alerts: "Không có báo động nào",
    all_clear: "Không có vấn đề",
    priority_short: "P",
    alert_system: "HỆ THỐNG BÁO ĐỘNG",
    cmd_prefix: "root@ha:~$",
    cmd_read: "báo động --đọc",
    snooze: "Tạm hoãn",
    snoozed: "Đã tạm hoãn",
    snooze_1h: "1 giờ",
    snooze_4h: "4 giờ",
    snooze_8h: "8 giờ",
    snooze_24h: "24 giờ",
    snooze_reset: "Bỏ tạm hoãn tất cả",
    alerts_snoozed: "báo động đã tạm hoãn",
    history: "Lịch sử",
    history_clear: "Xóa",
    history_empty: "Chưa có sự kiện nào",
    timer_active: "Đang chạy",
    timer_done: "Hết hạn",
    test_mode_active: "CHẾ ĐỘ THỬ ĐANG BẬT — tắt trước khi lưu",
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
      _historyOpen: { type: Boolean },
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
    this._timerInterval = null;
    this._lastSignature = "";
    this._animPhase = "";
    this._initialLoadDone = false; // prevents sound/history on first compute after init
    this._snoozeMenuOpen = null;
    this._snoozedCount = 0;
    this._snoozed = new Map(); // snoozeKey → expiry timestamp
    this._historyOpen = false;
    this._history = []; // { ts, message, theme, icon, entity }
  }

  // ---- Lovelace card static helpers ----------------------------------------

  static getStubConfig() {
    return {
      cycle_interval: 5,
      cycle_animation: "fold",
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
      cycle_animation: "fold",
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [],
      ...config,
    };
    // Stop/start cycle timer based on test_mode
    if (this._config.test_mode) {
      this._stopCycleTimer();
    } else if (this._hass && !this._cycleTimer) {
      this._startCycleTimer();
    }
    // Re-compute alerts if hass is already set
    if (this._hass) {
      this._computeActiveAlerts();
    }
    // Play a one-shot animation preview when the editor changes cycle_animation
    // Delay so requestUpdate from _computeActiveAlerts settles first
    if (this._config._preview_anim) {
      setTimeout(() => this._triggerAnimPreview(), 50);
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

    // Expand entity_filter alerts into one concrete alert per matched entity
    const expandedAlerts = [];
    for (const alert of this._config.alerts) {
      if (alert.entity_filter && !alert.entity) {
        const matchFn = this._buildFilterMatcher(alert.entity_filter);
        const excluded = new Set(alert.entity_filter_exclude || []);
        const matched = Object.entries(this._hass.states).filter(([entityId, state]) => {
          if (excluded.has(entityId)) return false;
          const friendlyName = state.attributes.friendly_name || "";
          return matchFn(entityId) || matchFn(friendlyName);
        });
        for (const [entityId, state] of matched) {
          const friendlyName = state.attributes.friendly_name || entityId;
          expandedAlerts.push({
            ...alert,
            entity: entityId,
            message: (alert.message || "")
              .replace(/\{entity\}/g, entityId)
              .replace(/\{name\}/g, friendlyName)
              .replace(/\{state\}/g, state.state),
          });
        }
      } else {
        expandedAlerts.push(alert);
      }
    }

    let snoozedCount = 0;
    const testMode = !!this._config.test_mode;
    const active = expandedAlerts.filter((alert) => {
      const entityState = this._hass.states[alert.entity];
      if (!entityState) return false;
      if (!testMode) {
        // Use attribute value if specified, otherwise entity state
        const stateValue = (alert.attribute != null && alert.attribute !== "")
          ? String(this._resolveAttrPath(entityState.attributes, alert.attribute) ?? "")
          : entityState.state;
        if (!this._matchesState(stateValue, alert)) return false;
        // Extra AND/OR conditions
        if (Array.isArray(alert.conditions) && alert.conditions.length > 0) {
          const logic = alert.conditions_logic || "and";
          const results = alert.conditions.map((cond) => {
            if (!cond.entity) return false;
            const es = this._hass.states[cond.entity];
            if (!es) return false;
            const val = (cond.attribute != null && cond.attribute !== "")
              ? String(this._resolveAttrPath(es.attributes, cond.attribute) ?? "")
              : es.state;
            return this._matchesState(val, cond);
          });
          const passes = logic === "or" ? results.some(Boolean) : results.every(Boolean);
          if (!passes) return false;
        }
        if (this._isSnoozed(alert)) { snoozedCount++; return false; }
      }
      return true;
    });

    // Sort by priority (lower number = first; undefined priority goes last)
    active.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    // In test mode: jump immediately to the previewed alert before the early-return check
    if (testMode && this._config._preview_index != null) {
      const pi = this._config._preview_index;
      if (pi >= 0 && pi < active.length && pi !== this._currentIndex) {
        this._currentIndex = pi;
        this._animPhase = "";
        this._activeAlerts = active;
        this.requestUpdate();
        return;
      }
    }

    // Build a lightweight signature to detect changes
    const signature = active.map((a) => `${a.entity}:${a.message}:${a.priority}`).join("|");
    if (signature === this._lastSignature && snoozedCount === this._snoozedCount) return;

    // Record newly triggered alerts into history and play sound
    // Skip on first compute after init (avoids replaying sound/history for already-active alerts on reload)
    if (!testMode && this._initialLoadDone) {
      const prevKeys = new Set(this._activeAlerts.map((a) => this._snoozeKey(a)));
      active.forEach((alert) => {
        if (!prevKeys.has(this._snoozeKey(alert))) {
          this._recordHistory(alert);
          this._playAlertSound(alert);
        }
      });
    }
    this._initialLoadDone = true;

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
      // Skip tick if there is nothing to cycle, history is open, or test mode is active
      if (!this._activeAlerts || this._activeAlerts.length <= 1 || this._historyOpen || (this._config && this._config.test_mode)) return;
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

  /** Play one animation cycle immediately — used as preview when editor changes cycle_animation */
  _triggerAnimPreview() {
    if (this._animPhase) return; // already animating
    const FOLD_MS = 340;

    // If no active alerts, temporarily inject the first configured alert so there's something to animate
    const wasEmpty = !this._activeAlerts || this._activeAlerts.length === 0;
    if (wasEmpty) {
      const alerts = this._config.alerts || [];
      if (alerts.length === 0) return; // nothing to preview
      this._activeAlerts = [alerts[0]];
      this.requestUpdate();
    }

    setTimeout(() => {
      this._animPhase = "fold-out";
      this.requestUpdate();
      setTimeout(() => {
        this._animPhase = "fold-in";
        this.requestUpdate();
        setTimeout(() => {
          this._animPhase = "";
          if (wasEmpty) {
            this._activeAlerts = [];
          }
          this.requestUpdate();
        }, FOLD_MS);
      }, FOLD_MS);
    }, 50); // small delay so the injected alert renders first
  }

  // ---- Timer tick (1s) — keeps countdown display live -----------------------

  _startTimerTick() {
    if (this._timerInterval) return;
    this._timerInterval = setInterval(() => {
      const hasTimer = this._activeAlerts &&
        this._activeAlerts.some((a) => a.entity && a.entity.startsWith("timer."));
      if (hasTimer) this.requestUpdate();
    }, 1000);
  }

  _stopTimerTick() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }

  // ---- Timer data helper ----------------------------------------------------

  _getTimerData(alert) {
    const es = this._hass && this._hass.states[alert.entity];
    if (!es) return { progress: 1, remainingStr: "--:--", isActive: false };
    const isActive = es.state === "active";
    if (!isActive) return { progress: isActive ? 1 : 0, remainingStr: "00:00", isActive: false };
    const finishesAt = es.attributes.finishes_at;
    const duration = es.attributes.duration;
    if (!finishesAt || !duration) return { progress: 1, remainingStr: "--:--", isActive };
    const remainingMs = new Date(finishesAt).getTime() - Date.now();
    const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
    const parts = duration.split(":").map(Number);
    const totalSec = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    const progress = totalSec > 0 ? remainingSec / totalSec : 0;
    const h = Math.floor(remainingSec / 3600);
    const m = Math.floor((remainingSec % 3600) / 60).toString().padStart(2, "0");
    const s = (remainingSec % 60).toString().padStart(2, "0");
    const remainingStr = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
    return { progress, remainingStr, isActive, remainingSec, totalSec };
  }

  _resolveMessage(alert) {
    let msg = alert.message || "";
    if (!msg.includes("{")) return msg;
    // {timer} — live countdown for timer.* entities
    if (msg.includes("{timer}")) {
      const { remainingStr } = this._getTimerData(alert);
      msg = msg.replace(/\{timer\}/g, remainingStr);
    }
    // {state}, {name}, {entity} — live entity values for any alert
    if (alert.entity && this._hass && (msg.includes("{state}") || msg.includes("{name}") || msg.includes("{entity}"))) {
      const es = this._hass.states[alert.entity];
      if (es) {
        const state = (alert.attribute != null && alert.attribute !== "")
          ? String(this._resolveAttrPath(es.attributes, alert.attribute) ?? "")
          : es.state;
        const name = es.attributes.friendly_name || alert.entity;
        msg = msg
          .replace(/\{state\}/g, state)
          .replace(/\{name\}/g, name)
          .replace(/\{entity\}/g, alert.entity);
      }
    }
    return msg;
  }

  _timerColor(progress) {
    if (progress > 0.5) return "var(--success-color, #43a047)";
    if (progress > 0.2) return "#f57c00";
    return "var(--error-color, #e53935)";
  }

  // ---- State-matching helper -----------------------------------------------

  /**
   * Builds a matcher function for entity_filter.
   * Plain text → case-insensitive substring. Contains * → wildcard glob (e.g. sensor.battery_*_level).
   */
  _buildFilterMatcher(filter) {
    const f = filter.toLowerCase();
    if (f.includes("*")) {
      const pattern = f.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      const re = new RegExp(pattern);
      return (text) => re.test(text.toLowerCase());
    }
    return (text) => text.toLowerCase().includes(f);
  }

  /**
   * Resolves a dot-notation path from an attributes object.
   * Supports: "battery_level", "activity.0.forecast", "activity[0].forecast"
   */
  _resolveAttrPath(attrs, path) {
    if (attrs == null || path == null || path === "") return undefined;
    const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
    let cur = attrs;
    for (const part of parts) {
      if (cur == null) return undefined;
      cur = cur[part];
    }
    return cur;
  }

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
    return `${alert.entity}||${alert.attribute || ""}||${alert.operator || "="}||${JSON.stringify(alert.state)}`;
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

  // ---- History helpers ------------------------------------------------------

  /** Load history from localStorage */
  _loadHistory() {
    try {
      const raw = localStorage.getItem("atc-history");
      if (raw) this._history = JSON.parse(raw);
    } catch (_) { this._history = []; }
  }

  /** Persist history to localStorage */
  _saveHistory() {
    try {
      localStorage.setItem("atc-history", JSON.stringify(this._history));
    } catch (_) {}
  }

  /** Record a new alert event into history */
  _recordHistory(alert) {
    const max = this._config.history_max_events || 50;
    this._history.unshift({
      ts: Date.now(),
      message: this._resolveMessage(alert) || "",
      theme: alert.theme || "emergency",
      icon: (THEME_META[alert.theme] || {}).icon || "🔔",
      entity: alert.entity || "",
    });
    if (this._history.length > max) this._history.length = max;
    this._saveHistory();
  }

  /** Play an audio notification when an alert newly becomes active */
  _playAlertSound(alert) {
    if (!alert.sound) return;

    // Custom URL per-alert
    const url = alert.sound_url;
    if (url) {
      try { new Audio(url).play(); } catch (_) {}
      return;
    }

    // Generated tones via Web Audio API — no external files needed
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const cat = (THEME_META[alert.theme] || {}).category || "info";
      const now = ctx.currentTime;

      const tone = (freq, start, dur, vol = 0.3) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.start(start);
        osc.stop(start + dur);
      };

      switch (cat) {
        case "critical":
          // Two sharp high beeps
          tone(960, now,        0.15, 0.45);
          tone(960, now + 0.22, 0.15, 0.45);
          break;
        case "warning":
          // Single medium beep
          tone(700, now, 0.35, 0.30);
          break;
        case "ok":
          // Two rising tones — positive chime
          tone(440, now,        0.15, 0.20);
          tone(660, now + 0.18, 0.28, 0.20);
          break;
        default: // info, timer, style
          // Single soft beep
          tone(520, now, 0.30, 0.20);
          break;
      }
    } catch (_) {}
  }

  /** Clear all history */
  _clearHistory() {
    this._history = [];
    this._saveHistory();
    this.requestUpdate();
  }

  /** Toggle history view with flip animation */
  _toggleHistory() {
    this._animPhase = "fold-out";
    this.requestUpdate();
    setTimeout(() => {
      this._historyOpen = !this._historyOpen;
      this._animPhase = "fold-in";
      this.requestUpdate();
      setTimeout(() => {
        this._animPhase = "";
        this.requestUpdate();
      }, 340);
    }, 170);
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

  /** Render the snooze button for the current alert.
   *  If snooze_default_duration is set (number): single tap → immediate snooze with that duration.
   *  Otherwise (default): tap opens duration menu on card.
   *  If snooze_action is configured (per-alert), it is also executed on tap. */
  _renderSnoozeButton(alert) {
    if (!alert || !alert.entity) return html``;
    const fixedDuration = alert.snooze_duration !== undefined
      ? alert.snooze_duration
      : this._config.snooze_default_duration;
    const showMenu = fixedDuration == null;
    const snoozeAction = alert.snooze_action && alert.snooze_action.action !== "none"
      ? alert.snooze_action : null;
    if (showMenu) {
      const key = this._snoozeKey(alert);
      const menuOpen = this._snoozeMenuOpen === key;
      return html`
        <div class="atc-snooze-wrap">
          <button
            class="atc-snooze-btn"
            title="${this._t("snooze")}"
            @click="${(e) => {
              e.stopPropagation();
              if (snoozeAction) this._handleAction(snoozeAction);
              this._toggleSnoozeMenu(alert);
            }}"
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
    // Immediate snooze — single tap, no menu
    const durationH = fixedDuration;
    return html`
      <div class="atc-snooze-wrap">
        <button
          class="atc-snooze-btn"
          title="${this._t("snooze")}"
          @click="${(e) => {
            e.stopPropagation();
            if (snoozeAction) this._handleAction(snoozeAction);
            this._snoozeAlert(alert, durationH);
          }}"
        >💤</button>
      </div>
    `;
  }

  /** Render the history toggle button (📋) — hidden when history is open */
  _renderHistoryButton() {
    if (this._historyOpen) return html``;
    return html`
      <button
        class="atc-history-btn"
        title="${this._t("history")}"
        @click="${(e) => { e.stopPropagation(); this._toggleHistory(); }}"
      >📋</button>
    `;
  }

  /** Render the history view (replaces card content when _historyOpen) */
  _renderHistory() {
    const fmt = (ts) => {
      const d = new Date(ts);
      return d.toLocaleDateString(this._lang, { day: "2-digit", month: "2-digit", year: "numeric" })
        + " " + d.toLocaleTimeString(this._lang, { hour: "2-digit", minute: "2-digit" });
    };
    return html`
      <ha-card class="atc-history-card">
        <div class="atc-history-header">
          <span class="atc-history-title">${this._t("history")}</span>
          <div class="atc-history-actions">
            <button class="atc-history-clear" @click="${() => this._clearHistory()}">${this._t("history_clear")}</button>
            <button class="atc-history-close" @click="${(e) => { e.stopPropagation(); this._toggleHistory(); }}">✕</button>
          </div>
        </div>
        <div class="atc-history-list">
          ${this._history.length === 0 ? html`
            <div class="atc-history-empty">${this._t("history_empty")}</div>
          ` : this._history.map((entry) => html`
            <div class="atc-history-entry">
              <span class="atc-history-icon">${entry.icon}</span>
              <div class="atc-history-body">
                <div class="atc-history-msg">${entry.message}</div>
                <div class="atc-history-ts">${fmt(entry.ts)}</div>
              </div>
            </div>
          `)}
        </div>
      </ha-card>
    `;
  }

  /** Execute a tap_action / hold_action config object */
  _handleAction(cfg) {
    if (!cfg || !cfg.action || cfg.action === "none") return;
    switch (cfg.action) {
      case "call-service": {
        if (!cfg.service || !this._hass) return;
        const dot = cfg.service.indexOf(".");
        if (dot < 1) return;
        try {
          this._hass.callService(
            cfg.service.slice(0, dot),
            cfg.service.slice(dot + 1),
            cfg.service_data || {},
            cfg.target || {}
          );
        } catch (e) { console.error("AlertTicker: callService error", e); }
        break;
      }
      case "navigate": {
        if (!cfg.navigation_path) return;
        window.history.pushState(null, "", cfg.navigation_path);
        window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
        break;
      }
      case "more-info": {
        const entityId = cfg.entity_id || (this._current && this._current.entity);
        if (!entityId) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true, composed: true,
          detail: { entityId },
        }));
        break;
      }
      case "url": {
        if (!cfg.url_path) return;
        window.open(cfg.url_path, "_blank", "noopener");
        break;
      }
    }
  }

  /** Start hold timer on pointer down */
  _onPointerDown(e, tapCfg, holdCfg) {
    if (e.button !== undefined && e.button !== 0) return;
    this._holdFired = false;
    this._pendingTapCfg = tapCfg;
    if (holdCfg && holdCfg.action && holdCfg.action !== "none") {
      this._holdTimer = setTimeout(() => {
        this._holdFired = true;
        this._handleAction(holdCfg);
      }, 500);
    }
  }

  /** Fire tap action on pointer up (if hold didn't fire) */
  _onPointerUp(e) {
    this._cancelHold();
    if (!this._holdFired) {
      e.stopPropagation();
      this._handleAction(this._pendingTapCfg);
    }
    this._holdFired = false;
    this._pendingTapCfg = null;
  }

  _cancelHold() {
    if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = null; }
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
    this._loadHistory();
    this._startCycleTimer();
    this._startTimerTick();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopCycleTimer();
    this._stopTimerTick();
  }

  // ---- Helpers -------------------------------------------------------------

  /** Returns the currently visible alert object */
  get _current() {
    if (!this._activeAlerts || this._activeAlerts.length === 0) return null;
    return this._activeAlerts[this._currentIndex % this._activeAlerts.length];
  }

  /** Returns the icon for an alert as a TemplateResult.
   *  If use_ha_icon is true and icon looks like mdi:/hass:, renders <ha-icon>.
   *  Otherwise renders the emoji string. */
  _getIcon(alert) {
    const raw = alert.icon || (THEME_META[alert.theme] || {}).icon || "🔔";
    if (alert.use_ha_icon && raw && (raw.startsWith("mdi:") || raw.startsWith("hass:"))) {
      return html`<ha-icon icon="${raw}" class="atc-ha-icon"></ha-icon>`;
    }
    return raw;
  }

  /** Returns the badge label for an alert, respecting show_badge and badge_label overrides.
   *  Returns null when show_badge === false (badge div will be empty → hidden via CSS :empty). */
  _getCategoryLabel(alert) {
    if (alert.show_badge === false) return null;
    if (alert.badge_label) return alert.badge_label;
    const cat = (THEME_META[alert.theme] || {}).category || "info";
    switch (cat) {
      case "critical": return this._t("critical");
      case "warning":  return this._t("warning_label");
      case "info":     return this._t("info_label");
      case "ok":       return this._t("success_label");
      case "timer":    return this._t("info_label");
      default:         return this._t("info_label");
    }
  }

  /** Returns the live value of secondary_entity (or its attribute) as a styled line.
   *  Also auto-shows the friendly name when the alert was expanded from entity_filter. */
  _renderSecondaryValue(alert) {
    const lines = [];

    // entity_filter: auto-show the matched entity's friendly name (opt-out with show_filter_name: false)
    if (alert && alert.entity_filter && alert.show_filter_name !== false) {
      const es = this._hass && this._hass.states[alert.entity];
      const name = es ? (es.attributes.friendly_name || alert.entity) : alert.entity;
      lines.push(html`<div class="atc-secondary-value atc-filter-label">📍 ${name}</div>`);
    }

    // secondary_text: static custom string (supports {state}/{name}/{entity} placeholders)
    if (alert && alert.secondary_text) {
      const resolved = this._resolveMessage({ ...alert, message: alert.secondary_text });
      if (resolved) lines.push(html`<div class="atc-secondary-value">${resolved}</div>`);
    }

    // secondary_entity: live value below message
    if (alert && alert.secondary_entity) {
      const es = this._hass && this._hass.states[alert.secondary_entity];
      if (es) {
        const val = (alert.secondary_attribute != null && alert.secondary_attribute !== "")
          ? String(this._resolveAttrPath(es.attributes, alert.secondary_attribute) ?? "")
          : es.state;
        if (val !== "" && val != null) {
          lines.push(html`<div class="atc-secondary-value">${val}</div>`);
        }
      }
    }

    return lines.length ? html`${lines}` : html``;
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
    // Comfortable reading speed. Gap spacer adds a short visual breath between repetitions.
    const duration = Math.max(18, list.length * 10);

    // Build items once, then repeat twice with a wide gap spacer between copies.
    // The gap creates empty space so the text scrolls out, disappears briefly, then re-enters.
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
            ${items}<span class="tk-gap"></span>
            ${items}<span class="tk-gap"></span>
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-emergency">
        <div class="em-icon">${icon}</div>
        <div class="em-content">
          <div class="em-badge">${label}</div>
          <div class="em-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-warning">
        <div class="wn-icon">${icon}</div>
        <div class="wn-content">
          <div class="wn-badge">${label}</div>
          <div class="wn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-info">
        <div class="in-icon-wrap">${icon}</div>
        <div class="in-content">
          <div class="in-badge">${label}</div>
          <div class="in-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-success">
        <div class="su-icon-wrap">${icon}</div>
        <div class="su-content">
          <div class="su-badge">${label}</div>
          <div class="su-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-neon">
        <div class="ne-scan"></div>
        <div class="ne-icon">${icon}</div>
        <div class="ne-content">
          ${label != null ? html`<div class="ne-badge">// ${(alert.badge_label || label).toUpperCase()}_ALERT</div>` : ""}
          <div class="ne-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-glass">
        <div class="gl-icon-wrap">${icon}</div>
        <div class="gl-content">
          <div class="gl-badge">${label}</div>
          <div class="gl-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
          <div class="mx-msg">${this._resolveMessage(alert)}<span class="mx-cursor"></span></div>
          ${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    const accent = this._getAccentColor(alert.theme);
    return html`
      <ha-card class="at-minimal" style="--minimal-accent: ${accent}">
        <div class="mn-icon">${icon}</div>
        <div class="mn-content">
          <div class="mn-badge">${label}</div>
          <div class="mn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-fire">
        <div class="fi-icon">${icon}</div>
        <div class="fi-content">
          <div class="fi-badge">${label}</div>
          <div class="fi-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="fi-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** ALARM — fast red strobe, critical */
  _renderAlarm(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-alarm">
        <div class="al-strobe"></div>
        <div class="al-icon">${icon}</div>
        <div class="al-content">
          <div class="al-badge">${label}</div>
          <div class="al-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="al-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** LIGHTNING — electric glow + flash, critical/spectacular */
  _renderLightning(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-lightning">
        <div class="lt-bg"></div>
        <div class="lt-bolt">⚡</div>
        <div class="lt-icon">${icon}</div>
        <div class="lt-content">
          <div class="lt-badge">${label}</div>
          <div class="lt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lt-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CAUTION — yellow/black diagonal stripe top bar, warning */
  _renderCaution(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-caution">
        <div class="ca-icon">${icon}</div>
        <div class="ca-content">
          <div class="ca-badge">${label}</div>
          <div class="ca-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
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
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-notification">
        <div class="no-icon-wrap">
          ${icon}
          <div class="no-dot"></div>
        </div>
        <div class="no-content">
          <div class="no-badge">${label}</div>
          <div class="no-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="no-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** AURORA — shifting colour gradient background, info/spectacular */
  _renderAurora(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-aurora">
        <div class="au-bg"></div>
        <div class="au-icon-wrap">${icon}</div>
        <div class="au-content">
          <div class="au-badge">${label}</div>
          <div class="au-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="au-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CHECK — pulsing green ring, ok/success */
  _renderCheck(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-check">
        <div class="ck-icon-wrap">${icon}</div>
        <div class="ck-content">
          <div class="ck-badge">${label}</div>
          <div class="ck-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="ck-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CONFETTI — floating coloured particles, ok/success/spectacular */
  _renderConfetti(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
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
          <div class="cf-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="cf-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** NUCLEAR — rotating radiation symbol, amber glow, critical */
  _renderNuclear(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-nuclear">
        <div class="nc-bg"></div>
        <div class="nc-icon">${icon}</div>
        <div class="nc-content">
          <div class="nc-badge">${label}</div>
          <div class="nc-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="nc-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** RADAR — sweeping sonar cone + concentric rings, warning */
  _renderRadar(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
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
          <div class="rd-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="rd-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** HOLOGRAM — holographic grid + scanning line + glitch, info */
  _renderHologram(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-hologram">
        <div class="hg-grid"></div>
        <div class="hg-scan"></div>
        <div class="hg-icon-wrap">${icon}</div>
        <div class="hg-content">
          <div class="hg-badge">${label}</div>
          <div class="hg-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="hg-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** HEARTBEAT — scrolling ECG line + pulse ring, ok */
  _renderHeartbeat(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
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
          <div class="hb-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="hb-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** RETRO — CRT amber phosphor display with scanlines, style */
  _renderRetro(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-retro">
        <div class="rt-scanlines"></div>
        <div class="rt-icon">${icon}</div>
        <div class="rt-content">
          <div class="rt-badge">${label}</div>
          <div class="rt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="rt-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** FLOOD — animated water waves, deep blue, critical */
  _renderFlood(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-flood">
        <div class="fl-waves"></div>
        <div class="fl-icon">${icon}</div>
        <div class="fl-content">
          <div class="fl-badge">${label}</div>
          <div class="fl-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="fl-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** MOTION — night-vision green eye scan, critical */
  _renderMotion(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-motion">
        <div class="mo-scan"></div>
        <div class="mo-icon">${icon}</div>
        <div class="mo-content">
          <div class="mo-badge">${label}</div>
          <div class="mo-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="mo-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** INTRUDER — red/black siren flash + diagonal stripes, critical */
  _renderIntruder(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-intruder">
        <div class="it-stripes"></div>
        <div class="it-icon">${icon}</div>
        <div class="it-content">
          <div class="it-badge">${label}</div>
          <div class="it-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="it-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** TOXIC — rising green bubbles + skull glow, critical */
  _renderToxic(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-toxic">
        <div class="tx-bubble tx-b1"></div>
        <div class="tx-bubble tx-b2"></div>
        <div class="tx-bubble tx-b3"></div>
        <div class="tx-bubble tx-b4"></div>
        <div class="tx-icon">${icon}</div>
        <div class="tx-content">
          <div class="tx-badge">${label}</div>
          <div class="tx-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="tx-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** TEMPERATURE — shaking thermometer + fill bar, warning */
  _renderTemperature(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-temperature">
        <div class="tp-fill"></div>
        <div class="tp-icon">${icon}</div>
        <div class="tp-content">
          <div class="tp-badge">${label}</div>
          <div class="tp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="tp-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** BATTERY — blinking drain bar, warning */
  _renderBattery(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-battery">
        <div class="bt-drain"></div>
        <div class="bt-icon">${icon}</div>
        <div class="bt-content">
          <div class="bt-badge">${label}</div>
          <div class="bt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="bt-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** DOOR — swinging door + light ray, warning */
  _renderDoor(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-door">
        <div class="dr-ray"></div>
        <div class="dr-icon">${icon}</div>
        <div class="dr-content">
          <div class="dr-badge">${label}</div>
          <div class="dr-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="dr-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** PRESENCE — expanding ping rings, info */
  _renderPresence(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-presence">
        <div class="pr-ping">
          <div class="pr-ring"></div>
          <div class="pr-ring"></div>
          <div class="pr-ring"></div>
        </div>
        <div class="pr-icon">${icon}</div>
        <div class="pr-content">
          <div class="pr-badge">${label}</div>
          <div class="pr-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="pr-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** UPDATE — spinning double progress ring, info */
  _renderUpdate(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-update">
        <div class="up-ring"></div>
        <div class="up-icon">${icon}</div>
        <div class="up-content">
          <div class="up-badge">${label}</div>
          <div class="up-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="up-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** SHIELD — scan wave + glow pulse, ok */
  _renderShield(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-shield">
        <div class="sh-scan"></div>
        <div class="sh-icon">${icon}</div>
        <div class="sh-content">
          <div class="sh-badge">${label}</div>
          <div class="sh-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="sh-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** POWER — energy surge lines + zap icon, ok */
  _renderPower(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-power">
        <div class="pw-lines"></div>
        <div class="pw-icon">${icon}</div>
        <div class="pw-content">
          <div class="pw-badge">${label}</div>
          <div class="pw-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="pw-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** CYBERPUNK — neon purple/cyan diagonal lines + glitch bar, style */
  _renderCyberpunk(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-cyberpunk">
        <div class="cp-lines"></div>
        <div class="cp-glitch"></div>
        <div class="cp-icon">${icon}</div>
        <div class="cp-content">
          <div class="cp-badge">${label}</div>
          <div class="cp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="cp-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** VAPOR — vaporwave grid + gradient float, style */
  _renderVapor(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-vapor">
        <div class="vp-grid"></div>
        <div class="vp-overlay"></div>
        <div class="vp-icon">${icon}</div>
        <div class="vp-content">
          <div class="vp-badge">${label}</div>
          <div class="vp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="vp-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /** LAVA — floating orange blobs on black, style */
  _renderLava(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <ha-card class="at-lava">
        <div class="lv-blob lv-b1"></div>
        <div class="lv-blob lv-b2"></div>
        <div class="lv-blob lv-b3"></div>
        <div class="lv-icon">${icon}</div>
        <div class="lv-content">
          <div class="lv-badge">${label}</div>
          <div class="lv-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lv-right">${this._renderCounter()}</div>
      </ha-card>
    `;
  }

  /**
   * Dispatch to a theme renderer by name, passing the alert object.
   */
  // ---- Timer themes ----------------------------------------------------------

  _renderCountdown(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const urgent = progress < 0.2;
    return html`
      <ha-card class="at-countdown ${urgent ? "cd-urgent" : ""}">
        <div class="cd-icon">${icon}</div>
        <div class="cd-content">
          <div class="cd-badge">${isActive ? this._t("timer_active") : this._t("timer_done")}</div>
          <div class="cd-title">${message}</div>
          ${this._renderSecondaryValue(alert)}
        </div>
        <div class="cd-right">
          <div class="cd-time" style="color:${color}">${remainingStr}</div>
          ${this._renderCounter()}
        </div>
        <div class="cd-bar-track">
          <div class="cd-bar-fill" style="width:${progress * 100}%;background:${color}"></div>
        </div>
      </ha-card>
    `;
  }

  _renderHourglass(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const urgent = progress < 0.2;
    return html`
      <ha-card class="at-hourglass ${urgent ? "hg2-urgent" : ""}">
        <div class="hg2-fill" style="height:${progress * 100}%;background:${color}20"></div>
        <div class="hg2-icon">${icon}</div>
        <div class="hg2-content">
          <div class="hg2-badge">${isActive ? this._t("timer_active") : this._t("timer_done")}</div>
          <div class="hg2-title">${message}</div>
          ${this._renderSecondaryValue(alert)}
        </div>
        <div class="hg2-right">
          <div class="hg2-time" style="color:${color}">${remainingStr}</div>
          ${this._renderCounter()}
        </div>
      </ha-card>
    `;
  }

  _renderTimerPulse(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const speed = Math.max(0.4, progress * 2.5).toFixed(2);
    return html`
      <ha-card class="at-timer-pulse" style="--tp-color:${color};--tp-speed:${speed}s">
        <div class="tp-icon">${icon}</div>
        <div class="tp-content">
          <div class="tp-badge">${isActive ? this._t("timer_active") : this._t("timer_done")}</div>
          <div class="tp-title">${message}</div>
          ${this._renderSecondaryValue(alert)}
        </div>
        <div class="tp-right">
          <div class="tp-time">${remainingStr}</div>
          ${this._renderCounter()}
        </div>
      </ha-card>
    `;
  }

  _renderTimerRing(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const R = 22;
    const circ = +(2 * Math.PI * R).toFixed(2);
    const dash = +(circ * progress).toFixed(2);
    return html`
      <ha-card class="at-timer-ring">
        <div class="tr2-icon">${icon}</div>
        <div class="tr2-content">
          <div class="tr2-badge">${isActive ? this._t("timer_active") : this._t("timer_done")}</div>
          <div class="tr2-title">${message}</div>
          ${this._renderSecondaryValue(alert)}
        </div>
        <div class="tr2-ring-wrap">
          <svg viewBox="0 0 52 52" class="tr2-svg">
            <circle class="tr2-bg" cx="26" cy="26" r="${R}"/>
            <circle class="tr2-progress" cx="26" cy="26" r="${R}"
              stroke="${color}"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${circ - dash}"
              transform="rotate(-90 26 26)"
            />
          </svg>
          <div class="tr2-time" style="color:${color}">${remainingStr}</div>
        </div>
        ${this._renderCounter()}
      </ha-card>
    `;
  }

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
      case "flood":        return this._renderFlood(alert);
      case "motion":       return this._renderMotion(alert);
      case "intruder":     return this._renderIntruder(alert);
      case "toxic":        return this._renderToxic(alert);
      case "temperature":  return this._renderTemperature(alert);
      case "battery":      return this._renderBattery(alert);
      case "door":         return this._renderDoor(alert);
      case "presence":     return this._renderPresence(alert);
      case "update":       return this._renderUpdate(alert);
      case "shield":       return this._renderShield(alert);
      case "power":        return this._renderPower(alert);
      case "cyberpunk":    return this._renderCyberpunk(alert);
      case "vapor":        return this._renderVapor(alert);
      case "lava":         return this._renderLava(alert);
      case "countdown":    return this._renderCountdown(alert);
      case "hourglass":    return this._renderHourglass(alert);
      case "timer_pulse":  return this._renderTimerPulse(alert);
      case "timer_ring":   return this._renderTimerRing(alert);
      default:             return this._renderEmergency(alert);
    }
  }

  // ---- render() -----------------------------------------------------------

  render() {
    if (!this._config) return html``;

    // No active alerts
    if (this._activeAlerts.length === 0) {
      // Some alerts match but are snoozed — show a minimal indicator with reset button
      if (this._snoozedCount > 0 && this._config.show_snooze_bar !== false) {
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
    const snoozeBtn = this._renderSnoozeButton(current);
    const historyBtn = this._renderHistoryButton();

    // Small pill shown at bottom-right when ≥1 alert is snoozed but others are still active
    const snoozedPill = (this._snoozedCount > 0 && this._config.show_snooze_bar !== false) ? html`
      <button class="atc-snoozed-pill" title="${this._t("snooze_reset")}" @click="${() => this._resetSnooze()}">
        💤 ${this._snoozedCount}
      </button>
    ` : "";

    const testModeBanner = this._config.test_mode ? html`
      <div class="atc-test-mode-banner">🧪 ${this._t("test_mode_active")}</div>
    ` : "";

    // History view — replaces card content with animation
    if (this._historyOpen) {
      return html`
        <div class="atc-card-root">
          <div class="atc-snooze-host${this._config.large_buttons ? " atc-large-buttons" : ""}">
            <div class="at-fold-wrapper ${this._animPhase}" data-anim="${this._config.cycle_animation || "fold"}">
              ${this._renderHistory()}
            </div>
            ${historyBtn}${snoozedPill}
          </div>
          ${testModeBanner}
        </div>
      `;
    }

    const inner = this._renderForTheme(current.theme || "emergency", current);

    // tap_action / hold_action — backwards-compat: old "action" key maps to tap call-service
    const tapCfg  = current.tap_action  || (current.action ? { action: "call-service", ...current.action } : null);
    const holdCfg = current.hold_action || null;
    const hasInteraction = (tapCfg  && tapCfg.action  && tapCfg.action  !== "none") ||
                           (holdCfg && holdCfg.action && holdCfg.action !== "none");

    const pdHandler = hasInteraction ? (e) => this._onPointerDown(e, tapCfg, holdCfg) : null;
    const puHandler = hasInteraction ? (e) => this._onPointerUp(e)                    : null;
    const plHandler = hasInteraction ? ()  => this._cancelHold()                      : null;

    // Ticker has its own scroll animation — skip fold wrapper
    if ((current.theme || "").toLowerCase() === "ticker") {
      return html`
        <div class="atc-card-root">
          <div class="atc-snooze-host${this._config.large_buttons ? " atc-large-buttons" : ""}">
            <div class="${hasInteraction ? "atc-clickable" : ""}"
              @pointerdown="${pdHandler}" @pointerup="${puHandler}"
              @pointerleave="${plHandler}" @pointercancel="${plHandler}">${inner}</div>
            ${snoozeBtn}${historyBtn}${snoozedPill}
          </div>
          ${testModeBanner}
        </div>`;
    }
    return html`
      <div class="atc-card-root">
        <div class="atc-snooze-host${this._config.large_buttons ? " atc-large-buttons" : ""}">
          <div class="at-fold-wrapper ${this._animPhase}${hasInteraction ? " atc-clickable" : ""}"
            data-anim="${this._config.cycle_animation || "fold"}"
            @pointerdown="${pdHandler}" @pointerup="${puHandler}"
            @pointerleave="${plHandler}" @pointercancel="${plHandler}">${inner}</div>
          ${snoozeBtn}${historyBtn}${snoozedPill}
        </div>
        ${testModeBanner}
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

      /* -----------------------------------------------------------------------
       * BADGE — hide when empty (show_badge: false)
       * --------------------------------------------------------------------- */
      [class$="-badge"]:empty {
        display: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* -----------------------------------------------------------------------
       * HA ICON — when use_ha_icon is true
       * --------------------------------------------------------------------- */
      .atc-ha-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 1.6em;
        color: inherit;
      }

      /* -----------------------------------------------------------------------
       * SECONDARY VALUE LINE — live entity/attribute value below the message
       * --------------------------------------------------------------------- */
      .atc-secondary-value {
        font-size: 0.78rem;
        opacity: 0.72;
        margin-top: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
      }
      .atc-filter-label {
        opacity: 0.85;
        font-weight: 500;
        font-style: italic;
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

      /* Short spacer between the two copies — a brief visual breath before the text loops */
      .tk-gap {
        display: inline-block;
        width: 120px;
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
       * TRANSITION WRAPPER — shared base
       * --------------------------------------------------------------------- */
      .at-fold-wrapper {
        transform-origin: top center;
        overflow: hidden;
      }

      /* ── FOLD (default / 3-D page-turn) ── */
      .at-fold-wrapper[data-anim="fold"].fold-out,
      .at-fold-wrapper:not([data-anim]).fold-out {
        animation: atFoldOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="fold"].fold-in,
      .at-fold-wrapper:not([data-anim]).fold-in {
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

      /* ── SLIDE (horizontal push) ── */
      .at-fold-wrapper[data-anim="slide"].fold-out {
        animation: atSlideOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="slide"].fold-in {
        animation: atSlideIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atSlideOut {
        0%   { transform: translateX(0);      opacity: 1; }
        100% { transform: translateX(-110%);  opacity: 0; }
      }
      @keyframes atSlideIn {
        0%   { transform: translateX(110%);   opacity: 0; }
        100% { transform: translateX(0);      opacity: 1; }
      }

      /* ── FADE (cross-dissolve) ── */
      .at-fold-wrapper[data-anim="fade"].fold-out {
        animation: atFadeOut 0.34s ease forwards;
      }
      .at-fold-wrapper[data-anim="fade"].fold-in {
        animation: atFadeIn 0.34s ease forwards;
      }
      @keyframes atFadeOut {
        0%   { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes atFadeIn {
        0%   { opacity: 0; }
        100% { opacity: 1; }
      }

      /* ── FLIP (rotateY card flip) ── */
      .at-fold-wrapper[data-anim="flip"].fold-out {
        animation: atFlipOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="flip"].fold-in {
        animation: atFlipIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atFlipOut {
        0%   { transform: perspective(600px) rotateY(0deg);  opacity: 1; }
        100% { transform: perspective(600px) rotateY(90deg); opacity: 0; }
      }
      @keyframes atFlipIn {
        0%   { transform: perspective(600px) rotateY(-90deg); opacity: 0; }
        100% { transform: perspective(600px) rotateY(0deg);   opacity: 1; }
      }

      /* ── ZOOM (scale punch) ── */
      .at-fold-wrapper[data-anim="zoom"].fold-out {
        animation: atZoomOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="zoom"].fold-in {
        animation: atZoomIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atZoomOut {
        0%   { transform: scale(1);   opacity: 1; }
        100% { transform: scale(0.6); opacity: 0; }
      }
      @keyframes atZoomIn {
        0%   { transform: scale(1.2); opacity: 0; }
        100% { transform: scale(1);   opacity: 1; }
      }

      /* ── BOUNCE (elastic spring from below) ── */
      .at-fold-wrapper[data-anim="bounce"].fold-out {
        animation: atBounceOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="bounce"].fold-in {
        animation: atBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      @keyframes atBounceOut {
        0%   { transform: translateY(0)    scaleY(1);    opacity: 1; }
        100% { transform: translateY(-40%) scaleY(0.7);  opacity: 0; }
      }
      @keyframes atBounceIn {
        0%   { transform: translateY(60%)  scaleY(0.6);  opacity: 0; }
        100% { transform: translateY(0)    scaleY(1);    opacity: 1; }
      }

      /* ── SWING (rotateZ pendulum) ── */
      .at-fold-wrapper[data-anim="swing"].fold-out {
        animation: atSwingOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
        transform-origin: top left;
      }
      .at-fold-wrapper[data-anim="swing"].fold-in {
        animation: atSwingIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
        transform-origin: top left;
      }
      @keyframes atSwingOut {
        0%   { transform: rotate(0deg);   opacity: 1; }
        100% { transform: rotate(15deg);  opacity: 0; }
      }
      @keyframes atSwingIn {
        0%   { transform: rotate(-15deg); opacity: 0; }
        100% { transform: rotate(0deg);   opacity: 1; }
      }

      /* ── BLUR (gaussian dissolve) ── */
      .at-fold-wrapper[data-anim="blur"].fold-out {
        animation: atBlurOut 0.34s ease forwards;
      }
      .at-fold-wrapper[data-anim="blur"].fold-in {
        animation: atBlurIn 0.34s ease forwards;
      }
      @keyframes atBlurOut {
        0%   { filter: blur(0px);   opacity: 1; }
        100% { filter: blur(12px);  opacity: 0; }
      }
      @keyframes atBlurIn {
        0%   { filter: blur(12px);  opacity: 0; }
        100% { filter: blur(0px);   opacity: 1; }
      }

      /* ── SPLIT (vertical split — top up, bottom down) ── */
      .at-fold-wrapper[data-anim="split"].fold-out {
        animation: atSplitOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="split"].fold-in {
        animation: atSplitIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atSplitOut {
        0%   { clip-path: inset(0 0 0 0);         opacity: 1; }
        100% { clip-path: inset(50% 0 50% 0);     opacity: 0; }
      }
      @keyframes atSplitIn {
        0%   { clip-path: inset(50% 0 50% 0);     opacity: 0; }
        100% { clip-path: inset(0 0 0 0);         opacity: 1; }
      }

      /* ── ROLL (rotateY + translateX combined) ── */
      .at-fold-wrapper[data-anim="roll"].fold-out {
        animation: atRollOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="roll"].fold-in {
        animation: atRollIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atRollOut {
        0%   { transform: perspective(600px) rotateY(0deg)   translateX(0);      opacity: 1; }
        100% { transform: perspective(600px) rotateY(-60deg) translateX(-60%);   opacity: 0; }
      }
      @keyframes atRollIn {
        0%   { transform: perspective(600px) rotateY(60deg)  translateX(60%);    opacity: 0; }
        100% { transform: perspective(600px) rotateY(0deg)   translateX(0);      opacity: 1; }
      }

      /* ── CURTAIN (opens from center — clip-path left/right) ── */
      .at-fold-wrapper[data-anim="curtain"].fold-out {
        animation: atCurtainOut 0.34s cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      .at-fold-wrapper[data-anim="curtain"].fold-in {
        animation: atCurtainIn 0.34s cubic-bezier(0, 0, 0.6, 1) forwards;
      }
      @keyframes atCurtainOut {
        0%   { clip-path: inset(0 0% 0 0%);    opacity: 1; }
        100% { clip-path: inset(0 50% 0 50%);  opacity: 0; }
      }
      @keyframes atCurtainIn {
        0%   { clip-path: inset(0 50% 0 50%);  opacity: 0; }
        100% { clip-path: inset(0 0% 0 0%);    opacity: 1; }
      }

      /* ── GLITCH (digital clip-path jitter) ── */
      .at-fold-wrapper[data-anim="glitch"].fold-out {
        animation: atGlitchOut 0.34s steps(1) forwards;
      }
      .at-fold-wrapper[data-anim="glitch"].fold-in {
        animation: atGlitchIn 0.34s steps(1) forwards;
      }
      @keyframes atGlitchOut {
        0%   { opacity: 1; transform: translateX(0);   clip-path: inset(0 0 0 0); }
        20%  { opacity: 1; transform: translateX(5px);  clip-path: inset(15% 0 35% 0); }
        40%  { opacity: 1; transform: translateX(-4px); clip-path: inset(55% 0 8%  0); }
        60%  { opacity: 1; transform: translateX(3px);  clip-path: inset(28% 0 22% 0); }
        80%  { opacity: 0.3; transform: translateX(-2px); clip-path: inset(0 0 0 0); }
        100% { opacity: 0; transform: translateX(0);   clip-path: inset(50% 0 50% 0); }
      }
      @keyframes atGlitchIn {
        0%   { opacity: 0; transform: translateX(0);   clip-path: inset(50% 0 50% 0); }
        20%  { opacity: 0.4; transform: translateX(-5px); clip-path: inset(8% 0 55% 0); }
        40%  { opacity: 0.6; transform: translateX(4px);  clip-path: inset(35% 0 15% 0); }
        60%  { opacity: 0.8; transform: translateX(-3px); clip-path: inset(22% 0 28% 0); }
        80%  { opacity: 0.9; transform: translateX(2px);  clip-path: inset(0 0 0 0); }
        100% { opacity: 1; transform: translateX(0);   clip-path: inset(0 0 0 0); }
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
      .fl-badge,.mo-badge,.it-badge,.tx-badge { font-size: 0.72rem; }
      .tp-badge,.bt-badge,.dr-badge { font-size: 0.72rem; }
      .pr-badge,.up-badge { font-size: 0.72rem; }
      .sh-badge,.pw-badge { font-size: 0.72rem; }
      .cp-badge,.vp-badge,.lv-badge { font-size: 0.72rem; }

      .em-title,.fi-title,.al-title,.lt-title,.nc-title { font-size: 1.05rem; }
      .wn-title,.ca-title,.rd-title { font-size: 0.98rem; }
      .in-title,.no-title,.au-title,.hg-title { font-size: 0.98rem; }
      .su-title,.ck-title,.cf-title,.hb-title { font-size: 0.98rem; }
      .ne-title,.gl-title,.mn-title,.rt-title { font-size: 0.98rem; }
      .mx-msg  { font-size: 0.96rem; }
      .mx-prompt { font-size: 0.88rem; }
      .fl-title,.mo-title,.it-title,.tx-title { font-size: 1.05rem; }
      .tp-title,.bt-title,.dr-title { font-size: 0.98rem; }
      .pr-title,.up-title { font-size: 0.98rem; }
      .sh-title,.pw-title { font-size: 0.98rem; }
      .cp-title,.vp-title,.lv-title { font-size: 0.98rem; }

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
       * FLOOD — animated water waves, deep blue, critical
       * --------------------------------------------------------------------- */
      .at-flood {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(180deg, #010b15 0%, #012a4a 100%);
        border: 2px solid #0096c7; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: flGlow 2s ease-in-out infinite;
      }
      @keyframes flGlow {
        0%,100% { box-shadow: 0 0 22px rgba(0,150,199,0.3); }
        50%      { box-shadow: 0 0 55px rgba(0,150,199,0.7); }
      }
      .fl-waves {
        position: absolute; bottom: 0; left: -22px; right: 0; height: 18px;
        background: repeating-linear-gradient(90deg,
          transparent 0, transparent 18px,
          rgba(0,188,212,0.25) 18px, rgba(0,188,212,0.25) 22px);
        animation: flWave 1.6s linear infinite;
        pointer-events: none;
      }
      @keyframes flWave { to { transform: translateX(22px); } }
      .fl-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px #0096c7);
        animation: flBob 2s ease-in-out infinite;
      }
      @keyframes flBob {
        0%,100% { transform: translateY(0); }
        50%      { transform: translateY(-5px); }
      }
      .fl-content { flex: 1; min-width: 0; position: relative; }
      .fl-right   { flex-shrink: 0; position: relative; }
      .fl-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00e5ff; margin-bottom: 3px; }
      .fl-title { font-weight: 700; color: #e0f7fa; }

      /* -----------------------------------------------------------------------
       * MOTION — night-vision green infrared scan, critical
       * --------------------------------------------------------------------- */
      .at-motion {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000e00, #001a00);
        border: 1px solid rgba(0,255,65,0.45); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,255,65,0.08), inset 0 0 40px rgba(0,255,65,0.03);
      }
      .mo-scan {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(0deg,
          transparent 0, transparent 3px,
          rgba(0,255,65,0.04) 3px, rgba(0,255,65,0.04) 4px);
        animation: moFlicker 0.18s steps(2) infinite;
      }
      @keyframes moFlicker { 0%,100% { opacity: 1; } 50% { opacity: 0.82; } }
      .mo-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(0,255,65,0.8));
        animation: moScan 2.5s ease-in-out infinite;
      }
      @keyframes moScan {
        0%,100% { transform: translateX(0); }
        30%      { transform: translateX(6px); }
        70%      { transform: translateX(-6px); }
      }
      .mo-content { flex: 1; min-width: 0; position: relative; }
      .mo-right   { flex-shrink: 0; position: relative; }
      .mo-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00ff41; margin-bottom: 3px; text-shadow: 0 0 6px #00ff41; }
      .mo-title { font-weight: 700; color: #ccffcc; text-shadow: 0 0 4px rgba(0,255,65,0.4); }

      /* -----------------------------------------------------------------------
       * INTRUDER — red/black siren flash + rotating icon, critical
       * --------------------------------------------------------------------- */
      .at-intruder {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: #0a0000;
        border: 2px solid #d50000; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: itFlash 0.65s ease-in-out infinite;
      }
      @keyframes itFlash {
        0%,100% { background: #0a0000; border-color: #d50000; box-shadow: 0 0 20px rgba(213,0,0,0.3); }
        50%      { background: #1c0000; border-color: #ff1744; box-shadow: 0 0 55px rgba(255,23,68,0.65); }
      }
      .it-stripes {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(
          45deg, transparent 0, transparent 12px,
          rgba(255,23,68,0.06) 12px, rgba(255,23,68,0.06) 14px);
      }
      .it-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 14px #ff1744);
        animation: itSpin 1.8s linear infinite;
      }
      @keyframes itSpin { to { transform: rotate(360deg); } }
      .it-content { flex: 1; min-width: 0; position: relative; }
      .it-right   { flex-shrink: 0; position: relative; }
      .it-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff1744; margin-bottom: 3px; text-shadow: 0 0 6px #ff1744; }
      .it-title { font-weight: 700; color: #ffcdd2; }

      /* -----------------------------------------------------------------------
       * TOXIC — rising bubbles + poison green glow, critical
       * --------------------------------------------------------------------- */
      .at-toxic {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #010d00, #001a00);
        border: 1px solid rgba(57,255,20,0.5); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: inset 0 0 30px rgba(57,255,20,0.05);
      }
      .tx-bubble {
        position: absolute; border-radius: 50%;
        background: radial-gradient(circle, rgba(57,255,20,0.3) 0%, transparent 70%);
        animation: txRise 3s ease-in infinite; pointer-events: none;
      }
      .tx-b1 { width: 14px; height: 14px; left: 15%; bottom: -14px; animation-duration: 2.8s; animation-delay: 0s; }
      .tx-b2 { width:  9px; height:  9px; left: 38%; bottom:  -9px; animation-duration: 3.5s; animation-delay: 0.7s; }
      .tx-b3 { width: 18px; height: 18px; left: 60%; bottom: -18px; animation-duration: 2.5s; animation-delay: 1.4s; }
      .tx-b4 { width:  7px; height:  7px; left: 80%; bottom:  -7px; animation-duration: 3.2s; animation-delay: 2.1s; }
      @keyframes txRise {
        0%   { transform: translateY(0) scale(1);   opacity: 0; }
        15%  { opacity: 0.85; }
        85%  { opacity: 0.35; }
        100% { transform: translateY(-75px) scale(0.4); opacity: 0; }
      }
      .tx-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: txPulse 2s ease-in-out infinite;
      }
      @keyframes txPulse {
        0%,100% { filter: drop-shadow(0 0 10px rgba(57,255,20,0.7)); }
        50%      { filter: drop-shadow(0 0 22px rgba(57,255,20,1)); }
      }
      .tx-content { flex: 1; min-width: 0; position: relative; }
      .tx-right   { flex-shrink: 0; position: relative; }
      .tx-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #39ff14; margin-bottom: 3px; text-shadow: 0 0 6px #39ff14; }
      .tx-title { font-weight: 700; color: #ccffcc; }

      /* -----------------------------------------------------------------------
       * TEMPERATURE — shaking thermometer + glowing fill bar, warning
       * --------------------------------------------------------------------- */
      .at-temperature {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0300, #1f0800);
        border: 1px solid rgba(255,87,34,0.55); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(255,87,34,0.12);
      }
      .tp-fill {
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 4px; border-radius: 0 0 12px 12px;
        background: linear-gradient(90deg, #ff5722, #ff8f00, #ffca28);
        animation: tpPulse 2s ease-in-out infinite;
      }
      @keyframes tpPulse { 0%,100% { opacity: 0.7; box-shadow: none; } 50% { opacity: 1; box-shadow: 0 0 10px rgba(255,87,34,0.8); } }
      .tp-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(255,87,34,0.8));
        animation: tpShake 0.45s ease-in-out infinite;
      }
      @keyframes tpShake {
        0%,100% { transform: rotate(0deg); }
        25%      { transform: rotate(-6deg); }
        75%      { transform: rotate(6deg); }
      }
      .tp-content { flex: 1; min-width: 0; position: relative; }
      .tp-right   { flex-shrink: 0; position: relative; }
      .tp-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff8f00; margin-bottom: 3px; }
      .tp-title { font-weight: 600; color: #fff3e0; }

      /* -----------------------------------------------------------------------
       * BATTERY — blinking border + drain bar, warning
       * --------------------------------------------------------------------- */
      .at-battery {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0800, #1a1200);
        border: 2px solid #ff6f00; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: btBlink 1.2s ease-in-out infinite;
      }
      @keyframes btBlink {
        0%,49% { border-color: #ff6f00; box-shadow: 0 0 22px rgba(255,111,0,0.4); }
        50%,100%{ border-color: rgba(255,111,0,0.25); box-shadow: none; }
      }
      .bt-drain {
        position: absolute; bottom: 4px; left: 18px; right: 18px;
        height: 3px; background: rgba(255,111,0,0.18); border-radius: 2px; overflow: hidden;
      }
      .bt-drain::after {
        content: ""; position: absolute; left: 0; top: 0; height: 100%;
        width: 18%; background: linear-gradient(90deg, #ff6f00, #ffca28);
        box-shadow: 0 0 6px #ff6f00;
        animation: btDrain 3s ease-in-out infinite;
      }
      @keyframes btDrain { 0%,100% { width: 18%; } 50% { width: 7%; } }
      .bt-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(255,111,0,0.8));
        animation: btBlink 1.2s ease-in-out infinite;
      }
      .bt-content { flex: 1; min-width: 0; position: relative; }
      .bt-right   { flex-shrink: 0; position: relative; }
      .bt-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff8f00; margin-bottom: 3px; }
      .bt-title { font-weight: 600; color: #fff8e1; }

      /* -----------------------------------------------------------------------
       * DOOR — swinging door icon + light ray, warning
       * --------------------------------------------------------------------- */
      .at-door {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0b00, #1c1700);
        border: 2px solid #ffd600; border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(255,214,0,0.1);
      }
      .dr-ray {
        position: absolute; left: 52px; top: 0; bottom: 0; width: 35px;
        background: linear-gradient(90deg, rgba(255,214,0,0.15) 0%, transparent 100%);
        animation: drRay 2.5s ease-in-out infinite; pointer-events: none;
      }
      @keyframes drRay { 0%,100% { opacity: 0.5; width: 20px; } 50% { opacity: 1; width: 45px; } }
      .dr-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 12px rgba(255,214,0,0.8));
        animation: drSwing 3s ease-in-out infinite;
        transform-origin: left center;
      }
      @keyframes drSwing {
        0%,100% { transform: rotate(0deg); }
        40%,60%  { transform: rotate(-18deg); }
      }
      .dr-content { flex: 1; min-width: 0; position: relative; }
      .dr-right   { flex-shrink: 0; position: relative; }
      .dr-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffd600; margin-bottom: 3px; }
      .dr-title { font-weight: 600; color: #fffde7; }

      /* -----------------------------------------------------------------------
       * PRESENCE — expanding cyan ping rings, info
       * --------------------------------------------------------------------- */
      .at-presence {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #00071a, #000e28);
        border: 1px solid rgba(0,188,212,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,188,212,0.08);
      }
      .pr-ping {
        position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
        width: 62px; height: 62px; pointer-events: none;
      }
      .pr-ring {
        position: absolute; top: 50%; left: 50%;
        border-radius: 50%; border: 1px solid rgba(0,188,212,0.7);
        transform: translate(-50%,-50%);
        animation: prExpand 2.2s ease-out infinite;
      }
      .pr-ring:nth-child(2) { animation-delay: 0.75s; }
      .pr-ring:nth-child(3) { animation-delay: 1.5s; }
      @keyframes prExpand {
        0%   { width: 8px; height: 8px; opacity: 1; }
        100% { width: 60px; height: 60px; opacity: 0; }
      }
      .pr-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(0,188,212,0.7));
        animation: prBlink 2.5s ease-in-out infinite;
      }
      @keyframes prBlink { 0%,78%,100% { opacity: 1; } 82%,94% { opacity: 0.35; } }
      .pr-content { flex: 1; min-width: 0; position: relative; }
      .pr-right   { flex-shrink: 0; position: relative; }
      .pr-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00bcd4; margin-bottom: 3px; }
      .pr-title { font-weight: 600; color: #e0f7fa; }

      /* -----------------------------------------------------------------------
       * UPDATE — spinning double progress ring, info
       * --------------------------------------------------------------------- */
      .at-update {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000d1a, #001226);
        border: 1px solid rgba(0,229,255,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,229,255,0.06);
      }
      .up-ring {
        position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
        width: 54px; height: 54px; border-radius: 50%;
        border: 3px solid rgba(0,229,255,0.15);
        border-top-color: #00e5ff;
        animation: upSpinOuter 1.3s linear infinite;
        pointer-events: none;
      }
      .up-ring::after {
        content: ""; position: absolute; inset: 5px; border-radius: 50%;
        border: 2px solid rgba(0,229,255,0.1);
        border-top-color: rgba(0,229,255,0.5);
        animation: upSpinInner 2.2s linear infinite reverse;
      }
      @keyframes upSpinOuter { to { transform: translateY(-50%) rotate(360deg); } }
      @keyframes upSpinInner { to { transform: rotate(360deg); } }
      .up-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(0,229,255,0.7));
        animation: upIconSpin 3s linear infinite;
      }
      @keyframes upIconSpin { to { transform: rotate(360deg); } }
      .up-content { flex: 1; min-width: 0; position: relative; }
      .up-right   { flex-shrink: 0; position: relative; }
      .up-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00e5ff; margin-bottom: 3px; }
      .up-title { font-weight: 600; color: #e0f7ff; }

      /* -----------------------------------------------------------------------
       * SHIELD — scan wave + glow pulse, ok
       * --------------------------------------------------------------------- */
      .at-shield {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000d00, #001a00);
        border: 2px solid #00c853; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: shGlow 2.5s ease-in-out infinite;
      }
      @keyframes shGlow {
        0%,100% { box-shadow: 0 0 20px rgba(0,200,83,0.3); }
        50%      { box-shadow: 0 0 48px rgba(0,200,83,0.65); }
      }
      .sh-scan {
        position: absolute; top: -100%; left: 0; right: 0; height: 100%;
        background: linear-gradient(180deg, transparent 0%, rgba(0,200,83,0.12) 50%, transparent 100%);
        animation: shScanMove 3s linear infinite; pointer-events: none;
      }
      @keyframes shScanMove { to { top: 200%; } }
      .sh-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 12px #00c853);
        animation: shPulse 2.5s ease-in-out infinite;
      }
      @keyframes shPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      .sh-content { flex: 1; min-width: 0; position: relative; }
      .sh-right   { flex-shrink: 0; position: relative; }
      .sh-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00c853; margin-bottom: 3px; }
      .sh-title { font-weight: 600; color: #e8f5e9; }

      /* -----------------------------------------------------------------------
       * POWER — energy surge + zap icon, ok
       * --------------------------------------------------------------------- */
      .at-power {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000a00, #001600);
        border: 2px solid #76ff03; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: pwSurge 1.6s ease-in-out infinite;
      }
      @keyframes pwSurge {
        0%,100% { box-shadow: 0 0 18px rgba(118,255,3,0.35); border-color: #76ff03; }
        50%      { box-shadow: 0 0 45px rgba(118,255,3,0.75); border-color: #b2ff59; }
      }
      .pw-lines {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(
          90deg, transparent 0, transparent 38px,
          rgba(118,255,3,0.05) 38px, rgba(118,255,3,0.05) 40px);
        animation: pwFlow 1.5s linear infinite;
      }
      @keyframes pwFlow { to { transform: translateX(40px); } }
      .pw-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 14px #76ff03);
        animation: pwZap 0.9s ease-in-out infinite;
      }
      @keyframes pwZap {
        0%,100% { transform: scale(1) rotate(0deg); }
        50%      { transform: scale(1.18) rotate(6deg); }
      }
      .pw-content { flex: 1; min-width: 0; position: relative; }
      .pw-right   { flex-shrink: 0; position: relative; }
      .pw-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #76ff03; margin-bottom: 3px; }
      .pw-title { font-weight: 600; color: #f1ffe0; }

      /* -----------------------------------------------------------------------
       * CYBERPUNK — neon purple/cyan diagonal lines + glitch bar, style
       * --------------------------------------------------------------------- */
      .at-cyberpunk {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0a001a, #130025);
        border: 1px solid #9c27b0; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: cpGlow 2s ease-in-out infinite;
      }
      @keyframes cpGlow {
        0%,100% { box-shadow: 0 0 22px rgba(156,39,176,0.45), inset 0 0 20px rgba(0,229,255,0.04); border-color: #9c27b0; }
        50%      { box-shadow: 0 0 42px rgba(0,229,255,0.45), inset 0 0 30px rgba(156,39,176,0.08); border-color: #00e5ff; }
      }
      .cp-lines {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(
          -45deg, transparent 0, transparent 10px,
          rgba(156,39,176,0.07) 10px, rgba(156,39,176,0.07) 11px);
      }
      .cp-glitch {
        position: absolute; left: 0; right: 0;
        height: 2px; background: #00e5ff;
        animation: cpGlitch 5s steps(1) infinite; opacity: 0; pointer-events: none;
      }
      @keyframes cpGlitch {
        0%,88%,100% { opacity: 0; top: 10%; }
        89%  { opacity: 1; top: 28%; height: 1px; }
        91%  { top: 62%; height: 3px; }
        93%  { top: 18%; height: 1px; }
        95%  { opacity: 0; }
      }
      .cp-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: cpIcon 2s ease-in-out infinite;
      }
      @keyframes cpIcon {
        0%,100% { filter: drop-shadow(0 0 10px #9c27b0) drop-shadow(2px 0 #00e5ff); }
        50%      { filter: drop-shadow(0 0 18px #00e5ff) drop-shadow(-2px 0 #e040fb); }
      }
      .cp-content { flex: 1; min-width: 0; position: relative; }
      .cp-right   { flex-shrink: 0; position: relative; }
      .cp-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #e040fb; margin-bottom: 3px; text-shadow: 0 0 6px #e040fb; }
      .cp-title { font-weight: 600; color: #ede0ff; }

      /* -----------------------------------------------------------------------
       * VAPOR — vaporwave perspective grid + pastel float, style
       * --------------------------------------------------------------------- */
      .at-vapor {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(160deg, #0a0015 0%, #1a0030 50%, #0d0025 100%);
        border: 1px solid rgba(255,0,255,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
      }
      .vp-grid {
        position: absolute; bottom: 0; left: 0; right: 0; height: 26px;
        background:
          linear-gradient(0deg, rgba(255,0,255,0.18) 1px, transparent 1px) 0 0 / 100% 8px,
          linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px) 0 0 / 22px 100%;
        pointer-events: none;
      }
      .vp-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,0,255,0.06), rgba(0,255,255,0.06));
        animation: vpPulse 3s ease-in-out infinite; pointer-events: none;
      }
      @keyframes vpPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      .vp-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 12px rgba(255,0,255,0.8)) drop-shadow(0 0 20px rgba(0,255,255,0.4));
        animation: vpFloat 3s ease-in-out infinite;
      }
      @keyframes vpFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .vp-content { flex: 1; min-width: 0; position: relative; }
      .vp-right   { flex-shrink: 0; position: relative; }
      .vp-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff80ff; margin-bottom: 3px; text-shadow: 0 0 6px rgba(255,0,255,0.6); }
      .vp-title { font-weight: 600; color: #f0e0ff; }

      /* -----------------------------------------------------------------------
       * LAVA — floating orange blobs on black, style
       * --------------------------------------------------------------------- */
      .at-lava {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: radial-gradient(ellipse at center, #120500, #050000);
        border: 1px solid rgba(255,87,34,0.5); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 22px rgba(255,87,34,0.1);
      }
      .lv-blob {
        position: absolute; border-radius: 50%;
        background: radial-gradient(circle, rgba(255,87,34,0.38) 0%, transparent 70%);
        animation: lvFloat 5s ease-in-out infinite; pointer-events: none;
      }
      .lv-b1 { width: 65px; height: 65px; bottom: -25px; left: 10%;  animation-delay: 0s; }
      .lv-b2 { width: 48px; height: 48px; bottom: -18px; left: 52%;  animation-delay: 1.8s; }
      .lv-b3 { width: 38px; height: 38px; bottom: -12px; left: 76%;  animation-delay: 3.5s; }
      @keyframes lvFloat {
        0%,100% { transform: translateY(0) scale(1);   opacity: 0.5; }
        50%      { transform: translateY(-28px) scale(1.15); opacity: 0.85; }
      }
      .lv-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: lvGlow 3s ease-in-out infinite;
      }
      @keyframes lvGlow {
        0%,100% { filter: drop-shadow(0 0 12px rgba(255,87,34,0.8)); }
        50%      { filter: drop-shadow(0 0 28px rgba(255,140,0,1)); }
      }
      .lv-content { flex: 1; min-width: 0; position: relative; }
      .lv-right   { flex-shrink: 0; position: relative; }
      .lv-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ff6d00; margin-bottom: 3px; }
      .lv-title { font-weight: 600; color: #fff3e0; }

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

      /* -----------------------------------------------------------------------
       * SNOOZED PILL — shown bottom-left when some alerts are snoozed but
       * others are still active (so the full snoozed bar is not shown)
       * --------------------------------------------------------------------- */
      .atc-snoozed-pill {
        position: absolute;
        bottom: 6px;
        right: 8px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 200, 80, 0.35);
        border-radius: 20px;
        color: rgba(255, 200, 80, 0.80);
        cursor: pointer;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        opacity: 0;
        padding: 2px 8px;
        pointer-events: none;
        transition: opacity 0.15s, background 0.15s;
      }
      .atc-snooze-host:hover .atc-snoozed-pill {
        opacity: 1;
        pointer-events: auto;
      }
      .atc-snoozed-pill:hover {
        background: rgba(255, 200, 80, 0.20);
        border-color: rgba(255, 200, 80, 0.70);
        color: #ffd060;
      }

      /* -----------------------------------------------------------------------
       * HISTORY BUTTON
       * --------------------------------------------------------------------- */
      .atc-history-btn {
        position: absolute;
        top: 6px;
        right: 34px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: transparent;
        font-size: 0.85rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 10;
      }
      .atc-snooze-host:hover .atc-history-btn {
        opacity: 1;
        pointer-events: auto;
      }

      /* -----------------------------------------------------------------------
       * LARGE BUTTONS MODE (large_buttons: true)
       * Both buttons stacked vertically at bottom-right, always visible.
       * --------------------------------------------------------------------- */
      .atc-large-buttons .atc-snooze-wrap {
        pointer-events: auto;
        top: auto;
        bottom: 8px;
        right: 8px;
      }
      .atc-large-buttons .atc-snooze-btn {
        opacity: 1 !important;
        width: auto;
        height: 26px;
        border-radius: 13px;
        padding: 0 10px;
        font-size: 0.78rem;
        background: rgba(0,0,0,0.50);
        border: 1px solid rgba(255,255,255,0.15);
      }
      .atc-large-buttons .atc-snooze-btn::after {
        content: attr(title);
        font-size: 0.72rem;
        margin-left: 3px;
        letter-spacing: 0.02em;
      }
      .atc-large-buttons .atc-history-btn {
        opacity: 1 !important;
        pointer-events: auto;
        width: auto;
        height: 26px;
        border-radius: 13px;
        padding: 0 10px;
        font-size: 0.78rem;
        background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.10);
        top: auto;
        bottom: 42px;
        right: 8px;
        left: auto;
      }
      .atc-large-buttons .atc-history-btn::after {
        content: attr(title);
        font-size: 0.72rem;
        margin-left: 3px;
        letter-spacing: 0.02em;
      }

      /* -----------------------------------------------------------------------
       * TEST MODE BANNER
       * --------------------------------------------------------------------- */
      .atc-card-root {
        display: flex;
        flex-direction: column;
      }
      .atc-test-mode-banner {
        background: rgba(255, 165, 0, 0.92);
        color: #000;
        font-size: 0.68rem;
        font-weight: 700;
        text-align: center;
        padding: 3px 8px;
        letter-spacing: 0.04em;
        pointer-events: none;
        border-radius: 0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px);
        margin-top: -2px;
      }

      /* -----------------------------------------------------------------------
       * HISTORY CARD
       * --------------------------------------------------------------------- */
      .atc-history-card {
        background: var(--card-background-color, #1c1c1e);
        padding: 0;
        overflow: hidden;
      }
      .atc-history-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 8px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .atc-history-title {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        opacity: 0.6;
        color: var(--primary-text-color, #fff);
      }
      .atc-history-actions {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .atc-history-clear {
        font-size: 0.70rem;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.5);
        border-radius: 10px;
        padding: 2px 8px;
        cursor: pointer;
      }
      .atc-history-clear:hover { color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.4); }
      .atc-history-close {
        font-size: 0.80rem;
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.5);
        cursor: pointer;
        padding: 2px 4px;
      }
      .atc-history-close:hover { color: rgba(255,255,255,0.9); }
      .atc-history-list {
        max-height: 220px;
        overflow-y: auto;
        padding: 4px 0;
      }
      .atc-history-entry {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 7px 14px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .atc-history-entry:last-child { border-bottom: none; }
      .atc-history-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
      .atc-history-body { flex: 1; min-width: 0; }
      .atc-history-msg {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--primary-text-color, #fff);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .atc-history-ts {
        font-size: 0.68rem;
        opacity: 0.45;
        margin-top: 2px;
      }
      .atc-history-empty {
        padding: 16px 14px;
        font-size: 0.80rem;
        opacity: 0.4;
        text-align: center;
        color: var(--primary-text-color, #fff);
      }

      /* -----------------------------------------------------------------------
       * TIMER THEMES
       * --------------------------------------------------------------------- */

      /* --- COUNTDOWN --- */
      .at-countdown {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 14px 18px;
        gap: 12px;
        background: var(--card-background-color, #1e1e2e);
        overflow: hidden;
      }
      .cd-urgent { animation: cd-pulse 0.8s ease-in-out infinite alternate; }
      @keyframes cd-pulse { from { box-shadow: 0 0 0 0 #e5393533; } to { box-shadow: 0 0 0 6px #e5393566; } }
      .cd-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; }
      .cd-content { flex: 1; min-width: 0; }
      .cd-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: 0.55; }
      .cd-title { font-size: 0.95rem; font-weight: 600; }
      .cd-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; gap: 4px; }
      .cd-time { font-size: 1.3rem; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
      .cd-bar-track { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(128,128,128,0.15); }
      .cd-bar-fill { height: 100%; border-radius: 0 2px 2px 0; transition: width 1s linear, background 1s; }

      /* --- HOURGLASS --- */
      .at-hourglass {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 14px;
        gap: 12px;
        background: var(--card-background-color, #1e1e2e);
        overflow: hidden;
      }
      .hg2-fill {
        position: absolute; bottom: 0; left: 0; right: 0;
        transition: height 1s linear, background 1s;
        pointer-events: none;
      }
      .hg2-urgent .hg2-fill { animation: hg2-flicker 0.6s ease-in-out infinite alternate; }
      @keyframes hg2-flicker { from { opacity: 0.7; } to { opacity: 1; } }
      .hg2-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; position: relative; }
      .hg2-content { flex: 1; min-width: 0; position: relative; }
      .hg2-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: 0.55; }
      .hg2-title { font-size: 0.95rem; font-weight: 600; }
      .hg2-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; gap: 4px; position: relative; }
      .hg2-time { font-size: 1.3rem; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

      /* --- TIMER PULSE --- */
      .at-timer-pulse {
        display: flex;
        align-items: center;
        padding: 10px 14px;
        gap: 12px;
        background: var(--card-background-color, #1e1e2e);
        border-left: 4px solid var(--tp-color, #43a047);
        animation: tp-beat var(--tp-speed, 2s) ease-in-out infinite;
      }
      @keyframes tp-beat {
        0%,100% { box-shadow: 0 0 0 0 transparent; }
        50% { box-shadow: 0 0 8px 2px var(--tp-color, #43a047); }
      }
      .tp-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; }
      .tp-content { flex: 1; min-width: 0; }
      .tp-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: 0.55; }
      .tp-title { font-size: 0.95rem; font-weight: 600; }
      .tp-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; gap: 4px; }
      .tp-time { font-size: 1.3rem; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--tp-color, #43a047); }

      /* --- TIMER RING --- */
      .at-timer-ring {
        display: flex;
        align-items: center;
        padding: 10px 14px;
        gap: 12px;
        background: var(--card-background-color, #1e1e2e);
      }
      .tr2-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; }
      .tr2-content { flex: 1; min-width: 0; }
      .tr2-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: 0.55; }
      .tr2-title { font-size: 0.95rem; font-weight: 600; }
      .tr2-ring-wrap { position: relative; width: 56px; height: 56px; flex-shrink: 0; }
      .tr2-svg { width: 56px; height: 56px; }
      .tr2-bg { fill: none; stroke: rgba(128,128,128,0.15); stroke-width: 4; }
      .tr2-progress { fill: none; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 1s linear, stroke 1s; }
      .tr2-time {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.65rem; font-weight: 800; font-variant-numeric: tabular-nums;
      }

      /* -----------------------------------------------------------------------
       * CLICKABLE CARD — entire card acts as action trigger
       * --------------------------------------------------------------------- */
      .atc-clickable {
        cursor: pointer;
      }
      .atc-clickable:active ha-card {
        opacity: 0.85;
        transition: opacity 0.1s;
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
    description: "Display alerts based on entity states with 36 visual themes, 12 animations, snooze, numeric conditions, attribute triggers, AND/OR conditions, action buttons, and a full visual editor.",
    preview: false,
  });
}
