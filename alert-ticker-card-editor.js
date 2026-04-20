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
const CARD_VERSION = "1.2.0";

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
  window:       { icon: "🪟", category: "warning"  },
  hologram:     { icon: "🔷", category: "info"     },
  presence:     { icon: "🏠", category: "info"     },
  update:       { icon: "🔄", category: "info"     },
  heartbeat:    { icon: "💓", category: "ok"       },
  shield:       { icon: "🛡️", category: "ok"       },
  power:        { icon: "⚡", category: "ok"       },
  cyberpunk:    { icon: "🤖", category: "style"    },
  vapor:        { icon: "🌸", category: "style"    },
  lava:         { icon: "🌋", category: "style"    },
  smoke:        { icon: "🌫️", category: "warning"  },
  wind:         { icon: "💨", category: "warning"  },
  leak:         { icon: "💧", category: "warning"  },
  cloud:        { icon: "☁️", category: "info"     },
  satellite:    { icon: "📡", category: "info"     },
  tips:         { icon: "💡", category: "info"     },
  sunrise:      { icon: "🌅", category: "ok"       },
  plant:        { icon: "🌱", category: "ok"       },
  lock:         { icon: "🔒", category: "ok"       },
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
    window:       "Finestra aperta",
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
    smoke:        "Fumo rilevato",
    wind:         "Vento forte",
    leak:         "Perdita d'acqua",
    cloud:        "Condizioni meteo",
    satellite:    "Segnale in arrivo",
    tips:         "Suggerimento disponibile",
    sunrise:      "Tutto a posto",
    plant:        "Stato ottimale",
    lock:         "Sistema protetto",
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
    window:       "Window open",
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
    smoke:        "Smoke detected",
    wind:         "Strong wind",
    leak:         "Water leak",
    cloud:        "Weather conditions",
    satellite:    "Signal incoming",
    tips:         "Tip available",
    sunrise:      "All good",
    plant:        "Optimal state",
    lock:         "System secured",
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
    window:       "Fenêtre ouverte",
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
    smoke:        "Fumée détectée",
    wind:         "Vent fort",
    leak:         "Fuite d'eau",
    cloud:        "Conditions météo",
    satellite:    "Signal entrant",
    tips:         "Conseil disponible",
    sunrise:      "Tout va bien",
    plant:        "État optimal",
    lock:         "Système sécurisé",
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
    window:       "Fenster offen",
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
    smoke:        "Rauch erkannt",
    wind:         "Starker Wind",
    leak:         "Wasserleck",
    cloud:        "Wetterbedingungen",
    satellite:    "Signal eingehend",
    tips:         "Tipp verfügbar",
    sunrise:      "Alles in Ordnung",
    plant:        "Optimaler Zustand",
    lock:         "System gesichert",
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
    window:       "Raam open",
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
    smoke:        "Rook gedetecteerd",
    wind:         "Harde wind",
    leak:         "Waterlek",
    cloud:        "Weersomstandigheden",
    satellite:    "Signaal inkomend",
    tips:         "Tip beschikbaar",
    sunrise:      "Alles in orde",
    plant:        "Optimale staat",
    lock:         "Systeem beveiligd",
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
    window:       "Cửa sổ đang mở",
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
    smoke:        "Phát hiện khói",
    wind:         "Gió mạnh",
    leak:         "Rò rỉ nước",
    cloud:        "Điều kiện thời tiết",
    satellite:    "Tín hiệu đến",
    tips:         "Mẹo có sẵn",
    sunrise:      "Mọi thứ ổn",
    plant:        "Trạng thái tối ưu",
    lock:         "Hệ thống an toàn",
  },
  ru: {
    emergency:    "Чрезвычайная ситуация",
    fire:         "Пожарная тревога",
    alarm:        "Тревога сработала",
    lightning:    "Отключение электричества",
    warning:      "Важное предупреждение",
    caution:      "Требуется осторожность",
    info:         "Информация доступна",
    notification: "Новое уведомление",
    aurora:       "Системное уведомление",
    success:      "Нормальное состояние",
    check:        "Проверка пройдена",
    confetti:     "Операция успешна",
    ticker:       "Обновление идёт",
    neon:         "Неоновое оповещение",
    glass:        "Стеклянное оповещение",
    matrix:       "Сообщение терминала",
    minimal:      "Оповещение",
    nuclear:      "Радиационная тревога",
    flood:        "Обнаружено затопление",
    motion:       "Обнаружено движение",
    intruder:     "Обнаружено вторжение",
    toxic:        "Токсичное вещество",
    radar:        "Идёт обнаружение",
    temperature:  "Критическая температура",
    battery:      "Низкий заряд батареи",
    door:         "Дверь открыта",
    window:       "Окно открыто",
    hologram:     "Системная проекция",
    presence:     "Обнаружено присутствие",
    update:       "Идёт обновление",
    heartbeat:    "Система работает",
    shield:       "Система защищена",
    power:        "Питание восстановлено",
    retro:        "Ретро оповещение",
    cyberpunk:    "Доступ к системе",
    vapor:        "Vaporwave уведомление",
    lava:         "Лавовое оповещение",
    smoke:        "Обнаружен дым",
    wind:         "Сильный ветер",
    leak:         "Утечка воды",
    cloud:        "Погодные условия",
    satellite:    "Входящий сигнал",
    tips:         "Совет доступен",
    sunrise:      "Всё в порядке",
    plant:        "Оптимальное состояние",
    lock:         "Система в безопасности",
  },
  da: {
    emergency:    "Nødsituation aktiv",
    fire:         "Brandalarm",
    alarm:        "Alarm udløst",
    lightning:    "Strømafbrydelse",
    warning:      "Vigtig advarsel",
    caution:      "Forsigtighed påkrævet",
    info:         "Information tilgængelig",
    notification: "Ny notifikation",
    aurora:       "Systemnotifikation",
    success:      "Normal tilstand",
    check:        "Kontrol bestået",
    confetti:     "Handling gennemført",
    ticker:       "Opdatering i gang",
    neon:         "Neon-advarsel",
    glass:        "Glas-alarm",
    matrix:       "Terminalbesked",
    minimal:      "Advarsel",
    nuclear:      "Strålingsalarm",
    flood:        "Oversvømmelse registreret",
    motion:       "Bevægelse registreret",
    intruder:     "Indtrængen i gang",
    toxic:        "Giftigt stof",
    radar:        "Registrering i gang",
    temperature:  "Kritisk temperatur",
    battery:      "Lavt batteri",
    door:         "Dør åben",
    window:       "Vindue åbent",
    hologram:     "Systemprojektion",
    presence:     "Tilstedeværelse registreret",
    update:       "Opdatering i gang",
    heartbeat:    "System fungerer",
    shield:       "System beskyttet",
    power:        "Strøm gendannet",
    retro:        "Retro-advarsel",
    cyberpunk:    "Systemadgang",
    vapor:        "Vaporwave-notifikation",
    lava:         "Lava-alarm",
    smoke:        "Røg registreret",
    wind:         "Kraftig vind",
    leak:         "Vandlækage",
    cloud:        "Vejrforhold",
    satellite:    "Signal modtages",
    tips:         "Tip tilgængelig",
    sunrise:      "Alt OK",
    plant:        "Optimal tilstand",
    lock:         "System sikret",
  },
};

