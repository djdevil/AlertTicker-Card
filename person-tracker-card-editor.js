// Person Tracker Card Editor - Multilanguage Version
// Languages: Italian (default), English, French, German
// v1.4.12: travel time h:mm parsing + Xh Ym formatting; charging fix WxStation/Holo/Matrix/Orbital/Ink; wifi_ssid_sensor; classic/neon connection text
// v1.4.9: extra_chips config option — add any HA entity as custom chip in all 11 layouts
// v1.4.8: state_entity config option — override displayed location text with any HA sensor
// v1.4.7: Liquid Ink layout (ink) added to picker and validation whitelist
// v1.4.6: maps_provider dropdown added to Sensors tab; show_geocoded_location default true; editor switch/dropdown fixes
// v1.4.5: orbital layout added to picker and validation whitelist
// v1.4.4: show_geocoded_location toggle + geocoded_location_entity picker in Sensors tab (auto-detected)
// v1.4.3: matrix layout added to picker and validation whitelist
// v1.4.2: wxstation layout added to picker; device_2_battery_sensor entity pickers (auto-detect)
// v1.4.1: pair_travel_animation toggle (near smart mode); transparent_background toggle for Glass/Bio
// v1.4.0: weather_text_color picker in weather section; last_changed_color picker in style section
// v1.3.7: Version badge added to editor UI top-right
// v1.3.3: No editor changes
// v1.3.2: Full IT/EN/FR/DE translations for neon/weather sections; auto-detect sensors via mobile_app prefix; editor fields auto-populated
// v1.3.1: Animated weather background editor section (weather_entity + show_weather toggle)
// v1.3.0: Fix #20 load ha-entity-picker via hui-glance-card.getConfigElement(); distance_precision field added
// v1.2.4: Bug fix language, add hide state unknown activity status.

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Localization Helper for Editor
class EditorLocalizationHelper {
  constructor(hass) {
    this.hass = hass;
    this.translations = {};
    this.currentLanguage = 'en';
    this.loadTranslations();
  }

