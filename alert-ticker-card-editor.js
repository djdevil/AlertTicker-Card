/**
 * AlertTicker Card Editor v1.0.5
 * Visual editor for the AlertTicker Card custom Lovelace component.
 */

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Must match the version in alert-ticker-card.js
const CARD_VERSION = "1.0.5";

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
  retro:        { icon: "📺", category: "style"    },
  nuclear:      { icon: "☢️", category: "critical" },
  flood:        { icon: "🌊", category: "critical" },
  motion:       { icon: "👁️", category: "critical" },
  intruder:     { icon: "🚷", category: "critical" },
  toxic:        { icon: "☠️", category: "critical" },
  radar:        { icon: "🎯", category: "warning"  },
  temperature:  { icon: "🌡️", category: "warning"  },
  battery:      { icon: "🔋", category: "warning"  },
  door:         { icon: "🚪", category: "warning"  },
  hologram:     { icon: "🔷", category: "info"     },
  presence:     { icon: "🏠", category: "info"     },
  update:       { icon: "🔄", category: "info"     },
  heartbeat:    { icon: "💓", category: "ok"       },
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
    nuclear:      "Allarme radiazione",
    flood:        "Allagamento rilevato",
    motion:       "Movimento rilevato",
    intruder:     "Intrusione in corso",
    toxic:        "Sostanza tossica",
    radar:        "Rilevamento in corso",
    temperature:  "Temperatura critica",
    battery:      "Batteria scarica",
    door:         "Porta aperta",
    hologram:     "Proiezione sistema",
    presence:     "Presenza rilevata",
    update:       "Aggiornamento in corso",
    heartbeat:    "Sistema operativo",
    shield:       "Sistema protetto",
    power:        "Alimentazione ripristinata",
    retro:        "Avviso retrò",
    cyberpunk:    "Accesso sistema",
    vapor:        "Notifica vaporwave",
    lava:         "Avviso lava",
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
    nuclear:      "Radiation alert",
    flood:        "Flood detected",
    motion:       "Motion detected",
    intruder:     "Intrusion in progress",
    toxic:        "Toxic substance",
    radar:        "Detection in progress",
    temperature:  "Critical temperature",
    battery:      "Low battery",
    door:         "Door open",
    hologram:     "System projection",
    presence:     "Presence detected",
    update:       "Update in progress",
    heartbeat:    "System operational",
    shield:       "System protected",
    power:        "Power restored",
    retro:        "Retro alert",
    cyberpunk:    "System access",
    vapor:        "Vaporwave notification",
    lava:         "Lava alert",
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
    nuclear:      "Alerte radiation",
    flood:        "Inondation détectée",
    motion:       "Mouvement détecté",
    intruder:     "Intrusion en cours",
    toxic:        "Substance toxique",
    radar:        "Détection en cours",
    temperature:  "Température critique",
    battery:      "Batterie faible",
    door:         "Porte ouverte",
    hologram:     "Projection système",
    presence:     "Présence détectée",
    update:       "Mise à jour en cours",
    heartbeat:    "Système opérationnel",
    shield:       "Système protégé",
    power:        "Alimentation rétablie",
    retro:        "Alerte rétro",
    cyberpunk:    "Accès système",
    vapor:        "Notification vaporwave",
    lava:         "Alerte lave",
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
    nuclear:      "Strahlungsalarm",
    flood:        "Überschwemmung erkannt",
    motion:       "Bewegung erkannt",
    intruder:     "Einbruch in Gang",
    toxic:        "Giftstoff erkannt",
    radar:        "Erkennung läuft",
    temperature:  "Kritische Temperatur",
    battery:      "Batterie schwach",
    door:         "Tür offen",
    hologram:     "Systemprojektion",
    presence:     "Anwesenheit erkannt",
    update:       "Aktualisierung läuft",
    heartbeat:    "System betriebsbereit",
    shield:       "System geschützt",
    power:        "Strom wiederhergestellt",
    retro:        "Retro-Warnung",
    cyberpunk:    "Systemzugriff",
    vapor:        "Vaporwave-Meldung",
    lava:         "Lava-Warnung",
  },
  nl: {
    emergency:    "Noodgeval actief",
    fire:         "Brandmelding",
    alarm:        "Alarm geactiveerd",
    lightning:    "Stroomstoring",
    warning:      "Belangrijke waarschuwing",
    caution:      "Voorzichtigheid vereist",
    info:         "Informatie beschikbaar",
    notification: "Nieuwe melding",
    aurora:       "Systeemmelding",
    success:      "Normale toestand",
    check:        "Controle geslaagd",
    confetti:     "Bewerking geslaagd",
    ticker:       "Update bezig",
    neon:         "Neon-melding",
    glass:        "Glas-melding",
    matrix:       "Terminalbericht",
    minimal:      "Melding",
    nuclear:      "Stralingsalarm",
    flood:        "Overstroming gedetecteerd",
    motion:       "Beweging gedetecteerd",
    intruder:     "Inbraak bezig",
    toxic:        "Giftige stof",
    radar:        "Detectie bezig",
    temperature:  "Kritieke temperatuur",
    battery:      "Batterij laag",
    door:         "Deur open",
    hologram:     "Systeemprojectie",
    presence:     "Aanwezigheid gedetecteerd",
    update:       "Update bezig",
    heartbeat:    "Systeem operationeel",
    shield:       "Systeem beveiligd",
    power:        "Stroom hersteld",
    retro:        "Retro-melding",
    cyberpunk:    "Systeemtoegang",
    vapor:        "Vaporwave-melding",
    lava:         "Lava-melding",
  },
  vi: {
    emergency:    "Khẩn cấp",
    fire:         "Báo cháy",
    alarm:        "Báo động",
    lightning:    "Mất điện",
    warning:      "Cảnh báo quan trọng",
    caution:      "Chú ý",
    info:         "Thông tin",
    notification: "Thông báo mới",
    aurora:       "Thông báo hệ thống",
    success:      "Trạng thái ổn định",
    check:        "Kiểm tra hoàn tất",
    confetti:     "Thành công!",
    ticker:       "Đang cập nhật",
    neon:         "Cảnh báo Neon",
    glass:        "Cảnh báo Glass",
    matrix:       "Dữ liệu hệ thống",
    minimal:      "Cảnh báo",
    nuclear:      "Cảnh báo phóng xạ",
    flood:        "Phát hiện ngập lụt",
    motion:       "Phát hiện chuyển động",
    intruder:     "Phát hiện xâm nhập",
    toxic:        "Chất độc hại",
    radar:        "Đang quét mục tiêu",
    temperature:  "Quá nhiệt",
    battery:      "Pin yếu",
    door:         "Cửa đang mở",
    hologram:     "Trình chiếu hệ thống",
    presence:     "Phát hiện hiện diện",
    update:       "Đang cập nhật",
    heartbeat:    "Hệ thống đang chạy",
    shield:       "Đã kích hoạt bảo vệ",
    power:        "Đã khôi phục nguồn",
    retro:        "Cảnh báo Retro",
    cyberpunk:    "Truy cập hệ thống",
    vapor:        "Thông báo Vaporwave",
    lava:         "Cảnh báo dung nham",
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
    large_buttons: "Pulsanti grandi sempre visibili (💤 e 📋)",
    show_snooze_bar: "Mostra barra di riattivazione snooze 💤",
    snooze_default_duration: "Comportamento snooze 💤",
    snooze_default_duration_help: "Menu durata: tap su 💤 apre il menu per scegliere quanto silenziare. Durata fissa: tap su 💤 silenzia subito senza menu.",
    snooze_option_menu: "Mostra menu durata (come prima)",
    snooze_duration: "Durata snooze per questo avviso 💤",
    snooze_duration_help: "Sovrascrive l'impostazione globale. Vuoto = usa il globale.",
    snooze_duration_menu: "Menu durata",
    snooze_duration_global: "Usa impostazione globale",
    sound_enabled: "Notifica sonora alla comparsa di un avviso",
    sound_enabled_help: "Suona un tono generato automaticamente quando un avviso diventa attivo. Il suono varia per categoria (Critico = doppio beep acuto, Allerta = beep medio, Info = beep morbido, OK = chime). Richiede che il browser consenta la riproduzione automatica.",
    sound_url: "URL audio personalizzato (globale)",
    sound_url_help: "URL di un file .mp3 o .wav da usare al posto del suono predefinito. Lascia vuoto per il suono generato.",
    alert_sound: "Suono abilitato per questo avviso",
    alert_sound_url: "URL audio personalizzato per questo avviso",
    alert_sound_url_help: "Sovrascrive l'URL globale. Lascia vuoto per usare quello globale.",
    test_mode: "Modalità test",
    test_mode_desc: "Mostra tutti gli avvisi come attivi, ignorando le condizioni. L'animazione di scorrimento è sospesa — apri un avviso nell'editor per vederlo subito sulla card.",
    test_mode_warning: "Ricordati di disattivare la modalità test prima di salvare!",
    history_max_events: "Cronologia — eventi massimi da conservare",
    history_max_events_help: "Registra automaticamente ogni avviso che si attiva. Tap su 📋 nella card per vedere la cronologia con data/ora. I dati sono salvati nel browser.",
    history: "Cronologia",
    history_clear: "Svuota",
    history_empty: "Nessun evento registrato",
    clear_message: "Messaggio quando nessun avviso attivo",
    clear_theme: "Tema per stato 'tutto ok'",
    alerts_list: "Lista avvisi configurati",
    add_alert: "Aggiungi avviso",
    alert_entity: "Entità",
    alert_operator: "Condizione",
    alert_state: "Valore",
    alert_state_help: "es. 'on', '80' (numerico con operatore > < >= <=)",
    current_state: "Stato attuale",
    alert_message: "Messaggio da visualizzare",
    alert_message_help: "Usa {state} per il valore live, {name} per il nome, {entity} per l'ID entità. Es. 'Batteria: {state}%'",
    alert_priority: "Priorità",
    alert_theme: "Tema",
    alert_icon: "Icona",
    alert_icon_help: "Emoji: lascia vuoto per icona automatica. Con icona HA: usa il selettore icone nativo.",
    use_ha_icon: "Usa icona Home Assistant (mdi:)",
    show_badge: "Mostra badge",
    badge_label: "Testo badge personalizzato",
    badge_label_help: "Lascia vuoto per usare il testo di default del tema",
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
    op_eq: "= uguale a",
    op_ne: "≠ diverso da",
    op_gt: "> maggiore di",
    op_lt: "< minore di",
    op_gte: "≥ magg. o uguale",
    op_lte: "≤ min. o uguale",
    cycle_animation: "Animazione transizione",
    anim_fold:    "🃏 Fold — piega 3D",
    anim_slide:   "➡️ Slide — scorrimento",
    anim_fade:    "🌫️ Fade — dissolvenza",
    anim_flip:    "🔄 Flip — capovolgimento",
    anim_zoom:    "🔍 Zoom — ingrandimento",
    anim_glitch:  "⚡ Glitch — effetto digitale",
    anim_bounce:  "🏀 Bounce — rimbalzo elastico",
    anim_swing:   "🎪 Swing — pendolo",
    anim_blur:    "💨 Blur — sfocatura",
    anim_split:   "✂️ Split — divisione verticale",
    anim_roll:    "🎲 Roll — rotolamento",
    anim_curtain: "🎭 Curtain — sipario",
    entity_filter: "Filtro entità (testo)",
    entity_filter_help: "Cerca tutte le entità il cui ID o nome contiene questo testo. Supporta wildcard * (es. sensor.battery_*_level). Clicca sul conteggio per vedere la lista e usare 'Inverti selezione'. Usa {name}, {entity}, {state} nel messaggio.",
    entity_filter_count: "entità corrispondono",
    entity_filter_excluded: "escluse",
    entity_filter_zero: "Nessuna entità corrisponde",
    entity_filter_exclude_tip: "Clicca su un'entità per escluderla — clicca di nuovo per includerla",
    entity_filter_invert: "Inverti selezione",
    alert_attribute: "Attributo (opzionale)",
    alert_attribute_help: "es. battery_level — lascia vuoto per usare lo stato entità. Supporta percorsi annidati: es. activity.0.forecast",
    secondary_entity: "Entità valore secondario (opzionale)",
    secondary_entity_help: "Mostra il valore live di questa entità come riga aggiuntiva sotto il messaggio. Es. un sensore con lista di zone aperte.",
    secondary_text: "Testo secondario statico (opzionale)",
    secondary_text_help: "Testo fisso mostrato sotto il messaggio. Supporta {state}, {name}, {entity}. Non richiede un'entità sensore.",
    show_filter_name: "Mostra nome entità (da entity_filter)",
    secondary_attribute: "Attributo valore secondario",
    conditions_section: "Condizioni aggiuntive",
    conditions_logic: "Logica",
    logic_and: "AND — tutte vere",
    logic_or: "OR — almeno una vera",
    add_condition: "Aggiungi condizione",
    condition_entity: "Entità condizione",
    condition_attribute: "Attributo condizione",
    tap_action_section: "Tap — azione al tocco",
    hold_action_section: "Hold — azione lunga (500ms)",
    snooze_action_section: "Azione snooze 💤 — eseguita al tap sul tasto snooze",
    timer_theme_category: "Timer",
    timer_placeholder_hint: "Usa {timer} nel messaggio per mostrare il countdown (es. 'Disabilitato per {timer}')",
    action_type: "Tipo azione",
    action_none: "Nessuna",
    action_call_service: "Chiama servizio",
    action_navigate: "Naviga a pagina",
    action_more_info: "Apri info entità",
    action_url: "Apri URL",
    action_service: "Servizio HA",
    action_target: "Entità target",
    action_service_data: "Dati extra (JSON opzionale)",
    action_navigate_path: "Percorso (es. /lovelace/home)",
    action_url_path: "URL da aprire",
    delete_item: "Elimina",
  },
  en: {
    tab_general: "General",
    tab_alerts: "Alerts",
    cycle_interval: "Cycle interval (seconds)",
    cycle_interval_help: "Seconds between alerts when multiple are active",
    show_when_clear: "Show when no alerts are active",
    large_buttons: "Large always-visible buttons (💤 and 📋)",
    show_snooze_bar: "Show snooze reactivation bar 💤",
    snooze_default_duration: "Snooze 💤 behaviour",
    snooze_default_duration_help: "Duration menu: tap on 💤 opens a menu to choose how long to snooze. Fixed duration: tap on 💤 snoozes immediately with no menu.",
    snooze_option_menu: "Show duration menu (as before)",
    snooze_duration: "Snooze duration for this alert 💤",
    snooze_duration_help: "Overrides the global setting. Empty = use global.",
    snooze_duration_menu: "Duration menu",
    snooze_duration_global: "Use global setting",
    sound_enabled: "Play a sound when an alert appears",
    sound_enabled_help: "Plays an auto-generated tone when an alert becomes active. Tone varies by category (Critical = double high beep, Warning = medium beep, Info = soft beep, OK = rising chime). Requires browser autoplay permission.",
    sound_url: "Custom audio URL (global)",
    sound_url_help: "URL of an .mp3 or .wav file to use instead of the generated sound. Leave empty for the generated tone.",
    alert_sound: "Sound enabled for this alert",
    alert_sound_url: "Custom audio URL for this alert",
    alert_sound_url_help: "Overrides the global URL. Leave empty to use the global one.",
    test_mode: "Test mode",
    test_mode_desc: "Shows all alerts as active, ignoring conditions. Cycling animation is paused — expand an alert in the editor to preview it instantly on the card.",
    test_mode_warning: "Remember to disable test mode before saving!",
    history_max_events: "History — max events to keep",
    history_max_events_help: "Automatically records every alert that becomes active. Tap 📋 on the card to view history with date/time. Data is stored in the browser.",
    history: "History",
    history_clear: "Clear",
    history_empty: "No events recorded yet",
    clear_message: "Message when no alerts active",
    clear_theme: "Theme for 'all clear' state",
    alerts_list: "Configured alerts",
    add_alert: "Add alert",
    alert_entity: "Entity",
    alert_operator: "Condition",
    alert_state: "Value",
    alert_state_help: "e.g. 'on', '80' (numeric with > < >= <=)",
    current_state: "Current state",
    alert_message: "Message to display",
    alert_message_help: "Use {state} for live value, {name} for friendly name, {entity} for entity ID. E.g. 'Battery: {state}%'",
    alert_priority: "Priority",
    alert_theme: "Theme",
    alert_icon: "Icon",
    alert_icon_help: "Emoji: leave empty for automatic. HA icon: use the native icon picker.",
    use_ha_icon: "Use Home Assistant icon (mdi:)",
    show_badge: "Show badge",
    badge_label: "Custom badge label",
    badge_label_help: "Leave empty to use the theme default label",
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
    op_eq: "= equals",
    op_ne: "≠ not equal",
    op_gt: "> greater than",
    op_lt: "< less than",
    op_gte: "≥ greater or equal",
    op_lte: "≤ less or equal",
    cycle_animation: "Transition animation",
    anim_fold:    "🃏 Fold — 3D page turn",
    anim_slide:   "➡️ Slide — horizontal push",
    anim_fade:    "🌫️ Fade — cross-dissolve",
    anim_flip:    "🔄 Flip — card flip",
    anim_zoom:    "🔍 Zoom — scale punch",
    anim_glitch:  "⚡ Glitch — digital noise",
    anim_bounce:  "🏀 Bounce — elastic spring",
    anim_swing:   "🎪 Swing — pendulum",
    anim_blur:    "💨 Blur — gaussian dissolve",
    anim_split:   "✂️ Split — vertical split",
    anim_roll:    "🎲 Roll — rotateY + slide",
    anim_curtain: "🎭 Curtain — theater open",
    entity_filter: "Entity filter (text)",
    entity_filter_help: "Matches all entities whose ID or name contains this text. Supports wildcard * (e.g. sensor.battery_*_level). Click the count to preview the list and use 'Invert selection'. Use {name}, {entity}, {state} in the message.",
    entity_filter_count: "entities match",
    entity_filter_excluded: "excluded",
    entity_filter_zero: "No entities match",
    entity_filter_exclude_tip: "Click an entity to exclude it — click again to re-include it",
    entity_filter_invert: "Invert selection",
    alert_attribute: "Attribute (optional)",
    alert_attribute_help: "e.g. battery_level — leave empty to use entity state. Supports nested paths: e.g. activity.0.forecast",
    secondary_entity: "Secondary value entity (optional)",
    secondary_entity_help: "Shows the live value of this entity as an extra line below the message. E.g. a sensor listing open zones or active alerts.",
    secondary_text: "Static secondary text (optional)",
    secondary_text_help: "Fixed text shown below the message. Supports {state}, {name}, {entity}. No sensor entity required.",
    show_filter_name: "Show entity name (from entity_filter)",
    secondary_attribute: "Secondary value attribute",
    conditions_section: "Extra conditions",
    conditions_logic: "Logic",
    logic_and: "AND — all must match",
    logic_or: "OR — at least one must match",
    add_condition: "Add condition",
    condition_entity: "Condition entity",
    condition_attribute: "Condition attribute",
    tap_action_section: "Tap action",
    hold_action_section: "Hold action (500ms)",
    snooze_action_section: "Snooze action 💤 — executed when the snooze button is tapped",
    timer_theme_category: "Timer",
    timer_placeholder_hint: "Use {timer} in the message to show the countdown (e.g. 'Disabled for {timer}')",
    action_type: "Action type",
    action_none: "None",
    action_call_service: "Call service",
    action_navigate: "Navigate to page",
    action_more_info: "More info",
    action_url: "Open URL",
    action_service: "HA service",
    action_target: "Target entity",
    action_service_data: "Extra data (optional JSON)",
    action_navigate_path: "Path (e.g. /lovelace/home)",
    action_url_path: "URL to open",
    delete_item: "Delete",
  },
  fr: {
    tab_general: "Général",
    tab_alerts: "Alertes",
    cycle_interval: "Intervalle de cycle (secondes)",
    cycle_interval_help: "Secondes entre les alertes quand plusieurs sont actives",
    show_when_clear: "Afficher quand aucune alerte n'est active",
    large_buttons: "Grands boutons toujours visibles (💤 et 📋)",
    show_snooze_bar: "Afficher la barre de réactivation snooze 💤",
    snooze_default_duration: "Comportement snooze 💤",
    snooze_default_duration_help: "Menu de durée: tap sur 💤 ouvre un menu pour choisir la durée. Durée fixe: tap sur 💤 met en veille immédiatement sans menu.",
    snooze_option_menu: "Afficher le menu de durée (comme avant)",
    snooze_duration: "Durée snooze pour cette alerte 💤",
    snooze_duration_help: "Remplace le réglage global. Vide = utiliser le global.",
    snooze_duration_menu: "Menu de durée",
    snooze_duration_global: "Utiliser le réglage global",
    sound_enabled: "Jouer un son à l'apparition d'une alerte",
    sound_enabled_help: "Joue un ton généré automatiquement quand une alerte devient active. Le ton varie par catégorie (Critique = double bip aigu, Avertissement = bip moyen, Info = bip doux, OK = carillon). Nécessite l'autorisation de lecture automatique du navigateur.",
    sound_url: "URL audio personnalisée (globale)",
    sound_url_help: "URL d'un fichier .mp3 ou .wav à utiliser à la place du son généré. Laisser vide pour le ton généré.",
    alert_sound: "Son activé pour cette alerte",
    alert_sound_url: "URL audio personnalisée pour cette alerte",
    alert_sound_url_help: "Remplace l'URL globale. Laisser vide pour utiliser celle globale.",
    test_mode: "Mode test",
    test_mode_desc: "Affiche toutes les alertes comme actives, en ignorant leurs conditions. L'animation de défilement est suspendue — ouvrez une alerte dans l'éditeur pour la voir immédiatement sur la carte.",
    test_mode_warning: "N'oubliez pas de désactiver le mode test avant de sauvegarder !",
    history_max_events: "Historique — événements maximum à conserver",
    history_max_events_help: "Enregistre automatiquement chaque alerte qui devient active. Tap sur 📋 dans la carte pour voir l'historique avec date/heure. Données sauvegardées dans le navigateur.",
    history: "Historique",
    history_clear: "Effacer",
    history_empty: "Aucun événement enregistré",
    clear_message: "Message quand aucune alerte active",
    clear_theme: "Thème pour l'état 'tout va bien'",
    alerts_list: "Liste des alertes configurées",
    add_alert: "Ajouter une alerte",
    alert_entity: "Entité",
    alert_operator: "Condition",
    alert_state: "Valeur",
    alert_state_help: "ex. 'on', '80' (numérique avec > < >= <=)",
    current_state: "État actuel",
    alert_message: "Message à afficher",
    alert_message_help: "Utilisez {state} pour la valeur live, {name} pour le nom, {entity} pour l'ID entité. Ex. 'Batterie : {state}%'",
    alert_priority: "Priorité",
    alert_theme: "Thème",
    alert_icon: "Icône",
    alert_icon_help: "Emoji: laisser vide pour icône automatique. Icône HA: utiliser le sélecteur d'icônes natif.",
    use_ha_icon: "Utiliser une icône Home Assistant (mdi:)",
    show_badge: "Afficher le badge",
    badge_label: "Texte du badge personnalisé",
    badge_label_help: "Laisser vide pour utiliser le texte par défaut du thème",
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
    op_eq: "= égal à",
    op_ne: "≠ différent de",
    op_gt: "> supérieur à",
    op_lt: "< inférieur à",
    op_gte: "≥ supérieur ou égal",
    op_lte: "≤ inférieur ou égal",
    cycle_animation: "Animation de transition",
    anim_fold:    "🃏 Fold — pliage 3D",
    anim_slide:   "➡️ Slide — défilement",
    anim_fade:    "🌫️ Fade — fondu",
    anim_flip:    "🔄 Flip — retournement",
    anim_zoom:    "🔍 Zoom — agrandissement",
    anim_glitch:  "⚡ Glitch — effet numérique",
    anim_bounce:  "🏀 Bounce — rebond élastique",
    anim_swing:   "🎪 Swing — pendule",
    anim_blur:    "💨 Blur — flou gaussien",
    anim_split:   "✂️ Split — division verticale",
    anim_roll:    "🎲 Roll — roulement",
    anim_curtain: "🎭 Curtain — rideau de théâtre",
    entity_filter: "Filtre entité (texte)",
    entity_filter_help: "Correspond à toutes les entités dont l'ID ou le nom contient ce texte. Supporte le wildcard * (ex. sensor.battery_*_level). Cliquez sur le compteur pour prévisualiser et utiliser 'Inverser la sélection'. Utilisez {name}, {entity}, {state} dans le message.",
    entity_filter_count: "entités correspondent",
    entity_filter_excluded: "exclues",
    entity_filter_zero: "Aucune entité ne correspond",
    entity_filter_exclude_tip: "Cliquez sur une entité pour l'exclure — cliquez à nouveau pour la réinclure",
    entity_filter_invert: "Inverser la sélection",
    alert_attribute: "Attribut (optionnel)",
    alert_attribute_help: "ex. battery_level — laisser vide pour utiliser l'état de l'entité. Supporte les chemins imbriqués : ex. activity.0.forecast",
    secondary_entity: "Entité valeur secondaire (optionnel)",
    secondary_entity_help: "Affiche la valeur en direct de cette entité comme ligne supplémentaire sous le message. Ex. un capteur listant les zones ouvertes.",
    secondary_text: "Texte secondaire statique (optionnel)",
    secondary_text_help: "Texte fixe affiché sous le message. Supporte {state}, {name}, {entity}. Aucune entité capteur requise.",
    show_filter_name: "Afficher le nom de l'entité (depuis entity_filter)",
    secondary_attribute: "Attribut valeur secondaire",
    conditions_section: "Conditions supplémentaires",
    conditions_logic: "Logique",
    logic_and: "AND — toutes vraies",
    logic_or: "OR — au moins une vraie",
    add_condition: "Ajouter une condition",
    condition_entity: "Entité condition",
    condition_attribute: "Attribut condition",
    tap_action_section: "Action au tap",
    hold_action_section: "Action maintien (500ms)",
    snooze_action_section: "Action snooze 💤 — exécutée au tap sur le bouton snooze",
    timer_theme_category: "Timer",
    timer_placeholder_hint: "Utilisez {timer} dans le message pour afficher le compte à rebours (ex. 'Désactivé pour {timer}')",
    action_type: "Type d'action",
    action_none: "Aucune",
    action_call_service: "Appeler un service",
    action_navigate: "Naviguer vers une page",
    action_more_info: "Plus d'infos",
    action_url: "Ouvrir une URL",
    action_service: "Service HA",
    action_target: "Entité cible",
    action_service_data: "Données extra (JSON optionnel)",
    action_navigate_path: "Chemin (ex. /lovelace/home)",
    action_url_path: "URL à ouvrir",
    delete_item: "Supprimer",
  },
  de: {
    tab_general: "Allgemein",
    tab_alerts: "Warnungen",
    cycle_interval: "Zyklusintervall (Sekunden)",
    cycle_interval_help: "Sekunden zwischen Warnungen wenn mehrere aktiv sind",
    show_when_clear: "Anzeigen wenn keine Warnung aktiv",
    large_buttons: "Große, immer sichtbare Schaltflächen (💤 und 📋)",
    show_snooze_bar: "Schlummern-Reaktivierungsleiste anzeigen 💤",
    snooze_default_duration: "Schlummern 💤 Verhalten",
    snooze_default_duration_help: "Dauermenü: Tap auf 💤 öffnet ein Menü zur Auswahl der Dauer. Feste Dauer: Tap auf 💤 schlummert sofort ohne Menü.",
    snooze_option_menu: "Dauermenü anzeigen (wie bisher)",
    snooze_duration: "Schlummerdauer für diese Warnung 💤",
    snooze_duration_help: "Überschreibt die globale Einstellung. Leer = global verwenden.",
    snooze_duration_menu: "Dauermenü",
    snooze_duration_global: "Globale Einstellung verwenden",
    sound_enabled: "Ton bei Erscheinen einer Warnung abspielen",
    sound_enabled_help: "Spielt einen automatisch generierten Ton ab, wenn eine Warnung aktiv wird. Der Ton variiert je nach Kategorie (Kritisch = doppelter hoher Piepton, Warnung = mittlerer Piepton, Info = sanfter Piepton, OK = aufsteigendes Chime). Erfordert Autoplay-Berechtigung im Browser.",
    sound_url: "Benutzerdefinierte Audio-URL (global)",
    sound_url_help: "URL einer .mp3- oder .wav-Datei anstelle des generierten Tons. Leer lassen für den generierten Ton.",
    alert_sound: "Ton für diese Warnung aktiviert",
    alert_sound_url: "Benutzerdefinierte Audio-URL für diese Warnung",
    alert_sound_url_help: "Überschreibt die globale URL. Leer lassen, um die globale zu verwenden.",
    test_mode: "Testmodus",
    test_mode_desc: "Zeigt alle Warnungen als aktiv an, unabhängig von ihren Bedingungen. Die Scroll-Animation ist angehalten — öffne eine Warnung im Editor, um sie sofort auf der Karte anzuzeigen.",
    test_mode_warning: "Denk daran, den Testmodus vor dem Speichern zu deaktivieren!",
    history_max_events: "Verlauf — maximale Ereignisse",
    history_max_events_help: "Zeichnet automatisch jede aktiv werdende Warnung auf. Tap auf 📋 in der Karte zum Anzeigen mit Datum/Uhrzeit. Daten werden im Browser gespeichert.",
    history: "Verlauf",
    history_clear: "Leeren",
    history_empty: "Noch keine Ereignisse aufgezeichnet",
    clear_message: "Nachricht wenn keine Warnungen aktiv",
    clear_theme: "Thema für 'Alles in Ordnung'",
    alerts_list: "Konfigurierte Warnungen",
    add_alert: "Warnung hinzufügen",
    alert_entity: "Entität",
    alert_operator: "Bedingung",
    alert_state: "Wert",
    alert_state_help: "z.B. 'on', '80' (numerisch mit > < >= <=)",
    current_state: "Aktueller Zustand",
    alert_message: "Anzuzeigende Nachricht",
    alert_message_help: "Verwende {state} für den Live-Wert, {name} für den Namen, {entity} für die Entitäts-ID. Z.B. 'Batterie: {state}%'",
    alert_priority: "Priorität",
    alert_theme: "Thema",
    alert_icon: "Symbol",
    alert_icon_help: "Emoji: leer lassen für automatisch. HA-Symbol: nativen Icon-Picker verwenden.",
    use_ha_icon: "Home Assistant Symbol verwenden (mdi:)",
    show_badge: "Badge anzeigen",
    badge_label: "Benutzerdefinierter Badge-Text",
    badge_label_help: "Leer lassen für den Standard-Text des Themas",
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
    op_eq: "= gleich",
    op_ne: "≠ ungleich",
    op_gt: "> größer als",
    op_lt: "< kleiner als",
    op_gte: "≥ größer oder gleich",
    op_lte: "≤ kleiner oder gleich",
    cycle_animation: "Übergangsanimation",
    anim_fold:    "🃏 Fold — 3D-Seitenumbruch",
    anim_slide:   "➡️ Slide — seitlich schieben",
    anim_fade:    "🌫️ Fade — Überblenden",
    anim_flip:    "🔄 Flip — Kartenumdrehen",
    anim_zoom:    "🔍 Zoom — Größenwechsel",
    anim_glitch:  "⚡ Glitch — digitaler Effekt",
    anim_bounce:  "🏀 Bounce — elastischer Sprung",
    anim_swing:   "🎪 Swing — Pendel",
    anim_blur:    "💨 Blur — Weichzeichner",
    anim_split:   "✂️ Split — vertikale Teilung",
    anim_roll:    "🎲 Roll — Rollen",
    anim_curtain: "🎭 Curtain — Theatervorhang",
    entity_filter: "Entitätsfilter (Text)",
    entity_filter_help: "Findet alle Entitäten, deren ID oder Name diesen Text enthält. Unterstützt Wildcard * (z.B. sensor.battery_*_level). Klicke auf die Anzahl für die Vorschau und 'Auswahl umkehren'. Verwende {name}, {entity}, {state} in der Nachricht.",
    entity_filter_count: "Entitäten gefunden",
    entity_filter_excluded: "ausgeschlossen",
    entity_filter_zero: "Keine Entitäten gefunden",
    entity_filter_exclude_tip: "Entität anklicken zum Ausschließen — erneut klicken zum Einschließen",
    entity_filter_invert: "Auswahl umkehren",
    alert_attribute: "Attribut (optional)",
    alert_attribute_help: "z.B. battery_level — leer lassen für Entity-Zustand. Unterstützt verschachtelte Pfade: z.B. activity.0.forecast",
    secondary_entity: "Sekundärwert-Entität (optional)",
    secondary_entity_help: "Zeigt den Live-Wert dieser Entität als zusätzliche Zeile unter der Nachricht. Z.B. ein Sensor mit einer Liste offener Zonen.",
    secondary_text: "Statischer Sekundärtext (optional)",
    secondary_text_help: "Fester Text unter der Nachricht. Unterstützt {state}, {name}, {entity}. Kein Sensor-Entity erforderlich.",
    show_filter_name: "Entity-Name anzeigen (aus entity_filter)",
    secondary_attribute: "Sekundärwert-Attribut",
    conditions_section: "Zusätzliche Bedingungen",
    conditions_logic: "Logik",
    logic_and: "AND — alle erfüllt",
    logic_or: "OR — mindestens eine erfüllt",
    add_condition: "Bedingung hinzufügen",
    condition_entity: "Bedingungs-Entität",
    condition_attribute: "Bedingungs-Attribut",
    tap_action_section: "Tap-Aktion",
    hold_action_section: "Halten-Aktion (500ms)",
    snooze_action_section: "Schlummern-Aktion 💤 — wird beim Tap auf den Schlummern-Button ausgeführt",
    timer_theme_category: "Timer",
    timer_placeholder_hint: "Verwende {timer} in der Nachricht für den Countdown (z.B. 'Deaktiviert für {timer}')",
    action_type: "Aktionstyp",
    action_none: "Keine",
    action_call_service: "Dienst aufrufen",
    action_navigate: "Zur Seite navigieren",
    action_more_info: "Mehr Infos",
    action_url: "URL öffnen",
    action_service: "HA-Dienst",
    action_target: "Ziel-Entität",
    action_service_data: "Zusatzdaten (optionales JSON)",
    action_navigate_path: "Pfad (z.B. /lovelace/home)",
    action_url_path: "Zu öffnende URL",
    delete_item: "Löschen",
  },
  nl: {
    tab_general: "Algemeen",
    tab_alerts: "Meldingen",
    cycle_interval: "Cyclusinterval (seconden)",
    cycle_interval_help: "Seconden tussen meldingen wanneer meerdere actief zijn",
    show_when_clear: "Tonen wanneer geen meldingen actief zijn",
    large_buttons: "Grote, altijd zichtbare knoppen (💤 en 📋)",
    show_snooze_bar: "Sluimer-reactiveringsbalk weergeven 💤",
    snooze_default_duration: "Sluimer 💤 gedrag",
    snooze_default_duration_help: "Duurmenu: tik op 💤 opent een menu om de duur te kiezen. Vaste duur: tik op 💤 sluimert direct zonder menu.",
    snooze_option_menu: "Duurmenu tonen (zoals voorheen)",
    snooze_duration: "Sluimerduur voor deze melding 💤",
    snooze_duration_help: "Overschrijft de globale instelling. Leeg = globaal gebruiken.",
    snooze_duration_menu: "Duurmenu",
    snooze_duration_global: "Globale instelling gebruiken",
    sound_enabled: "Geluid afspelen bij het verschijnen van een melding",
    sound_enabled_help: "Speelt een automatisch gegenereerde toon af wanneer een melding actief wordt. De toon varieert per categorie (Kritiek = dubbele hoge piep, Waarschuwing = middelhoge piep, Info = zachte piep, OK = klim-chime). Vereist autoplay-toestemming in de browser.",
    sound_url: "Aangepaste audio-URL (globaal)",
    sound_url_help: "URL van een .mp3- of .wav-bestand in plaats van de gegenereerde toon. Leeg laten voor de gegenereerde toon.",
    alert_sound: "Geluid ingeschakeld voor deze melding",
    alert_sound_url: "Aangepaste audio-URL voor deze melding",
    alert_sound_url_help: "Overschrijft de globale URL. Leeg laten om de globale te gebruiken.",
    test_mode: "Testmodus",
    test_mode_desc: "Toont alle meldingen als actief, ongeacht hun voorwaarden. De scroll-animatie is gepauzeerd — open een melding in de editor om deze direct op de kaart te zien.",
    test_mode_warning: "Vergeet niet de testmodus uit te schakelen voor het opslaan!",
    history_max_events: "Geschiedenis — maximale gebeurtenissen",
    history_max_events_help: "Registreert automatisch elke melding die actief wordt. Tik op 📋 op de kaart voor de geschiedenis met datum/tijd. Gegevens worden opgeslagen in de browser.",
    history: "Geschiedenis",
    history_clear: "Wissen",
    history_empty: "Nog geen gebeurtenissen opgeslagen",
    clear_message: "Bericht wanneer geen meldingen actief",
    clear_theme: "Thema voor 'alles in orde'",
    alerts_list: "Geconfigureerde meldingen",
    add_alert: "Melding toevoegen",
    alert_entity: "Entiteit",
    alert_operator: "Conditie",
    alert_state: "Waarde",
    alert_state_help: "bijv. 'on', '80' (numeriek met > < >= <=)",
    current_state: "Huidige toestand",
    alert_message: "Te tonen bericht",
    alert_message_help: "Gebruik {state} voor live waarde, {name} voor naam, {entity} voor entiteits-ID. Bijv. 'Batterij: {state}%'",
    alert_priority: "Prioriteit",
    alert_theme: "Thema",
    alert_icon: "Pictogram",
    alert_icon_help: "Emoji: leeg laten voor automatisch. HA-pictogram: gebruik de native pictogramselector.",
    use_ha_icon: "Home Assistant pictogram gebruiken (mdi:)",
    show_badge: "Badge weergeven",
    badge_label: "Aangepaste badge-tekst",
    badge_label_help: "Leeg laten voor de standaardtekst van het thema",
    delete: "Verwijderen",
    priority_1: "1 — Kritiek (rood)",
    priority_2: "2 — Waarschuwing (oranje)",
    priority_3: "3 — Info (blauw)",
    priority_4: "4 — Lage prioriteit (grijs)",
    no_alerts: "Geen meldingen geconfigureerd. Klik op 'Melding toevoegen' om te beginnen.",
    alert_num: "Melding",
    collapse: "Sluiten",
    expand: "Bewerken",
    move_up: "Omhoog",
    move_down: "Omlaag",
    version: "Versie",
    op_eq: "= gelijk aan",
    op_ne: "≠ niet gelijk aan",
    op_gt: "> groter dan",
    op_lt: "< kleiner dan",
    op_gte: "≥ groter of gelijk",
    op_lte: "≤ kleiner of gelijk",
    cycle_animation: "Overgangsanimatie",
    anim_fold:    "🃏 Fold — 3D-paginavouw",
    anim_slide:   "➡️ Slide — horizontaal schuiven",
    anim_fade:    "🌫️ Fade — vervagen",
    anim_flip:    "🔄 Flip — kaartomdraaien",
    anim_zoom:    "🔍 Zoom — schaal",
    anim_glitch:  "⚡ Glitch — digitaal effect",
    anim_bounce:  "🏀 Bounce — elastisch stuiten",
    anim_swing:   "🎪 Swing — slinger",
    anim_blur:    "💨 Blur — wazig",
    anim_split:   "✂️ Split — verticale splitsing",
    anim_roll:    "🎲 Roll — rollen",
    anim_curtain: "🎭 Curtain — theatergordijn",
    entity_filter: "Entiteitsfilter (tekst)",
    entity_filter_help: "Vindt alle entiteiten waarvan het ID of de naam deze tekst bevat. Ondersteunt wildcard * (bijv. sensor.battery_*_level). Klik op het aantal voor de voorvertoning en 'Selectie omdraaien'. Gebruik {name}, {entity}, {state} in het bericht.",
    entity_filter_count: "entiteiten gevonden",
    entity_filter_excluded: "uitgesloten",
    entity_filter_zero: "Geen entiteiten gevonden",
    entity_filter_exclude_tip: "Klik op een entiteit om het uit te sluiten — klik opnieuw om het in te sluiten",
    entity_filter_invert: "Selectie omdraaien",
    alert_attribute: "Attribuut (optioneel)",
    alert_attribute_help: "bijv. battery_level — leeg laten voor entiteitstoestand. Ondersteunt geneste paden: bijv. activity.0.forecast",
    secondary_entity: "Secundaire waarde-entiteit (optioneel)",
    secondary_entity_help: "Toont de live waarde van deze entiteit als extra regel onder het bericht. Bijv. een sensor met een lijst van open zones.",
    secondary_text: "Statische secundaire tekst (optioneel)",
    secondary_text_help: "Vaste tekst onder het bericht. Ondersteunt {state}, {name}, {entity}. Geen sensor-entiteit vereist.",
    show_filter_name: "Entiteitsnaam weergeven (uit entity_filter)",
    secondary_attribute: "Secundaire waarde-attribuut",
    conditions_section: "Extra voorwaarden",
    conditions_logic: "Logica",
    logic_and: "AND — alle moeten kloppen",
    logic_or: "OR — minimaal één moet kloppen",
    add_condition: "Voorwaarde toevoegen",
    condition_entity: "Voorwaarde-entiteit",
    condition_attribute: "Voorwaarde-attribuut",
    tap_action_section: "Tik-actie",
    hold_action_section: "Houd-actie (500ms)",
    snooze_action_section: "Sluimer-actie 💤 — uitgevoerd bij tik op de sluimer-knop",
    timer_theme_category: "Timer",
    timer_placeholder_hint: "Gebruik {timer} in het bericht voor de countdown (bijv. 'Uitgeschakeld voor {timer}')",
    action_type: "Actietype",
    action_none: "Geen",
    action_call_service: "Dienst aanroepen",
    action_navigate: "Navigeer naar pagina",
    action_more_info: "Meer info",
    action_url: "URL openen",
    action_service: "HA-dienst",
    action_target: "Doelentiteit",
    action_service_data: "Extra gegevens (optionele JSON)",
    action_navigate_path: "Pad (bijv. /lovelace/home)",
    action_url_path: "Te openen URL",
    delete_item: "Verwijderen",
  },
  vi: {
    tab_general: "Chung",
    tab_alerts: "Báo động",
    cycle_interval: "Chu kỳ chuyển đổi (giây)",
    cycle_interval_help: "Số giây giữa các báo động khi có nhiều báo động đang hoạt động",
    show_when_clear: "Hiển thị khi không có báo động",
    large_buttons: "Nút lớn luôn hiển thị (💤 và 📋)",
    show_snooze_bar: "Hiển thị thanh kích hoạt lại tạm hoãn 💤",
    snooze_default_duration: "Hành vi tạm hoãn 💤",
    snooze_default_duration_help: "Menu thời gian: nhấn 💤 mở menu chọn thời lượng. Thời lượng cố định: nhấn 💤 tạm hoãn ngay không cần menu.",
    snooze_option_menu: "Hiển thị menu thời lượng (như trước)",
    snooze_duration: "Thời lượng tạm hoãn cho báo động này 💤",
    snooze_duration_help: "Ghi đè cài đặt toàn cục. Trống = dùng cài đặt toàn cục.",
    snooze_duration_menu: "Menu thời lượng",
    snooze_duration_global: "Dùng cài đặt toàn cục",
    sound_enabled: "Phát âm thanh khi xuất hiện báo động",
    sound_enabled_help: "Phát tông tự động khi báo động kích hoạt. Tông thay đổi theo danh mục (Nghiêm trọng = hai tiếng bíp cao, Cảnh báo = tiếng bíp vừa, Thông tin = tiếng bíp nhẹ, OK = chime tăng dần). Yêu cầu trình duyệt cho phép tự động phát.",
    sound_url: "URL âm thanh tùy chỉnh (toàn cục)",
    sound_url_help: "URL của tệp .mp3 hoặc .wav thay thế âm thanh được tạo. Để trống để dùng tông tự động.",
    alert_sound: "Âm thanh bật cho báo động này",
    alert_sound_url: "URL âm thanh tùy chỉnh cho báo động này",
    alert_sound_url_help: "Ghi đè URL toàn cục. Để trống để dùng URL toàn cục.",
    test_mode: "Chế độ thử",
    test_mode_desc: "Hiển thị tất cả báo động như đang hoạt động, bỏ qua điều kiện. Hoạt ảnh cuộn bị tạm dừng — mở một báo động trong trình chỉnh sửa để xem ngay trên thẻ.",
    test_mode_warning: "Nhớ tắt chế độ thử trước khi lưu!",
    history_max_events: "Lịch sử — số sự kiện tối đa lưu trữ",
    history_max_events_help: "Tự động ghi lại mỗi báo động được kích hoạt. Nhấn 📋 trên thẻ để xem lịch sử với ngày/giờ. Dữ liệu được lưu trong trình duyệt.",
    history: "Lịch sử",
    history_clear: "Xóa",
    history_empty: "Chưa có sự kiện nào",
    clear_message: "Thông báo khi không có báo động",
    clear_theme: "Giao diện trạng thái 'mọi thứ ổn'",
    alerts_list: "Danh sách báo động đã cài đặt",
    add_alert: "Thêm báo động",
    alert_entity: "Thực thể (Entity)",
    alert_operator: "Điều kiện",
    alert_state: "Giá trị",
    alert_state_help: "vd. 'on', '80' (số với > < >= <=)",
    current_state: "Trạng thái hiện tại",
    alert_message: "Thông báo hiển thị",
    alert_message_help: "Dùng {state} cho giá trị live, {name} cho tên, {entity} cho ID thực thể. Vd. 'Pin: {state}%'",
    alert_priority: "Mức ưu tiên",
    alert_theme: "Giao diện",
    alert_icon: "Biểu tượng",
    alert_icon_help: "Emoji: để trống để tự động. Biểu tượng HA: dùng bộ chọn biểu tượng gốc.",
    use_ha_icon: "Dùng biểu tượng Home Assistant (mdi:)",
    show_badge: "Hiển thị badge",
    badge_label: "Nhãn badge tùy chỉnh",
    badge_label_help: "Để trống để dùng nhãn mặc định của giao diện",
    delete: "Xóa",
    priority_1: "1 — Nghiêm trọng (đỏ)",
    priority_2: "2 — Cảnh báo (cam)",
    priority_3: "3 — Thông tin (xanh)",
    priority_4: "4 — Ưu tiên thấp (xám)",
    no_alerts: "Chưa có báo động nào. Nhấn 'Thêm báo động' để bắt đầu.",
    alert_num: "Báo động",
    collapse: "Đóng",
    expand: "Chỉnh sửa",
    move_up: "Lên",
    move_down: "Xuống",
    version: "Phiên bản",
    op_eq: "= bằng",
    op_ne: "≠ không bằng",
    op_gt: "> lớn hơn",
    op_lt: "< nhỏ hơn",
    op_gte: "≥ lớn hơn hoặc bằng",
    op_lte: "≤ nhỏ hơn hoặc bằng",
    cycle_animation: "Hiệu ứng chuyển đổi",
    anim_fold:    "🃏 Fold — lật trang 3D",
    anim_slide:   "➡️ Slide — trượt ngang",
    anim_fade:    "🌫️ Fade — mờ dần",
    anim_flip:    "🔄 Flip — lật thẻ",
    anim_zoom:    "🔍 Zoom — phóng to",
    anim_glitch:  "⚡ Glitch — hiệu ứng kỹ thuật số",
    anim_bounce:  "🏀 Bounce — nảy đàn hồi",
    anim_swing:   "🎪 Swing — con lắc",
    anim_blur:    "💨 Blur — làm mờ",
    anim_split:   "✂️ Split — chia dọc",
    anim_roll:    "🎲 Roll — cuộn",
    anim_curtain: "🎭 Curtain — màn sân khấu",
    entity_filter: "Bộ lọc thực thể (văn bản)",
    entity_filter_help: "Tìm tất cả thực thể có ID hoặc tên chứa văn bản này. Hỗ trợ wildcard * (vd. sensor.battery_*_level). Nhấn số kết quả để xem danh sách và dùng 'Đảo ngược lựa chọn'. Dùng {name}, {entity}, {state} trong thông báo.",
    entity_filter_count: "thực thể phù hợp",
    entity_filter_excluded: "đã loại trừ",
    entity_filter_zero: "Không tìm thấy thực thể nào",
    entity_filter_exclude_tip: "Nhấn vào thực thể để loại trừ — nhấn lại để đưa vào",
    entity_filter_invert: "Đảo ngược lựa chọn",
    alert_attribute: "Thuộc tính (tùy chọn)",
    alert_attribute_help: "vd. battery_level — để trống để dùng trạng thái thực thể. Hỗ trợ đường dẫn lồng nhau: vd. activity.0.forecast",
    secondary_entity: "Thực thể giá trị phụ (tùy chọn)",
    secondary_entity_help: "Hiển thị giá trị trực tiếp của thực thể này làm dòng bổ sung bên dưới thông báo.",
    secondary_text: "Văn bản phụ tĩnh (tùy chọn)",
    secondary_text_help: "Văn bản cố định hiển thị bên dưới thông báo. Hỗ trợ {state}, {name}, {entity}. Không cần thực thể cảm biến.",
    show_filter_name: "Hiển thị tên thực thể (từ entity_filter)",
    secondary_attribute: "Thuộc tính giá trị phụ",
    conditions_section: "Điều kiện bổ sung",
    conditions_logic: "Logic",
    logic_and: "AND — tất cả phải khớp",
    logic_or: "OR — ít nhất một khớp",
    add_condition: "Thêm điều kiện",
    condition_entity: "Thực thể điều kiện",
    condition_attribute: "Thuộc tính điều kiện",
    tap_action_section: "Hành động nhấn",
    hold_action_section: "Hành động giữ (500ms)",
    snooze_action_section: "Hành động tạm hoãn 💤 — thực hiện khi nhấn nút tạm hoãn",
    timer_theme_category: "Hẹn giờ",
    timer_placeholder_hint: "Dùng {timer} trong thông báo để hiển thị đếm ngược (vd. 'Đã tắt trong {timer}')",
    action_type: "Loại hành động",
    action_none: "Không có",
    action_call_service: "Gọi dịch vụ",
    action_navigate: "Điều hướng đến trang",
    action_more_info: "Xem thêm thông tin",
    action_url: "Mở URL",
    action_service: "Dịch vụ HA",
    action_target: "Thực thể đích",
    action_service_data: "Dữ liệu thêm (JSON tùy chọn)",
    action_navigate_path: "Đường dẫn (vd. /lovelace/home)",
    action_url_path: "URL cần mở",
    delete_item: "Xóa",
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
  { value: "nuclear",      label: "☢️ Nuclear (Radiazione)" },
  { value: "flood",        label: "🌊 Flood (Onde animate)" },
  { value: "motion",       label: "👁️ Motion (Night-vision scan)" },
  { value: "intruder",     label: "🚷 Intruder (Sirena rossa)" },
  { value: "toxic",        label: "☠️ Toxic (Bolle verdi)" },
  { sep: true,  label: "── ⚠️ ATTENZIONE ──" },
  { value: "warning",      label: "⚠️ Warning (Bordo ambra)" },
  { value: "caution",      label: "🟡 Caution (Nastro giallo)" },
  { value: "radar",        label: "🎯 Radar (Sonar sweep)" },
  { value: "temperature",  label: "🌡️ Temperature (Termometro)" },
  { value: "battery",      label: "🔋 Battery (Scarica)" },
  { value: "door",         label: "🚪 Door (Porta aperta)" },
  { sep: true,  label: "── ℹ️ INFORMAZIONE ──" },
  { value: "info",         label: "ℹ️ Info (Bordo blu)" },
  { value: "notification", label: "🔔 Notification (Bubble)" },
  { value: "aurora",       label: "🌌 Aurora (Animato)" },
  { value: "hologram",     label: "🔷 Hologram (Olografico)" },
  { value: "presence",     label: "🏠 Presence (Ping radar)" },
  { value: "update",       label: "🔄 Update (Anello rotante)" },
  { sep: true,  label: "── ✅ TUTTO OK ──" },
  { value: "success",      label: "✅ Success (Verde)" },
  { value: "check",        label: "🟢 Check (Anello pulsante)" },
  { value: "confetti",     label: "🎉 Confetti (Coriandoli)" },
  { value: "heartbeat",    label: "💓 Heartbeat (ECG pulsante)" },
  { value: "shield",       label: "🛡️ Shield (Scudo + scan)" },
  { value: "power",        label: "⚡ Power (Fulmine verde)" },
  { sep: true,  label: "── 🎨 STILE ──" },
  { value: "ticker",       label: "📰 Ticker (Scorrevole)" },
  { value: "neon",         label: "⚡ Neon (Cyberpunk)" },
  { value: "glass",        label: "🔮 Glass (Glassmorphism)" },
  { value: "matrix",       label: "💻 Matrix (Terminale)" },
  { value: "minimal",      label: "📋 Minimal (Pulito)" },
  { value: "retro",        label: "📺 Retro (CRT fosforescente)" },
  { value: "cyberpunk",    label: "🤖 Cyberpunk (Neon viola/cyan)" },
  { value: "vapor",        label: "🌸 Vapor (Vaporwave grid)" },
  { value: "lava",         label: "🌋 Lava (Blob arancio)" },
  // Timer themes
  { value: "countdown",    label: "⏱️ Countdown (Barra progressiva)" },
  { value: "hourglass",    label: "⏳ Hourglass (Riempimento verticale)" },
  { value: "timer_pulse",  label: "💥 Timer Pulse (Pulsante veloce)" },
  { value: "timer_ring",   label: "🔵 Timer Ring (Anello SVG)" },
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
      _filterPreviewOpen: { type: Object },
      _lang: { type: String },
    };
  }

  constructor() {
    super();
    this._activeTab = "general";
    this._expandedAlerts = new Set();
    this._filterPreviewOpen = new Set();
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
   * onlyOk=true   — only "ok" themes (clear_theme selector)
   * timerOnly=true — only "timer" themes (when entity is timer.*)
   */
  _renderThemeSelect(labelKey, currentValue, handler, onlyOk = false, timerOnly = false) {
    const GROUPS = [
      { cat: "critical", label: "🚨 Critico / Critical" },
      { cat: "warning",  label: "⚠️ Attenzione / Warning" },
      { cat: "info",     label: "ℹ️ Informazione / Info" },
      { cat: "ok",       label: "✅ Tutto OK / All Clear" },
      { cat: "style",    label: "🎨 Stile / Style" },
    ];
    const TIMER_GROUP = { cat: "timer", label: `⏱️ ${this._t("timer_theme_category")}` };

    const allThemes = THEME_OPTIONS.filter((o) => !o.sep);
    const groups = timerOnly
      ? [TIMER_GROUP]
      : onlyOk
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

      <!-- Transition animation -->
      <div class="form-row">
        <div class="native-select-wrap">
          <label class="native-select-label">${this._t("cycle_animation")}</label>
          <select
            class="native-select"
            @change="${(e) => this._cycleAnimationChanged(e.target.value)}"
          >
            ${["fold", "slide", "fade", "flip", "zoom", "glitch", "bounce", "swing", "blur", "split", "roll", "curtain"].map((a) => html`
              <option value="${a}" ?selected="${(cfg.cycle_animation || "fold") === a}">
                ${this._t("anim_" + a)}
              </option>
            `)}
          </select>
        </div>
      </div>

      <!-- Snooze settings -->
      <div class="form-row">
        <div class="native-select-wrap">
          <label class="native-select-label">${this._t("snooze_default_duration")}</label>
          <select class="native-select"
            @change="${(e) => this._fireConfig({ ...this._config, snooze_default_duration: e.target.value === "menu" ? undefined : parseFloat(e.target.value) })}"
          >
            <option value="menu" ?selected="${!cfg.snooze_default_duration}">${this._t("snooze_option_menu")}</option>
            ${[[0.5, "30 min"], [1, "1h"], [4, "4h"], [8, "8h"], [24, "24h"]].map(([v, label]) => html`
              <option value="${v}" ?selected="${cfg.snooze_default_duration === v}">${label}</option>
            `)}
          </select>
        </div>
        <div class="helper-text">${this._t("snooze_default_duration_help")}</div>
      </div>

      <!-- History max events -->
      <div class="form-row">
        <div class="native-select-wrap">
          <label class="native-select-label">${this._t("history_max_events")}</label>
          <select class="native-select"
            @change="${(e) => this._fireConfig({ ...this._config, history_max_events: parseInt(e.target.value) })}"
          >
            ${[25, 50, 100, 200].map((n) => html`
              <option value="${n}" ?selected="${(cfg.history_max_events || 50) === n}">${n}</option>
            `)}
          </select>
        </div>
        <div class="helper-text">${this._t("history_max_events_help")}</div>
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

      <!-- Large buttons toggle -->
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("large_buttons")}</span>
          <ha-switch
            .checked="${!!cfg.large_buttons}"
            @change="${(e) => this._fireConfig({ ...this._config, large_buttons: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
      </div>

      <!-- Show snooze reactivation bar toggle -->
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("show_snooze_bar")}</span>
          <ha-switch
            .checked="${cfg.show_snooze_bar !== false}"
            @change="${(e) => this._fireConfig({ ...this._config, show_snooze_bar: e.target.checked ? undefined : false })}"
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

      <div class="test-mode-box${this._config.test_mode ? " test-mode-box--active" : ""}">
        <div class="test-mode-box-header">
          <span class="test-mode-box-icon">🧪</span>
          <div class="test-mode-box-text">
            <div class="test-mode-box-title">${this._t("test_mode")}</div>
            <div class="test-mode-box-desc">${this._t("test_mode_desc")}</div>
          </div>
          <ha-switch
            .checked="${!!this._config.test_mode}"
            @change="${(e) => this._fireConfig({ ...this._config, test_mode: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
        ${this._config.test_mode ? html`
          <div class="test-mode-box-warning">⚠ ${this._t("test_mode_warning")}</div>
        ` : ""}
      </div>
    `;
  }

  _renderAlertItem(alert, index) {
    const isExpanded = this._expandedAlerts.has(index);
    const alerts = this._config.alerts || [];
    const prio = alert.priority || 1;
    const rawIcon = alert.icon || (THEME_META[alert.theme] || {}).icon || "🔔";
    const icon = (alert.use_ha_icon && rawIcon && (rawIcon.startsWith("mdi:") || rawIcon.startsWith("hass:")))
      ? html`<ha-icon icon="${rawIcon}" style="--mdc-icon-size:1.2em;vertical-align:middle;"></ha-icon>`
      : rawIcon;
    const entityLabel = alert.entity_filter
      ? `[${this._t("entity_filter")}: "${alert.entity_filter}"]`
      : alert.entity || (this._lang === "it" ? "(non impostato)" : "(not set)");
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
                <!-- Entity filter (text) — expands to one alert per matched entity -->
                <div>
                  <ha-textfield
                    .label="${this._t("entity_filter")}"
                    .value="${alert.entity_filter || ""}"
                    @change="${(e) => this._updateAlert(index, {
                      entity_filter: e.target.value || undefined,
                      entity: e.target.value ? undefined : alert.entity
                    })}"
                  ></ha-textfield>
                  <div class="helper-text">
                    ${alert.entity_filter && this._hass ? (() => {
                      const matchFn = this._buildFilterMatcher(alert.entity_filter);
                      const excluded = new Set(alert.entity_filter_exclude || []);
                      const allMatched = Object.entries(this._hass.states).filter(([id, s]) =>
                        matchFn(id) || matchFn(s.attributes.friendly_name || "")
                      );
                      const activeCount = allMatched.filter(([id]) => !excluded.has(id)).length;
                      const excludedCount = excluded.size;
                      const previewOpen = this._filterPreviewOpen.has(index);
                      return allMatched.length === 0
                        ? html`<span style="color:var(--error-color,#db4437)">${this._t("entity_filter_zero")}</span>`
                        : html`
                          <button class="filter-count-btn" @click="${() => {
                            const next = new Set(this._filterPreviewOpen);
                            if (next.has(index)) next.delete(index); else next.add(index);
                            this._filterPreviewOpen = next;
                            this.requestUpdate();
                          }}">
                            <span style="color:var(--success-color,#43a047)"><b>${activeCount}</b> ${this._t("entity_filter_count")}</span>
                            ${excludedCount ? html`<span style="color:var(--error-color,#db4437);margin-left:4px">(${excludedCount} ${this._t("entity_filter_excluded")})</span>` : ""}
                            <span class="filter-count-chevron">${previewOpen ? "▲" : "▼"}</span>
                          </button>
                          ${previewOpen ? html`
                            <div class="filter-entity-list">
                              <div class="filter-entity-tip">${this._t("entity_filter_exclude_tip")}</div>
                              <button class="filter-invert-btn" @click="${() => {
                                const newExcluded = allMatched.filter(([id]) => !excluded.has(id)).map(([id]) => id);
                                this._updateAlert(index, { entity_filter_exclude: newExcluded.length ? newExcluded : undefined });
                              }}">⇄ ${this._t("entity_filter_invert")}</button>
                              ${allMatched.map(([id, s]) => {
                                const isExcluded = excluded.has(id);
                                return html`
                                  <div class="filter-entity-row ${isExcluded ? "filter-entity-excluded" : ""}"
                                    @click="${() => this._toggleFilterExclude(index, id)}">
                                    <span class="filter-entity-toggle">${isExcluded ? "✗" : "✓"}</span>
                                    <span class="filter-entity-name">${s.attributes.friendly_name || id}</span>
                                    <span class="filter-entity-id">${id}</span>
                                    <span class="filter-entity-state">${s.state}</span>
                                  </div>
                                `;
                              })}
                            </div>
                          ` : ""}
                        `;
                    })() : this._t("entity_filter_help")}
                  </div>
                </div>

                <!-- Entity picker — hidden when entity_filter is active -->
                ${!alert.entity_filter ? html`
                <ha-entity-picker
                  .label="${this._t("alert_entity")}"
                  .hass="${this._hass}"
                  .value="${alert.entity || ""}"
                  allow-custom-entity
                  @value-changed="${(e) => this._alertEntityChanged(e.detail.value, index)}"
                ></ha-entity-picker>
                ` : ""}

                <!-- Attribute (optional) — check attribute instead of state -->
                <div>
                  <ha-textfield
                    .label="${this._t("alert_attribute")}"
                    .value="${alert.attribute || ""}"
                    @change="${(e) => this._alertAttributeChanged(e.target.value, index)}"
                  ></ha-textfield>
                  <div class="helper-text">${this._t("alert_attribute_help")}</div>
                </div>

                <!-- Secondary static text -->
                <div>
                  <ha-textfield
                    .label="${this._t("secondary_text")}"
                    .value="${alert.secondary_text || ""}"
                    @change="${(e) => this._updateAlert(index, { secondary_text: e.target.value || undefined })}"
                  ></ha-textfield>
                  <div class="helper-text">${this._t("secondary_text_help")}</div>
                </div>

                <!-- Secondary entity — live value shown on card below message -->
                <div>
                <ha-entity-picker
                  .label="${this._t("secondary_entity")}"
                  .hass="${this._hass}"
                  .value="${alert.secondary_entity || ""}"
                  allow-custom-entity
                  @value-changed="${(e) => this._updateAlert(index, { secondary_entity: e.detail.value || undefined })}"
                ></ha-entity-picker>
                <div class="helper-text">${this._t("secondary_entity_help")}</div>
                </div>
                ${alert.secondary_entity ? html`
                  <ha-textfield
                    .label="${this._t("secondary_attribute")}"
                    .value="${alert.secondary_attribute || ""}"
                    @change="${(e) => this._updateAlert(index, { secondary_attribute: e.target.value.trim() || undefined })}"
                  ></ha-textfield>
                ` : ""}

                <!-- show_filter_name toggle — only when entity_filter is set -->
                ${alert.entity_filter ? html`
                  <ha-formfield .label="${this._t("show_filter_name")}">
                    <ha-switch
                      ?checked="${alert.show_filter_name !== false}"
                      @change="${(e) => this._updateAlert(index, { show_filter_name: e.target.checked ? undefined : false })}"
                    ></ha-switch>
                  </ha-formfield>
                ` : ""}

                <!-- Condition: operator + value -->
                <div class="form-row-2col">
                  <div class="native-select-wrap">
                    <label class="native-select-label">${this._t("alert_operator")}</label>
                    <select
                      class="native-select"
                      @change="${(e) => this._alertOperatorChanged(e.target.value, index)}"
                    >
                      ${[
                        ["=",  "op_eq"],
                        ["!=", "op_ne"],
                        [">",  "op_gt"],
                        ["<",  "op_lt"],
                        [">=", "op_gte"],
                        ["<=", "op_lte"],
                      ].map(([op, key]) => html`
                        <option value="${op}" ?selected="${(alert.operator || "=") === op}">
                          ${this._t(key)}
                        </option>
                      `)}
                    </select>
                  </div>
                  <div>
                    <ha-textfield
                      .label="${this._t("alert_state")}"
                      .value="${Array.isArray(alert.state) ? alert.state.join(", ") : (alert.state || "on")}"
                      @change="${(e) => this._alertStateChanged(e.target.value, index)}"
                    ></ha-textfield>
                    <div class="helper-text">${this._t("alert_state_help")}</div>
                    ${alert.entity && this._hass && this._hass.states[alert.entity]
                      ? (() => {
                          const es = this._hass.states[alert.entity];
                          const attrVal = alert.attribute
                            ? es.attributes[alert.attribute]
                            : undefined;
                          const displayVal = alert.attribute
                            ? (attrVal !== undefined ? String(attrVal) : null)
                            : es.state;
                          return displayVal !== null
                            ? html`<div class="helper-text current-state-hint">
                                ${this._t("current_state")}${alert.attribute ? html` <em>(${alert.attribute})</em>` : ""}: <strong>"${displayVal}"</strong>
                              </div>`
                            : html`<div class="helper-text current-state-hint" style="color:var(--error-color,#f44336)">
                                attribute <strong>"${alert.attribute}"</strong> not found
                              </div>`;
                        })()
                      : ""}
                  </div>
                </div>

                <!-- Priority -->
                <!-- @closed stops the mwc-menu "closed" event from bubbling up to
                     the outer ha-dialog/mwc-dialog which would close the editor. -->
                <ha-select
                  .label="${this._t("alert_priority")}"
                  .value="${String(alert.priority || 1)}"
                  fixedMenuPosition
                  naturalMenuWidth
                  @closed="${(e) => e.stopPropagation()}"
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

                <!-- Message -->
                <ha-textfield
                  .label="${this._t("alert_message")}"
                  .value="${alert.message || ""}"
                  @change="${(e) => this._alertMessageChanged(e.target.value, index)}"
                ></ha-textfield>
                <div class="helper-text">${this._t("alert_message_help")}</div>

                <!-- Theme per alert — timer entities see only timer themes -->
                ${this._renderThemeSelect(
                  "alert_theme",
                  alert.theme || ((alert.entity || "").startsWith("timer.") ? "countdown" : "emergency"),
                  (v) => this._alertThemeChanged(v, index),
                  false,
                  (alert.entity || alert.entity_filter || "").startsWith("timer.")
                )}
                ${(alert.entity || "").startsWith("timer.") ? html`
                  <div class="helper-text">${this._t("timer_placeholder_hint")}</div>
                ` : ""}

                <!-- Icon override -->
                <div>
                  <ha-formfield .label="${this._t("use_ha_icon")}">
                    <ha-switch
                      ?checked="${!!alert.use_ha_icon}"
                      @change="${(e) => this._alertHaIconToggled(e.target.checked, index)}"
                    ></ha-switch>
                  </ha-formfield>
                  ${alert.use_ha_icon
                    ? html`<ha-icon-picker
                        .label="${this._t("alert_icon")}"
                        .value="${alert.icon || ""}"
                        @value-changed="${(e) => this._alertIconChanged(e.detail.value, index)}"
                      ></ha-icon-picker>`
                    : html`<ha-textfield
                        .label="${this._t("alert_icon")}"
                        .value="${alert.icon || ""}"
                        .placeholder="🔔"
                        @change="${(e) => this._alertIconChanged(e.target.value, index)}"
                      ></ha-textfield>`
                  }
                  <div class="helper-text">${this._t("alert_icon_help")}</div>
                </div>

                <!-- Badge visibility + custom label -->
                <div>
                  <ha-formfield .label="${this._t("show_badge")}">
                    <ha-switch
                      ?checked="${alert.show_badge !== false}"
                      @change="${(e) => this._updateAlert(index, { show_badge: e.target.checked ? undefined : false })}"
                    ></ha-switch>
                  </ha-formfield>
                  ${alert.show_badge !== false ? html`
                    <ha-textfield
                      .label="${this._t("badge_label")}"
                      .value="${alert.badge_label || ""}"
                      .placeholder="${this._getDefaultBadgeLabel(alert)}"
                      @change="${(e) => this._updateAlert(index, { badge_label: e.target.value.trim() || undefined })}"
                    ></ha-textfield>
                    <div class="helper-text">${this._t("badge_label_help")}</div>
                  ` : ""}
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

                <!-- Extra AND/OR conditions -->
                <div class="section-divider">${this._t("conditions_section")}</div>
                <div class="form-row">
                  <div class="native-select-wrap">
                    <label class="native-select-label">${this._t("conditions_logic")}</label>
                    <select
                      class="native-select"
                      @change="${(e) => this._updateAlert(index, { conditions_logic: e.target.value })}"
                    >
                      <option value="and" ?selected="${(alert.conditions_logic || "and") === "and"}">${this._t("logic_and")}</option>
                      <option value="or"  ?selected="${alert.conditions_logic === "or"}">${this._t("logic_or")}</option>
                    </select>
                  </div>
                </div>
                ${(alert.conditions || []).map((cond, ci) => html`
                  <div class="extra-row">
                    <div class="extra-row-header">
                      <span class="extra-row-label">⚙ ${this._t("condition_entity")} ${ci + 1}</span>
                      <button class="btn-delete-small" @click="${() => this._deleteCondition(index, ci)}">
                        🗑 ${this._t("delete_item")}
                      </button>
                    </div>
                    <ha-entity-picker
                      .label="${this._t("condition_entity")}"
                      .hass="${this._hass}"
                      .value="${cond.entity || ""}"
                      allow-custom-entity
                      @value-changed="${(e) => this._updateCondition(index, ci, { entity: e.detail.value })}"
                    ></ha-entity-picker>
                    <ha-textfield
                      .label="${this._t("condition_attribute")}"
                      .value="${cond.attribute || ""}"
                      @change="${(e) => this._updateCondition(index, ci, { attribute: e.target.value || undefined })}"
                    ></ha-textfield>
                    <div class="form-row-2col">
                      <div class="native-select-wrap">
                        <label class="native-select-label">${this._t("alert_operator")}</label>
                        <select
                          class="native-select"
                          @change="${(e) => this._updateCondition(index, ci, { operator: e.target.value })}"
                        >
                          ${[["=","op_eq"],["!=","op_ne"],[">","op_gt"],["<","op_lt"],[">=","op_gte"],["<=","op_lte"]].map(([op, key]) => html`
                            <option value="${op}" ?selected="${(cond.operator || "=") === op}">${this._t(key)}</option>
                          `)}
                        </select>
                      </div>
                      <ha-textfield
                        .label="${this._t("alert_state")}"
                        .value="${cond.state || "on"}"
                        @change="${(e) => this._updateCondition(index, ci, { state: e.target.value.trim() })}"
                      ></ha-textfield>
                    </div>
                  </div>
                `)}
                <button class="btn-add-small" @click="${() => this._addCondition(index)}">
                  + ${this._t("add_condition")}
                </button>

                <!-- Per-alert snooze duration override -->
                <div class="section-divider">💤 ${this._t("snooze_duration")}</div>
                <div class="native-select-wrap">
                  <select class="native-select"
                    @change="${(e) => {
                      const v = e.target.value;
                      this._updateAlert(index, { snooze_duration: v === "__global__" ? undefined : v === "__menu__" ? null : Number(v) });
                    }}"
                  >
                    <option value="__global__" ?selected="${alert.snooze_duration === undefined}">${this._t("snooze_duration_global")}</option>
                    <option value="__menu__"   ?selected="${alert.snooze_duration === null}">${this._t("snooze_duration_menu")}</option>
                    <option value="1"  ?selected="${alert.snooze_duration === 1}">1h</option>
                    <option value="4"  ?selected="${alert.snooze_duration === 4}">4h</option>
                    <option value="8"  ?selected="${alert.snooze_duration === 8}">8h</option>
                    <option value="24" ?selected="${alert.snooze_duration === 24}">24h</option>
                  </select>
                </div>
                <div class="helper-text">${this._t("snooze_duration_help")}</div>

                <!-- Sound per alert -->
                <div class="section-divider">🔊 ${this._t("alert_sound")}</div>
                <div class="form-row">
                  <div class="form-row-inline">
                    <span>${this._t("alert_sound")}</span>
                    <ha-switch
                      .checked="${!!alert.sound}"
                      @change="${(e) => this._updateAlert(index, { sound: e.target.checked || undefined })}"
                    ></ha-switch>
                  </div>
                  <div class="helper-text">${this._t("sound_enabled_help")}</div>
                </div>
                ${alert.sound ? html`
                  <div class="form-row">
                    <ha-textfield
                      .label="${this._t("alert_sound_url")}"
                      .value="${alert.sound_url || ""}"
                      placeholder="https://example.com/alert.mp3"
                      @change="${(e) => this._updateAlert(index, { sound_url: e.target.value || undefined })}"
                    ></ha-textfield>
                    <div class="helper-text">${this._t("alert_sound_url_help")}</div>
                  </div>
                ` : ""}

                <!-- Tap action / Hold action / Snooze action -->
                ${this._renderActionConfig(alert, index, "tap_action", this._t("tap_action_section"))}
                ${this._renderActionConfig(alert, index, "hold_action", this._t("hold_action_section"))}
                ${this._renderActionConfig(alert, index, "snooze_action", this._t("snooze_action_section"))}


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

  _toggleFilterExclude(alertIndex, entityId) {
    const alert = (this._config.alerts || [])[alertIndex] || {};
    const excluded = new Set(alert.entity_filter_exclude || []);
    if (excluded.has(entityId)) excluded.delete(entityId);
    else excluded.add(entityId);
    this._updateAlert(alertIndex, {
      entity_filter_exclude: excluded.size > 0 ? [...excluded] : undefined,
    });
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

  _cycleAnimationChanged(value) {
    if (!value) return;
    // Fire with _preview_anim so the card plays one animation cycle as preview
    this._fireConfig({ ...this._config, cycle_animation: value, _preview_anim: true });
    setTimeout(() => {
      this._fireConfig({ ...this._config, cycle_animation: value, _preview_anim: undefined });
    }, 800);
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
    // In test mode: tell the card which alert to preview
    if (this._config.test_mode && next.has(index)) {
      this._fireConfig({ ...this._config, _preview_index: index });
    }
    this.requestUpdate();
  }

  _addAlert() {
    const alerts = [...(this._config.alerts || [])];
    const newIndex = alerts.length;
    const defaultTheme = "emergency";
    const defaultMsg = (DEFAULT_MSG[this._lang] || DEFAULT_MSG.en)[defaultTheme] || "";
    alerts.push({ entity: "", operator: "=", state: "on", message: defaultMsg, priority: 1, theme: defaultTheme, icon: "" });
    this._expandedAlerts = new Set([...this._expandedAlerts, newIndex]);
    // In test mode: jump card to the newly added alert
    const newConfig = this._config.test_mode
      ? { ...this._config, alerts, _preview_index: newIndex }
      : { ...this._config, alerts };
    this._fireConfig(newConfig);
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
    const alert = (this._config.alerts || [])[index] || {};
    const changes = { entity: value };
    const isTimer = value && value.startsWith("timer.");
    const wasTimer = (alert.entity || "").startsWith("timer.");

    // Timer entity → auto-set state "active" and switch to first timer theme
    if (isTimer) {
      changes.state = "active";
      changes.operator = "=";
      // Switch theme only if previous theme was not already a timer theme
      const prevThemeCat = (THEME_META[alert.theme] || {}).category;
      if (prevThemeCat !== "timer") {
        changes.theme = "countdown";
        changes.icon = THEME_META.countdown.icon;
      }
    }

    // Leaving timer entity → reset theme to emergency if it was a timer theme
    if (!isTimer && wasTimer) {
      const prevThemeCat = (THEME_META[alert.theme] || {}).category;
      if (prevThemeCat === "timer") {
        changes.theme = "emergency";
        changes.icon = THEME_META.emergency.icon;
      }
    }

    // Auto-fill message with friendly name if message is still empty or the theme default
    if (value && this._hass) {
      const msgs = DEFAULT_MSG[this._lang] || DEFAULT_MSG.en;
      const currentDefault = msgs[alert.theme] || "";
      const isDefaultMsg = !alert.message || alert.message === currentDefault;
      if (isDefaultMsg) {
        const friendlyName = this._hass.states[value]?.attributes?.friendly_name || "";
        if (friendlyName) changes.message = friendlyName;
      }
    }

    this._updateAlert(index, changes);
  }

  _alertOperatorChanged(value, index) {
    if (!value) return;
    this._updateAlert(index, { operator: value });
  }

  _alertStateChanged(value, index) {
    this._updateAlert(index, { state: value.trim() });
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

  _alertHaIconToggled(checked, index) {
    const alert = (this._config.alerts || [])[index] || {};
    if (checked) {
      // Try to read the mdi icon from the entity's attributes
      const entityIcon = this._hass?.states[alert.entity]?.attributes?.icon || "";
      this._updateAlert(index, { use_ha_icon: true, icon: entityIcon });
    } else {
      // Restore the theme default emoji
      const themeIcon = (THEME_META[alert.theme] || {}).icon || "";
      this._updateAlert(index, { use_ha_icon: false, icon: themeIcon });
    }
  }

  /** Builds a matcher function for entity_filter (mirrors card logic). */
  _buildFilterMatcher(filter) {
    const f = filter.toLowerCase();
    if (f.includes("*")) {
      const pattern = f.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      const re = new RegExp(pattern);
      return (text) => re.test(text.toLowerCase());
    }
    return (text) => text.toLowerCase().includes(f);
  }

  /** Returns the default badge label for a given alert based on its theme category */
  _getDefaultBadgeLabel(alert) {
    const cat = (THEME_META[alert.theme] || {}).category || "info";
    const map = { critical: "critical", warning: "warning_label", info: "info_label", ok: "success_label", timer: "info_label" };
    return this._t(map[cat] || "info_label");
  }

  _alertAttributeChanged(value, index) {
    this._updateAlert(index, { attribute: value.trim() || undefined });
  }

  // -------------------------------------------------------------------------
  // Condition helpers
  // -------------------------------------------------------------------------
  _addCondition(alertIndex) {
    const alerts = [...(this._config.alerts || [])];
    const conditions = [...(alerts[alertIndex].conditions || [])];
    conditions.push({ entity: "", operator: "=", state: "on" });
    alerts[alertIndex] = { ...alerts[alertIndex], conditions };
    this._fireConfig({ ...this._config, alerts });
  }

  _deleteCondition(alertIndex, condIndex) {
    const alerts = [...(this._config.alerts || [])];
    const conditions = [...(alerts[alertIndex].conditions || [])];
    conditions.splice(condIndex, 1);
    alerts[alertIndex] = { ...alerts[alertIndex], conditions };
    this._fireConfig({ ...this._config, alerts });
  }

  _updateCondition(alertIndex, condIndex, changes) {
    const alerts = [...(this._config.alerts || [])];
    const conditions = [...(alerts[alertIndex].conditions || [])];
    conditions[condIndex] = { ...conditions[condIndex], ...changes };
    alerts[alertIndex] = { ...alerts[alertIndex], conditions };
    this._fireConfig({ ...this._config, alerts });
  }

  // -------------------------------------------------------------------------
  // Action helpers — tap_action / hold_action
  // -------------------------------------------------------------------------
  _setActionConfig(alertIndex, key, field, value) {
    const alerts = [...(this._config.alerts || [])];
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      [key]: { ...(alerts[alertIndex][key] || { action: "none" }), [field]: value },
    };
    this._fireConfig({ ...this._config, alerts });
  }

  /** Converts our action config format to ha-service-control value format */
  _toServiceControlValue(cfg) {
    return {
      action: cfg.service || "",
      target: cfg.target || {},
      data: cfg.service_data || {},
    };
  }

  /** Handles ha-service-control value-changed and saves back to our format */
  _onServiceControlChanged(alertIndex, key, val) {
    const alerts = [...(this._config.alerts || [])];
    const current = alerts[alertIndex][key] || { action: "call-service" };
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      [key]: {
        ...current,
        action: "call-service",
        service: val.action || val.service || current.service || "",
        target: (val.target && Object.keys(val.target).length) ? val.target : undefined,
        service_data: (val.data && Object.keys(val.data).length) ? val.data : undefined,
      },
    };
    this._fireConfig({ ...this._config, alerts });
  }

  /** Renders the action config form for tap_action or hold_action */
  _renderActionConfig(alert, index, key, sectionLabel) {
    const cfg = alert[key] || { action: "none" };
    const type = cfg.action || "none";
    return html`
      <div class="section-divider">${sectionLabel}</div>
      <div class="native-select-wrap">
        <label class="native-select-label">${this._t("action_type")}</label>
        <select class="native-select"
          @change="${(e) => this._setActionConfig(index, key, "action", e.target.value)}"
        >
          ${["none","call-service","navigate","more-info","url"].map((t) => html`
            <option value="${t}" ?selected="${type === t}">
              ${this._t("action_" + t.replace("-","_")) || t}
            </option>
          `)}
        </select>
      </div>
      ${type === "call-service" ? html`
        <ha-service-control
          .hass="${this._hass}"
          .value="${this._toServiceControlValue(cfg)}"
          .showAdvanced="${true}"
          @value-changed="${(e) => this._onServiceControlChanged(index, key, e.detail.value)}"
        ></ha-service-control>
      ` : ""}
      ${type === "navigate" ? html`
        <ha-textfield
          .label="${this._t("action_navigate_path")}"
          .value="${cfg.navigation_path || ""}"
          @change="${(e) => this._setActionConfig(index, key, "navigation_path", e.target.value)}"
        ></ha-textfield>
      ` : ""}
      ${type === "more-info" ? html`
        <ha-entity-picker
          .label="${this._t("action_target")}"
          .hass="${this._hass}"
          .value="${cfg.entity_id || ""}"
          allow-custom-entity
          @value-changed="${(e) => this._setActionConfig(index, key, "entity_id", e.detail.value || "")}"
        ></ha-entity-picker>
      ` : ""}
      ${type === "url" ? html`
        <ha-textfield
          .label="${this._t("action_url_path")}"
          .value="${cfg.url_path || ""}"
          @change="${(e) => this._setActionConfig(index, key, "url_path", e.target.value)}"
        ></ha-textfield>
      ` : ""}
    `;
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
      :host {
        --mdc-text-field-fill-color: var(--input-fill-color, var(--secondary-background-color, transparent));
        --mdc-select-fill-color: var(--input-fill-color, var(--secondary-background-color, transparent));
        --mdc-text-field-ink-color: var(--primary-text-color);
        --mdc-text-field-label-ink-color: var(--secondary-text-color);
        --mdc-select-ink-color: var(--primary-text-color);
        --mdc-select-label-ink-color: var(--secondary-text-color);
      }

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
      .current-state-hint {
        color: var(--primary-color, #03a9f4);
        margin-top: 2px;
      }
      .current-state-hint strong {
        font-family: monospace;
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
      .filter-count-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        padding: 2px 0;
        cursor: pointer;
        font-size: 0.85rem;
      }
      .filter-count-chevron {
        font-size: 0.7rem;
        color: var(--secondary-text-color, #888);
      }
      .filter-entity-list {
        margin-top: 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        overflow: hidden;
        max-height: 200px;
        overflow-y: auto;
      }
      .filter-invert-btn {
        display: block;
        width: 100%;
        margin: 4px 0;
        padding: 4px 8px;
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        text-align: center;
        color: var(--primary-text-color);
      }
      .filter-invert-btn:hover {
        background: var(--primary-color, #03a9f4);
        color: white;
        border-color: var(--primary-color, #03a9f4);
      }
      .filter-entity-tip {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #888);
        padding: 5px 10px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        font-style: italic;
      }
      .filter-entity-row {
        display: grid;
        grid-template-columns: auto 1fr 1.4fr auto;
        gap: 8px;
        padding: 5px 10px;
        font-size: 0.8rem;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        align-items: center;
        cursor: pointer;
        transition: background 0.15s;
      }
      .filter-entity-row:last-child { border-bottom: none; }
      .filter-entity-row:hover { background: var(--secondary-background-color, #f5f5f5); }
      .filter-entity-excluded {
        opacity: 0.4;
        text-decoration: line-through;
      }
      .filter-entity-toggle {
        font-size: 0.85rem;
        font-weight: 700;
        width: 16px;
        text-align: center;
      }
      .filter-entity-row:not(.filter-entity-excluded) .filter-entity-toggle { color: var(--success-color, #43a047); }
      .filter-entity-excluded .filter-entity-toggle { color: var(--error-color, #db4437); }
      .filter-entity-name {
        font-weight: 500;
        color: var(--primary-text-color, #212121);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .filter-entity-id {
        color: var(--secondary-text-color, #888);
        font-family: monospace;
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .filter-entity-state {
        color: var(--primary-color, #03a9f4);
        font-weight: 600;
        white-space: nowrap;
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

      /* ---- Test mode box ---- */
      .test-mode-box {
        margin-top: 16px;
        border-radius: 10px;
        border: 2px solid rgba(255, 180, 0, 0.35);
        background: rgba(255, 180, 0, 0.07);
        overflow: hidden;
      }
      .test-mode-box--active {
        border-color: rgba(255, 180, 0, 0.80);
        background: rgba(255, 180, 0, 0.15);
      }
      .test-mode-box-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
      }
      .test-mode-box-icon {
        font-size: 1.4rem;
        flex-shrink: 0;
      }
      .test-mode-box-text {
        flex: 1;
      }
      .test-mode-box-title {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--primary-text-color);
      }
      .test-mode-box-desc {
        font-size: 0.78rem;
        color: var(--secondary-text-color, #888);
        margin-top: 2px;
      }
      .test-mode-box-warning {
        background: rgba(255, 130, 0, 0.85);
        color: #fff;
        font-size: 0.78rem;
        font-weight: 700;
        padding: 6px 14px;
        text-align: center;
        letter-spacing: 0.02em;
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

      /* ---- Section divider (Conditions / Actions) ---- */
      .section-divider {
        font-size: 0.70rem;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--secondary-text-color, #888);
        margin: 16px 0 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      /* ---- Extra row (condition / action) ---- */
      .extra-row {
        background: var(--secondary-background-color, #f8f8f8);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .extra-row-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .extra-row-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--secondary-text-color, #666);
        letter-spacing: 0.5px;
      }
      .btn-delete-small {
        background: none;
        border: 1px solid var(--error-color, #f44336);
        color: var(--error-color, #f44336);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 0.72rem;
        cursor: pointer;
        transition: background 0.15s;
      }
      .btn-delete-small:hover {
        background: rgba(244, 67, 54, 0.08);
      }
      .btn-add-small {
        background: rgba(3, 169, 244, 0.08);
        border: 1px dashed var(--primary-color, #03a9f4);
        color: var(--primary-color, #03a9f4);
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.80rem;
        cursor: pointer;
        width: 100%;
        margin-top: 2px;
        transition: background 0.15s;
      }
      .btn-add-small:hover {
        background: rgba(3, 169, 244, 0.16);
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