// ---------------------------------------------------------------------------
// Editor translations
// ---------------------------------------------------------------------------
const ET = {
  it: {
    tab_general: "Generale",
    tab_alerts: "Avvisi",
    tab_overlay: "Overlay",
    tab_allclear: "Tutto Ok",
    back: "Indietro",
    all_clear_disabled_help: "Abilita 'Tutto Ok' per configurare il messaggio di assenza avvisi.",
    tab_layout: "Layout",
    hub_desc_general: "Ciclo, snooze e cronologia",
    hub_desc_layout: "Tema, altezza card e aspetto visivo",
    hub_desc_overlay: "Banner globale su tutti i dashboard",
    hub_desc_alerts: "Gestisci le condizioni di avviso",
    hub_desc_allclear: "Messaggio quando non ci sono avvisi",
    hub_report_issue: "Segnala un problema",
    hub_welcome: "Benvenuto! Configura la tua card selezionando una sezione qui sotto.",
    clear_display_mode_label: "Modalità di visualizzazione",
    clear_mode_message: "💬 Messaggio personalizzato",
    clear_mode_clock: "🕐 Orologio",
    clear_mode_weather: "🌤 Meteo",
    clear_mode_weather_clock: "🌤🕐 Meteo + Orologio",
    clear_weather_entity_label: "Entità meteo (weather.*)",
    cycle_interval: "Intervallo ciclo (secondi)",
    cycle_interval_help: "Secondi tra un avviso e l'altro quando ce ne sono più di uno attivi",
    section_all_clear: "Card 'tutto ok'",
    section_layout: "Layout & Aspetto",
    section_cycling: "Ciclo & Animazione",
    section_snooze: "Snooze 💤",
    section_history: "Cronologia",
    show_when_clear: "Mostra quando non ci sono avvisi",
    large_buttons: "Pulsanti grandi sempre visibili (💤 e 📋)",
    ha_theme: "Adatta al tema HA (compatibile con Mushroom e tutti i temi globali)",
    swipe_to_snooze: "Scorri a sinistra per silenziare 💤 (ideale per mobile)",
    vertical: "Layout verticale (icona sopra, testo sotto, centrato)",
    text_align_center: "Testo centrato (utile per layout Panel molto larghi)",
    card_height: "Altezza fissa card (px)",
    card_height_help: "Fissa l'altezza per evitare spostamenti del layout quando cambiano gli avvisi. Lascia vuoto per altezza automatica.",
    card_border: "Mostra bordo e nome card",
    card_border_help: "Aggiunge il bordo standard di Home Assistant attorno alla card. Quando non ci sono avvisi attivi, mostra un segnaposto con il nome della card invece di nasconderla completamente.",
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
    clear_badge_label: "Etichetta badge (es. 'Tutto ok', lascia vuoto per default)",
    clear_theme: "Tema per stato 'tutto ok'",
    alerts_list: "Lista avvisi configurati",
    add_alert: "Aggiungi avviso",
    alert_entity: "Entità",
    alert_operator: "Condizione",
    alert_state: "Valore",
    alert_state_help: "es. 'on', '80' (numerico con operatore > < >= <=)",
    current_state: "Stato attuale",
    alert_message: "Messaggio da visualizzare",
    alert_name: "Nome / Etichetta",
    alert_name_placeholder: "es. Sensori movimento piano",
    alert_name_help: "Etichetta opzionale mostrata come prefisso al messaggio (es. 'Sensori movimento: corridoio attivo'). Utile con entity_filter per distinguere gruppi di alert.",
    alert_message_help: "Usa {state} valore live, {name} nome, {entity} ID entità, {device} nome dispositivo. Supporta anche template HA completi: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Priorità",
    alert_theme: "Tema",
    alert_icon: "Icona",
    alert_icon_help: "Lascia vuoto per usare l'emoji del tema. Inserisci un'emoji personalizzata. Attiva 'Usa icona HA' per mostrare automaticamente l'icona MDI dell'entità (o sceglierne una con il selettore).",
    auto_icon_preview: "Icona automatica dall'entità",
    use_ha_icon: "Usa icona Home Assistant (mdi:)",
    icon_color: "Colore icona",
    icon_color_help: "Colore CSS: es. #ff0000, red, var(--error-color). Lascia vuoto per il colore del tema.",
    on_change: "Attiva ad OGNI cambio di stato (ignora le condizioni)",
    on_change_help: "L'alert appare ogni volta che lo stato cambia (qualunque valore). Usa questa opzione per eventi: contatori, timestamp, sensori senza stati fissi.",
    auto_dismiss_section: "Visibilità automatica",
    auto_dismiss_after: "Nascondi automaticamente dopo (secondi)",
    auto_dismiss_after_help: "L'alert scompare automaticamente dopo N secondi. Lascia vuoto per tenerlo sempre visibile.",
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
    op_contains: "⊃ contiene",
    op_not_contains: "⊅ non contiene",
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
    entity_filter_help: "Cerca tutte le entità il cui ID o nome contiene questo testo. Supporta wildcard * (es. sensor.battery_*_level). Clicca sul conteggio per vedere la lista e usare 'Inverti selezione'. Usa {name}, {entity}, {state}, {device} nel messaggio.",
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
    show_filter_state: "Mostra stato",
    secondary_attribute: "Attributo valore secondario",
    show_secondary_name: "Mostra nome entità affianco al valore",
    conditions_section: "Condizioni aggiuntive",
    conditions_logic: "Logica",
    logic_and: "AND — tutte vere",
    logic_or: "OR — almeno una vera",
    add_condition: "Aggiungi condizione",
    condition_entity: "Entità condizione",
    condition_attribute: "Attributo condizione",
    tap_action_section: "Tap — azione al tocco",
    double_tap_action_section: "Doppio tap — azione al doppio tocco",
    hold_action_section: "Hold — azione lunga (500ms)",
    clear_tap_action_section: "Tap sulla card 'tutto ok' — azione al tocco",
    clear_double_tap_action_section: "Doppio tap sulla card 'tutto ok'",
    clear_hold_action_section: "Hold sulla card 'tutto ok' — azione lunga (500ms)",
    snooze_action_section: "Azione snooze 💤 — eseguita al tap sul tasto snooze",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Segnaposto: {name} nome entità, {state} stato, {entity} ID entità, {device} nome dispositivo",
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
    section_overlay: "Overlay Notifica 🔔",
    overlay_mode: "Mostra banner overlay quando scatta un avviso",
    overlay_mode_help: "Mostra un banner fisso in cima allo schermo quando un nuovo avviso si attiva — visibile da qualsiasi vista del dashboard.",
    overlay_position: "Posizione",
    overlay_pos_top: "In alto",
    overlay_pos_bottom: "In basso",
    overlay_pos_center: "Al centro",
    overlay_duration: "Durata (secondi, 0 = solo chiusura manuale)",
    overlay_duration_help: "Secondi prima che il banner scompaia automaticamente. 0 = rimane fino alla chiusura manuale.",
    overlay_how_works: "Il banner appare solo quando la card non è visibile a schermo — su un'altra vista o fuori dalla finestra. Nessun banner ridondante quando l'avviso è già visibile.",
    visible_to_section: "👤 Visibilità utente",
    visible_to_label: "Visibile a",
    visible_to_all: "Tutti (default)",
    visible_to_admin: "Solo amministratori",
    visible_to_non_admin: "Solo utenti normali",
    visible_to_custom: "Utenti specifici...",
    visible_to_help: "Filtra questo avviso per tipo di utente HA. Con 'Utenti specifici' inserisci un nome o una lista separata da virgola.",
    visible_to_users_label: "Nomi utente (separati da virgola)",
    visible_to_loading: "Caricamento utenti...",
    time_range_section: "🕐 Orario di attivazione",
    time_range_from: "Dalle (HH:MM)",
    time_range_to: "Alle (HH:MM)",
    time_range_help: "Mostra l'avviso solo nell'intervallo orario indicato. Supporta la mezzanotte (es. 22:00–06:00). Lascia vuoto per nessun limite.",
  },
  en: {
    tab_general: "General",
    tab_alerts: "Alerts",
    tab_overlay: "Overlay",
    tab_allclear: "All Clear",
    back: "Back",
    all_clear_disabled_help: "Enable 'All Clear' to configure the no-alerts message.",
    tab_layout: "Layout",
    hub_desc_general: "Cycle, snooze & history",
    hub_desc_layout: "Theme, card height & visual appearance",
    hub_desc_overlay: "Global banner across all dashboards",
    hub_desc_alerts: "Manage alert conditions",
    hub_desc_allclear: "Message when no alerts are active",
    hub_report_issue: "Report an issue",
    hub_welcome: "Welcome! Configure your card by selecting a section below.",
    clear_display_mode_label: "Display mode",
    clear_mode_message: "💬 Custom message",
    clear_mode_clock: "🕐 Clock",
    clear_mode_weather: "🌤 Weather",
    clear_mode_weather_clock: "🌤🕐 Weather + Clock",
    clear_weather_entity_label: "Weather entity (weather.*)",
    cycle_interval: "Cycle interval (seconds)",
    cycle_interval_help: "Seconds between alerts when multiple are active",
    section_all_clear: "All clear card",
    section_layout: "Layout & Appearance",
    section_cycling: "Cycling & Animation",
    section_snooze: "Snooze 💤",
    section_history: "History",
    show_when_clear: "Show when no alerts are active",
    large_buttons: "Large always-visible buttons (💤 and 📋)",
    ha_theme: "Adapt to HA theme (compatible with Mushroom and all global themes)",
    swipe_to_snooze: "Swipe left to snooze 💤 (ideal for mobile)",
    vertical: "Vertical layout (icon on top, text below, centered)",
    text_align_center: "Center text (useful for wide Panel layout)",
    card_height: "Fixed card height (px)",
    card_height_help: "Locks the height to prevent layout shifts when alerts change. Leave empty for automatic height.",
    card_border: "Show card border & name",
    card_border_help: "Adds the standard Home Assistant border around the card. When no alerts are active, shows a placeholder with the card name instead of hiding completely.",
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
    clear_badge_label: "Badge label (e.g. 'All Good', leave empty for default)",
    clear_theme: "Theme for 'all clear' state",
    alerts_list: "Configured alerts",
    add_alert: "Add alert",
    alert_entity: "Entity",
    alert_operator: "Condition",
    alert_state: "Value",
    alert_state_help: "e.g. 'on', '80' (numeric with > < >= <=)",
    current_state: "Current state",
    alert_message: "Message to display",
    alert_name: "Name / Label",
    alert_name_placeholder: "e.g. Motion sensors floor 1",
    alert_name_help: "Optional label shown as a prefix to the message (e.g. 'Motion sensors: hallway active'). Useful with entity_filter to distinguish alert groups.",
    alert_message_help: "Use {state} live value, {name} name, {entity} entity ID, {device} device name. Also supports full HA templates: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Priority",
    alert_theme: "Theme",
    alert_icon: "Icon",
    alert_icon_help: "Leave empty to use the theme emoji. Enter a custom emoji. Enable 'Use HA icon' to automatically show the entity's MDI icon from HA (or pick one with the selector).",
    auto_icon_preview: "Auto icon from entity",
    use_ha_icon: "Use Home Assistant icon (mdi:)",
    icon_color: "Icon color",
    icon_color_help: "CSS color: e.g. #ff0000, red, var(--error-color). Leave empty for theme default.",
    on_change: "Trigger on ANY state change (ignores conditions)",
    on_change_help: "Alert fires whenever the entity state changes (any value). Best for events: counters, timestamps, sensors with no fixed states.",
    auto_dismiss_section: "Auto-dismiss",
    auto_dismiss_after: "Auto-hide after (seconds)",
    auto_dismiss_after_help: "Alert auto-hides after N seconds. Leave empty to keep it always visible.",
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
    op_contains: "⊃ contains",
    op_not_contains: "⊅ doesn't contain",
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
    entity_filter_help: "Matches all entities whose ID or name contains this text. Supports wildcard * (e.g. sensor.battery_*_level). Click the count to preview the list and use 'Invert selection'. Use {name}, {entity}, {state}, {device} in the message.",
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
    show_filter_state: "Show state",
    secondary_attribute: "Secondary value attribute",
    show_secondary_name: "Show entity name next to value",
    conditions_section: "Extra conditions",
    conditions_logic: "Logic",
    logic_and: "AND — all must match",
    logic_or: "OR — at least one must match",
    add_condition: "Add condition",
    condition_entity: "Condition entity",
    condition_attribute: "Condition attribute",
    tap_action_section: "Tap action",
    double_tap_action_section: "Double tap action",
    hold_action_section: "Hold action (500ms)",
    clear_tap_action_section: "Tap on 'all clear' card",
    clear_double_tap_action_section: "Double tap on 'all clear' card",
    clear_hold_action_section: "Hold on 'all clear' card (500ms)",
    snooze_action_section: "Snooze action 💤 — executed when the snooze button is tapped",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Placeholders: {name} entity name, {state} state, {entity} entity ID, {device} device name",
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
    section_overlay: "Overlay Notification 🔔",
    overlay_mode: "Show overlay banner when an alert triggers",
    overlay_mode_help: "Displays a fixed banner at the top of the screen when a new alert becomes active — visible from any dashboard view.",
    overlay_position: "Position",
    overlay_pos_top: "Top",
    overlay_pos_bottom: "Bottom",
    overlay_pos_center: "Center",
    overlay_duration: "Duration (seconds, 0 = manual dismiss only)",
    overlay_duration_help: "Seconds before the banner auto-dismisses. Set to 0 to require manual close.",
    overlay_how_works: "The banner appears only when the card is not visible on screen — on a different view or scrolled out of sight. No redundant banner when the alert is already visible.",
    visible_to_section: "👤 User Visibility",
    visible_to_label: "Visible to",
    visible_to_all: "Everyone (default)",
    visible_to_admin: "Admins only",
    visible_to_non_admin: "Non-admins only",
    visible_to_custom: "Specific users...",
    visible_to_help: "Filter this alert by HA user type. With 'Specific users' enter a name or comma-separated list of names.",
    visible_to_users_label: "User names (comma-separated)",
    visible_to_loading: "Loading users...",
    time_range_section: "🕐 Active time range",
    time_range_from: "From (HH:MM)",
    time_range_to: "To (HH:MM)",
    time_range_help: "Show this alert only within the specified time window. Supports midnight crossing (e.g. 22:00–06:00). Leave blank for no restriction.",
  },
  fr: {
    tab_general: "Général",
    tab_alerts: "Alertes",
    tab_overlay: "Overlay",
    tab_allclear: "Tout est OK",
    back: "Retour",
    all_clear_disabled_help: "Activez 'Tout est OK' pour configurer le message d'absence d'alerte.",
    tab_layout: "Mise en page",
    hub_desc_general: "Cycle, répétition et historique",
    hub_desc_layout: "Thème, hauteur de carte et apparence",
    hub_desc_overlay: "Bannière globale sur tous les tableaux de bord",
    hub_desc_alerts: "Gérer les conditions d'alerte",
    hub_desc_allclear: "Message quand aucune alerte n'est active",
    hub_report_issue: "Signaler un problème",
    hub_welcome: "Bienvenue ! Configurez votre carte en sélectionnant une section ci-dessous.",
    clear_display_mode_label: "Mode d'affichage",
    clear_mode_message: "💬 Message personnalisé",
    clear_mode_clock: "🕐 Horloge",
    clear_mode_weather: "🌤 Météo",
    clear_mode_weather_clock: "🌤🕐 Météo + Horloge",
    clear_weather_entity_label: "Entité météo (weather.*)",
    cycle_interval: "Intervalle de cycle (secondes)",
    cycle_interval_help: "Secondes entre les alertes quand plusieurs sont actives",
    section_all_clear: "Carte 'tout va bien'",
    section_layout: "Disposition & Apparence",
    section_cycling: "Cycle & Animation",
    section_snooze: "Snooze 💤",
    section_history: "Historique",
    show_when_clear: "Afficher quand aucune alerte n'est active",
    large_buttons: "Grands boutons toujours visibles (💤 et 📋)",
    ha_theme: "Adapter au thème HA (compatible Mushroom et tous les thèmes globaux)",
    swipe_to_snooze: "Glisser à gauche pour mettre en veille 💤 (idéal mobile)",
    vertical: "Disposition verticale (icône en haut, texte en bas, centré)",
    text_align_center: "Texte centré (utile pour la disposition Panel large)",
    card_height: "Hauteur fixe de la carte (px)",
    card_height_help: "Fixe la hauteur pour éviter les décalages de mise en page lors des changements d'alertes. Laisser vide pour hauteur automatique.",
    card_border: "Afficher la bordure et le nom",
    card_border_help: "Ajoute la bordure standard de Home Assistant autour de la carte. Quand aucune alerte n'est active, affiche un espace réservé avec le nom de la carte au lieu de la masquer complètement.",
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
    clear_badge_label: "Étiquette badge (ex. 'Tout va bien', laisser vide par défaut)",
    clear_theme: "Thème pour l'état 'tout va bien'",
    alerts_list: "Liste des alertes configurées",
    add_alert: "Ajouter une alerte",
    alert_entity: "Entité",
    alert_operator: "Condition",
    alert_state: "Valeur",
    alert_state_help: "ex. 'on', '80' (numérique avec > < >= <=)",
    current_state: "État actuel",
    alert_message: "Message à afficher",
    alert_name: "Nom / Étiquette",
    alert_name_placeholder: "ex. Capteurs de mouvement étage",
    alert_name_help: "Étiquette optionnelle affichée comme préfixe du message (ex. 'Capteurs mouvement: couloir actif'). Utile avec entity_filter pour distinguer des groupes d'alertes.",
    alert_message_help: "Utilisez {state} valeur live, {name} nom, {entity} ID entité, {device} nom appareil. Supporte aussi les templates HA complets : {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Priorité",
    alert_theme: "Thème",
    alert_icon: "Icône",
    alert_icon_help: "Laisser vide pour utiliser l'emoji du thème. Saisir un emoji personnalisé. Activer 'Utiliser icône HA' pour afficher automatiquement l'icône MDI de l'entité (ou en choisir une).",
    auto_icon_preview: "Icône automatique depuis l'entité",
    use_ha_icon: "Utiliser une icône Home Assistant (mdi:)",
    icon_color: "Couleur de l'icône",
    icon_color_help: "Couleur CSS: ex. #ff0000, red, var(--error-color). Laisser vide pour la couleur du thème.",
    on_change: "Déclencher à TOUT changement d'état (ignore les conditions)",
    on_change_help: "L'alerte s'affiche à chaque changement d'état (quelle que soit la valeur). Idéal pour les événements : compteurs, horodatages, capteurs sans états fixes.",
    auto_dismiss_section: "Masquage automatique",
    auto_dismiss_after: "Masquer automatiquement après (secondes)",
    auto_dismiss_after_help: "L'alerte disparaît automatiquement après N secondes. Laisser vide pour la garder toujours visible.",
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
    op_contains: "⊃ contient",
    op_not_contains: "⊅ ne contient pas",
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
    entity_filter_help: "Correspond à toutes les entités dont l'ID ou le nom contient ce texte. Supporte le wildcard * (ex. sensor.battery_*_level). Cliquez sur le compteur pour prévisualiser et utiliser 'Inverser la sélection'. Utilisez {name}, {entity}, {state}, {device} dans le message.",
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
    show_filter_state: "Afficher l'état",
    secondary_attribute: "Attribut valeur secondaire",
    show_secondary_name: "Afficher le nom de l'entité à côté de la valeur",
    conditions_section: "Conditions supplémentaires",
    conditions_logic: "Logique",
    logic_and: "AND — toutes vraies",
    logic_or: "OR — au moins une vraie",
    add_condition: "Ajouter une condition",
    condition_entity: "Entité condition",
    condition_attribute: "Attribut condition",
    tap_action_section: "Action au tap",
    double_tap_action_section: "Action double tap",
    hold_action_section: "Action maintien (500ms)",
    clear_tap_action_section: "Tap sur la carte 'tout va bien'",
    clear_double_tap_action_section: "Double tap sur la carte 'tout va bien'",
    clear_hold_action_section: "Maintien sur la carte 'tout va bien' (500ms)",
    snooze_action_section: "Action snooze 💤 — exécutée au tap sur le bouton snooze",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Variables : {name} nom entité, {state} état, {entity} ID entité, {device} nom appareil",
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
    section_overlay: "Notification Overlay 🔔",
    overlay_mode: "Afficher un banner overlay lorsqu'une alerte se déclenche",
    overlay_mode_help: "Affiche un banner fixe en haut de l'écran lorsqu'une nouvelle alerte devient active — visible depuis n'importe quelle vue du tableau de bord.",
    overlay_position: "Position",
    overlay_pos_top: "En haut",
    overlay_pos_bottom: "En bas",
    overlay_pos_center: "Au centre",
    overlay_duration: "Durée (secondes, 0 = fermeture manuelle)",
    overlay_duration_help: "Secondes avant la disparition automatique du banner. 0 = reste jusqu'à la fermeture manuelle.",
    overlay_how_works: "Le banner apparaît uniquement quand la carte n'est pas visible à l'écran — sur une autre vue ou hors de la fenêtre. Pas de banner redondant quand l'alerte est déjà visible.",
    visible_to_section: "👤 Visibilité utilisateur",
    visible_to_label: "Visible pour",
    visible_to_all: "Tout le monde (défaut)",
    visible_to_admin: "Administrateurs uniquement",
    visible_to_non_admin: "Utilisateurs non-admin",
    visible_to_custom: "Utilisateurs spécifiques...",
    visible_to_help: "Filtre cette alerte par type d'utilisateur HA. Avec 'Utilisateurs spécifiques', entrez un nom ou une liste séparée par des virgules.",
    visible_to_users_label: "Noms d'utilisateurs (séparés par virgule)",
    visible_to_loading: "Chargement des utilisateurs...",
    time_range_section: "🕐 Plage horaire d'activation",
    time_range_from: "De (HH:MM)",
    time_range_to: "À (HH:MM)",
    time_range_help: "Affiche cette alerte uniquement dans la plage horaire indiquée. Gère le passage minuit (ex. 22:00–06:00). Laisser vide pour aucune restriction.",
  },
  de: {
    tab_general: "Allgemein",
    tab_alerts: "Warnungen",
    tab_overlay: "Overlay",
    tab_allclear: "Alles OK",
    back: "Zurück",
    all_clear_disabled_help: "Aktiviere 'Alles OK', um die Meldung bei keinen Warnungen zu konfigurieren.",
    tab_layout: "Layout",
    hub_desc_general: "Zyklus, Schlummern und Verlauf",
    hub_desc_layout: "Thema, Kartenhöhe und visuelles Aussehen",
    hub_desc_overlay: "Globales Banner auf allen Dashboards",
    hub_desc_alerts: "Warnbedingungen verwalten",
    hub_desc_allclear: "Nachricht wenn keine Warnungen aktiv sind",
    hub_report_issue: "Problem melden",
    hub_welcome: "Willkommen! Konfiguriere deine Karte, indem du einen Bereich auswählst.",
    clear_display_mode_label: "Anzeigemodus",
    clear_mode_message: "💬 Benutzerdefinierte Nachricht",
    clear_mode_clock: "🕐 Uhr",
    clear_mode_weather: "🌤 Wetter",
    clear_mode_weather_clock: "🌤🕐 Wetter + Uhr",
    clear_weather_entity_label: "Wetter-Entität (weather.*)",
    cycle_interval: "Zyklusintervall (Sekunden)",
    cycle_interval_help: "Sekunden zwischen Warnungen wenn mehrere aktiv sind",
    section_all_clear: "Karte 'Alles in Ordnung'",
    section_layout: "Layout & Aussehen",
    section_cycling: "Zyklus & Animation",
    section_snooze: "Schlummern 💤",
    section_history: "Verlauf",
    show_when_clear: "Anzeigen wenn keine Warnung aktiv",
    large_buttons: "Große, immer sichtbare Schaltflächen (💤 und 📋)",
    ha_theme: "An HA-Theme anpassen (kompatibel mit Mushroom und allen globalen Themes)",
    swipe_to_snooze: "Nach links wischen zum Schlummern 💤 (ideal für Mobilgeräte)",
    vertical: "Vertikales Layout (Symbol oben, Text unten, zentriert)",
    text_align_center: "Text zentrieren (nützlich für breites Panel-Layout)",
    card_height: "Feste Kartenhöhe (px)",
    card_height_help: "Sperrt die Höhe, um Layoutverschiebungen beim Wechsel von Alerts zu verhindern. Leer lassen für automatische Höhe.",
    card_border: "Rahmen und Namen anzeigen",
    card_border_help: "Fügt den Standard-Home-Assistant-Rahmen um die Karte hinzu. Wenn keine Alerts aktiv sind, wird ein Platzhalter mit dem Kartennamen angezeigt, anstatt die Karte vollständig auszublenden.",
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
    clear_badge_label: "Badge-Beschriftung (z.B. 'Alles OK', leer für Standard)",
    clear_theme: "Thema für 'Alles in Ordnung'",
    alerts_list: "Konfigurierte Warnungen",
    add_alert: "Warnung hinzufügen",
    alert_entity: "Entität",
    alert_operator: "Bedingung",
    alert_state: "Wert",
    alert_state_help: "z.B. 'on', '80' (numerisch mit > < >= <=)",
    current_state: "Aktueller Zustand",
    alert_message: "Anzuzeigende Nachricht",
    alert_name: "Name / Bezeichnung",
    alert_name_placeholder: "z.B. Bewegungssensoren EG",
    alert_name_help: "Optionale Bezeichnung als Präfix der Nachricht (z.B. 'Bewegungssensoren: Flur aktiv'). Nützlich mit entity_filter zur Unterscheidung von Warngruppen.",
    alert_message_help: "Verwende {state} Live-Wert, {name} Name, {entity} Entitäts-ID, {device} Gerätename. Unterstützt auch vollständige HA-Templates: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Priorität",
    alert_theme: "Thema",
    alert_icon: "Symbol",
    alert_icon_help: "Leer lassen für Theme-Emoji. Eigenes Emoji eingeben. 'HA-Symbol verwenden' aktivieren, um automatisch das MDI-Symbol der Entität anzuzeigen (oder eines auswählen).",
    auto_icon_preview: "Automatisches Symbol von Entität",
    use_ha_icon: "Home Assistant Symbol verwenden (mdi:)",
    icon_color: "Symbolfarbe",
    icon_color_help: "CSS-Farbe: z.B. #ff0000, red, var(--error-color). Leer lassen für Themafarbe.",
    on_change: "Bei JEDER Statusänderung auslösen (ignoriert Bedingungen)",
    on_change_help: "Warnung erscheint bei jeder Statusänderung (beliebiger Wert). Ideal für Ereignisse: Zähler, Zeitstempel, Sensoren ohne feste Zustände.",
    auto_dismiss_section: "Automatisches Ausblenden",
    auto_dismiss_after: "Automatisch ausblenden nach (Sekunden)",
    auto_dismiss_after_help: "Warnung wird automatisch nach N Sekunden ausgeblendet. Leer lassen, um sie immer anzuzeigen.",
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
    op_contains: "⊃ enthält",
    op_not_contains: "⊅ enthält nicht",
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
    entity_filter_help: "Findet alle Entitäten, deren ID oder Name diesen Text enthält. Unterstützt Wildcard * (z.B. sensor.battery_*_level). Klicke auf die Anzahl für die Vorschau und 'Auswahl umkehren'. Verwende {name}, {entity}, {state}, {device} in der Nachricht.",
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
    show_filter_state: "Zustand anzeigen",
    secondary_attribute: "Sekundärwert-Attribut",
    show_secondary_name: "Entity-Name neben dem Wert anzeigen",
    conditions_section: "Zusätzliche Bedingungen",
    conditions_logic: "Logik",
    logic_and: "AND — alle erfüllt",
    logic_or: "OR — mindestens eine erfüllt",
    add_condition: "Bedingung hinzufügen",
    condition_entity: "Bedingungs-Entität",
    condition_attribute: "Bedingungs-Attribut",
    tap_action_section: "Tap-Aktion",
    double_tap_action_section: "Doppeltipp-Aktion",
    hold_action_section: "Halten-Aktion (500ms)",
    clear_tap_action_section: "Tap auf 'Alles in Ordnung'-Karte",
    clear_double_tap_action_section: "Doppeltipp auf 'Alles in Ordnung'-Karte",
    clear_hold_action_section: "Halten auf 'Alles in Ordnung'-Karte (500ms)",
    snooze_action_section: "Schlummern-Aktion 💤 — wird beim Tap auf den Schlummern-Button ausgeführt",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Platzhalter: {name} Entitätsname, {state} Zustand, {entity} Entitäts-ID, {device} Gerätename",
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
    section_overlay: "Overlay-Benachrichtigung 🔔",
    overlay_mode: "Overlay-Banner anzeigen wenn ein Alert ausgelöst wird",
    overlay_mode_help: "Zeigt ein fixiertes Banner oben auf dem Bildschirm an, wenn ein neuer Alert aktiv wird — sichtbar aus jeder Dashboard-Ansicht.",
    overlay_position: "Position",
    overlay_pos_top: "Oben",
    overlay_pos_bottom: "Unten",
    overlay_pos_center: "Mitte",
    overlay_duration: "Dauer (Sekunden, 0 = manuelles Schließen)",
    overlay_duration_help: "Sekunden bis das Banner automatisch verschwindet. 0 = bleibt bis zum manuellen Schließen.",
    overlay_how_works: "Das Banner erscheint nur, wenn die Karte nicht auf dem Bildschirm sichtbar ist — in einer anderen Ansicht oder außerhalb des Sichtbereichs. Kein redundantes Banner, wenn der Alert bereits sichtbar ist.",
    visible_to_section: "👤 Benutzersichtbarkeit",
    visible_to_label: "Sichtbar für",
    visible_to_all: "Alle (Standard)",
    visible_to_admin: "Nur Administratoren",
    visible_to_non_admin: "Nur Nicht-Admins",
    visible_to_custom: "Bestimmte Benutzer...",
    visible_to_help: "Filtert diese Benachrichtigung nach HA-Benutzertyp. Mit 'Bestimmte Benutzer' einen Namen oder kommagetrennte Liste eingeben.",
    visible_to_users_label: "Benutzernamen (kommagetrennt)",
    visible_to_loading: "Benutzer werden geladen...",
    time_range_section: "🕐 Aktivierungszeitbereich",
    time_range_from: "Von (HH:MM)",
    time_range_to: "Bis (HH:MM)",
    time_range_help: "Zeigt diese Benachrichtigung nur im angegebenen Zeitfenster. Unterstützt Mitternachtsübergang (z.B. 22:00–06:00). Leer lassen für keine Einschränkung.",
  },
  nl: {
    tab_general: "Algemeen",
    tab_alerts: "Meldingen",
    tab_overlay: "Overlay",
    tab_allclear: "Alles Oké",
    back: "Terug",
    all_clear_disabled_help: "Schakel 'Alles Oké' in om de melding bij geen actieve alarmen in te stellen.",
    tab_layout: "Lay-out",
    hub_desc_general: "Cyclus, sluimer en geschiedenis",
    hub_desc_layout: "Thema, kaardhoogte en visueel uiterlijk",
    hub_desc_overlay: "Globale banner op alle dashboards",
    hub_desc_alerts: "Beheer meldingsvoorwaarden",
    hub_desc_allclear: "Bericht wanneer er geen meldingen actief zijn",
    hub_report_issue: "Probleem melden",
    hub_welcome: "Welkom! Configureer je kaart door een sectie hieronder te selecteren.",
    clear_display_mode_label: "Weergavemodus",
    clear_mode_message: "💬 Aangepast bericht",
    clear_mode_clock: "🕐 Klok",
    clear_mode_weather: "🌤 Weer",
    clear_mode_weather_clock: "🌤🕐 Weer + Klok",
    clear_weather_entity_label: "Weerentiteit (weather.*)",
    cycle_interval: "Cyclusinterval (seconden)",
    cycle_interval_help: "Seconden tussen meldingen wanneer meerdere actief zijn",
    section_all_clear: "Kaart 'alles in orde'",
    section_layout: "Lay-out & Uiterlijk",
    section_cycling: "Cyclus & Animatie",
    section_snooze: "Sluimer 💤",
    section_history: "Geschiedenis",
    show_when_clear: "Tonen wanneer geen meldingen actief zijn",
    large_buttons: "Grote, altijd zichtbare knoppen (💤 en 📋)",
    ha_theme: "Aanpassen aan HA-thema (compatibel met Mushroom en alle globale thema's)",
    swipe_to_snooze: "Veeg naar links om te sluimeren 💤 (ideaal voor mobiel)",
    vertical: "Verticale lay-out (icoon boven, tekst onder, gecentreerd)",
    text_align_center: "Tekst centreren (handig voor breed Panel-layout)",
    card_height: "Vaste kaarthoogte (px)",
    card_height_help: "Vergrendelt de hoogte om lay-outverschuivingen bij wisselende meldingen te voorkomen. Leeg laten voor automatische hoogte.",
    card_border: "Toon rand en naam",
    card_border_help: "Voegt de standaard Home Assistant rand toe rond de kaart. Wanneer er geen meldingen actief zijn, wordt een tijdelijke aanduiding met de kaartnaam weergegeven in plaats van de kaart volledig te verbergen.",
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
    clear_badge_label: "Badge-label (bijv. 'Alles OK', leeg voor standaard)",
    clear_theme: "Thema voor 'alles in orde'",
    alerts_list: "Geconfigureerde meldingen",
    add_alert: "Melding toevoegen",
    alert_entity: "Entiteit",
    alert_operator: "Conditie",
    alert_state: "Waarde",
    alert_state_help: "bijv. 'on', '80' (numeriek met > < >= <=)",
    current_state: "Huidige toestand",
    alert_message: "Te tonen bericht",
    alert_name: "Naam / Label",
    alert_name_placeholder: "bijv. Bewegingssensoren verdieping",
    alert_name_help: "Optioneel label als prefix van het bericht (bijv. 'Bewegingssensoren: gang actief'). Handig met entity_filter om alertgroepen te onderscheiden.",
    alert_message_help: "Gebruik {state} live waarde, {name} naam, {entity} entiteits-ID, {device} apparaatnaam. Ondersteunt ook volledige HA-templates: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Prioriteit",
    alert_theme: "Thema",
    alert_icon: "Pictogram",
    alert_icon_help: "Leeg laten voor thema-emoji. Eigen emoji invoeren. 'HA-pictogram gebruiken' inschakelen om automatisch het MDI-pictogram van de entiteit te tonen (of er een kiezen).",
    auto_icon_preview: "Automatisch pictogram van entiteit",
    use_ha_icon: "Home Assistant pictogram gebruiken (mdi:)",
    icon_color: "Pictogramkleur",
    icon_color_help: "CSS-kleur: bijv. #ff0000, red, var(--error-color). Leeg laten voor themakleur.",
    on_change: "Activeren bij ELKE statuswijziging (negeert voorwaarden)",
    on_change_help: "Melding verschijnt bij elke statuswijziging (willekeurige waarde). Ideaal voor gebeurtenissen: tellers, tijdstempels, sensoren zonder vaste toestanden.",
    auto_dismiss_section: "Automatisch verbergen",
    auto_dismiss_after: "Automatisch verbergen na (seconden)",
    auto_dismiss_after_help: "Melding verdwijnt automatisch na N seconden. Leeg laten om altijd zichtbaar te blijven.",
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
    op_contains: "⊃ bevat",
    op_not_contains: "⊅ bevat niet",
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
    entity_filter_help: "Vindt alle entiteiten waarvan het ID of de naam deze tekst bevat. Ondersteunt wildcard * (bijv. sensor.battery_*_level). Klik op het aantal voor de voorvertoning en 'Selectie omdraaien'. Gebruik {name}, {entity}, {state}, {device} in het bericht.",
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
    show_filter_state: "Status weergeven",
    secondary_attribute: "Secundaire waarde-attribuut",
    show_secondary_name: "Entiteitsnaam naast waarde weergeven",
    conditions_section: "Extra voorwaarden",
    conditions_logic: "Logica",
    logic_and: "AND — alle moeten kloppen",
    logic_or: "OR — minimaal één moet kloppen",
    add_condition: "Voorwaarde toevoegen",
    condition_entity: "Voorwaarde-entiteit",
    condition_attribute: "Voorwaarde-attribuut",
    tap_action_section: "Tik-actie",
    double_tap_action_section: "Dubbel tik-actie",
    hold_action_section: "Houd-actie (500ms)",
    clear_tap_action_section: "Tikken op 'alles in orde'-kaart",
    clear_double_tap_action_section: "Dubbel tikken op 'alles in orde'-kaart",
    clear_hold_action_section: "Vasthouden op 'alles in orde'-kaart (500ms)",
    snooze_action_section: "Sluimer-actie 💤 — uitgevoerd bij tik op de sluimer-knop",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Plaatshouders: {name} entiteitsnaam, {state} toestand, {entity} entiteits-ID, {device} apparaatnaam",
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
    section_overlay: "Overlay-melding 🔔",
    overlay_mode: "Toon overlay-banner wanneer een melding activeert",
    overlay_mode_help: "Toont een vast banner bovenaan het scherm wanneer een nieuwe melding actief wordt — zichtbaar vanuit elke dashboardweergave.",
    overlay_position: "Positie",
    overlay_pos_top: "Bovenaan",
    overlay_pos_bottom: "Onderaan",
    overlay_pos_center: "Midden",
    overlay_duration: "Duur (seconden, 0 = handmatig sluiten)",
    overlay_duration_help: "Seconden voordat het banner automatisch verdwijnt. 0 = blijft tot handmatig sluiten.",
    overlay_how_works: "Het banner verschijnt alleen wanneer de kaart niet zichtbaar is op het scherm — op een andere weergave of buiten het zichtbare gebied. Geen redundant banner als de melding al zichtbaar is.",
    visible_to_section: "👤 Gebruikerszichtbaarheid",
    visible_to_label: "Zichtbaar voor",
    visible_to_all: "Iedereen (standaard)",
    visible_to_admin: "Alleen beheerders",
    visible_to_non_admin: "Alleen niet-beheerders",
    visible_to_custom: "Specifieke gebruikers...",
    visible_to_help: "Filtert deze melding op HA-gebruikerstype. Met 'Specifieke gebruikers' voer een naam of kommagescheiden lijst in.",
    visible_to_users_label: "Gebruikersnamen (kommagescheiden)",
    visible_to_loading: "Gebruikers laden...",
    time_range_section: "🕐 Actief tijdvenster",
    time_range_from: "Van (HH:MM)",
    time_range_to: "Tot (HH:MM)",
    time_range_help: "Toon deze melding alleen binnen het opgegeven tijdvenster. Ondersteunt middernachtovergang (bv. 22:00–06:00). Leeg laten voor geen beperking.",
  },
  vi: {
    tab_general: "Chung",
    tab_alerts: "Báo động",
    tab_overlay: "Overlay",
    tab_allclear: "Tất cả ổn",
    back: "Quay lại",
    all_clear_disabled_help: "Bật 'Tất cả ổn' để cấu hình thông báo khi không có báo động.",
    tab_layout: "Bố cục",
    hub_desc_general: "Chu kỳ, báo lại và lịch sử",
    hub_desc_layout: "Chủ đề, chiều cao thẻ và giao diện",
    hub_desc_overlay: "Banner toàn cục trên tất cả dashboard",
    hub_desc_alerts: "Quản lý điều kiện báo động",
    hub_desc_allclear: "Thông báo khi không có báo động nào",
    hub_report_issue: "Báo cáo sự cố",
    hub_welcome: "Chào mừng! Cấu hình thẻ của bạn bằng cách chọn một mục bên dưới.",
    clear_display_mode_label: "Chế độ hiển thị",
    clear_mode_message: "💬 Tin nhắn tùy chỉnh",
    clear_mode_clock: "🕐 Đồng hồ",
    clear_mode_weather: "🌤 Thời tiết",
    clear_mode_weather_clock: "🌤🕐 Thời tiết + Đồng hồ",
    clear_weather_entity_label: "Thực thể thời tiết (weather.*)",
    cycle_interval: "Chu kỳ chuyển đổi (giây)",
    cycle_interval_help: "Số giây giữa các báo động khi có nhiều báo động đang hoạt động",
    section_all_clear: "Thẻ 'mọi thứ ổn'",
    section_layout: "Bố cục & Giao diện",
    section_cycling: "Chu kỳ & Hoạt ảnh",
    section_snooze: "Tạm hoãn 💤",
    section_history: "Lịch sử",
    show_when_clear: "Hiển thị khi không có báo động",
    large_buttons: "Nút lớn luôn hiển thị (💤 và 📋)",
    ha_theme: "Thích ứng với chủ đề HA (tương thích Mushroom và tất cả chủ đề toàn cục)",
    swipe_to_snooze: "Vuốt sang trái để tạm hoãn 💤 (lý tưởng cho di động)",
    vertical: "Bố cục dọc (biểu tượng trên, văn bản dưới, căn giữa)",
    text_align_center: "Căn giữa văn bản (hữu ích cho layout Panel rộng)",
    card_height: "Chiều cao cố định (px)",
    card_height_help: "Khóa chiều cao để ngăn dịch chuyển bố cục khi cảnh báo thay đổi. Để trống để chiều cao tự động.",
    card_border: "Hiển thị viền và tên card",
    card_border_help: "Thêm viền chuẩn Home Assistant xung quanh card. Khi không có cảnh báo nào hoạt động, hiển thị placeholder với tên card thay vì ẩn hoàn toàn.",
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
    clear_badge_label: "Nhãn badge (ví dụ: 'Ổn rồi', để trống để dùng mặc định)",
    clear_theme: "Giao diện trạng thái 'mọi thứ ổn'",
    alerts_list: "Danh sách báo động đã cài đặt",
    add_alert: "Thêm báo động",
    alert_entity: "Thực thể (Entity)",
    alert_operator: "Điều kiện",
    alert_state: "Giá trị",
    alert_state_help: "vd. 'on', '80' (số với > < >= <=)",
    current_state: "Trạng thái hiện tại",
    alert_message: "Thông báo hiển thị",
    alert_name: "Tên / Nhãn",
    alert_name_placeholder: "vd. Cảm biến chuyển động tầng 1",
    alert_name_help: "Nhãn tùy chọn hiển thị làm tiền tố thông báo (vd. 'Cảm biến chuyển động: hành lang hoạt động'). Hữu ích với entity_filter để phân biệt nhóm cảnh báo.",
    alert_message_help: "Dùng {state} giá trị live, {name} tên, {entity} ID thực thể, {device} tên thiết bị. Cũng hỗ trợ template HA đầy đủ: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Mức ưu tiên",
    alert_theme: "Giao diện",
    alert_icon: "Biểu tượng",
    alert_icon_help: "Để trống để dùng emoji chủ đề. Nhập emoji tùy chỉnh. Bật 'Dùng biểu tượng HA' để tự động hiển thị biểu tượng MDI của thực thể (hoặc chọn một biểu tượng).",
    auto_icon_preview: "Biểu tượng tự động từ thực thể",
    use_ha_icon: "Dùng biểu tượng Home Assistant (mdi:)",
    icon_color: "Màu biểu tượng",
    icon_color_help: "Màu CSS: ví dụ #ff0000, red, var(--error-color). Để trống để dùng màu theme.",
    on_change: "Kích hoạt khi BẤT KỲ thay đổi trạng thái (bỏ qua điều kiện)",
    on_change_help: "Báo động hiện khi trạng thái thay đổi (bất kỳ giá trị). Phù hợp cho sự kiện: bộ đếm, dấu thời gian, cảm biến không có trạng thái cố định.",
    auto_dismiss_section: "Tự ẩn",
    auto_dismiss_after: "Tự ẩn sau (giây)",
    auto_dismiss_after_help: "Báo động tự ẩn sau N giây. Để trống để giữ luôn hiển thị.",
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
    op_contains: "⊃ chứa",
    op_not_contains: "⊅ không chứa",
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
    entity_filter_help: "Tìm tất cả thực thể có ID hoặc tên chứa văn bản này. Hỗ trợ wildcard * (vd. sensor.battery_*_level). Nhấn số kết quả để xem danh sách và dùng 'Đảo ngược lựa chọn'. Dùng {name}, {entity}, {state}, {device} trong thông báo.",
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
    show_filter_state: "Hiển thị trạng thái",
    secondary_attribute: "Thuộc tính giá trị phụ",
    show_secondary_name: "Hiển thị tên thực thể bên cạnh giá trị",
    conditions_section: "Điều kiện bổ sung",
    conditions_logic: "Logic",
    logic_and: "AND — tất cả phải khớp",
    logic_or: "OR — ít nhất một khớp",
    add_condition: "Thêm điều kiện",
    condition_entity: "Thực thể điều kiện",
    condition_attribute: "Thuộc tính điều kiện",
    tap_action_section: "Hành động nhấn",
    double_tap_action_section: "Hành động nhấn đôi",
    hold_action_section: "Hành động giữ (500ms)",
    clear_tap_action_section: "Nhấn vào thẻ 'mọi thứ ổn'",
    clear_double_tap_action_section: "Nhấn đôi vào thẻ 'mọi thứ ổn'",
    clear_hold_action_section: "Giữ thẻ 'mọi thứ ổn' (500ms)",
    snooze_action_section: "Hành động tạm hoãn 💤 — thực hiện khi nhấn nút tạm hoãn",
    timer_theme_category: "Hẹn giờ",
    message_placeholder_hint: "Biến: {name} tên thực thể, {state} trạng thái, {entity} ID thực thể, {device} tên thiết bị",
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
    section_overlay: "Thông báo Overlay 🔔",
    overlay_mode: "Hiển thị banner overlay khi có báo động mới",
    overlay_mode_help: "Hiển thị banner cố định ở đầu màn hình khi một báo động mới kích hoạt — hiển thị từ bất kỳ chế độ xem nào của dashboard.",
    overlay_position: "Vị trí",
    overlay_pos_top: "Trên cùng",
    overlay_pos_bottom: "Dưới cùng",
    overlay_pos_center: "Giữa màn hình",
    overlay_duration: "Thời lượng (giây, 0 = chỉ đóng thủ công)",
    overlay_duration_help: "Số giây trước khi banner tự động đóng. 0 = giữ đến khi đóng thủ công.",
    overlay_how_works: "Banner chỉ xuất hiện khi thẻ không hiển thị trên màn hình — trên chế độ xem khác hoặc ngoài vùng hiển thị. Không hiển thị banner dư thừa khi cảnh báo đã hiển thị.",
    visible_to_section: "👤 Hiển thị theo người dùng",
    visible_to_label: "Hiển thị cho",
    visible_to_all: "Tất cả (mặc định)",
    visible_to_admin: "Chỉ quản trị viên",
    visible_to_non_admin: "Chỉ người dùng thường",
    visible_to_custom: "Người dùng cụ thể...",
    visible_to_help: "Lọc cảnh báo này theo loại người dùng HA. Với 'Người dùng cụ thể', nhập tên hoặc danh sách cách nhau bằng dấu phẩy.",
    visible_to_users_label: "Tên người dùng (cách nhau bằng dấu phẩy)",
    visible_to_loading: "Đang tải người dùng...",
    time_range_section: "🕐 Khung giờ kích hoạt",
    time_range_from: "Từ (HH:MM)",
    time_range_to: "Đến (HH:MM)",
    time_range_help: "Chỉ hiển thị cảnh báo này trong khung giờ được chỉ định. Hỗ trợ vượt nửa đêm (vd. 22:00–06:00). Để trống để không giới hạn.",
  },
  ru: {
    tab_general: "Основное",
    tab_alerts: "Оповещения",
    tab_overlay: "Оверлей",
    tab_allclear: "Всё в порядке",
    back: "Назад",
    all_clear_disabled_help: "Включите «Всё в порядке», чтобы настроить сообщение при отсутствии оповещений.",
    tab_layout: "Макет",
    hub_desc_general: "Цикл, отложить и история",
    hub_desc_layout: "Тема, высота карточки и внешний вид",
    hub_desc_overlay: "Глобальный баннер на всех панелях",
    hub_desc_alerts: "Управление условиями оповещений",
    hub_desc_allclear: "Сообщение при отсутствии оповещений",
    hub_report_issue: "Сообщить о проблеме",
    hub_welcome: "Добро пожаловать! Настройте карточку, выбрав раздел ниже.",
    clear_display_mode_label: "Режим отображения",
    clear_mode_message: "💬 Пользовательское сообщение",
    clear_mode_clock: "🕐 Часы",
    clear_mode_weather: "🌤 Погода",
    clear_mode_weather_clock: "🌤🕐 Погода + Часы",
    clear_weather_entity_label: "Объект погоды (weather.*)",
    cycle_interval: "Интервал цикла (секунды)",
    cycle_interval_help: "Секунды между оповещениями при наличии нескольких активных",
    section_all_clear: "Карточка 'всё в порядке'",
    section_layout: "Макет и внешний вид",
    section_cycling: "Цикл и анимация",
    section_snooze: "Отложить 💤",
    section_history: "История",
    show_when_clear: "Показывать при отсутствии оповещений",
    large_buttons: "Большие всегда видимые кнопки (💤 и 📋)",
    ha_theme: "Адаптация к теме HA (совместимо с Mushroom и всеми глобальными темами)",
    swipe_to_snooze: "Смахнуть влево для отложения 💤 (идеально для мобильных)",
    vertical: "Вертикальный макет (иконка сверху, текст снизу, по центру)",
    text_align_center: "Текст по центру (полезно для широких макетов Panel)",
    card_height: "Фиксированная высота карточки (px)",
    card_height_help: "Фиксирует высоту для предотвращения смещений при смене оповещений. Оставьте пустым для автоматической высоты.",
    card_border: "Показывать рамку и название",
    card_border_help: "Добавляет стандартную рамку Home Assistant вокруг карточки. Когда нет активных оповещений, отображается заполнитель с названием карточки вместо полного скрытия.",
    show_snooze_bar: "Показывать полосу восстановления отложенных 💤",
    snooze_default_duration: "Поведение при откладывании 💤",
    snooze_default_duration_help: "Меню длительности: нажатие 💤 открывает меню выбора времени. Фиксированная длительность: нажатие 💤 откладывает сразу без меню.",
    snooze_option_menu: "Показать меню длительности (как раньше)",
    snooze_duration: "Длительность откладывания для этого оповещения 💤",
    snooze_duration_help: "Переопределяет глобальную настройку. Пусто = использовать глобальную.",
    snooze_duration_menu: "Меню длительности",
    snooze_duration_global: "Использовать глобальную настройку",
    sound_enabled: "Звуковое уведомление при появлении оповещения",
    sound_enabled_help: "Воспроизводит автоматически сгенерированный тон при активации оповещения. Звук зависит от категории (Критично = два высоких сигнала, Внимание = средний сигнал, Инфо = мягкий сигнал, OK = мелодия). Требует разрешения автовоспроизведения в браузере.",
    sound_url: "Пользовательский URL аудио (глобальный)",
    sound_url_help: "URL файла .mp3 или .wav вместо встроенного звука. Оставьте пустым для автоматического звука.",
    alert_sound: "Звук включён для этого оповещения",
    alert_sound_url: "Пользовательский URL аудио для этого оповещения",
    alert_sound_url_help: "Переопределяет глобальный URL. Оставьте пустым для использования глобального.",
    test_mode: "Режим тестирования",
    test_mode_desc: "Показывает все оповещения как активные, игнорируя условия. Анимация прокрутки остановлена — откройте оповещение в редакторе, чтобы сразу увидеть его на карточке.",
    test_mode_warning: "Не забудьте отключить режим тестирования перед сохранением!",
    history_max_events: "История — максимальное количество событий",
    history_max_events_help: "Автоматически записывает каждое сработавшее оповещение. Нажмите 📋 на карточке для просмотра истории с датой/временем. Данные сохраняются в браузере.",
    history: "История",
    history_clear: "Очистить",
    history_empty: "Событий пока нет",
    clear_message: "Сообщение при отсутствии оповещений",
    clear_badge_label: "Метка бейджа (например 'Всё OK', оставьте пустым для значения по умолчанию)",
    clear_theme: "Тема состояния 'всё в порядке'",
    alerts_list: "Список настроенных оповещений",
    add_alert: "Добавить оповещение",
    alert_entity: "Объект",
    alert_operator: "Условие",
    alert_state: "Значение",
    alert_state_help: "например 'on', '80' (числовое с > < >= <=)",
    current_state: "Текущее состояние",
    alert_message: "Отображаемое сообщение",
    alert_name: "Имя / Метка",
    alert_name_placeholder: "напр. Датчики движения 1 этаж",
    alert_name_help: "Необязательная метка, отображаемая как префикс сообщения (напр. 'Датчики движения: коридор активен'). Полезно с entity_filter для различения групп оповещений.",
    alert_message_help: "Используйте {state} для текущего значения, {name} для имени, {entity} для ID объекта, {device} для имени устройства. Поддерживаются шаблоны HA: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Приоритет",
    alert_theme: "Тема",
    alert_icon: "Иконка",
    alert_icon_help: "Оставьте пустым для эмодзи темы. Введите собственный эмодзи. Включите «Использовать иконку HA» для автоматического отображения MDI-иконки сущности (или выберите вручную).",
    auto_icon_preview: "Автоматическая иконка из сущности",
    use_ha_icon: "Использовать иконку Home Assistant (mdi:)",
    icon_color: "Цвет иконки",
    icon_color_help: "CSS цвет: например #ff0000, red, var(--error-color). Оставьте пустым для цвета темы.",
    on_change: "Активировать при ЛЮБОМ изменении состояния (игнорировать условие)",
    on_change_help: "Оповещение появляется при изменении состояния (любое значение). Подходит для событий: счётчики, временные метки, датчики без фиксированного состояния.",
    auto_dismiss_section: "Автоскрытие",
    auto_dismiss_after: "Скрыть через (секунды)",
    auto_dismiss_after_help: "Оповещение автоматически скрывается через N секунд. Оставьте пустым для постоянного отображения.",
    show_badge: "Показывать бейдж",
    badge_label: "Пользовательская метка бейджа",
    badge_label_help: "Оставьте пустым для метки по умолчанию для данной темы",
    delete: "Удалить",
    priority_1: "1 — Критично (красный)",
    priority_2: "2 — Внимание (оранжевый)",
    priority_3: "3 — Информация (синий)",
    priority_4: "4 — Низкий приоритет (серый)",
    no_alerts: "Оповещений пока нет. Нажмите 'Добавить оповещение' для начала.",
    alert_num: "Оповещение",
    collapse: "Свернуть",
    expand: "Изменить",
    move_up: "Вверх",
    move_down: "Вниз",
    version: "Версия",
    op_eq: "= равно",
    op_ne: "≠ не равно",
    op_gt: "> больше",
    op_lt: "< меньше",
    op_gte: "≥ больше или равно",
    op_lte: "≤ меньше или равно",
    op_contains: "⊃ содержит",
    op_not_contains: "⊅ не содержит",
    cycle_animation: "Эффект перехода",
    anim_fold:    "🃏 Fold — 3D переворот",
    anim_slide:   "➡️ Slide — горизонтальное скольжение",
    anim_fade:    "🌫️ Fade — плавное исчезновение",
    anim_flip:    "🔄 Flip — переворот карточки",
    anim_zoom:    "🔍 Zoom — масштабирование",
    anim_glitch:  "⚡ Glitch — цифровой глитч",
    anim_bounce:  "🏀 Bounce — пружинящий отскок",
    anim_swing:   "🎪 Swing — маятник",
    anim_blur:    "💨 Blur — размытие",
    anim_split:   "✂️ Split — вертикальное разделение",
    anim_roll:    "🎲 Roll — прокрутка",
    anim_curtain: "🎭 Curtain — сценический занавес",
    entity_filter: "Фильтр объектов (текст)",
    entity_filter_help: "Найти все объекты, ID или имя которых содержит этот текст. Поддерживает шаблоны * (например sensor.battery_*_level). Нажмите на количество результатов для просмотра списка. Используйте {name}, {entity}, {state}, {device} в сообщениях.",
    entity_filter_count: "подходящих объектов",
    entity_filter_excluded: "исключено",
    entity_filter_zero: "Объекты не найдены",
    entity_filter_exclude_tip: "Нажмите на объект для исключения — нажмите снова для включения",
    entity_filter_invert: "Инвертировать выбор",
    alert_attribute: "Атрибут (необязательно)",
    alert_attribute_help: "например battery_level — оставьте пустым для использования состояния объекта. Поддерживает вложенные пути: например activity.0.forecast",
    secondary_entity: "Вторичный объект значения (необязательно)",
    secondary_entity_help: "Показывает живое значение этого объекта как дополнительную строку под сообщением.",
    secondary_text: "Статичный вспомогательный текст (необязательно)",
    secondary_text_help: "Фиксированный текст под сообщением. Поддерживает {state}, {name}, {entity}. Не требует датчика.",
    show_filter_name: "Показывать имя объекта (из entity_filter)",
    show_filter_state: "Показывать состояние",
    secondary_attribute: "Атрибут вторичного значения",
    show_secondary_name: "Показывать имя объекта рядом со значением",
    conditions_section: "Дополнительные условия",
    conditions_logic: "Логика",
    logic_and: "AND — должны совпасть все",
    logic_or: "OR — достаточно одного совпадения",
    add_condition: "Добавить условие",
    condition_entity: "Объект условия",
    condition_attribute: "Атрибут условия",
    tap_action_section: "Действие по нажатию",
    double_tap_action_section: "Действие по двойному нажатию",
    hold_action_section: "Действие по удержанию (500мс)",
    clear_tap_action_section: "Нажатие на карточку 'всё в порядке'",
    clear_double_tap_action_section: "Двойное нажатие на карточку 'всё в порядке'",
    clear_hold_action_section: "Удержание карточки 'всё в порядке' (500мс)",
    snooze_action_section: "Действие откладывания 💤 — выполняется при нажатии кнопки откладывания",
    timer_theme_category: "Таймер",
    message_placeholder_hint: "Переменные: {name} имя объекта, {state} состояние, {entity} ID объекта, {device} имя устройства",
    timer_placeholder_hint: "Используйте {timer} в сообщении для отображения обратного отсчёта (например 'Отключится через {timer}')",
    action_type: "Тип действия",
    action_none: "Нет",
    action_call_service: "Вызов сервиса",
    action_navigate: "Перейти на страницу",
    action_more_info: "Подробная информация",
    action_url: "Открыть URL",
    action_service: "Сервис HA",
    action_target: "Целевой объект",
    action_service_data: "Дополнительные данные (необязательный JSON)",
    action_navigate_path: "Путь (например /lovelace/home)",
    action_url_path: "URL для открытия",
    delete_item: "Удалить",
    section_overlay: "Оверлей-уведомление 🔔",
    overlay_mode: "Показывать оверлей-баннер при срабатывании оповещения",
    overlay_mode_help: "Отображает фиксированный баннер в верхней части экрана при появлении нового оповещения — виден из любого вида дашборда.",
    overlay_position: "Позиция",
    overlay_pos_top: "Вверху",
    overlay_pos_bottom: "Внизу",
    overlay_pos_center: "По центру",
    overlay_duration: "Длительность (секунды, 0 = только ручное закрытие)",
    overlay_duration_help: "Секунды до автоматического закрытия баннера. 0 = остаётся до ручного закрытия.",
    overlay_how_works: "Баннер появляется только когда карточка не видна на экране — на другом виде или за пределами окна. Баннер не показывается, если оповещение уже видно.",
    visible_to_section: "👤 Видимость по пользователю",
    visible_to_label: "Видно для",
    visible_to_all: "Все (по умолчанию)",
    visible_to_admin: "Только администраторы",
    visible_to_non_admin: "Только обычные пользователи",
    visible_to_custom: "Конкретные пользователи...",
    visible_to_help: "Фильтрует это оповещение по типу пользователя HA. С 'Конкретными пользователями' введите имя или список через запятую.",
    visible_to_users_label: "Имена пользователей (через запятую)",
    visible_to_loading: "Загрузка пользователей...",
    time_range_section: "🕐 Временной диапазон активации",
    time_range_from: "С (ЧЧ:ММ)",
    time_range_to: "До (ЧЧ:ММ)",
    time_range_help: "Показывать это оповещение только в указанном временном окне. Поддерживает переход через полночь (например, 22:00–06:00). Оставьте пустым без ограничений.",
  },
  da: {
    tab_general: "Generelt",
    tab_alerts: "Advarsler",
    tab_overlay: "Overlay",
    tab_allclear: "Alt OK",
    back: "Tilbage",
    all_clear_disabled_help: "Aktivér 'Alt OK' for at konfigurere beskeden når der ingen advarsler er.",
    tab_layout: "Layout",
    hub_desc_general: "Cyklus, slumre og historik",
    hub_desc_layout: "Tema, korthøjde og visuelt udseende",
    hub_desc_overlay: "Globalt banner på alle dashboards",
    hub_desc_alerts: "Administrer advarselbetingelser",
    hub_desc_allclear: "Besked når der ikke er aktive advarsler",
    hub_report_issue: "Rapporter et problem",
    hub_welcome: "Velkommen! Konfigurer dit kort ved at vælge en sektion nedenfor.",
    clear_display_mode_label: "Visningstilstand",
    clear_mode_message: "💬 Tilpasset besked",
    clear_mode_clock: "🕐 Ur",
    clear_mode_weather: "🌤 Vejr",
    clear_mode_weather_clock: "🌤🕐 Vejr + Ur",
    clear_weather_entity_label: "Vejrentitet (weather.*)",
    cycle_interval: "Rotations interval (sekunder)",
    cycle_interval_help: "Sekunder mellem advarsler, når flere er aktive",
    section_all_clear: "Alt er i orden‑kort",
    section_layout: "Layout og udseende",
    section_cycling: "Rotation og animation",
    section_snooze: "Slumre 💤",
    section_history: "Historik",
    show_when_clear: "Vis når ingen advarsler er aktive",
    large_buttons: "Store altid‑synlige knapper (💤 og 📋)",
    ha_theme: "Tilpas til HA‑tema (kompatibelt med Mushroom og alle globale temaer)",
    swipe_to_snooze: "Swipe til venstre for at slumre 💤 (ideelt til mobil)",
    vertical: "Lodret layout (ikon øverst, tekst nedenfor, centreret)",
    text_align_center: "Centrer tekst (nyttig til bredt panel‑layout)",
    card_height: "Fast kort‑højde (px)",
    card_height_help: "Låser højden for at undgå layout‑skift, når advarsler ændres. Lad stå tom for automatisk højde.",
    show_snooze_bar: "Vis reaktiveringsbar for slumre 💤",
    snooze_default_duration: "Slumre 💤‑adfærd",
    snooze_default_duration_help: "Varighedsmenu: klik på 💤 åbner en menu, hvor du vælger, hvor længe du vil slumre. Fast varighed: klik på 💤 slumrer med det samme, uden menu.",
    snooze_option_menu: "Vis varighedsmenu (som før)",
    snooze_duration: "Slumretid for denne advarsel 💤",
    snooze_duration_help: "Overstyrer den globale indstilling. Tom = brug global.",
    snooze_duration_menu: "Varighedsmenu",
    snooze_duration_global: "Brug global indstilling",
    sound_enabled: "Afspil en lyd, når en advarsel vises",
    sound_enabled_help: "Afspiller en auto‑genereret tone, når en advarsel bliver aktiv. Tonen varierer efter kategori (kritisk = dobbelt høj bip, advarsel = medium bip, info = blød bip, OK = stigende klokke). Kræver browserens autoplay‑tilladelse.",
    sound_url: "Brugerdefineret lyd‑URL (global)",
    sound_url_help: "URL til en .mp3‑ eller .wav‑fil, som erstatter genereret lyd. Lad stå tom for den genererede tone.",
    alert_sound: "Lyd aktiveret for denne advarsel",
    alert_sound_url: "Brugerdefineret lyd‑URL for denne advarsel",
    alert_sound_url_help: "Overstyrer den globale URL. Lad stå tom for at bruge den globale.",
    test_mode: "Testtilstand",
    test_mode_desc: "Viser alle advarsler som aktive og ignorerer betingelser. Cykling og animation er pauset – udvid en advarsel i editoren for at se den med det samme på kortet.",
    test_mode_warning: "Husk at deaktivere testtilstand, før du gemmer!",
    history_max_events: "Historik – maks. antal hændelser",
    history_max_events_help: "Registrerer automatisk hvert advarsel‑hændelse, der bliver aktiv. Klik på 📋 på kortet for at se historik med dato/tid. Data gemmes i browseren.",
    history: "Historik",
    history_clear: "Ryd",
    history_empty: "Ingen hændelser registreret endnu",
    clear_message: "Besked når ingen advarsler er aktive",
    clear_badge_label: "Badge‑tekst (f.eks. 'Alt OK', lad stå tom for standard)",
    clear_theme: "Tema for 'alt er i orden'‑tilstand",
    alerts_list: "Konfigurerede advarsler",
    add_alert: "Tilføj advarsel",
    alert_entity: "Enhed",
    alert_operator: "Betingelse",
    alert_state: "Værdi",
    alert_state_help: "f.eks. 'on', '80' (tal med > < >= <=)",
    current_state: "Nuværende tilstand",
    alert_message: "Besked der skal vises",
    alert_name: "Navn / Etiket",
    alert_name_placeholder: "fx. Bevægelsessensorer etage 1",
    alert_name_help: "Valgfri etiket vist som præfiks til beskeden (fx 'Bevægelsessensorer: gang aktiv'). Nyttigt med entity_filter til at skelne mellem advarselsgrupper.",
    alert_message_help: "Brug {state} for live‑værdi, {name} for venlig navn, {entity} for enheds‑ID. Understøtter også fulde HA‑skabeloner: {{ states('sensor.x') }}, {{ state_attr('climate.y','current_temperature') }}, {% if ... %}...{% endif %}",
    alert_priority: "Prioritet",
    alert_theme: "Tema",
    alert_icon: "Ikon",
    alert_icon_help: "Lad stå tomt for tema-emoji. Indtast en brugerdefineret emoji. Aktivér 'Brug HA-ikon' for automatisk at vise entitetens MDI-ikon (eller vælg et manuelt).",
    auto_icon_preview: "Automatisk ikon fra entitet",
    use_ha_icon: "Brug Home Assistant‑ikon (mdi:)",
    icon_color: "Ikonfarve",
    icon_color_help: "CSS‑farve: f.eks. #ff0000, red, var(--error-color). Lad stå tom for tema‑standard.",
    on_change: "Udløs ved enhver tilstandsændring (ignorerer betingelser)",
    on_change_help: "Advarsel udløser, når enhedens tilstand ændrer sig (enhver værdi). Bedst til hændelser: tællere, tidsstemle, sensorer uden faste tilstande.",
    auto_dismiss_section: "Auto‑luk",
    auto_dismiss_after: "Auto‑skjul efter (sekunder)",
    auto_dismiss_after_help: "Advarsel skjules automatisk efter N sekunder. Lad stå tom for at holde den altid synlig.",
    show_badge: "Vis badge",
    badge_label: "Brugerdefineret badge‑tekst",
    badge_label_help: "Lad stå tom for at bruge tema‑standard‑tekst",
    delete: "Slet",
    priority_1: "1 — Kritisk (rød)",
    priority_2: "2 — Advarsel (orange)",
    priority_3: "3 — Info (blå)",
    priority_4: "4 — Lav prioritet (grå)",
    no_alerts: "Ingen advarsler konfigureret. Klik 'Tilføj advarsel' for at komme igang.",
    alert_num: "Advarsel",
    collapse: "Luk",
    expand: "Rediger",
    move_up: "Op",
    move_down: "Ned",
    version: "Version",
    op_eq: "= lig med",
    op_ne: "≠ forskellig fra",
    op_gt: "> større end",
    op_lt: "< mindre end",
    op_gte: "≥ større eller lig med",
    op_lte: "≤ mindre eller lig med",
    op_contains: "⊃ indeholder",
    op_not_contains: "⊅ indeholder ikke",
    cycle_animation: "Overgangsanimation",
    anim_fold:    "🃏 Fold — 3D sidebog",
    anim_slide:   "➡️ Slide — horisontal skub",
    anim_fade:    "🌫️ Fade — fade‑overgang",
    anim_flip:    "🔄 Flip — kortflip",
    anim_zoom:    "🔍 Zoom — skaler‑zoom",
    anim_glitch:  "⚡ Glitch — digital støj",
    anim_bounce:  "🏀 Bounce — elastisk spring",
    anim_swing:   "🎪 Swing — pendul",
    anim_blur:    "💨 Blur — Gaussian‑fuzzy",
    anim_split:   "✂️ Split — lodret klip",
    anim_roll:    "🎲 Roll — rotateY + slide",
    anim_curtain: "🎭 Gardin — teater åbner",
    entity_filter: "Enheds‑filter (tekst)",
    entity_filter_help: "Matcher alle enheder, hvis ID eller navn indeholder denne tekst. Understøtter wildcard * (f.eks. sensor.battery_*_level). Klik på tallet for at se listen og bruge 'Invertér markering'. Brug {name}, {entity}, {state} i beskeden.",
    entity_filter_count: "enheder matcher",
    entity_filter_excluded: "ekskluderet",
    entity_filter_zero: "Ingen enheder matcher",
    entity_filter_exclude_tip: "Klik på en enhed for at ekskludere den — klik igen for at gen‑inkludere",
    entity_filter_invert: "Invertér markering",
    alert_attribute: "Attribut (valgfri)",
    alert_attribute_help: "f.eks. battery_level — lad stå tom for at bruge enheds‑tilstand. Understøtter nøstede stier: f.eks. activity.0.forecast",
    secondary_entity: "Sekundær værdi‑enhed (valgfri)",
    secondary_entity_help: "Viser live‑værdien af denne enhed som en ekstra linje under beskeden. F.eks. en sensor, der viser åbne zoner eller aktive advarsler.",
    secondary_text: "Statiske sekundære tekst (valgfri)",
    secondary_text_help: "Fast tekst under beskeden. Understøtter {state}, {name}, {entity}. Ingen sensor‑enhed kræves.",
    show_filter_name: "Vis enheds‑navn (fra entity_filter)",
    show_filter_state: "Vis tilstand",
    secondary_attribute: "Sekundær værdi‑attribut",
    show_secondary_name: "Vis enheds‑navn ved siden af værdien",
    conditions_section: "Ekstra betingelser",
    conditions_logic: "Logik",
    logic_and: "OG — alle skal matche",
    logic_or: "ELLER — mindst én skal matche",
    add_condition: "Tilføj betingelse",
    condition_entity: "Betingelses‑enhed",
    condition_attribute: "Betingelses‑attribut",
    tap_action_section: "Klik‑handling",
    double_tap_action_section: "Dobbelt‑klik‑handling",
    hold_action_section: "Hold‑handling (500 ms)",
    clear_tap_action_section: "Klik på 'alt er i orden'‑kort",
    clear_double_tap_action_section: "Dobbelt‑klik på 'alt er i orden'‑kort",
    clear_hold_action_section: "Hold på 'alt er i orden'‑kort (500 ms)",
    snooze_action_section: "Slumre‑handling 💤 — udføres når slumre‑knappen trykkes",
    timer_theme_category: "Timer",
    message_placeholder_hint: "Pladsholdere: {name} enheds‑navn, {state} tilstand, {entity} enheds‑ID, {device} enheds‑navn",
    timer_placeholder_hint: "Brug {timer} i beskeden for at vise nedtælling (f.eks. 'Deaktiveret i {timer}')",
    action_type: "Handlingstype",
    action_none: "Ingen",
    action_call_service: "Kald service",
    action_navigate: "Naviger til side",
    action_more_info: "Mere info",
    action_url: "Åbn URL",
    action_service: "HA‑service",
    action_target: "Mål‑enhed",
    action_service_data: "Ekstra data (valgfrit JSON)",
    action_navigate_path: "Sti (f.eks. /lovelace/home)",
    action_url_path: "URL der skal åbnes",
    delete_item: "Slet",
    section_overlay: "Overlay-notifikation 🔔",
    overlay_mode: "Vis overlay-banner, når en advarsel udløses",
    overlay_mode_help: "Viser et fast banner øverst på skærmen, når en ny advarsel aktiveres — synligt fra enhver dashboard-visning.",
    overlay_position: "Position",
    overlay_pos_top: "Øverst",
    overlay_pos_bottom: "Nederst",
    overlay_pos_center: "Midt på",
    overlay_duration: "Varighed (sekunder, 0 = kun manuel lukning)",
    overlay_duration_help: "Sekunder før banneret automatisk lukkes. 0 = forbliver åbent til manuel lukning.",
    overlay_how_works: "Banneret vises kun, når kortet ikke er synligt — på en anden visning. Vises ikke, hvis advarslen allerede er synlig på kortet.",
    visible_to_section: "👤 Brugersynlighed",
    visible_to_label: "Synlig for",
    visible_to_all: "Alle (standard)",
    visible_to_admin: "Kun administratorer",
    visible_to_non_admin: "Kun ikke-administratorer",
    visible_to_custom: "Bestemte brugere...",
    visible_to_help: "Filtrerer denne advarsel efter HA-brugertype. Med 'Bestemte brugere' angiv et navn eller kommasepareret liste.",
    visible_to_users_label: "Brugernavne (kommasepareret)",
    visible_to_loading: "Indlæser brugere...",
    time_range_section: "🕐 Aktivt tidsvindue",
    time_range_from: "Fra (HH:MM)",
    time_range_to: "Til (HH:MM)",
    time_range_help: "Vis kun denne alarm inden for det angivne tidsvindue. Understøtter midnatovergang (f.eks. 22:00–06:00). Lad være tomt for ingen begrænsning.",
    card_border: "Vis kortramme og navn",
    card_border_help: "Tilføjer den standard Home Assistant-ramme rundt om kortet. Når der ingen aktive advarsler er, vises en pladsholder med kortnavnet i stedet for at skjule det helt.",
  },
};