  loadTranslations() {
    const haLanguage = this.hass?.language || this.hass?.locale?.language || 'en';

    const languageMap = {
      'it': 'it',
      'it-IT': 'it',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'fr': 'fr',
      'fr-FR': 'fr',
      'de': 'de',
      'de-DE': 'de'
    };

    this.currentLanguage = languageMap[haLanguage] || 'en';

    this.translations = {
      'it': {
        'editor.entity': 'Entità',
        'editor.name': 'Nome (opzionale)',
        'editor.show_last_changed': 'Mostra ultimo aggiornamento',
        'editor.show_last_updated': 'Mostra ultimo aggiornamento',
        'editor.show_distance': 'Mostra distanza',
        'editor.show_battery': 'Mostra batteria',
        'editor.show_speed': 'Mostra velocità ',
        'editor.show_direction': 'Mostra direzione',
        'editor.show_accuracy': 'Mostra precisione',
        'editor.show_gps_accuracy': 'Mostra precisione GPS',
        'editor.show_altitude': 'Mostra altitudine',
        'editor.show_source': 'Mostra fonte',
        'editor.show_entity_picture': 'Mostra immagine',
        'editor.show_name': 'Mostra stato',
        'editor.show_person_name': 'Mostra nome persona',
        'editor.show_activity': 'Mostra attività ',
        'editor.show_watch_battery': 'Mostra batteria smartwatch',
        'editor.show_travel_time': 'Mostra tempo di viaggio',
        'editor.show_connection': 'Mostra connessione',
        'editor.custom_icon': 'Icona personalizzata',
        'editor.icon_color': 'Colore icona',
        'editor.background_color': 'Colore sfondo',
        'editor.text_color': 'Colore testo',
        'editor.required': 'Obbligatorio',
        'editor.optional': 'Opzionale',
        'editor.layout': 'Layout',
        'editor.appearance': 'Aspetto',
        'editor.display_options': 'Opzioni visualizzazione',
        'editor.positions': 'Posizioni',
        'editor.advanced': 'Avanzate',
        'editor.compact_width': 'Larghezza compatta (px)',
        'editor.modern_width': 'Larghezza modern (px)',
        'editor.custom_image_url': 'URL immagine personalizzata',
        'editor.aspect_ratio': 'Proporzioni',
        'editor.state_value': 'Valore stato',
        'editor.displayed_name': 'Nome visualizzato',
        'editor.custom_image': 'Immagine personalizzata',
        'editor.name_font_size': 'Dimensione font nome',
        'editor.state_font_size': 'Dimensione font stato',
        'editor.last_changed_font_size': 'Dimensione font ultimo aggiornamento',
        'editor.card_background': 'Sfondo card',
        'editor.transparent_background': 'Sfondo trasparente (solo Glass/Bio)',
        'editor.show_particles': 'Mostra particelle animate (solo Glass/Bio)',
        'editor.show_geocoded_location': 'Mostra indirizzo GPS (geocoded location)',
        'editor.geocoded_location_description': 'Mostra l\'indirizzo leggibile ottenuto dal GPS tramite sensor.xxx_geocoded_location. Visibile solo quando la persona non è a casa.',
        'editor.geocoded_location_entity': 'Entità geocoded location (auto-rilevata se vuota)',
        'editor.maps_provider': 'Apri in Maps al click sulla posizione',
        'editor.maps_provider_description': 'Se impostato, cliccando sulla zona o sull\'indirizzo si apre la mappa con le coordinate GPS.',
        'editor.maps_provider_none': 'Disabilitato',
        'editor.state_entity': 'Sensore stato personalizzato',
        'editor.state_entity_description': 'Sovrascrive il testo della posizione visualizzata (es. sensor.mia_posizione). La logica home/away rimane invariata.',
        'editor.show_device_2_battery': 'Batteria secondo dispositivo (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Sensore batteria secondo dispositivo',
        'editor.device_2_battery_state_sensor': 'Stato carica secondo dispositivo',
        'wx.battery': 'Batteria', 'wx.watch': 'Orologio', 'wx.wind': 'Vento',
        'wx.humidity': 'Umidità', 'wx.network': 'Rete', 'wx.activity': 'Attività',
        'wx.pressure': 'Press.', 'wx.feels': 'Percepita', 'wx.device2': 'Disp.2',
        'editor.border_radius': 'Raggio bordo',
        'editor.image_size': 'Dimensione immagine (%)',
        'editor.modern_picture_size': 'Dimensione immagine (px)',
        'editor.modern_name_font_size': 'Dimensione font nome',
        'editor.modern_state_font_size': 'Dimensione font stato',
        'editor.modern_show_battery_ring': 'Mostra anello batteria',
        'editor.modern_show_travel_ring': 'Mostra anello tempo viaggio',
        'editor.modern_travel_max_time': 'Tempo viaggio massimo (min)',
        'editor.modern_distance_max': 'Distanza massima (km)',
        'editor.modern_ring_size': 'Dimensione cerchi (px)',
        'editor.classic_icon_size': 'Dimensione icone (px)',
        'editor.compact_icon_size': 'Dimensione icone (px)',
        'editor.battery_font_size': 'Dimensione font batteria',
        'editor.activity_font_size': 'Dimensione font attività ',
        'editor.battery_state_sensor': 'Sensore stato carica telefono',
        'editor.battery_charging_value': 'Valore stato in carica (opzionale)',
        'editor.watch_battery_state_sensor': 'Sensore stato carica smartwatch',
        'editor.watch_battery_charging_value': 'Valore stato in carica watch (opzionale)',
        'editor.charging_helper': 'Lascia vuoto per rilevamento automatico (charging, full, on, true...)',
        'section.automatic_sensors': 'Sensori Automatici',
        'section.sensors_description': 'I sensori vengono rilevati automaticamente dall\'app mobile collegata all\'entità persona. Prefisso rilevato:',
        'section.auto_detect_btn': 'Rileva automaticamente',
        'section.auto_detect_found': 'sensori trovati',
        'section.auto_detect_none': 'Nessun sensore trovato',
        'section.element_positions': 'Posizioni Elementi',
        'section.positions_description': 'Configura la posizione di ogni elemento sulla card. Disponibile solo nel layout Classic.',
        'section.custom_states': 'Stati Personalizzati',
        'section.states_description': 'Configura come vengono visualizzati i diversi stati della persona',
        'section.card_style': 'Personalizzazione Stile Card',
        'section.modern_options': 'Opzioni Layout Modern',
        'section.classic_options': 'Opzioni Layout Classic',
        'section.compact_options': 'Opzioni Layout Compact',
        'section.neon_options': 'Opzioni Layout Neon',
        'section.neon_description': 'Tema cyberpunk scuro con anello luminoso animato e badge neon. I colori si adattano automaticamente allo stato della persona (verde = casa, rosso = fuori).',
        'section.glass_options': 'Opzioni Layout Glass',
        'section.glass_description': 'Tema glassmorphism scuro con chip traslucidi, orbs colorati e dot di stato animato. Il colore accent si adatta automaticamente alla zona corrente della persona.',
        'section.bio_options': 'Opzioni Layout Bioluminescenza',
        'section.bio_description': 'Tema oceano profondo con orbs bioluminescenti animati, particelle che salgono dal basso e doppio anello pulsante attorno all\'avatar. Il colore accent cambia automaticamente con la zona.',
        'section.holo_options': 'Opzioni Layout Holographic 3D',
        'section.holo_description': 'Tema olografico con card inclinata in 3D, anelli rotanti attorno all\'avatar, scanner animato e sfondo shimmer iridescente. Il colore accent cambia con lo stato della persona.',
        'section.weather': '🌤 Meteo',
        'editor.show_weather': 'Mostra meteo',
        'editor.weather_entity': 'Entità meteo',
        'editor.show_weather_background': 'Mostra sfondo meteo animato',
        'editor.show_weather_temperature': 'Mostra condizioni e temperatura',
        'editor.weather_text_color': 'Colore testo meteo',
        'editor.weather_text_color_description': 'Colore di temperatura, icona e condizione. Lascia vuoto per usare il colore predefinito del layout.',
        'editor.last_changed_color': 'Colore testo aggiornamento',
        'editor.last_changed_color_description': 'Colore del timestamp di ultimo aggiornamento. Lascia vuoto per usare il colore predefinito.',
        'section.weather_description': 'Aggiunge uno sfondo animato alla card (pioggia, neve, sole, stelle, fulmini…). Funziona su tutti i layout.',
        'section.travel_sensor_2': '🏢 Sensori Casa ↔ Lavoro',
        'section.travel_sensor_2_description': 'Sensori 1 (casa→lavoro): visibili a casa e in transito, nascosti al lavoro. Sensori 2 (lavoro→casa): visibili al lavoro e in transito, nascosti a casa. Disattiva la modalità smart per mostrare sempre entrambi.',
        'editor.travel_sensor_2': 'Sensore tempo di viaggio (lavoro → casa)',
        'editor.zone_2': 'Zona lavoro',
        'editor.show_travel_time_2': 'Mostra tempo di viaggio (Lavoro → Casa)',
        'editor.smart_travel_mode': 'Modalità smart (nascondi in base alla posizione)',
        'editor.pair_travel_animation': 'Animazione alternata distanza/tempo (se disattivata, mostra entrambi separati)',
        'editor.distance_precision': 'Decimali distanza (0=intero, 1=un decimale, 2=due decimali)',
        'editor.distance_unit': 'Unità distanza (es. km, mi)',
        'editor.distance_unit_description': 'Lascia vuoto per rilevamento automatico. Per sensori Waze/Google usa km o mi.',
        'editor.direction_home_work': 'Casa → Lavoro',
        'editor.direction_work_home': 'Lavoro → Casa',
        'editor.travel_sensor_home_work': 'Sensore tempo viaggio (Casa → Lavoro)',
        'editor.travel_sensor_work_home': 'Sensore tempo viaggio (Lavoro → Casa)',
        'editor.distance_sensor_home_work': 'Sensore distanza (Casa → Lavoro)',
        'editor.distance_sensor_work_home': 'Sensore distanza (Lavoro → Casa)',
        'editor.show_distance_2': 'Mostra distanza',
        'section.distance_optional': '📍 Distanza (Opzionale)',
        'section.distance_optional_description': 'Mostra la distanza in km. Sempre visibile indipendentemente dalla posizione.',
        'position.battery': 'Posizione batteria',
        'position.watch_battery': 'Posizione batteria smartwatch',
        'position.activity': 'Posizione attività ',
        'position.distance': 'Posizione distanza',
        'position.travel': 'Posizione tempo viaggio',
        'position.connection': 'Posizione connessione',
        'state.name_color': 'Colore nome',
        'state.add_state': 'Aggiungi Stato',
        'default_state.home': '🏡 Casa',
        'default_state.away': '🏃‍♂️ Fuori Casa',
        'default_state.office': '🏢 Ufficio',
        'default_state.unknown': '❓ Sconosciuto',
        'state.default_states': 'Stati Predefiniti',
        'state.add_default_states': 'Aggiungi Stati Predefiniti',
        'tabs.base': 'Base',
        'tabs.layout': 'Layout',
        'tabs.display': 'Visualizzazione',
        'tabs.positions': 'Posizioni',
        'tabs.states': 'Stati',
        'tabs.sensors': 'Sensori',
        'tabs.style': 'Stile',
        'section.extra_chips': 'Chip extra personalizzati',
        'editor.extra_chips_description': 'Aggiungi entità extra come chip (Bluetooth, Android Auto, chiamata, modalità silenziosa…). Con show_when il chip appare solo quando lo stato corrisponde.',
        'editor.extra_chip_entity': 'Entità',
        'editor.extra_chip_show_when': 'Mostra quando (stato)',
        'editor.extra_chip_label': 'Etichetta (opzionale)',
        'editor.extra_chip_color': 'Colore icona e testo',
        'editor.extra_chip_add': '+ Aggiungi chip',
        'editor.extra_chip_tap_action': 'Azione al tocco',
        'editor.extra_chip_tap_more_info': 'Mostra info (more-info)',
        'editor.extra_chip_tap_call_service': 'Chiama servizio',
        'editor.extra_chip_tap_navigate': 'Naviga',
        'editor.extra_chip_tap_url': 'Apri URL',
        'editor.extra_chip_tap_none': 'Nessuna azione',
        'editor.extra_chip_icon_label': 'Icona (default: icona entità)',
        'editor.extra_chip_service': 'Servizio (es. light.turn_on)',
        'editor.extra_chip_service_data': 'Dati extra (JSON, opzionale)',
        'editor.extra_chip_nav_path': 'Percorso navigazione',
        'editor.extra_chip_url_path': 'URL',
        'editor.wifi_ssid_sensor': 'Sensore SSID Wi-Fi',
        'editor.wifi_ssid_sensor_description': 'Sensore che riporta il nome della rete Wi-Fi a cui è connesso il dispositivo (es. sensor.elliot_s_phone_wi_fi_connection). Quando impostato, il nome della rete viene mostrato al posto di "WiFi".'
      },
      'en': {
        'editor.entity': 'Entity',
        'editor.name': 'Name (optional)',
        'editor.show_last_changed': 'Show last changed',
        'editor.show_last_updated': 'Show last updated',
        'editor.show_distance': 'Show distance',
        'editor.show_battery': 'Show battery',
        'editor.show_speed': 'Show speed',
        'editor.show_direction': 'Show direction',
        'editor.show_accuracy': 'Show accuracy',
        'editor.show_gps_accuracy': 'Show GPS accuracy',
        'editor.show_altitude': 'Show altitude',
        'editor.show_source': 'Show source',
        'editor.show_entity_picture': 'Show picture',
        'editor.show_name': 'Show state',
        'editor.show_person_name': 'Show person name',
        'editor.show_activity': 'Show activity',
        'editor.show_watch_battery': 'Show watch battery',
        'editor.show_travel_time': 'Show travel time',
        'editor.show_connection': 'Show connection',
        'editor.custom_icon': 'Custom icon',
        'editor.icon_color': 'Icon color',
        'editor.background_color': 'Background color',
        'editor.text_color': 'Text color',
        'editor.required': 'Required',
        'editor.optional': 'Optional',
        'editor.layout': 'Layout',
        'editor.appearance': 'Appearance',
        'editor.display_options': 'Display options',
        'editor.positions': 'Positions',
        'editor.advanced': 'Advanced',
        'editor.compact_width': 'Compact width (px)',
        'editor.modern_width': 'Modern width (px)',
        'editor.custom_image_url': 'Custom image URL',
        'editor.aspect_ratio': 'Aspect ratio',
        'editor.state_value': 'State value',
        'editor.displayed_name': 'Displayed name',
        'editor.custom_image': 'Custom image',
        'editor.name_font_size': 'Name font size',
        'editor.state_font_size': 'State font size',
        'editor.last_changed_font_size': 'Last changed font size',
        'editor.card_background': 'Card background',
        'editor.transparent_background': 'Transparent background (Glass/Bio only)',
        'editor.show_particles': 'Show animated particles (Glass/Bio only)',
        'editor.show_geocoded_location': 'Show GPS address (geocoded location)',
        'editor.geocoded_location_description': 'Shows the human-readable address from GPS via sensor.xxx_geocoded_location. Only visible when the person is not home.',
        'editor.geocoded_location_entity': 'Geocoded location entity (auto-detected if empty)',
        'editor.maps_provider': 'Open in Maps on location click',
        'editor.maps_provider_description': 'When set, clicking the zone or address opens the map with GPS coordinates.',
        'editor.maps_provider_none': 'Disabled',
        'editor.state_entity': 'Custom state sensor',
        'editor.state_entity_description': 'Overrides the displayed location text (e.g. sensor.my_location). Home/away logic is unaffected.',
        'editor.show_device_2_battery': 'Second device battery (tablet/laptop)',
        'editor.device_2_battery_sensor': 'Second device battery sensor',
        'editor.device_2_battery_state_sensor': 'Second device charging state sensor',
        'wx.battery': 'Battery', 'wx.watch': 'Watch', 'wx.wind': 'Wind',
        'wx.humidity': 'Humidity', 'wx.network': 'Network', 'wx.activity': 'Activity',
        'wx.pressure': 'Press.', 'wx.feels': 'Feels like', 'wx.device2': 'Device 2',
        'editor.border_radius': 'Border radius',
        'editor.image_size': 'Image size (%)',
        'editor.modern_picture_size': 'Picture size (px)',
        'editor.modern_name_font_size': 'Name font size',
        'editor.modern_state_font_size': 'State font size',
        'editor.modern_show_battery_ring': 'Show battery ring',
        'editor.modern_show_travel_ring': 'Show travel time ring',
        'editor.modern_travel_max_time': 'Max travel time (min)',
        'editor.modern_distance_max': 'Max distance (km)',
        'editor.modern_ring_size': 'Ring size (px)',
        'editor.classic_icon_size': 'Icon size (px)',
        'editor.compact_icon_size': 'Icon size (px)',
        'editor.battery_font_size': 'Battery font size',
        'editor.activity_font_size': 'Activity font size',
        'editor.battery_state_sensor': 'Phone charging state sensor',
        'editor.battery_charging_value': 'Charging state value (optional)',
        'editor.watch_battery_state_sensor': 'Watch charging state sensor',
        'editor.watch_battery_charging_value': 'Watch charging state value (optional)',
        'editor.charging_helper': 'Leave empty for auto-detection (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatic Sensors',
        'section.sensors_description': 'Sensors are auto-detected from the mobile app linked to the person entity. Detected prefix:',
        'section.auto_detect_btn': 'Auto-detect sensors',
        'section.auto_detect_found': 'sensors found',
        'section.auto_detect_none': 'No matching sensors found',
        'section.element_positions': 'Element Positions',
        'section.positions_description': 'Configure the position of each element on the card. Available only in Classic layout.',
        'section.custom_states': 'Custom States',
        'section.states_description': 'Configure how the different person states are displayed',
        'section.card_style': 'Card Style Customization',
        'section.modern_options': 'Modern Layout Options',
        'section.classic_options': 'Classic Layout Options',
        'section.compact_options': 'Compact Layout Options',
        'section.neon_options': 'Neon Layout Options',
        'section.neon_description': 'Dark cyberpunk theme with animated glow ring and neon badges. Colors adapt automatically to person state (green = home, red = away).',
        'section.glass_options': 'Glass Layout Options',
        'section.glass_description': 'Dark glassmorphism theme with translucent chips, colored orbs and animated status dot. Accent color adapts automatically to the person\'s current zone.',
        'section.bio_options': 'Bioluminescence Layout Options',
        'section.bio_description': 'Deep ocean theme with animated bioluminescent orbs, rising particles and double pulse ring around the avatar. Accent color changes automatically with the zone.',
        'section.holo_options': 'Holographic 3D Layout Options',
        'section.holo_description': 'Holographic theme with a 3D tilted card, rotating rings around the avatar, animated scanner and iridescent shimmer background. Accent color changes with person state.',
        'section.weather': '🌤 Weather',
        'editor.show_weather': 'Show weather',
        'editor.weather_entity': 'Weather entity',
        'editor.show_weather_background': 'Show animated weather background',
        'editor.show_weather_temperature': 'Show conditions and temperature',
        'editor.weather_text_color': 'Weather text color',
        'editor.weather_text_color_description': 'Color of temperature, icon and condition label. Leave empty to use the layout default.',
        'editor.last_changed_color': 'Last updated text color',
        'editor.last_changed_color_description': 'Color of the last-updated timestamp. Leave empty to use the layout default.',
        'section.weather_description': 'Adds an animated weather background to the card (rain, snow, sun, stars, lightning…). Works on all layouts.',
        'section.travel_sensor_2': '🏢 Home ↔ Work Sensors',
        'section.travel_sensor_2_description': 'Sensor 1 (home→work): visible at home and in transit, hidden at work. Sensor 2 (work→home): visible at work and in transit, hidden at home. Disable smart mode to always show both.',
        'editor.travel_sensor_2': 'Travel time sensor (work → home)',
        'editor.zone_2': 'Work zone',
        'editor.show_travel_time_2': 'Show travel time (Work → Home)',
        'editor.smart_travel_mode': 'Smart mode (hide based on location)',
        'editor.pair_travel_animation': 'Alternating distance/time animation (if disabled, shows both separately)',
        'editor.distance_precision': 'Distance decimal places (0=integer, 1=one decimal, 2=two decimals)',
        'editor.distance_unit': 'Distance unit (e.g. km, mi)',
        'editor.distance_unit_description': 'Leave empty for auto-detection. For Waze/Google sensors use km or mi.',
        'editor.direction_home_work': 'Home → Work',
        'editor.direction_work_home': 'Work → Home',
        'editor.travel_sensor_home_work': 'Travel time sensor (Home → Work)',
        'editor.travel_sensor_work_home': 'Travel time sensor (Work → Home)',
        'editor.distance_sensor_home_work': 'Distance sensor (Home → Work)',
        'editor.distance_sensor_work_home': 'Distance sensor (Work → Home)',
        'editor.show_distance_2': 'Show distance',
        'section.distance_optional': '📍 Distance (Optional)',
        'section.distance_optional_description': 'Show distance in km. Always visible regardless of position.',
        'position.battery': 'Battery position',
        'position.watch_battery': 'Watch battery position',
        'position.activity': 'Activity position',
        'position.distance': 'Distance position',
        'position.travel': 'Travel time position',
        'position.connection': 'Connection position',
        'state.name_color': 'Name color',
        'state.add_state': 'Add State',
        'default_state.home': '🏡 Home',
        'default_state.away': '🏃‍♂️ Away from Home',
        'default_state.office': '🏢 Office',
        'default_state.unknown': '❓ Unknown',
        'state.default_states': 'Default States',
        'state.add_default_states': 'Add Default States',
        'tabs.base': 'Base',
        'tabs.layout': 'Layout',
        'tabs.display': 'Display',
        'tabs.positions': 'Positions',
        'tabs.states': 'States',
        'tabs.sensors': 'Sensors',
        'tabs.style': 'Style',
        'section.extra_chips': 'Custom extra chips',
        'editor.extra_chips_description': 'Add extra entities as chips (Bluetooth, Android Auto, call state, ringer mode…). With show_when the chip only appears when the state matches.',
        'editor.extra_chip_entity': 'Entity',
        'editor.extra_chip_show_when': 'Show when (state)',
        'editor.extra_chip_label': 'Label (optional)',
        'editor.extra_chip_color': 'Icon and text color',
        'editor.extra_chip_add': '+ Add chip',
        'editor.extra_chip_tap_action': 'Tap action',
        'editor.extra_chip_tap_more_info': 'Show info (more-info)',
        'editor.extra_chip_tap_call_service': 'Call service',
        'editor.extra_chip_tap_navigate': 'Navigate',
        'editor.extra_chip_tap_url': 'Open URL',
        'editor.extra_chip_tap_none': 'No action',
        'editor.extra_chip_icon_label': 'Icon (default: entity icon)',
        'editor.extra_chip_service': 'Service (e.g. light.turn_on)',
        'editor.extra_chip_service_data': 'Extra data (JSON, optional)',
        'editor.extra_chip_nav_path': 'Navigation path',
        'editor.extra_chip_url_path': 'URL',
        'editor.wifi_ssid_sensor': 'Wi-Fi SSID sensor',
        'editor.wifi_ssid_sensor_description': 'Sensor that reports the Wi-Fi network name the device is connected to (e.g. sensor.elliot_s_phone_wi_fi_connection). When set, the network name is shown instead of "WiFi".'
      },
      'fr': {
        'editor.entity': 'Entité',
        'editor.name': 'Nom (optionnel)',
        'editor.show_last_changed': 'Afficher dernière mise à jour',
        'editor.show_distance': 'Afficher distance',
        'editor.show_battery': 'Afficher batterie',
        'editor.show_speed': 'Afficher vitesse',
        'editor.show_direction': 'Afficher direction',
        'editor.show_accuracy': 'Afficher précision',
        'editor.show_gps_accuracy': 'Afficher précision GPS',
        'editor.show_altitude': 'Afficher altitude',
        'editor.show_source': 'Afficher source',
        'editor.show_entity_picture': 'Afficher image',
        'editor.show_name': 'Afficher l\'éat',
        'editor.show_person_name': 'Afficher nom de la personne',
        'editor.show_activity': 'Afficher activité',
        'editor.show_watch_battery': 'Afficher batterie montre',
        'editor.show_travel_time': 'Afficher temps de trajet',
        'editor.show_connection': 'Afficher connexion',
        'editor.custom_icon': 'Icône personnalisée',
        'editor.icon_color': "Couleur de l'icône",
        'editor.background_color': 'Couleur de fond',
        'editor.text_color': 'Couleur du texte',
        'editor.required': 'Requis',
        'editor.optional': 'Optionnel',
        'editor.layout': 'Disposition',
        'editor.appearance': 'Apparence',
        'editor.display_options': "Options d'affichage",
        'editor.positions': 'Positions',
        'editor.advanced': 'Avancé',
        'editor.show_last_updated': 'Afficher dernière mise à jour',
        'editor.compact_width': 'Largeur compacte (px)',
        'editor.modern_width': 'Largeur moderne (px)',
        'editor.custom_image_url': 'URL image personnalisée',
        'editor.aspect_ratio': 'Ratio d\'aspect',
        'editor.state_value': 'Valeur état',
        'editor.displayed_name': 'Nom affiché',
        'editor.custom_image': 'Image personnalisée',
        'editor.name_font_size': 'Taille police nom',
        'editor.state_font_size': 'Taille police état',
        'editor.last_changed_font_size': 'Taille police dernière mise à jour',
        'editor.card_background': 'Fond carte',
        'editor.transparent_background': 'Fond transparent (Glass/Bio uniquement)',
        'editor.show_particles': 'Afficher particules animées (Glass/Bio uniquement)',
        'editor.show_geocoded_location': 'Afficher adresse GPS (geocoded location)',
        'editor.geocoded_location_description': 'Affiche l\'adresse lisible obtenue via GPS grâce à sensor.xxx_geocoded_location. Visible uniquement quand la personne n\'est pas à la maison.',
        'editor.geocoded_location_entity': 'Entité geocoded location (auto-détectée si vide)',
        'editor.maps_provider': 'Ouvrir dans Maps au clic sur la position',
        'editor.maps_provider_description': 'Si défini, cliquer sur la zone ou l\'adresse ouvre la carte avec les coordonnées GPS.',
        'editor.maps_provider_none': 'Désactivé',
        'editor.state_entity': 'Capteur d\'état personnalisé',
        'editor.state_entity_description': 'Remplace le texte de localisation affiché. La logique home/away reste inchangée.',
        'editor.show_device_2_battery': 'Batterie 2e appareil (tablette/laptop)',
        'editor.device_2_battery_sensor': 'Capteur batterie 2e appareil',
        'editor.device_2_battery_state_sensor': 'Capteur état charge 2e appareil',
        'wx.battery': 'Batterie', 'wx.watch': 'Montre', 'wx.wind': 'Vent',
        'wx.humidity': 'Humidité', 'wx.network': 'Réseau', 'wx.activity': 'Activité',
        'wx.pressure': 'Press.', 'wx.feels': 'Ressenti',
        'editor.border_radius': 'Rayon bordure',
        'editor.image_size': 'Taille image (%)',
        'editor.modern_picture_size': 'Taille image (px)',
        'editor.modern_name_font_size': 'Taille police nom',
        'editor.modern_state_font_size': 'Taille police état',
        'editor.modern_show_battery_ring': 'Afficher anneau batterie',
        'editor.modern_show_travel_ring': 'Afficher anneau temps trajet',
        'editor.modern_travel_max_time': 'Temps trajet max (min)',
        'editor.modern_distance_max': 'Distance max (km)',
        'editor.modern_ring_size': 'Taille anneaux (px)',
        'editor.classic_icon_size': 'Taille icônes (px)',
        'editor.compact_icon_size': 'Taille icônes (px)',
        'editor.battery_font_size': 'Taille police batterie',
        'editor.activity_font_size': 'Taille police activité',
        'editor.battery_state_sensor': 'Capteur état charge téléphone',
        'editor.battery_charging_value': 'Valeur état en charge (optionnel)',
        'editor.watch_battery_state_sensor': 'Capteur état charge montre',
        'editor.watch_battery_charging_value': 'Valeur état en charge montre (optionnel)',
        'editor.charging_helper': 'Laisser vide pour détection auto (charging, full, on, true...)',
        'section.automatic_sensors': 'Capteurs Automatiques',
        'section.sensors_description': 'Les capteurs sont détectés automatiquement depuis l\'app mobile liée à l\'entité personne. Préfixe détecté:',
        'section.auto_detect_btn': 'Détecter automatiquement',
        'section.auto_detect_found': 'capteurs trouvés',
        'section.auto_detect_none': 'Aucun capteur trouvé',
        'section.element_positions': 'Positions éléments',
        'section.positions_description': 'Configurer la position de chaque élément sur la carte. Disponible uniquement en mode Classic.',
        'section.custom_states': 'États Personnalisés',
        'section.states_description': 'Configurer comment les différents états de la personne sont affichés',
        'section.card_style': 'Personnalisation Style Carte',
        'section.modern_options': 'Options Layout Moderne',
        'section.classic_options': 'Options Layout Classic',
        'section.compact_options': 'Options Layout Compact',
        'section.neon_options': 'Options Layout Néon',
        'section.neon_description': 'Thème cyberpunk sombre avec anneau lumineux animé et badges neon. Les couleurs s\'adaptent automatiquement à l\'état de la personne (vert = maison, rouge = absent).',
        'section.glass_options': 'Options Layout Glass',
        'section.glass_description': 'Thème glassmorphisme sombre avec chips translucides, orbes colorés et point de statut animé. La couleur accent s\'adapte automatiquement à la zone actuelle.',
        'section.bio_options': 'Options Layout Bioluminescence',
        'section.bio_description': 'Thème océan profond avec orbes bioluminescents animés, particules montantes et double anneau pulsant autour de l\'avatar. La couleur accent change automatiquement avec la zone.',
        'section.holo_options': 'Options Layout Holographique 3D',
        'section.holo_description': 'Thème holographique avec carte inclinée en 3D, anneaux rotatifs autour de l\'avatar, scanner animé et fond shimmer iridescent. La couleur accent change avec l\'état de la personne.',
        'section.weather': '🌤 Météo',
        'editor.show_weather': 'Afficher météo',
        'editor.weather_entity': 'Entité météo',
        'editor.show_weather_background': 'Afficher fond météo animé',
        'editor.show_weather_temperature': 'Afficher conditions et température',
        'editor.weather_text_color': 'Couleur du texte météo',
        'editor.weather_text_color_description': 'Couleur de la température, de l\'icône et de la condition. Laissez vide pour la couleur par défaut du layout.',
        'editor.last_changed_color': 'Couleur du texte de mise à jour',
        'editor.last_changed_color_description': 'Couleur du timestamp de dernière mise à jour. Laissez vide pour la couleur par défaut.',
        'section.weather_description': 'Ajoute un fond animé à la carte (pluie, neige, soleil, étoiles, foudre…). Fonctionne sur tous les layouts.',
        'section.travel_sensor_2': '🏢 Capteurs Maison ↔ Travail',
        'section.travel_sensor_2_description': 'Capteur 1 (maison→travail): visible à la maison et en transit, masqué au travail. Capteur 2 (travail→maison): visible au travail et en transit, masqué à la maison. Désactivez le mode smart pour toujours afficher les deux.',
        'editor.travel_sensor_2': 'Capteur temps de trajet (travail → maison)',
        'editor.zone_2': 'Zone travail',
        'editor.show_travel_time_2': 'Afficher temps trajet (Travail → Maison)',
        'editor.smart_travel_mode': 'Mode smart (masquer selon la position)',
        'editor.pair_travel_animation': 'Animation alternée distance/temps (si désactivée, affiche les deux séparément)',
        'editor.distance_precision': 'Décimales distance (0=entier, 1=une décimale, 2=deux décimales)',
        'editor.distance_unit': 'Unité de distance (ex. km, mi)',
        'editor.distance_unit_description': 'Laisser vide pour détection auto. Pour Waze/Google utiliser km ou mi.',
        'editor.direction_home_work': 'Maison → Travail',
        'editor.direction_work_home': 'Travail → Maison',
        'editor.travel_sensor_home_work': 'Capteur temps trajet (Maison → Travail)',
        'editor.travel_sensor_work_home': 'Capteur temps trajet (Travail → Maison)',
        'editor.distance_sensor_home_work': 'Capteur distance (Maison → Travail)',
        'editor.distance_sensor_work_home': 'Capteur distance (Travail → Maison)',
        'editor.show_distance_2': 'Afficher distance',
        'section.distance_optional': '📍 Distance (Optionnel)',
        'section.distance_optional_description': 'Afficher la distance en km. Toujours visible quelle que soit la position.',
        'position.battery': 'Position batterie',
        'position.watch_battery': 'Position batterie montre',
        'position.activity': 'Position activité',
        'position.distance': 'Position distance',
        'position.travel': 'Position temps trajet',
        'position.connection': 'Position connexion',
        'state.name_color': 'Couleur nom',
        'state.add_state': 'Ajouter État',
        'default_state.home': '🏡 Maison',
        'default_state.away': '🏃‍♂️ Absent de la Maison',
        'default_state.office': '🏢 Bureau',
        'default_state.unknown': '❓ Inconnu',
        'state.default_states': 'États par Défaut',
        'state.add_default_states': 'Ajouter états par Défaut',
        'tabs.base': 'Base',
        'tabs.layout': 'Disposition',
        'tabs.display': 'Affichage',
        'tabs.positions': 'Positions',
        'tabs.states': 'États',
        'tabs.sensors': 'Capteurs',
        'tabs.style': 'Style',
        'section.extra_chips': 'Chips supplémentaires personnalisés',
        'editor.extra_chips_description': 'Ajoutez des entités supplémentaires comme chips. Avec show_when le chip n\'apparaît que lorsque l\'état correspond.',
        'editor.extra_chip_entity': 'Entité',
        'editor.extra_chip_show_when': 'Afficher quand (état)',
        'editor.extra_chip_label': 'Étiquette (optionnel)',
        'editor.extra_chip_color': 'Couleur icône et texte',
        'editor.extra_chip_add': '+ Ajouter chip',
        'editor.extra_chip_tap_action': 'Action au toucher',
        'editor.extra_chip_tap_more_info': 'Afficher infos (more-info)',
        'editor.extra_chip_tap_call_service': 'Appeler service',
        'editor.extra_chip_tap_navigate': 'Naviguer',
        'editor.extra_chip_tap_url': 'Ouvrir URL',
        'editor.extra_chip_tap_none': 'Aucune action',
        'editor.extra_chip_icon_label': 'Icône (défaut: icône entité)',
        'editor.extra_chip_service': 'Service (ex. light.turn_on)',
        'editor.extra_chip_service_data': 'Données extra (JSON, optionnel)',
        'editor.extra_chip_nav_path': 'Chemin de navigation',
        'editor.extra_chip_url_path': 'URL',
        'editor.wifi_ssid_sensor': 'Capteur SSID Wi-Fi',
        'editor.wifi_ssid_sensor_description': 'Capteur indiquant le nom du réseau Wi-Fi auquel l\'appareil est connecté. Quand configuré, le nom du réseau s\'affiche à la place de "WiFi".'
      },
      'de': {
        'editor.entity': 'Entität',
        'editor.name': 'Name (optional)',
        'editor.show_last_changed': 'Letzte Änderung anzeigen',
        'editor.show_distance': 'Entfernung anzeigen',
        'editor.show_battery': 'Batterie anzeigen',
        'editor.show_speed': 'Geschwindigkeit anzeigen',
        'editor.show_direction': 'Richtung anzeigen',
        'editor.show_accuracy': 'Genauigkeit anzeigen',
        'editor.show_gps_accuracy': 'GPS-Genauigkeit anzeigen',
        'editor.show_altitude': 'Höhe anzeigen',
        'editor.show_source': 'Quelle anzeigen',
        'editor.show_entity_picture': 'Bild anzeigen',
        'editor.show_name': 'Status anzeigen',
        'editor.show_person_name': 'Personenname anzeigen',
        'editor.show_activity': 'Aktivität anzeigen',
        'editor.show_watch_battery': 'Uhr-Batterie anzeigen',
        'editor.show_travel_time': 'Reisezeit anzeigen',
        'editor.show_connection': 'Verbindung anzeigen',
        'editor.custom_icon': 'Benutzerdefiniertes Symbol',
        'editor.icon_color': 'Symbolfarbe',
        'editor.background_color': 'Hintergrundfarbe',
        'editor.text_color': 'Textfarbe',
        'editor.required': 'Erforderlich',
        'editor.optional': 'Optional',
        'editor.layout': 'Layout',
        'editor.appearance': 'Erscheinungsbild',
        'editor.display_options': 'Anzeigeoptionen',
        'editor.positions': 'Positionen',
        'editor.advanced': 'Erweitert',
        'editor.show_last_updated': 'Letzte Aktualisierung anzeigen',
        'editor.compact_width': 'Kompakte Breite (px)',
        'editor.modern_width': 'Moderne Breite (px)',
        'editor.custom_image_url': 'Benutzerdefinierte Bild-URL',
        'editor.aspect_ratio': 'Seitenverhältnis',
        'editor.state_value': 'Statuswert',
        'editor.displayed_name': 'Angezeigter Name',
        'editor.custom_image': 'Benutzerdefiniertes Bild',
        'editor.name_font_size': 'Schriftgröße Name',
        'editor.state_font_size': 'Schriftgröße Status',
        'editor.last_changed_font_size': 'Schriftgröße Letzte Änderung',
        'editor.card_background': 'Kartenhintergrund',
        'editor.transparent_background': 'Transparenter Hintergrund (nur Glass/Bio)',
        'editor.show_particles': 'Animierte Partikel anzeigen (nur Glass/Bio)',
        'editor.show_geocoded_location': 'GPS-Adresse anzeigen (Geocoded Location)',
        'editor.geocoded_location_description': 'Zeigt die lesbare GPS-Adresse via sensor.xxx_geocoded_location an. Nur sichtbar wenn die Person nicht zu Hause ist.',
        'editor.geocoded_location_entity': 'Geocoded-Location-Entität (auto-erkannt wenn leer)',
        'editor.maps_provider': 'In Maps öffnen beim Klick auf Position',
        'editor.maps_provider_description': 'Wenn gesetzt, öffnet ein Klick auf Zone oder Adresse die Karte mit GPS-Koordinaten.',
        'editor.maps_provider_none': 'Deaktiviert',
        'editor.state_entity': 'Benutzerdefinierter Statussensor',
        'editor.state_entity_description': 'Überschreibt den angezeigten Standorttext. Die Home/Away-Logik bleibt unverändert.',
        'editor.show_device_2_battery': 'Zweitgerät-Akku (Tablet/Laptop)',
        'editor.device_2_battery_sensor': 'Akku-Sensor Zweitgerät',
        'editor.device_2_battery_state_sensor': 'Ladestatus-Sensor Zweitgerät',
        'wx.battery': 'Batterie', 'wx.watch': 'Uhr', 'wx.wind': 'Wind',
        'wx.humidity': 'Luftfeuchte', 'wx.network': 'Netzwerk', 'wx.activity': 'Aktivität',
        'wx.pressure': 'Druck', 'wx.feels': 'Gefühlt', 'wx.device2': 'Gerät 2',
        'editor.border_radius': 'Randradius',
        'editor.image_size': 'Bildgröße (%)',
        'editor.modern_picture_size': 'Bildgröße (px)',
        'editor.modern_name_font_size': 'Schriftgröße Name',
        'editor.modern_state_font_size': 'Schriftgröße Status',
        'editor.modern_show_battery_ring': 'Batteriering anzeigen',
        'editor.modern_show_travel_ring': 'Reisezeitring anzeigen',
        'editor.modern_travel_max_time': 'Max Reisezeit (min)',
        'editor.modern_distance_max': 'Max Entfernung (km)',
        'editor.modern_ring_size': 'Ringgröße (px)',
        'editor.classic_icon_size': 'Symbolgröße (px)',
        'editor.compact_icon_size': 'Symbolgröße (px)',
        'editor.battery_font_size': 'Schriftgröße Batterie',
        'editor.activity_font_size': 'Schriftgröße Aktivität',
        'editor.battery_state_sensor': 'Telefon-Ladezustandssensor',
        'editor.battery_charging_value': 'Ladezustandswert (optional)',
        'editor.watch_battery_state_sensor': 'Uhr-Ladezustandssensor',
        'editor.watch_battery_charging_value': 'Uhr-Ladezustandswert (optional)',
        'editor.charging_helper': 'Leer lassen für Auto-Erkennung (charging, full, on, true...)',
        'section.automatic_sensors': 'Automatische Sensoren',
        'section.sensors_description': 'Sensoren werden automatisch aus der mit der Personenentität verknüpften mobilen App erkannt. Erkanntes Präfix:',
        'section.auto_detect_btn': 'Automatisch erkennen',
        'section.auto_detect_found': 'Sensoren gefunden',
        'section.auto_detect_none': 'Keine passenden Sensoren gefunden',
        'section.element_positions': 'Elementpositionen',
        'section.positions_description': 'Konfigurieren Sie die Position jedes Elements auf der Karte. Nur im Classic-Layout verfügbar.',
        'section.custom_states': 'Benutzerdefinierte Zustände',
        'section.states_description': 'Konfigurieren Sie, wie die verschiedenen Personenzustände angezeigt werden',
        'section.card_style': 'Karten-Stil Anpassung',
        'section.modern_options': 'Moderne Layout-Optionen',
        'section.classic_options': 'Classic Layout-Optionen',
        'section.compact_options': 'Compact Layout-Optionen',
        'section.neon_options': 'Neon Layout-Optionen',
        'section.neon_description': 'Dunkles Cyberpunk-Thema mit animiertem Leuchtring und Neon-Badges. Farben passen sich automatisch dem Personenstatus an (grün = zuhause, rot = abwesend).',
        'section.glass_options': 'Glass Layout-Optionen',
        'section.glass_description': 'Dunkles Glassmorphismus-Thema mit durchscheinenden Chips, farbigen Orbs und animiertem Statuspunkt. Die Akzentfarbe passt sich automatisch der aktuellen Zone an.',
        'section.bio_options': 'Biolumineszenz Layout-Optionen',
        'section.bio_description': 'Tiefsee-Thema mit animierten biolumineszenten Orbs, aufsteigenden Partikeln und doppeltem Pulsring um den Avatar. Die Akzentfarbe ändert sich automatisch mit der Zone.',
        'section.holo_options': 'Holographic 3D Layout-Optionen',
        'section.holo_description': 'Holografisches Thema mit 3D-geneigter Karte, rotierenden Ringen um den Avatar, animiertem Scanner und irisierendem Shimmer-Hintergrund. Die Akzentfarbe ändert sich mit dem Personenstatus.',
        'section.weather': '🌤 Wetter',
        'editor.show_weather': 'Wetter anzeigen',
        'editor.weather_entity': 'Wetterentität',
        'editor.show_weather_background': 'Animierten Wetterhintergrund anzeigen',
        'editor.show_weather_temperature': 'Bedingungen und Temperatur anzeigen',
        'editor.weather_text_color': 'Wettertext-Farbe',
        'editor.weather_text_color_description': 'Farbe für Temperatur, Symbol und Wetterbedingung. Leer lassen für die Standard-Layout-Farbe.',
        'editor.last_changed_color': 'Farbe des Aktualisierungstexts',
        'editor.last_changed_color_description': 'Farbe des Zeitstempels der letzten Aktualisierung. Leer lassen für die Standard-Farbe.',
        'section.weather_description': 'Fügt der Karte einen animierten Wetterhintergrund hinzu (Regen, Schnee, Sonne, Sterne, Blitze…). Funktioniert auf allen Layouts.',
        'section.travel_sensor_2': '🏢 Zuhause ↔ Arbeit Sensoren',
        'section.travel_sensor_2_description': 'Sensor 1 (zuhause→arbeit): sichtbar zuhause und unterwegs, versteckt bei der Arbeit. Sensor 2 (arbeit→zuhause): sichtbar bei der Arbeit und unterwegs, versteckt zuhause. Smart-Modus deaktivieren um immer beide anzuzeigen.',
        'editor.travel_sensor_2': 'Reisezeitssensor (Arbeit → Zuhause)',
        'editor.zone_2': 'Arbeitszone',
        'editor.show_travel_time_2': 'Reisezeit anzeigen (Arbeit → Zuhause)',
        'editor.smart_travel_mode': 'Smart-Modus (je nach Standort ausblenden)',
        'editor.pair_travel_animation': 'Abwechselnde Entfernung/Zeit-Animation (deaktiviert = beide separat anzeigen)',
        'editor.distance_precision': 'Entfernungs-Dezimalstellen (0=ganz, 1=eine, 2=zwei)',
        'editor.distance_unit': 'Entfernungseinheit (z.B. km, mi)',
        'editor.distance_unit_description': 'Leer lassen für Auto-Erkennung. Für Waze/Google km oder mi verwenden.',
        'editor.direction_home_work': 'Zuhause → Arbeit',
        'editor.direction_work_home': 'Arbeit → Zuhause',
        'editor.travel_sensor_home_work': 'Reisezeitssensor (Zuhause → Arbeit)',
        'editor.travel_sensor_work_home': 'Reisezeitssensor (Arbeit → Zuhause)',
        'editor.distance_sensor_home_work': 'Entfernungssensor (Zuhause → Arbeit)',
        'editor.distance_sensor_work_home': 'Entfernungssensor (Arbeit → Zuhause)',
        'editor.show_distance_2': 'Entfernung anzeigen',
        'section.distance_optional': '📍 Entfernung (Optional)',
        'section.distance_optional_description': 'Entfernung in km anzeigen. Immer sichtbar unabhängig vom Standort.',
        'position.battery': 'Batterieposition',
        'position.watch_battery': 'Uhr-Batterieposition',
        'position.activity': 'Aktivitätsposition',
        'position.distance': 'Entfernungsposition',
        'position.travel': 'Reisezeitposition',
        'position.connection': 'Verbindungsposition',
        'state.name_color': 'Namensfarbe',
        'state.add_state': 'Zustand Hinzufügen',
        'default_state.home': '🏡 Zuhause',
        'default_state.away': '🏃‍♂️ Nicht Zuhause',
        'default_state.office': '🏢 Büro',
        'default_state.unknown': '❓ Unbekannt',
        'state.default_states': 'Standardzustände',
        'state.add_default_states': 'Standardzustände Hinzufügen',
        'tabs.base': 'Basis',
        'tabs.layout': 'Layout',
        'tabs.display': 'Anzeige',
        'tabs.positions': 'Positionen',
        'tabs.states': 'Zustände',
        'tabs.sensors': 'Sensoren',
        'tabs.style': 'Stil',
        'section.extra_chips': 'Benutzerdefinierte Extra-Chips',
        'editor.extra_chips_description': 'Fügen Sie zusätzliche Entitäten als Chips hinzu. Mit show_when erscheint der Chip nur, wenn der Status übereinstimmt.',
        'editor.extra_chip_entity': 'Entität',
        'editor.extra_chip_show_when': 'Anzeigen wenn (Status)',
        'editor.extra_chip_label': 'Bezeichnung (optional)',
        'editor.extra_chip_color': 'Symbol- und Textfarbe',
        'editor.extra_chip_add': '+ Chip hinzufügen',
        'editor.extra_chip_tap_action': 'Tippen-Aktion',
        'editor.extra_chip_tap_more_info': 'Info anzeigen (more-info)',
        'editor.extra_chip_tap_call_service': 'Dienst aufrufen',
        'editor.extra_chip_tap_navigate': 'Navigieren',
        'editor.extra_chip_tap_url': 'URL öffnen',
        'editor.extra_chip_tap_none': 'Keine Aktion',
        'editor.extra_chip_icon_label': 'Symbol (Standard: Entitätssymbol)',
        'editor.extra_chip_service': 'Dienst (z.B. light.turn_on)',
        'editor.extra_chip_service_data': 'Zusatzdaten (JSON, optional)',
        'editor.extra_chip_nav_path': 'Navigationspfad',
        'editor.extra_chip_url_path': 'URL',
        'editor.wifi_ssid_sensor': 'WLAN-SSID-Sensor',
        'editor.wifi_ssid_sensor_description': 'Sensor, der den Namen des WLAN-Netzwerks meldet, mit dem das Gerät verbunden ist. Wenn gesetzt, wird der Netzwerkname statt "WiFi" angezeigt.'
      }
    };
  }

