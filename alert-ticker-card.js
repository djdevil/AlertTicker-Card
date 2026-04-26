/**
 * AlertTicker Card v1.2.8.1
 * A Home Assistant custom Lovelace card to display alerts based on entity states.
 * Supports 42 visual themes with per-alert theme assignment, priority ordering,
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
  customElements.get("ha-panel-lovelace") ||
  customElements.get("hui-view") ||
  customElements.get("ha-card")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// ---------------------------------------------------------------------------
// Card version — declared early so getConfigElement() can reference it
// ---------------------------------------------------------------------------
const CARD_VERSION = "1.2.8.1";

// ---------------------------------------------------------------------------
// Theme metadata — drives default icons and category labels
// ---------------------------------------------------------------------------
const THEME_META = {
  // --- Critical ---
  emergency:    { icon: "🚨", category: "critical", color: "#ff5252", bg: "linear-gradient(135deg,#1a0000,#3d0000)" },
  fire:         { icon: "🔥", category: "critical", color: "#ff6d00", bg: "linear-gradient(135deg,#1a0800,#3d1500)" },
  alarm:        { icon: "🔴", category: "critical", color: "#ff1744", bg: "linear-gradient(135deg,#0d0000,#1a0000)" },
  lightning:    { icon: "🌩️", category: "critical", color: "#d500f9", bg: "linear-gradient(135deg,#0d001a,#1a0033)" },
  nuclear:      { icon: "☢️", category: "critical", color: "#ffd54f", bg: "linear-gradient(135deg,#1a1000,#2e1c00)" },
  flood:        { icon: "🌊", category: "critical", color: "#40c4ff", bg: "linear-gradient(135deg,#000d1a,#00264d)" },
  motion:       { icon: "👁️", category: "critical", color: "#00e676", bg: "linear-gradient(135deg,#001a00,#003300)" },
  intruder:     { icon: "🚷", category: "critical", color: "#ff1744", bg: "linear-gradient(135deg,#0d0000,#1a0000)" },
  toxic:        { icon: "☠️", category: "critical", color: "#76ff03", bg: "linear-gradient(135deg,#0a0f00,#141f00)" },
  // --- Warning ---
  warning:      { icon: "⚠️", category: "warning",  color: "#ffab40", bg: "linear-gradient(135deg,#e65100,#ef6c00)" },
  caution:      { icon: "🟡", category: "warning",  color: "#ffc107", bg: "linear-gradient(135deg,#1a1400,#3d3200)" },
  radar:        { icon: "🎯", category: "warning",  color: "#64ffda", bg: "linear-gradient(135deg,#001a00,#002e1a)" },
  temperature:  { icon: "🌡️", category: "warning",  color: "#ff6d00", bg: "linear-gradient(135deg,#1a0800,#3d1500)" },
  battery:      { icon: "🔋", category: "warning",  color: "#ffca28", bg: "linear-gradient(135deg,#1a1400,#2e2200)" },
  door:         { icon: "🚪", mdiIcon: "mdi:door-open",            animClass: "atc-icon-swing",   wrapClass: "atc-icon-wrap-h", category: "warning",  color: "#ffab40", bg: "linear-gradient(135deg,#1a1000,#2e1c00)" },
  window:       { icon: "🪟", mdiIcon: "mdi:window-open-variant", animClass: "atc-icon-swing-v", wrapClass: "atc-icon-wrap-v", category: "warning",  color: "#80d8ff", bg: "linear-gradient(135deg,#001a2e,#00294d)" },
  smoke:        { icon: "🌫️", category: "warning",  color: "#b0bec5", bg: "linear-gradient(135deg,#1a1a1a,#2e2e2e)" },
  wind:         { icon: "💨", category: "warning",  color: "#80d8ff", bg: "linear-gradient(135deg,#001433,#002e66)" },
  leak:         { icon: "💧", category: "warning",  color: "#40c4ff", bg: "linear-gradient(135deg,#001433,#002e66)" },
  // --- Info ---
  info:         { icon: "ℹ️", category: "info",     color: "#40c4ff", bg: "linear-gradient(135deg,#0d47a1,#1565c0)" },
  notification: { icon: "🔔", category: "info",     color: "#40c4ff", bg: "linear-gradient(135deg,#001a33,#002e5c)" },
  aurora:       { icon: "🌌", category: "info",     color: "#ea80fc", bg: "linear-gradient(135deg,#0d0019,#1a0033)" },
  hologram:     { icon: "🔷", category: "info",     color: "#18ffff", bg: "linear-gradient(135deg,#001a1a,#003333)" },
  presence:     { icon: "🏠", category: "info",     color: "#40c4ff", bg: "linear-gradient(135deg,#001a33,#002e5c)" },
  update:       { icon: "🔄", category: "info",     color: "#40c4ff", bg: "linear-gradient(135deg,#001433,#002e66)" },
  cloud:        { icon: "☁️", category: "info",     color: "#82b1ff", bg: "linear-gradient(135deg,#001433,#002e66)" },
  satellite:    { icon: "📡", category: "info",     color: "#40c4ff", bg: "linear-gradient(135deg,#001433,#002e66)" },
  tips:         { icon: "💡", category: "info",     color: "#ffeb3b", bg: "linear-gradient(135deg,#1a1400,#2e2600)" },
  light:        { icon: "🔆", category: "info",     color: "#ffd600", bg: "linear-gradient(135deg,#0d0b00,#1a1500)" },
  // --- OK / Success ---
  success:      { icon: "✅", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#1b5e20,#2e7d32)" },
  check:        { icon: "🟢", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#001a00,#003300)" },
  confetti:     { icon: "🎉", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#1b5e20,#2e7d32)" },
  heartbeat:    { icon: "💓", category: "ok",       color: "#ff4081", bg: "linear-gradient(135deg,#1a0019,#330033)" },
  shield:       { icon: "🛡️", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#001a00,#003300)" },
  power:        { icon: "⚡", category: "ok",       color: "#ffab40", bg: "linear-gradient(135deg,#1a0f00,#2e1c00)" },
  sunrise:      { icon: "🌅", category: "ok",       color: "#ffd54f", bg: "linear-gradient(135deg,#1a0f00,#2e2200)" },
  plant:        { icon: "🌱", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#001400,#002900)" },
  lock:         { icon: "🔒", category: "ok",       color: "#69f0ae", bg: "linear-gradient(135deg,#001a00,#003300)" },
  // --- Style ---
  ticker:       { icon: "📰", category: "style",    color: "#ea80fc", bg: "linear-gradient(135deg,#0d0019,#1a0033)" },
  neon:         { icon: "⚡", category: "style",    color: "#ea80fc", bg: "linear-gradient(135deg,#0d0019,#1a0033)" },
  glass:        { icon: "🔮", category: "style",    color: "#40c4ff", bg: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))" },
  matrix:       { icon: "💻", category: "style",    color: "#00ff41", bg: "linear-gradient(135deg,#0a0f0a,#0d1a0d)" },
  minimal:      { icon: "📋", category: "style",    color: "#cfd8dc", bg: "linear-gradient(135deg,#1a1a1a,#2a2a2a)" },
  retro:        { icon: "📺", category: "style",    color: "#ff6d00", bg: "linear-gradient(135deg,#1a0800,#2e1400)" },
  cyberpunk:    { icon: "🤖", category: "style",    color: "#ff00ff", bg: "linear-gradient(135deg,#0d0019,#00001a)" },
  vapor:        { icon: "🌸", category: "style",    color: "#ff80ab", bg: "linear-gradient(135deg,#1a001a,#330033)" },
  lava:         { icon: "🌋", category: "style",    color: "#ff6d00", bg: "linear-gradient(135deg,#1a0000,#3d0000)" },
  // --- Timer ---
  countdown:    { icon: "⏱️", category: "timer",    color: "#18ffff", bg: "linear-gradient(135deg,#003333,#005555)" },
  hourglass:    { icon: "⏳", category: "timer",    color: "#18ffff", bg: "linear-gradient(135deg,#003333,#005555)" },
  timer_pulse:  { icon: "💥", category: "timer",    color: "#ff4444", bg: "linear-gradient(135deg,#1a0000,#2e0000)" },
  timer_ring:   { icon: "🔵", category: "timer",    color: "#18ffff", bg: "linear-gradient(135deg,#001a1a,#003333)" },
  // --- Music ---
  music:        { icon: "🎵", category: "info",     color: "#e040fb", bg: "linear-gradient(135deg,#1a001a,#2e0033)" },
};

// ---------------------------------------------------------------------------
// TTS fallback message prefixes by language and theme category
// ---------------------------------------------------------------------------
const TTS_PREFIXES = {
  it: {
    critical: (name) => `Allarme critico: ${name}`,
    warning:  (name) => `Attenzione: ${name}`,
    info:     (name) => `Notifica: ${name}`,
    ok:       (name) => `${name}: tornato alla normalità`,
    timer:    (name) => `Timer: ${name}`,
    _default: (name) => `Avviso: ${name}`,
  },
  en: {
    critical: (name) => `Critical alert: ${name}`,
    warning:  (name) => `Warning: ${name}`,
    info:     (name) => `Notification: ${name}`,
    ok:       (name) => `${name}: back to normal`,
    timer:    (name) => `Timer: ${name}`,
    _default: (name) => `Alert: ${name}`,
  },
  fr: {
    critical: (name) => `Alerte critique: ${name}`,
    warning:  (name) => `Attention: ${name}`,
    info:     (name) => `Notification: ${name}`,
    ok:       (name) => `${name}: retour à la normale`,
    timer:    (name) => `Minuterie: ${name}`,
    _default: (name) => `Alerte: ${name}`,
  },
  de: {
    critical: (name) => `Kritischer Alarm: ${name}`,
    warning:  (name) => `Achtung: ${name}`,
    info:     (name) => `Hinweis: ${name}`,
    ok:       (name) => `${name}: wieder normal`,
    timer:    (name) => `Timer: ${name}`,
    _default: (name) => `Warnung: ${name}`,
  },
  nl: {
    critical: (name) => `Kritieke melding: ${name}`,
    warning:  (name) => `Let op: ${name}`,
    info:     (name) => `Melding: ${name}`,
    ok:       (name) => `${name}: weer normaal`,
    timer:    (name) => `Timer: ${name}`,
    _default: (name) => `Waarschuwing: ${name}`,
  },
  vi: {
    critical: (name) => `Cảnh báo nghiêm trọng: ${name}`,
    warning:  (name) => `Chú ý: ${name}`,
    info:     (name) => `Thông báo: ${name}`,
    ok:       (name) => `${name}: đã trở lại bình thường`,
    timer:    (name) => `Hẹn giờ: ${name}`,
    _default: (name) => `Cảnh báo: ${name}`,
  },
  ru: {
    critical: (name) => `Критическая тревога: ${name}`,
    warning:  (name) => `Внимание: ${name}`,
    info:     (name) => `Уведомление: ${name}`,
    ok:       (name) => `${name}: вернулось в норму`,
    timer:    (name) => `Таймер: ${name}`,
    _default: (name) => `Оповещение: ${name}`,
  },
  no: {
    critical: (name) => `Kritisk alarm: ${name}`,
    warning:  (name) => `Advarsel: ${name}`,
    info:     (name) => `Varsling: ${name}`,
    ok:       (name) => `${name}: tilbake til normalt`,
    timer:    (name) => `Timer: ${name}`,
    _default: (name) => `Advarsel: ${name}`,
  },
  cs: {
    critical: (name) => `Kritické varování: ${name}`,
    warning:  (name) => `Pozor: ${name}`,
    info:     (name) => `Oznámení: ${name}`,
    ok:       (name) => `${name}: zpět na normální stav`,
    timer:    (name) => `Časovač: ${name}`,
    _default: (name) => `Varování: ${name}`,
  },
  pt: {
    critical: (name) => `Alerta crítico: ${name}`,
    warning:  (name) => `Aviso: ${name}`,
    info:     (name) => `Notificação: ${name}`,
    ok:       (name) => `${name}: voltou ao normal`,
    timer:    (name) => `Temporizador: ${name}`,
    _default: (name) => `Alerta: ${name}`,
  },
  es: {
    critical: (name) => `Alerta crítica: ${name}`,
    warning:  (name) => `Atención: ${name}`,
    info:     (name) => `Notificación: ${name}`,
    ok:       (name) => `${name}: vuelto a la normalidad`,
    timer:    (name) => `Temporizador: ${name}`,
    _default: (name) => `Alerta: ${name}`,
  },
};

// ---------------------------------------------------------------------------
// Translations (IT / EN / FR / DE / NL / VI / RU)
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
    dismiss: "Rimuovi",
    alerts_snoozed: "avvisi sospesi",
    history: "Cronologia",
    history_clear: "Svuota",
    history_empty: "Nessun evento registrato",
    timer_active: "In corso",
    timer_done: "Scaduto",
    test_mode_active: "MODALITÀ TEST ATTIVA — disattivala prima di salvare",
    "weather.sunny": "Soleggiato", "weather.clear-night": "Sereno di notte", "weather.partlycloudy": "Parzialmente nuvoloso",
    "weather.cloudy": "Nuvoloso", "weather.fog": "Nebbia", "weather.windy": "Ventoso", "weather.windy-variant": "Molto ventoso",
    "weather.rainy": "Pioggia", "weather.snowy-rainy": "Pioggia mista a neve", "weather.pouring": "Pioggia intensa",
    "weather.snowy": "Neve", "weather.hail": "Grandine", "weather.lightning": "Temporale", "weather.lightning-rainy": "Temporale con pioggia",
    "weather.exceptional": "Eccezionale",
    clear_weather_entity_label: "Seleziona entità meteo",
    today: "Oggi",
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
    dismiss: "Dismiss",
    alerts_snoozed: "alerts snoozed",
    history: "History",
    history_clear: "Clear",
    history_empty: "No events recorded yet",
    timer_active: "Running",
    timer_done: "Expired",
    test_mode_active: "TEST MODE ACTIVE — disable it before saving",
    "weather.sunny": "Sunny", "weather.clear-night": "Clear Night", "weather.partlycloudy": "Partly Cloudy",
    "weather.cloudy": "Cloudy", "weather.fog": "Foggy", "weather.windy": "Windy", "weather.windy-variant": "Very Windy",
    "weather.rainy": "Rainy", "weather.snowy-rainy": "Sleet", "weather.pouring": "Pouring",
    "weather.snowy": "Snowy", "weather.hail": "Hail", "weather.lightning": "Lightning", "weather.lightning-rainy": "Thunderstorm",
    "weather.exceptional": "Exceptional",
    clear_weather_entity_label: "Select weather entity",
    today: "Today",
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
    dismiss: "Effacer",
    alerts_snoozed: "alertes suspendues",
    history: "Historique",
    history_clear: "Effacer",
    history_empty: "Aucun événement enregistré",
    timer_active: "En cours",
    timer_done: "Expiré",
    test_mode_active: "MODE TEST ACTIF — désactivez-le avant de sauvegarder",
    "weather.sunny": "Ensoleillé", "weather.clear-night": "Ciel dégagé (nuit)", "weather.partlycloudy": "Partiellement nuageux",
    "weather.cloudy": "Nuageux", "weather.fog": "Brouillard", "weather.windy": "Venteux", "weather.windy-variant": "Très venteux",
    "weather.rainy": "Pluvieux", "weather.snowy-rainy": "Neige fondue", "weather.pouring": "Averse intense",
    "weather.snowy": "Neigeux", "weather.hail": "Grêle", "weather.lightning": "Orage", "weather.lightning-rainy": "Orage pluvieux",
    "weather.exceptional": "Exceptionnel",
    clear_weather_entity_label: "Sélectionner une entité météo",
    today: "Aujourd'hui",
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
    dismiss: "Verwerfen",
    alerts_snoozed: "Warnungen pausiert",
    history: "Verlauf",
    history_clear: "Leeren",
    history_empty: "Noch keine Ereignisse aufgezeichnet",
    timer_active: "Läuft",
    timer_done: "Abgelaufen",
    test_mode_active: "TESTMODUS AKTIV — vor dem Speichern deaktivieren",
    "weather.sunny": "Sonnig", "weather.clear-night": "Klare Nacht", "weather.partlycloudy": "Teils bewölkt",
    "weather.cloudy": "Bewölkt", "weather.fog": "Neblig", "weather.windy": "Windig", "weather.windy-variant": "Sehr windig",
    "weather.rainy": "Regnerisch", "weather.snowy-rainy": "Schneeregen", "weather.pouring": "Starkregen",
    "weather.snowy": "Schnee", "weather.hail": "Hagel", "weather.lightning": "Gewitter", "weather.lightning-rainy": "Gewitterregen",
    "weather.exceptional": "Außergewöhnlich",
    clear_weather_entity_label: "Wetterentität auswählen",
    today: "Heute",
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
    dismiss: "Verwijderen",
    alerts_snoozed: "meldingen gesluimerd",
    history: "Geschiedenis",
    history_clear: "Wissen",
    history_empty: "Nog geen gebeurtenissen opgeslagen",
    timer_active: "Actief",
    timer_done: "Verlopen",
    test_mode_active: "TESTMODUS ACTIEF — schakel uit voor het opslaan",
    "weather.sunny": "Zonnig", "weather.clear-night": "Heldere nacht", "weather.partlycloudy": "Gedeeltelijk bewolkt",
    "weather.cloudy": "Bewolkt", "weather.fog": "Mistig", "weather.windy": "Winderig", "weather.windy-variant": "Zeer winderig",
    "weather.rainy": "Regenachtig", "weather.snowy-rainy": "Natte sneeuw", "weather.pouring": "Zware regen",
    "weather.snowy": "Sneeuw", "weather.hail": "Hagel", "weather.lightning": "Onweer", "weather.lightning-rainy": "Onweer met regen",
    "weather.exceptional": "Uitzonderlijk",
    clear_weather_entity_label: "Weerentiteit selecteren",
    today: "Vandaag",
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
    dismiss: "Xóa bỏ",
    alerts_snoozed: "báo động đã tạm hoãn",
    history: "Lịch sử",
    history_clear: "Xóa",
    history_empty: "Chưa có sự kiện nào",
    timer_active: "Đang chạy",
    timer_done: "Hết hạn",
    test_mode_active: "CHẾ ĐỘ THỬ ĐANG BẬT — tắt trước khi lưu",
    "weather.sunny": "Nắng", "weather.clear-night": "Đêm quang đãng", "weather.partlycloudy": "Có mây rải rác",
    "weather.cloudy": "Nhiều mây", "weather.fog": "Sương mù", "weather.windy": "Có gió", "weather.windy-variant": "Gió mạnh",
    "weather.rainy": "Mưa", "weather.snowy-rainy": "Mưa tuyết", "weather.pouring": "Mưa to",
    "weather.snowy": "Tuyết", "weather.hail": "Mưa đá", "weather.lightning": "Sét", "weather.lightning-rainy": "Dông",
    "weather.exceptional": "Đặc biệt",
    clear_weather_entity_label: "Chọn thực thể thời tiết",
    today: "Hôm nay",
  },
  ru: {
    alerts: "Оповещения",
    critical: "Критично",
    warning_label: "Внимание",
    info_label: "Информация",
    success_label: "Норма",
    no_alerts: "Нет активных оповещений",
    all_clear: "Всё в порядке",
    priority_short: "П",
    alert_system: "СИСТЕМА ОПОВЕЩЕНИЙ",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alert --читать",
    snooze: "Отложить",
    snoozed: "Отложено",
    snooze_1h: "1 час",
    snooze_4h: "4 часа",
    snooze_8h: "8 часов",
    snooze_24h: "24 часа",
    snooze_reset: "Восстановить все",
    dismiss: "Сбросить",
    alerts_snoozed: "оповещений отложено",
    history: "История",
    history_clear: "Очистить",
    history_empty: "Событий пока нет",
    timer_active: "Идёт",
    timer_done: "Истёк",
    test_mode_active: "РЕЖИМ ТЕСТИРОВАНИЯ — отключите перед сохранением",
    "weather.sunny": "Солнечно", "weather.clear-night": "Ясная ночь", "weather.partlycloudy": "Переменная облачность",
    "weather.cloudy": "Облачно", "weather.fog": "Туман", "weather.windy": "Ветрено", "weather.windy-variant": "Очень ветрено",
    "weather.rainy": "Дождь", "weather.snowy-rainy": "Мокрый снег", "weather.pouring": "Ливень",
    "weather.snowy": "Снег", "weather.hail": "Град", "weather.lightning": "Гроза", "weather.lightning-rainy": "Гроза с дождём",
    "weather.exceptional": "Чрезвычайно",
    clear_weather_entity_label: "Выбрать объект погоды",
    today: "Сегодня",
  },
  da: {
    alerts: "Alarmer",
    critical: "Kritisk",
    warning_label: "Advarsel",
    info_label: "Information",
    success_label: "Løst",
    no_alerts: "Ingen aktive alarmer",
    all_clear: "Alt er i orden",
    priority_short: "P",
    alert_system: "ALARM SYSTEM",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alarm --læs",
    snooze: "Udskyd",
    snoozed: "Udsat",
    snooze_1h: "1 time",
    snooze_4h: "4 timer",
    snooze_8h: "8 timer",
    snooze_24h: "24 timer",
    snooze_reset: "Genoptag alle",
    dismiss: "Afvis",
    alerts_snoozed: "alarmer udsat",
    history: "Historik",
    history_clear: "Ryd",
    history_empty: "Ingen hændelser registreret endnu",
    timer_active: "Kører",
    timer_done: "Udløbet",
    test_mode_active: "TESTTILSTAND AKTIV — deaktiver før gemning",
    "weather.sunny": "Solrig", "weather.clear-night": "Klar nat", "weather.partlycloudy": "Delvist skyet",
    "weather.cloudy": "Skyet", "weather.fog": "Tåge", "weather.windy": "Blæsende", "weather.windy-variant": "Meget blæsende",
    "weather.rainy": "Regnfuld", "weather.snowy-rainy": "Slud", "weather.pouring": "Øsende regn",
    "weather.snowy": "Snefald", "weather.hail": "Hagl", "weather.lightning": "Torden", "weather.lightning-rainy": "Tordenvejr",
    "weather.exceptional": "Usædvanligt",
    clear_weather_entity_label: "Vælg vejrentitet",
    today: "I dag",
  },
  cs: {
    alerts: "Varování",
    critical: "Kritické",
    warning_label: "Upozornění",
    info_label: "Informace",
    success_label: "Vše vyřešeno",
    no_alerts: "Žádné aktivní varování",
    all_clear: "Vše OK",
    priority_short: "P",
    alert_system: "SYSTÉM UPOZORNĚNÍ",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alert --read",
    snooze: "Odložit",
    snoozed: "Odloženo",
    snooze_1h: "1 hodina",
    snooze_4h: "4 hodiny",
    snooze_8h: "8 hodin",
    snooze_24h: "24 hodin",
    snooze_reset: "Obnovit vše",
    dismiss: "Zamítnout",
    alerts_snoozed: "varování odložena",
    history: "Historie",
    history_clear: "Nic",
    history_empty: "Zatím žádné události",
    timer_active: "Běží",
    timer_done: "Skončeno",
    test_mode_active: "TESTOVACÍ MÓD AKTIVNÍ — vypni před uložením",
    "weather.sunny": "Slunečno", "weather.clear-night": "Jasná noc", "weather.partlycloudy": "Částečně zataženo",
    "weather.cloudy": "Zataženo", "weather.fog": "Mlhavo", "weather.windy": "Větrno", "weather.windy-variant": "Velmi větrno",
    "weather.rainy": "Déšť", "weather.snowy-rainy": "Déšť se sněhem", "weather.pouring": "Déšť",
    "weather.snowy": "Sněží", "weather.hail": "Kroupy", "weather.lightning": "Bouřka", "weather.lightning-rainy": "Bouřka",
    "weather.exceptional": "Mimořádné",
    clear_weather_entity_label: "Vyberte entitu s počasím",
    today: "Dnes",
  },
  pt: {
    alerts: "Alertas",
    critical: "Crítico",
    warning_label: "Aviso",
    info_label: "Informação",
    success_label: "Resolvido",
    no_alerts: "Nenhum alerta ativo",
    all_clear: "Tudo limpo",
    priority_short: "P",
    alert_system: "SISTEMA DE ALERTAS",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alert --read",
    snooze: "Silenciar",
    snoozed: "Silenciado",
    snooze_1h: "1 hora",
    snooze_4h: "4 horas",
    snooze_8h: "8 horas",
    snooze_24h: "24 horas",
    snooze_reset: "Retomar todos",
    dismiss: "Descartar",
    alerts_snoozed: "alertas silenciados",
    history: "Histórico",
    history_clear: "Limpar",
    history_empty: "Nenhum evento registrado ainda",
    timer_active: "Em execução",
    timer_done: "Expirado",
    test_mode_active: "MODO TESTE ATIVO — desative antes de salvar",
    "weather.sunny": "Ensolarado", "weather.clear-night": "Noite clara", "weather.partlycloudy": "Parcialmente nublado",
    "weather.cloudy": "Nublado", "weather.fog": "Nebuloso", "weather.windy": "Ventoso", "weather.windy-variant": "Muito ventoso",
    "weather.rainy": "Chuvoso", "weather.snowy-rainy": "Aguaneve", "weather.pouring": "Chuva forte",
    "weather.snowy": "Neve", "weather.hail": "Granizo", "weather.lightning": "Relâmpagos", "weather.lightning-rainy": "Trovoada",
    "weather.exceptional": "Excepcional",
    clear_weather_entity_label: "Selecione a entidade de clima",
    today: "Hoje",
  },
  es: {
    alerts: "Alertas",
    critical: "Crítico",
    warning_label: "Atención",
    info_label: "Información",
    success_label: "Resuelto",
    no_alerts: "Sin alertas activas",
    all_clear: "Todo bien",
    priority_short: "P",
    alert_system: "SISTEMA DE ALERTAS",
    cmd_prefix: "root@ha:~$",
    cmd_read: "alerta --leer",
    snooze: "Posponer",
    snoozed: "Pospuesto",
    snooze_1h: "1 hora",
    snooze_4h: "4 horas",
    snooze_8h: "8 horas",
    snooze_24h: "24 horas",
    snooze_reset: "Reanudar todo",
    dismiss: "Descartar",
    alerts_snoozed: "alertas pospuestas",
    history: "Historial",
    history_clear: "Borrar",
    history_empty: "No hay eventos registrados aún",
    timer_active: "En curso",
    timer_done: "Expirado",
    test_mode_active: "MODO PRUEBA ACTIVO — desactívalo antes de guardar",
    "weather.sunny": "Soleado", "weather.clear-night": "Noche despejada", "weather.partlycloudy": "Parcialmente nublado",
    "weather.cloudy": "Nublado", "weather.fog": "Niebla", "weather.windy": "Ventoso", "weather.windy-variant": "Muy ventoso",
    "weather.rainy": "Lluvioso", "weather.snowy-rainy": "Aguanieve", "weather.pouring": "Lluvia intensa",
    "weather.snowy": "Nevado", "weather.hail": "Granizo", "weather.lightning": "Tormenta", "weather.lightning-rainy": "Tormenta con lluvia",
    "weather.exceptional": "Excepcional",
    clear_weather_entity_label: "Seleccionar entidad del tiempo",
    today: "Hoy",
  },
};

// ---------------------------------------------------------------------------
// Shared overlay helpers — used by both the card class and the watcher IIFE.
// ---------------------------------------------------------------------------
function _ovFmtState(hass, es, attribute) {
  if (!es) return "";
  if (attribute) {
    if (hass.formatEntityAttributeValue) {
      try { const v = hass.formatEntityAttributeValue(es, attribute); if (v != null) return String(v); } catch (_) {}
    }
    let v = es.attributes; for (const p of String(attribute).split(".")) v = v?.[p];
    return v != null ? String(v) : es.state;
  }
  if (hass.formatEntityState) {
    try { const v = hass.formatEntityState(es); if (v != null) return String(v); } catch (_) {}
  }
  return es.state;
}


// ---------------------------------------------------------------------------
// User-visibility filter — used by both the overlay IIFE and the card class.
// ---------------------------------------------------------------------------
function _evalVisibleTo(hass, a) {
  const vt = a.visible_to;
  if (vt == null || vt === "" || vt === "all") return true;
  const user = hass && hass.user;
  if (!user) return true;
  if (vt === "admin") return user.is_admin === true;
  if (vt === "non_admin") return user.is_admin !== true;
  const names = Array.isArray(vt) ? vt : [vt];
  return names.some(n => typeof n === "string" && n.toLowerCase() === (user.name || "").toLowerCase());
}

// ---------------------------------------------------------------------------
// Time-range filter — returns true if current local time is within [from, to].
// Both values are "HH:MM" strings. Handles midnight crossing (e.g. 22:00–06:00).
// ---------------------------------------------------------------------------
function _evalTimeRange(a) {
  const tr = a.time_range;
  if (!tr || !tr.from || !tr.to) return true;
  const parse = (s) => {
    const [h, m] = String(s).split(":").map(Number);
    return (isNaN(h) || isNaN(m)) ? null : h * 60 + m;
  };
  const from = parse(tr.from);
  const to   = parse(tr.to);
  if (from === null || to === null) return true;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return from <= to ? (cur >= from && cur < to) : (cur >= from || cur < to);
}

// ---------------------------------------------------------------------------
// Global overlay / toast manager — singleton shared across all card instances.
// Two trigger paths:
//   1. Card-based (immediate): card calls _ATC_OVERLAY.showDirect() when it
//      detects a new alert while it is live in the DOM (same view).
//   2. Watcher (cross-view): a 2-second setInterval reads hass directly from
//      <home-assistant> so the overlay fires even when the card's view is not
//      currently mounted.  Deduplicated so both paths never double-fire.
// Every code path is wrapped in try/catch — any failure is silent.
// ---------------------------------------------------------------------------
function _isEditMode() {
  try {
    const ha = document.querySelector("home-assistant");
    if (!ha) return false;
    // Walk shadow DOM recursively looking for hui-root (HA structure varies by version)
    function _findHuiRoot(root, depth) {
      if (!root || depth > 6) return null;
      const el = root.querySelector("hui-root");
      if (el) return el;
      for (const tag of ["home-assistant-main", "partial-panel-resolver", "ha-panel-lovelace", "ha-drawer"]) {
        const child = root.querySelector(tag);
        if (child?.shadowRoot) {
          const found = _findHuiRoot(child.shadowRoot, depth + 1);
          if (found) return found;
        }
      }
      return null;
    }
    const huiRoot = _findHuiRoot(ha.shadowRoot, 0);
    return !!(huiRoot?._editMode);
  } catch (_) { return false; }
}

const _ATC_OVERLAY = (() => {
  // ── DOM helpers ────────────────────────────────────────────────────────────
  let _root  = null;
  let _style = null;
  let _autoTimer = null;

  function _ensureStyle() {
    if (_style) return;
    _style = document.createElement("style");
    _style.textContent = `
      #atc-overlay-root {
        position: fixed; left: 0; right: 0; z-index: 999999;
        pointer-events: none; padding: 12px 16px;
        display: flex; flex-direction: column; gap: 8px;
        box-sizing: border-box;
      }
      #atc-overlay-root.atc-ov-top    { top: 0; }
      #atc-overlay-root.atc-ov-bottom { bottom: 0; }
      #atc-overlay-root.atc-ov-center { top: 50%; transform: translateY(-50%); }
      .atc-ov-toast {
        pointer-events: auto; position: relative;
        display: flex; align-items: center; gap: 12px;
        padding: 12px 16px; border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,.45);
        font-family: var(--paper-font-body1_-_font-family, sans-serif);
        font-size: 14px; color: #fff; max-width: 520px;
        margin: 0 auto; width: 100%; box-sizing: border-box;
        backdrop-filter: blur(6px);
        animation: atc-ov-slidein .3s cubic-bezier(.22,1,.36,1);
        overflow: hidden;
      }
      .atc-ov-toast.atc-ov-critical { background: linear-gradient(135deg,#b71c1c,#c62828); border-left: 4px solid #ff5252; }
      .atc-ov-toast.atc-ov-warning  { background: linear-gradient(135deg,#e65100,#ef6c00); border-left: 4px solid #ffab40; }
      .atc-ov-toast.atc-ov-info     { background: linear-gradient(135deg,#0d47a1,#1565c0); border-left: 4px solid #40c4ff; }
      .atc-ov-toast.atc-ov-ok       { background: linear-gradient(135deg,#1b5e20,#2e7d32); border-left: 4px solid #69f0ae; }
      .atc-ov-toast.atc-ov-style    { background: linear-gradient(135deg,#4a148c,#6a1b9a); border-left: 4px solid #ea80fc; }
      .atc-ov-toast.atc-ov-timer    { background: linear-gradient(135deg,#006064,#00838f); border-left: 4px solid #18ffff; }
      .atc-ov-icon  { font-size: 26px; flex-shrink: 0; line-height: 1; }
      .atc-ov-icon ha-icon { --mdc-icon-size: 26px; display: block; }
      .atc-ov-body  { flex: 1; min-width: 0; }
      .atc-ov-badge { font-size: 10px; opacity: .75; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
      .atc-ov-msg   { font-weight: 500; line-height: 1.35; word-break: break-word; }
      .atc-ov-secondary { font-size: 12px; opacity: .7; margin-top: 3px; word-break: break-word; white-space: pre-line; }
      .atc-ov-close {
        flex-shrink: 0; background: none; border: none;
        color: rgba(255,255,255,.65); font-size: 18px;
        cursor: pointer; padding: 0 4px; line-height: 1;
      }
      .atc-ov-close:hover { color: #fff; }
      .atc-ov-bar {
        position: absolute; bottom: 0; left: 0; height: 3px;
        background: rgba(255,255,255,.45);
        animation: atc-ov-shrink linear forwards;
      }
      @keyframes atc-ov-slidein {
        from { opacity: 0; transform: translateY(-18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .atc-ov-center .atc-ov-toast {
        animation: atc-ov-popin .3s cubic-bezier(.22,1,.36,1);
      }
      @keyframes atc-ov-popin {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes atc-ov-shrink { from { width: 100%; } to { width: 0; } }

      /* Per-category ambient animations */
      .atc-ov-toast.atc-ov-critical {
        animation: atc-ov-slidein .3s cubic-bezier(.22,1,.36,1), atc-ov-pulse 1.8s ease-in-out infinite;
      }
      .atc-ov-center .atc-ov-toast.atc-ov-critical {
        animation: atc-ov-popin .3s cubic-bezier(.22,1,.36,1), atc-ov-pulse 1.8s ease-in-out infinite;
      }
      @keyframes atc-ov-pulse {
        0%,100% { box-shadow: 0 4px 24px rgba(0,0,0,.45), 0 0 0 0 rgba(255,82,82,.0); }
        50%      { box-shadow: 0 4px 32px rgba(0,0,0,.55), 0 0 18px 6px rgba(255,82,82,.35); }
      }
      .atc-ov-toast.atc-ov-warning {
        animation: atc-ov-slidein .3s cubic-bezier(.22,1,.36,1), atc-ov-glow-warn 2.2s ease-in-out infinite;
      }
      .atc-ov-center .atc-ov-toast.atc-ov-warning {
        animation: atc-ov-popin .3s cubic-bezier(.22,1,.36,1), atc-ov-glow-warn 2.2s ease-in-out infinite;
      }
      @keyframes atc-ov-glow-warn {
        0%,100% { box-shadow: 0 4px 24px rgba(0,0,0,.45); }
        50%      { box-shadow: 0 4px 28px rgba(0,0,0,.5), 0 0 14px 4px rgba(255,171,64,.3); }
      }
      .atc-ov-toast.atc-ov-style {
        animation: atc-ov-slidein .3s cubic-bezier(.22,1,.36,1), atc-ov-neon 2.5s ease-in-out infinite;
      }
      .atc-ov-center .atc-ov-toast.atc-ov-style {
        animation: atc-ov-popin .3s cubic-bezier(.22,1,.36,1), atc-ov-neon 2.5s ease-in-out infinite;
      }
      @keyframes atc-ov-neon {
        0%,100% { box-shadow: 0 4px 24px rgba(0,0,0,.45); }
        50%      { box-shadow: 0 4px 28px rgba(0,0,0,.5), 0 0 20px 6px rgba(234,128,252,.25); }
      }
      .atc-ov-toast.atc-ov-timer {
        animation: atc-ov-slidein .3s cubic-bezier(.22,1,.36,1), atc-ov-timer-ring 1.4s ease-in-out infinite;
      }
      .atc-ov-center .atc-ov-toast.atc-ov-timer {
        animation: atc-ov-popin .3s cubic-bezier(.22,1,.36,1), atc-ov-timer-ring 1.4s ease-in-out infinite;
      }
      @keyframes atc-ov-timer-ring {
        0%,100% { box-shadow: 0 4px 24px rgba(0,0,0,.45); }
        50%      { box-shadow: 0 4px 28px rgba(0,0,0,.5), 0 0 16px 5px rgba(24,255,255,.3); }
      }
    `;
    document.head.appendChild(_style);
  }

  function _ensureRoot(pos) {
    if (!_root) {
      _root = document.createElement("div");
      _root.id = "atc-overlay-root";
      document.body.appendChild(_root);
    }
    _root.className = `atc-ov-${pos === "bottom" ? "bottom" : pos === "center" ? "center" : "top"}`;
  }

  function _paint(icon, cat, badge, msg, cfg, theme, secondary, cameraUrl) {
    _ensureStyle();
    _ensureRoot(cfg.overlay_position);
    clearTimeout(_autoTimer);
    _root.innerHTML = "";
    const duration = cfg.overlay_duration != null ? Number(cfg.overlay_duration) : 8;
    const safeCat   = ["critical","warning","info","ok","style","timer"].includes(cat) ? cat : "info";
    const themeMeta = THEME_META[theme] || {};
    const themeColor = themeMeta.color || null;
    const themeBg    = themeMeta.bg    || null;
    const toast    = document.createElement("div");
    toast.className = `atc-ov-toast atc-ov-${safeCat}`;
    if (themeBg)    toast.style.background    = themeBg;
    if (themeColor) toast.style.borderLeftColor = themeColor;
    toast.innerHTML =
      `<span class="atc-ov-icon">${icon}</span>` +
      `<div class="atc-ov-body">` +
        (badge ? `<div class="atc-ov-badge">${badge}</div>` : "") +
        `<div class="atc-ov-msg">${msg}</div>` +
        (secondary ? `<div class="atc-ov-secondary">${secondary}</div>` : "") +
      `</div>` +
      `<button class="atc-ov-close" title="Dismiss">✕</button>` +
      (duration > 0 ? `<div class="atc-ov-bar" style="animation-duration:${duration}s${themeColor ? ";background:" + themeColor : ""}"></div>` : "");
    toast.querySelector(".atc-ov-close").addEventListener("click", e => { e.stopPropagation(); _hide(); });
    // Camera snapshot — restructure toast to column layout (image added after scale)
    if (cameraUrl) {
      toast.style.flexDirection = "column";
      toast.style.alignItems    = "stretch";
      const header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;gap:12px;width:100%;";
      const bar = toast.querySelector(".atc-ov-bar");
      Array.from(toast.childNodes).forEach(n => { if (n !== bar) header.appendChild(n); });
      toast.insertBefore(header, bar || null);
    }
    const scale = parseFloat(cfg.overlay_scale) || 1;
    if (scale !== 1) {
      toast.style.fontSize     = (14 * scale) + 'px';
      toast.style.padding      = `${12 * scale}px ${16 * scale}px`;
      toast.style.gap          = (12 * scale) + 'px';
      toast.style.borderRadius = (12 * scale) + 'px';
      toast.style.maxWidth     = Math.min(520 * scale, window.innerWidth - 24) + 'px';
      toast.style.overflow     = 'visible';
      const iconEl = toast.querySelector('.atc-ov-icon');
      if (iconEl) {
        iconEl.style.fontSize = (26 * scale) + 'px';
        const haIcon = iconEl.querySelector('ha-icon');
        if (haIcon) haIcon.style.setProperty('--mdc-icon-size', (26 * scale) + 'px');
      }
      const closeEl = toast.querySelector('.atc-ov-close');
      if (closeEl) closeEl.style.fontSize = (18 * scale) + 'px';
    }
    // Add camera image AFTER scale so max-height is proportional
    if (cameraUrl) {
      const bar = toast.querySelector(".atc-ov-bar");
      const img = document.createElement("img");
      img.src = cameraUrl;
      img.style.cssText = `width:100%;max-height:${180 * scale}px;object-fit:cover;border-radius:${8 * scale}px;margin-top:${6 * scale}px;display:block;flex-shrink:0;`;
      img.onerror = () => img.remove();
      toast.insertBefore(img, bar || null);
    }
    _root.style.display = "";
    _root.appendChild(toast);
    if (duration > 0) _autoTimer = setTimeout(_hide, duration * 1000);
  }

  function _hide() {
    try { clearTimeout(_autoTimer); if (_root) _root.style.display = "none"; } catch (_) {}
  }

  // ── Dedup — prevents card-path + watcher-path from both firing ─────────────
  let _lastKey = "";
  let _lastAt  = 0;
  function _isDupe(key) {
    const now = Date.now();
    if (key === _lastKey && now - _lastAt < 10000) return true;
    _lastKey = key; _lastAt = now;
    return false;
  }

  // ── Watcher — independent hass polling via <home-assistant> ───────────────
  // regs:  cardId → { alerts: [], config: {}, lang: "" }
  // bases: cardId → Set<number>   (active alert indices on last tick)
  // prevS: cardId → Map<string, string> (entity+attr → state on last tick)
  let _regs        = new Map();
  let _bases       = new Map();
  let _prevS       = new Map();
  let _watchInterval = null;
  // trigger_delay tracking for overlay (mirrors card-side logic for when card is not mounted)
  const _ovDelayTimers = new Map(); // "cardId:i" → setTimeout ID
  const _ovDelayActive = new Set(); // "cardId:i" keys whose delay has elapsed

  function _getHass() {
    try { return document.querySelector("home-assistant")?.hass ?? null; } catch (_) { return null; }
  }

  function _getVal(hass, entity, attribute) {
    try {
      const es = hass.states[entity];
      if (!es) return null;
      if (attribute) {
        let v = es.attributes;
        for (const p of String(attribute).split(".")) v = v?.[p];
        return v != null ? String(v) : null;
      }
      return es.state;
    } catch (_) { return null; }
  }

  function _matchOp(actual, op, trigger) {
    if (actual == null) return false;
    const n = parseFloat(actual), t = parseFloat(trigger);
    switch (op) {
      case "=": case "==": return String(actual) === String(trigger);
      case "!=":           return String(actual) !== String(trigger);
      case ">":            return !isNaN(n) && !isNaN(t) && n > t;
      case "<":            return !isNaN(n) && !isNaN(t) && n < t;
      case ">=":           return !isNaN(n) && !isNaN(t) && n >= t;
      case "<=":           return !isNaN(n) && !isNaN(t) && n <= t;
      case "contains":     return actual.toLowerCase().includes(trigger.toLowerCase());
      case "not_contains":  return !actual.toLowerCase().includes(trigger.toLowerCase());
      default:             return String(actual) === String(trigger);
    }
  }

  // Returns [entityId, entityState] for the first entity_filter / device_class / label / area match, or null.
  function _findFilterMatch(hass, a) {
    const f = (a.entity_filter || "").toLowerCase();
    const hasWild = f.includes("*");
    const re = hasWild ? new RegExp("^" + f.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$") : null;
    const matchFn = f ? ((t) => hasWild ? re.test(t.toLowerCase()) : t.toLowerCase().includes(f)) : null;
    const excluded = new Set(a.entity_filter_exclude || []);
    const labelFilter = a.label_filter ? (Array.isArray(a.label_filter) ? a.label_filter : [a.label_filter]) : null;
    const areaFilter  = a.area_filter  ? (Array.isArray(a.area_filter)  ? a.area_filter  : [a.area_filter])  : null;
    for (const [eid, es] of Object.entries(hass.states)) {
      if (excluded.has(eid)) continue;
      if (a.device_class && es.attributes?.device_class !== a.device_class) continue;
      if (matchFn && !matchFn(eid) && !matchFn(es.attributes?.friendly_name || "")) continue;
      // Label filter — match against HA entity registry labels
      if (labelFilter) {
        const entityLabels = hass.entities?.[eid]?.labels || [];
        if (!labelFilter.some(l => entityLabels.includes(l))) continue;
      }
      // Area filter — entity area first, then device area as fallback
      if (areaFilter) {
        const meta = hass.entities?.[eid];
        const entityArea = meta?.area_id;
        const deviceArea = meta?.device_id ? hass.devices?.[meta.device_id]?.area_id : null;
        if (!areaFilter.some(ar => ar === entityArea || ar === deviceArea)) continue;
      }
      let actual = es.state;
      if (a.attribute) {
        let v = es.attributes; for (const p of String(a.attribute).split(".")) v = v?.[p];
        actual = v != null ? String(v) : es.state;
      }
      if (_matchOp(actual, a.operator || "=", a.state ?? "on")) return [eid, es];
    }
    return null;
  }

  function _evalFilterAlert(hass, a) { return _findFilterMatch(hass, a) !== null; }

  function _evalAlert(hass, a, prevMap) {
    if (!_evalVisibleTo(hass, a)) return false;
    if ((a.entity_filter || a.device_class || a.label_filter || a.area_filter) && !a.entity) return _evalFilterAlert(hass, a);
    if (!a.entity) return false;
    if (a.on_change) {
      const key = a.entity + (a.attribute || "");
      const cur  = _getVal(hass, a.entity, a.attribute);
      const prev = prevMap.get(key);
      return cur != null && prev !== undefined && cur !== prev;
    }
    const actual = _getVal(hass, a.entity, a.attribute);
    const primaryOk = _matchOp(actual, a.operator || "=", a.state ?? "on");
    if (a.conditions?.length) {
      const logic = a.conditions_logic || "and";
      const res = a.conditions.map(c => _matchOp(_getVal(hass, c.entity, c.attribute), c.operator || "=", c.state ?? "on"));
      if (logic === "or" ? !(primaryOk || res.some(Boolean)) : !(primaryOk && res.every(Boolean))) return false;
    } else if (!primaryOk) return false;
    return true;
  }

  function _resolveMsg(hass, a) {
    let msg = a.message || "";
    const es = a.entity ? hass.states[a.entity] : null;
    const deviceId   = a.entity ? hass.entities?.[a.entity]?.device_id : null;
    const dev        = deviceId ? hass.devices?.[deviceId] : null;
    const deviceName = dev ? (dev.name_by_user || dev.name || "") : "";
    // Resolve {placeholders} first so _evalTemplate sees real entity IDs
    msg = msg
      .replace(/\{state\}/g,  es ? _ovFmtState(hass, es, null) : "")
      .replace(/\{name\}/g,   es?.attributes?.friendly_name || a.entity || "")
      .replace(/\{entity\}/g, a.entity || "")
      .replace(/\{device\}/g, deviceName)
      .replace(/\{timer\}/g,  "");
    // Try to evaluate supported {{ }} template patterns directly from hass.states
    const evaluated = _evalTemplate(hass, msg);
    if (evaluated !== null) {
      msg = evaluated;
    } else {
      // Unsupported syntax — strip control blocks, replace remaining {{ }} with …
      msg = msg
        .replace(/\{%-?\s*[\s\S]*?-?%\}/g, "")
        .replace(/\{\{[\s\S]*?\}\}/g, "…");
    }
    return msg.replace(/\s+/g, " ").trim() || a.badge_label || es?.attributes?.friendly_name || a.entity || "";
  }

  // Evaluates common HA template patterns directly from hass.states — no WebSocket needed.
  // Supports: {{ state_attr('e','a') }}, {{ states('e') }}, {{ states.e.a }}.
  // Returns the rendered string, or null if the template contains unsupported syntax.
  function _evalTemplate(hass, tpl) {
    let r = tpl;
    r = r.replace(/\{\{\s*state_attr\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g, (_, e, a) => {
      const v = hass.states[e]?.attributes?.[a];
      return v != null ? String(v) : "";
    });
    r = r.replace(/\{\{\s*states\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g, (_, e) => {
      return _ovFmtState(hass, hass.states[e], null) || "";
    });
    r = r.replace(/\{\{\s*states\.([a-z0-9_]+)\.([a-z0-9_.]+)\s*\}\}/g, (_, e_prefix, rest) => {
      const parts = rest.split(".");
      const field = parts[0];
      const es = hass.states[e_prefix + "." + (field === "state" ? "" : "")];
      if (!es) return "";
      if (field === "state") return es.state;
      let v = es.attributes; for (const p of parts) v = v?.[p];
      return v != null ? String(v) : "";
    });
    if (/\{\{/.test(r)) return null; // unsupported syntax remains
    return r.trim();
  }

  // Resolves {placeholders} only — used to pre-substitute before sending to HA engine.
  function _resolvePlaceholders(hass, a, raw) {
    const es = a.entity ? hass.states[a.entity] : null;
    const deviceId   = a.entity ? hass.entities?.[a.entity]?.device_id : null;
    const dev        = deviceId ? hass.devices?.[deviceId] : null;
    const deviceName = dev ? (dev.name_by_user || dev.name || "") : "";
    return raw
      .replace(/\{state\}/g,  es ? _ovFmtState(hass, es, null) : "")
      .replace(/\{name\}/g,   es?.attributes?.friendly_name || a.entity || "")
      .replace(/\{entity\}/g, a.entity || "")
      .replace(/\{device\}/g, deviceName)
      .replace(/\{timer\}/g,  "");
  }

  // Resolves the alert message asynchronously, using HA's WebSocket render_template
  // for complex Jinja2 expressions. Falls back to synchronous _resolveMsg on error/timeout.
  function _resolveMsgAsync(hass, a) {
    const fallback = _resolveMsg(hass, a);
    const raw = a.message || "";
    if (!raw.includes("{{")) return Promise.resolve(fallback);
    // Substitute {placeholders} before sending to HA so {entity} becomes the real ID
    const tpl = _resolvePlaceholders(hass, a, raw);
    // Fast synchronous path for simple supported patterns
    const quick = _evalTemplate(hass, tpl);
    if (quick !== null) return Promise.resolve(quick.replace(/\s+/g, " ").trim() || fallback);
    // Complex template — render server-side via WebSocket
    return new Promise((resolve) => {
      let done = false;
      const finish = (val) => { if (!done) { done = true; resolve(val || fallback); } };
      const timer = setTimeout(() => finish(fallback), 3000);
      try {
        let unsubFn;
        hass.connection.subscribeMessage(
          (result) => {
            clearTimeout(timer);
            try { unsubFn?.(); } catch (_) {}
            finish((result.result ?? "").replace(/\s+/g, " ").trim());
          },
          { type: "render_template", template: tpl, variables: {}, strict: false }
        ).then(u => {
          unsubFn = u;
          // Unsubscribe after first result — we only need a one-shot render
          setTimeout(() => { try { u(); } catch (_) {} }, 500);
        }).catch(() => finish(fallback));
      } catch (_) { finish(fallback); }
    });
  }

  function _tick() {
    const hass = _getHass();
    if (!hass) return;
    for (const [id, reg] of _regs) {
      try {
        if (!reg.config?.overlay_mode) continue;
        const prevMap  = _prevS.get(id) || new Map();
        const newMap   = new Map();
        for (const a of reg.alerts) {
          if (a.entity) newMap.set(a.entity + (a.attribute || ""), _getVal(hass, a.entity, a.attribute));
        }
        const isFirst = !_prevS.has(id);
        _prevS.set(id, newMap);

        const curActive = new Set();
        reg.alerts.forEach((a, i) => {
          try {
            if (!_evalAlert(hass, a, prevMap)) {
              // Condition false — cancel any pending trigger_delay
              const dk = id + ":" + i;
              if (_ovDelayTimers.has(dk)) { clearTimeout(_ovDelayTimers.get(dk)); _ovDelayTimers.delete(dk); }
              _ovDelayActive.delete(dk);
              return;
            }
            if (a.trigger_delay) {
              const dk = id + ":" + i;
              if (_ovDelayActive.has(dk)) {
                curActive.add(i); // delay already elapsed
              } else if (!_ovDelayTimers.has(dk)) {
                _ovDelayTimers.set(dk, setTimeout(() => {
                  _ovDelayActive.add(dk);
                  _ovDelayTimers.delete(dk);
                }, a.trigger_delay * 1000));
              }
              // still waiting — don't add to curActive yet
            } else {
              curActive.add(i);
            }
          } catch (_) {}
        });

        const prevActive = _bases.get(id) || new Set();
        // newBases = (prevActive ∩ curActive): keeps already-notified active alerts,
        // drops deactivated ones so they can re-fire when they become active again.
        // Newly-active alerts are added one per tick as they are shown.
        const newBases = new Set();
        for (const pi of prevActive) { if (curActive.has(pi)) newBases.add(pi); }
        _bases.set(id, newBases);

        // First tick = baseline: record current state, don't fire.
        // Prevents banners for alerts already active at page load.
        if (isFirst) continue;

        // Card is visible on the current view — watcher must not fire.
        // Also stamp all currently-active alerts into bases so a brief unmount
        // (e.g. config save in editor) doesn't re-fire already-visible alerts.
        const el = reg.element;
        if (el && el._mounted) {
          for (const i of curActive) newBases.add(i);
          _bases.set(id, newBases);
          continue;
        }

        for (const i of curActive) {
          if (newBases.has(i)) continue; // already notified or was already active
          const a   = reg.alerts[i];
          const key = id + ":" + (a.entity || "") + ":" + i;
          if (_isDupe(key)) continue;
          const cat     = (THEME_META[a.theme] || {}).category || "info";
          const rawIcon = a.icon || (THEME_META[a.theme] || {}).icon || "🔔";
          const icon    = (rawIcon && /^[\w-]+:/.test(rawIcon))
            ? `<ha-icon icon="${rawIcon}"${a.icon_color ? ` style="color:${a.icon_color}"` : ""}></ha-icon>`
            : rawIcon;
          const tLang  = T[reg.lang] || T.en;
          const badge  = a.show_badge === false ? "" : (a.badge_label || ({ critical: tLang.critical, warning: tLang.warning_label, ok: tLang.success_label }[cat] ?? tLang.info_label));

          // For entity_filter / device_class alerts: find the triggering entity and resolve msg/secondary
          let msgPromise, filterSecondary = "";
          if ((a.entity_filter || a.device_class || a.label_filter || a.area_filter) && !a.entity) {
            const match = _findFilterMatch(hass, a);
            if (match) {
              const [eid, fes] = match;
              const fname = fes.attributes?.friendly_name || eid;
              const fstate = _ovFmtState(hass, fes, a.attribute || null);
              const rawFilter = (a.message || "")
                .replace(/\{state\}/g, fstate).replace(/\{name\}/g, fname)
                .replace(/\{entity\}/g, eid).replace(/\{device\}/g, "").replace(/\{timer\}/g, "");
              const quickFilter = _evalTemplate(hass, rawFilter);
              const filterMsg = quickFilter !== null
                ? quickFilter.replace(/\s+/g, " ").trim() || fname
                : rawFilter.replace(/\{%-?\s*[\s\S]*?-?%\}/g, "").replace(/\{\{[\s\S]*?\}\}/g, "…").replace(/\s+/g, " ").trim() || fname;
              msgPromise = Promise.resolve(filterMsg);
              if (a.show_filter_name !== false) {
                filterSecondary = a.show_filter_state ? `${fname}: ${fstate}` : fname;
              }
            } else { msgPromise = Promise.resolve(a.message || ""); }
          } else {
            msgPromise = _resolveMsgAsync(hass, a);
          }

          const entityPart = (() => {
            if (!a.secondary_entity) return "";
            const es = hass.states[a.secondary_entity];
            if (!es) return "";
            const st = _ovFmtState(hass, es, a.secondary_attribute || null);
            return a.show_secondary_name ? `${es.attributes?.friendly_name || a.secondary_entity} ${st}` : st;
          })();
          // Resolve secondary_text — async if it contains {{ }} (same engine as msgPromise)
          let secondaryTextPromise;
          if (a.secondary_text) {
            if (/\{\{/.test(a.secondary_text)) {
              const quick = _evalTemplate(hass, a.secondary_text);
              secondaryTextPromise = quick !== null
                ? Promise.resolve(quick.replace(/\s+/g, " ").trim())
                : _resolveMsgAsync(hass, { ...a, message: a.secondary_text });
            } else {
              secondaryTextPromise = Promise.resolve(
                a.secondary_text.replace(/\{%-?\s*[\s\S]*?-?%\}/g, "").replace(/\s+/g, " ").trim()
              );
            }
          } else {
            secondaryTextPromise = Promise.resolve("");
          }
          const camUrl = a.camera_entity ? (hass.states[a.camera_entity]?.attributes?.entity_picture || null) : null;
          const paintCfg = reg.config, paintTheme = a.theme;
          newBases.add(i); // mark as notified synchronously — prevents re-firing on next tick
          Promise.all([msgPromise, secondaryTextPromise]).then(([resolvedMsg, resolvedSecondary]) => {
            const resolvedParts = [];
            if (resolvedSecondary) resolvedParts.push(resolvedSecondary);
            if (filterSecondary)   resolvedParts.push(filterSecondary);
            if (entityPart)        resolvedParts.push(entityPart);
            try { _paint(icon, cat, badge, resolvedMsg, paintCfg, paintTheme, resolvedParts.join("\n"), camUrl); } catch (_) {}
          });
          break; // one overlay per tick
        }
      } catch (_) {}
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    // Called by the card when it detects a new alert itself (same-view, immediate)
    showDirect(icon, cat, badge, msg, cfg, dedupeKey, theme, secondary, cameraUrl) {
      try { if (!_isDupe(dedupeKey)) _paint(icon, cat, badge, msg, cfg, theme, secondary, cameraUrl); } catch (_) {}
    },
    // Card is visible — suppress watcher for this alert without showing the banner
    suppress(dedupeKey) {
      try { _lastKey = dedupeKey; _lastAt = Date.now(); } catch (_) {}
    },
    hide: _hide,
    // Register / update a card's config so the watcher can track it cross-view
    register(id, alerts, config, lang, element) {
      try {
        // Clean up stale registrations. Rules:
        // - NEVER delete a registration whose element is still active (connected or mounted) —
        //   that card is legitimately on another view and must keep firing cross-view banners.
        // - Delete orphans: element gone AND detach() was never called (hot-reload leftovers).
        // - Delete same-slot remounts: same alert fingerprint AND properly disconnected.
        const fp = (alerts || []).map(a => a.entity || a.entity_filter || "").join("|");
        for (const [oid, oreg] of _regs) {
          if (oid === id) continue;
          const oel = oreg.element;
          if (oel && (oel.isConnected || oel._mounted)) continue; // active — leave it alone
          const ofp = (oreg.alerts || []).map(a => a.entity || a.entity_filter || "").join("|");
          const isOrphan   = !oreg.disconnected;       // never called detach() — leftover
          const isSameSlot = oreg.disconnected && ofp === fp; // same card remounting
          if (isOrphan || isSameSlot) {
            _regs.delete(oid); _prevS.delete(oid); _bases.delete(oid);
          }
        }
        // If the alerts array changed (entity set or order), reset state so stale
        // indices don't cause already-notified alerts to re-fire after an edit.
        const existing = _regs.get(id);
        if (existing) {
          const oldSig = (existing.alerts || []).map((a, i) => i + ":" + (a.entity || a.entity_filter || "")).join("|");
          const newSig = (alerts || []).map((a, i) => i + ":" + (a.entity || a.entity_filter || "")).join("|");
          if (oldSig !== newSig) { _bases.delete(id); _prevS.delete(id); }
        }
        _regs.set(id, { alerts: alerts || [], config, lang, element, disconnected: false });
        if (!_watchInterval) _watchInterval = setInterval(_tick, 2000);
      } catch (_) {}
    },
    detach(id) {
      try {
        const reg = _regs.get(id);
        if (reg) reg.disconnected = true;
        _lastKey = ""; _lastAt = 0;
        // Clean up overlay trigger_delay timers for this card
        for (const [dk, t] of _ovDelayTimers) {
          if (dk.startsWith(id + ":")) { clearTimeout(t); _ovDelayTimers.delete(dk); }
        }
        for (const dk of _ovDelayActive) {
          if (dk.startsWith(id + ":")) _ovDelayActive.delete(dk);
        }
      } catch (_) {}
    },
    updateConfig(id, config) {
      try { const r = _regs.get(id); if (r) r.config = config; } catch (_) {}
    },
    updateAlerts(id, alerts, lang) {
      try { const r = _regs.get(id); if (r) { r.alerts = alerts || []; if (lang) r.lang = lang; } } catch (_) {}
    },
  };
})();

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
      _touchButtonsActive: { type: Boolean },
      _weatherState: { type: String },
      _weatherTemp: { type: String },
      _weatherWind: { type: String },
      _weatherHumidity: { type: String },
      _forecastData: { type: Array },
      _wfShowForecast: { type: Boolean },
      _clockTime: { type: String },
      _clockDate: { type: String },
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
    this._persistentLatched = new Set(); // snoozeKey → latched persistent alert
    this._expandedGroups = new Set(); // groupKey → expanded (shows individual slides)
    this._historyOpen = false;
    this._history = []; // { ts, message, theme, icon, entity }
    this._touchButtonsActive = false;
    this._touchButtonsTimer = null;
    this._weatherState = null;
    this._weatherTemp = null;
    this._weatherWind = null;
    this._weatherHumidity = null;
    this._forecastData = [];
    this._forecastEntity = null;
    this._forecastUnsub = null;
    this._wfShowForecast = false;
    this._wfForecastShown = false;
    this._wfFlipTimer = null;
    this._clockTime = "";
    this._clockDate = "";
    // Per-entity total duration cache for device_class:timestamp timers (entityId → totalSec)
    this._tsTimerTotals = new Map();
    // HA template rendering via WebSocket render_template subscription
    this._tmplCache = new Map();   // template string → rendered string
    this._tmplUnsubs = new Map();  // template string → unsubscribe fn
    // Swipe-to-snooze gesture tracking
    this._swipeStartX = 0;
    this._swipeStartY = 0;
    // Double-tap detection
    this._doubleTapTimer = null;
    // Hold-action deferred firing (url actions need synchronous context for window.open)
    this._pendingHoldAction = null;
    // On iOS/WKWebView (Companion app) a tap generates a click event even after pointerup
    // stopPropagation. That click is re-dispatched at the shadow host and reaches HA parent
    // handlers which navigate/open Safari. This flag + host listener suppresses it.
    this._suppressNextClick = false;
    this._hostClickSuppressor = (e) => {
      if (this._suppressNextClick) {
        this._suppressNextClick = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };
    // on_change / auto_dismiss_after tracking
    this._changeTriggers   = {};       // "configIdx:entityId" → trigger timestamp (on_change)
    this._autoDismissTimers = {};      // "configIdx:entityId" → setTimeout ID
    this._autoDismissedKeys = new Set(); // keys whose auto_dismiss timer has fired
    // trigger_delay: show alert only after condition has been true for N seconds
    this._triggerDelayTimers = {};     // key → setTimeout ID (pending)
    this._triggerDelayActive  = new Set(); // keys whose trigger_delay has elapsed
    // Unique ID for overlay manager registration
    this._cardId = "atc-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }

  // ---- Lovelace card static helpers ----------------------------------------

  static getStubConfig() {
    return {
      cycle_interval: 5,
      cycle_animation: "fold",
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [],
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
      clear_display_mode: "message",
      clear_weather_entity: null,
      alerts: [],
      ...config,
    };
    // Stop/start cycle timer based on test_mode
    if (this._config.test_mode) {
      this._stopCycleTimer();
    } else if (this._hass && !this._cycleTimer) {
      this._startCycleTimer();
    }
    // Force full recompute so grouping/config changes take effect immediately
    this._lastSignature = "";
    if (this._hass) {
      this._computeActiveAlerts();
    }
    // Sync HA template subscriptions (render_template via WebSocket)
    if (this._hass) this._syncTemplates();
    // If already mounted (editor config change), re-register immediately.
    // Otherwise connectedCallback() will register once isConnected is true.
    if (this._mounted) {
      _ATC_OVERLAY.register(this._cardId, this._config.alerts || [], this._config, this._lang, this);
    }
    // Restart the weather_forecast flip timer when the interval changes
    if (this._config.clear_display_mode === 'weather_forecast' && this._wfFlipTimer) {
      this._stopWfFlipTimer();
      this._startWfFlipTimer();
    }
    // Play a one-shot animation preview when the editor changes cycle_animation
    // Delay so requestUpdate from _computeActiveAlerts settles first
    if (this._config._preview_anim) {
      setTimeout(() => this._triggerAnimPreview(), 50);
    }
  }

  // ---- Hass setter ---------------------------------------------------------

  set hass(hass) {
    const prevHass = this._hass;
    this._hass = hass;
    // Detect language (default to "en" if HA language is not IT)
    const raw = (hass.language || "en").toLowerCase().split("-")[0];
    const lang = T[raw] ? raw : "en";
    if (lang !== this._lang) {
      this._lang = lang;
      _ATC_OVERLAY.updateAlerts(this._cardId, this._config?.alerts || [], lang);
    }
    if (prevHass) this._trackStateChanges(prevHass);
    this._syncTemplates();
    this._computeActiveAlerts();
    this._updateWeather(hass);
  }

  // ---- Translation helper --------------------------------------------------

  _t(key) {
    return (T[this._lang] || T["en"])[key] || key;
  }

  // ---- on_change / auto_dismiss_after state tracking ----------------------

  _trackStateChanges(prevHass) {
    if (!this._config) return;
    (this._config.alerts || []).forEach((alert, idx) => {
      if (!alert.entity) return;
      if (!alert.on_change && !alert.auto_dismiss_after) return;
      const key = `${idx}:${alert.entity}`;
      const prevEntityState = prevHass.states[alert.entity];
      const newEntityState  = this._hass.states[alert.entity];
      if (!prevEntityState || !newEntityState) return;
      const prevState = (alert.on_change && alert.attribute)
        ? String(this._resolveAttrPath(prevEntityState.attributes, alert.attribute) ?? "")
        : prevEntityState.state;
      const newState = (alert.on_change && alert.attribute)
        ? String(this._resolveAttrPath(newEntityState.attributes, alert.attribute) ?? "")
        : newEntityState.state;

      if (alert.on_change && prevState !== newState) {
        // State changed — record trigger, clear any previous auto-dismiss
        this._changeTriggers[key] = Date.now();
        this._autoDismissedKeys.delete(key);
        clearTimeout(this._autoDismissTimers[key]);
        delete this._autoDismissTimers[key];
        // Start dismiss timer only if explicitly configured
        if (alert.auto_dismiss_after) {
          this._autoDismissTimers[key] = setTimeout(() => {
            delete this._changeTriggers[key];
            delete this._autoDismissTimers[key];
            this.requestUpdate();
          }, alert.auto_dismiss_after * 1000);
        }
      }
    });
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
    for (let idx = 0; idx < this._config.alerts.length; idx++) {
      const alert = this._config.alerts[idx];
      if ((alert.entity_filter || alert.device_class || alert.label_filter || alert.area_filter) && !alert.entity) {
        const matchFn = alert.entity_filter ? this._buildFilterMatcher(alert.entity_filter) : null;
        const excluded = new Set(alert.entity_filter_exclude || []);
        const labelFilter = alert.label_filter ? (Array.isArray(alert.label_filter) ? alert.label_filter : [alert.label_filter]) : null;
        const areaFilter  = alert.area_filter  ? (Array.isArray(alert.area_filter)  ? alert.area_filter  : [alert.area_filter])  : null;
        const matched = Object.entries(this._hass.states).filter(([entityId, state]) => {
          if (excluded.has(entityId)) return false;
          if (alert.device_class && state.attributes.device_class !== alert.device_class) return false;
          if (matchFn) {
            const friendlyName = state.attributes.friendly_name || "";
            if (!matchFn(entityId) && !matchFn(friendlyName)) return false;
          }
          if (labelFilter) {
            const entityLabels = this._hass.entities?.[entityId]?.labels || [];
            if (!labelFilter.some(l => entityLabels.includes(l))) return false;
          }
          if (areaFilter) {
            const meta = this._hass.entities?.[entityId];
            const entityArea = meta?.area_id;
            const deviceArea = meta?.device_id ? this._hass.devices?.[meta.device_id]?.area_id : null;
            if (!areaFilter.some(ar => ar === entityArea || ar === deviceArea)) return false;
          }
          return true;
        });
        for (const [entityId, state] of matched) {
          const friendlyName = state.attributes.friendly_name || entityId;
          expandedAlerts.push({
            ...alert,
            _sourceAlert: alert,
            _configIdx: idx,
            entity: entityId,
            message: (alert.message || "")
              .replace(/\{entity\}/g, entityId)
              .replace(/\{name\}/g, friendlyName)
              .replace(/\{state\}/g, this._formatStateValue(state, alert.attribute)),
          });
        }
      } else {
        expandedAlerts.push({ ...alert, _configIdx: idx });
      }
    }

    let snoozedCount = 0;
    const testMode = !!this._config.test_mode;
    let active = expandedAlerts.filter((alert) => {
      const entityState = this._hass.states[alert.entity];
      if (!entityState) return false;
      if (!testMode) {
        if (!_evalVisibleTo(this._hass, alert)) return false;
        if (!_evalTimeRange(alert)) return false;
        const key = `${alert._configIdx}:${alert.entity}`;

        if (alert.on_change) {
          // on_change mode: active only while a recent change trigger is live
          if (!this._changeTriggers[key]) return false;
          // Extra AND/OR conditions still apply for on_change alerts
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
            if (!(logic === "or" ? results.some(Boolean) : results.every(Boolean))) return false;
          }
        } else {
          // Normal condition check
          const stateValue = (alert.attribute != null && alert.attribute !== "")
            ? String(this._resolveAttrPath(entityState.attributes, alert.attribute) ?? "")
            : entityState.state;
          const primaryOk = this._matchesState(stateValue, alert);
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
            const passes = logic === "or"
              ? primaryOk || results.some(Boolean)
              : primaryOk && results.every(Boolean);
            if (!passes) {
              // persistent: keep showing even though condition cleared
              if (alert.persistent && this._persistentLatched.has(this._snoozeKey(alert))) return true;
              // Condition went false — reset timers so next activation starts fresh
              if (alert.auto_dismiss_after) {
                this._autoDismissedKeys.delete(key);
                clearTimeout(this._autoDismissTimers[key]);
                delete this._autoDismissTimers[key];
              }
              if (alert.trigger_delay) {
                clearTimeout(this._triggerDelayTimers[key]);
                delete this._triggerDelayTimers[key];
                this._triggerDelayActive.delete(key);
              }
              return false;
            }
          } else if (!primaryOk) {
            // persistent: keep showing even though condition cleared
            if (alert.persistent && this._persistentLatched.has(this._snoozeKey(alert))) return true;
            if (alert.auto_dismiss_after) {
              this._autoDismissedKeys.delete(key);
              clearTimeout(this._autoDismissTimers[key]);
              delete this._autoDismissTimers[key];
            }
            if (alert.trigger_delay) {
              clearTimeout(this._triggerDelayTimers[key]);
              delete this._triggerDelayTimers[key];
              this._triggerDelayActive.delete(key);
            }
            return false;
          }
          // trigger_delay: condition must stay true for N seconds before alert becomes visible
          if (alert.trigger_delay) {
            if (!this._triggerDelayActive.has(key)) {
              if (!this._triggerDelayTimers[key]) {
                this._triggerDelayTimers[key] = setTimeout(() => {
                  this._triggerDelayActive.add(key);
                  delete this._triggerDelayTimers[key];
                  this.requestUpdate();
                }, alert.trigger_delay * 1000);
              }
              return false; // still waiting for delay to elapse
            }
          }
          // auto_dismiss_after for normal condition alerts
          if (alert.auto_dismiss_after) {
            if (this._autoDismissedKeys.has(key)) return false;
            if (!this._autoDismissTimers[key]) {
              this._autoDismissTimers[key] = setTimeout(() => {
                this._autoDismissedKeys.add(key);
                delete this._autoDismissTimers[key];
                this.requestUpdate();
              }, alert.auto_dismiss_after * 1000);
            }
          }
        }
        // persistent: latch on first true so it stays visible after sensor clears
        if (alert.persistent) {
          const pKey = this._snoozeKey(alert);
          if (!this._persistentLatched.has(pKey)) {
            this._persistentLatched.add(pKey);
            this._savePersistent();
          }
        }
        if (this._isSnoozed(alert)) { snoozedCount++; return false; }
      }
      return true;
    });

    // Sort by priority (lower number = first; undefined priority goes last)
    active.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    // In test mode: jump immediately to the previewed alert before the early-return check.
    // _preview_index is the index in this._config.alerts (config order), NOT in the
    // sorted active array. For regular alerts match by object reference; for entity_filter
    // alerts match via the _sourceAlert reference preserved during expansion.
    if (testMode && this._config._preview_index != null) {
      const configIdx = this._config._preview_index;
      const target = (this._config.alerts || [])[configIdx];
      const pi = target
        ? active.findIndex(a => a._configIdx === configIdx || a._sourceAlert === target)
        : -1;
      if (pi >= 0 && pi !== this._currentIndex) {
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

    // Record newly triggered alerts into history and play sound.
    // On first load: record history (so alerts already active on load appear in cronologia)
    // but skip sound and deduplicate — if the same entity was recorded within the last
    // 5 minutes we skip it (avoids duplicate history entries on page reload).
    if (!testMode) {
      const prevKeys = new Set(this._activeAlerts.map((a) => this._snoozeKey(a)));
      const now = Date.now();
      let _overlayShown = false;
      active.forEach((alert) => {
        if (!prevKeys.has(this._snoozeKey(alert))) {
          if (!this._initialLoadDone) {
            // First load — record only if not already recorded recently (reload dedup)
            const recentlySeen = this._history.some(
              h => h.entity === (alert.entity || "") && (now - h.ts) < 5 * 60 * 1000
            );
            if (!recentlySeen) this._recordHistory(alert);
          } else {
            // Normal state change — record + sound
            this._recordHistory(alert);
            this._playAlertSound(alert);
            this._speakAlert(alert);
            // Overlay: the watcher handles all display. The card-path only
            // calls suppress() to prevent the watcher from double-firing when
            // the card is mounted and visible. No showDirect() here — avoids
            // the race condition where set hass() fires before connectedCallback.
            if (this._config?.overlay_mode && !_overlayShown && this._mounted) {
              _overlayShown = true;
              const dedupeKey = this._cardId + ":" + (alert.entity || "") + ":" + (alert._configIdx ?? 0);
              _ATC_OVERLAY.suppress(dedupeKey);
            }
          }
        }
      });
    }
    this._initialLoadDone = true;

    // --- Grouping pass: collapse filter alerts with group:true into summary slides ---
    const _groupBuckets = new Map(); // configIdx → members[]
    const _ungrouped = [];
    for (const alert of active) {
      const src = alert._sourceAlert;
      if (src && src.group) {
        const k = alert._configIdx;
        if (!_groupBuckets.has(k)) _groupBuckets.set(k, []);
        _groupBuckets.get(k).push(alert);
      } else {
        _ungrouped.push(alert);
      }
    }
    for (const [key, members] of _groupBuckets) {
      const src = members[0]._sourceAlert;
      const minCount = src.group_min || 3;
      const groupKey = `grp_${key}`;
      if (this._expandedGroups.has(groupKey)) {
        // Group is expanded — show individual member slides, optionally overriding message
        _ungrouped.push(...members.map(m => ({
          ...m,
          _expandedMember: true,
          _expandedGroupKey: groupKey,
          ...(src.group_expanded_message ? { message: src.group_expanded_message } : {}),
        })));
      } else if (members.length >= minCount) {
        const names = members.map(a => {
          const s = this._hass?.states[a.entity];
          return s?.attributes?.friendly_name || a.entity || "";
        });
        const rawMsg = src.group_message || `{count} alert`;
        // Apply {count}/{names} substitutions
        let msg = rawMsg
          .replace(/\{count\}/g, members.length)
          .replace(/\{names\}/g, names.join(", "));
        // Jinja2/WS template support: resolve {{ ... }} in group_message
        if (rawMsg.includes("{{")) {
          const cached = this._tmplCache.get(rawMsg);
          if (cached !== undefined) {
            msg = cached
              .replace(/\{count\}/g, members.length)
              .replace(/\{names\}/g, names.join(", "));
          } else {
            this._subscribeTemplate(rawMsg);
            msg = msg.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (_, expr) => {
              const v = this._evalJinjaExpr(expr.trim());
              return v !== null ? v : "";
            });
          }
        }
        _ungrouped.push({
          _isGroup: true,
          _groupKey: groupKey,
          _members: members,
          _memberNames: names,
          _configIdx: key,
          theme: src.theme || "warning",
          icon: src.icon,
          priority: src.priority || 3,
          message: msg,
          entity: undefined,
        });
      } else {
        _ungrouped.push(...members);
      }
    }
    if (_groupBuckets.size > 0) {
      _ungrouped.sort((a, b) => (a.priority || 3) - (b.priority || 3));
      active = _ungrouped;
    }
    // --- end grouping pass ---

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
      const _hasWSlide = !!(this._config?.show_widget_in_cycle && this._config?.clear_display_mode && this._config.clear_display_mode !== 'message');
      const _totalSlides = (this._activeAlerts?.length || 0) + (_hasWSlide ? 1 : 0);
      if (!this._activeAlerts || _totalSlides <= 1 || this._historyOpen || (this._config && this._config.test_mode)) return;
      // If currently on the weather_forecast widget slide, wait until the forecast panel
      // has been shown at least once before advancing to the next alert
      const _onWidgetSlide = _hasWSlide && this._currentIndex === _totalSlides - 1;
      if (_onWidgetSlide && this._config?.clear_display_mode === "weather_forecast" && !this._wfForecastShown) return;
      // 1. Fold out
      this._animPhase = "fold-out";
      this.requestUpdate();
      // 2. Mid-fold: swap content
      setTimeout(() => {
        const nextIndex = (this._currentIndex + 1) % _totalSlides;
        this._currentIndex = nextIndex;
        // Entering the widget slide: reset forecast flip so weather always shows first
        if (_hasWSlide && nextIndex === _totalSlides - 1 && this._config?.clear_display_mode === "weather_forecast") {
          this._wfForecastShown = false;
          this._stopWfFlipTimer();
          this._startWfFlipTimer();
        }
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

  _tickClock() {
    const clearMode = this._config?.clear_display_mode;
    if ((this._config?.show_when_clear || this._config?.show_widget_in_cycle) &&
        (clearMode === "clock" || clearMode === "weather_clock" || clearMode === "weather_forecast")) {
      const n = new Date();
      if (this._config?.clear_clock_12h) {
        const h = n.getHours();
        const h12 = h % 12 || 12;
        const ampm = h < 12 ? "AM" : "PM";
        this._clockTime = `${h12}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')} ${ampm}`;
      } else {
        this._clockTime = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
      }
      const lang = this._hass?.language || 'en';
      this._clockDate = n.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' });
    }
  }

  _startTimerTick() {
    if (this._timerInterval) return;
    // Populate clock immediately so it shows on first render without waiting 1 s
    this._tickClock();
    this._timerInterval = setInterval(() => {
      const _timerThemes = new Set(["countdown", "hourglass", "timer_pulse", "timer_ring"]);
      const hasTimer = this._activeAlerts &&
        this._activeAlerts.some((a) => {
          if (!a.entity) return false;
          if (a.entity.startsWith("timer.")) return true;
          return _timerThemes.has(a.theme) &&
            this._hass?.states[a.entity]?.attributes?.device_class === "timestamp";
        });
      if (hasTimer) this.requestUpdate();
      // Update clock every second
      this._tickClock();
      // Re-evaluate once per minute for time_range conditions
      const now = new Date();
      if (now.getSeconds() === 0) {
        const alerts = this._config && this._config.alerts;
        if (Array.isArray(alerts) && alerts.some((a) => a.time_range && (a.time_range.from || a.time_range.to))) {
          this._computeActiveAlerts();
        }
      }
    }, 1000);
  }

  _stopTimerTick() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }

  // ---- Weather helpers (ported from person-tracker-card) --------------------

  _updateWeather(hass) {
    const entity = this._config?.clear_weather_entity;
    const mode = this._config?.clear_display_mode;
    const needsForecast = mode === "forecast" || mode === "weather_forecast";
    const needsWeather  = mode === "weather" || mode === "weather_clock" || mode === "weather_forecast";
    if (!entity || (!needsForecast && !needsWeather)) {
      this._weatherState = null;
      this._weatherTemp = null;
      this._weatherWind = null;
      this._weatherHumidity = null;
      if (this._forecastUnsub) { try { this._forecastUnsub(); } catch (_) {} this._forecastUnsub = null; this._forecastEntity = null; }
      this._stopWfFlipTimer();
      return;
    }
    const ws = hass.states[entity];
    if (!ws) return;
    // Fetch current weather data when needed
    if (needsWeather) {
      const temp = ws.attributes?.temperature;
      const unit = ws.attributes?.temperature_unit || "°";
      this._weatherState    = ws.state;
      this._weatherTemp     = temp != null ? `${Math.round(temp)}${unit}` : null;
      const windSpeed       = ws.attributes?.wind_speed;
      const windUnit        = ws.attributes?.wind_speed_unit || "km/h";
      this._weatherWind     = windSpeed != null ? `${Math.round(windSpeed)} ${windUnit}` : null;
      const humidity        = ws.attributes?.humidity;
      this._weatherHumidity = humidity != null ? `${Math.round(humidity)}%` : null;
    }
    // Subscribe to forecast data when needed
    if (needsForecast && entity !== this._forecastEntity) {
      this._forecastEntity = entity;
      this._subscribeForecast(entity, hass);
    }
    // Manage the flip timer for weather_forecast mode
    if (mode === "weather_forecast") {
      this._startWfFlipTimer();
    } else {
      this._stopWfFlipTimer();
    }
  }

  _startWfFlipTimer() {
    if (this._wfFlipTimer) return;
    const ms = ((this._config?.weather_forecast_interval) || 5) * 1000;
    this._wfFlipTimer = setInterval(() => {
      this._wfShowForecast = !this._wfShowForecast;
      if (this._wfShowForecast) this._wfForecastShown = true;
    }, ms);
  }

  _stopWfFlipTimer() {
    if (this._wfFlipTimer) { clearInterval(this._wfFlipTimer); this._wfFlipTimer = null; }
    this._wfShowForecast = false;
    this._wfForecastShown = false;
  }

  _subscribeForecast(entity, hass) {
    const h = hass || this._hass;
    // Unsubscribe previous entity if any
    if (this._forecastUnsub) {
      try { this._forecastUnsub(); } catch (_) {}
      this._forecastUnsub = null;
    }
    if (!h?.connection || !entity) return;
    const unit = h.states[entity]?.attributes?.temperature_unit || "°C";
    // weather/subscribe_forecast is the correct API since HA 2023.9
    // Returns an unsubscribe function; callback receives { type, forecast: [...] }
    try {
      this._forecastUnsub = h.connection.subscribeMessage(
        (event) => {
          const list = event?.forecast || [];
          this._forecastData = list.map((d) => ({ ...d, _unit: unit }));
        },
        { type: "weather/subscribe_forecast", forecast_type: "daily", entity_id: entity }
      );
    } catch (_) {
      this._forecastData = [];
    }
  }

  _rng(seed) {
    let s = 0;
    for (let i = 0; i < seed.length; i++) s = ((s * 31) + seed.charCodeAt(i)) | 0;
    s = s || 12345;
    return () => { s = Math.imul(s, 1664525) + 1013904223 | 0; return (s >>> 0) / 0xffffffff; };
  }

  _renderWeatherBg() {
    if (!this._weatherState) return html``;
    const state = this._weatherState;
    const isNight = this._hass?.states['sun.sun']?.state === 'below_horizon';
    const bgClass = `weather-bg weather-bg--${state}${isNight ? ' weather-bg--night' : ''}`;
    const r = this._rng(state + (isNight ? '_n' : '_d'));
    let particles;
    if (state === 'sunny' && !isNight)           particles = this._wSun(r);
    else if (state === 'clear-night' || (isNight && state === 'sunny')) particles = this._wStars(18, r, true);
    else if (state === 'partlycloudy')           particles = isNight ? html`${this._wStars(8,r,true)}${this._wClouds(2,r,'night')}` : html`${this._wSun(r)}${this._wClouds(2,r,'day')}`;
    else if (state === 'cloudy')                 particles = this._wClouds(5, r, 'grey');
    else if (state === 'fog')                    particles = this._wFog(r);
    else if (state === 'windy' || state === 'windy-variant') particles = this._wWind(10, r);
    else if (state === 'rainy')                  particles = html`${this._wClouds(4,r,'dark')}${this._wRain(26,r,false)}`;
    else if (state === 'snowy-rainy')            particles = html`${this._wClouds(4,r,'dark')}${this._wRain(18,r,false)}${this._wSnow(8,r)}`;
    else if (state === 'pouring')                particles = html`${this._wClouds(5,r,'dark')}${this._wRain(40,r,true)}`;
    else if (state === 'snowy')                  particles = html`${this._wClouds(3,r,'grey')}${this._wSnow(18,r)}`;
    else if (state === 'hail')                   particles = html`${this._wClouds(4,r,'dark')}${this._wHail(22,r)}`;
    else if (state === 'lightning')              particles = html`${this._wClouds(5,r,'storm')}${this._wRain(22,r,false)}${this._wLightning(r)}`;
    else if (state === 'lightning-rainy')        particles = html`${this._wClouds(5,r,'storm')}${this._wRain(36,r,true)}${this._wLightning(r)}`;
    else if (state === 'exceptional')            particles = this._wExceptional(r);
    else                                         particles = html``;
    return html`<div class="${bgClass}">${particles}</div>`;
  }

  _wSun(r) {
    const rc = 18;
    const rays = Array.from({length: rc}, (_, i) => {
      const angle = (360/rc)*i, len=r()*55+55, dist=r()*10+52, w=r()*1.5+1.5, op=r()*0.4+0.2;
      return html`<div class="sun-ray" style="width:${w.toFixed(1)}px;height:${len.toFixed(0)}px;transform:rotate(${angle}deg) translateX(-50%) translateY(${dist.toFixed(0)}px);opacity:${op.toFixed(2)}"></div>`;
    });
    return html`<div class="w-sun"><div class="sun-halo"></div><div class="sun-rays-wrap">${rays}</div><div class="sun-core"></div></div>`;
  }

  _wStars(count, r, withMoon=false) {
    const tC=['t0','t1','t2','t3','t4'];
    const stars = Array.from({length:count}, () => {
      const size=r()*1.7+0.8, top=r()*(withMoon?70:78)+2, left=r()*94+3, delay=r()*5, tc=tC[Math.floor(r()*5)];
      const sh=`0 0 ${(size*2).toFixed(1)}px rgba(220,220,255,${(r()*0.5+0.3).toFixed(2)})`;
      return html`<div class="w-star ${tc}" style="width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;top:${top.toFixed(1)}%;left:${left.toFixed(1)}%;animation-delay:${delay.toFixed(1)}s;box-shadow:${sh}"></div>`;
    });
    let moon=html``, aurora=html``, shootingStar=html``;
    if (withMoon) {
      const craters = [[22,25,14,12],[40,55,8,7],[55,30,6,5]].map(([l,t,w,h]) => html`<div class="moon-crater" style="left:${l}%;top:${t}%;width:${w}px;height:${h}px"></div>`);
      moon = html`<div class="w-moon">${craters}</div>`;
      const aC=['rgba(0,255,130,.18)','rgba(0,160,255,.14)','rgba(140,0,255,.12)','rgba(0,255,200,.10)'];
      const ribbons = aC.map((bg,i) => {
        const top=8+i*9, h=120+Math.floor(r()*60), anim=i%2===0?'auroraWave':'auroraWave2', dur=7+i*2.3, delay=i*1.5;
        return html`<div class="aurora-ribbon" style="top:${top}%;height:${h}px;background:${bg};animation:${anim} ${dur}s ${delay}s ease-in-out infinite"></div>`;
      });
      aurora = html`<div class="w-aurora">${ribbons}</div>`;
      shootingStar = html`<div class="w-shooting-star" style="animation-delay:${(r()*3).toFixed(1)}s"></div>`;
    }
    return html`<div style="position:absolute;inset:0;pointer-events:none">${moon}${aurora}${shootingStar}${stars}</div>`;
  }

  _wClouds(count, r, variant='day') {
    const cfgs=[{top:6,left:8,w:200,h:70,delay:0,anim:'cloudFloat',op:.88},{top:2,left:38,w:260,h:85,delay:1.5,anim:'cloudFloat2',op:.78},{top:10,left:60,w:180,h:65,delay:.8,anim:'cloudFloat3',op:.82},{top:18,left:20,w:140,h:50,delay:2,anim:'cloudFloat',op:.65},{top:4,left:74,w:150,h:55,delay:3,anim:'cloudFloat2',op:.7}];
    const bb={day:'rgba(255,255,255,.9)',night:'rgba(40,55,90,.8)',grey:'rgba(120,130,145,.75)',dark:'rgba(30,35,55,.85)',storm:'rgba(20,15,40,.9)'}[variant]||'rgba(255,255,255,.9)';
    const take=Math.min(count,cfgs.length);
    return html`<div style="position:absolute;inset:0;pointer-events:none">${Array.from({length:take},(_,i)=>{
      const c=cfgs[i],dur=12+i*3+Math.floor(r()*5);
      return html`<div class="w-cloud" style="top:${c.top}%;left:${c.left}%;animation:${c.anim} ${dur}s ${c.delay}s ease-in-out infinite"><div class="cloud-body w-cloud-${variant}" style="width:${c.w}px;height:${c.h}px;opacity:${c.op}"><div style="position:absolute;top:-40%;left:18%;width:${(c.w*.45).toFixed(0)}px;height:${(c.h*1.1).toFixed(0)}px;border-radius:50%;background:${bb}"></div><div style="position:absolute;top:-55%;left:48%;width:${(c.w*.38).toFixed(0)}px;height:${(c.h*1.3).toFixed(0)}px;border-radius:50%;background:${bb}"></div></div></div>`;
    })}</div>`;
  }

  _wFog(r) {
    const bands=[{top:15,h:55,op:.22,dur:18,delay:0,anim:'fogDrift'},{top:30,h:45,op:.28,dur:22,delay:-5,anim:'fogDrift2'},{top:42,h:60,op:.32,dur:15,delay:-3,anim:'fogDrift'},{top:55,h:50,op:.35,dur:25,delay:-8,anim:'fogDrift2'},{top:65,h:65,op:.38,dur:20,delay:-2,anim:'fogDrift'},{top:75,h:70,op:.42,dur:17,delay:-10,anim:'fogDrift2'},{top:82,h:80,op:.5,dur:14,delay:-4,anim:'fogDrift'},{top:88,h:90,op:.55,dur:28,delay:-6,anim:'fogDrift2'}];
    return html`<div style="position:absolute;inset:0;pointer-events:none">${bands.map(b=>{const blur=Math.floor(r()*17)+18;return html`<div class="w-fog-band" style="top:${b.top}%;height:${b.h}px;background:linear-gradient(to right,transparent,rgba(195,208,220,${b.op}) 30%,rgba(195,208,220,${b.op}) 70%,transparent);filter:blur(${blur}px);animation:${b.anim} ${b.dur}s ${b.delay}s ease-in-out infinite"></div>`;})}</div>`;
  }

  _wWind(count, r) {
    const pal=['255,255,255','200,240,235','180,230,225'];
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length:count},()=>{
      const w=r()*160+60,top=r()*87+5,dur=r()*1.8+1.4,delay=r()*4,op=(r()*0.37+0.18).toFixed(2),col=pal[Math.floor(r()*pal.length)],rgba=`rgba(${col},${op})`,h=(r()*1.5+1).toFixed(1),blur=(r()+0.5).toFixed(1);
      return html`<div class="w-wind-line" style="top:${top.toFixed(1)}%;width:${w.toFixed(0)}px;height:${h}px;background:linear-gradient(to right,transparent,${rgba} 40%,${rgba} 80%,transparent);filter:blur(${blur}px);animation:windSweep ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    })}</div>`;
  }

  _wRain(count, r, heavy=false) {
    const drops=Array.from({length:count},()=>{
      const w=r()*(heavy?1:0.5)+1,h=r()*(heavy?20:14)+(heavy?25:14),left=r()*100,dur=r()*(heavy?0.35:0.6)+(heavy?0.55:0.8),delay=r()*2,op=(r()*0.4+0.35).toFixed(2);
      return html`<div class="w-rain-drop" style="left:${left.toFixed(1)}%;width:${w.toFixed(1)}px;height:${h.toFixed(0)}px;opacity:${op};animation:${heavy?'rainFallHeavy':'rainFall'} ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    });
    const splashes=Array.from({length:6},()=>{const left=r()*85+5,size=r()*12+8,delay=r(),dur=r()*0.4+0.4;return html`<div class="w-splash" style="left:${left.toFixed(1)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;animation-delay:${delay.toFixed(2)}s;animation-duration:${dur.toFixed(2)}s"></div>`;});
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden"><div class="rain-atmosphere"></div>${drops}${splashes}</div>`;
  }

  _wSnow(count, r) {
    const flakes=['❄','❅','❆','✻','✼'];
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length:count},()=>{
      const size=r()*16+10,left=r()*100,dur=r()*6+4,delay=r()*6,sx=r()*120-60,sr=(r()*280+120)*(r()>0.5?1:-1),ch=flakes[Math.floor(r()*flakes.length)];
      return html`<div class="w-snowflake" style="left:${left.toFixed(1)}%;font-size:${size.toFixed(0)}px;--sx:${sx.toFixed(0)}px;--sr:${sr.toFixed(0)}deg;animation-duration:${dur.toFixed(1)}s;animation-delay:-${delay.toFixed(1)}s">${ch}</div>`;
    })}<div class="snow-ground"></div></div>`;
  }

  _wHail(count, r) {
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length:count},()=>{
      const size=r()*7+5,left=r()*100,dur=r()*0.3+0.45,delay=r()*2.5,hx=r()*60-30;
      return html`<div class="w-hail-drop" style="left:${left.toFixed(1)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;--hx:${hx.toFixed(0)}px;animation:hailFall ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    })}</div>`;
  }

  _wLightning(r) {
    const bolts=Array.from({length:2},(_,b)=>{
      const left=20+b*35,dur=(r()*2.5+2.5).toFixed(1),delay=b*1.8,steps=Math.floor(r()*5)+7;
      let d=`M 35 0`,x=35,y=0;
      for(let i=0;i<steps;i++){x+=r()*36-18;y+=200/steps;d+=` L ${x.toFixed(1)} ${y.toFixed(1)}`;if(r()<0.4&&i<steps-2){const bx=x+r()*50-25,by=y+r()*30+20;d+=` M ${x.toFixed(1)} ${y.toFixed(1)} L ${bx.toFixed(1)} ${by.toFixed(1)} M ${x.toFixed(1)} ${y.toFixed(1)}`;}}
      return html`<div class="w-lightning-bolt" style="top:0;left:${left}%;animation:boltFlash ${dur}s ${delay}s ease-in-out infinite"><svg width="70" height="200" viewBox="0 0 70 200" class="bolt-svg"><path d="${d}" stroke="rgba(200,160,255,.3)" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#d0b0ff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
    });
    const fd=(r()*2.5+2.5).toFixed(1);
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden"><div class="w-sky-flash" style="animation-duration:${fd}s"></div>${bolts}</div>`;
  }

  _wExceptional(r) {
    const particles=Array.from({length:30},()=>{
      const size=r()*6+2,dr=r()*70+20,dur=r()*5+3,delay=r()*5,angle=r()*360,rc=Math.floor(r()*55)+200,gc=Math.floor(r()*80)+80,bc=Math.floor(r()*50)+10,op=(r()*0.4+0.3).toFixed(2),blur=r().toFixed(1);
      return html`<div class="w-exceptional-particle" style="top:60%;left:50%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;--dr:${dr.toFixed(0)}px;filter:blur(${blur}px);animation:dustSwirl ${dur.toFixed(1)}s ${delay.toFixed(1)}s linear infinite;transform:rotate(${angle.toFixed(0)}deg);background:rgba(${rc},${gc},${bc},${op})"></div>`;
    });
    const windLines=Array.from({length:12},()=>{const dur=r()*1.5+1,top=r()*80+10,op=(r()*0.23+0.12).toFixed(2),w=r()*140+40,h=(r()+1).toFixed(1),delay=(r()*3).toFixed(1),rgba=`rgba(255,160,80,${op})`;return html`<div class="w-wind-line" style="top:${top.toFixed(1)}%;width:${w.toFixed(0)}px;height:${h}px;background:linear-gradient(to right,transparent,${rgba} 40%,${rgba} 75%,transparent);filter:blur(1px);animation:windSweep ${dur.toFixed(2)}s ${delay}s linear infinite"></div>`;});
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(255,100,20,.08) 0%,transparent 60%)"></div>${particles}${windLines}</div>`;
  }

  _renderForecastWidget() {
    const days = (this._forecastData || []).slice(0, 7);
    if (!days.length) {
      return html`
        <div class="atc-clear-widget atc-clear-forecast atc-clear-forecast--empty">
          <ha-icon icon="mdi:calendar-week" style="--mdc-icon-size:28px;opacity:0.3;margin-right:8px"></ha-icon>
          <span style="opacity:0.45;font-size:0.85rem">${this._t("clear_weather_entity_label")}</span>
        </div>`;
    }
    const haLang = this._hass?.language || "en";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Pick accent color from today's condition
    const todayCondition = days[0]?.condition || "";
    const COND_COLOR = {
      sunny: "#ffb300", "clear-night": "#7c83c8", partlycloudy: "#78a0c8",
      cloudy: "#8096a8", fog: "#a0aeb6", windy: "#38b8a0", "windy-variant": "#38b8a0",
      rainy: "#5080d8", "snowy-rainy": "#78a0d8", pouring: "#3060c8",
      snowy: "#90b8e0", hail: "#607080", lightning: "#9060e8", "lightning-rainy": "#7050d0",
      exceptional: "#e05028",
    };
    const accentColor = COND_COLOR[todayCondition] || "#5090d8";

    const WEATHER_EMOJI = {
      sunny: "☀️", "clear-night": "🌙", partlycloudy: "⛅", cloudy: "☁️",
      fog: "🌫️", windy: "💨", "windy-variant": "🌬️", rainy: "🌧️",
      "snowy-rainy": "🌨️", pouring: "⛈️", snowy: "❄️", hail: "🌩️",
      lightning: "⚡", "lightning-rainy": "🌩️", exceptional: "🌪️",
    };

    const tempColor = (t) => {
      if (t == null) return "rgba(255,255,255,0.75)";
      if (t >= 35) return "#ff6d00";
      if (t >= 28) return "#ffab40";
      if (t >= 20) return "#ffd54f";
      if (t >= 10) return "#ffffff";
      if (t >= 0)  return "#80d8ff";
      return "#ea80fc";
    };

    const todayLabel = this._t("today") || "Today";
    const fmtDay = (dateStr, idx) => {
      if (idx === 0) return todayLabel.toUpperCase();
      try {
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat(haLang, { weekday: "short" }).format(d).toUpperCase();
      } catch (_) {
        return dateStr?.slice(0, 3).toUpperCase() || "---";
      }
    };

    const cols = days.map((day, idx) => {
      const isToday = idx === 0;
      const emoji = WEATHER_EMOJI[day.condition] || "🌡️";
      const hi = day.temperature != null ? Math.round(day.temperature) : null;
      const lo = day.templow != null ? Math.round(day.templow) : null;
      const precip = day.precipitation_probability != null ? Math.round(day.precipitation_probability) : null;
      const dayLabel = fmtDay(day.datetime, idx);
      let dateLabel = "";
      try {
        const d = new Date(day.datetime);
        dateLabel = new Intl.DateTimeFormat(haLang, { day: "numeric", month: "short" }).format(d);
      } catch (_) {}

      return html`
        <div class="atc-fw-day${isToday ? " atc-fw-day--today" : ""}">
          <div class="atc-fw-dayname">${dayLabel}</div>
          <div class="atc-fw-emoji${isToday ? " atc-fw-emoji--today" : ""}">${emoji}</div>
          <div class="atc-fw-temps">
            ${hi != null ? html`<span class="atc-fw-hi" style="color:${tempColor(hi)}">${hi}°</span>` : ""}
            ${lo != null ? html`<span class="atc-fw-lo" style="color:${tempColor(lo)}">${lo}°</span>` : ""}
          </div>
          ${dateLabel ? html`<div class="atc-fw-date">${dateLabel}</div>` : ""}
          ${precip != null && precip >= 20 ? html`
          <div class="atc-fw-precip">
            <div class="atc-fw-precip-bar"><div class="atc-fw-precip-fill" style="height:${precip}%"></div></div>
            <span class="atc-fw-precip-pct">${precip}%</span>
          </div>` : ""}
        </div>`;
    });

    return html`
      <div class="atc-clear-widget atc-clear-forecast" style="--fw-accent:${accentColor}">
        <div class="atc-fw-bg-pulse"></div>
        <div class="atc-fw-grid">${cols}</div>
      </div>`;
  }

  _renderClearWidget() {
    const mode     = this._config.clear_display_mode || "message";
    if (mode === "message") return null;
    if (mode === "forecast") return this._renderForecastWidget();
    const showDate = this._config.clear_clock_show_date !== false;
    const datePos  = this._config.clear_clock_date_position || "below";
    const ICON_MAP = {
      'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','partlycloudy':'mdi:weather-partly-cloudy',
      'cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant',
      'rainy':'mdi:weather-rainy','snowy-rainy':'mdi:weather-snowy-rainy','pouring':'mdi:weather-pouring',
      'snowy':'mdi:weather-snowy','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning',
      'lightning-rainy':'mdi:weather-lightning-rainy','exceptional':'mdi:alert-circle-outline',
    };
    const clockStyle   = this._config.clear_clock_style   || "default";
    const weatherStyle = this._config.clear_weather_style || "default";
    if (mode === "clock") {
      return html`
        <div class="atc-clear-widget atc-clear-clock atc-ck-style--${clockStyle}">
          <div class="atc-ck-bg"></div>
          <div class="atc-ck-glow"></div>
          <div class="atc-ck-content">
            ${showDate && datePos === "above" && this._clockDate ? html`<div class="atc-ck-date">${this._clockDate}</div>` : ""}
            <div class="atc-ck-time">${this._clockTime || "00:00:00"}</div>
            ${showDate && datePos !== "above" && this._clockDate ? html`<div class="atc-ck-date">${this._clockDate}</div>` : ""}
          </div>
        </div>`;
    }
    if (mode === "weather" || mode === "weather_clock" || mode === "weather_forecast") {
      if (!this._weatherState) {
        return html`
          <div class="atc-clear-widget atc-clear-clock">
            <ha-icon icon="mdi:weather-cloudy" style="--mdc-icon-size:26px;opacity:0.35;margin-right:8px"></ha-icon>
            <span style="opacity:0.45;font-size:0.85rem">${this._t("clear_weather_entity_label")}</span>
          </div>`;
      }
      const icon = ICON_MAP[this._weatherState] || 'mdi:weather-cloudy';
      const conditionLabel = this._t(`weather.${this._weatherState}`) || this._weatherState || "";
      const weatherPanel = html`
        <div class="atc-clear-widget atc-clear-weather atc-cw-style--${weatherStyle}">
          ${this._renderWeatherBg()}
          <div class="atc-cw-corners">
            <div class="atc-cw-badge atc-cw-badge--weather">
              <div class="atc-cw-badge-row1">
                <ha-icon icon="${icon}" class="atc-cw-w-icon"></ha-icon>
                <span class="atc-cw-temp">${this._weatherTemp || ""}</span>
              </div>
              ${(this._weatherWind || this._weatherHumidity) ? html`
              <div class="atc-cw-badge-row2">
                ${this._weatherWind ? html`<span class="atc-cw-meta">💨 ${this._weatherWind}</span>` : ""}
                ${this._weatherHumidity ? html`<span class="atc-cw-meta">💧 ${this._weatherHumidity}</span>` : ""}
              </div>` : ""}
              <div class="atc-cw-badge-row3">
                <span class="atc-cw-condition">${conditionLabel}</span>
              </div>
            </div>
            ${(mode === "weather_clock" || mode === "weather_forecast") ? html`
            <div class="atc-cw-badge atc-cw-badge--clock">
              ${showDate && (this._config.clear_clock_date_position === "above") && this._clockDate ? html`<span class="atc-cw-clock-date">${this._clockDate}</span>` : ""}
              <span class="atc-cw-clock">${this._clockTime || "00:00:00"}</span>
              ${showDate && (this._config.clear_clock_date_position !== "above") && this._clockDate ? html`<span class="atc-cw-clock-date">${this._clockDate}</span>` : ""}
            </div>` : ""}
          </div>
        </div>`;
      if (mode === "weather_forecast") {
        const sf = this._wfShowForecast;
        return html`
          <div class="atc-wf-wrap">
            <div class="atc-wf-slot ${sf ? "atc-wf-slot--out" : "atc-wf-slot--in"}">${weatherPanel}</div>
            <div class="atc-wf-slot ${sf ? "atc-wf-slot--in" : "atc-wf-slot--out"}">${this._renderForecastWidget()}</div>
          </div>`;
      }
      return weatherPanel;
    }
    return null;
  }

  // ---- Timer data helper ----------------------------------------------------

  _getTimerData(alert) {
    const es = this._hass && this._hass.states[alert.entity];
    if (!es) return { progress: 1, remainingStr: "--:--", isActive: false };

    // device_class: timestamp — state IS the expiry datetime (e.g. Alexa Media Player timers).
    // Total duration is unknown, so we record the first observed remainingSec as the total.
    if (es.attributes.device_class === "timestamp") {
      const raw = es.state;
      if (!raw || ["unavailable", "unknown", "none", ""].includes(raw)) {
        this._tsTimerTotals.delete(alert.entity);
        return { progress: -1, remainingStr: "--:--", isActive: false };
      }
      const remainingMs = new Date(raw).getTime() - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      if (remainingSec === 0) {
        this._tsTimerTotals.delete(alert.entity);
        return { progress: -1, remainingStr: "00:00", isActive: false };
      }
      // Update total if this is a new/longer timer
      const stored = this._tsTimerTotals.get(alert.entity);
      if (!stored || remainingSec > stored) this._tsTimerTotals.set(alert.entity, remainingSec);
      const total = this._tsTimerTotals.get(alert.entity);
      const progress = Math.min(1, remainingSec / total);
      const h = Math.floor(remainingSec / 3600);
      const m = Math.floor((remainingSec % 3600) / 60).toString().padStart(2, "0");
      const s = (remainingSec % 60).toString().padStart(2, "0");
      const remainingStr = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
      return { progress, remainingStr, isActive: true, remainingSec };
    }

    const isActive = es.state === "active";
    if (!isActive) return { progress: 0, remainingStr: "00:00", isActive: false };
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

  /**
   * Returns the translated/formatted state value for {state} substitution.
   * Uses HA's built-in formatEntityState / formatEntityAttributeValue when
   * available (HA 2023.3+) so the user sees localised strings like
   * "Acceso", "Spento", "22.5 °C" instead of raw "on", "off", "22.5".
   * Falls back to the raw value on older HA versions.
   */
  _formatStateValue(es, attribute) {
    if (!es) return "";
    if (attribute != null && attribute !== "") {
      if (this._hass && this._hass.formatEntityAttributeValue) {
        try {
          const v = this._hass.formatEntityAttributeValue(es, attribute);
          if (v != null) return String(v);
        } catch (_) { /* fall through */ }
      }
      return String(this._resolveAttrPath(es.attributes, attribute) ?? "");
    }
    if (this._hass && this._hass.formatEntityState) {
      try {
        const v = this._hass.formatEntityState(es);
        if (v != null) return String(v);
      } catch (_) { /* fall through */ }
    }
    return es.state;
  }

  /**
   * Subscribes a template string to HA's render_template WebSocket endpoint.
   * Results are cached in _tmplCache; each update triggers requestUpdate().
   * Falls back silently to the mini-evaluator if the connection is unavailable.
   */
  _subscribeTemplate(tmpl) {
    if (this._tmplUnsubs.has(tmpl)) return;
    const conn = this._hass && this._hass.connection;
    if (!conn || !conn.subscribeMessage) return;
    // Mark as pending so we don't re-subscribe on the next render
    this._tmplUnsubs.set(tmpl, () => {});
    conn.subscribeMessage(
      (msg) => {
        if (msg && msg.result !== undefined) {
          this._tmplCache.set(tmpl, String(msg.result));
          this.requestUpdate();
        }
      },
      { type: "render_template", template: tmpl, variables: {}, strict: false }
    ).then(unsub => {
      this._tmplUnsubs.set(tmpl, unsub);
    }).catch(err => {
      console.warn("[AlertTicker] Template render error:", err);
      this._tmplCache.set(tmpl, `[template error]`);
      this._tmplUnsubs.delete(tmpl);
    });
  }

  /**
   * Collects all template strings (messages/secondary_text containing {{ }})
   * from the current config and keeps subscriptions in sync.
   */
  _syncTemplates() {
    const needed = new Set();
    for (const alert of this._config?.alerts || []) {
      if ((alert.message || "").includes("{{")) needed.add(alert.message);
      if ((alert.secondary_text || "").includes("{{")) needed.add(alert.secondary_text);
      if ((alert.group_message || "").includes("{{")) needed.add(alert.group_message);
      if ((alert.group_expanded_message || "").includes("{{")) needed.add(alert.group_expanded_message);
    }
    // Unsubscribe stale
    for (const [tmpl, unsub] of this._tmplUnsubs) {
      if (!needed.has(tmpl)) {
        try { unsub(); } catch (_) {}
        this._tmplUnsubs.delete(tmpl);
        this._tmplCache.delete(tmpl);
      }
    }
    // Subscribe new
    for (const tmpl of needed) {
      if (!this._tmplUnsubs.has(tmpl)) this._subscribeTemplate(tmpl);
    }
  }

  /**
   * Evaluates a single Jinja2-lite expression pulled from {{ ... }}.
   * Supported: states('id'), state_attr('id','attr'), is_state('id','val'),
   * and pipe filters: | round(n), | int, | float, | upper, | lower, | default('x').
   * Returns the result string, or null if the expression is not recognised.
   * Used as immediate fallback while the WS subscription is pending.
   */
  _evalJinjaExpr(expr) {
    const hass = this._hass;
    if (!hass) return null;
    const parts = expr.split("|");
    const base = parts[0].trim();
    const filters = parts.slice(1).map(f => f.trim());

    let val = null;

    // states('entity_id')
    let m = base.match(/^states\(\s*['"]([^'"]+)['"]\s*\)$/);
    if (m) {
      const es = hass.states[m[1]];
      val = es ? this._formatStateValue(es, null) : "unknown";
    }

    // state_attr('entity_id', 'attribute')
    if (val === null) {
      m = base.match(/^state_attr\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)$/);
      if (m) {
        const es = hass.states[m[1]];
        val = es ? String(this._resolveAttrPath(es.attributes, m[2]) ?? "") : "";
      }
    }

    // is_state('entity_id', 'value')
    if (val === null) {
      m = base.match(/^is_state\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)$/);
      if (m) {
        const es = hass.states[m[1]];
        val = es && es.state === m[2] ? "true" : "false";
      }
    }

    if (val === null) return null;

    // Apply pipe filters
    for (const f of filters) {
      const rm = f.match(/^round\((\d+)\)$/);
      if (rm) { val = String(parseFloat(val).toFixed(parseInt(rm[1]))); continue; }
      if (f === "int") { val = String(parseInt(val, 10)); continue; }
      if (f === "float") { val = String(parseFloat(val)); continue; }
      if (f === "upper") { val = String(val).toUpperCase(); continue; }
      if (f === "lower") { val = String(val).toLowerCase(); continue; }
      const dm = f.match(/^default\(\s*['"]?([^'"]*?)['"]?\s*\)$/);
      if (dm) { if (!val || val === "unknown" || val === "unavailable") val = dm[1]; continue; }
    }

    return val;
  }

  _resolveMessage(alert) {
    let msg = alert.message || "";
    if (!msg.includes("{")) return msg;

    // Pre-substitute {entity}/{state}/{name}/{device} BEFORE passing to HA's template engine,
    // so that patterns like {{ area_name('{entity}') }} receive the real entity ID.
    if (msg.includes("{{") && alert.entity && this._hass) {
      const es = this._hass.states[alert.entity];
      if (es) {
        const translatedState = this._formatStateValue(es, alert.attribute);
        const name = es.attributes.friendly_name || alert.entity;
        msg = msg
          .replace(/\{state\}/g, translatedState)
          .replace(/\{name\}/g, name)
          .replace(/\{entity\}/g, alert.entity);
      }
      if (msg.includes("{device}")) {
        const entityEntry = this._hass.entities?.[alert.entity];
        const deviceId = entityEntry?.device_id;
        const device = deviceId ? this._hass.devices?.[deviceId] : null;
        const deviceName = device?.name_by_user || device?.name || alert.entity;
        msg = msg.replace(/\{device\}/g, deviceName);
      }
    }

    // {{ ... }} Full HA template rendering via WebSocket render_template
    if (msg.includes("{{")) {
      const cached = this._tmplCache.get(msg);
      if (cached !== undefined) {
        // WS result available — use it (already fully rendered by HA)
        return cached;
      }
      // Not yet rendered — subscribe and use mini-evaluator as immediate fallback
      this._subscribeTemplate(msg);
      msg = msg.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (match, expr) => {
        const v = this._evalJinjaExpr(expr.trim());
        return v !== null ? v : match;
      });
    }

    // {timer} — live countdown for timer.* entities
    if (msg.includes("{timer}")) {
      const { remainingStr } = this._getTimerData(alert);
      msg = msg.replace(/\{timer\}/g, remainingStr);
    }
    // {state}, {name}, {entity}, {device} — live entity values (for messages without {{ }})
    if (alert.entity && this._hass && (msg.includes("{state}") || msg.includes("{name}") || msg.includes("{entity}") || msg.includes("{device}"))) {
      const es = this._hass.states[alert.entity];
      if (es) {
        const translatedState = this._formatStateValue(es, alert.attribute);
        const name = es.attributes.friendly_name || alert.entity;
        msg = msg
          .replace(/\{state\}/g, translatedState)
          .replace(/\{name\}/g, name)
          .replace(/\{entity\}/g, alert.entity);
      }
      // {device} — resolved from the device registry (hass.entities + hass.devices)
      if (msg.includes("{device}")) {
        const entityEntry = this._hass.entities?.[alert.entity];
        const deviceId = entityEntry?.device_id;
        const device = deviceId ? this._hass.devices?.[deviceId] : null;
        const deviceName = device?.name_by_user || device?.name || alert.entity;
        msg = msg.replace(/\{device\}/g, deviceName);
      }
    }
    return msg;
  }

  _timerColor(progress) {
    if (progress < 0) return "var(--info-color, #039be5)"; // unknown total (timestamp sensor)
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
      const re = new RegExp("^" + pattern + "$");
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
   * Supports: exact string/array (=), != > < >= <= with numeric comparison,
   * contains / not_contains with case-insensitive substring matching.
   */
  _matchesState(entityStateValue, alert) {
    let trigger = alert.state;
    const operator = alert.operator || "=";

    // Legacy array form — treated as "is one of" regardless of operator
    if (Array.isArray(trigger)) {
      return trigger.map(String).includes(entityStateValue);
    }

    // Resolve {{ }} Jinja2 templates in the state value (e.g. states('input_number.threshold'))
    if (typeof trigger === "string" && trigger.includes("{{")) {
      const cached = this._tmplCache.get(trigger);
      if (cached !== undefined) {
        trigger = cached;
      } else {
        this._subscribeTemplate(trigger);
        const resolved = trigger.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (match, expr) => {
          const v = this._evalJinjaExpr(expr.trim());
          return v !== null ? v : match;
        });
        trigger = resolved;
      }
    }

    const triggerStr = String(trigger);

    if (operator === "=" || operator === "==") {
      return entityStateValue === triggerStr;
    }
    if (operator === "!=") {
      return entityStateValue !== triggerStr;
    }

    // Substring matching (case-insensitive)
    if (operator === "contains") {
      return entityStateValue.toLowerCase().includes(triggerStr.toLowerCase());
    }
    if (operator === "not_contains") {
      return !entityStateValue.toLowerCase().includes(triggerStr.toLowerCase());
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

  // ---- Persistent alarm helpers ---------------------------------------------

  _loadPersistent() {
    try {
      const raw = localStorage.getItem("atc-persistent");
      if (!raw) return;
      this._persistentLatched = new Set(JSON.parse(raw));
    } catch (_) {
      this._persistentLatched = new Set();
    }
  }

  _savePersistent() {
    try {
      localStorage.setItem("atc-persistent", JSON.stringify([...this._persistentLatched]));
    } catch (_) {}
  }

  _dismissPersistent(alert) {
    this._persistentLatched.delete(this._snoozeKey(alert));
    this._savePersistent();
    this._snoozeMenuOpen = null;
    // Use a sentinel that won't match "" (empty active list) so _computeActiveAlerts
    // doesn't early-return when the dismissed alert was the only one active.
    this._lastSignature = "__dismiss__";
    this._computeActiveAlerts();
  }

  // ---- History helpers ------------------------------------------------------

  /** Unique localStorage key per card instance, scoped to its entity IDs */
  get _historyKey() {
    const ids = (this._config?.alerts || [])
      .map(a => a.entity || "")
      .filter(Boolean)
      .sort()
      .join("|");
    return "atc-history" + (ids ? "-" + ids : "");
  }

  /** Load history from localStorage */
  _loadHistory() {
    try {
      const raw = localStorage.getItem(this._historyKey);
      if (raw) this._history = JSON.parse(raw);
    } catch (_) { this._history = []; }
  }

  /** Persist history to localStorage */
  _saveHistory() {
    try {
      localStorage.setItem(this._historyKey, JSON.stringify(this._history));
    } catch (_) {}
  }

  /** Record a new alert event into history */
  _recordHistory(alert) {
    const max = this._config.history_max_events || 50;
    const es = this._hass && alert.entity ? this._hass.states[alert.entity] : null;
    const entityName  = es ? (es.attributes.friendly_name || alert.entity) : (alert.entity || "");
    const entityState = es ? this._formatStateValue(es, alert.attribute || null) : null;
    let secondaryName = null, secondaryState = null;
    if (alert.secondary_entity) {
      const ses = this._hass && this._hass.states[alert.secondary_entity];
      if (ses) {
        secondaryName = ses.attributes.friendly_name || alert.secondary_entity;
        secondaryState = this._formatStateValue(ses, alert.secondary_attribute || null);
      }
    }
    const entry = {
      ts: Date.now(),
      message: this._resolveMessage(alert) || "",
      theme: alert.theme || "emergency",
      icon: (THEME_META[alert.theme] || {}).icon || "🔔",
      entity: alert.entity || "",
      entityName: entityName || null,
      entityState: entityState || null,
      secondaryName,
      secondaryState,
    };
    this._history.unshift(entry);
    if (this._history.length > max) this._history.length = max;
    this._saveHistory();

    // If message contains {{ }}, the WS result may not be cached yet.
    // Resolve async and patch the entry once HA responds.
    const raw = alert.message || "";
    if (!raw.includes("{{") || !this._hass?.connection) return;
    const cached = this._tmplCache?.get(raw);
    if (cached !== undefined) { entry.message = cached || entry.message; this._saveHistory(); return; }
    // Substitute {placeholders} before sending to HA engine
    let tpl = raw;
    if (es) {
      tpl = tpl
        .replace(/\{state\}/g,  this._formatStateValue(es, alert.attribute))
        .replace(/\{name\}/g,   es.attributes.friendly_name || alert.entity)
        .replace(/\{entity\}/g, alert.entity);
    }
    try {
      let unsubFn;
      const timer = setTimeout(() => { try { unsubFn?.(); } catch (_) {} }, 3000);
      this._hass.connection.subscribeMessage(
        (result) => {
          clearTimeout(timer);
          try { unsubFn?.(); } catch (_) {}
          const resolved = (result.result || "").replace(/\s+/g, " ").trim();
          if (resolved) { entry.message = resolved; this._saveHistory(); this.requestUpdate(); }
        },
        { type: "render_template", template: tpl, variables: {}, strict: false }
      ).then(u => {
        unsubFn = u;
        setTimeout(() => { try { u(); } catch (_) {} }, 500);
      }).catch(() => {});
    } catch (_) {}
  }

  /** Play an audio notification when an alert newly becomes active */
  _buildTtsFallback(alert) {
    const lang = (this._hass?.language || "en").split("-")[0].toLowerCase();
    const dict = TTS_PREFIXES[lang] || TTS_PREFIXES.en;
    const category = (THEME_META[alert.theme] || {}).category || "warning";
    const fn = dict[category] || dict._default;
    const es = alert.entity ? this._hass?.states[alert.entity] : null;
    const name = es?.attributes?.friendly_name || alert.entity || "";
    return fn(name);
  }

  _speakAlert(alert) {
    if (!alert.tts) return;
    if (this._config?.tts_enabled === false) return;
    if (!this._hass) return;
    // Build message: explicit tts_message > auto-generated from theme + entity name
    // The alert's message field is for the visual ticker; tts_message is for TTS.
    const message = alert.tts_message
      ? this._resolveMessage({ ...alert, message: alert.tts_message })
      : this._buildTtsFallback(alert);
    if (!message) return;
    // Notify path (Alexa, mobile, etc.) — takes priority when set
    const notifyService = alert.tts_notify_service || this._config?.tts_notify_service;
    if (notifyService) {
      const notifyType = alert.tts_notify_type || this._config?.tts_notify_type || "tts";
      try {
        this._hass.callService("notify", notifyService, {
          message,
          data: { type: notifyType },
        });
      } catch (_) {}
      return;
    }
    // Standard tts.speak path
    const mediaPlayer = alert.tts_entity || this._config?.tts_entity;
    if (!mediaPlayer) return;
    const engine = alert.tts_engine || this._config?.tts_engine
      || Object.keys(this._hass.states).find((id) => id.startsWith("tts."));
    if (!engine) return;
    try {
      this._hass.callService("tts", "speak", {
        entity_id: engine,
        media_player_entity_id: mediaPlayer,
        message,
        ...(this._config?.tts_language ? { language: this._config.tts_language } : {}),
      });
    } catch (_) {}
  }

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
      const AudioCtx = window.AudioContext || /** @type {any} */(window).webkitAudioContext;
      const ctx = new AudioCtx();
      // iOS/Safari suspends AudioContext until a user gesture; resume() unlocks it
      // when the context was previously warmed by a prior interaction.
      if (ctx.state === "suspended") ctx.resume();
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
    if (this._snoozeMenuOpen) this._bindSnoozeOutsideClick();
  }

  /** Close snooze menu when user taps/clicks anywhere outside it */
  _bindSnoozeOutsideClick() {
    if (this._snoozeOutsideHandler) {
      document.removeEventListener("pointerdown", this._snoozeOutsideHandler, true);
    }
    this._snoozeOutsideHandler = (e) => {
      // composedPath() needed in shadow DOM — e.target is only the host element
      const path = e.composedPath ? e.composedPath() : [e.target];
      const inside = path.some(el => el.classList && el.classList.contains("atc-snooze-wrap"));
      if (!inside) {
        this._snoozeMenuOpen = null;
        document.removeEventListener("pointerdown", this._snoozeOutsideHandler, true);
        this._snoozeOutsideHandler = null;
      }
    };
    // Defer by one tick so the current tap that opened the menu isn't caught immediately
    setTimeout(() => {
      if (this._snoozeMenuOpen) {
        document.addEventListener("pointerdown", this._snoozeOutsideHandler, true);
      }
    }, 0);
  }

  /** Render the snooze button for the current alert.
   *  If snooze_default_duration is set (number): single tap → immediate snooze with that duration.
   *  Otherwise (default): tap opens duration menu on card.
   *  If snooze_action is configured (per-alert), it is also executed on tap. */
  _renderGroupCard(group) {
    try {
      const themeMeta = THEME_META[group.theme] || {};
      const icon = group.icon
        ? (/^[\w-]+:/.test(group.icon) ? html`<ha-icon icon="${group.icon}" class="atc-ha-icon"></ha-icon>` : group.icon)
        : (themeMeta.icon || "🔔");
      const names = group._memberNames || [];
      const preview = names.join(" · ");
      return html`
        <div class="at-${group.theme || "warning"}">
          <div class="atc-group-inner">
            <div class="atc-icon-wrap">${icon}</div>
            <div class="atc-group-body">
              <div class="atc-group-message">${group.message || ""}</div>
              <div class="atc-group-names">${preview}</div>
            </div>
            <div class="atc-group-count">
              <span class="atc-group-count-num">${(group._members || []).length}</span>
              <span class="atc-group-expand-arrow">▼</span>
            </div>
          </div>
        </div>`;
    } catch (_) {
      return html`<div class="at-warning"><div class="atc-group-inner">⚠️ group</div></div>`;
    }
  }

  _snoozeGroup(group, durationH) {
    group._members.forEach(m => this._snoozeAlert(m, durationH));
  }

  _expandGroup(group) {
    this._expandedGroups.add(group._groupKey);
    this._lastSignature = "";
    this._computeActiveAlerts();
    const firstIdx = this._activeAlerts.findIndex(a => a._expandedGroupKey === group._groupKey);
    if (firstIdx >= 0) this._currentIndex = firstIdx;
    this.requestUpdate();
  }

  _collapseGroup(groupKey) {
    this._expandedGroups.delete(groupKey);
    this._lastSignature = "";
    this._computeActiveAlerts();
    const groupIdx = this._activeAlerts.findIndex(a => a._groupKey === groupKey);
    if (groupIdx >= 0) this._currentIndex = groupIdx;
    this.requestUpdate();
  }

  _renderSnoozeButton(alert) {
    if (!alert || (!alert.entity && !alert._isGroup)) return html``;
    // Persistent alarm: snooze becomes a permanent Dismiss button
    if (alert.persistent) {
      return html`
        <div class="atc-snooze-wrap atc-dismiss-wrap">
          <button
            class="atc-snooze-btn atc-dismiss-btn"
            title="${this._t("dismiss")}"
            @click="${(e) => { e.stopPropagation(); this._dismissPersistent(alert); }}"
          >✕</button>
        </div>
      `;
    }
    // Group slide: snooze all members with duration picker
    if (alert._isGroup) {
      const menuOpen = this._snoozeMenuOpen === alert._groupKey;
      return html`
        <div class="atc-snooze-wrap">
          <button
            class="atc-snooze-btn"
            title="${this._t("snooze")}"
            @click="${(e) => {
              e.stopPropagation();
              this._snoozeMenuOpen = this._snoozeMenuOpen === alert._groupKey ? null : alert._groupKey;
              if (this._snoozeMenuOpen) this._bindSnoozeOutsideClick();
              this.requestUpdate();
            }}"
          >💤</button>
          ${menuOpen ? html`
            <div class="atc-snooze-menu">
              <div class="atc-snooze-label">${this._t("snooze")}</div>
              ${[[1, "snooze_1h"], [4, "snooze_4h"], [8, "snooze_8h"], [24, "snooze_24h"]].map(
                ([h, key]) => html`
                  <button class="atc-snooze-option" @click="${() => this._snoozeGroup(alert, h)}">
                    ${this._t(key)}
                  </button>
                `
              )}
            </div>
          ` : ""}
        </div>
      `;
    }
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
      <div class="atc-history-card">
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
                ${entry.entityName ? html`
                  <div class="atc-history-entity">
                    <span class="atc-history-entity-name">${entry.entityName}</span>
                    ${entry.entityState ? html` <span class="atc-history-entity-state">${entry.entityState}</span>` : ""}
                  </div>
                ` : ""}
                ${entry.secondaryName ? html`
                  <div class="atc-history-entity atc-history-secondary">
                    <span class="atc-history-entity-name">${entry.secondaryName}</span>
                    ${entry.secondaryState ? html` <span class="atc-history-entity-state">${entry.secondaryState}</span>` : ""}
                  </div>
                ` : ""}
                <div class="atc-history-ts">${fmt(entry.ts)}</div>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  /** Execute a tap_action / hold_action config object */
  _handleAction(cfg) {
    if (!cfg || !cfg.action || cfg.action === "none") return;
    if (cfg.action === "_expand_group") { this._expandGroup(this._current); return; }
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
        const entityId = cfg.entity || cfg.entity_id || (this._current && this._current.entity);
        if (!entityId) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true, composed: true,
          detail: { entityId },
        }));
        break;
      }
      case "toggle": {
        if (!this._hass) return;
        const entityId = cfg.entity || (this._current && this._current.entity);
        if (!entityId) return;
        try {
          this._hass.callService("homeassistant", "toggle", { entity_id: entityId });
        } catch (e) { console.error("AlertTicker: toggle error", e); }
        break;
      }
      case "url": {
        if (!cfg.url_path) return;
        // "noopener" makes window.open return null even on success — omit it so
        // we can detect a real popup-block (null = blocked → fall back to same-tab).
        // On the Companion app window.open("_blank") opens SFSafariViewController.
        const w = window.open(cfg.url_path, "_blank");
        if (!w) window.location.assign(cfg.url_path);
        break;
      }
    }
  }

  /** Start hold timer on pointer down */
  _onPointerDown(e, tapCfg, holdCfg, doubleTapCfg) {
    if (e.button !== undefined && e.button !== 0) return;

    this._holdFired = false;
    this._pendingHoldAction = null;
    this._pendingTapCfg = tapCfg;
    this._pendingDoubleTapCfg = doubleTapCfg || null;
    // Capture pointer on the listener element (currentTarget = inner div) so pointerup
    // fires on the same element, not on the shadow host which would miss our handler.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    if (holdCfg && holdCfg.action && holdCfg.action !== "none") {
      // On touch, prevent the browser scroll-detection from firing pointercancel
      // before our 500 ms hold threshold — without this the gesture is silently
      // hijacked on mobile and the hold never fires.
      if (e.pointerType === 'touch') e.preventDefault();
      this._holdTimer = setTimeout(() => {
        this._holdFired = true;
        if (holdCfg.action === "url" && !/HomeAssistant\//.test(navigator.userAgent)) {
          // Desktop only: defer url actions to pointerup so window.open fires in a
          // direct-gesture context (setTimeout is async → popup-blocked on desktop).
          // On the Companion app window.open works fine from async context, and
          // pointercancel may fire instead of pointerup after a long-press on iOS,
          // so we fire immediately here for Companion app.
          this._pendingHoldAction = holdCfg;
        } else {
          this._handleAction(holdCfg);
          // After hold-navigate, block pointer events briefly so the upcoming pointerup
          // doesn't land on a new-view element at the same screen coordinates
          this._blockPointerEvents(350);
        }
      }, 500);
    }
  }

  /** Temporarily disable pointer events on the document to prevent tap bleed-through */
  _blockPointerEvents(ms) {
    document.documentElement.style.pointerEvents = "none";
    setTimeout(() => { document.documentElement.style.pointerEvents = ""; }, ms);
  }

  /** Fire tap / double-tap action on pointer up (if hold didn't fire) */
  _onPointerUp(e) {
    this._cancelHold();
    // Url hold actions are deferred here so window.open fires in a direct user-gesture context
    if (this._holdFired && this._pendingHoldAction) {
      const action = this._pendingHoldAction;
      this._pendingHoldAction = null;
      this._holdFired = false;
      e.preventDefault();   // prevent synthetic click from bubbling to HA parent handlers
      e.stopPropagation();
      this._handleAction(action);
      return;
    }
    if (!this._holdFired) {
      // preventDefault stops the browser from generating a synthetic click event
      // from this pointer sequence, preventing tap bleed-through on navigate actions
      e.preventDefault();
      e.stopPropagation();
      // Signal the host-level click suppressor to block the re-dispatched click that
      // iOS/WKWebView generates after a tap (long-press does not generate click, so
      // hold actions never reach HA parent — but tap/double-tap do without this flag).
      this._suppressNextClick = true;
      const hasDoubleTap = this._pendingDoubleTapCfg &&
                           this._pendingDoubleTapCfg.action &&
                           this._pendingDoubleTapCfg.action !== "none";
      if (hasDoubleTap) {
        if (this._doubleTapTimer) {
          clearTimeout(this._doubleTapTimer);
          this._doubleTapTimer = null;
          this._handleAction(this._pendingDoubleTapCfg);
        } else {
          const tapCfg = this._pendingTapCfg;
          const dblCfg = this._pendingDoubleTapCfg;
          this._doubleTapTimer = setTimeout(() => {
            this._doubleTapTimer = null;
            this._handleAction(tapCfg);
          }, 300);
          // keep dblCfg available for next click
          this._pendingDoubleTapCfg = dblCfg;
        }
      } else {
        this._handleAction(this._pendingTapCfg);
      }
    }
    this._holdFired = false;
    this._pendingTapCfg = null;
    if (!this._doubleTapTimer) this._pendingDoubleTapCfg = null;
  }

  _cancelHold() {
    if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = null; }
  }

  /** Swipe-to-snooze: record touch start position */
  _onSwipeStart(e) {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    this._swipeStartX = t.clientX;
    this._swipeStartY = t.clientY;
  }

  /** Swipe handler: left = next alert (or snooze if swipe_to_snooze enabled), right = prev alert */
  _onSwipeEnd(e) {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - this._swipeStartX;
    const dy = t.clientY - this._swipeStartY;
    // Require at least 60px horizontal movement, more horizontal than vertical
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) {
      // Swipe left → snooze (if enabled) OR navigate next
      if (this._config.swipe_to_snooze) {
        const alert = this._current;
        if (!alert) return;
        if (alert._isGroup) {
          const dur = this._config.snooze_default_duration ?? 1;
          this._snoozeGroup(alert, dur === null ? 1 : dur);
          return;
        }
        if (!alert.entity) return;
        if (alert.persistent) {
          this._dismissPersistent(alert);
          return;
        }
        const dur = alert.snooze_duration !== undefined
          ? alert.snooze_duration
          : (this._config.snooze_default_duration ?? 1);
        this._snoozeAlert(alert, dur === null ? 1 : dur);
      } else {
        this._navigateAlert(+1);
      }
    } else {
      // Swipe right → navigate prev
      this._navigateAlert(-1);
    }
  }

  /** Clear all snooze state and immediately reshow matching alerts */
  _resetSnooze() {
    this._snoozed.clear();
    try { localStorage.removeItem("atc-snooze"); } catch (_) {}
    this._snoozeMenuOpen = null;
    this._lastSignature = ""; // force full recompute
    this._computeActiveAlerts();
  }

  /** Manual navigation: dir = +1 (next) or -1 (prev). Resets cycle timer. */
  _navigateAlert(dir) {
    const len = this._activeAlerts.length;
    if (len < 2) return;
    this._currentIndex = (this._currentIndex + dir + len) % len;
    this._stopCycleTimer();
    this._startCycleTimer();
    this.requestUpdate();
  }

  /** Touch handle ⋮ — tap to show/hide nav + snooze controls on touch devices */
  _renderTouchZone() {
    return html`
      <div class="atc-touch-zone"
        @pointerdown="${(e) => {
          e.stopPropagation();
          this._touchButtonsActive = !this._touchButtonsActive;
          clearTimeout(this._touchButtonsTimer);
          if (this._touchButtonsActive)
            this._touchButtonsTimer = setTimeout(() => { this._touchButtonsActive = false; }, 4000);
        }}"
      ></div>`;
  }

  /** Renders ◀ ▶ nav buttons — only when 2+ active alerts. */
  _renderNavButtons() {
    if (this._activeAlerts.length < 2) return "";
    return html`
      <button class="atc-nav-btn atc-nav-prev" @click="${(e) => { e.stopPropagation(); this._navigateAlert(-1); }}" title="Previous">&#8249;</button>
      <button class="atc-nav-btn atc-nav-next" @click="${(e) => { e.stopPropagation(); this._navigateAlert(+1); }}" title="Next">&#8250;</button>
    `;
  }

  /** Minimal bar shown when all matching alerts are snoozed */
  _renderSnoozedIndicator() {
    return html`
      <div class="at-card atc-snoozed-bar">
        <div class="atc-snoozed-inner">
          <span class="atc-snoozed-icon">💤</span>
          <span class="atc-snoozed-text">${this._snoozedCount} ${this._t("alerts_snoozed")}</span>
          <button class="atc-snoozed-reset" @click="${() => this._resetSnooze()}">
            ↩ ${this._t("snooze_reset")}
          </button>
        </div>
      </div>
    `;
  }

  // ---- LitElement lifecycle ------------------------------------------------

  connectedCallback() {
    super.connectedCallback();
    this._mounted = true;
    // Register here (not setConfig) so isConnected=true and _mounted=true at registration
    // time — prevents the cleanup logic from treating this card as an orphan.
    if (this._config) {
      _ATC_OVERLAY.register(this._cardId, this._config.alerts || [], this._config, this._lang, this);
    }
    this._loadSnooze();
    this._loadPersistent();
    this._loadHistory();
    this._startCycleTimer();
    this._startTimerTick();
    // Catch the shadow-DOM-retargeted click before it reaches HA parent handlers
    this.addEventListener('click', this._hostClickSuppressor);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mounted = false;
    this._stopCycleTimer();
    this._stopTimerTick();
    this.removeEventListener('click', this._hostClickSuppressor);
    if (this._snoozeOutsideHandler) {
      document.removeEventListener("pointerdown", this._snoozeOutsideHandler, true);
      this._snoozeOutsideHandler = null;
    }
    clearTimeout(this._touchButtonsTimer);
    // Unsubscribe all render_template WebSocket subscriptions
    for (const unsub of this._tmplUnsubs.values()) { try { unsub(); } catch (_) {} }
    this._tmplUnsubs.clear();
    this._tmplCache.clear();
    // Unsubscribe weather forecast subscription and flip timer
    if (this._forecastUnsub) { try { this._forecastUnsub(); } catch (_) {} this._forecastUnsub = null; }
    this._stopWfFlipTimer();
    // Cancel all auto_dismiss / on_change / trigger_delay timers
    Object.values(this._autoDismissTimers).forEach(t => clearTimeout(t));
    this._autoDismissTimers = {};
    this._changeTriggers = {};
    Object.values(this._triggerDelayTimers).forEach(t => clearTimeout(t));
    this._triggerDelayTimers = {};
    this._triggerDelayActive.clear();
    // Remove from overlay watcher — prevents stale registrations when HA re-mounts
    // the card on navigation (new instance = new _cardId, old entry would still fire)
    _ATC_OVERLAY.detach(this._cardId);
  }

  /** In vertical mode, make the host element fill the HA grid cell height.
   *  Also stamps 'atc-has-mdi-icon' on every icon container that holds an
   *  ha-icon so CSS can remove backgrounds/filters without :has() (wider
   *  browser support, covers both -icon and -icon-wrap class patterns). */
  updated(changedProps) {
    super.updated(changedProps);
    // Completely remove card from layout when hidden (no active alerts, no clear card, no snooze bar).
    // Exception: if card_border is enabled OR dashboard is in edit mode, keep visible so the placeholder shows.
    const isEditMode = _isEditMode();
    const isHidden = this._activeAlerts.length === 0 &&
                     !this._config?.show_when_clear &&
                     !(this._snoozedCount > 0 && this._config?.show_snooze_bar !== false) &&
                     !this._config?.card_border &&
                     !isEditMode;
    // Use the HTML `hidden` attribute — hui-card observes it and hides the
    // grid/masonry slot completely (same technique used by HA's own conditional-card fix).
    // Also set display:none as belt-and-suspenders for older HA versions.
    this.toggleAttribute("hidden", isHidden);
    this.style.display = isHidden ? "none" : "";
    this.style.height = this._config?.vertical ? "100%" : "";
    // Fixed card height — prevents layout shifts when cycling between alerts
    const cardHeight = this._config?.card_height;
    this.style.setProperty("--atc-card-height", cardHeight ? `${cardHeight}px` : "");
    this.style.setProperty("--atc-card-outline", this._config?.card_border
      ? "1px solid var(--ha-card-border-color, var(--divider-color, rgba(255,255,255,0.25)))"
      : "none");
    this.classList.toggle("atc-center-text", this._config?.text_align === "center");
    this.shadowRoot?.querySelectorAll(".atc-ha-icon").forEach(el => {
      el.parentElement?.classList.add("atc-has-mdi-icon");
    });
  }

  // ---- Helpers -------------------------------------------------------------

  /** Returns the currently visible alert object */
  get _current() {
    if (!this._activeAlerts || this._activeAlerts.length === 0) return null;
    return this._activeAlerts[this._currentIndex % this._activeAlerts.length];
  }

  /** Returns the icon for an alert as a TemplateResult.
   *  Priority: theme animated MDI > manual icon > entity auto-icon (HA registry/state) > theme emoji > 🔔 */
  _getIcon(alert) {
    const themeMeta = THEME_META[alert.theme] || {};
    const colorStyle = alert.icon_color ? `color: ${alert.icon_color};` : "";

    // Theme animated MDI icon (door, window, fire…) — skipped when user explicitly enabled HA icon
    if (!alert.icon && !alert.use_ha_icon && themeMeta.mdiIcon) {
      return html`<div class="atc-icon-anim-wrap ${themeMeta.wrapClass || ""}"><div class="${themeMeta.animClass || ""}"><ha-icon icon="${themeMeta.mdiIcon}" class="atc-ha-icon" style="${colorStyle}"></ha-icon></div></div>`;
    }

    // Manual icon set by user
    if (alert.icon) {
      if (/^[\w-]+:/.test(alert.icon)) {
        return html`<ha-icon icon="${alert.icon}" class="atc-ha-icon" style="${colorStyle}"></ha-icon>`;
      }
      return alert.icon;
    }

    // Auto-icon: use ha-state-icon only when explicitly enabled by the user.
    if (alert.use_ha_icon && alert.entity && this._hass) {
      const stateObj = this._hass.states[alert.entity];
      if (stateObj) {
        return html`<ha-state-icon
          .hass="${this._hass}"
          .stateObj="${stateObj}"
          class="atc-ha-icon"
          style="${colorStyle}"
        ></ha-state-icon>`;
      }
    }

    // Theme emoji fallback → generic bell
    return themeMeta.icon || "🔔";
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

    // entity_filter / device_class: auto-show the matched entity's friendly name (opt-out with show_filter_name: false)
    if (alert && (alert.entity_filter || alert.device_class) && alert.show_filter_name !== false) {
      const es = this._hass && this._hass.states[alert.entity];
      const name = es ? (es.attributes.friendly_name || alert.entity) : alert.entity;
      const stateStr = alert.show_filter_state && es
        ? this._formatStateValue(es, alert.attribute || null)
        : null;
      lines.push(html`<div class="atc-secondary-value atc-filter-label">
        ${name}${stateStr ? html` <span class="atc-filter-state">${stateStr}</span>` : ""}
      </div>`);
    }

    // secondary_text: static custom string (supports {state}/{name}/{entity} placeholders)
    if (alert && alert.secondary_text) {
      const resolved = this._resolveMessage({ ...alert, message: alert.secondary_text });
      if (resolved) lines.push(html`<div class="atc-secondary-value">${resolved}</div>`);
    }

    // secondary_entity: live value below message (translated state)
    if (alert && alert.secondary_entity) {
      const es = this._hass && this._hass.states[alert.secondary_entity];
      if (es) {
        const val = this._formatStateValue(es, alert.secondary_attribute || null);
        if (val !== "" && val != null) {
          const name = alert.show_secondary_name
            ? (es.attributes.friendly_name || alert.secondary_entity)
            : null;
          lines.push(html`<div class="atc-secondary-value atc-secondary-entity-line">
            ${name ? html`<span class="atc-secondary-entity-name">${name}</span> ` : ""}${val}
          </div>`);
        }
      } else if (this._hass) {
        // Entity not found — show a subtle warning so the user can correct the ID
        lines.push(html`<div class="atc-secondary-value atc-secondary-missing">
          ⚠ ${alert.secondary_entity}
        </div>`);
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

  /** Counter overlay for large_buttons mode — absolutely positioned above the button stack */
  _renderCounterOverlay() {
    if (this._activeAlerts.length <= 1) return html``;
    return html`
      <div class="alert-counter-overlay">
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
      <div class="at-card at-ticker">
        <div class="tk-label">${this._t("alerts")}</div>
        <div class="tk-track">
          <div class="tk-scroll" style="--tk-duration: ${duration}s">
            ${items}<span class="tk-gap"></span>
            ${items}<span class="tk-gap"></span>
          </div>
        </div>
      </div>
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
      <div class="at-emergency">
        <div class="em-icon">${icon}</div>
        <div class="em-content">
          <div class="em-badge">${label}</div>
          <div class="em-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="em-right">${this._renderCounter()}</div>
      </div>
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
      <div class="at-warning">
        <div class="wn-icon">${icon}</div>
        <div class="wn-content">
          <div class="wn-badge">${label}</div>
          <div class="wn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="wn-right">
          <div class="wn-dot"></div>
          ${this._renderCounter()}
        </div>
      </div>
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
      <div class="at-info">
        <div class="in-icon-wrap">${icon}</div>
        <div class="in-content">
          <div class="in-badge">${label}</div>
          <div class="in-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="in-right">${this._renderCounter()}</div>
      </div>
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
      <div class="at-success">
        <div class="su-icon-wrap">${icon}</div>
        <div class="su-content">
          <div class="su-badge">${label}</div>
          <div class="su-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="su-right">${this._renderCounter()}</div>
      </div>
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
      <div class="at-neon">
        <div class="ne-scan"></div>
        <div class="ne-icon">${icon}</div>
        <div class="ne-content">
          ${label != null ? html`<div class="ne-badge">// ${(alert.badge_label || label).toUpperCase()}_ALERT</div>` : ""}
          <div class="ne-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="ne-right">${this._renderCounter()}</div>
      </div>
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
      <div class="at-glass">
        <div class="gl-icon-wrap">${icon}</div>
        <div class="gl-content">
          <div class="gl-badge">${label}</div>
          <div class="gl-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="gl-right">${this._renderCounter()}</div>
      </div>
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
      <div class="at-matrix">
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
      </div>
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
      <div class="at-minimal" style="--minimal-accent: ${accent}">
        <div class="mn-icon">${icon}</div>
        <div class="mn-content">
          <div class="mn-badge">${label}</div>
          <div class="mn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="mn-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  // ---- New themes -----------------------------------------------------------

  /** FIRE — orange/red flame flicker, critical */
  _renderFire(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-fire">
        <div class="fi-icon">${icon}</div>
        <div class="fi-content">
          <div class="fi-badge">${label}</div>
          <div class="fi-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="fi-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** ALARM — fast red strobe, critical */
  _renderAlarm(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-alarm">
        <div class="al-strobe"></div>
        <div class="al-icon">${icon}</div>
        <div class="al-content">
          <div class="al-badge">${label}</div>
          <div class="al-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="al-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** LIGHTNING — electric glow + flash, critical/spectacular */
  _renderLightning(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-lightning">
        <div class="lt-bg"></div>
        <div class="lt-bolt">⚡</div>
        <div class="lt-icon">${icon}</div>
        <div class="lt-content">
          <div class="lt-badge">${label}</div>
          <div class="lt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lt-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** CAUTION — yellow/black diagonal stripe top bar, warning */
  _renderCaution(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-caution">
        <div class="ca-icon">${icon}</div>
        <div class="ca-content">
          <div class="ca-badge">${label}</div>
          <div class="ca-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="ca-right">
          <div class="ca-dot"></div>
          ${this._renderCounter()}
        </div>
      </div>
    `;
  }

  /** NOTIFICATION — blue gradient bubble with pulsing red dot, info */
  _renderNotification(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-notification">
        <div class="no-icon-wrap">
          ${icon}
          <div class="no-dot"></div>
        </div>
        <div class="no-content">
          <div class="no-badge">${label}</div>
          <div class="no-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="no-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** AURORA — shifting colour gradient background, info/spectacular */
  _renderAurora(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-aurora">
        <div class="au-bg"></div>
        <div class="au-icon-wrap">${icon}</div>
        <div class="au-content">
          <div class="au-badge">${label}</div>
          <div class="au-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="au-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** CHECK — pulsing green ring, ok/success */
  _renderCheck(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-check">
        <div class="ck-icon-wrap">${icon}</div>
        <div class="ck-content">
          <div class="ck-badge">${label}</div>
          <div class="ck-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="ck-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** CONFETTI — floating coloured particles, ok/success/spectacular */
  _renderConfetti(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-confetti">
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
      </div>
    `;
  }

  /** NUCLEAR — rotating radiation symbol, amber glow, critical */
  _renderNuclear(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-nuclear">
        <div class="nc-bg"></div>
        <div class="nc-icon">${icon}</div>
        <div class="nc-content">
          <div class="nc-badge">${label}</div>
          <div class="nc-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="nc-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** RADAR — sweeping sonar cone + concentric rings, warning */
  _renderRadar(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-radar">
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
      </div>
    `;
  }

  /** HOLOGRAM — holographic grid + scanning line + glitch, info */
  _renderHologram(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-hologram">
        <div class="hg-grid"></div>
        <div class="hg-scan"></div>
        <div class="hg-icon-wrap">${icon}</div>
        <div class="hg-content">
          <div class="hg-badge">${label}</div>
          <div class="hg-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="hg-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** HEARTBEAT — scrolling ECG line + pulse ring, ok */
  _renderHeartbeat(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-heartbeat">
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
      </div>
    `;
  }

  /** RETRO — CRT amber phosphor display with scanlines, style */
  _renderRetro(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-retro">
        <div class="rt-scanlines"></div>
        <div class="rt-icon">${icon}</div>
        <div class="rt-content">
          <div class="rt-badge">${label}</div>
          <div class="rt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="rt-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** FLOOD — animated water waves, deep blue, critical */
  _renderFlood(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-flood">
        <div class="fl-waves"></div>
        <div class="fl-icon">${icon}</div>
        <div class="fl-content">
          <div class="fl-badge">${label}</div>
          <div class="fl-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="fl-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** MOTION — night-vision green eye scan, critical */
  _renderMotion(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-motion">
        <div class="mo-scan"></div>
        <div class="mo-icon">${icon}</div>
        <div class="mo-content">
          <div class="mo-badge">${label}</div>
          <div class="mo-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="mo-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** INTRUDER — red/black siren flash + diagonal stripes, critical */
  _renderIntruder(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-intruder">
        <div class="it-stripes"></div>
        <div class="it-icon">${icon}</div>
        <div class="it-content">
          <div class="it-badge">${label}</div>
          <div class="it-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="it-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** TOXIC — rising green bubbles + skull glow, critical */
  _renderToxic(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-toxic">
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
      </div>
    `;
  }

  /** TEMPERATURE — shaking thermometer + fill bar, warning */
  _renderTemperature(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-temperature">
        <div class="tp-fill"></div>
        <div class="tp-icon">${icon}</div>
        <div class="tp-content">
          <div class="tp-badge">${label}</div>
          <div class="tp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="tp-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** BATTERY — blinking drain bar, warning */
  _renderBattery(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-battery">
        <div class="bt-drain"></div>
        <div class="bt-icon">${icon}</div>
        <div class="bt-content">
          <div class="bt-badge">${label}</div>
          <div class="bt-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="bt-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** DOOR — swinging door + light ray, warning */
  _renderDoor(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-door">
        <div class="dr-ray"></div>
        <div class="dr-icon">${icon}</div>
        <div class="dr-content">
          <div class="dr-badge">${label}</div>
          <div class="dr-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="dr-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** WINDOW — tilting window + light shimmer, warning */
  _renderWindow(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-window">
        <div class="win-shimmer"></div>
        <div class="win-icon">${icon}</div>
        <div class="win-content">
          <div class="win-badge">${label}</div>
          <div class="win-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="win-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** PRESENCE — expanding ping rings, info */
  _renderPresence(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-presence">
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
      </div>
    `;
  }

  /** UPDATE — spinning double progress ring, info */
  _renderUpdate(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-update">
        <div class="up-ring"></div>
        <div class="up-icon">${icon}</div>
        <div class="up-content">
          <div class="up-badge">${label}</div>
          <div class="up-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="up-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** SHIELD — scan wave + glow pulse, ok */
  _renderShield(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-shield">
        <div class="sh-scan"></div>
        <div class="sh-icon">${icon}</div>
        <div class="sh-content">
          <div class="sh-badge">${label}</div>
          <div class="sh-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="sh-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** POWER — energy surge lines + zap icon, ok */
  _renderPower(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-power">
        <div class="pw-lines"></div>
        <div class="pw-icon">${icon}</div>
        <div class="pw-content">
          <div class="pw-badge">${label}</div>
          <div class="pw-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="pw-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** CYBERPUNK — neon purple/cyan diagonal lines + glitch bar, style */
  _renderCyberpunk(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-cyberpunk">
        <div class="cp-lines"></div>
        <div class="cp-glitch"></div>
        <div class="cp-icon">${icon}</div>
        <div class="cp-content">
          <div class="cp-badge">${label}</div>
          <div class="cp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="cp-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** VAPOR — vaporwave grid + gradient float, style */
  _renderVapor(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-vapor">
        <div class="vp-grid"></div>
        <div class="vp-overlay"></div>
        <div class="vp-icon">${icon}</div>
        <div class="vp-content">
          <div class="vp-badge">${label}</div>
          <div class="vp-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="vp-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** LAVA — floating orange blobs on black, style */
  _renderLava(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-lava">
        <div class="lv-blob lv-b1"></div>
        <div class="lv-blob lv-b2"></div>
        <div class="lv-blob lv-b3"></div>
        <div class="lv-icon">${icon}</div>
        <div class="lv-content">
          <div class="lv-badge">${label}</div>
          <div class="lv-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lv-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** SMOKE — grey drifting puffs, warning */
  _renderSmoke(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-smoke">
        <div class="sm-drift"><div class="sm-p1"></div><div class="sm-p2"></div><div class="sm-p3"></div></div>
        <div class="sm-icon">${icon}</div>
        <div class="sm-content">
          <div class="sm-badge">${label}</div>
          <div class="sm-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="sm-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** WIND — fast horizontal streaks, warning */
  _renderWind(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-wind">
        <div class="wd-lines"></div>
        <div class="wd-icon">${icon}</div>
        <div class="wd-content">
          <div class="wd-badge">${label}</div>
          <div class="wd-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="wd-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** LEAK — slow blue drip, warning */
  _renderLeak(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-leak">
        <div class="lk-drip"><div class="lk-drop lk-d1"></div><div class="lk-drop lk-d2"></div><div class="lk-drop lk-d3"></div></div>
        <div class="lk-icon">${icon}</div>
        <div class="lk-content">
          <div class="lk-badge">${label}</div>
          <div class="lk-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lk-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** CLOUD — soft grey-blue floating pulse, info */
  _renderCloud(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-cloud">
        <div class="cw-float"></div>
        <div class="cw-icon">${icon}</div>
        <div class="cw-content">
          <div class="cw-badge">${label}</div>
          <div class="cw-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="cw-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** SATELLITE — radiating signal waves, info */
  _renderSatellite(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-satellite">
        <div class="sl-waves"><div class="sl-w sl-w1"></div><div class="sl-w sl-w2"></div><div class="sl-w sl-w3"></div></div>
        <div class="sl-icon">${icon}</div>
        <div class="sl-content">
          <div class="sl-badge">${label}</div>
          <div class="sl-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="sl-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** TIPS — warm amber lightbulb glow, info */
  _renderTips(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-tips">
        <div class="ts-glow"></div>
        <div class="ts-icon">${icon}</div>
        <div class="ts-content">
          <div class="ts-badge">${label}</div>
          <div class="ts-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="ts-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** SUNRISE — warm golden rising light, ok */
  _renderSunrise(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-sunrise">
        <div class="sn-ray"></div>
        <div class="sn-icon">${icon}</div>
        <div class="sn-content">
          <div class="sn-badge">${label}</div>
          <div class="sn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="sn-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** PLANT — deep green growing pulse, ok */
  _renderPlant(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-plant">
        <div class="pn-grow"></div>
        <div class="pn-icon">${icon}</div>
        <div class="pn-content">
          <div class="pn-badge">${label}</div>
          <div class="pn-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="pn-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** LOCK — deep blue secure pulse, ok */
  _renderLock(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-lock">
        <div class="lo-scan"></div>
        <div class="lo-icon">${icon}</div>
        <div class="lo-content">
          <div class="lo-badge">${label}</div>
          <div class="lo-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="lo-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** LIGHT — warm incandescent bulb glow, info */
  _renderLight(alert) {
    if (!alert) return html``;
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-light">
        <div class="li-beam"></div>
        <div class="li-icon">${icon}</div>
        <div class="li-content">
          <div class="li-badge">${label}</div>
          <div class="li-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="li-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** MUSIC — floating notes, purple/magenta pulsing rhythm, info */
  _renderMusic(alert) {
    if (!alert) return html``;
    if (alert.show_player_controls && alert.entity && alert.entity.startsWith("media_player.")) {
      const es = this._hass && this._hass.states[alert.entity];
      if (es) return this._renderMusicPlayer(alert, es);
    }
    const icon = this._getIcon(alert);
    const label = this._getCategoryLabel(alert);
    return html`
      <div class="at-music">
        <div class="mu-notes">
          <span class="mu-note">♪</span>
          <span class="mu-note">♫</span>
          <span class="mu-note">♩</span>
          <span class="mu-note">♬</span>
        </div>
        <div class="mu-icon">${icon}</div>
        <div class="mu-content">
          <div class="mu-badge">${label}</div>
          <div class="mu-title">${this._resolveMessage(alert)}</div>${this._renderSecondaryValue(alert)}
        </div>
        <div class="mu-right">${this._renderCounter()}</div>
      </div>
    `;
  }

  /** MUSIC PLAYER — album art background with playback controls */
  _renderMusicPlayer(alert, es) {
    const art = es.attributes.entity_picture || "";
    const title = es.attributes.media_title || this._resolveMessage(alert);
    const artist = es.attributes.media_artist || "";
    const isPlaying = es.state === "playing";
    const isMuted = !!es.attributes.is_volume_muted;
    const vol = Math.round((es.attributes.volume_level || 0) * 100);
    const volBg = `linear-gradient(to right, var(--mu-accent, #e040fb) ${vol}%, rgba(255,255,255,0.15) ${vol}%)`;
    const artUrl = art
      ? (art.startsWith("http") ? art : (this._hass.hassUrl ? this._hass.hassUrl(art) : art))
      : "";
    const accent = alert.music_player_color || '#e040fb';
    const call = (svc, extra = {}) =>
      this._hass.callService("media_player", svc, { entity_id: alert.entity, ...extra });
    return html`
      <div class="at-music at-music--player" style="--mu-accent:${accent}">
        ${artUrl ? html`<div class="mu-art-bg" style="background-image:url('${artUrl}')"></div>` : ""}
        <div class="mu-art-overlay"></div>
        <div class="mu-player-body">
          <div class="mu-now-playing">
            ${isPlaying ? html`
              <div class="mu-eq">
                <span class="mu-eq-bar"></span>
                <span class="mu-eq-bar"></span>
                <span class="mu-eq-bar"></span>
              </div>` : html`<span class="mu-pause-dot">◼</span>`}
            <span class="mu-np-label">NOW PLAYING</span>
          </div>
          <div class="mu-player-info">
            <div class="mu-player-title">${title}</div>
            ${artist ? html`<div class="mu-player-artist">${artist}</div>` : ""}
          </div>
          <div class="mu-player-controls">
            <button class="mu-ctrl-btn" @click="${() => call('media_previous_track')}"><ha-icon icon="mdi:skip-previous"></ha-icon></button>
            <button class="mu-ctrl-btn mu-ctrl-btn--play" @click="${() => call('media_play_pause')}">
              <ha-icon icon="${isPlaying ? "mdi:pause" : "mdi:play"}"></ha-icon>
            </button>
            <button class="mu-ctrl-btn" @click="${() => call('media_next_track')}"><ha-icon icon="mdi:skip-next"></ha-icon></button>
            <button class="mu-ctrl-btn ${isMuted ? 'mu-ctrl-btn--active' : ''}"
              @click="${() => call('volume_mute', { is_volume_muted: !isMuted })}">
              <ha-icon icon="${isMuted ? "mdi:volume-mute" : "mdi:volume-high"}"></ha-icon>
            </button>
            <input type="range" class="mu-vol-slider ${isMuted ? 'mu-vol-slider--muted' : ''}"
              min="0" max="100" step="1" .value="${vol}"
              style="background:${volBg}"
              @input="${(e) => { e.target.style.background = `linear-gradient(to right, var(--mu-accent, #e040fb) ${e.target.value}%, rgba(255,255,255,0.15) ${e.target.value}%)`; }}"
              @change="${(e) => call('volume_set', { volume_level: parseFloat(e.target.value) / 100 })}"
            />
          </div>
        </div>
        ${artUrl ? html`<img class="mu-art-thumb ${isPlaying ? 'mu-art-thumb--playing' : ''}" src="${artUrl}" alt="">` : ""}
        <div class="mu-player-right">${this._renderCounter()}</div>
        <div class="mu-accent-line"></div>
      </div>
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
    const urgent = progress >= 0 && progress < 0.2;
    const barW = progress >= 0 ? progress * 100 : 0;
    return html`
      <div class="at-countdown ${urgent ? "cd-urgent" : ""}">
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
          <div class="cd-bar-fill" style="width:${barW}%;background:${color}"></div>
        </div>
      </div>
    `;
  }

  _renderHourglass(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const urgent = progress >= 0 && progress < 0.2;
    const fillH = progress >= 0 ? progress * 100 : 0;
    return html`
      <div class="at-hourglass ${urgent ? "hg2-urgent" : ""}">
        <div class="hg2-fill" style="height:${fillH}%;background:${color}20"></div>
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
      </div>
    `;
  }

  _renderTimerPulse(alert) {
    if (!alert) return html``;
    const { progress, remainingStr, isActive } = this._getTimerData(alert);
    const message = this._resolveMessage(alert);
    const icon = this._getIcon(alert);
    const color = this._timerColor(progress);
    const speed = Math.max(0.4, (progress >= 0 ? progress : 0.8) * 2.5).toFixed(2);
    return html`
      <div class="at-timer-pulse" style="--tp-color:${color};--tp-speed:${speed}s">
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
      </div>
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
    const dash = +(circ * Math.max(0, progress)).toFixed(2);
    return html`
      <div class="at-timer-ring">
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
      </div>
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
      case "window":       return this._renderWindow(alert);
      case "presence":     return this._renderPresence(alert);
      case "update":       return this._renderUpdate(alert);
      case "shield":       return this._renderShield(alert);
      case "power":        return this._renderPower(alert);
      case "cyberpunk":    return this._renderCyberpunk(alert);
      case "vapor":        return this._renderVapor(alert);
      case "lava":         return this._renderLava(alert);
      case "smoke":        return this._renderSmoke(alert);
      case "wind":         return this._renderWind(alert);
      case "leak":         return this._renderLeak(alert);
      case "cloud":        return this._renderCloud(alert);
      case "satellite":    return this._renderSatellite(alert);
      case "tips":         return this._renderTips(alert);
      case "light":        return this._renderLight(alert);
      case "music":        return this._renderMusic(alert);
      case "sunrise":      return this._renderSunrise(alert);
      case "plant":        return this._renderPlant(alert);
      case "lock":         return this._renderLock(alert);
      case "countdown":    return this._renderCountdown(alert);
      case "hourglass":    return this._renderHourglass(alert);
      case "timer_pulse":  return this._renderTimerPulse(alert);
      case "timer_ring":   return this._renderTimerRing(alert);
      default:             return this._renderEmergency(alert);
    }
  }

  // ---- render() -----------------------------------------------------------

  /** Class string for the snooze-host wrapper — shared by all render paths */
  get _hostClass() {
    return "atc-snooze-host"
      + (this._config.large_buttons    ? " atc-large-buttons"    : "")
      + (this._config.ha_theme         ? " atc-ha-theme"         : "")
      + (this._config.vertical         ? " atc-vertical"         : "")
      + (this._animPhase               ? " atc-animating"        : "")
      + (this._touchButtonsActive      ? " atc-touch-active"     : "");
  }

  render() {
    if (!this._config) return html``;

    // No active alerts
    if (this._activeAlerts.length === 0) {
      // Some alerts match but are snoozed — show a minimal indicator with reset button
      if (this._snoozedCount > 0 && this._config.show_snooze_bar !== false) {
        return html`
          <div class="atc-card-root">
            <div class="${this._hostClass}">${this._renderSnoozedIndicator()}</div>
          </div>`;
      }
      if (this._config.show_when_clear) {
        const widget = this._renderClearWidget();
        if (widget) {
          const wTapCfg    = this._config.clear_tap_action        || null;
          const wHoldCfg   = this._config.clear_hold_action       || null;
          const wDblTapCfg = this._config.clear_double_tap_action || null;
          const wHasAction = (wTapCfg    && wTapCfg.action    && wTapCfg.action    !== "none") ||
                             (wHoldCfg   && wHoldCfg.action   && wHoldCfg.action   !== "none") ||
                             (wDblTapCfg && wDblTapCfg.action && wDblTapCfg.action !== "none");
          const wPd = wHasAction ? (e) => this._onPointerDown(e, wTapCfg, wHoldCfg, wDblTapCfg) : null;
          const wPu = wHasAction ? (e) => this._onPointerUp(e)  : null;
          const wPl = wHasAction ? ()  => this._cancelHold()    : null;
          return html`<div class="atc-card-root"><div class="${this._hostClass}"><div class="atc-inner-clip">
            <div class="${wHasAction ? "atc-clickable" : ""}"
              @pointerdown="${wPd}" @pointerup="${wPu}"
              @pointerleave="${wPl}" @pointercancel="${wPl}"
              @click="${wHasAction ? (e) => { e.stopPropagation(); e.preventDefault(); } : null}">${widget}</div>
          </div></div></div>`;
        }
        // Build a virtual "all clear" alert and render it with the chosen clear theme
        const clearAlert = {
          message: this._config.clear_message || this._t("all_clear"),
          icon: "✅",
          priority: 0,
          entity: null,
          theme: this._config.clear_theme || "success",
          badge_label: this._config.clear_badge_label || undefined,
        };
        const clearTapCfg    = this._config.clear_tap_action       || null;
        const clearHoldCfg   = this._config.clear_hold_action      || null;
        const clearDblTapCfg = this._config.clear_double_tap_action || null;
        const clearHasAction = (clearTapCfg    && clearTapCfg.action    && clearTapCfg.action    !== "none") ||
                               (clearHoldCfg   && clearHoldCfg.action   && clearHoldCfg.action   !== "none") ||
                               (clearDblTapCfg && clearDblTapCfg.action && clearDblTapCfg.action !== "none");
        const clearPd = clearHasAction ? (e) => this._onPointerDown(e, clearTapCfg, clearHoldCfg, clearDblTapCfg) : null;
        const clearPu = clearHasAction ? (e) => this._onPointerUp(e)   : null;
        const clearPl = clearHasAction ? ()  => this._cancelHold()     : null;
        return html`
          <div class="atc-card-root">
            <div class="${this._hostClass}">
              <div class="at-fold-wrapper${clearHasAction ? " atc-clickable" : ""}"
                @pointerdown="${clearPd}" @pointerup="${clearPu}"
                @pointerleave="${clearPl}" @pointercancel="${clearPl}"
                @click="${clearHasAction ? (e) => { e.stopPropagation(); e.preventDefault(); } : null}">
                ${this._renderForTheme(clearAlert.theme, clearAlert)}
              </div>
            </div>
          </div>`;
      }
      // If card_border is on OR in edit mode: show a subtle placeholder so the card stays visible/clickable.
      // Otherwise: return empty (the host is hidden by updated() — collapses the grid slot).
      if (this._config.card_border || _isEditMode()) {
        return html`
          <div class="atc-card-root">
            <div class="atc-placeholder">
              <span class="atc-placeholder-icon">🔔</span>
              <span class="atc-placeholder-text">AlertTicker Card</span>
            </div>
          </div>`;
      }
      return html``;
    }

    // Use the current alert's own theme, wrapped with fold animation
    const hasWidgetSlide = !!(this._config?.show_widget_in_cycle && this._config?.clear_display_mode && this._config.clear_display_mode !== 'message');
    const isWidgetSlide  = hasWidgetSlide && this._currentIndex >= this._activeAlerts.length;
    const current = this._current;
    const snoozeBtn = this._renderSnoozeButton(current);
    const historyBtn = this._renderHistoryButton();
    const groupBackBtn = (!isWidgetSlide && current && current._expandedMember)
      ? html`<button class="atc-group-back-btn" title="Torna al gruppo" @click="${(e) => { e.stopPropagation(); this._collapseGroup(current._expandedGroupKey); }}">◀</button>`
      : "";

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
          <div class="${this._hostClass}">
            <div class="at-fold-wrapper ${this._animPhase}${!this._animPhase ? ' atc-fold-history' : ''}" data-anim="${this._config.cycle_animation || "fold"}">
              ${this._renderHistory()}
            </div>
            ${historyBtn}${snoozedPill}
          </div>
          ${testModeBanner}
        </div>
      `;
    }

    const inner = isWidgetSlide
      ? this._renderClearWidget()
      : (current && current._isGroup)
        ? this._renderGroupCard(current)
        : this._renderForTheme((current?.theme || "emergency"), current);

    // tap_action / double_tap_action / hold_action — backwards-compat: old "action" key maps to tap call-service
    // Group slides use internal _expand_group tap so the whole card is tappable
    const tapCfg    = isWidgetSlide ? (this._config.clear_tap_action        || null)
                    : (current && current._isGroup) ? { action: "_expand_group" }
                    : (current.tap_action || (current.action ? { action: "call-service", ...current.action } : null));
    const holdCfg   = isWidgetSlide ? (this._config.clear_hold_action       || null) : (current && current._isGroup ? null : (current.hold_action       || null));
    const dblTapCfg = isWidgetSlide ? (this._config.clear_double_tap_action || null) : (current && current._isGroup ? null : (current.double_tap_action || null));
    const hasInteraction = (tapCfg    && tapCfg.action    && tapCfg.action    !== "none") ||
                           (holdCfg   && holdCfg.action   && holdCfg.action   !== "none") ||
                           (dblTapCfg && dblTapCfg.action && dblTapCfg.action !== "none");

    const pdHandler = hasInteraction ? (e) => this._onPointerDown(e, tapCfg, holdCfg, dblTapCfg) : null;
    const puHandler = hasInteraction ? (e) => this._onPointerUp(e)                    : null;
    const plHandler = hasInteraction ? ()  => this._cancelHold()                      : null;

    // Swipe gesture handlers — always active for nav; also handles swipe_to_snooze
    const swipeStart = (e) => this._onSwipeStart(e);
    const swipeEnd   = (e) => this._onSwipeEnd(e);
    const navButtons   = this._renderNavButtons();
    const touchHandle  = this._renderTouchZone();

    const counterOverlay = this._config.large_buttons ? this._renderCounterOverlay() : "";

    // Ticker has its own scroll animation — skip fold wrapper (unless it's the widget slide)
    if (!isWidgetSlide && (current.theme || "").toLowerCase() === "ticker") {
      return html`
        <div class="atc-card-root">
          <div class="${this._hostClass}">
            <div class="atc-inner-clip">
              <div class="${hasInteraction ? "atc-clickable" : ""}"
                @pointerdown="${pdHandler}" @pointerup="${puHandler}"
                @pointerleave="${plHandler}" @pointercancel="${plHandler}"
                @touchstart="${swipeStart}" @touchend="${swipeEnd}"
                @click="${hasInteraction ? (e) => { e.stopPropagation(); e.preventDefault(); } : null}">${inner}</div>
            </div>
            ${snoozeBtn}${groupBackBtn}${historyBtn}${snoozedPill}${counterOverlay}${navButtons}${touchHandle}
          </div>
          ${testModeBanner}
        </div>`;
    }
    return html`
      <div class="atc-card-root">
        <div class="${this._hostClass}">
          <div class="atc-inner-clip">
            <div class="at-fold-wrapper ${this._animPhase}${hasInteraction ? " atc-clickable" : ""}"
              data-anim="${this._config.cycle_animation || "fold"}"
              @pointerdown="${pdHandler}" @pointerup="${puHandler}"
              @pointerleave="${plHandler}" @pointercancel="${plHandler}"
              @touchstart="${swipeStart}" @touchend="${swipeEnd}"
              @click="${hasInteraction ? (e) => { e.stopPropagation(); e.preventDefault(); } : null}">${inner}</div>
          </div>
          ${snoozeBtn}${groupBackBtn}${historyBtn}${snoozedPill}${counterOverlay}${navButtons}${touchHandle}
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
      :host {
        display: block;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .at-card {
        padding: 0;
        overflow: hidden;
        position: relative;
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
        color: rgba(255, 255, 255, 0.9);
      }

      /* -----------------------------------------------------------------------
       * ANIMATED THEME ICONS — door (left-hinge rotate) / window (top-hinge rotate)
       * Uses 2D rotate() around the hinge edge — works on any element including
       * web components with shadow DOM (no perspective/3D needed).
       * --------------------------------------------------------------------- */
      .atc-icon-anim-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @keyframes atc-icon-swing {
        0%,  100% { transform: rotate(0deg);   }
        15%        { transform: rotate(-40deg); }
        50%        { transform: rotate(-40deg); }
        70%        { transform: rotate(0deg);   }
      }
      @keyframes atc-icon-swing-v {
        0%,  100% { transform: rotate(0deg);   }
        15%        { transform: rotate(35deg);  }
        50%        { transform: rotate(35deg);  }
        70%        { transform: rotate(0deg);   }
      }
      .atc-icon-swing {
        display: inline-block;
        transform-origin: left center;
        animation: atc-icon-swing 3.5s ease-in-out infinite;
      }
      .atc-icon-swing-v {
        display: inline-block;
        transform-origin: center top;
        animation: atc-icon-swing-v 3.5s ease-in-out infinite;
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
        color: rgba(255, 255, 255, 0.85);
      }
      .atc-filter-label {
        font-size: 0.92rem;
        opacity: 0.9;
        font-weight: 600;
        font-style: normal;
        letter-spacing: 0.01em;
      }
      .atc-filter-state {
        opacity: 0.7;
        font-weight: 400;
        font-size: 0.85rem;
        margin-left: 4px;
      }
      .atc-secondary-entity-line {
        font-size: 0.92rem;
        opacity: 0.9;
        font-weight: 500;
      }
      .atc-secondary-entity-name {
        font-weight: 600;
        opacity: 0.85;
      }
      .atc-secondary-missing {
        font-size: 0.72rem;
        opacity: 0.5;
        font-style: italic;
        color: var(--warning-color, #ff9800);
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
        font-size: 0.85rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.65);
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
      .alert-counter .counter-sep {
        opacity: 0.45;
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
        padding: 16px 18px;
        background: linear-gradient(135deg, #1a1000, #2d1f00);
        border-left: 4px solid #ff9800;
        border-top: 1px solid rgba(255, 152, 0, 0.2);
        border-right: 1px solid rgba(255, 152, 0, 0.2);
        border-bottom: 1px solid rgba(255, 152, 0, 0.2);
      }

      .wn-icon {
        font-size: 2rem;
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
        padding: 16px 18px;
        background: linear-gradient(135deg, #001a2d, #002340);
        border-left: 4px solid #29b6f6;
        border-top: 1px solid rgba(41, 182, 246, 0.15);
        border-right: 1px solid rgba(41, 182, 246, 0.15);
        border-bottom: 1px solid rgba(41, 182, 246, 0.15);
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
        padding: 16px 18px;
        background: linear-gradient(135deg, #001a0a, #002d14);
        border-left: 4px solid #4caf50;
        border-top: 1px solid rgba(76, 175, 80, 0.15);
        border-right: 1px solid rgba(76, 175, 80, 0.15);
        border-bottom: 1px solid rgba(76, 175, 80, 0.15);
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
        padding: 16px 18px;
        background: #0a0a0f;
        border: 1px solid rgba(0, 255, 255, 0.25);
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
        font-size: 2rem;
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
        padding: 16px 18px;
        background: #000;
        border: 1px solid #00ff41;
        box-shadow:
          0 0 15px rgba(0, 255, 65, 0.15),
          inset 0 0 30px rgba(0, 255, 65, 0.03);
        font-family: 'Courier New', Courier, monospace;
      }

      .mx-icon {
        font-size: 2rem;
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
        padding: 16px 18px;
        background: #f8f9fa;
        border-left: 5px solid var(--minimal-accent, #e53935);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      }

      .mn-icon {
        font-size: 2rem;
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
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .at-fold-wrapper > *:not(.atc-history-card) {
        border-radius: var(--ha-card-border-radius, 12px) !important;
      }
      .at-fold-wrapper.atc-fold-history {
        overflow: visible;
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
        border: 2px solid #ff6d00;
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
        background: #0d0000; border: 2px solid #ff1744;
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
        background: #050510; border: 2px solid #7c4dff;
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
        font-size: 2rem; flex-shrink: 0; position: relative;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: #1a1400; border: 2px solid #ffc107; border-radius: 10px;
        position: relative; overflow: hidden;
      }
      .at-caution::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 5px;
        background: repeating-linear-gradient(-45deg, #ffc107 0, #ffc107 8px, #1a1400 8px, #1a1400 16px);
      }
      .ca-icon { font-size: 2rem; flex-shrink: 0; filter: drop-shadow(0 0 5px #ffc107); }
      .ca-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffc107; margin-bottom: 3px; }
      .ca-title { font-size: 0.9rem; font-weight: 600; color: #fff8e1; }
      .ca-content { flex: 1; min-width: 0; }
      .ca-right { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
      .ca-dot { width: 8px; height: 8px; background: #ffc107; border-radius: 50%; animation: warnBlink 1.5s ease-in-out infinite; }

      /* -----------------------------------------------------------------------
       * NOTIFICATION — blue bubble with red pulsing dot, info
       * --------------------------------------------------------------------- */
      .at-notification {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        padding: 16px 18px;
        background: #120c00; border: 1px solid rgba(255,160,0,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: inset 0 0 30px rgba(255,160,0,0.04);
      }
      /* Circular radar display on the right */
      .rd-display {
        position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        width: 72px; height: 72px; border-radius: 50%;
        border: 1px solid rgba(255,160,0,0.25);
        pointer-events: none; overflow: hidden;
      }
      .rd-r {
        position: absolute; top: 50%; left: 50%; border-radius: 50%;
        border: 1px solid rgba(255,160,0,0.2);
        transform: translate(-50%,-50%);
      }
      .rd-r1 { width: 100%; height: 100%; }
      .rd-r2 { width: 66%; height: 66%; border-color: rgba(255,160,0,0.25); }
      .rd-r3 { width: 33%; height: 33%; border-color: rgba(255,160,0,0.3); }
      /* Sweeping cone */
      .rd-sweep {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: conic-gradient(rgba(255,160,0,0.55) 0deg, transparent 80deg);
        animation: rdSweep 3s linear infinite;
        border-radius: 50%;
      }
      @keyframes rdSweep { to { transform: rotate(360deg); } }
      /* Center blip */
      .rd-center {
        position: absolute; top: 50%; left: 50%;
        width: 5px; height: 5px; background: #ffa000; border-radius: 50%;
        transform: translate(-50%,-50%);
        box-shadow: 0 0 8px #ffa000;
      }
      .rd-icon {
        font-size: 2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 6px #ffa000);
        animation: rdPing 3s ease-in-out infinite;
      }
      @keyframes rdPing {
        0%,85%,100% { filter: drop-shadow(0 0 4px #ffa000); }
        90%          { filter: drop-shadow(0 0 14px #ffa000) brightness(1.6); }
      }
      .rd-badge { font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffa000; margin-bottom: 3px; }
      .rd-title { font-weight: 600; color: #fff3e0; }
      .rd-content { flex: 1; min-width: 0; padding-right: 86px; }
      .rd-right { flex-shrink: 0; position: absolute; right: 92px; top: 50%; transform: translateY(-50%); }

      /* -----------------------------------------------------------------------
       * HOLOGRAM — blue holographic grid + scan + glitch flicker, info
       * --------------------------------------------------------------------- */
      .at-hologram {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
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
        font-size: 2rem; flex-shrink: 0; position: relative;
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
        transform-origin: left center;
        animation: drSwing 3.5s ease-in-out infinite;
      }
      @keyframes drSwing {
        0%,100% { transform: perspective(250px) rotateY(0deg); }
        15%      { transform: perspective(250px) rotateY(-75deg); }
        52%      { transform: perspective(250px) rotateY(-75deg); }
        75%      { transform: perspective(250px) rotateY(0deg); }
      }
      .dr-content { flex: 1; min-width: 0; position: relative; }
      .dr-right   { flex-shrink: 0; position: relative; }
      .dr-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffd600; margin-bottom: 3px; }
      .dr-title { font-weight: 600; color: #fffde7; }

      /* -----------------------------------------------------------------------
       * WINDOW — tilting window + light shimmer, warning
       * --------------------------------------------------------------------- */
      .at-window {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #001929, #002e4d);
        border: 1px solid rgba(128,216,255,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(128,216,255,0.08);
      }
      .win-shimmer {
        position: absolute; top: 0; left: -40%; width: 30%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(128,216,255,0.12), transparent);
        animation: winShimmer 3s ease-in-out infinite; pointer-events: none;
      }
      @keyframes winShimmer { 0%,100% { left: -40%; } 50% { left: 110%; } }
      .win-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(128,216,255,0.7));
        transform-origin: center top;
        animation: winTilt 3.5s ease-in-out infinite;
      }
      @keyframes winTilt {
        0%,100% { transform: perspective(250px) rotateX(0deg); }
        15%      { transform: perspective(250px) rotateX(60deg); }
        52%      { transform: perspective(250px) rotateX(60deg); }
        75%      { transform: perspective(250px) rotateX(0deg); }
      }
      .win-content { flex: 1; min-width: 0; position: relative; }
      .win-right   { flex-shrink: 0; position: relative; }
      .win-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #80d8ff; margin-bottom: 3px; }
      .win-title { font-weight: 600; color: #e1f5fe; }

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
       * SMOKE — drifting grey puffs, warning
       * --------------------------------------------------------------------- */
      .at-smoke {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0a0a0a, #151515);
        border: 1px solid rgba(160,160,160,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(120,120,120,0.08);
      }
      .sm-drift { position: absolute; inset: 0; pointer-events: none; }
      .sm-p1,.sm-p2,.sm-p3 {
        position: absolute; border-radius: 50%;
        background: radial-gradient(circle, rgba(180,180,180,0.18) 0%, transparent 70%);
        animation: smDrift 6s ease-in-out infinite;
      }
      .sm-p1 { width: 70px; height: 50px; bottom: -10px; left: 8%;  animation-delay: 0s; }
      .sm-p2 { width: 55px; height: 40px; bottom: -8px;  left: 42%; animation-delay: 2s; }
      .sm-p3 { width: 45px; height: 35px; bottom: -5px;  left: 70%; animation-delay: 4s; }
      @keyframes smDrift {
        0%,100% { transform: translateY(0) translateX(0) scale(1);   opacity: 0.45; }
        50%      { transform: translateY(-22px) translateX(8px) scale(1.2); opacity: 0.85; }
      }
      .sm-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(180,180,180,0.5));
        animation: smWobble 4s ease-in-out infinite;
      }
      @keyframes smWobble { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08) translateY(-3px); } }
      .sm-content { flex: 1; min-width: 0; position: relative; }
      .sm-right   { flex-shrink: 0; position: relative; }
      .sm-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9e9e9e; margin-bottom: 3px; }
      .sm-title { font-weight: 600; color: #eeeeee; }

      /* -----------------------------------------------------------------------
       * WIND — fast horizontal streaks, warning
       * --------------------------------------------------------------------- */
      .at-wind {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #00080d, #001018);
        border: 1px solid rgba(100,200,255,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(100,200,255,0.06);
      }
      .wd-lines {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(
          90deg, transparent 0, transparent 28px,
          rgba(100,200,255,0.07) 28px, rgba(100,200,255,0.07) 32px,
          transparent 32px, transparent 60px,
          rgba(100,200,255,0.04) 60px, rgba(100,200,255,0.04) 63px);
        animation: wdFlow 0.8s linear infinite;
      }
      @keyframes wdFlow { to { transform: translateX(63px); } }
      .wd-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(100,200,255,0.8));
        animation: wdSway 1.2s ease-in-out infinite;
      }
      @keyframes wdSway { 0%,100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
      .wd-content { flex: 1; min-width: 0; position: relative; }
      .wd-right   { flex-shrink: 0; position: relative; }
      .wd-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64c8ff; margin-bottom: 3px; }
      .wd-title { font-weight: 600; color: #e0f4ff; }

      /* -----------------------------------------------------------------------
       * LEAK — slow blue drip, warning
       * --------------------------------------------------------------------- */
      .at-leak {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000512, #000d20);
        border: 1px solid rgba(30,136,229,0.45); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(30,136,229,0.08);
      }
      .lk-drip { position: absolute; inset: 0; pointer-events: none; }
      .lk-drop {
        position: absolute; width: 6px; height: 10px; border-radius: 50% 50% 60% 60%;
        background: rgba(30,136,229,0.65);
        animation: lkDrop 3.5s ease-in infinite;
      }
      .lk-d1 { top: -10px; left: 20%; animation-delay: 0s; }
      .lk-d2 { top: -10px; left: 50%; animation-delay: 1.2s; }
      .lk-d3 { top: -10px; left: 76%; animation-delay: 2.4s; }
      @keyframes lkDrop {
        0%   { transform: translateY(0);    opacity: 0; }
        10%  { opacity: 1; }
        80%  { opacity: 0.8; }
        100% { transform: translateY(80px); opacity: 0; }
      }
      .lk-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(30,136,229,0.8));
        animation: lkBob 2s ease-in-out infinite;
      }
      @keyframes lkBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      .lk-content { flex: 1; min-width: 0; position: relative; }
      .lk-right   { flex-shrink: 0; position: relative; }
      .lk-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1e88e5; margin-bottom: 3px; }
      .lk-title { font-weight: 600; color: #e3f2fd; }

      /* -----------------------------------------------------------------------
       * CLOUD — soft grey-blue floating pulse, info
       * --------------------------------------------------------------------- */
      .at-cloud {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #080c10, #0d1520);
        border: 1px solid rgba(144,164,174,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        animation: cwFloat 4s ease-in-out infinite;
      }
      @keyframes cwFloat {
        0%,100% { box-shadow: 0 0 18px rgba(144,164,174,0.1); }
        50%      { box-shadow: 0 0 32px rgba(144,164,174,0.22); }
      }
      .cw-float {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 30% 60%, rgba(144,164,174,0.07) 0%, transparent 70%);
        animation: cwPulse 4s ease-in-out infinite; pointer-events: none;
      }
      @keyframes cwPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      .cw-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(144,164,174,0.6));
        animation: cwBob 5s ease-in-out infinite;
      }
      @keyframes cwBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .cw-content { flex: 1; min-width: 0; position: relative; }
      .cw-right   { flex-shrink: 0; position: relative; }
      .cw-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #90a4ae; margin-bottom: 3px; }
      .cw-title { font-weight: 600; color: #eceff1; }

      /* -----------------------------------------------------------------------
       * SATELLITE — radiating signal waves, info
       * --------------------------------------------------------------------- */
      .at-satellite {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #000a14, #001020);
        border: 1px solid rgba(0,230,118,0.3); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,230,118,0.06);
      }
      .sl-waves { position: absolute; right: 22px; top: 50%; transform: translateY(-50%); pointer-events: none; }
      .sl-w {
        position: absolute; top: 50%; left: 50%;
        width: 0; height: 0;
        border-radius: 50%; border: 1.5px solid rgba(0,230,118,0.7);
        transform: translate(-50%,-50%);
        animation: slWave 2s ease-out infinite;
      }
      .sl-w1 { animation-delay: 0s; }
      .sl-w2 { animation-delay: 0.66s; }
      .sl-w3 { animation-delay: 1.33s; }
      @keyframes slWave {
        0%   { width: 4px;  height: 4px;  opacity: 1; }
        100% { width: 55px; height: 55px; opacity: 0; }
      }
      .sl-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 8px rgba(0,230,118,0.7));
        animation: slBlink 2s ease-in-out infinite;
      }
      @keyframes slBlink { 0%,80%,100% { opacity: 1; } 85%,95% { opacity: 0.3; } }
      .sl-content { flex: 1; min-width: 0; position: relative; }
      .sl-right   { flex-shrink: 0; position: relative; }
      .sl-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00e676; margin-bottom: 3px; }
      .sl-title { font-weight: 600; color: #e8f5e9; }

      /* -----------------------------------------------------------------------
       * TIPS — warm amber lightbulb glow, info
       * --------------------------------------------------------------------- */
      .at-tips {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0900, #1a1200);
        border: 1px solid rgba(255,193,7,0.35); border-radius: 12px;
        position: relative; overflow: hidden;
        animation: tsGlow 3s ease-in-out infinite;
      }
      @keyframes tsGlow {
        0%,100% { box-shadow: 0 0 18px rgba(255,193,7,0.12); }
        50%      { box-shadow: 0 0 38px rgba(255,193,7,0.28); }
      }
      .ts-glow {
        position: absolute; top: -20%; left: 30px;
        width: 60px; height: 140%;
        background: radial-gradient(ellipse at center, rgba(255,193,7,0.12) 0%, transparent 70%);
        animation: tsPulse 3s ease-in-out infinite; pointer-events: none;
      }
      @keyframes tsPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      .ts-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: tsFlicker 4s ease-in-out infinite;
      }
      @keyframes tsFlicker {
        0%,85%,100% { filter: drop-shadow(0 0 12px rgba(255,193,7,0.9)); }
        88%,96%     { filter: drop-shadow(0 0 4px rgba(255,193,7,0.3)); }
      }
      .ts-content { flex: 1; min-width: 0; position: relative; }
      .ts-right   { flex-shrink: 0; position: relative; }
      .ts-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffc107; margin-bottom: 3px; }
      .ts-title { font-weight: 600; color: #fff8e1; }

      /* -----------------------------------------------------------------------
       * SUNRISE — warm golden rising light, ok
       * --------------------------------------------------------------------- */
      .at-sunrise {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0500, #180c00);
        border: 1px solid rgba(255,160,0,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        animation: snRise 4s ease-in-out infinite;
      }
      @keyframes snRise {
        0%,100% { box-shadow: 0 0 18px rgba(255,160,0,0.15); }
        50%      { box-shadow: 0 0 40px rgba(255,160,0,0.35); }
      }
      .sn-ray {
        position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
        background: linear-gradient(0deg, rgba(255,160,0,0.14) 0%, transparent 100%);
        animation: snRayPulse 4s ease-in-out infinite; pointer-events: none;
      }
      @keyframes snRayPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      .sn-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 14px rgba(255,160,0,0.9));
        animation: snFloat 4s ease-in-out infinite;
      }
      @keyframes snFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      .sn-content { flex: 1; min-width: 0; position: relative; }
      .sn-right   { flex-shrink: 0; position: relative; }
      .sn-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffa000; margin-bottom: 3px; }
      .sn-title { font-weight: 600; color: #fff8e1; }

      /* -----------------------------------------------------------------------
       * PLANT — deep green growing pulse, ok
       * --------------------------------------------------------------------- */
      .at-plant {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #010d00, #011800);
        border: 1px solid rgba(0,200,83,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 18px rgba(0,200,83,0.06);
      }
      .pn-grow {
        position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
        border-radius: 0 0 12px 12px;
        background: linear-gradient(90deg, #00c853, #69f0ae, #00c853);
        background-size: 200% 100%;
        animation: pnGrow 3s ease-in-out infinite;
      }
      @keyframes pnGrow {
        0%,100% { background-position: 0% 50%;   box-shadow: none; }
        50%      { background-position: 100% 50%; box-shadow: 0 0 10px rgba(0,200,83,0.7); }
      }
      .pn-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 10px rgba(0,200,83,0.7));
        animation: pnPulse 3s ease-in-out infinite;
      }
      @keyframes pnPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      .pn-content { flex: 1; min-width: 0; position: relative; }
      .pn-right   { flex-shrink: 0; position: relative; }
      .pn-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #00c853; margin-bottom: 3px; }
      .pn-title { font-weight: 600; color: #e8f5e9; }

      /* -----------------------------------------------------------------------
       * LOCK — deep blue secure pulse, ok
       * --------------------------------------------------------------------- */
      .at-lock {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #00030d, #000616);
        border: 2px solid #1565c0; border-radius: 12px;
        position: relative; overflow: hidden;
        animation: loSecure 3s ease-in-out infinite;
      }
      @keyframes loSecure {
        0%,100% { box-shadow: 0 0 18px rgba(21,101,192,0.3); border-color: #1565c0; }
        50%      { box-shadow: 0 0 38px rgba(21,101,192,0.6); border-color: #1976d2; }
      }
      .lo-scan {
        position: absolute; top: -100%; left: 0; right: 0; height: 100%;
        background: linear-gradient(180deg, transparent 0%, rgba(21,101,192,0.1) 50%, transparent 100%);
        animation: loScan 4s linear infinite; pointer-events: none;
      }
      @keyframes loScan { to { top: 200%; } }
      .lo-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        filter: drop-shadow(0 0 12px rgba(21,101,192,0.9));
        animation: loPulse 3s ease-in-out infinite;
      }
      @keyframes loPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      .lo-content { flex: 1; min-width: 0; position: relative; }
      .lo-right   { flex-shrink: 0; position: relative; }
      .lo-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1976d2; margin-bottom: 3px; }
      .lo-title { font-weight: 600; color: #e3f2fd; }

      /* -----------------------------------------------------------------------
       * LIGHT — warm incandescent bulb glow, info
       * --------------------------------------------------------------------- */
      .at-light {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #0d0b00, #1a1500);
        border: 1px solid rgba(255,214,0,0.4); border-radius: 12px;
        position: relative; overflow: hidden;
        animation: liGlow 2.8s ease-in-out infinite;
      }
      @keyframes liGlow {
        0%,100% { box-shadow: 0 0 20px rgba(255,214,0,0.10); }
        50%      { box-shadow: 0 0 48px rgba(255,214,0,0.30); }
      }
      .li-beam {
        position: absolute; top: 0; bottom: 0; left: -10px;
        width: 55%; clip-path: polygon(0 50%, 100% 0%, 100% 100%);
        background: linear-gradient(90deg, rgba(255,214,0,0.20) 0%, transparent 100%);
        animation: liBeam 2.8s ease-in-out infinite; pointer-events: none;
      }
      @keyframes liBeam { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      .li-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: liFlare 2.8s ease-in-out infinite;
      }
      @keyframes liFlare {
        0%,100% { filter: drop-shadow(0 0 8px  rgba(255,214,0,0.6));  transform: scale(1);    }
        50%      { filter: drop-shadow(0 0 26px rgba(255,228,100,1.0)); transform: scale(1.09); }
      }
      .li-content { flex: 1; min-width: 0; position: relative; }
      .li-right   { flex-shrink: 0; position: relative; }
      .li-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ffd600; margin-bottom: 3px; }
      .li-title { font-weight: 600; color: #fffde7; }

      /* -----------------------------------------------------------------------
       * MUSIC — floating notes, purple/magenta pulsing, info
       * --------------------------------------------------------------------- */
      .at-music {
        display: flex; align-items: center; gap: 14px; padding: 16px 18px;
        background: linear-gradient(135deg, #1a001a, #2e0033);
        border: 1px solid color-mix(in srgb, var(--mu-accent, #e040fb) 40%, transparent); border-radius: 12px;
        position: relative; overflow: hidden;
        animation: muGlow 2.4s ease-in-out infinite;
      }
      @keyframes muGlow {
        0%,100% { box-shadow: 0 0 20px color-mix(in srgb, var(--mu-accent, #e040fb) 10%, transparent); }
        50%      { box-shadow: 0 0 50px color-mix(in srgb, var(--mu-accent, #e040fb) 35%, transparent); }
      }
      .mu-notes {
        position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      }
      .mu-note {
        position: absolute; bottom: -20px; font-size: 1rem; opacity: 0;
        animation: muFloat 3s ease-in infinite;
      }
      .mu-note:nth-child(1) { left: 12%; animation-delay: 0s;    animation-duration: 3.2s; }
      .mu-note:nth-child(2) { left: 32%; animation-delay: 0.9s;  animation-duration: 2.7s; }
      .mu-note:nth-child(3) { left: 58%; animation-delay: 1.7s;  animation-duration: 3.5s; }
      .mu-note:nth-child(4) { left: 78%; animation-delay: 0.4s;  animation-duration: 2.5s; }
      @keyframes muFloat {
        0%   { transform: translateY(0)   rotate(-10deg); opacity: 0;   }
        20%  { opacity: 0.85; }
        80%  { opacity: 0.4;  }
        100% { transform: translateY(-75px) rotate(18deg); opacity: 0;  }
      }
      .mu-icon {
        font-size: 2.2rem; flex-shrink: 0; position: relative;
        animation: muPulse 1.2s ease-in-out infinite;
      }
      @keyframes muPulse {
        0%,100% { filter: drop-shadow(0 0 8px  color-mix(in srgb, var(--mu-accent, #e040fb) 60%, transparent));  transform: scale(1);    }
        50%      { filter: drop-shadow(0 0 26px var(--mu-accent, #e040fb));  transform: scale(1.12); }
      }
      .mu-content { flex: 1; min-width: 0; position: relative; }
      .mu-right   { flex-shrink: 0; position: relative; }
      .mu-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--mu-accent, #e040fb); margin-bottom: 3px; }
      .mu-title { font-weight: 600; color: #f3e5f5; }

      /* --- Music player mode ------------------------------------------------ */
      .at-music--player { padding: 0; min-height: 90px; align-items: stretch; }
      .mu-art-bg {
        position: absolute; inset: 0; background-size: cover; background-position: center;
        filter: blur(14px) brightness(0.4) saturate(1.5); transform: scale(1.1);
      }
      .mu-art-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(90deg, rgba(12,0,22,0.93) 0%, rgba(12,0,22,0.62) 52%, rgba(12,0,22,0.12) 100%);
      }
      .mu-player-body {
        position: relative; flex: 1; display: flex;
        flex-direction: column; justify-content: center;
        padding: 12px 16px; gap: 5px; min-width: 0;
      }
      .mu-now-playing { display: flex; align-items: center; gap: 6px; margin-bottom: 1px; }
      .mu-np-label {
        font-size: 0.52rem; font-weight: 800; letter-spacing: 2.5px;
        text-transform: uppercase; color: var(--mu-accent, #e040fb);
      }
      .mu-eq { display: flex; align-items: flex-end; gap: 2px; height: 13px; }
      .mu-eq-bar {
        display: inline-block; width: 3px; background: var(--mu-accent, #e040fb); border-radius: 2px;
        animation: muEq 0.7s ease-in-out infinite alternate;
      }
      .mu-eq-bar:nth-child(1) { animation-duration: 0.55s; animation-delay: 0s; }
      .mu-eq-bar:nth-child(2) { animation-duration: 0.8s;  animation-delay: 0.12s; }
      .mu-eq-bar:nth-child(3) { animation-duration: 0.5s;  animation-delay: 0.27s; }
      @keyframes muEq { from { height: 3px; } to { height: 13px; } }
      .mu-pause-dot { font-size: 0.45rem; color: color-mix(in srgb, var(--mu-accent, #e040fb) 55%, transparent); }
      .mu-player-info { min-width: 0; }
      .mu-player-title {
        font-weight: 800; font-size: 1.05rem; color: #ffffff; letter-spacing: -0.2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mu-player-artist {
        font-size: 0.78rem; color: rgba(255,255,255,0.52); margin-top: 1px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .mu-player-controls { display: flex; align-items: center; gap: 8px; margin-top: 7px; }
      .mu-ctrl-btn {
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
        border-radius: 50%; width: 34px; height: 34px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.82); transition: all 0.15s ease; padding: 0;
        --mdc-icon-size: 18px;
      }
      .mu-ctrl-btn:hover {
        background: color-mix(in srgb, var(--mu-accent, #e040fb) 28%, transparent);
        border-color: color-mix(in srgb, var(--mu-accent, #e040fb) 55%, transparent);
        color: #fff; transform: scale(1.1);
      }
      .mu-ctrl-btn--play {
        width: 44px; height: 44px; --mdc-icon-size: 22px;
        background: color-mix(in srgb, var(--mu-accent, #e040fb) 35%, transparent);
        border-color: color-mix(in srgb, var(--mu-accent, #e040fb) 70%, transparent);
        color: #fff; box-shadow: 0 0 18px color-mix(in srgb, var(--mu-accent, #e040fb) 45%, transparent);
      }
      .mu-ctrl-btn--play:hover {
        background: color-mix(in srgb, var(--mu-accent, #e040fb) 55%, transparent);
        box-shadow: 0 0 28px color-mix(in srgb, var(--mu-accent, #e040fb) 65%, transparent);
      }
      .mu-ctrl-btn--active {
        background: color-mix(in srgb, var(--mu-accent, #e040fb) 38%, transparent);
        border-color: var(--mu-accent, #e040fb); color: var(--mu-accent, #e040fb);
      }
      .mu-vol-slider {
        flex: 1; min-width: 40px; height: 4px;
        -webkit-appearance: none; appearance: none;
        border-radius: 2px; outline: none; cursor: pointer;
        transition: opacity 0.2s; border: none; padding: 0;
      }
      .mu-vol-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px; height: 14px; border-radius: 50%;
        background: var(--mu-accent, #e040fb);
        box-shadow: 0 0 8px color-mix(in srgb, var(--mu-accent, #e040fb) 60%, transparent);
        cursor: pointer;
      }
      .mu-vol-slider::-moz-range-thumb {
        width: 14px; height: 14px; border-radius: 50%; border: none;
        background: var(--mu-accent, #e040fb);
        box-shadow: 0 0 8px color-mix(in srgb, var(--mu-accent, #e040fb) 60%, transparent);
        cursor: pointer;
      }
      .mu-vol-slider--muted { opacity: 0.35; }
      .mu-art-thumb {
        position: relative; flex-shrink: 0;
        width: 82px; height: 82px; object-fit: cover; border-radius: 50%;
        margin: auto 14px auto 0;
        border: 2px solid color-mix(in srgb, var(--mu-accent, #e040fb) 45%, transparent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--mu-accent, #e040fb) 12%, transparent), 0 4px 22px rgba(0,0,0,0.55);
      }
      .mu-art-thumb--playing {
        animation: muSpin 10s linear infinite;
        border-color: var(--mu-accent, #e040fb);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--mu-accent, #e040fb) 20%, transparent),
                    0 0 32px color-mix(in srgb, var(--mu-accent, #e040fb) 55%, transparent),
                    0 4px 22px rgba(0,0,0,0.55);
      }
      @keyframes muSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .mu-accent-line {
        position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent 0%,
          color-mix(in srgb, var(--mu-accent, #e040fb) 60%, black) 25%,
          var(--mu-accent, #e040fb) 50%,
          color-mix(in srgb, var(--mu-accent, #e040fb) 60%, black) 75%,
          transparent 100%);
        animation: muLineShift 4s ease-in-out infinite;
      }
      @keyframes muLineShift {
        0%,100% { opacity: 0.45; }
        50%      { opacity: 1; }
      }
      .mu-player-right {
        position: relative; flex-shrink: 0;
        display: flex; align-items: center; padding: 14px 16px 14px 0;
      }

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
        z-index: 20;
        pointer-events: none; /* invisible until card is hovered */
      }
      .atc-snooze-host:hover .atc-snooze-wrap,
      .atc-snooze-host.atc-touch-active .atc-snooze-wrap {
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
      .atc-snooze-host:hover .atc-snooze-btn,
      .atc-snooze-host.atc-touch-active .atc-snooze-btn {
        opacity: 0.65;
      }
      .atc-snooze-btn:hover {
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.65);
      }
      /* Dismiss wrap: always clickable; base position matches snooze/history defaults */
      .atc-dismiss-wrap {
        pointer-events: auto !important;
        top: 6px !important;
        right: 7px !important;
      }
      .atc-large-buttons .atc-dismiss-wrap {
        top: 50% !important;
        right: 14px !important;
        transform: translateY(-50%) !important;
      }
      .atc-vertical.atc-large-buttons .atc-dismiss-wrap {
        top: 20px !important;
        right: 16px !important;
        transform: none !important;
      }
      .atc-dismiss-btn {
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.42) !important;
        border: 1px solid rgba(255, 80, 80, 0.38) !important;
        color: rgba(255, 150, 150, 0.88);
        font-weight: 700;
        font-size: 0.68rem;
      }
      .atc-dismiss-btn:hover {
        background: rgba(160, 20, 20, 0.58) !important;
        border-color: rgba(255, 100, 100, 0.65) !important;
        color: #fff;
      }
      .atc-large-buttons .atc-dismiss-btn {
        font-size: 0.9rem !important;
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
        z-index: 20;
      }
      .atc-snooze-host:hover .atc-history-btn,
      .atc-snooze-host.atc-touch-active .atc-history-btn {
        opacity: 1;
        pointer-events: auto;
      }

      /* -----------------------------------------------------------------------
       * NAV BUTTONS (◀ ▶) — side-edge navigation, visible on hover / touch
       * --------------------------------------------------------------------- */
      .atc-touch-zone {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: 22%;
        min-width: 56px;
        z-index: 5;
        cursor: default;
      }
      .atc-animating .atc-touch-zone {
        pointer-events: none !important;
      }
      .atc-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 22px;
        height: 34px;
        border: none;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.35);
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.3rem;
        line-height: 1;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s, background 0.18s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        z-index: 20;
      }
      .atc-nav-prev { left: 3px; }
      .atc-nav-next { right: 3px; }
      .atc-snooze-host:hover .atc-nav-btn,
      .atc-snooze-host.atc-touch-active .atc-nav-btn {
        opacity: 0.7;
        pointer-events: auto;
      }
      .atc-nav-btn:hover {
        opacity: 1 !important;
        background: rgba(0, 0, 0, 0.6);
      }

      /* -----------------------------------------------------------------------
       * LARGE BUTTONS MODE (large_buttons: true)
       * Two large circular icon-only buttons, side by side, vertically centred right.
       * --------------------------------------------------------------------- */
      .atc-large-buttons .atc-snooze-wrap {
        pointer-events: auto;
        top: 50%;
        bottom: auto;
        right: 8px;
        transform: translateY(-50%);
      }
      .atc-large-buttons .atc-snooze-btn {
        opacity: 1 !important;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        padding: 0;
        font-size: 1rem;
        background: rgba(0,0,0,0.50);
        border: 1px solid rgba(255,255,255,0.20);
      }
      .atc-large-buttons .atc-snooze-btn::after {
        content: none;
      }
      .atc-large-buttons .atc-history-btn {
        opacity: 1 !important;
        pointer-events: auto;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        padding: 0;
        font-size: 1rem;
        background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.14);
        top: 50%;
        bottom: auto;
        right: 46px;   /* 8 + 30 + 8 gap */
        left: auto;
        transform: translateY(-50%);
      }
      .atc-large-buttons .atc-history-btn::after {
        content: none;
      }
      /* Hide all floating buttons during card transition animation */
      .atc-animating .atc-snooze-wrap,
      .atc-animating .atc-history-btn,
      .atc-animating .atc-nav-btn {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity 0.15s ease;
      }
      /* Nav arrow: push right arrow past both large buttons (history at 46+30=76px) */
      .atc-large-buttons .atc-nav-next {
        right: 84px;
      }
      /* Hide per-theme right columns + counters when large_buttons is on */
      .atc-large-buttons .alert-counter,
      .atc-large-buttons [class*="-right"] {
        display: none;
      }
      /* All theme cards: add padding-right so content never sits under the circular buttons */
      .atc-large-buttons .at-fold-wrapper > div:not(.atc-history-card) {
        padding-right: 88px !important;
      }
      /* Overlay counter — top-right corner, always inside the card */
      .alert-counter-overlay {
        position: absolute;
        top: 5px;
        right: 7px;
        font-size: 0.68rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.55);
        letter-spacing: 0.5px;
        white-space: nowrap;
        z-index: 11;
        pointer-events: none;
      }
      .alert-counter-overlay .counter-sep {
        opacity: 0.4;
      }

      /* -----------------------------------------------------------------------
       * PLACEHOLDER — shown when no alerts are active and show_when_clear is off
       * --------------------------------------------------------------------- */
      .atc-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 18px;
        border: 1px dashed rgba(128,128,128,0.35);
        border-radius: 12px;
        opacity: 0.45;
        color: var(--primary-text-color, #aaa);
        background: transparent;
        min-height: 42px;
        box-sizing: border-box;
      }
      .atc-placeholder-icon { font-size: 1rem; }
      .atc-placeholder-text { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.4px; }

      /* -----------------------------------------------------------------------
       * TEST MODE BANNER
       * --------------------------------------------------------------------- */
      .atc-card-root {
        display: flex;
        flex-direction: column;
        justify-content: center;
        outline: var(--atc-card-outline, none);
        outline-offset: -1px;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .atc-inner-clip {
        overflow: hidden;
        height: var(--atc-card-height, auto);
        border-radius: var(--ha-card-border-radius, 12px);
        position: relative;
        z-index: 1;
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
        border-radius: var(--ha-card-border-radius, 12px);
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
        scrollbar-gutter: stable;
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
      .atc-history-entity {
        display: flex;
        align-items: baseline;
        gap: 5px;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .atc-history-entity-name {
        font-size: 0.78rem;
        font-weight: 600;
        opacity: 0.75;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .atc-history-entity-state {
        font-size: 0.75rem;
        opacity: 0.55;
        flex-shrink: 0;
      }
      .atc-history-secondary .atc-history-entity-name {
        font-weight: 400;
        opacity: 0.55;
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
        padding: 16px 18px;
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
        padding: 16px 18px;
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
       * HA THEME ADAPTATION — ha_theme: true
       * Overrides hardcoded dark palettes with HA CSS custom properties.
       * Compatible with any HA theme including Mushroom, Material, etc.
       * --------------------------------------------------------------------- */

      /* Card background */
      .atc-ha-theme .at-fold-wrapper > div:not(.atc-history-card) {
        background: var(--card-background-color, #1c1c2e) !important;
      }
      /* Disable decorative gradient overlays / pulsing backgrounds */
      .atc-ha-theme .at-fold-wrapper > div:not(.atc-history-card)::before,
      .atc-ha-theme .at-fold-wrapper > div:not(.atc-history-card)::after {
        display: none !important;
      }
      /* All titles / messages → primary text color */
      .atc-ha-theme [class$="-title"],
      .atc-ha-theme [class$="-msg"],
      .atc-ha-theme [class$="-message"] {
        color: var(--primary-text-color, inherit) !important;
        text-shadow: none !important;
      }
      /* Secondary / badge text → secondary text color */
      .atc-ha-theme [class$="-secondary"],
      .atc-ha-theme [class$="-sub"],
      .atc-ha-theme .atc-secondary-value {
        color: var(--secondary-text-color, rgba(0,0,0,0.6)) !important;
      }
      /* Alert counter (e.g. "2/3") → secondary text color */
      .atc-ha-theme .alert-counter,
      .atc-ha-theme .alert-counter-overlay {
        color: var(--secondary-text-color, rgba(0,0,0,0.55)) !important;
      }

      /* ── Critical ── */
      .atc-ha-theme .at-emergency,
      .atc-ha-theme .at-alarm,
      .atc-ha-theme .at-fire,
      .atc-ha-theme .at-lightning,
      .atc-ha-theme .at-nuclear,
      .atc-ha-theme .at-flood,
      .atc-ha-theme .at-motion,
      .atc-ha-theme .at-intruder,
      .atc-ha-theme .at-toxic {
        border: 1px solid var(--error-color, #e53935) !important;
      }
      .atc-ha-theme .at-emergency [class$="-badge"],
      .atc-ha-theme .at-alarm     [class$="-badge"],
      .atc-ha-theme .at-fire      [class$="-badge"],
      .atc-ha-theme .at-lightning [class$="-badge"],
      .atc-ha-theme .at-nuclear   [class$="-badge"],
      .atc-ha-theme .at-flood     [class$="-badge"],
      .atc-ha-theme .at-motion    [class$="-badge"],
      .atc-ha-theme .at-intruder  [class$="-badge"],
      .atc-ha-theme .at-toxic     [class$="-badge"] {
        color: var(--error-color, #e53935) !important;
      }

      /* ── Warning ── */
      .atc-ha-theme .at-warning,
      .atc-ha-theme .at-caution,
      .atc-ha-theme .at-radar,
      .atc-ha-theme .at-temperature,
      .atc-ha-theme .at-battery,
      .atc-ha-theme .at-door,
      .atc-ha-theme .at-smoke,
      .atc-ha-theme .at-wind,
      .atc-ha-theme .at-leak {
        border: 1px solid var(--warning-color, #ff9800) !important;
      }
      .atc-ha-theme .at-warning     [class$="-badge"],
      .atc-ha-theme .at-caution     [class$="-badge"],
      .atc-ha-theme .at-radar       [class$="-badge"],
      .atc-ha-theme .at-temperature [class$="-badge"],
      .atc-ha-theme .at-battery     [class$="-badge"],
      .atc-ha-theme .at-door        [class$="-badge"],
      .atc-ha-theme .at-smoke       [class$="-badge"],
      .atc-ha-theme .at-wind        [class$="-badge"],
      .atc-ha-theme .at-leak        [class$="-badge"] {
        color: var(--warning-color, #ff9800) !important;
      }

      /* ── Info / Style ── */
      .atc-ha-theme .at-info,
      .atc-ha-theme .at-notification,
      .atc-ha-theme .at-aurora,
      .atc-ha-theme .at-neon,
      .atc-ha-theme .at-glass,
      .atc-ha-theme .at-matrix,
      .atc-ha-theme .at-minimal,
      .atc-ha-theme .at-retro,
      .atc-ha-theme .at-hologram,
      .atc-ha-theme .at-heartbeat,
      .atc-ha-theme .at-presence,
      .atc-ha-theme .at-update,
      .atc-ha-theme .at-cloud,
      .atc-ha-theme .at-satellite,
      .atc-ha-theme .at-tips,
      .atc-ha-theme .at-light,
      .atc-ha-theme .at-music,
      .atc-ha-theme .at-cyberpunk,
      .atc-ha-theme .at-vapor,
      .atc-ha-theme .at-ticker {
        border: 1px solid var(--info-color, var(--primary-color, #2196f3)) !important;
      }
      .atc-ha-theme .at-info         [class$="-badge"],
      .atc-ha-theme .at-notification [class$="-badge"],
      .atc-ha-theme .at-aurora       [class$="-badge"],
      .atc-ha-theme .at-neon         [class$="-badge"],
      .atc-ha-theme .at-glass        [class$="-badge"],
      .atc-ha-theme .at-matrix       [class$="-badge"],
      .atc-ha-theme .at-minimal      [class$="-badge"],
      .atc-ha-theme .at-retro        [class$="-badge"],
      .atc-ha-theme .at-hologram     [class$="-badge"],
      .atc-ha-theme .at-heartbeat    [class$="-badge"],
      .atc-ha-theme .at-presence     [class$="-badge"],
      .atc-ha-theme .at-update       [class$="-badge"],
      .atc-ha-theme .at-cloud        [class$="-badge"],
      .atc-ha-theme .at-satellite    [class$="-badge"],
      .atc-ha-theme .at-tips         [class$="-badge"],
      .atc-ha-theme .at-light        [class$="-badge"],
      .atc-ha-theme .at-music        [class$="-badge"],
      .atc-ha-theme .at-cyberpunk    [class$="-badge"],
      .atc-ha-theme .at-vapor        [class$="-badge"],
      .atc-ha-theme .at-ticker       [class$="-badge"] {
        color: var(--info-color, var(--primary-color, #2196f3)) !important;
      }

      /* ── Ok / Success ── */
      .atc-ha-theme .at-success,
      .atc-ha-theme .at-check,
      .atc-ha-theme .at-confetti,
      .atc-ha-theme .at-shield,
      .atc-ha-theme .at-power,
      .atc-ha-theme .at-sunrise,
      .atc-ha-theme .at-plant,
      .atc-ha-theme .at-lock {
        border: 1px solid var(--success-color, #43a047) !important;
      }
      .atc-ha-theme .at-success  [class$="-badge"],
      .atc-ha-theme .at-check    [class$="-badge"],
      .atc-ha-theme .at-confetti [class$="-badge"],
      .atc-ha-theme .at-shield   [class$="-badge"],
      .atc-ha-theme .at-power    [class$="-badge"],
      .atc-ha-theme .at-sunrise  [class$="-badge"],
      .atc-ha-theme .at-plant    [class$="-badge"],
      .atc-ha-theme .at-lock     [class$="-badge"] {
        color: var(--success-color, #43a047) !important;
      }

      /* ── Timers ── */
      .atc-ha-theme .at-countdown,
      .atc-ha-theme .at-hourglass,
      .atc-ha-theme .at-timer-pulse,
      .atc-ha-theme .at-timer-ring {
        background: var(--card-background-color, #1c1c2e) !important;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.12)) !important;
      }

      /* ── Decorative elements reset ── */
      .atc-ha-theme [class$="-fill"],
      .atc-ha-theme [class$="-drain"],
      .atc-ha-theme [class$="-bg"],
      .atc-ha-theme [class$="-glow"],
      .atc-ha-theme [class$="-ring"]:not(.tr2-ring-wrap) {
        opacity: 0.25 !important;
      }
      /* Icon filters → remove neon/glow effects */
      .atc-ha-theme [class$="-icon"] {
        filter: none !important;
        text-shadow: none !important;
      }
      /* MDI icon color → readable in both light and dark mode.
       * No !important so that per-alert icon_color inline style takes precedence. */
      .atc-ha-theme .atc-ha-icon {
        color: var(--primary-text-color, inherit);
      }

      /* ── UI chrome: readable in light mode ── */
      /* History panel buttons */
      .atc-ha-theme .atc-history-clear {
        border-color: var(--divider-color, rgba(0,0,0,0.2)) !important;
        color: var(--secondary-text-color, rgba(0,0,0,0.55)) !important;
      }
      .atc-ha-theme .atc-history-clear:hover {
        border-color: var(--primary-text-color, rgba(0,0,0,0.6)) !important;
        color: var(--primary-text-color, rgba(0,0,0,0.85)) !important;
      }
      .atc-ha-theme .atc-history-close {
        color: var(--secondary-text-color, rgba(0,0,0,0.55)) !important;
      }
      /* Snooze dropdown menu */
      .atc-ha-theme .atc-snooze-menu {
        background: var(--card-background-color, #fff) !important;
        border-color: var(--divider-color, rgba(0,0,0,0.12)) !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15) !important;
      }
      .atc-ha-theme .atc-snooze-label {
        color: var(--secondary-text-color, rgba(0,0,0,0.4)) !important;
      }
      .atc-ha-theme .atc-snooze-option {
        background: var(--secondary-background-color, rgba(0,0,0,0.04)) !important;
        color: var(--primary-text-color, rgba(0,0,0,0.85)) !important;
      }
      .atc-ha-theme .atc-snooze-option:hover {
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.1) !important;
      }
      /* Snoozed-all indicator bar */
      .atc-ha-theme .atc-snoozed-bar {
        background: var(--secondary-background-color, rgba(0,0,0,0.04)) !important;
        border-color: var(--divider-color, rgba(0,0,0,0.12)) !important;
      }
      .atc-ha-theme .atc-snoozed-text {
        color: var(--secondary-text-color, rgba(0,0,0,0.55)) !important;
      }
      .atc-ha-theme .atc-snoozed-reset {
        background: var(--secondary-background-color, rgba(0,0,0,0.06)) !important;
        border-color: var(--divider-color, rgba(0,0,0,0.18)) !important;
        color: var(--primary-text-color, rgba(0,0,0,0.7)) !important;
      }
      /* Snoozed pill (partial snooze) */
      .atc-ha-theme .atc-snoozed-pill {
        background: var(--secondary-background-color, rgba(0,0,0,0.08)) !important;
        border-color: var(--divider-color, rgba(0,0,0,0.15)) !important;
        color: var(--primary-text-color, inherit) !important;
      }

      /* -----------------------------------------------------------------------
       * VERTICAL LAYOUT  (vertical: true)
       * Single CSS class switches all standard themes to column stacking.
       * Ticker is excluded — horizontal scrolling doesn't translate to vertical.
       * Uses [class$="…"] suffix selectors to cover all 40 themes at once.
       * --------------------------------------------------------------------- */

      /* Height propagation: fill HA grid cell when enlarged */
      .atc-vertical {
        height: 100%;
      }
      .atc-vertical .at-fold-wrapper {
        height: 100%;
      }
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.atc-snoozed-bar):not(.atc-history-card):not(.at-music--player) {
        height: 100% !important;
        min-height: unset !important;
      }

      /* Core: flip theme card to vertical stacking */
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.atc-snoozed-bar):not(.atc-history-card):not(.at-music--player) {
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        padding: 20px 18px 16px !important;
        gap: 6px !important;
      }

      /* Icon: was flex-shrink on left edge, now centered at top */
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.at-music--player) > [class$="-icon"],
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.at-music--player) > [class$="-icon-wrap"] {
        flex-shrink: 0;
        font-size: 2.2rem !important;
        width: auto !important;
        height: auto !important;
        margin: 0 0 2px 0 !important;
      }

      /* Content area: full width, centered text */
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.at-music--player) > [class$="-content"] {
        flex: unset !important;
        width: 100% !important;
        min-width: unset !important;
        text-align: center !important;
      }

      /* Right column: reset horizontal flex, center counter below content */
      .atc-vertical .at-fold-wrapper > div:not(.at-ticker):not(.at-music--player) > [class$="-right"] {
        flex-shrink: 0;
        align-self: center !important;
        flex-direction: row !important;
        justify-content: center !important;
        gap: 6px !important;
      }

      /* Counter badge alignment in vertical mode */
      .atc-vertical .alert-counter {
        text-align: center;
      }

      /* Timer ring: stack SVG ring below the text content */
      .atc-vertical .at-timer-ring {
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        padding: 20px 18px 16px !important;
      }
      .atc-vertical .tr2-content {
        text-align: center !important;
        width: 100%;
      }
      .atc-vertical .tr2-ring-wrap {
        margin-top: 8px;
        flex-shrink: 0;
      }

      /* Matrix theme: center the scrolling text */
      .atc-vertical .mx-content {
        text-align: center !important;
        justify-content: center !important;
      }

      /* Radar theme: hide absolute-positioned sonar display, reset counter and content padding */
      .atc-vertical .rd-display { display: none; }
      .atc-vertical .rd-right   { position: static !important; transform: none !important; }
      .atc-vertical .rd-content { padding-right: 0 !important; }

      /* Lightning theme: hide decorative background bolt (was absolute right-side element) */
      .atc-vertical .lt-bolt { display: none; }

      /* Snooze/history buttons: keep top-right corner positioning (unchanged) */
      /* large_buttons + vertical: cancel the padding-right (content is centered),
         move buttons to top-right corner instead of vertically centered */
      .atc-vertical.atc-large-buttons .at-fold-wrapper > div:not(.at-ticker) {
        padding-right: 18px !important;
      }
      .atc-vertical.atc-large-buttons .atc-snooze-wrap {
        top: 20px !important;
        right: 16px !important;
        bottom: auto !important;
        transform: none !important;
      }
      .atc-vertical.atc-large-buttons .atc-history-btn {
        top: 20px !important;
        bottom: auto !important;
        transform: none !important;
      }
      /* In vertical mode buttons are top-right — nav arrow goes back to normal position */
      .atc-vertical.atc-large-buttons .atc-nav-next {
        right: 3px !important;
      }
      /* Counter at bottom-right in vertical + large_buttons mode */
      .atc-vertical.atc-large-buttons .alert-counter-overlay {
        top: auto !important;
        bottom: 5px !important;
        right: 7px !important;
      }

      /* -----------------------------------------------------------------------
       * MDI ICON — transparent background/border/shadow/filter when ha-icon
       * is used. Class 'atc-has-mdi-icon' is stamped by updated() on the
       * direct parent of .atc-ha-icon, covering both -icon and -icon-wrap
       * patterns across all 40 themes without requiring :has() support.
       * --------------------------------------------------------------------- */
      .atc-has-mdi-icon {
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
      }

      /* -----------------------------------------------------------------------
       * CLICKABLE CARD — entire card acts as action trigger
       * --------------------------------------------------------------------- */
      .atc-clickable {
        cursor: pointer;
      }
      .atc-clickable:active > div {
        opacity: 0.85;
        transition: opacity 0.1s;
      }

      /* -----------------------------------------------------------------------
       * TEXT ALIGN CENTER — activated by atc-center-text host class when
       * text_align: center is set in card config.
       * --------------------------------------------------------------------- */
      :host(.atc-center-text) [class$="-content"] {
        text-align: center;
      }

      /* -----------------------------------------------------------------------
       * CLEAR WIDGET — clock / weather / weather+clock
       * --------------------------------------------------------------------- */
      .atc-clear-widget {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: inherit;
        display: flex;
        align-items: stretch;
      }
      .atc-clear-clock {
        min-height: 68px;
        background: linear-gradient(135deg, #060c1c 0%, #0c1a3a 45%, #0a1428 75%, #060c1c 100%);
        align-items: center;
        justify-content: center;
      }
      /* Subtle deep-blue ambient glow that breathes */
      .atc-ck-bg {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse 65% 150% at 50% 50%,
          rgba(50,110,255,0.11) 0%, rgba(80,60,200,0.06) 45%, transparent 75%);
      }
      /* Sharp inner glow behind the digits */
      .atc-ck-glow {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse 40% 80% at 50% 45%,
          rgba(100,160,255,0.07) 0%, transparent 70%);
        animation: atc-ck-pulse 5s ease-in-out infinite;
      }
      @keyframes atc-ck-pulse {
        0%, 100% { opacity: 0.6; }
        50%       { opacity: 1; }
      }
      /* Content stack */
      .atc-ck-content {
        position: relative; z-index: 2;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 3px;
      }
      /* Time digits */
      .atc-ck-time {
        font-size: 2.05rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.12em;
        line-height: 1;
        color: #dce8ff;
        text-shadow:
          0 0 18px rgba(90,150,255,0.55),
          0 0 40px rgba(60,110,255,0.25),
          0 2px 8px rgba(0,0,0,0.65);
      }
      /* Date line */
      .atc-ck-date {
        font-size: 0.6rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(148,175,255,0.52);
        line-height: 1;
      }

      /* ── CLOCK STYLE: aurora ─────────────────────────────────────────── */
      .atc-ck-style--aurora {
        background: linear-gradient(135deg, #020d0a 0%, #041a10 40%, #061220 75%, #020d0a 100%);
      }
      .atc-ck-style--aurora .atc-ck-bg {
        background: radial-gradient(ellipse 80% 50% at 30% 60%, rgba(0,220,120,0.18) 0%, transparent 70%),
                    radial-gradient(ellipse 60% 40% at 70% 40%, rgba(80,40,200,0.20) 0%, transparent 65%),
                    radial-gradient(ellipse 50% 35% at 50% 80%, rgba(0,180,160,0.12) 0%, transparent 60%);
        animation: atc-aurora-shift 8s ease-in-out infinite alternate;
      }
      @keyframes atc-aurora-shift {
        0%   { opacity: 0.7; transform: scaleX(1)   scaleY(1); }
        50%  { opacity: 1;   transform: scaleX(1.08) scaleY(1.04); }
        100% { opacity: 0.8; transform: scaleX(0.95) scaleY(1.06); }
      }
      .atc-ck-style--aurora .atc-ck-glow {
        background: radial-gradient(ellipse 55% 40% at 50% 50%, rgba(0,220,120,0.22) 0%, transparent 70%);
        animation: atc-ck-pulse 6s ease-in-out infinite;
      }
      .atc-ck-style--aurora .atc-ck-time {
        color: #a0ffd6;
        text-shadow: 0 0 18px rgba(0,220,120,0.6), 0 0 40px rgba(0,180,100,0.3);
      }
      .atc-ck-style--aurora .atc-ck-date {
        color: rgba(0,220,140,0.55);
      }

      /* ── CLOCK STYLE: gold ───────────────────────────────────────────── */
      .atc-ck-style--gold {
        background: linear-gradient(135deg, #080600 0%, #120e00 40%, #0e0a00 70%, #080600 100%);
      }
      .atc-ck-style--gold .atc-ck-bg {
        background: radial-gradient(ellipse 70% 50% at 50% 55%, rgba(200,150,0,0.14) 0%, transparent 70%),
                    radial-gradient(ellipse 40% 30% at 25% 35%, rgba(255,200,50,0.08) 0%, transparent 60%);
      }
      .atc-ck-style--gold .atc-ck-glow {
        background: radial-gradient(ellipse 50% 35% at 50% 50%, rgba(200,140,0,0.20) 0%, transparent 65%);
        animation: atc-ck-pulse 7s ease-in-out infinite;
      }
      .atc-ck-style--gold .atc-ck-time {
        color: #f5d060;
        font-weight: 300;
        letter-spacing: 0.18em;
        text-shadow: 0 0 16px rgba(220,160,0,0.55), 0 0 36px rgba(180,120,0,0.25), 0 2px 6px rgba(0,0,0,0.8);
      }
      .atc-ck-style--gold .atc-ck-date {
        color: rgba(200,155,30,0.55);
        letter-spacing: 0.18em;
      }

      /* ── CLOCK STYLE: matrix ─────────────────────────────────────────── */
      .atc-ck-style--matrix {
        background: #000;
      }
      .atc-ck-style--matrix .atc-ck-bg {
        background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,180,40,0.10) 0%, transparent 70%);
      }
      .atc-ck-style--matrix .atc-ck-glow {
        background: radial-gradient(ellipse 45% 35% at 50% 55%, rgba(0,220,60,0.15) 0%, transparent 65%);
        animation: atc-ck-pulse 4s ease-in-out infinite;
      }
      .atc-ck-style--matrix .atc-ck-time {
        color: #00e840;
        font-family: monospace;
        font-weight: 400;
        letter-spacing: 0.22em;
        text-shadow: 0 0 10px rgba(0,220,50,0.8), 0 0 28px rgba(0,200,40,0.4), 0 0 50px rgba(0,180,30,0.2);
      }
      .atc-ck-style--matrix .atc-ck-date {
        color: rgba(0,200,50,0.50);
        font-family: monospace;
        letter-spacing: 0.18em;
      }

      /* ── WEATHER STYLE: frosted ──────────────────────────────────────── */
      .atc-cw-style--frosted .atc-cw-badge {
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.22);
        border-radius: 14px;
      }
      .atc-cw-style--frosted .atc-cw-temp,
      .atc-cw-style--frosted .atc-cw-clock { color: rgba(255,255,255,0.95); }
      .atc-cw-style--frosted .atc-cw-condition,
      .atc-cw-style--frosted .atc-cw-meta { color: rgba(255,255,255,0.75); }
      .atc-cw-style--frosted .atc-cw-clock-date { color: rgba(255,255,255,0.55); }

      /* ── WEATHER STYLE: solid ────────────────────────────────────────── */
      .atc-cw-style--solid .atc-cw-badge {
        background: rgba(10,12,18,0.90);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.5);
      }
      .atc-cw-style--solid .atc-cw-temp { color: #fff; }
      .atc-cw-style--solid .atc-cw-clock { color: #e8f0ff; letter-spacing: 0.04em; }
      .atc-cw-style--solid .atc-cw-condition { color: rgba(200,210,255,0.80); }
      .atc-cw-style--solid .atc-cw-meta { color: rgba(180,195,230,0.75); }
      .atc-cw-style--solid .atc-cw-clock-date { color: rgba(180,200,255,0.60); }

      /* ── WEATHER STYLE: minimal ──────────────────────────────────────── */
      .atc-cw-style--minimal .atc-cw-badge {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: none;
        box-shadow: none;
        padding: 4px 6px;
      }
      .atc-cw-style--minimal .atc-cw-temp {
        font-size: 1.3rem;
        color: #fff;
        text-shadow: 0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7);
      }
      .atc-cw-style--minimal .atc-cw-clock {
        font-size: 1.4rem;
        text-shadow: 0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7);
      }
      .atc-cw-style--minimal .atc-cw-condition,
      .atc-cw-style--minimal .atc-cw-meta {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
        color: rgba(255,255,255,0.85);
      }
      .atc-cw-style--minimal .atc-cw-clock-date {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
        color: rgba(255,255,255,0.65);
      }
      .atc-cw-style--minimal .atc-cw-w-icon {
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.9));
      }

      /* ── WEATHER STYLE: stage ─────────────────────────────────────────── */
      /* Clock centered on top (large), weather info as a horizontal pill below */
      .atc-cw-style--stage .atc-cw-corners {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 12px;
      }
      .atc-cw-style--stage .atc-cw-badge--clock {
        order: -1;
        align-items: center;
        align-self: center;
        background: none;
        border: none;
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        padding: 0;
      }
      .atc-cw-style--stage .atc-cw-clock {
        font-size: 2.8rem;
        font-weight: 200;
        letter-spacing: 0.20em;
        text-shadow:
          0 2px 8px rgba(0,0,0,0.95),
          0 4px 24px rgba(0,0,0,0.80),
          0 0 60px rgba(0,0,0,0.50);
      }
      .atc-cw-style--stage .atc-cw-clock-date {
        font-size: 0.58rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.75);
        text-shadow:
          0 1px 4px rgba(0,0,0,0.95),
          0 2px 12px rgba(0,0,0,0.80);
      }
      .atc-cw-style--stage .atc-cw-badge--weather {
        flex-direction: row;
        align-items: center;
        gap: 0;
        background: rgba(0,0,0,0.28);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 22px;
        padding: 3px 12px 3px 8px;
      }
      .atc-cw-style--stage .atc-cw-badge-row1 {
        align-items: center;
        gap: 3px;
        padding-right: 8px;
      }
      .atc-cw-style--stage .atc-cw-badge-row2 { display: none; }
      .atc-cw-style--stage .atc-cw-badge-row3 {
        border-left: 1px solid rgba(255,255,255,0.18);
        padding-left: 8px;
      }
      .atc-cw-style--stage .atc-cw-temp {
        font-size: 1.2rem;
        font-weight: 400;
        text-shadow: 0 1px 8px rgba(0,0,0,0.8);
      }
      .atc-cw-style--stage .atc-cw-condition {
        font-size: 0.65rem;
        letter-spacing: 0.06em;
        color: rgba(255,255,255,0.80);
        text-shadow: 0 1px 6px rgba(0,0,0,0.8);
      }
      .atc-cw-style--stage .atc-cw-w-icon { --mdc-icon-size: 20px; }

      /* ── WEATHER STYLE: split ──────────────────────────────────────────── */
      /* Two equal-height panels: left=weather, right=clock */
      .atc-cw-style--split .atc-cw-corners {
        flex-direction: row;
        align-items: stretch;
        justify-content: stretch;
        padding: 0;
        gap: 0;
      }
      .atc-cw-style--split .atc-cw-badge {
        flex: 1;
        border-radius: 0;
        border: none;
        box-shadow: none;
        justify-content: center;
        align-items: center;
        padding: 10px 8px;
      }
      .atc-cw-style--split .atc-cw-badge--weather {
        background: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        align-items: center;
      }
      .atc-cw-style--split .atc-cw-badge--clock {
        background: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        align-items: center;
        align-self: auto;
        justify-content: center;
      }
      .atc-cw-style--split .atc-cw-badge-row1 {
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }
      .atc-cw-style--split .atc-cw-w-icon { --mdc-icon-size: 30px; }
      .atc-cw-style--split .atc-cw-temp {
        font-size: 1.8rem;
        font-weight: 300;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 12px rgba(0,0,0,0.7);
      }
      .atc-cw-style--split .atc-cw-clock {
        font-size: 1.55rem;
        font-weight: 300;
        letter-spacing: 0.10em;
        text-shadow: 0 1px 12px rgba(0,0,0,0.7);
      }
      .atc-cw-style--split .atc-cw-condition,
      .atc-cw-style--split .atc-cw-meta {
        text-shadow: 0 1px 6px rgba(0,0,0,0.8);
      }
      .atc-cw-style--split .atc-cw-clock-date {
        text-shadow: 0 1px 6px rgba(0,0,0,0.8);
      }

      /* ── WEATHER STYLE: cinematic ──────────────────────────────────────── */
      /* Animated bg fills card; clipped by atc-inner-clip (overflow:hidden, position:relative). */
      .atc-cw-style--cinematic.atc-clear-weather {
        min-height: 90px;
      }
      .atc-cw-style--cinematic .atc-cw-corners {
        position: absolute;
        top: 0; left: 0; bottom: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 8px 12px;
        background: linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 100%);
      }
      .atc-cw-style--cinematic .atc-cw-badge {
        background: none;
        border: none;
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        padding: 0;
        min-width: 0;
        flex-shrink: 0;
      }
      /* Clock on top */
      .atc-cw-style--cinematic .atc-cw-badge--clock {
        order: -1;
        align-items: flex-start;
        flex-shrink: 0;
      }
      .atc-cw-style--cinematic .atc-cw-clock {
        font-size: 1.15rem;
        font-weight: 400;
        letter-spacing: 0.08em;
        text-shadow: 0 1px 6px rgba(0,0,0,0.95);
        line-height: 1.2;
      }
      .atc-cw-style--cinematic .atc-cw-clock-date {
        font-size: 0.52rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.65);
        text-shadow: 0 1px 5px rgba(0,0,0,0.95);
        line-height: 1.2;
      }
      /* Weather: icon + temp + condition stacked below clock */
      .atc-cw-style--cinematic .atc-cw-badge--weather {
        flex-direction: row;
        align-items: center;
        gap: 5px;
      }
      .atc-cw-style--cinematic .atc-cw-badge-row1 { gap: 3px; }
      .atc-cw-style--cinematic .atc-cw-badge-row2 {
        gap: 4px;
        opacity: 0.8;
      }
      .atc-cw-style--cinematic .atc-cw-badge-row3 {
        border-left: 1px solid rgba(255,255,255,0.25);
        padding-left: 5px;
      }
      .atc-cw-style--cinematic .atc-cw-temp {
        font-size: 0.95rem;
        font-weight: 500;
        text-shadow: 0 1px 6px rgba(0,0,0,0.95);
      }
      .atc-cw-style--cinematic .atc-cw-condition {
        font-size: 0.58rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        text-shadow: 0 1px 5px rgba(0,0,0,0.95);
      }
      .atc-cw-style--cinematic .atc-cw-w-icon { --mdc-icon-size: 15px; }

      .atc-clear-weather {
        min-height: 68px;
      }
      /* Corner layout container */
      .atc-cw-corners {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 8px 10px;
        width: 100%;
        pointer-events: none;
      }
      /* Frosted glass badge shared style */
      .atc-cw-badge {
        background: rgba(8, 18, 32, 0.65);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 9px;
        padding: 5px 8px;
        pointer-events: auto;
      }
      /* Weather badge — left */
      .atc-cw-badge--weather {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 70px;
      }
      /* Clock badge — right, standalone or corner */
      .atc-cw-badge--clock {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
      }
      /* Row 1: icon + temperature */
      .atc-cw-badge-row1 {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      /* Row 2: wind + humidity */
      .atc-cw-badge-row2 {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      /* Row 3: condition label */
      .atc-cw-badge-row3 {
        display: flex;
        align-items: center;
      }
      .atc-cw-w-icon {
        --mdc-icon-size: 20px;
        color: rgba(255,255,255,0.95);
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7));
        flex-shrink: 0;
      }
      .atc-cw-temp {
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-shadow: 0 1px 6px rgba(0,0,0,0.7);
        letter-spacing: -0.02em;
      }
      .atc-cw-meta {
        font-size: 0.65rem;
        font-weight: 500;
        color: rgba(255,255,255,0.80);
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        white-space: nowrap;
      }
      .atc-cw-condition {
        font-size: 0.65rem;
        font-weight: 600;
        color: rgba(255,255,255,0.70);
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        letter-spacing: 0.01em;
      }
      .atc-cw-clock {
        font-size: 1.3rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.06em;
        color: #fff;
        text-shadow: 0 1px 8px rgba(0,0,0,0.6);
        line-height: 1;
      }
      .atc-cw-clock-date {
        display: block;
        font-size: 0.52rem;
        font-weight: 500;
        letter-spacing: 0.10em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.65);
        line-height: 1.3;
      }

      /* Weather background */
      .weather-bg {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        overflow: hidden; border-radius: inherit; transition: background 1.4s ease;
      }
      .weather-bg::after {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%);
        pointer-events: none; z-index: 1;
      }
      .weather-bg--sunny           { background: linear-gradient(155deg, #0a3a7a 0%, #1260a8 30%, #c27a10 75%, #c8a020 100%); }
      .weather-bg--clear-night     { background: linear-gradient(175deg, #000208 0%, #030b1e 40%, #060d22 70%, #0b1535 100%); }
      .weather-bg--partlycloudy    { background: linear-gradient(155deg, #0d3d80 0%, #1e6aaa 45%, #3a7fc0 100%); }
      .weather-bg--partlycloudy.weather-bg--night { background: linear-gradient(175deg, #020510 0%, #050d22 50%, #0d1a3a 100%); }
      .weather-bg--cloudy          { background: linear-gradient(175deg, #2a3440 0%, #3a4a58 40%, #506070 100%); }
      .weather-bg--fog             { background: linear-gradient(180deg, #3a4450 0%, #566070 50%, #728090 100%); }
      .weather-bg--windy, .weather-bg--windy-variant { background: linear-gradient(145deg, #003028 0%, #004840 40%, #0d6a60 80%, #207870 100%); }
      .weather-bg--rainy           { background: linear-gradient(175deg, #1a237e 0%, #283593 40%, #37474f 100%); }
      .weather-bg--snowy-rainy     { background: linear-gradient(175deg, #1b2a4a 0%, #2e3f6b 50%, #546380 100%); }
      .weather-bg--pouring         { background: linear-gradient(175deg, #090c20 0%, #10152e 40%, #1a2035 100%); }
      .weather-bg--snowy           { background: linear-gradient(175deg, #2a3840 0%, #3e5460 50%, #587080 100%); }
      .weather-bg--hail            { background: linear-gradient(165deg, #263238 0%, #37474f 40%, #546e7a 100%); }
      .weather-bg--lightning       { background: linear-gradient(175deg, #0a0a1f 0%, #12103a 40%, #1e1040 100%); }
      .weather-bg--lightning-rainy { background: linear-gradient(175deg, #050510 0%, #0a0820 40%, #110c28 100%); }
      .weather-bg--exceptional     { background: linear-gradient(145deg, #bf360c 0%, #e64a19 40%, #ff7043 100%); }

      /* Sun */
      .w-sun { position:absolute;top:10%;left:50%;transform:translateX(-50%);pointer-events:none; }
      .sun-core { width:90px;height:90px;border-radius:50%;background:radial-gradient(circle at 38% 36%,#fff8e1 0%,#ffe082 30%,#ffb300 65%,#e65100 100%);box-shadow:0 0 0 10px rgba(255,224,82,.12),0 0 30px 12px rgba(255,193,7,.4),0 0 80px 30px rgba(255,152,0,.3),0 0 140px 60px rgba(230,81,0,.15);animation:sunBreath 4s ease-in-out infinite; }
      @keyframes sunBreath{0%,100%{box-shadow:0 0 0 10px rgba(255,224,82,.12),0 0 30px 12px rgba(255,193,7,.4),0 0 80px 30px rgba(255,152,0,.3),0 0 140px 60px rgba(230,81,0,.15)}50%{box-shadow:0 0 0 18px rgba(255,224,82,.18),0 0 50px 20px rgba(255,193,7,.55),0 0 110px 50px rgba(255,152,0,.35),0 0 180px 80px rgba(230,81,0,.2)}}
      .sun-rays-wrap { position:absolute;inset:-60px;animation:rotateSun 22s linear infinite; }
      @keyframes rotateSun{to{transform:rotate(360deg)}}
      .sun-ray { position:absolute;top:50%;left:50%;transform-origin:0 0;border-radius:2px;background:linear-gradient(to right,rgba(255,236,100,.55),transparent); }
      .sun-halo { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,50,.12) 0%,transparent 70%);animation:haloFloat 6s ease-in-out infinite; }
      @keyframes haloFloat{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-52%) scale(1.08)}}

      /* Stars / Moon / Aurora */
      .w-star{border-radius:50%;background:#fff;position:absolute}
      .w-star.t0{animation:twinkle0 3.1s ease-in-out infinite}.w-star.t1{animation:twinkle1 4.2s ease-in-out infinite}.w-star.t2{animation:twinkle2 2.8s ease-in-out infinite}.w-star.t3{animation:twinkle3 5.1s ease-in-out infinite}.w-star.t4{animation:twinkle4 3.7s ease-in-out infinite}
      @keyframes twinkle0{0%,100%{opacity:.9;transform:scale(1)}50%{opacity:.2;transform:scale(.6)}}@keyframes twinkle1{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:.15;transform:scale(.5)}}@keyframes twinkle2{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}@keyframes twinkle3{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.1;transform:scale(.4)}}@keyframes twinkle4{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:.25;transform:scale(.65)}}
      .w-shooting-star{position:absolute;top:5%;left:65%;width:2px;height:85px;background:linear-gradient(to top,rgba(255,255,255,.95),transparent);border-radius:1px;transform:rotate(-30deg);animation:shootingStar 6s ease-in infinite 2s}
      @keyframes shootingStar{0%{opacity:0;transform:rotate(-30deg) translate(0,0)}6%{opacity:1}35%{opacity:0;transform:rotate(-30deg) translate(-55px,210px)}100%{opacity:0;transform:rotate(-30deg) translate(-55px,210px)}}
      .w-moon{position:absolute;top:12%;left:50%;transform:translateX(-50%);width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#f0f0e0 0%,#d8d8b0 50%,#b0a870 100%);box-shadow:inset -12px -8px 0 rgba(0,0,0,.18),0 0 30px 10px rgba(220,210,150,.18),0 0 80px 30px rgba(200,190,120,.08);animation:moonGlow 6s ease-in-out infinite}
      @keyframes moonGlow{0%,100%{box-shadow:inset -12px -8px 0 rgba(0,0,0,.18),0 0 30px 10px rgba(220,210,150,.18),0 0 80px 30px rgba(200,190,120,.08)}50%{box-shadow:inset -12px -8px 0 rgba(0,0,0,.18),0 0 45px 18px rgba(220,210,150,.28),0 0 110px 50px rgba(200,190,120,.14)}}
      .moon-crater{position:absolute;border-radius:50%;background:rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.06)}
      .w-aurora{position:absolute;top:0;left:-20%;right:-20%;height:55%;pointer-events:none;overflow:hidden}
      .aurora-ribbon{position:absolute;left:0;right:0;border-radius:50%;filter:blur(28px);mix-blend-mode:screen}
      @keyframes auroraWave{0%,100%{transform:translateY(0) scaleY(1) scaleX(1)}50%{transform:translateY(20px) scaleY(1.4) scaleX(1.05)}}@keyframes auroraWave2{0%,100%{transform:translateY(0) scaleY(1) scaleX(1)}50%{transform:translateY(-18px) scaleY(1.2) scaleX(.97)}}

      /* Clouds */
      .w-cloud{position:absolute;pointer-events:none}.cloud-body{border-radius:50px;position:relative}
      .cloud-body.w-cloud-day{background:rgba(255,255,255,.82);box-shadow:0 8px 24px rgba(0,0,0,.12),inset 0 -4px 8px rgba(0,0,0,.06)}
      .cloud-body.w-cloud-night{background:rgba(40,55,90,.8);box-shadow:0 6px 20px rgba(0,0,0,.4)}
      .cloud-body.w-cloud-grey{background:rgba(120,130,145,.75);box-shadow:0 6px 18px rgba(0,0,0,.25),inset 0 -3px 6px rgba(0,0,0,.1)}
      .cloud-body.w-cloud-dark{background:rgba(30,35,55,.85);box-shadow:0 8px 20px rgba(0,0,0,.5),inset 0 -4px 8px rgba(0,0,0,.2)}
      .cloud-body.w-cloud-storm{background:rgba(20,15,40,.9);box-shadow:0 8px 24px rgba(80,40,200,.2),inset 0 -4px 8px rgba(0,0,0,.3)}
      @keyframes cloudFloat{0%,100%{transform:translateX(0) translateY(0)}33%{transform:translateX(6px) translateY(-3px)}66%{transform:translateX(-4px) translateY(2px)}}@keyframes cloudFloat2{0%,100%{transform:translateX(0) translateY(0)}40%{transform:translateX(-8px) translateY(2px)}75%{transform:translateX(5px) translateY(-2px)}}@keyframes cloudFloat3{0%,100%{transform:translateX(0) translateY(0)}30%{transform:translateX(10px) translateY(3px)}65%{transform:translateX(-6px) translateY(-3px)}}

      /* Fog */
      .w-fog-band{position:absolute;left:-10%;width:120%;border-radius:60%;pointer-events:none}
      @keyframes fogDrift{0%{transform:translateX(0) scaleY(1)}50%{transform:translateX(4%) scaleY(1.1)}100%{transform:translateX(0) scaleY(1)}}@keyframes fogDrift2{0%{transform:translateX(0) scaleY(1)}50%{transform:translateX(-5%) scaleY(.9)}100%{transform:translateX(0) scaleY(1)}}

      /* Wind */
      .w-wind-line{position:absolute;border-radius:2px;left:-30%;pointer-events:none}
      @keyframes windSweep{0%{transform:translateX(0);opacity:0}8%{opacity:1}85%{opacity:.6}100%{transform:translateX(160%);opacity:0}}

      /* Rain */
      .w-rain-drop{position:absolute;top:-8%;border-radius:1px;pointer-events:none;background:linear-gradient(to bottom,rgba(180,210,255,.7),rgba(140,180,240,.3))}
      @keyframes rainFall{0%{transform:translateY(0) translateX(0);opacity:0}5%{opacity:1}95%{opacity:.7}100%{transform:translateY(120vh) translateX(-60px);opacity:0}}@keyframes rainFallHeavy{0%{transform:translateY(0) translateX(0);opacity:0}4%{opacity:1}94%{opacity:.8}100%{transform:translateY(120vh) translateX(-90px);opacity:0}}
      .w-splash{position:absolute;bottom:2%;border-radius:50%;pointer-events:none;border:1px solid rgba(180,210,255,.4);animation:splash .6s ease-out infinite}
      @keyframes splash{0%{transform:scale(0);opacity:.8}100%{transform:scale(1);opacity:0}}
      .rain-atmosphere{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,transparent 60%,rgba(10,20,60,.3) 100%)}

      /* Snow */
      .w-snowflake{position:absolute;top:-5%;pointer-events:none;user-select:none;color:rgba(255,255,255,.85);text-shadow:0 0 6px rgba(200,230,255,.6);animation-name:snowFall;animation-timing-function:ease-in;animation-fill-mode:both}
      @keyframes snowFall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0}8%{opacity:1}90%{opacity:.8}100%{transform:translateY(110vh) translateX(var(--sx,0px)) rotate(var(--sr,360deg));opacity:0}}
      .snow-ground{position:absolute;bottom:0;left:-5%;right:-5%;height:28%;pointer-events:none;background:linear-gradient(to top,rgba(255,255,255,.55),transparent);border-radius:60% 60% 0 0}

      /* Hail */
      .w-hail-drop{position:absolute;top:-5%;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(200,230,255,.6) 60%,rgba(150,200,240,.3));box-shadow:0 2px 6px rgba(0,0,0,.25),inset 0 1px 2px rgba(255,255,255,.7)}
      @keyframes hailFall{0%{transform:translateY(0) translateX(0);opacity:0}6%{opacity:1}92%{opacity:1}100%{transform:translateY(110vh) translateX(var(--hx,0px));opacity:0}}

      /* Lightning */
      .w-lightning-bolt{position:absolute;pointer-events:none;z-index:10}
      .bolt-svg{filter:drop-shadow(0 0 6px #c8b0ff) drop-shadow(0 0 20px #9060ff)}
      @keyframes boltFlash{0%,100%{opacity:0}2%{opacity:1}5%{opacity:.3}7%{opacity:1}12%{opacity:0}}
      .w-sky-flash{position:absolute;inset:0;pointer-events:none;background:rgba(200,180,255,.12);animation:skyFlash 1s ease-in-out infinite}
      @keyframes skyFlash{0%,100%{opacity:0}3%{opacity:1}6%{opacity:.2}9%{opacity:.8}15%{opacity:0}}

      /* Exceptional */
      .w-exceptional-particle{position:absolute;border-radius:50%;pointer-events:none}
      @keyframes dustSwirl{0%{transform:rotate(0deg) translateX(var(--dr,40px)) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:.6}100%{transform:rotate(360deg) translateX(var(--dr,40px)) rotate(-360deg);opacity:0}}

      /* ── FORECAST WIDGET ─────────────────────────────────────────────────── */
      .atc-clear-forecast {
        position: relative;
        width: 100%;
        min-height: 0;
        background: linear-gradient(145deg, #060b18 0%, #0c1830 50%, #081022 100%);
        border-radius: inherit;
        overflow: hidden;
        display: flex;
        align-items: stretch;
      }
      .atc-clear-forecast--empty {
        align-items: center;
        justify-content: center;
        min-height: 68px;
      }
      /* Animated background pulse */
      .atc-fw-bg-pulse {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 120%, var(--fw-accent, #5090d8) 0%, transparent 65%);
        opacity: 0.18;
        animation: atcFwBgPulse 5s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
      }
      @keyframes atcFwBgPulse {
        0%, 100% { opacity: 0.12; transform: scale(1); }
        50%       { opacity: 0.25; transform: scale(1.08); }
      }
      /* 7-column grid */
      .atc-fw-grid {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: stretch;
      }
      /* Each day column */
      .atc-fw-day {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 7px 2px 7px;
        border-right: 1px solid rgba(255,255,255,0.05);
        gap: 3px;
        min-width: 0;
      }
      /* Push date to bottom of column */
      .atc-fw-date { margin-top: auto !important; }
      .atc-fw-day:last-child { border-right: none; }
      /* Today's column: elevated glass card */
      .atc-fw-day--today {
        background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-right-color: rgba(255,255,255,0.10);
        position: relative;
      }
      .atc-fw-day--today::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent 0%, var(--fw-accent, #5090d8) 50%, transparent 100%);
        animation: atcFwTodayLine 3s ease-in-out infinite;
      }
      @keyframes atcFwTodayLine {
        0%, 100% { opacity: 0.7; }
        50%       { opacity: 1.0; }
      }
      /* Day name label */
      .atc-fw-dayname {
        font-size: 0.58rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: rgba(255,255,255,0.50);
        text-transform: uppercase;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .atc-fw-day--today .atc-fw-dayname {
        color: var(--fw-accent, #5090d8);
        opacity: 0.95;
      }
      /* Emoji */
      .atc-fw-emoji {
        font-size: 2.0rem;
        line-height: 1;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
        margin-bottom: 4px;
      }
      .atc-fw-emoji--today {
        font-size: 2.4rem;
        animation: atcFwFloat 4s ease-in-out infinite;
      }
      @keyframes atcFwFloat {
        0%, 100% { transform: translateY(0px);   }
        50%       { transform: translateY(-3px);  }
      }
      /* Hi / Lo temperatures */
      .atc-fw-temps {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        line-height: 1;
        margin-top: 10px;
      }
      .atc-fw-hi {
        font-size: 1.2rem;
        font-weight: 700;
        text-shadow: 0 1px 4px rgba(0,0,0,0.7);
        white-space: nowrap;
      }
      .atc-fw-lo {
        font-size: 0.95rem;
        font-weight: 500;
        opacity: 0.7;
        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
        white-space: nowrap;
      }
      .atc-fw-day--today .atc-fw-hi { font-size: 1.4rem; }
      .atc-fw-day--today .atc-fw-lo { font-size: 1.05rem; }
      /* Date label under temps */
      .atc-fw-date {
        font-size: 0.65rem;
        font-weight: 500;
        color: rgba(255,255,255,0.50);
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        text-align: center;
        margin-top: 5px;
      }
      .atc-fw-day--today .atc-fw-date {
        font-size: 0.72rem;
        color: rgba(255,255,255,0.75);
        margin-top: 6px;
      }
      /* Precipitation bar + percentage */
      .atc-fw-precip {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 2px;
        height: 22px;
        min-width: 0;
      }
      .atc-fw-precip--empty { height: 22px; }
      .atc-fw-precip-bar {
        width: 3px;
        height: 18px;
        background: rgba(255,255,255,0.10);
        border-radius: 2px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .atc-fw-precip-fill {
        width: 100%;
        background: linear-gradient(to top, #40c4ff, #82b1ff);
        border-radius: 2px;
        animation: atcFwFillIn 1.2s ease-out both;
      }
      @keyframes atcFwFillIn {
        from { height: 0 !important; }
      }
      .atc-fw-precip-pct {
        font-size: 0.42rem;
        font-weight: 600;
        color: #82b1ff;
        line-height: 1;
        white-space: nowrap;
      }

      /* ── WEATHER + FORECAST ALTERNATING WIDGET ───────────────────────────── */
      .atc-wf-wrap {
        display: grid;
        width: 100%;
      }
      /* Both slots sit in the same grid cell — only one visible at a time */
      .atc-wf-slot {
        grid-area: 1 / 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      /* Weather widget inside the slot must stretch to fill the full slot height
         so the animated weather background covers the same area as the forecast panel */
      .atc-wf-slot > .atc-clear-weather {
        flex: 1;
      }
      .atc-wf-slot--in {
        opacity: 1;
        transform: translateY(0px);
        pointer-events: auto;
      }
      .atc-wf-slot--out {
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
      }

      /* -----------------------------------------------------------------------
       * GROUP CARD — collapsed summary slide for filter-grouped alerts
       * --------------------------------------------------------------------- */
      .atc-group-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        min-height: 52px;
        width: 100%;
        box-sizing: border-box;
      }
      .atc-group-body {
        flex: 1;
        min-width: 0;
      }
      .atc-group-message {
        font-size: 0.95rem;
        font-weight: 600;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .atc-group-names {
        font-size: 0.72rem;
        opacity: 0.72;
        margin-top: 2px;
        white-space: normal;
        line-height: 1.5;
      }
      .atc-group-count {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
        gap: 1px;
      }
      .atc-group-count-num {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        opacity: 0.85;
      }
      .atc-group-expand-arrow {
        font-size: 0.6rem;
        opacity: 0.55;
        line-height: 1;
      }
      .atc-group-back-btn {
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 12px;
        color: #fff;
        font-size: 0.7rem;
        padding: 2px 10px;
        cursor: pointer;
        z-index: 10;
        opacity: 0.85;
        white-space: nowrap;
      }
      .atc-group-back-btn:hover { opacity: 1; }
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