// ---------------------------------------------------------------------------
// Theme description translations  (parenthetical label per language)
// vi falls back to en for technical terms
// ---------------------------------------------------------------------------
const THEME_DESC_I18N = {
  emergency:    { it: "Pulsante rosso",        en: "Red button",           fr: "Bouton rouge",          de: "Roter Knopf",           nl: "Rode knop"            },
  fire:         { it: "Fiamma",                en: "Flame",                fr: "Flamme",                de: "Flamme",                nl: "Vlam"                 },
  alarm:        { it: "Strobo",                en: "Strobe",               fr: "Stroboscope",           de: "Stroboskop",            nl: "Stroboscoop"          },
  lightning:    { it: "Fulmine",               en: "Lightning bolt",       fr: "Éclair",                de: "Blitz",                 nl: "Bliksem"              },
  nuclear:      { it: "Radiazione",            en: "Radiation",            fr: "Radiation",             de: "Strahlung",             nl: "Straling"             },
  flood:        { it: "Onde animate",          en: "Animated waves",       fr: "Vagues animées",        de: "Wellen animiert",       nl: "Geanimeerde golven"   },
  motion:       { it: "Night-vision scan",     en: "Night-vision scan",    fr: "Scan vision nocturne",  de: "Nachtsicht-Scan",       nl: "Nachtzicht scan"      },
  intruder:     { it: "Sirena rossa",          en: "Red siren",            fr: "Sirène rouge",          de: "Rote Sirene",           nl: "Rode sirene"          },
  toxic:        { it: "Bolle verdi",           en: "Green bubbles",        fr: "Bulles vertes",         de: "Grüne Blasen",          nl: "Groene bellen"        },
  warning:      { it: "Bordo ambra",           en: "Amber border",         fr: "Bordure ambrée",        de: "Bernsteinrahmen",       nl: "Amber rand"           },
  caution:      { it: "Nastro giallo",         en: "Yellow tape",          fr: "Ruban jaune",           de: "Gelbes Band",           nl: "Geel lint"            },
  radar:        { it: "Sonar sweep",           en: "Sonar sweep",          fr: "Balayage sonar",        de: "Sonar-Scan",            nl: "Sonar sweep"          },
  temperature:  { it: "Termometro",            en: "Thermometer",          fr: "Thermomètre",           de: "Thermometer",           nl: "Thermometer"          },
  battery:      { it: "Scarica",               en: "Draining",             fr: "En décharge",           de: "Entladen",              nl: "Ontladen"             },
  door:         { it: "Porta aperta",          en: "Open door",            fr: "Porte ouverte",         de: "Offene Tür",            nl: "Open deur"            },
  window:       { it: "Finestra aperta",       en: "Open window",          fr: "Fenêtre ouverte",       de: "Offenes Fenster",       nl: "Open raam"            },
  smoke:        { it: "Fumo grigio",           en: "Grey smoke",           fr: "Fumée grise",           de: "Grauer Rauch",          nl: "Grijze rook"          },
  wind:         { it: "Raffiche",              en: "Gusts",                fr: "Rafales",               de: "Böen",                  nl: "Windvlagen"           },
  leak:         { it: "Gocce",                 en: "Drops",                fr: "Gouttes",               de: "Tropfen",               nl: "Druppels"             },
  info:         { it: "Bordo blu",             en: "Blue border",          fr: "Bordure bleue",         de: "Blauer Rand",           nl: "Blauwe rand"          },
  notification: { it: "Bubble",                en: "Bubble",               fr: "Bulle",                 de: "Blase",                 nl: "Ballon"               },
  aurora:       { it: "Animato",               en: "Animated",             fr: "Animé",                 de: "Animiert",              nl: "Geanimeerd"           },
  hologram:     { it: "Olografico",            en: "Holographic",          fr: "Holographique",         de: "Holografisch",          nl: "Holografisch"         },
  presence:     { it: "Ping radar",            en: "Radar ping",           fr: "Ping radar",            de: "Radar-Ping",            nl: "Radar ping"           },
  update:       { it: "Anello rotante",        en: "Rotating ring",        fr: "Anneau rotatif",        de: "Rotierender Ring",      nl: "Roterende ring"       },
  cloud:        { it: "Nuvola",                en: "Cloud puff",           fr: "Nuage",                 de: "Wolke",                 nl: "Wolk"                 },
  satellite:    { it: "Segnale",               en: "Signal",               fr: "Signal",                de: "Signal",                nl: "Signaal"              },
  tips:         { it: "Consiglio",             en: "Tip",                  fr: "Conseil",               de: "Tipp",                  nl: "Tip"                  },
  success:      { it: "Verde",                 en: "Green",                fr: "Vert",                  de: "Grün",                  nl: "Groen"                },
  check:        { it: "Anello pulsante",       en: "Pulsing ring",         fr: "Anneau pulsant",        de: "Pulsierender Ring",     nl: "Pulserende ring"      },
  confetti:     { it: "Coriandoli",            en: "Confetti",             fr: "Confettis",             de: "Konfetti",              nl: "Confetti"             },
  heartbeat:    { it: "ECG pulsante",          en: "Pulsing ECG",          fr: "ECG pulsant",           de: "Pulsierendes EKG",      nl: "Pulserend ECG"        },
  shield:       { it: "Scudo + scan",          en: "Shield scan",          fr: "Bouclier + scan",       de: "Schild-Scan",           nl: "Schild scan"          },
  power:        { it: "Fulmine verde",         en: "Green bolt",           fr: "Éclair vert",           de: "Grüner Blitz",          nl: "Groene bliksem"       },
  sunrise:      { it: "Alba",                  en: "Sunrise glow",         fr: "Lueur de l'aube",       de: "Sonnenaufgang",         nl: "Ochtendgloren"        },
  plant:        { it: "Crescita",              en: "Growing",              fr: "Croissance",            de: "Wachstum",              nl: "Groeiend"             },
  lock:         { it: "Sicuro",                en: "Secure",               fr: "Sécurisé",              de: "Gesichert",             nl: "Beveiligd"            },
  ticker:       { it: "Scorrevole",            en: "Scrolling",            fr: "Défilant",              de: "Laufschrift",           nl: "Scrollend"            },
  neon:         { it: "Cyberpunk",             en: "Cyberpunk",            fr: "Cyberpunk",             de: "Cyberpunk",             nl: "Cyberpunk"            },
  glass:        { it: "Glassmorphism",         en: "Glassmorphism",        fr: "Glassmorphism",         de: "Glassmorphism",         nl: "Glassmorphism"        },
  matrix:       { it: "Terminale",             en: "Terminal",             fr: "Terminal",              de: "Terminal",              nl: "Terminal"             },
  minimal:      { it: "Pulito",                en: "Clean",                fr: "Épuré",                 de: "Aufgeräumt",            nl: "Opgeruimd"            },
  retro:        { it: "CRT fosforescente",     en: "Phosphor CRT",         fr: "CRT phosphore",         de: "Phosphor-CRT",          nl: "Fosfor CRT"           },
  cyberpunk:    { it: "Neon viola/cyan",       en: "Purple/cyan neon",     fr: "Néon violet/cyan",      de: "Lila/Cyan Neon",        nl: "Paars/cyan neon"      },
  vapor:        { it: "Vaporwave grid",        en: "Vaporwave grid",       fr: "Vaporwave grid",        de: "Vaporwave-Raster",      nl: "Vaporwave raster"     },
  lava:         { it: "Blob arancio",          en: "Orange blob",          fr: "Blob orange",           de: "Orangefarbener Blob",   nl: "Oranje blob"          },
  countdown:    { it: "Barra progressiva",     en: "Progress bar",         fr: "Barre de progression",  de: "Fortschrittsbalken",    nl: "Voortgangsbalk"       },
  hourglass:    { it: "Riempimento verticale", en: "Vertical fill",        fr: "Remplissage vertical",  de: "Vertikale Füllung",     nl: "Verticale vulling"    },
  timer_pulse:  { it: "Pulsante veloce",       en: "Fast pulse",           fr: "Pulsation rapide",      de: "Schneller Puls",        nl: "Snelle puls"          },
  timer_ring:   { it: "Anello SVG",            en: "SVG ring",             fr: "Anneau SVG",            de: "SVG-Ring",              nl: "SVG ring"             },
};