  localize(key) {
    const langTranslations = this.translations[this.currentLanguage];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }

    const defaultTranslations = this.translations['en'];
    if (defaultTranslations && defaultTranslations[key]) {
      return defaultTranslations[key];
    }

    return key;
  }
}

class PersonTrackerCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _helpers: {},
      _selectedTab: { type: String }
    };
  }

  constructor() {
    super();
    this._selectedTab = 'base';
    this._localize = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Fix #20: load ha-entity-picker by requesting config element of hui-glance-card
    // hui-glance-card depends on ha-entity-picker, so this forces it to load.
    // See: https://community.home-assistant.io/t/re-using-existing-frontend-components-in-lovelace-card-editor/103415
    if (!customElements.get('ha-entity-picker')) {
      const GlanceCard = customElements.get('hui-glance-card');
      if (GlanceCard) {
        await GlanceCard.getConfigElement();
      } else {
        // hui-glance-card not yet registered — wait for it (with 3s timeout)
        await Promise.race([
          customElements.whenDefined('hui-glance-card').then(async () => {
            const Card = customElements.get('hui-glance-card');
            if (Card) await Card.getConfigElement();
          }),
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
      }
      this.requestUpdate();
    }
  }

  _initLocalization() {
    if (this.hass && !this._localize) {
      this._localize = new EditorLocalizationHelper(this.hass);
    }
  }

  _t(key) {
    this._initLocalization();
    return this._localize ? this._localize.localize(key) : key;
  }

  setConfig(config) {
    this._config = {
      layout: 'classic',
      compact_width: 300,
      modern_width: 300,
      show_entity_picture: true,
      show_person_name: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_watch_battery: true,
      show_activity: true,
      show_distance: true,
      show_travel_time: true,
      show_connection: true,
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      battery_font_size: '13px',
      watch_battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      // Modern layout defaults
      modern_picture_size: 40,
      modern_name_font_size: '14px',
      modern_state_font_size: '12px',
      modern_show_battery_ring: true,
      modern_show_travel_ring: true,
      modern_travel_max_time: 60,
      modern_distance_max: 100,
      // Geocoded location on by default
      show_geocoded_location: true,
      ...config
    };

    // fallback for positions
    const positionDefaults = {
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right'
    };

    for (const key in positionDefaults) {
      if (!this._config[key]) {
        this._config[key] = positionDefaults[key];
      }
    }

    if (!this._config.triggers_update) {
      this._config.triggers_update = 'all';
    }
  }


  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }

      .editor-version-badge {
        font-size: 10px;
        color: var(--secondary-text-color, #888);
        text-align: right;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }
      .editor-version-badge span {
        font-weight: 700;
        color: var(--primary-color, #03a9f4);
      }

      .tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--divider-color);
      }

      .tab {
        padding: 8px 16px;
        cursor: pointer;
        background: none;
        border: none;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tab:hover {
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
      }

      .tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
      }

      .section {
        margin-bottom: 24px;
      }

      .section-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .config-row {
        display: flex;
        align-items: center;
        padding: 8px 0;
        min-height: 40px;
      }

      .config-row ha-switch {
        margin-left: auto;
      }

      .config-row ha-textfield,
      .config-row ha-select {
        width: 100%;
      }

      .config-label {
        flex: 1;
      }

      .config-value {
        flex: 2;
        margin-left: 16px;
      }

      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      ha-entity-picker {
        display: block;
        margin: 8px 0;
      }

      ha-textfield {
        display: block;
        margin: 8px 0;
      }

      ha-select {
        display: block;
        margin: 8px 0;
        width: 100%;
      }

      .sensor-group {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .sensor-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .sensor-icon {
        margin-right: 8px;
        color: var(--primary-color);
      }

      .sensor-title {
        font-weight: 500;
        flex: 1;
      }

      .state-item {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
      }

      .state-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      mwc-button {
        margin-top: 8px;
      }

      .add-button {
        width: 100%;
      }

      .remove-button {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--error-color);
      }

      .preview-box {
        background: var(--secondary-background-color);
        border-radius: 8px;
        padding: 12px;
        margin: 16px 0;
      }

      .preview-title {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .color-picker {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        cursor: pointer;
        position: relative;
      }

      input[type="color"] {
        opacity: 0;
        position: absolute;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }

      .info-text {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        line-height: 1.4;
      }

      .auto-detect-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0 4px;
      }

      .auto-detect-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        background: var(--primary-color);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
        transition: opacity 0.2s;
        white-space: nowrap;
      }
      .auto-detect-btn:hover:not(:disabled) { opacity: 0.82; }
      .auto-detect-btn:disabled { opacity: 0.40; cursor: not-allowed; }
      .auto-detect-btn ha-icon { --mdc-icon-size: 15px; }

      .auto-detect-msg {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .position-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      pre {
        font-size: 11px;
        overflow-x: auto;
        background: var(--card-background-color);
        padding: 8px;
        border-radius: 4px;
      }

      @media (max-width: 600px) {
        .tabs {
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .two-column {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="editor-version-badge">Person Tracker Card <span>v1.4.12</span></div>
        <div class="tabs">
          <button
            class="tab ${this._selectedTab === 'base' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'base'}">
            <ha-icon icon="mdi:card-account-details"></ha-icon>
            ${this._t('tabs.base')}
          </button>
          <button
            class="tab ${this._selectedTab === 'sensors' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'sensors'}">
            <ha-icon icon="mdi:leak"></ha-icon>
            ${this._t('tabs.sensors')}
          </button>
          ${this._config.layout === 'classic' ? html`
            <button
              class="tab ${this._selectedTab === 'position' ? 'active' : ''}"
              @click="${() => this._selectedTab = 'position'}">
              <ha-icon icon="mdi:grid"></ha-icon>
              ${this._t('tabs.positions')}
            </button>
          ` : ''}
          <button
            class="tab ${this._selectedTab === 'states' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'states'}">
            <ha-icon icon="mdi:palette"></ha-icon>
            ${this._t('tabs.states')}
          </button>
          <button
            class="tab ${this._selectedTab === 'style' ? 'active' : ''}"
            @click="${() => this._selectedTab = 'style'}">
            <ha-icon icon="mdi:brush"></ha-icon>
            ${this._t('tabs.style')}
          </button>
        </div>

        ${this._selectedTab === 'base' ? this._renderBaseTab() : ''}
        ${this._selectedTab === 'sensors' ? this._renderSensorsTab() : ''}
        ${this._selectedTab === 'position' ? this._renderPositionTab() : ''}
        ${this._selectedTab === 'states' ? this._renderStatesTab() : ''}
        ${this._selectedTab === 'style' ? this._renderStyleTab() : ''}
      </div>
    `;
  }

  _renderBaseTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    const entityValue = this._config.entity || '';

    return html`
      <div class="section">
        <div class="section-title">${this._t('tabs.base')}</div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${entityValue}
          .label=${this._t('editor.entity') + ' (' + this._t('editor.required') + ')'}
          .includeDomains=${['person']}
          .required=${true}
          @value-changed=${(e) => this._valueChanged(e, 'entity')}>
        </ha-entity-picker>

        <ha-select
          label="${this._t('editor.layout')}"
          .value=${this._config.layout || 'classic'}
          @request-selected=${(e) => this._handleLayoutChange(e)}>
          <mwc-list-item value="classic">Classic</mwc-list-item>
          <mwc-list-item value="compact">Compact</mwc-list-item>
          <mwc-list-item value="modern">Modern</mwc-list-item>
          <mwc-list-item value="neon">Neon ✦</mwc-list-item>
          <mwc-list-item value="glass">Glass ◈</mwc-list-item>
          <mwc-list-item value="bio">Bioluminescence ◉</mwc-list-item>
          <mwc-list-item value="holo">Holographic 3D ◈</mwc-list-item>
          <mwc-list-item value="wxstation">Weather Station ⛅</mwc-list-item>
          <mwc-list-item value="matrix">Matrix Rain 🖥️</mwc-list-item>
          <mwc-list-item value="orbital">Orbital 🪐</mwc-list-item>
          <mwc-list-item value="ink">Liquid Ink 🖋️</mwc-list-item>
        </ha-select>

        ${this._config.layout === 'compact' ? html`
          <ha-textfield
            label="${this._t('editor.compact_width')}"
            type="number"
            min="200"
            max="500"
            .value=${this._config.compact_width || '300'}
            @input=${(e) => this._valueChanged(e, 'compact_width')}
            helper-text="Maximum width in pixels (default: 300px)">
          </ha-textfield>
        ` : ''}

        ${this._config.layout === 'modern' ? html`
          <ha-textfield
            label="${this._t('editor.modern_width')}"
            type="number"
            min="200"
            max="500"
            .value=${this._config.modern_width || '300'}
            @input=${(e) => this._valueChanged(e, 'modern_width')}
            helper-text="Maximum width in pixels (default: 300px)">
          </ha-textfield>
        ` : ''}

        <ha-textfield
          label="${this._t('editor.name')}"
          .value=${this._config.name || ''}
          @input=${(e) => this._valueChanged(e, 'name')}>
        </ha-textfield>

        <ha-textfield
          label="${this._t('editor.custom_image_url')}"
          .value=${this._config.entity_picture || ''}
          @input=${(e) => this._valueChanged(e, 'entity_picture')}
          helper-text="E.g.: /local/photos/mario.jpg">
        </ha-textfield>

        ${this._config.layout === 'classic' ? html`
          <ha-textfield
            label="${this._t('editor.aspect_ratio')}"
            .value=${this._config.aspect_ratio || '1/0.7'}
            @input=${(e) => this._valueChanged(e, 'aspect_ratio')}
            helper-text="Format: width/height (e.g., 1/0.7)">
          </ha-textfield>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">${this._t('editor.display_options')}</div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_entity_picture')}</span>
          <ha-switch
            .checked=${this._config.show_entity_picture !== false}
            @change=${(e) => this._valueChanged(e, 'show_entity_picture')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_person_name')}</span>
          <ha-switch
            .checked=${this._config.show_person_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_person_name')}>
          </ha-switch>
        </div>

        <div class="config-row">
          <span class="config-label">${this._t('editor.show_name')}</span>
          <ha-switch
            .checked=${this._config.show_name !== false}
            @change=${(e) => this._valueChanged(e, 'show_name')}>
          </ha-switch>
        </div>

        ${this._config.layout !== 'modern' ? html`
          <div class="config-row">
            <span class="config-label">${this._t('editor.show_last_updated')}</span>
            <ha-switch
              .checked=${this._config.show_last_changed !== false}
              @change=${(e) => this._valueChanged(e, 'show_last_changed')}>
            </ha-switch>
          </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">Tap Action</div>

        <ha-select
          label="On tap"
          .value=${this._config.tap_action?.action || 'more-info'}
          @request-selected=${(e) => this._handleTapActionChange(e)}>
          <mwc-list-item value="more-info">More Info (default)</mwc-list-item>
          <mwc-list-item value="navigate">Navigate</mwc-list-item>
          <mwc-list-item value="url">Open URL</mwc-list-item>
          <mwc-list-item value="call-service">Call Service</mwc-list-item>
          <mwc-list-item value="none">None</mwc-list-item>
        </ha-select>

        ${(this._config.tap_action?.action === 'more-info') ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.tap_action?.entity || ''}
            label="Entity (leave empty for person entity)"
            allow-custom-entity
            @value-changed=${(e) => this._updateTapAction('entity', e.detail?.value || '')}>
          </ha-entity-picker>
        ` : ''}

        ${(this._config.tap_action?.action === 'navigate') ? html`
          <ha-textfield
            label="Navigation path (e.g. /lovelace/home)"
            .value=${this._config.tap_action?.navigation_path || ''}
            @input=${(e) => this._updateTapAction('navigation_path', e.target.value)}>
          </ha-textfield>
        ` : ''}

        ${(this._config.tap_action?.action === 'url') ? html`
          <ha-textfield
            label="URL"
            .value=${this._config.tap_action?.url_path || ''}
            @input=${(e) => this._updateTapAction('url_path', e.target.value)}>
          </ha-textfield>
        ` : ''}

        ${(this._config.tap_action?.action === 'call-service') ? html`
          <ha-service-control
            .hass=${this.hass}
            .value=${{
              action: this._config.tap_action?.service || '',
              target: this._config.tap_action?.target || {},
              data: this._config.tap_action?.service_data || {}
            }}
            .showAdvanced=${true}
            @value-changed=${(e) => {
              const v = e.detail.value || {};
              this._config = {
                ...this._config,
                tap_action: {
                  action: 'call-service',
                  service: v.action || v.service || undefined,
                  target: (v.target && Object.keys(v.target).length) ? v.target : undefined,
                  service_data: (v.data && Object.keys(v.data).length) ? v.data : undefined
                }
              };
              this._fireEvent('config-changed', { config: this._config });
              this.requestUpdate();
            }}>
          </ha-service-control>
        ` : ''}
      </div>
    `;
  }


  _handleTapActionChange(ev) {
    if (!this._config || !this.hass) return;
    ev.stopPropagation();
    const value = ev.target && ev.target.getAttribute ? ev.target.getAttribute('value') : null;
    if (!value) return;
    this._config = { ...this._config, tap_action: { action: value } };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateTapAction(key, value) {
    const tapAction = { ...(this._config.tap_action || { action: 'more-info' }), [key]: value };
    this._config = { ...this._config, tap_action: tapAction };
    this._fireEvent('config-changed', { config: this._config });
  }

  _renderSensorsTab() {
    const entityBase = this._config.entity
      ? this._config.entity.replace('person.', '')
      : 'example';
    const p = this._config.entity ? this._resolveDevicePrefixEditor() : null;
    const auto = this._config.entity ? this._getAutoSensorIds() : {};

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.automatic_sensors')}</div>
        <p class="info-text">
          ${this._t('section.sensors_description')}${p ? `sensor.${p}_*` : `sensor.phone_${entityBase}_* / sensor.watch_${entityBase}_*`}
        </p>
        <div class="auto-detect-row">
          <button class="auto-detect-btn"
            ?disabled=${!this._config?.entity}
            @click=${() => this._autoDetectSensors()}>
            <ha-icon icon="mdi:radar"></ha-icon>
            ${this._t('section.auto_detect_btn')}
          </button>
          ${this._autoDetectMsg ? html`<span class="auto-detect-msg">${this._autoDetectMsg}</span>` : ''}
        </div>

        <!-- Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:battery" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_battery')}</span>
            <ha-switch
              .checked=${this._config.show_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_battery')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_sensor || auto.battery_sensor || ''}
            .label=${auto.battery_sensor || 'sensor.phone_' + entityBase + '_battery_level'}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'battery_sensor')}>
          </ha-entity-picker>

          <!-- Battery charging state sensor -->
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.battery_state_sensor || auto.battery_state_sensor || ''}
            .label=${auto.battery_state_sensor || 'sensor.phone_' + entityBase + '_battery_state'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'battery_state_sensor')}>
          </ha-entity-picker>

          <ha-textfield
            .value=${this._config.battery_charging_value || ''}
            .label=${this._t('editor.battery_charging_value')}
            .helper=${this._t('editor.charging_helper')}
            @input=${(e) => this._valueChanged(e, 'battery_charging_value')}>
          </ha-textfield>
        </div>

        <!-- Watch Battery -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:watch" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_watch_battery')}</span>
            <ha-switch
              .checked=${this._config.show_watch_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_watch_battery')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.watch_battery_sensor || auto.watch_battery_sensor || ''}
            .label=${auto.watch_battery_sensor || 'sensor.watch_' + entityBase + '_battery_level'}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'watch_battery_sensor')}>
          </ha-entity-picker>

          <!-- Watch battery charging state sensor -->
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.watch_battery_state_sensor || auto.watch_battery_state_sensor || ''}
            .label=${auto.watch_battery_state_sensor || 'sensor.watch_' + entityBase + '_battery_state'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'watch_battery_state_sensor')}>
          </ha-entity-picker>

          <ha-textfield
            .value=${this._config.watch_battery_charging_value || ''}
            .label=${this._t('editor.watch_battery_charging_value')}
            .helper=${this._t('editor.charging_helper')}
            @input=${(e) => this._valueChanged(e, 'watch_battery_charging_value')}>
          </ha-textfield>
        </div>

        <!-- Device 2 Battery (tablet/laptop) -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:devices" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_device_2_battery')}</span>
            <ha-switch
              .checked=${this._config.show_device_2_battery !== false}
              @change=${(e) => this._valueChanged(e, 'show_device_2_battery')}>
            </ha-switch>
          </div>

          ${this._config.show_device_2_battery !== false ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.device_2_battery_sensor || auto.device_2_battery_sensor || ''}
              .label=${auto.device_2_battery_sensor || this._t('editor.device_2_battery_sensor')}
              .includeDomains=${['sensor', 'input_number']}
              allow-custom-entity
              @value-changed=${(e) => this._valueChanged(e, 'device_2_battery_sensor')}>
            </ha-entity-picker>
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.device_2_battery_state_sensor || auto.device_2_battery_state_sensor || ''}
              .label=${auto.device_2_battery_state_sensor || this._t('editor.device_2_battery_state_sensor')}
              .includeDomains=${['sensor', 'binary_sensor']}
              allow-custom-entity
              @value-changed=${(e) => this._entityPickerChanged(e, 'device_2_battery_state_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Activity -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:walk" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_activity')}</span>
            <ha-switch
              .checked=${this._config.show_activity !== false}
              @change=${(e) => this._valueChanged(e, 'show_activity')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.activity_sensor || auto.activity_sensor || ''}
            .label=${auto.activity_sensor || 'sensor.phone_' + entityBase + '_activity'}
            .includeDomains=${['sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'activity_sensor')}>
          </ha-entity-picker>
        </div>

        <!-- Connection -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:wifi" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_connection')}</span>
            <ha-switch
              .checked=${this._config.show_connection !== false}
              @change=${(e) => this._valueChanged(e, 'show_connection')}>
            </ha-switch>
          </div>

          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.connection_sensor || auto.connection_sensor || ''}
            .label=${auto.connection_sensor || 'sensor.phone_' + entityBase + '_connection_type'}
            .includeDomains=${['sensor', 'binary_sensor']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'connection_sensor')}>
          </ha-entity-picker>

          ${this._config.show_connection !== false ? html`
            <p class="info-text" style="margin:8px 0 4px;">${this._t('editor.wifi_ssid_sensor_description')}</p>
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.wifi_ssid_sensor || ''}
              .label=${this._t('editor.wifi_ssid_sensor')}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${(e) => this._entityPickerChanged(e, 'wifi_ssid_sensor')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Geocoded Location -->
        <div class="sensor-group">
          <p class="info-text" style="margin:0 0 6px;">${this._t('editor.geocoded_location_description')}</p>
          <div class="sensor-header">
            <ha-icon icon="mdi:map-marker-account" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_geocoded_location')}</span>
            <ha-switch
              .checked=${this._config.show_geocoded_location !== false}
              @change=${(e) => this._valueChanged(e, 'show_geocoded_location')}>
            </ha-switch>
          </div>
          ${this._config.show_geocoded_location ? html`
            <ha-entity-picker
              .hass=${this.hass}
              .value=${this._config.geocoded_location_entity || auto.geocoded_location_entity || ''}
              .label=${auto.geocoded_location_entity || this._t('editor.geocoded_location_entity')}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${(e) => this._entityPickerChanged(e, 'geocoded_location_entity')}>
            </ha-entity-picker>
          ` : ''}
        </div>

        <!-- Maps provider -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:map-marker-radius" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.maps_provider')}</span>
          </div>
          <p class="info-text">${this._t('editor.maps_provider_description')}</p>
          <ha-select
            label="${this._t('editor.maps_provider')}"
            .value=${this._config.maps_provider || 'none'}
            fixedMenuPosition
            naturalMenuWidth
            @request-selected=${(e) => {
              e.stopPropagation();
              if (e.detail && e.detail.selected === false) return;
              const raw = e.target && e.target.getAttribute ? e.target.getAttribute('value') : null;
              if (raw === null) return;
              this._config = { ...this._config, maps_provider: raw === 'none' ? null : raw };
              this._fireEvent('config-changed', { config: this._config });
              this.requestUpdate();
            }}>
            <mwc-list-item value="none">${this._t('editor.maps_provider_none')}</mwc-list-item>
            <mwc-list-item value="google">Google Maps</mwc-list-item>
            <mwc-list-item value="apple">Apple Maps</mwc-list-item>
            <mwc-list-item value="osm">OpenStreetMap</mwc-list-item>
          </ha-select>
        </div>

        <!-- Custom state entity -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:text-box-outline" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.state_entity')}</span>
          </div>
          <p class="info-text">${this._t('editor.state_entity_description')}</p>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.state_entity || ''}
            .includeDomains=${['sensor', 'input_text', 'input_select']}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'state_entity')}>
          </ha-entity-picker>
        </div>

        <!-- Extra chips section -->
        <div class="section-title">${this._t('section.extra_chips')}</div>
        <p class="info-text">${this._t('editor.extra_chips_description')}</p>

        ${(this._config.extra_chips || []).map((chip, idx) => html`
        <div class="extra-chip-row" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">

          <!-- Header row: entity picker + delete button -->
          <div style="display:flex;gap:6px;align-items:center;">
            <ha-entity-picker
              style="flex:1"
              .hass=${this.hass}
              .value=${chip.entity || ''}
              label="${this._t('editor.extra_chip_entity')}"
              allow-custom-entity
              @value-changed=${(e) => this._updateExtraChip(idx, 'entity', e.detail.value)}
            ></ha-entity-picker>
            <button
              @click=${() => this._removeExtraChip(idx)}
              title="Rimuovi chip"
              style="flex-shrink:0;width:36px;height:36px;border-radius:50%;border:none;background:rgba(244,67,54,0.18);cursor:pointer;font-size:18px;line-height:1;color:#f44336;font-weight:bold;">
              ✕
            </button>
          </div>

          <div style="display:flex;flex-direction:column;gap:6px;">

            <div style="display:flex;gap:6px;align-items:flex-end;">
              <ha-icon-picker
                style="flex:2"
                .hass=${this.hass}
                .value=${chip.icon || ''}
                .label=${this._t('editor.extra_chip_icon_label')}
                @value-changed=${(e) => this._updateExtraChip(idx, 'icon', e.detail.value || undefined)}
              ></ha-icon-picker>
              <ha-textfield style="flex:1" label="${this._t('editor.extra_chip_show_when')}" .value=${chip.show_when !== undefined ? chip.show_when : ''}
                @change=${(e) => this._updateExtraChip(idx, 'show_when', e.target.value || undefined)}></ha-textfield>
            </div>

            <div style="display:flex;gap:6px;align-items:center;">
              ${this._config.layout !== 'modern' && this._config.layout !== 'compact' ? html`
              <ha-textfield style="flex:1" label="${this._t('editor.extra_chip_label')}" .value=${chip.label !== undefined ? chip.label : ''}
                @change=${(e) => this._updateExtraChip(idx, 'label', e.target.value !== '' ? e.target.value : undefined)}></ha-textfield>
              ` : ''}
              <div class="color-picker" style="flex:1">
                <div class="color-preview" style="${chip.color ? `background-color:${chip.color}` : 'background:repeating-linear-gradient(45deg,#444 0,#444 4px,#222 4px,#222 8px);border:2px dashed #666;'}">
                  <input type="color" .value=${chip.color || '#4a9eff'}
                    @input=${(e) => this._updateExtraChip(idx, 'color', e.target.value)}>
                </div>
                <ha-textfield
                  .value=${chip.color || ''}
                  label="${this._t('editor.extra_chip_color')}"
                  @input=${(e) => this._updateExtraChip(idx, 'color', e.target.value || undefined)}
                  pattern="^#[0-9A-Fa-f]{6}$">
                </ha-textfield>
              </div>
            </div>

            <!-- Tap action row -->
            ${(() => {
              const ta = chip.tap_action || {};
              const taAction = ta.action || 'more-info';
              return html`
              <div style="display:flex;flex-direction:column;gap:6px;">
                <ha-select
                  .label=${this._t('editor.extra_chip_tap_action')}
                  .value=${taAction}
                  fixedMenuPosition
                  @request-selected=${(e) => {
                    e.stopPropagation();
                    if (e.detail && e.detail.selected === false) return;
                    const val = e.target?.getAttribute ? e.target.getAttribute('value') : null;
                    if (!val) return;
                    this._updateExtraChip(idx, 'tap_action', val === 'more-info' ? undefined : { action: val });
                  }}>
                  <mwc-list-item value="more-info">${this._t('editor.extra_chip_tap_more_info')}</mwc-list-item>
                  <mwc-list-item value="call-service">${this._t('editor.extra_chip_tap_call_service')}</mwc-list-item>
                  <mwc-list-item value="navigate">${this._t('editor.extra_chip_tap_navigate')}</mwc-list-item>
                  <mwc-list-item value="url">${this._t('editor.extra_chip_tap_url')}</mwc-list-item>
                  <mwc-list-item value="none">${this._t('editor.extra_chip_tap_none')}</mwc-list-item>
                </ha-select>
                ${taAction === 'call-service' ? html`
                  <ha-service-control
                    .hass=${this.hass}
                    .value=${{
                      action: ta.service || this._getDefaultServiceForEntity(chip.entity),
                      target: ta.target || {},
                      data: ta.service_data || {}
                    }}
                    .showAdvanced=${true}
                    @value-changed=${(e) => {
                      const v = e.detail.value || {};
                      this._updateExtraChip(idx, 'tap_action', {
                        action: 'call-service',
                        service: v.action || v.service || undefined,
                        target: (v.target && Object.keys(v.target).length) ? v.target : undefined,
                        service_data: (v.data && Object.keys(v.data).length) ? v.data : undefined
                      });
                    }}>
                  </ha-service-control>
                ` : ''}
                ${taAction === 'navigate' ? html`
                  <ha-textfield label="${this._t('editor.extra_chip_nav_path')}" .value=${ta.navigation_path || ''}
                    @change=${(e) => this._updateExtraChip(idx, 'tap_action', { ...ta, action: 'navigate', navigation_path: e.target.value || undefined })}></ha-textfield>
                ` : ''}
                ${taAction === 'url' ? html`
                  <ha-textfield label="${this._t('editor.extra_chip_url_path')}" .value=${ta.url_path || ''}
                    @change=${(e) => this._updateExtraChip(idx, 'tap_action', { ...ta, action: 'url', url_path: e.target.value || undefined })}></ha-textfield>
                ` : ''}
              </div>`;
            })()}

          </div>
        </div>
        `)}

        <mwc-button outlined @click=${this._addExtraChip} style="width:100%;margin-top:4px;">
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          ${this._t('editor.extra_chip_add')}
        </mwc-button>

      </div>

      <!-- Bidirectional Travel Time (Issue #22) -->
      <div class="section">
        <div class="section-title">${this._t('section.travel_sensor_2')}</div>
        <p class="info-text">${this._t('section.travel_sensor_2_description')}</p>

        <!-- Smart travel mode toggle -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:swap-horizontal" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.smart_travel_mode')}</span>
            <ha-switch
              .checked=${this._config.smart_travel_mode !== false}
              @change=${(e) => this._valueChanged(e, 'smart_travel_mode')}>
            </ha-switch>
          </div>
        </div>

        <!-- Pair travel animation toggle -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:animation-play" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.pair_travel_animation')}</span>
            <ha-switch
              .checked=${this._config.pair_travel_animation !== false}
              @change=${(e) => this._valueChanged(e, 'pair_travel_animation')}>
            </ha-switch>
          </div>
        </div>

        <!-- Travel time Casa → Lavoro (sensor 1) -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:home-export-outline" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_travel_time')} (${this._t('editor.direction_home_work')})</span>
            <ha-switch
              .checked=${this._config.show_travel_time !== false}
              @change=${(e) => this._valueChanged(e, 'show_travel_time')}>
            </ha-switch>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.travel_sensor || ''}
            .label=${this._t('editor.travel_sensor_home_work')}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'travel_sensor')}>
          </ha-entity-picker>
        </div>

        <!-- Travel time Lavoro → Casa (sensor 2) -->
        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:home-import-outline" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_travel_time')} (${this._t('editor.direction_work_home')})</span>
            <ha-switch
              .checked=${this._config.show_travel_time_2 !== false}
              @change=${(e) => this._valueChanged(e, 'show_travel_time_2')}>
            </ha-switch>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.travel_sensor_2 || ''}
            .label=${this._t('editor.travel_sensor_work_home')}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'travel_sensor_2')}>
          </ha-entity-picker>
        </div>

        <!-- Zone 2 (work zone) -->
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.zone_2 || ''}
          .label=${this._t('editor.zone_2')}
          .includeDomains=${['zone']}
          allow-custom-entity
          @value-changed=${(e) => this._valueChanged(e, 'zone_2')}>
        </ha-entity-picker>
      </div>

      <!-- Optional distance (always visible, position-independent) -->
      <div class="section">
        <div class="section-title">${this._t('section.distance_optional')}</div>
        <p class="info-text">${this._t('section.distance_optional_description')}</p>

        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:map-marker-distance" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_distance')} (${this._t('editor.direction_home_work')})</span>
            <ha-switch
              .checked=${this._config.show_distance !== false}
              @change=${(e) => this._valueChanged(e, 'show_distance')}>
            </ha-switch>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.distance_sensor || ''}
            .label=${this._t('editor.distance_sensor_home_work')}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'distance_sensor')}>
          </ha-entity-picker>
        </div>

        <div class="sensor-group">
          <div class="sensor-header">
            <ha-icon icon="mdi:map-marker-distance" class="sensor-icon"></ha-icon>
            <span class="sensor-title">${this._t('editor.show_distance_2')} (${this._t('editor.direction_work_home')})</span>
            <ha-switch
              .checked=${this._config.show_distance_2 !== false}
              @change=${(e) => this._valueChanged(e, 'show_distance_2')}>
            </ha-switch>
          </div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.distance_sensor_2 || ''}
            .label=${this._t('editor.distance_sensor_work_home')}
            .includeDomains=${['sensor', 'input_number']}
            allow-custom-entity
            @value-changed=${(e) => this._valueChanged(e, 'distance_sensor_2')}>
          </ha-entity-picker>
        </div>

        <ha-textfield
          label="${this._t('editor.distance_precision')}"
          type="number"
          min="0"
          max="3"
          .value=${String(this._config.distance_precision ?? 1)}
          @input=${(e) => this._valueChanged(e, 'distance_precision')}>
        </ha-textfield>

        <ha-textfield
          label="${this._t('editor.distance_unit')}"
          .value=${this._config.distance_unit || ''}
          placeholder="km"
          @input=${(e) => this._valueChanged(e, 'distance_unit')}>
        </ha-textfield>
        <div class="description">${this._t('editor.distance_unit_description')}</div>
      </div>
    `;
  }


  _renderPositionTab() {
    if (!this._config) {
      return html`<div>Configuration not available.</div>`;
    }

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.element_positions')}</div>
        <p class="info-text">
          ${this._t('section.positions_description')}
        </p>

        ${this._config.show_battery !== false ? html`
          ${this._renderPositionButtons('battery_position', this._t('position.battery'))}
        ` : ''}

        ${this._config.show_watch_battery !== false ? html`
          ${this._renderPositionButtons('watch_battery_position', this._t('position.watch_battery'))}
        ` : ''}

        ${this._config.show_activity !== false ? html`
          ${this._renderPositionButtons('activity_position', this._t('position.activity'))}
        ` : ''}

        ${this._config.show_connection !== false ? html`
          ${this._renderPositionButtons('connection_position', this._t('position.connection'))}
        ` : ''}

        ${this._config.show_distance !== false ? html`
          ${this._renderPositionButtons('distance_position', this._t('position.distance'))}
        ` : ''}

        ${this._config.show_travel_time !== false ? html`
          ${this._renderPositionButtons('travel_position', this._t('position.travel'))}
        ` : ''}
      </div>
    `;
  }



  _renderStatesTab() {
    const states = this._config.state || [];

    return html`
      <div class="section">
        <div class="section-title">${this._t('section.custom_states')}</div>
        <p class="info-text">
          ${this._t('section.states_description')}
        </p>

        ${states.map((state, index) => html`
          <div class="state-item">
            <div class="state-header">
              <span>${state.name || state.value || 'New state'}</span>
              <ha-icon-button
                icon="mdi:delete"
                class="remove-button"
                @click=${() => this._removeState(index)}>
              </ha-icon-button>
            </div>

            <ha-textfield
              label="${this._t('editor.state_value')} (e.g., home, not_home)"
              .value=${state.value || ''}
              @input=${(e) => this._updateState(index, 'value', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.displayed_name')}"
              .value=${state.name || ''}
              @input=${(e) => this._updateState(index, 'name', e.target.value)}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.custom_image')} (${this._t('editor.optional')})"
              .value=${state.entity_picture || ''}
              @input=${(e) => this._updateState(index, 'entity_picture', e.target.value)}>
            </ha-textfield>

            <div class="config-row">
              <span class="config-label">${this._t('state.name_color')}</span>
              <div class="color-picker">
                <div class="color-preview"
                     style="background-color: ${state.styles?.name?.color || '#7DDA9F'}">
                  <input type="color"
                         .value=${state.styles?.name?.color || '#7DDA9F'}
                         @input=${(e) => this._updateStateColor(index, e.target.value)}>
                </div>
                <ha-textfield
                  .value=${state.styles?.name?.color || '#7DDA9F'}
                  @input=${(e) => this._updateStateColor(index, e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$">
                </ha-textfield>
              </div>
            </div>
          </div>
        `)}

        <mwc-button
          outlined
          icon="mdi:plus"
          class="add-button"
          @click=${this._addState}>
          ${this._t('state.add_state')}
        </mwc-button>
      </div>

      <div class="preview-box">
        <div class="preview-title">${this._t('state.default_states')}</div>
        <mwc-button
          @click=${this._addDefaultStates}
          icon="mdi:magic">
          ${this._t('state.add_default_states')}
        </mwc-button>
      </div>
    `;
  }

  _renderStyleTab() {
    return html`
      <div class="section">
        <div class="section-title">${this._t('section.card_style')}</div>

        ${this._config.layout === 'classic' ? html`
          <div class="two-column">
            <ha-textfield
              label="${this._t('editor.name_font_size')}"
              .value=${this._config.name_font_size || '20px'}
              @input=${(e) => this._valueChanged(e, 'name_font_size')}>
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.state_font_size')}"
              .value=${this._config.state_font_size || '14px'}
              @input=${(e) => this._valueChanged(e, 'state_font_size')}>
            </ha-textfield>
          </div>

          <ha-textfield
            label="${this._t('editor.last_changed_font_size')}"
            .value=${this._config.last_changed_font_size || '12px'}
            @input=${(e) => this._valueChanged(e, 'last_changed_font_size')}
            helper-text="E.g.: 12px, 0.9em, 14px">
          </ha-textfield>
        ` : ''}

        ${this._config.layout !== 'modern' ? html`
          <div class="config-row" style="margin-top:8px;">
            <span class="config-label">${this._t('editor.last_changed_color')}</span>
            <div class="color-picker">
              <div class="color-preview"
                   style="background-color:${this._config.last_changed_color || '#888888'}">
                <input type="color"
                       .value=${this._config.last_changed_color || '#888888'}
                       @input=${(e) => this._updateConfigColor('last_changed_color', e.target.value)}>
              </div>
              <ha-textfield
                .value=${this._config.last_changed_color || ''}
                placeholder="#888888"
                @input=${(e) => this._updateConfigColor('last_changed_color', e.target.value)}
                pattern="^#[0-9A-Fa-f]{6}$">
              </ha-textfield>
            </div>
          </div>
          <p style="font-size:10px;color:var(--secondary-text-color);margin:2px 0 8px 0;">
            ${this._t('editor.last_changed_color_description')}
          </p>
        ` : ''}

        ${['glass', 'bio'].includes(this._config.layout) ? html`
          <div class="sensor-group" style="margin-bottom:8px;">
            <div class="sensor-header">
              <ha-icon icon="mdi:circle-opacity" class="sensor-icon"></ha-icon>
              <span class="sensor-title">${this._t('editor.transparent_background')}</span>
              <ha-switch
                .checked=${this._config.transparent_background === true}
                @change=${(e) => this._valueChanged(e, 'transparent_background')}>
              </ha-switch>
            </div>
          </div>
          <div class="sensor-group" style="margin-bottom:8px;">
            <div class="sensor-header">
              <ha-icon icon="mdi:blur" class="sensor-icon"></ha-icon>
              <span class="sensor-title">${this._t('editor.show_particles')}</span>
              <ha-switch
                .checked=${this._config.show_particles !== false}
                @change=${(e) => this._valueChanged(e, 'show_particles')}>
              </ha-switch>
            </div>
          </div>
        ` : ''}

        <ha-textfield
          label="${this._t('editor.card_background')}"
          .value=${this._config.card_background || 'rgba(255,255,255,0.05)'}
          @input=${(e) => this._valueChanged(e, 'card_background')}
          helper-text="E.g.: rgba(255,255,255,0.05) or #1a1a2e">
        </ha-textfield>

        <ha-textfield
          label="${this._t('editor.border_radius')}"
          .value=${this._config.card_border_radius || '15px'}
          @input=${(e) => this._valueChanged(e, 'card_border_radius')}>
        </ha-textfield>

        ${this._config.layout === 'classic' ? html`
          <ha-textfield
            label="${this._t('editor.image_size')}"
            type="number"
            min="10"
            max="100"
            .value=${this._config.picture_size || '40'}
            @input=${(e) => this._valueChanged(e, 'picture_size')}>
          </ha-textfield>
        ` : ''}
      </div>

      <!-- Classic Layout Options -->
      ${this._config.layout === 'classic' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.classic_options')}</div>

          <ha-textfield
            label="${this._t('editor.classic_icon_size')}"
            type="number"
            min="12"
            max="32"
            .value=${this._config.classic_icon_size || '16'}
            @input=${(e) => this._valueChanged(e, 'classic_icon_size')}
            helper-text="Default: 16px (icon size for indicators)">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.battery_font_size')}"
            .value=${this._config.battery_font_size || '13px'}
            @input=${(e) => this._valueChanged(e, 'battery_font_size')}
            helper-text="Default: 13px">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.activity_font_size')}"
            .value=${this._config.activity_font_size || '13px'}
            @input=${(e) => this._valueChanged(e, 'activity_font_size')}
            helper-text="Default: 13px">
          </ha-textfield>
        </div>
      ` : ''}

      <!-- Compact Layout Options -->
      ${this._config.layout === 'compact' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.compact_options')}</div>

          <ha-textfield
            label="${this._t('editor.compact_icon_size')}"
            type="number"
            min="12"
            max="32"
            .value=${this._config.compact_icon_size || '16'}
            @input=${(e) => this._valueChanged(e, 'compact_icon_size')}
            helper-text="Default: 16px (scales entire card proportionally)">
          </ha-textfield>
        </div>
      ` : ''}

      <!-- Neon Layout Options -->
      ${this._config.layout === 'neon' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.neon_options')}</div>
          <p style="font-size:12px; color: var(--secondary-text-color); margin: 0 0 8px 0;">
            ${this._t('section.neon_description')}
          </p>
        </div>
      ` : ''}

      <!-- Glass Layout Options -->
      ${this._config.layout === 'glass' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.glass_options')}</div>
          <p style="font-size:12px; color: var(--secondary-text-color); margin: 0 0 8px 0;">
            ${this._t('section.glass_description')}
          </p>
        </div>
      ` : ''}

      ${this._config.layout === 'bio' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.bio_options')}</div>
          <p style="font-size:12px; color: var(--secondary-text-color); margin: 0 0 8px 0;">
            ${this._t('section.bio_description')}
          </p>
        </div>
      ` : ''}

      ${this._config.layout === 'holo' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.holo_options')}</div>
          <p style="font-size:12px; color: var(--secondary-text-color); margin: 0 0 8px 0;">
            ${this._t('section.holo_description')}
          </p>
        </div>
      ` : ''}

      <!-- Modern Layout Options -->
      ${this._config.layout === 'modern' ? html`
        <div class="section">
          <div class="section-title">${this._t('section.modern_options')}</div>

          <ha-textfield
            label="${this._t('editor.modern_picture_size')}"
            type="number"
            min="30"
            max="80"
            .value=${this._config.modern_picture_size || '40'}
            @input=${(e) => this._valueChanged(e, 'modern_picture_size')}
            helper-text="Default: 40px">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.modern_ring_size')}"
            type="number"
            min="28"
            max="60"
            .value=${this._config.modern_ring_size || '38'}
            @input=${(e) => this._valueChanged(e, 'modern_ring_size')}
            helper-text="Default: 38px (size of circular indicators)">
          </ha-textfield>

          <div class="two-column">
            <ha-textfield
              label="${this._t('editor.modern_name_font_size')}"
              .value=${this._config.modern_name_font_size || '14px'}
              @input=${(e) => this._valueChanged(e, 'modern_name_font_size')}
              helper-text="Default: 14px">
            </ha-textfield>

            <ha-textfield
              label="${this._t('editor.modern_state_font_size')}"
              .value=${this._config.modern_state_font_size || '12px'}
              @input=${(e) => this._valueChanged(e, 'modern_state_font_size')}
              helper-text="Default: 12px">
            </ha-textfield>
          </div>

          <ha-textfield
            label="${this._t('editor.modern_travel_max_time')}"
            type="number"
            min="10"
            max="180"
            .value=${this._config.modern_travel_max_time || '60'}
            @input=${(e) => this._valueChanged(e, 'modern_travel_max_time')}
            helper-text="Default: 60 min (used for progress ring calculation)">
          </ha-textfield>

          <ha-textfield
            label="${this._t('editor.modern_distance_max')}"
            type="number"
            min="1"
            max="5000"
            .value=${this._config.modern_distance_max || '100'}
            @input=${(e) => this._valueChanged(e, 'modern_distance_max')}
            helper-text="Default: 100 km (used for distance ring calculation)">
          </ha-textfield>
        </div>
      ` : ''}

      <!-- Weather Options (all layouts) -->
      <div class="section">
        <div class="section-title">${this._t('section.weather')}</div>
        <div class="sensor-group">
          <div class="sensor-header">
            <span class="sensor-title">${this._t('editor.show_weather')}</span>
            <ha-switch
              .checked=${this._config.show_weather || false}
              @change=${(e) => this._valueChanged(e, 'show_weather')}>
            </ha-switch>
          </div>
        </div>
        ${this._config.show_weather ? html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.weather_entity || ''}
            .includeDomains=${['weather']}
            .label=${this._t('editor.weather_entity')}
            allow-custom-entity
            @value-changed=${(e) => this._entityPickerChanged(e, 'weather_entity')}>
          </ha-entity-picker>
          <p style="font-size:11px; color: var(--secondary-text-color); margin: 4px 0 0 0;">
            ${this._t('section.weather_description')}
          </p>
          ${this._config.layout !== 'matrix' ? html`
          <div class="sensor-group" style="margin-top:8px;">
            <div class="sensor-header">
              <span class="sensor-title">${this._t('editor.show_weather_background')}</span>
              <ha-switch
                .checked=${this._config.show_weather_background !== false}
                @change=${(e) => this._valueChanged(e, 'show_weather_background')}>
              </ha-switch>
            </div>
          </div>
          ` : ''}
          <div class="sensor-group">
            <div class="sensor-header">
              <span class="sensor-title">${this._t('editor.show_weather_temperature')}</span>
              <ha-switch
                .checked=${this._config.show_weather_temperature !== false}
                @change=${(e) => this._valueChanged(e, 'show_weather_temperature')}>
              </ha-switch>
            </div>
          </div>

          <!-- Weather text color -->
          <div class="config-row" style="margin-top:8px;">
            <span class="config-label">${this._t('editor.weather_text_color')}</span>
            <div class="color-picker">
              <div class="color-preview"
                   style="background-color:${this._config.weather_text_color || '#cccccc'}">
                <input type="color"
                       .value=${this._config.weather_text_color || '#cccccc'}
                       @input=${(e) => this._updateConfigColor('weather_text_color', e.target.value)}>
              </div>
              <ha-textfield
                .value=${this._config.weather_text_color || ''}
                placeholder="#cccccc"
                @input=${(e) => this._updateConfigColor('weather_text_color', e.target.value)}
                pattern="^#[0-9A-Fa-f]{6}$">
              </ha-textfield>
            </div>
          </div>
          <p style="font-size:10px;color:var(--secondary-text-color);margin:2px 0 8px 0;">
            ${this._t('editor.weather_text_color_description')}
          </p>

        ` : ''}
      </div>
    `;
  }

  _renderPositionButtons(configKey, label) {
    const options = [
      { value: 'top-left', label: 'Top Left' },
      { value: 'top-right', label: 'Top Right' },
      { value: 'bottom-left', label: 'Bottom Left' },
      { value: 'bottom-right', label: 'Bottom Right' }
    ];
    const selected = this._config[configKey] || options[0].value;

    return html`
      <div class="sensor-group">
        <div class="sensor-header">
          <span class="sensor-title">${label}</span>
        </div>
        <div class="position-button-group buttons">
          ${options.map(opt => html`
            <button
              class="${selected === opt.value ? 'selected' : ''}"
              @click="${() => this._onSelectPosition(configKey, opt.value)}">
              ${opt.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }



  _onSelectPosition(configKey, value) {
    this._config = { ...this._config, [configKey]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _valueChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    const target = ev.target || ev.currentTarget;
    let value;

    if (target.type === 'checkbox' || target.tagName === 'HA-SWITCH') {
      value = target.checked;
    } else if (target.tagName === 'HA-ENTITY-PICKER') {
      value = ev.detail?.value;
    } else if (target.type === 'number') {
      value = target.value === '' ? undefined : parseFloat(target.value);
    } else {
      value = target.value;
    }

    // Prevent infinite loops - check if value actually changed
    const currentValue = this._config[configValue];
    if (value === currentValue) {
      return;
    }

    // Also check for empty string vs undefined equivalence
    if ((value === '' || value === undefined || value === null) &&
        (currentValue === '' || currentValue === undefined || currentValue === null)) {
      return;
    }

    if (value === '' || value === undefined) {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();

    // Auto-detect sensors when a person entity is newly selected and no sensors are configured yet
    if (configValue === 'entity' && value) {
      const noSensors = !['battery_sensor', 'watch_battery_sensor', 'activity_sensor',
                          'connection_sensor']
        .some(k => this._config[k]);
      if (noSensors) setTimeout(() => this._autoDetectSensors(), 0);
    }
  }

  // Dedicated handler for entity pickers to avoid infinite loops
  _entityPickerChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();

    const value = ev.detail?.value || '';
    const currentValue = this._config[configValue] || '';

    // Skip if value hasn't changed
    if (value === currentValue) {
      return;
    }

    if (value === '') {
      const newConfig = { ...this._config };
      delete newConfig[configValue];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    this._fireEvent('config-changed', { config: this._config });
  }


  _handleLayoutChange(ev) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();

    // Skip deselect events — request-selected fires twice: once for the newly
    // selected item (selected=true) and once for the previously selected item
    // (selected=false). Processing the second event would reset the layout back.
    if (ev.detail && ev.detail.selected === false) return;

    // HA 2025: ha-select emette request-selected sull'item cliccato
    // Try multiple value sources for robustness
    const item = ev.target;
    const value = ev.detail?.value
      || item?.value
      || (item && item.getAttribute ? item.getAttribute('value') : null);

    if (!value || (value !== 'classic' && value !== 'compact' && value !== 'modern' && value !== 'neon' && value !== 'glass' && value !== 'bio' && value !== 'holo' && value !== 'wxstation' && value !== 'matrix' && value !== 'orbital' && value !== 'ink')) {
      console.warn('Invalid layout value:', value);
      return;
    }

    // Aggiorna il label visibile nel picker (fix HA 2025)
    const select = ev.currentTarget || ev.composedPath().find(el => el.tagName === 'HA-SELECT');
    if (select) {
      select.value = value;
      const pf = select.shadowRoot && select.shadowRoot.querySelector('ha-picker-field');
      if (pf && pf.shadowRoot) {
        const cb = pf.shadowRoot.querySelector('ha-combo-box-item');
        if (cb) { const sp = cb.querySelector('span[slot="headline"]'); if (sp) sp.textContent = item.textContent.trim(); }
      }
      const dropdown = select.shadowRoot && select.shadowRoot.querySelector('ha-dropdown');
      if (dropdown) dropdown.open = false;
    }

    this._config = { ...this._config, layout: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }


  _selectChanged(ev, configValue) {
    if (!this._config || !this.hass) return;

    ev.stopPropagation();
    ev.preventDefault();

    // HA 2025: request-selected porta il valore nell'item (ev.target), non in ev.detail.value
    const value = (ev.target && ev.target.getAttribute && ev.target.getAttribute('value'))
      || ev.detail?.value;

    // Allowed values for triggers_update
    const validTriggerValues = ['all', 'entity', 'custom'];

    // Allowed values for layout
    const validLayoutValues = ['classic', 'compact', 'modern', 'neon', 'glass', 'bio', 'holo', 'wxstation', 'matrix', 'orbital', 'ink'];

    // Allowed values for positions
    const validPositions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right',
      'top-left-2', 'top-right-2', 'bottom-left-2', 'bottom-right-2'
    ];

    if (!value || typeof value !== 'string') {
      console.warn(`Invalid value (type or undefined) for ${configValue}:`, value);
      return;
    }

    if (configValue === 'triggers_update') {
      if (!validTriggerValues.includes(value)) {
        console.warn(`Invalid triggers_update value:`, value);
        return;
      }
    } else if (configValue === 'layout') {
      if (!validLayoutValues.includes(value)) {
        console.warn(`Invalid layout value:`, value);
        return;
      }
    } else {
      if (!validPositions.includes(value)) {
        console.warn(`Invalid position value for ${configValue}:`, value);
        return;
      }
    }

    this._config = { ...this._config, [configValue]: value };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }





  _addState() {
    const states = this._config.state || [];
    states.push({
      value: '',
      name: '',
      styles: {
        name: {
          color: '#7DDA9F'
        }
      }
    });

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _removeState(index) {
    const states = [...(this._config.state || [])];
    states.splice(index, 1);

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateState(index, field, value) {
    const states = [...(this._config.state || [])];
    states[index] = { ...states[index], [field]: value };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateStateColor(index, color) {
    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) return;
    const states = [...(this._config.state || [])];
    states[index] = {
      ...states[index],
      styles: {
        ...states[index].styles,
        name: {
          ...states[index].styles?.name,
          color: color
        }
      }
    };

    this._config = { ...this._config, state: states };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _updateConfigColor(key, color) {
    // Allow empty string to clear the color (restore layout default)
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) return;
    if (!color) {
      const newConfig = { ...this._config };
      delete newConfig[key];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [key]: color };
    }
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _addDefaultStates() {
    const defaultStates = [
      {
        value: 'home',
        name: this._t('default_state.home'),
        styles: { name: { color: '#7DDA9F' } }
      },
      {
        value: 'not_home',
        name: this._t('default_state.away'),
        styles: { name: { color: '#93ADCB' } }
      },
      {
        value: 'office',
        name: this._t('default_state.office'),
        styles: { name: { color: '#FFD700' } }
      },
      {
        value: 'unknown',
        name: this._t('default_state.unknown'),
        styles: { name: { color: '#808080' } }
      }
    ];

    this._config = { ...this._config, state: defaultStates };
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  // Resolve mobile_app device prefix from person entity's device_trackers attribute.
  // Returns e.g. "iphonedavide" from device_tracker.iphonedavide when that device
  // has a corresponding battery sensor in hass states.
  _resolveDevicePrefixEditor() {
    if (!this.hass || !this._config?.entity) return null;
    const personEntity = this.hass.states[this._config.entity];
    if (!personEntity) return null;

    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }

    // Fallback: scan all device_trackers whose name contains the person name
    const personName = this._config.entity.replace('person.', '');
    for (const entityId of Object.keys(this.hass.states)) {
      if (!entityId.startsWith('device_tracker.')) continue;
      const prefix = entityId.replace('device_tracker.', '');
      if (prefix.includes(personName) && this.hass.states[`sensor.${prefix}_battery_level`]) {
        return prefix;
      }
    }
    return null;
  }

  // Returns a map of auto-detected sensor IDs using the resolved device prefix.
  // Falls back to the old sensor.phone_* / sensor.waze_* patterns.
  _getAutoSensorIds() {
    const entityBase = this._config?.entity?.replace('person.', '') || '';
    const p = this._resolveDevicePrefixEditor();
    const s = this.hass?.states || {};
    const connection = p
      ? (s[`sensor.${p}_connection_type`] ? `sensor.${p}_connection_type` : `sensor.${p}_network_type`)
      : (s[`sensor.phone_${entityBase}_connection_type`] ? `sensor.phone_${entityBase}_connection_type` : `sensor.phone_${entityBase}_network_type`);
    const p2 = this._resolveDevicePrefix2Editor();
    return {
      battery_sensor:              p ? `sensor.${p}_battery_level`        : `sensor.phone_${entityBase}_battery_level`,
      battery_state_sensor:        p ? `sensor.${p}_battery_state`        : `sensor.phone_${entityBase}_battery_state`,
      watch_battery_sensor:        p ? `sensor.${p}_watch_battery_level`  : `sensor.watch_${entityBase}_battery_level`,
      watch_battery_state_sensor:  p ? `sensor.${p}_watch_battery_state`  : `sensor.watch_${entityBase}_battery_state`,
      activity_sensor:             p ? `sensor.${p}_activity`             : `sensor.phone_${entityBase}_activity`,
      connection_sensor:           connection,
      device_2_battery_sensor:     p2 ? `sensor.${p2}_battery_level` : null,
      device_2_battery_state_sensor: p2 ? `sensor.${p2}_battery_state` : null,
      geocoded_location_entity:    p ? `sensor.${p}_geocoded_location` : null,
    };
  }

  _resolveDevicePrefix2Editor() {
    if (!this.hass || !this._config?.entity) return null;
    const personEntity = this.hass.states[this._config.entity];
    if (!personEntity) return null;
    const skip = this._resolveDevicePrefixEditor();
    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (prefix === skip) continue;
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }
    return null;
  }

  _autoDetectSensors() {
    if (!this.hass || !this._config?.entity) return;
    const s = this.hass.states;
    const auto = this._getAutoSensorIds();

    const candidates = {
      battery_sensor:               [auto.battery_sensor],
      battery_state_sensor:         [auto.battery_state_sensor],
      watch_battery_sensor:         [auto.watch_battery_sensor],
      watch_battery_state_sensor:   [auto.watch_battery_state_sensor],
      activity_sensor:              [auto.activity_sensor],
      connection_sensor:            [auto.connection_sensor],
      device_2_battery_sensor:      [auto.device_2_battery_sensor],
      device_2_battery_state_sensor:[auto.device_2_battery_state_sensor],
      geocoded_location_entity:     [auto.geocoded_location_entity],
    };

    let updated = { ...this._config };
    let count = 0;

    for (const [field, ids] of Object.entries(candidates)) {
      if (updated[field]) continue;
      for (const id of ids) {
        if (id && s[id]) {
          updated[field] = id;
          count++;
          break;
        }
      }
    }

    if (count > 0) {
      this._config = updated;
      this._fireEvent('config-changed', { config: this._config });
    }
    this._autoDetectMsg = count > 0
      ? `✔ ${count} ${this._t('section.auto_detect_found')}`
      : `✘ ${this._t('section.auto_detect_none')}`;
    this.requestUpdate();
    setTimeout(() => { this._autoDetectMsg = null; this.requestUpdate(); }, 4000);
  }

  _updateConfig(key, value) {
    if (!this._config) return;
    if (value === undefined) {
      const newConfig = { ...this._config };
      delete newConfig[key];
      this._config = newConfig;
    } else {
      this._config = { ...this._config, [key]: value };
    }
    this._fireEvent('config-changed', { config: this._config });
    this.requestUpdate();
  }

  _inferEntityIcon(entityId, ent) {
    const id = entityId.toLowerCase();
    const dc = (ent?.attributes?.device_class || '').toLowerCase();
    if (id.includes('bluetooth')) return 'mdi:bluetooth';
    if (id.includes('android_auto') || id.includes('androidauto')) return 'mdi:car-wireless';
    if (id.includes('phone_state') || id.includes('in_call')) return 'mdi:phone';
    if (id.includes('ringer')) return 'mdi:volume-medium';
    if (id.includes('wifi') || id.includes('wi_fi')) return 'mdi:wifi';
    if (id.includes('charging')) return 'mdi:battery-charging';
    if (id.includes('battery')) return 'mdi:battery';
    if (id.includes('screen') || id.includes('display')) return 'mdi:cellphone';
    if (id.includes('nfc')) return 'mdi:nfc';
    if (id.includes('hotspot')) return 'mdi:wifi-plus';
    if (id.includes('silent') || id.includes('mute')) return 'mdi:volume-off';
    if (id.includes('dnd') || id.includes('do_not_disturb')) return 'mdi:minus-circle';
    const domain = entityId.split('.')[0];
    if (domain === 'binary_sensor') return dc === 'motion' ? 'mdi:motion-sensor' : dc === 'battery_charging' ? 'mdi:battery-charging' : 'mdi:checkbox-marked-circle';
    if (domain === 'sensor') return dc === 'temperature' ? 'mdi:thermometer' : dc === 'humidity' ? 'mdi:water-percent' : dc === 'battery' ? 'mdi:battery' : 'mdi:eye';
    if (domain === 'switch') return 'mdi:toggle-switch';
    if (domain === 'light') return 'mdi:lightbulb';
    return null;
  }

  _getDefaultServiceForEntity(entityId) {
    if (!entityId) return 'homeassistant.toggle';
    const domain = entityId.split('.')[0];
    const map = {
      light: 'light.toggle',
      switch: 'switch.toggle',
      input_boolean: 'input_boolean.toggle',
      media_player: 'media_player.media_play_pause',
      script: 'script.turn_on',
      automation: 'automation.trigger',
      scene: 'scene.turn_on',
      cover: 'cover.toggle',
      fan: 'fan.toggle',
      lock: 'lock.toggle',
      climate: 'climate.toggle',
      vacuum: 'vacuum.start',
      button: 'button.press',
      input_button: 'input_button.press'
    };
    return map[domain] || 'homeassistant.toggle';
  }

  _addExtraChip() {
    const chips = [...(this._config.extra_chips || []), { entity: '' }];
    this._updateConfig('extra_chips', chips);
  }

  _removeExtraChip(idx) {
    const chips = [...(this._config.extra_chips || [])];
    chips.splice(idx, 1);
    this._updateConfig('extra_chips', chips.length ? chips : undefined);
  }

  _updateExtraChip(idx, key, value) {
    const chips = JSON.parse(JSON.stringify(this._config.extra_chips || []));
    if (value === undefined) {
      delete chips[idx][key];
    } else {
      chips[idx][key] = value;
    }
    // When entity is set for the first time on an empty chip, copy the real HA entity icon
    if (key === 'entity' && value && !chips[idx].icon && this.hass) {
      const ent = this.hass.states[value];
      if (ent?.attributes?.icon) chips[idx].icon = ent.attributes.icon;
    }
    this._updateConfig('extra_chips', chips);
  }

  _fireEvent(type, detail) {
    const event = new CustomEvent(type, {
      detail: detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

// Register the editor
if (!customElements.get('person-tracker-card-editor')) {
  customElements.define('person-tracker-card-editor', PersonTrackerCardEditor);
  console.log('Person Tracker Card Editor registered');
}

// Export for the main card
window.PersonTrackerCardEditor = PersonTrackerCardEditor;