// Category group name translations
const THEME_GROUP_I18N = {
  critical: { it: "Critico",      en: "Critical",  fr: "Critique",     de: "Kritisch",   nl: "Kritiek",       vi: "Nghiêm trọng", ru: "Критично"   },
  warning:  { it: "Attenzione",   en: "Warning",   fr: "Attention",    de: "Warnung",    nl: "Waarschuwing",  vi: "Cảnh báo",     ru: "Внимание"   },
  info:     { it: "Informazione", en: "Info",      fr: "Information",  de: "Info",       nl: "Informatie",    vi: "Thông tin",    ru: "Информация" },
  ok:       { it: "Tutto OK",     en: "All Clear", fr: "Tout va bien", de: "Alles OK",   nl: "Alles OK",      vi: "Tất cả ổn",    ru: "Всё OK"     },
  style:    { it: "Stile",        en: "Style",     fr: "Style",        de: "Stil",       nl: "Stijl",         vi: "Phong cách",   ru: "Стиль"      },
};

// ---------------------------------------------------------------------------
// Theme options
// ---------------------------------------------------------------------------
// Grouped theme options with category separators
const THEME_OPTIONS = [
  { value: "emergency"    },
  { value: "fire"         },
  { value: "alarm"        },
  { value: "lightning"    },
  { value: "nuclear"      },
  { value: "flood"        },
  { value: "motion"       },
  { value: "intruder"     },
  { value: "toxic"        },
  { value: "warning"      },
  { value: "caution"      },
  { value: "radar"        },
  { value: "temperature"  },
  { value: "battery"      },
  { value: "door"         },
  { value: "window"       },
  { value: "smoke"        },
  { value: "wind"         },
  { value: "leak"         },
  { value: "info"         },
  { value: "notification" },
  { value: "aurora"       },
  { value: "hologram"     },
  { value: "presence"     },
  { value: "update"       },
  { value: "cloud"        },
  { value: "satellite"    },
  { value: "tips"         },
  { value: "success"      },
  { value: "check"        },
  { value: "confetti"     },
  { value: "heartbeat"    },
  { value: "shield"       },
  { value: "power"        },
  { value: "sunrise"      },
  { value: "plant"        },
  { value: "lock"         },
  { value: "ticker"       },
  { value: "neon"         },
  { value: "glass"        },
  { value: "matrix"       },
  { value: "minimal"      },
  { value: "retro"        },
  { value: "cyberpunk"    },
  { value: "vapor"        },
  { value: "lava"         },
  { value: "countdown"    },
  { value: "hourglass"    },
  { value: "timer_pulse"  },
  { value: "timer_ring"   },
];

// ---------------------------------------------------------------------------
// Editor class
// ---------------------------------------------------------------------------
class AlertTickerCardEditor extends LitElement {
  static get properties() {
    return {
      _config: { type: Object },
      _hass: {},
      _activeSection: { type: String },
      _editingIndex: { type: Number },
      _filterPreviewOpen: { type: Object },
      _lang: { type: String },
      _haUsers: { type: Array },
    };
  }

  constructor() {
    super();
    this._activeSection = null; // null = hub
    this._editingIndex = -1;            // -1 = no alert being edited
    this._filterPreviewOpen = new Set();
    this._lang = "en";
    this._initializing = false;         // true during first render microtask burst
    this._haUsers = null;               // null = not yet fetched, [] = fetch failed/empty
    this._haUsersFetching = false;
  }

  _onTimeInput(e) {
    const inp = e.target.shadowRoot?.querySelector("input") || e.target;
    const pos = inp.selectionStart;
    const raw = inp.value;
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + ":" + digits.slice(2);
    if (inp.value !== formatted) {
      inp.value = formatted;
      // keep cursor after the colon when auto-inserted
      const newPos = formatted.length === 3 && pos === 2 ? 3 : Math.min(pos, formatted.length);
      try { inp.setSelectionRange(newPos, newPos); } catch (_) {}
    }
  }

  _saveTimeField(e, alert, index, field) {
    const inp = e.target.shadowRoot?.querySelector("input") || e.target;
    let val = (inp.value || "").trim();
    const m = val.match(/^(\d{1,2}):(\d{1,2})$/);
    if (m) {
      const h   = Math.min(parseInt(m[1], 10), 23);
      const min = Math.min(parseInt(m[2], 10), 59);
      val = String(h).padStart(2, "0") + ":" + String(min).padStart(2, "0");
      inp.value = val;
    } else {
      val = "";
      inp.value = "";
    }
    const cur = alert.time_range || {};
    const other = field === "from" ? "to" : "from";
    const updated = val ? { ...cur, [field]: val } : (cur[other] ? { [other]: cur[other] } : undefined);
    this._updateAlert(index, { time_range: updated });
  }

  async _fetchHaUsers() {
    if (this._haUsersFetching || !this._hass) return;
    this._haUsersFetching = true;
    try {
      const users = await this._hass.callWS({ type: "config/auth/list" });
      this._haUsers = (users || []).filter(u => u.is_active && !u.system_generated);
    } catch (_) {
      this._haUsers = [];
    }
    this._haUsersFetching = false;
  }

  // Select or deselect an alert for editing.
  // Uses a simple Number (_editingIndex) — no Set, no DOM attributes.
  // setConfig / _fireConfig / ha-service-control can never corrupt this.
  _editAlert(index) {
    const opening = this._editingIndex !== index;
    this._editingIndex = opening ? index : -1;
    if (opening) {
      // Suppress spurious ha-service-control value-changed events fired on
      // willUpdate when the new edit panel mounts (confirmed HA bug: oldValue
      // is undefined on first render). Re-use the same two-tick suppression
      // used in connectedCallback.
      this._initializing = true;
      Promise.resolve().then(() => Promise.resolve().then(() => {
        this._initializing = false;
      }));
    }
    if (this._config && this._config.test_mode && this._editingIndex === index) {
      this._fireConfig({ ...this._config, _preview_index: index });
    }
  }

  // -------------------------------------------------------------------------
  // HA lifecycle
  // -------------------------------------------------------------------------
  setConfig(config) {
    const defaults = {
      cycle_interval: 5,
      show_when_clear: false,
      clear_message: "",
      clear_theme: "success",
      alerts: [],
    };
    // Strip transient editor-only fields so they are NEVER permanently stored.
    // _preview_index / _preview_anim are ephemeral signals: the card uses them
    // for one render cycle but they must not end up saved in the user's YAML.
    // Leaving them in causes the JSON dedup in _fireConfig to malfunction.
    const { _preview_index, _preview_anim, ...cleanConfig } = config;
    const merged = { ...defaults, ...cleanConfig };
    // Preserve existing alert object references where the content is identical.
    // This prevents unnecessary re-renders caused by new object identity even
    // when the data hasn't changed (e.g. after ha-service-control normalizes).
    if (this._config && this._config.alerts) {
      merged.alerts = (merged.alerts || []).map((newAlert, i) => {
        const old = this._config.alerts[i];
        if (old && JSON.stringify(old) === JSON.stringify(newAlert)) return old;
        return newAlert;
      });
    }
    this._config = merged;
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
    // Suppress ha-service-control's spurious value-changed fired during willUpdate
    // on first render (confirmed HA bug: oldValue is undefined on first render so
    // the condition `oldValue?.action !== this.value?.action` is always true).
    // Two microtask ticks cover LitElement's update → willUpdate → render cycle.
    this._initializing = true;
    Promise.resolve().then(() => Promise.resolve().then(() => {
      this._initializing = false;
    }));
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

  /** Returns a translated label for a theme option entry */
  _themeLabel(opt) {
    const EMOJI = {
      emergency: "🚨", fire: "🔥", alarm: "🔴", lightning: "🌩️", nuclear: "☢️",
      flood: "🌊", motion: "👁️", intruder: "🚷", toxic: "☠️",
      warning: "⚠️", caution: "🟡", radar: "🎯", temperature: "🌡️",
      battery: "🔋", door: "🚪", window: "🪟", smoke: "🌫️", wind: "💨", leak: "💧",
      info: "ℹ️", notification: "🔔", aurora: "🌌", hologram: "🔷",
      presence: "🏠", update: "🔄", cloud: "☁️", satellite: "📡", tips: "💡",
      success: "✅", check: "🟢", confetti: "🎉", heartbeat: "💓",
      shield: "🛡️", power: "⚡", sunrise: "🌅", plant: "🌱", lock: "🔒",
      ticker: "📰", neon: "⚡", glass: "🔮", matrix: "💻", minimal: "📋",
      retro: "📺", cyberpunk: "🤖", vapor: "🌸", lava: "🌋",
      countdown: "⏱️", hourglass: "⏳", timer_pulse: "💥", timer_ring: "🔵",
    };
    const NAME = {
      timer_pulse: "Timer Pulse", timer_ring: "Timer Ring",
    };
    const emoji = EMOJI[opt.value] || "";
    const name  = NAME[opt.value] || (opt.value.charAt(0).toUpperCase() + opt.value.slice(1));
    const descs = THEME_DESC_I18N[opt.value];
    if (!descs) return `${emoji} ${name}`;
    const lang = this._lang || "en";
    const desc = descs[lang] || descs.en;
    return `${emoji} ${name} (${desc})`;
  }

  /** Returns the translated label for a theme category group */
  _groupLabel(cat, emoji) {
    const lang = this._lang || "en";
    const g = THEME_GROUP_I18N[cat];
    const name = g ? (g[lang] || g.en) : cat;
    return `${emoji} ${name}`;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  render() {
    if (!this._config) return html``;
    const s = this._activeSection;
    return html`
      <div class="editor-wrapper">
        ${s === null       ? this._renderHub()        :
          s === "general"  ? this._renderGeneralTab()  :
          s === "layout"   ? this._renderLayoutTab()   :
          s === "overlay"  ? this._renderOverlayTab()  :
          s === "allclear" ? this._renderAllClearTab()  :
          this._renderAlertsTab()}
        <div class="version-badge">${this._t("version")}: ${CARD_VERSION}</div>
      </div>
    `;
  }

  _renderHub() {
    const cfg = this._config;
    const alertCount = (cfg.alerts || []).length;
    const overlayOn  = !!cfg.overlay_mode;
    const clearOn    = !!cfg.show_when_clear;
    return html`
      <div class="hub-header">
        <span class="hub-title">🚨 Alert Ticker Card</span>
        <span class="hub-version">v${CARD_VERSION}</span>
      </div>

      <div class="hub-welcome">
        <p class="hub-welcome-text">${this._t("hub_welcome")}</p>
      </div>

      <!-- Alerts — full width -->
      <button class="hub-tile hub-tile--wide" @click="${() => this._sectionChanged("alerts")}">
        <span class="hub-tile-icon">🚨</span>
        <div class="hub-tile-text">
          <span class="hub-tile-label">${this._t("tab_alerts")}</span>
          <span class="hub-tile-desc">${this._t("hub_desc_alerts")}</span>
        </div>
        ${alertCount > 0 ? html`<span class="hub-badge hub-badge--alerts">${alertCount}</span>` : ""}
      </button>

      <!-- 2×2 grid -->
      <div class="hub-grid">
        <button class="hub-tile" @click="${() => this._sectionChanged("general")}">
          <span class="hub-tile-icon">⚙️</span>
          <span class="hub-tile-label">${this._t("tab_general")}</span>
          <span class="hub-tile-desc">${this._t("hub_desc_general")}</span>
        </button>
        <button class="hub-tile" @click="${() => this._sectionChanged("layout")}">
          <span class="hub-tile-icon">🖼️</span>
          <span class="hub-tile-label">${this._t("tab_layout")}</span>
          <span class="hub-tile-desc">${this._t("hub_desc_layout")}</span>
        </button>
        <button class="hub-tile" @click="${() => this._sectionChanged("overlay")}">
          <span class="hub-tile-icon">🔔</span>
          <span class="hub-tile-label">${this._t("tab_overlay")}</span>
          <span class="hub-tile-desc">${this._t("hub_desc_overlay")}</span>
          ${overlayOn ? html`<span class="hub-badge hub-badge--on">ON</span>` : ""}
        </button>
        <button class="hub-tile" @click="${() => this._sectionChanged("allclear")}">
          <span class="hub-tile-icon">✅</span>
          <span class="hub-tile-label">${this._t("tab_allclear")}</span>
          <span class="hub-tile-desc">${this._t("hub_desc_allclear")}</span>
          ${clearOn ? html`<span class="hub-badge hub-badge--on">ON</span>` : ""}
        </button>
      </div>

      <div class="hub-footer">
        <span class="hub-footer-love">Made with ❤️ by <strong>djdevil</strong></span>
        <span class="hub-footer-links">
          <a class="hub-footer-link" href="https://github.com/djdevil/AlertTicker-Card/issues" target="_blank" rel="noopener">🐛 ${this._t("hub_report_issue")}</a>
          <a class="hub-footer-bmc" href="https://www.buymeacoffee.com/divil17f" target="_blank" rel="noopener">
            <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" />
          </a>
        </span>
      </div>
    `;
  }

  _renderSectionHeader(titleKey) {
    return html`
      <div class="section-header">
        <button class="section-back-btn" @click="${() => this._sectionChanged(null)}">
          &#8592; <span>${this._t("back")}</span>
        </button>
        <span class="section-header-title">${this._t(titleKey)}</span>
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
      { cat: "critical", emoji: "🚨" },
      { cat: "warning",  emoji: "⚠️" },
      { cat: "info",     emoji: "ℹ️" },
      { cat: "ok",       emoji: "✅" },
      { cat: "style",    emoji: "🎨" },
    ];
    const TIMER_GROUP = { cat: "timer", label: `⏱️ ${this._t("timer_theme_category")}` };

    const groups = timerOnly
      ? [TIMER_GROUP]
      : onlyOk
        ? [{ cat: "ok", emoji: "✅" }]
        : GROUPS;

    return html`
      <div class="native-select-wrap">
        <label class="native-select-label">${this._t(labelKey)}</label>
        <select
          class="native-select"
          @change="${(e) => handler(e.target.value)}"
        >
          ${groups.map((g) => html`
            <optgroup label="${g.label || this._groupLabel(g.cat, g.emoji)}">
              ${THEME_OPTIONS
                .filter((o) => (THEME_META[o.value] || {}).category === g.cat)
                .map((o) => html`
                  <option value="${o.value}" ?selected="${currentValue === o.value}">
                    ${this._themeLabel(o)}
                  </option>
                `)}
            </optgroup>
          `)}
        </select>
      </div>
    `;
  }

  _renderLayoutTab() {
    const cfg = this._config;
    return html`
      ${this._renderSectionHeader("tab_layout")}

      <div class="section-divider">🖼️ ${this._t("section_layout")}</div>
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("ha_theme")}</span>
          <ha-switch
            .checked="${!!cfg.ha_theme}"
            @change="${(e) => this._fireConfig({ ...this._config, ha_theme: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("vertical")}</span>
          <ha-switch
            .checked="${!!cfg.vertical}"
            @change="${(e) => this._fireConfig({ ...this._config, vertical: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("text_align_center")}</span>
          <ha-switch
            .checked="${cfg.text_align === 'center'}"
            @change="${(e) => this._fireConfig({ ...this._config, text_align: e.target.checked ? 'center' : undefined })}"
          ></ha-switch>
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("large_buttons")}</span>
          <ha-switch
            .checked="${!!cfg.large_buttons}"
            @change="${(e) => this._fireConfig({ ...this._config, large_buttons: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
      </div>
      <div class="form-row">
        <ha-textfield
          type="number"
          .label="${this._t("card_height")}"
          .value="${cfg.card_height ? String(cfg.card_height) : ""}"
          min="40"
          max="800"
          placeholder="auto"
          @change="${(e) => {
            const v = parseInt(e.target.value);
            this._fireConfig({ ...this._config, card_height: (v > 0 ? v : undefined) });
          }}"
        ></ha-textfield>
        <div class="helper-text">${this._t("card_height_help")}</div>
      </div>
      <div class="form-row">
        <div class="toggle-row">
          <span>${this._t("card_border")}</span>
          <ha-switch
            .checked="${!!cfg.card_border}"
            @change="${(e) => this._fireConfig({ ...this._config, card_border: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
        <div class="helper-text">${this._t("card_border_help")}</div>
      </div>
    `;
  }

  _renderGeneralTab() {
    const cfg = this._config;

    return html`
      ${this._renderSectionHeader("tab_general")}

      <!-- ── CYCLING & ANIMATION ───────────────────────────────────────── -->
      <div class="section-divider">🔄 ${this._t("section_cycling")}</div>
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
      <div class="form-row">
        <div class="native-select-wrap">
          <label class="native-select-label">${this._t("cycle_animation")}</label>
          <select class="native-select" @change="${(e) => this._cycleAnimationChanged(e.target.value)}">
            ${["fold", "slide", "fade", "flip", "zoom", "glitch", "bounce", "swing", "blur", "split", "roll", "curtain"].map((a) => html`
              <option value="${a}" ?selected="${(cfg.cycle_animation || "fold") === a}">
                ${this._t("anim_" + a)}
              </option>
            `)}
          </select>
        </div>
      </div>

      <!-- ── SNOOZE ────────────────────────────────────────────────────── -->
      <div class="section-divider">💤 ${this._t("section_snooze")}</div>
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
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("swipe_to_snooze")}</span>
          <ha-switch
            .checked="${!!cfg.swipe_to_snooze}"
            @change="${(e) => this._fireConfig({ ...this._config, swipe_to_snooze: e.target.checked || undefined })}"
          ></ha-switch>
        </div>
      </div>
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("show_snooze_bar")}</span>
          <ha-switch
            .checked="${cfg.show_snooze_bar !== false}"
            @change="${(e) => this._fireConfig({ ...this._config, show_snooze_bar: e.target.checked ? undefined : false })}"
          ></ha-switch>
        </div>
      </div>

      <!-- ── HISTORY ───────────────────────────────────────────────────── -->
      <div class="section-divider">📋 ${this._t("section_history")}</div>
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
    `;
  }

  _renderAllClearTab() {
    const cfg = this._config;
    return html`
      ${this._renderSectionHeader("tab_allclear")}
      <div class="form-row">
        <div class="form-row-inline">
          <span>${this._t("show_when_clear")}</span>
          <ha-switch
            .checked="${cfg.show_when_clear === true}"
            @change="${(e) => this._showWhenClearChanged(e.target.checked)}"
          ></ha-switch>
        </div>
      </div>
      ${cfg.show_when_clear ? html`
        <!-- Display mode -->
        <div class="form-row">
          <div class="native-select-wrap">
            <label class="native-select-label">${this._t("clear_display_mode_label")}</label>
            <select class="native-select"
              @change="${(e) => this._fireConfig({ ...this._config, clear_display_mode: e.target.value })}"
            >
              <option value="message"       ?selected="${(cfg.clear_display_mode || 'message') === 'message'}">${this._t("clear_mode_message")}</option>
              <option value="clock"         ?selected="${cfg.clear_display_mode === 'clock'}">${this._t("clear_mode_clock")}</option>
              <option value="weather"       ?selected="${cfg.clear_display_mode === 'weather'}">${this._t("clear_mode_weather")}</option>
              <option value="weather_clock" ?selected="${cfg.clear_display_mode === 'weather_clock'}">${this._t("clear_mode_weather_clock")}</option>
            </select>
          </div>
        </div>

        <!-- Weather entity (only for weather/weather_clock modes) -->
        ${(cfg.clear_display_mode === 'weather' || cfg.clear_display_mode === 'weather_clock') ? html`
          <div class="form-row">
            <ha-entity-picker
              .hass="${this._hass}"
              .value="${cfg.clear_weather_entity || ''}"
              .includeDomains="${['weather']}"
              .label="${this._t("clear_weather_entity_label")}"
              allow-custom-entity
              @value-changed="${(e) => this._fireConfig({ ...this._config, clear_weather_entity: e.detail.value || undefined })}"
            ></ha-entity-picker>
          </div>
        ` : ''}

        <!-- Message fields (only for message mode) -->
        ${(!cfg.clear_display_mode || cfg.clear_display_mode === 'message') ? html`
        <div class="form-row">
          <ha-textfield
            .label="${this._t("clear_message")}"
            .value="${cfg.clear_message || ""}"
            @change="${(e) => this._clearMessageChanged(e.target.value)}"
          ></ha-textfield>
        </div>
        <div class="form-row">
          <ha-textfield
            .label="${this._t("clear_badge_label")}"
            .value="${cfg.clear_badge_label || ""}"
            @change="${(e) => this._fireConfig({ ...this._config, clear_badge_label: e.target.value.trim() || undefined })}"
          ></ha-textfield>
        </div>
        <div class="form-row">
          ${this._renderThemeSelect("clear_theme", cfg.clear_theme || "success", (v) => this._clearThemeChanged(v), true)}
        </div>
        ${this._renderCardActionConfig("clear_tap_action",        this._t("clear_tap_action_section"))}
        ${this._renderCardActionConfig("clear_double_tap_action", this._t("clear_double_tap_action_section"))}
        ${this._renderCardActionConfig("clear_hold_action",       this._t("clear_hold_action_section"))}
        ` : ''}
      ` : html`
        <div class="helper-text" style="margin-top:8px">${this._t("all_clear_disabled_help")}</div>
      `}
    `;
  }

  _renderOverlayTab() {
    const cfg = this._config;
    const pos = cfg.overlay_position || "top";
    return html`
      ${this._renderSectionHeader("tab_overlay")}
      <div class="tab-content">
        <div class="overlay-box ${cfg.overlay_mode ? "overlay-box--active" : ""}">
          <div class="overlay-box-header">
            <div class="overlay-box-icon">🔔</div>
            <div class="overlay-box-text">
              <div class="overlay-box-title">
                ${this._t("section_overlay")}
                <span class="overlay-box-badge">NEW</span>
              </div>
              <div class="overlay-box-desc">${this._t("overlay_mode_help")}</div>
            </div>
            <ha-switch
              ?checked="${!!cfg.overlay_mode}"
              @change="${(e) => this._fireConfig({ ...this._config, overlay_mode: e.target.checked })}"
            ></ha-switch>
          </div>
          ${cfg.overlay_mode ? html`
          <div class="overlay-preview-wrap">
            <div class="overlay-preview-toast">
              <span style="font-size:22px">🚨</span>
              <div style="flex:1;min-width:0">
                <div class="overlay-preview-badge">CRITICAL</div>
                <div class="overlay-preview-msg">${this._t("overlay_mode")}</div>
              </div>
              <span style="opacity:.5;font-size:14px">✕</span>
            </div>
          </div>
          <div class="overlay-how-it-works">💡 ${this._t("overlay_how_works")}</div>
          <div class="overlay-controls">
            <div class="native-select-wrap">
              <label class="native-select-label">${this._t("overlay_position")}</label>
              <select class="native-select"
                @change="${(e) => this._fireConfig({ ...this._config, overlay_position: e.target.value })}"
              >
                <option value="top"    ?selected="${pos === "top"}">${this._t("overlay_pos_top")}</option>
                <option value="center" ?selected="${pos === "center"}">${this._t("overlay_pos_center")}</option>
                <option value="bottom" ?selected="${pos === "bottom"}">${this._t("overlay_pos_bottom")}</option>
              </select>
            </div>
            <ha-textfield
              type="number"
              .label="${this._t("overlay_duration")}"
              .value="${cfg.overlay_duration != null ? String(cfg.overlay_duration) : "8"}"
              min="0" max="60" placeholder="8"
              @change="${(e) => {
                const v = parseInt(e.target.value);
                this._fireConfig({ ...this._config, overlay_duration: (isNaN(v) || v < 0) ? 8 : v });
              }}"
            ></ha-textfield>
            <div class="helper-text">${this._t("overlay_duration_help")}</div>
          </div>
          ` : ""}
        </div>
      </div>
    `;
  }

  _renderAlertsTab() {
    const alerts = this._config.alerts || [];

    return html`
      ${this._renderSectionHeader("tab_alerts")}
      <div class="alerts-header">
        <span>${this._t("alerts_list")}</span>
        <span class="alerts-count">${alerts.length} ${alerts.length === 1 ? "item" : "items"}</span>
      </div>

      ${alerts.length === 0
        ? html`<div class="empty-alerts">${this._t("no_alerts")}</div>`
        : alerts.map((alert, index) => this._renderAlertItem(alert, index))}

      ${this._renderAlertEditPanel()}

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
    const isEditing = this._editingIndex === index;
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

    const total = (this._config.alerts || []).length;
    return html`
      <div class="${`alert-item${isEditing ? " is-editing" : ""}`}"
           @click="${() => this._editAlert(index)}">
        <div class="alert-move-col">
          <button
            class="btn-move-inline"
            title="${this._t("move_up")}"
            ?disabled="${index === 0}"
            @click="${(e) => { e.stopPropagation(); this._moveAlertUp(index); }}"
          >▲</button>
          <button
            class="btn-move-inline"
            title="${this._t("move_down")}"
            ?disabled="${index === total - 1}"
            @click="${(e) => { e.stopPropagation(); this._moveAlertDown(index); }}"
          >▼</button>
        </div>
        <span class="alert-icon-badge">${icon}</span>
        <div class="alert-summary-text">
          <div class="alert-entity-label">${this._t("alert_num")} ${index + 1}: ${alert.name || entityLabel}</div>
          ${!alert.name && msgSnippet ? html`<div class="alert-msg-label">${msgSnippet}</div>` : ""}
          ${alert.name ? html`<div class="alert-msg-label">${entityLabel}</div>` : ""}
        </div>
        <span class="alert-prio-badge prio-${prio}">P${prio}</span>
        <div class="alert-actions">
          <span class="alert-expand-indicator"></span>
          <button
            class="btn-icon btn-delete"
            title="${this._t("delete")}"
            @click="${(e) => { e.stopPropagation(); this._deleteAlert(index); }}"
          >
            🗑 ${this._t("delete")}
          </button>
        </div>
      </div>
    `;
  }

  // Renders the full edit form for the currently selected alert (_editingIndex).
  // This lives OUTSIDE the alert list — completely immune to list re-renders.
  _renderAlertEditPanel() {
    const index = this._editingIndex;
    const alerts = this._config.alerts || [];
    if (index < 0 || index >= alerts.length) return "";
    const alert = alerts[index];
    return html`
      <div class="alert-edit-panel">
        <div class="alert-edit-panel-header">
          <span>${this._t("alert_num")} ${index + 1}</span>
          <button class="btn-icon alert-edit-close" @click="${() => { this._editingIndex = -1; }}">✕</button>
        </div>
        <div class="alert-form">

                <!-- ── TEMA + PRIORITÀ (in cima per anteprima immediata) ─── -->
                <div class="theme-priority-row">
                  <div class="theme-priority-theme">
                    ${this._renderThemeSelect(
                      "alert_theme",
                      alert.theme || ((alert.entity || "").startsWith("timer.") ? "countdown" : "emergency"),
                      (v) => this._alertThemeChanged(v, index),
                      false,
                      (alert.entity || alert.entity_filter || "").startsWith("timer.")
                    )}
                  </div>
                  <div class="theme-priority-priority">
                    <ha-select
                      .label="${this._t("alert_priority")}"
                      .value="${String(alert.priority || 1)}"
                      fixedMenuPosition
                      naturalMenuWidth
                      @closed="${(e) => e.stopPropagation()}"
                    >
                      ${[1, 2, 3, 4].map((p) => html`
                        <mwc-list-item
                          value="${String(p)}"
                          ?selected="${(alert.priority || 1) === p}"
                          @request-selected="${(e) => {
                            if (e.detail.source !== "interaction") return;
                            this._alertPriorityChanged(e.target.getAttribute("value"), index);
                          }}"
                        >${this._t("priority_" + p)}</mwc-list-item>
                      `)}
                    </ha-select>
                  </div>
                </div>
                ${(alert.entity || "").startsWith("timer.") ? html`
                  <div class="helper-text">${this._t("timer_placeholder_hint")}</div>
                ` : ""}

                <!-- ── NOME / ETICHETTA (editor only) ───────────────────── -->
                <ha-textfield
                  .label="${this._t("alert_name")}"
                  .value="${alert.name || ""}"
                  .placeholder="${this._t("alert_name_placeholder")}"
                  @change="${(e) => this._updateAlert(index, { name: e.target.value.trim() || undefined })}"
                ></ha-textfield>
                <div class="helper-text">${this._t("alert_name_help")}</div>

                <!-- ── 1. ENTITÀ ─────────────────────────────────────────── -->
                <div class="section-divider">🔍 ${this._t("alert_entity")}</div>

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

                <!-- show_filter_name / show_filter_state toggles — only when entity_filter is set -->
                ${alert.entity_filter ? html`
                  <ha-formfield .label="${this._t("show_filter_name")}">
                    <ha-switch
                      ?checked="${alert.show_filter_name !== false}"
                      @change="${(e) => this._updateAlert(index, { show_filter_name: e.target.checked ? undefined : false })}"
                    ></ha-switch>
                  </ha-formfield>
                  <ha-formfield .label="${this._t("show_filter_state")}">
                    <ha-switch
                      ?checked="${!!alert.show_filter_state}"
                      @change="${(e) => this._updateAlert(index, { show_filter_state: e.target.checked ? true : undefined })}"
                    ></ha-switch>
                  </ha-formfield>
                ` : ""}

                <!-- ── 2. CONDIZIONE ──────────────────────────────────────── -->
                <div class="section-divider">⚡ ${this._t("conditions_section")}</div>

                <!-- on_change toggle — when active hides operator/state/conditions -->
                <div>
                  <ha-formfield .label="${this._t("on_change")}">
                    <ha-switch
                      ?checked="${!!alert.on_change}"
                      @change="${(e) => this._updateAlert(index, { on_change: e.target.checked || undefined })}"
                    ></ha-switch>
                  </ha-formfield>
                  <div class="helper-text">${this._t("on_change_help")}</div>
                </div>
                ${!alert.on_change ? html`
                <!-- Primary condition: operator + value -->
                <div class="form-row-2col">
                  <div class="native-select-wrap">
                    <label class="native-select-label">${this._t("alert_operator")}</label>
                    <select
                      class="native-select"
                      @change="${(e) => this._alertOperatorChanged(e.target.value, index)}"
                    >
                      ${[
                        ["=",           "op_eq"],
                        ["!=",          "op_ne"],
                        [">",           "op_gt"],
                        ["<",           "op_lt"],
                        [">=",          "op_gte"],
                        ["<=",          "op_lte"],
                        ["contains",     "op_contains"],
                        ["not_contains", "op_not_contains"],
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

                <!-- Extra AND/OR conditions -->
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
                          ${[["=","op_eq"],["!=","op_ne"],[">","op_gt"],["<","op_lt"],[">=","op_gte"],["<=","op_lte"],["contains","op_contains"],["not_contains","op_not_contains"]].map(([op, key]) => html`
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
                ` : ""} <!-- end !alert.on_change -->
                <!-- ── AUTO-DISMISS ──────────────────────────────────────── -->
                <div class="section-divider">⏱ ${this._t("auto_dismiss_section")}</div>

                <div>
                  <ha-textfield
                    type="number"
                    .label="${this._t("auto_dismiss_after")}"
                    .value="${alert.auto_dismiss_after != null ? String(alert.auto_dismiss_after) : ""}"
                    placeholder=""
                    min="1"
                    @change="${(e) => {
                      const v = parseInt(e.target.value, 10);
                      this._updateAlert(index, { auto_dismiss_after: v > 0 ? v : undefined });
                    }}"
                  ></ha-textfield>
                  <div class="helper-text">${this._t("auto_dismiss_after_help")}</div>
                </div>

                <!-- ── 4. MESSAGGIO ──────────────────────────────────────── -->
                <div class="section-divider">💬 ${this._t("alert_message")}</div>

                <ha-textfield
                  .label="${this._t("alert_message")}"
                  .value="${alert.message || ""}"
                  @change="${(e) => this._alertMessageChanged(e.target.value, index)}"
                ></ha-textfield>
                <div class="helper-text">${this._t("alert_message_help")}</div>


                <!-- Icon override -->
                <div>
                  <ha-formfield .label="${this._t("use_ha_icon")}">
                    <ha-switch
                      ?checked="${!!alert.use_ha_icon}"
                      @change="${(e) => this._alertHaIconToggled(e.target.checked, index)}"
                    ></ha-switch>
                  </ha-formfield>
                  ${alert.use_ha_icon ? html`
                      <ha-icon-picker
                        .label="${this._t("alert_icon")}"
                        .value="${alert.icon || ""}"
                        @value-changed="${(e) => this._alertIconChanged(e.detail.value, index)}"
                      ></ha-icon-picker>
                      ${(() => {
                        if (alert.icon) return "";
                        const stateObj = this._hass?.states?.[alert.entity];
                        if (!stateObj) return "";
                        return html`<div class="auto-icon-preview">
                          <ha-state-icon .hass="${this._hass}" .stateObj="${stateObj}"></ha-state-icon>
                          <span>${this._t("auto_icon_preview")}</span>
                        </div>`;
                      })()}
                      <div class="icon-color-row">
                        <input
                          type="color"
                          class="icon-color-swatch"
                          .value="${this._cssColorToHex(alert.icon_color)}"
                          @input="${(e) => this._updateAlert(index, { icon_color: e.target.value || undefined })}"
                          title="${this._t("icon_color")}"
                        />
                        <ha-textfield
                          .label="${this._t("icon_color")}"
                          .value="${alert.icon_color || ""}"
                          placeholder="inherit"
                          @change="${(e) => {
                            const v = e.target.value.trim() || undefined;
                            this._updateAlert(index, { icon_color: v });
                          }}"
                        ></ha-textfield>
                      </div>
                      <div class="helper-text">${this._t("icon_color_help")}</div>
                      <div class="helper-text">${this._t("alert_icon_help")}</div>
                  ` : ""}
                </div>

                <!-- Badge -->
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

                <!-- ── 4. VALORI SECONDARI ────────────────────────────────── -->
                <div class="section-divider">📊 ${this._t("secondary_entity")}</div>

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
                  <ha-formfield .label="${this._t("show_secondary_name")}">
                    <ha-switch
                      ?checked="${!!alert.show_secondary_name}"
                      @change="${(e) => this._updateAlert(index, { show_secondary_name: e.target.checked ? true : undefined })}"
                    ></ha-switch>
                  </ha-formfield>
                ` : ""}

                <!-- Secondary static text -->
                <div>
                  <ha-textfield
                    .label="${this._t("secondary_text")}"
                    .value="${alert.secondary_text || ""}"
                    @change="${(e) => this._updateAlert(index, { secondary_text: e.target.value || undefined })}"
                  ></ha-textfield>
                  <div class="helper-text">${this._t("secondary_text_help")}</div>
                </div>

                <!-- ── 5. OPZIONI ─────────────────────────────────────────── -->
                <div class="section-divider">⚙️ ${this._t("snooze_duration")}</div>

                <!-- Per-alert snooze duration override -->
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

                <!-- User visibility filter -->
                ${(() => {
                  const vt = alert.visible_to;
                  const isCustom = vt && vt !== "admin" && vt !== "non_admin";
                  const selectVal = !vt ? "all" : isCustom ? "custom" : vt;
                  // Trigger user list fetch when custom is active
                  if (selectVal === "custom" && this._haUsers === null) this._fetchHaUsers();
                  const selectedNames = isCustom
                    ? (Array.isArray(vt) ? vt : (vt ? [vt] : []))
                    : [];
                  return html`
                    <div class="section-divider">${this._t("visible_to_section")}</div>
                    <div class="form-row">
                      <ha-select
                        .label="${this._t("visible_to_label")}"
                        .value="${selectVal}"
                        fixedMenuPosition naturalMenuWidth
                        @closed="${(e) => e.stopPropagation()}"
                      >
                        ${["all","admin","non_admin","custom"].map(opt => html`
                          <mwc-list-item value="${opt}" ?selected="${selectVal === opt}"
                            @request-selected="${(e) => {
                              if (e.detail.source !== "interaction") return;
                              const v = e.target.getAttribute("value");
                              if (v === "custom" && this._haUsers === null) this._fetchHaUsers();
                              const newVal = v === "all" ? null : v === "custom" ? [] : v;
                              this._updateAlert(index, { visible_to: newVal });
                            }}"
                          >${this._t("visible_to_" + opt)}</mwc-list-item>
                        `)}
                      </ha-select>
                      <div class="helper-text">${this._t("visible_to_help")}</div>
                    </div>
                    ${selectVal === "custom" ? html`
                      <div class="form-row">
                        ${this._haUsers === null ? html`
                          <div class="helper-text">⏳ ${this._t("visible_to_loading")}</div>
                        ` : this._haUsers.length === 0 ? html`
                          <ha-textfield
                            .label="${this._t("visible_to_users_label")}"
                            .value="${selectedNames.join(", ")}"
                            @change="${(e) => {
                              const parts = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                              this._updateAlert(index, { visible_to: parts.length === 1 ? parts[0] : parts.length > 1 ? parts : undefined });
                            }}"
                          ></ha-textfield>
                        ` : html`
                          <div class="visible-to-user-list">
                            ${this._haUsers.map(u => {
                              const checked = selectedNames.includes(u.name);
                              return html`
                                <ha-formfield .label="${u.name}${u.is_admin ? " ★" : ""}">
                                  <ha-checkbox
                                    ?checked="${checked}"
                                    @change="${(e) => {
                                      const names = [...selectedNames];
                                      if (e.target.checked) { if (!names.includes(u.name)) names.push(u.name); }
                                      else { const i = names.indexOf(u.name); if (i !== -1) names.splice(i, 1); }
                                      this._updateAlert(index, { visible_to: names.length === 0 ? undefined : names.length === 1 ? names[0] : names });
                                    }}"
                                  ></ha-checkbox>
                                </ha-formfield>
                              `;
                            })}
                          </div>
                        `}
                      </div>
                    ` : ""}
                  `;
                })()}

                <!-- Time range -->
                <div class="section-divider">${this._t("time_range_section")}</div>
                <div class="form-row form-row--two-col">
                  <ha-textfield
                    .label="${this._t("time_range_from")}"
                    .value="${alert.time_range?.from || ""}"
                    placeholder="HH:MM"
                    maxlength="5"
                    inputmode="numeric"
                    @input="${(e) => this._onTimeInput(e)}"
                    @blur="${(e) => this._saveTimeField(e, alert, index, "from")}"
                  ></ha-textfield>
                  <ha-textfield
                    .label="${this._t("time_range_to")}"
                    .value="${alert.time_range?.to || ""}"
                    placeholder="HH:MM"
                    maxlength="5"
                    inputmode="numeric"
                    @input="${(e) => this._onTimeInput(e)}"
                    @blur="${(e) => this._saveTimeField(e, alert, index, "to")}"
                  ></ha-textfield>
                </div>
                <div class="helper-text">${this._t("time_range_help")}</div>

                <!-- Tap action / Hold action / Snooze action -->
                ${this._renderActionConfig(alert, index, "tap_action",        this._t("tap_action_section"))}
                ${this._renderActionConfig(alert, index, "double_tap_action", this._t("double_tap_action_section"))}
                ${this._renderActionConfig(alert, index, "hold_action",       this._t("hold_action_section"))}
                ${this._renderActionConfig(alert, index, "snooze_action", this._t("snooze_action_section"))}


        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Config change helpers
  // -------------------------------------------------------------------------
  _fireConfig(newConfig) {
    // Skip if config is unchanged — prevents ha-service-control's init
    // value-changed events from triggering needless re-renders.
    if (this._config && JSON.stringify(this._config) === JSON.stringify(newConfig)) return;
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
    // Re-attach _preview_index when editing in test mode so the card stays
    // on the correct alert after every field change (otherwise the card
    // loses _preview_index and may jump back to the first alert).
    const extra = (this._config.test_mode && this._editingIndex === index)
      ? { _preview_index: index }
      : {};
    this._fireConfig({ ...this._config, alerts, ...extra });
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
  _sectionChanged(section) {
    this._activeSection = section;
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
  _addAlert() {
    const alerts = [...(this._config.alerts || [])];
    const newIndex = alerts.length;
    const defaultTheme = "emergency";
    const defaultMsg = (DEFAULT_MSG[this._lang] || DEFAULT_MSG.en)[defaultTheme] || "";
    alerts.push({ entity: "", operator: "=", state: "on", message: defaultMsg, priority: 1, theme: defaultTheme, icon: "" });
    // Open the new alert in the edit panel immediately
    this._editingIndex = newIndex;
    const newConfig = this._config.test_mode
      ? { ...this._config, alerts, _preview_index: newIndex }
      : { ...this._config, alerts };
    this._fireConfig(newConfig);
  }

  _deleteAlert(index) {
    const alerts = [...(this._config.alerts || [])];
    alerts.splice(index, 1);
    // Adjust _editingIndex
    if (this._editingIndex === index) {
      this._editingIndex = -1;
    } else if (this._editingIndex > index) {
      this._editingIndex = this._editingIndex - 1;
    }
    // Clean up filterPreviewOpen
    const next = new Set(this._filterPreviewOpen);
    next.delete(index);
    this._filterPreviewOpen = next;
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
      // Pre-fill icon from entity registry or state attributes; leave empty if none found
      const entityIcon = this._hass?.entities?.[alert.entity]?.icon
                      || this._hass?.states?.[alert.entity]?.attributes?.icon
                      || "";
      this._updateAlert(index, { use_ha_icon: true, icon: entityIcon || undefined });
    } else {
      // Restore the theme default emoji, clear icon_color
      const themeIcon = (THEME_META[alert.theme] || {}).icon || "";
      this._updateAlert(index, { use_ha_icon: false, icon: themeIcon, icon_color: undefined });
    }
  }

  /** Converts a CSS color string to a hex value for <input type="color">.
   *  Returns #000000 for anything that cannot be parsed (CSS vars, named colors etc.). */
  _cssColorToHex(color) {
    if (!color) return "#000000";
    if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
    if (/^#[0-9a-fA-F]{3}$/.test(color)) {
      const [, r, g, b] = color.match(/^#(.)(.)(.)$/);
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    // For rgb/named/var — try canvas trick; fallback to black
    try {
      const c = document.createElement("canvas").getContext("2d");
      c.fillStyle = color;
      const filled = c.fillStyle;
      return /^#[0-9a-fA-F]{6}$/.test(filled) ? filled : "#000000";
    } catch (_) { return "#000000"; }
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
    // ha-service-control always fires value-changed on first render (HA bug:
    // willUpdate fires when oldValue is undefined even if nothing changed).
    // Ignore these spurious init events.
    if (this._initializing) return;
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
          @value-changed="${(e) => { e.stopPropagation(); this._onServiceControlChanged(index, key, e.detail.value); }}"
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

  /** Card-level action config (clear_tap_action / clear_hold_action) */
  _renderCardActionConfig(configKey, sectionLabel) {
    const cfg = this._config[configKey] || { action: "none" };
    const type = cfg.action || "none";
    return html`
      <div class="section-divider">${sectionLabel}</div>
      <div class="native-select-wrap">
        <label class="native-select-label">${this._t("action_type")}</label>
        <select class="native-select"
          @change="${(e) => this._setCardActionConfig(configKey, "action", e.target.value)}"
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
          @value-changed="${(e) => { e.stopPropagation(); this._onClearServiceControlChanged(configKey, e.detail.value); }}"
        ></ha-service-control>
      ` : ""}
      ${type === "navigate" ? html`
        <ha-textfield
          .label="${this._t("action_navigate_path")}"
          .value="${cfg.navigation_path || ""}"
          @change="${(e) => this._setCardActionConfig(configKey, "navigation_path", e.target.value)}"
        ></ha-textfield>
      ` : ""}
      ${type === "more-info" ? html`
        <ha-entity-picker
          .label="${this._t("action_target")}"
          .hass="${this._hass}"
          .value="${cfg.entity_id || ""}"
          allow-custom-entity
          @value-changed="${(e) => this._setCardActionConfig(configKey, "entity_id", e.detail.value || "")}"
        ></ha-entity-picker>
      ` : ""}
      ${type === "url" ? html`
        <ha-textfield
          .label="${this._t("action_url_path")}"
          .value="${cfg.url_path || ""}"
          @change="${(e) => this._setCardActionConfig(configKey, "url_path", e.target.value)}"
        ></ha-textfield>
      ` : ""}
    `;
  }

  _setCardActionConfig(configKey, field, value) {
    this._fireConfig({
      ...this._config,
      [configKey]: { ...(this._config[configKey] || { action: "none" }), [field]: value },
    });
  }

  _onClearServiceControlChanged(configKey, val) {
    if (this._initializing) return;
    const current = this._config[configKey] || { action: "call-service" };
    this._fireConfig({
      ...this._config,
      [configKey]: {
        ...current,
        action: "call-service",
        service: val.action || val.service || current.service || "",
        target: (val.target && Object.keys(val.target).length) ? val.target : undefined,
        service_data: (val.data && Object.keys(val.data).length) ? val.data : undefined,
      },
    });
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
    // Follow the moved alert in the edit panel
    if (this._editingIndex === index) this._editingIndex = index - 1;
    else if (this._editingIndex === index - 1) this._editingIndex = index;
    this._fireConfig({ ...this._config, alerts });
  }

  _moveAlertDown(index) {
    const alerts = this._config.alerts || [];
    if (index >= alerts.length - 1) return;
    const copy = [...alerts];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    // Follow the moved alert in the edit panel
    if (this._editingIndex === index) this._editingIndex = index + 1;
    else if (this._editingIndex === index + 1) this._editingIndex = index;
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
      .tab-count--on {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-radius: 8px;
        padding: 1px 6px;
        font-size: 0.7rem;
        font-weight: 700;
        opacity: 1;
        letter-spacing: 0.5px;
      }

      /* ---- Hub welcome ---- */
      .hub-welcome {
        padding: 10px 2px 6px;
      }
      .hub-welcome-text {
        font-size: 0.82rem;
        color: var(--secondary-text-color, #888);
        line-height: 1.5;
        margin: 0;
      }

      /* ---- Hub header & footer ---- */
      .hub-header {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 4px 0 12px;
        border-bottom: 2px solid var(--primary-color, #03a9f4);
        margin-bottom: 4px;
      }
      .hub-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--primary-text-color, #212121);
        letter-spacing: 0.3px;
      }
      .hub-version {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
        padding: 1px 7px;
        border-radius: 10px;
      }
      .hub-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 14px 0 4px;
        margin-top: 8px;
        border-top: 1px solid var(--divider-color, #ddd);
      }
      .hub-footer-love {
        font-size: 0.8rem;
        color: var(--secondary-text-color, #888);
      }
      .hub-footer-love strong {
        color: var(--primary-text-color, #212121);
      }
      .hub-footer-links {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .hub-footer-link {
        font-size: 0.78rem;
        color: var(--primary-color, #03a9f4);
        text-decoration: none;
        padding: 4px 10px;
        border: 1px solid var(--primary-color, #03a9f4);
        border-radius: 14px;
        transition: background 0.15s;
      }
      .hub-footer-link:hover {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      }
      .hub-footer-bmc img {
        height: 32px;
        display: block;
        border-radius: 6px;
      }

      /* ---- Hub & spoke navigation ---- */
      .hub-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 8px 0 4px;
      }
      .hub-tile {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 18px 8px;
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 12px;
        background: var(--card-background-color, #fff);
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        font-family: inherit;
      }
      .hub-tile:hover {
        background: var(--secondary-background-color, #f5f5f5);
        border-color: var(--primary-color, #03a9f4);
      }
      .hub-tile--wide {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
        padding: 14px 16px;
        width: 100%;
        margin-top: 6px;
        margin-bottom: 10px;
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 6%, var(--card-background-color, #fff));
        box-sizing: border-box;
      }
      .hub-tile--wide:hover {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, var(--card-background-color, #fff));
      }
      .hub-tile--wide .hub-tile-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .hub-tile-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }
      .hub-tile--wide .hub-tile-label {
        text-align: left;
        font-size: 0.95rem;
      }
      .hub-tile--wide .hub-tile-desc {
        text-align: left;
      }
      .hub-badge--alerts {
        position: relative;
        top: auto;
        right: auto;
        min-width: 22px;
        height: 22px;
        padding: 0 7px;
        border-radius: 11px;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 0.78rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .hub-tile-icon {
        font-size: 1.8rem;
        line-height: 1;
      }
      .hub-tile-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--primary-text-color, #212121);
        text-align: center;
      }
      .hub-tile-desc {
        font-size: 0.7rem;
        color: var(--secondary-text-color, #888);
        text-align: center;
        line-height: 1.3;
      }
      .hub-badge {
        position: absolute;
        top: 6px;
        right: 8px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 9px;
        background: var(--secondary-text-color, #888);
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
      .hub-badge--on {
        background: var(--success-color, #4caf50);
      }

      /* ---- Section header (back button) ---- */
      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--divider-color, #ddd);
      }
      .section-back-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 20px;
        background: none;
        cursor: pointer;
        font-size: 0.85rem;
        color: var(--primary-color, #03a9f4);
        font-family: inherit;
        transition: background 0.15s;
      }
      .section-back-btn:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .section-header-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-text-color, #212121);
      }

      /* ---- Form rows ---- */
      .form-row {
        margin-bottom: 16px;
      }
      .form-row ha-select,
      .form-row ha-textfield {
        width: 100%;
      }

      .form-row--two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .form-row--two-col ha-textfield { width: 100%; }

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
      .auto-icon-preview {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 6px;
        padding: 4px 10px 4px 6px;
        border-radius: 12px;
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-size: 0.8rem;
        opacity: 0.85;
      }
      .auto-icon-preview ha-icon {
        --mdc-icon-size: 16px;
      }
      .icon-color-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
      }
      .icon-color-row ha-textfield {
        flex: 1;
      }
      .icon-color-swatch {
        width: 38px;
        height: 38px;
        padding: 2px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 6px;
        cursor: pointer;
        background: none;
        flex-shrink: 0;
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
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 10px;
        margin-bottom: 6px;
        cursor: pointer;
        background: var(--card-background-color, #fff);
        user-select: none;
      }
      .alert-item:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .alert-item.is-editing {
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, var(--card-background-color, #fff));
      }
      /* ▼ indicator — purely decorative on the compact row */
      .alert-expand-indicator::before {
        content: "▼";
        font-size: 0.85rem;
        color: var(--secondary-text-color, #888);
      }
      .alert-item.is-editing .alert-expand-indicator::before {
        content: "▲";
      }
      /* Edit panel — appears below the list for the selected alert */
      .alert-edit-panel {
        border: 2px solid var(--primary-color, #03a9f4);
        border-radius: 10px;
        margin-bottom: 12px;
        overflow: hidden;
      }
      .alert-edit-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, var(--card-background-color, #fff));
        font-weight: 600;
        font-size: 0.95rem;
      }
      .alert-edit-close {
        font-size: 1rem;
        line-height: 1;
      }
      .alert-expand-indicator {
        flex-shrink: 0;
        pointer-events: none;
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
      .theme-priority-row {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      .theme-priority-theme {
        flex: 2;
        min-width: 0;
      }
      .theme-priority-priority {
        flex: 1;
        min-width: 0;
      }
      .theme-priority-theme ha-select,
      .theme-priority-priority ha-select {
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
      .visible-to-user-list {
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        padding: 4px 8px;
        max-height: 200px;
        overflow-y: auto;
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

      /* ---- Inline move col (▲▼ on alert row) ---- */
      .alert-move-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-shrink: 0;
        margin-right: 6px;
      }
      .btn-move-inline {
        background: var(--secondary-background-color, #f0f0f0);
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 4px;
        cursor: pointer;
        padding: 3px 7px;
        font-size: 0.85rem;
        line-height: 1;
        color: var(--secondary-text-color, #555);
        transition: background 0.15s, color 0.15s;
      }
      .btn-move-inline:hover:not(:disabled) {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        border-color: transparent;
      }
      .btn-move-inline:disabled {
        opacity: 0.25;
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

      /* ---- Overlay feature box ---- */
      .overlay-box {
        margin: 16px 0;
        border-radius: 12px;
        border: 2px solid rgba(3,169,244,0.25);
        background: linear-gradient(135deg, rgba(3,169,244,0.06), rgba(3,169,244,0.02));
        overflow: hidden;
        transition: border-color 0.2s, background 0.2s;
      }
      .overlay-box--active {
        border-color: rgba(3,169,244,0.6);
        background: linear-gradient(135deg, rgba(3,169,244,0.12), rgba(3,169,244,0.04));
      }
      .overlay-box-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
      }
      .overlay-box-icon {
        font-size: 1.6rem;
        flex-shrink: 0;
      }
      .overlay-box-text {
        flex: 1;
        min-width: 0;
      }
      .overlay-box-title {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .overlay-box-badge {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.2px;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        line-height: 1.6;
      }
      .overlay-box-desc {
        font-size: 0.78rem;
        color: var(--secondary-text-color, #888);
        margin-top: 3px;
        line-height: 1.4;
      }
      .overlay-preview-wrap {
        background: rgba(0,0,0,0.1);
        padding: 10px 16px;
        display: flex;
        justify-content: center;
      }
      .overlay-preview-toast {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg,#b71c1c,#c62828);
        border-left: 3px solid #ff5252;
        border-radius: 8px;
        padding: 8px 12px;
        color: #fff;
        font-size: 12px;
        max-width: 340px;
        width: 100%;
      }
      .overlay-preview-badge {
        font-size: 9px;
        opacity: 0.75;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 2px;
      }
      .overlay-preview-msg {
        font-weight: 600;
        font-size: 12px;
        line-height: 1.3;
      }
      .overlay-how-it-works {
        font-size: 0.8rem;
        color: var(--primary-color, #03a9f4);
        padding: 8px 16px;
        line-height: 1.4;
        border-top: 1px solid rgba(3,169,244,0.15);
      }
      .overlay-controls {
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-top: 1px solid rgba(3,169,244,0.15);
      }
      .overlay-controls ha-textfield {
        width: 100%;
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
