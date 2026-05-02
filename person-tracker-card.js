// Person Tracker Card v1.4.12 - Multilanguage Version
// Full support for all editor options
// Languages: Italian (default), English, French, German
// v1.4.7: Liquid Ink layout (ink) — light mode card with ink blob background, animated dashed ring avatar, ink-wash chips, pair animation; all sensors/geocoded/maps/weather supported
// v1.4.6: Maps integration — maps_provider config (google/apple/osm) opens GPS location on zone/address click; show_geocoded_location enabled by default; editor dropdown fix (value="none" sentinel, label+fixedMenuPosition); geocoded switch check !== false; GPS coords from person.attributes
// v1.4.5: Orbital layout (orbital) — 3D spinning photo coin, three tilted orbital rings, orbiting
//         satellite badges (battery/connection/activity), pulsing energy rings, animated star field,
//         chip row centered below, state-based accent color (home=teal, away=violet, zone=blue).
// v1.4.4: Geocoded location (sensor.xxx_geocoded_location) — human-readable GPS address in all 9
//         layouts when not home; auto-detected from mobile app prefix; clickable (more-info);
//         scrolling marquee when text overflows; compact layout alternates state/address with animation;
//         editor: Sensors tab toggle + auto-populated picker + description.
//         Fix: neon/glass/bio pair chip alignment follows wxstation pattern (pair-b uses inset:0).
//         Fix: weather-active text shadow/contrast now applied to glass, bio and holo layouts.
// v1.4.3: Matrix Rain layout (matrix) — terminal/hacker theme with falling katakana/hex columns,
//         monospace stats with progress bars, state color on avatar border/scan bar
// v1.4.2: Weather Station layout (wxstation); show_device_2_battery — second device (tablet/laptop)
//         battery display with auto-detection across all 8 layouts; fix weather_text_color now
//         also applies to °C/°F temperature unit
// v1.4.1: pair_travel_animation option — disable alternating distance/travel animation to show both
//         separately; transparent_background option for Glass and Bio layouts; show_particles toggle
//         to disable rising particles/orbs (Glass/Bio); README HACS link fix
// v1.4.0: weather_text_color and last_changed_color options (card + editor) — custom text colors
//         for weather label and last-updated timestamp across all 7 layouts
// v1.3.9: Editor cache fix: import.meta.url extracts hacstag from HACS and passes it to editor;
//         Neon layout: weather conditions (icon + label) added next to temperature
// v1.3.7: Fix editor cache after HACS update: dynamic import now includes ?v= param; CARD_VERSION
//         promoted to top-level constant; version badge added to editor UI
// v1.3.3: Fix #24 distance sensors now read attributes.distance (Waze/Google Routes support);
//         Fix modern layout pair-b ring overflow; Dual direction distance+travel alternating animation
// v1.3.2: Rich weather animations (sun/moon/rain/snow/lightning/hail/fog/wind/exceptional);
//         Mobile app auto-detection via device_trackers attribute; Weather temp positioning
//         per layout; Compact/Modern weather contrast fix; Shooting star fix; Translations
// v1.3.1: Neon layout; Animated weather background (weather_entity); Editor cache-bust fix
// v1.3.0: Fix #20 editor ha-entity-picker not loading; Fix #14 iOS network_type fallback;
//         Fix #16 distance_precision option; Fix #15 distance now shows in classic/compact
//         Fix #17 tap_action support (more-info, navigate, url, call-service, none)
// v1.2.4 Fix Language fr,ge. Hide Activity Status when unknown
// v1.2.2: Bug fix, battery state, animation,fixed light theme
// v1.2.0: Added Modern layout with circular progress indicators for battery and travel time
// v1.1.2: Added dynamic unit of measurement for distance sensor
// v1.1.2: Activity icon now follows entity's icon attribute with fallback to predefined mapping
// v1.1.2: Fixed WiFi detection for Android (case-insensitive check for "wifi", "Wi-Fi", etc.)

console.log("Person Tracker Card v1.4.12 Multilanguage loading...");

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace") || customElements.get("hui-view")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// Localization Helper Class
class LocalizationHelper {
  constructor(hass) {
    this.hass = hass;
    this.translations = {};
    this.currentLanguage = 'en'; // Default: English
    this.loadTranslations();
  }

  loadTranslations() {
    // Get language from Home Assistant
    const haLanguage = this.hass?.language || this.hass?.locale?.language || 'en';

    // Map HA language codes to our supported languages
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

    // Translations embedded (fallback if files are not loaded)
    this.translations = {
      'it': {
        'common.person_tracker': 'Tracciatore Persona',
        'common.unknown': 'Sconosciuto',
        'common.home': 'Casa',
        'common.away': 'Fuori',
        'common.not_home': 'Non a Casa',
        'attributes.battery': 'Batteria',
        'attributes.speed': 'Velocità',
        'attributes.direction': 'Direzione',
        'attributes.accuracy': 'Precisione',
        'attributes.gps_accuracy': 'Precisione GPS',
        'attributes.altitude': 'Altitudine',
        'attributes.source': 'Fonte',
        'attributes.last_changed': 'Ultimo aggiornamento',
        'attributes.distance': 'Distanza',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Proprio ora',
        'time.minute': 'minuto',
        'time.minutes': 'minuti',
        'time.hour': 'ora',
        'time.hours': 'ore',
        'time.day': 'giorno',
        'time.days': 'giorni',
        'time.ago': 'fa',
        'weather.sunny': 'Soleggiato',
        'weather.clear-night': 'Sereno',
        'weather.cloudy': 'Nuvoloso',
        'weather.partlycloudy': 'Parz. Nuvoloso',
        'weather.fog': 'Nebbia',
        'weather.hail': 'Grandine',
        'weather.lightning': 'Fulmine',
        'weather.lightning-rainy': 'Temporale',
        'weather.pouring': 'Acquazzone',
        'weather.rainy': 'Pioggia',
        'weather.snowy': 'Neve',
        'weather.snowy-rainy': 'Pioggia e Neve',
        'weather.windy': 'Ventoso',
        'weather.windy-variant': 'Molto Ventoso',
        'weather.exceptional': 'Eccezionale',
        'wx.battery': 'Batteria', 'wx.watch': 'Orologio', 'wx.wind': 'Vento',
        'wx.humidity': 'Umidità', 'wx.network': 'Rete', 'wx.activity': 'Attività',
        'wx.pressure': 'Press.', 'wx.feels': 'Percepita', 'wx.device2': 'Disp.2',
      },
      'en': {
        'common.person_tracker': 'Person Tracker',
        'common.unknown': 'Unknown',
        'common.home': 'Home',
        'common.away': 'Away',
        'common.not_home': 'Not Home',
        'attributes.battery': 'Battery',
        'attributes.speed': 'Speed',
        'attributes.direction': 'Direction',
        'attributes.accuracy': 'Accuracy',
        'attributes.gps_accuracy': 'GPS Accuracy',
        'attributes.altitude': 'Altitude',
        'attributes.source': 'Source',
        'attributes.last_changed': 'Last Changed',
        'attributes.distance': 'Distance',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Just now',
        'time.minute': 'minute',
        'time.minutes': 'minutes',
        'time.hour': 'hour',
        'time.hours': 'hours',
        'time.day': 'day',
        'time.days': 'days',
        'time.ago': 'ago',
        'weather.sunny': 'Sunny',
        'weather.clear-night': 'Clear Night',
        'weather.cloudy': 'Cloudy',
        'weather.partlycloudy': 'Partly Cloudy',
        'weather.fog': 'Foggy',
        'weather.hail': 'Hail',
        'weather.lightning': 'Lightning',
        'weather.lightning-rainy': 'Thunderstorm',
        'weather.pouring': 'Pouring',
        'weather.rainy': 'Rainy',
        'weather.snowy': 'Snowy',
        'weather.snowy-rainy': 'Sleet',
        'weather.windy': 'Windy',
        'weather.windy-variant': 'Very Windy',
        'weather.exceptional': 'Exceptional',
        'wx.battery': 'Battery', 'wx.watch': 'Watch', 'wx.wind': 'Wind',
        'wx.humidity': 'Humidity', 'wx.network': 'Network', 'wx.activity': 'Activity',
        'wx.pressure': 'Press.', 'wx.feels': 'Feels like', 'wx.device2': 'Device 2',
      },
      'fr': {
        'common.person_tracker': 'Suivi de Personne',
        'common.unknown': 'Inconnu',
        'common.home': 'Maison',
        'common.away': 'Absent',
        'common.not_home': 'Pas à la Maison',
        'attributes.battery': 'Batterie',
        'attributes.speed': 'Vitesse',
        'attributes.direction': 'Direction',
        'attributes.accuracy': 'Précision',
        'attributes.gps_accuracy': 'Précision GPS',
        'attributes.altitude': 'Altitude',
        'attributes.source': 'Source',
        'attributes.last_changed': 'Dernière Mise à Jour',
        'attributes.distance': 'Distance',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'À l\'instant',
        'time.minute': 'minute',
        'time.minutes': 'minutes',
        'time.hour': 'heure',
        'time.hours': 'heures',
        'time.day': 'jour',
        'time.days': 'jours',
        'time.ago': 'il y a',
        'weather.sunny': 'Ensoleillé',
        'weather.clear-night': 'Nuit claire',
        'weather.cloudy': 'Nuageux',
        'weather.partlycloudy': 'Partiellement nuageux',
        'weather.fog': 'Brouillard',
        'weather.hail': 'Grêle',
        'weather.lightning': 'Éclairs',
        'weather.lightning-rainy': 'Orage',
        'weather.pouring': 'Averse',
        'weather.rainy': 'Pluvieux',
        'weather.snowy': 'Neigeux',
        'weather.snowy-rainy': 'Neige fondue',
        'weather.windy': 'Venteux',
        'weather.windy-variant': 'Très venteux',
        'weather.exceptional': 'Exceptionnel',
        'wx.battery': 'Batterie', 'wx.watch': 'Montre', 'wx.wind': 'Vent',
        'wx.humidity': 'Humidité', 'wx.network': 'Réseau', 'wx.activity': 'Activité',
        'wx.pressure': 'Press.', 'wx.feels': 'Ressenti', 'wx.device2': 'Appar.2',
      },
      'de': {
        'common.person_tracker': 'Personen-Tracker',
        'common.unknown': 'Unbekannt',
        'common.home': 'Zuhause',
        'common.away': 'Abwesend',
        'common.not_home': 'Nicht Zuhause',
        'attributes.battery': 'Batterie',
        'attributes.speed': 'Geschwindigkeit',
        'attributes.direction': 'Richtung',
        'attributes.accuracy': 'Genauigkeit',
        'attributes.gps_accuracy': 'GPS-Genauigkeit',
        'attributes.altitude': 'Höhe',
        'attributes.source': 'Quelle',
        'attributes.last_changed': 'Letzte Änderung',
        'attributes.distance': 'Entfernung',
        'units.km': 'km',
        'units.m': 'm',
        'units.km_h': 'km/h',
        'units.percent': '%',
        'time.just_now': 'Gerade eben',
        'time.minute': 'Minute',
        'time.minutes': 'Minuten',
        'time.hour': 'Stunde',
        'time.hours': 'Stunden',
        'time.day': 'Tag',
        'time.days': 'Tage',
        'time.ago': 'vor',
        'weather.sunny': 'Sonnig',
        'weather.clear-night': 'Klare Nacht',
        'weather.cloudy': 'Bewölkt',
        'weather.partlycloudy': 'Teils bewölkt',
        'weather.fog': 'Neblig',
        'weather.hail': 'Hagel',
        'weather.lightning': 'Blitz',
        'weather.lightning-rainy': 'Gewitter',
        'weather.pouring': 'Starkregen',
        'weather.rainy': 'Regnerisch',
        'weather.snowy': 'Schnee',
        'weather.snowy-rainy': 'Schneeregen',
        'weather.windy': 'Windig',
        'weather.windy-variant': 'Sehr windig',
        'weather.exceptional': 'Außergewöhnlich',
        'wx.battery': 'Batterie', 'wx.watch': 'Uhr', 'wx.wind': 'Wind',
        'wx.humidity': 'Luftfeuchte', 'wx.network': 'Netzwerk', 'wx.activity': 'Aktivität',
        'wx.pressure': 'Druck', 'wx.feels': 'Gefühlt', 'wx.device2': 'Gerät 2',
      }
    };
  }

  localize(key) {
    const langTranslations = this.translations[this.currentLanguage];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }

    // Fallback to English
    const defaultTranslations = this.translations['en'];
    if (defaultTranslations && defaultTranslations[key]) {
      return defaultTranslations[key];
    }

    // Fallback to key itself
    return key;
  }
}

const CARD_VERSION = '1.4.12';

class PersonTrackerCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      config: { attribute: false },
      _batteryLevel: { state: true },
      _batteryIcon: { state: true },
      _batteryCharging: { state: true },
      _activity: { state: true },
      _activityIcon: { state: true },
      _connectionType: { state: true },
      _distanceFromHome: { state: true },
      _distanceUnit: { state: true },
      _travelTime: { state: true },
      _watchBatteryLevel: { state: true },
      _watchBatteryIcon: { state: true },
      _watchBatteryCharging: { state: true },
      _distanceSensorFound: { state: true },
      _distanceFromHome2: { state: true },
      _distanceUnit2: { state: true },
      _distanceSensorFound2: { state: true },
      _travelTime2: { state: true },
      _weatherState: { state: true },
      _weatherTemp: { state: true },
      _battery2Level: { state: true },
      _battery2Icon: { state: true },
      _battery2Charging: { state: true },
      _wifiSSID: { state: true },
    };
  }

  constructor() {
    super();
    this._batteryLevel = 0;
    this._batteryIcon = 'mdi:battery';
    this._batteryCharging = false;
    this._activity = 'unknown';
    this._activityIcon = '';
    this._connectionType = 'unknown';
    this._distanceFromHome = 0;
    this._distanceUnit = 'km';
    this._watchBatteryLevel = 0;
    this._watchBatteryIcon = 'mdi:battery';
    this._watchBatteryCharging = false;
    this._travelTime = 0;
    this._distanceSensorFound = false;
    this._distanceFromHome2 = 0;
    this._distanceUnit2 = 'km';
    this._distanceSensorFound2 = false;
    this._distanceIcon2 = 'mdi:map-marker-distance';
    this._travelTime2 = 0;
    this._travelIcon2 = 'mdi:car-clock';
    this._weatherState = null;
    this._weatherTemp = null;
    this._battery2Level = 0;
    this._battery2Icon = 'mdi:battery';
    this._battery2Charging = false;
    this._wifiSSID = null;
    this._resolvedPrefix2 = null;
    this._localize = null;
  }

  // Initialize localization when hass is available
  _initLocalization() {
    if (this.hass && !this._localize) {
      this._localize = new LocalizationHelper(this.hass);
    }
  }

  // Helper method to get localized strings
  _t(key) {
    this._initLocalization();
    return this._localize ? this._localize.localize(key) : key;
  }

  // Translate common entity states
  _translateState(state) {
    if (!state) return this._t('common.unknown');

    const stateMap = {
      'home': 'common.home',
      'not_home': 'common.not_home',
      'away': 'common.away',
      'unknown': 'common.unknown'
    };

    const lowerState = state.toLowerCase();
    return stateMap[lowerState] ? this._t(stateMap[lowerState]) : state;
  }

  // Support for the visual editor
  static async getConfigElement() {
    try {
      const _mainUrl = new URL(import.meta.url);
      const _hacstag = _mainUrl.searchParams.get('hacstag');
      const _editorUrl = new URL('./person-tracker-card-editor.js', import.meta.url);
      if (_hacstag) _editorUrl.searchParams.set('hacstag', _hacstag);
      else _editorUrl.searchParams.set('v', CARD_VERSION);
      await import(_editorUrl.href);
      return document.createElement('person-tracker-card-editor');
    } catch (error) {
      console.error('Person Tracker Card Editor not found:', error);
      return document.createElement('div');
    }
  }

  static getStubConfig(hass) {
    let defaultEntity = '';

    if (hass && hass.states) {
      const personEntities = Object.keys(hass.states).filter(
        eid => eid.startsWith('person.')
      );
      if (personEntities.length > 0) {
        defaultEntity = personEntities[0];
      }
    }

    return {
      entity: defaultEntity,
      type: 'custom:person-tracker-card'
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.entity) {
      throw new Error('You must define a person entity');
    }

    // Default configuration with all new options
    this.config = {
      // Layout
      layout: 'classic',
      compact_width: 300,
      // Display
      show_entity_picture: true,
      show_person_name: true,
      show_name: true,
      show_last_changed: true,
      show_battery: true,
      show_activity: true,
      show_distance: true,
      show_watch_battery: true,
      show_travel_time: true,
      show_connection: true,
      show_distance_2: true,
      show_travel_time_2: true,
      // Layout
      aspect_ratio: '1/0.7',
      triggers_update: 'all',
      // General styles
      name_font_size: '20px',
      state_font_size: '14px',
      last_changed_font_size: '12px',
      card_background: 'rgba(255,255,255,0.05)',
      card_border_radius: '15px',
      picture_size: 40,
      // Element positions
      battery_position: 'top-right',
      watch_battery_position: 'top-right-2',
      activity_position: 'bottom-left',
      distance_position: 'top-left',
      travel_position: 'top-left-2',
      connection_position: 'bottom-right',
      // Element font sizes
      battery_font_size: '13px',
      watch_battery_font_size: '13px',
      activity_font_size: '13px',
      distance_font_size: '12px',
      travel_font_size: '12px',
      connection_font_size: '12px',
      // Classic layout options
      classic_icon_size: 16,
      // Compact layout options
      compact_icon_size: 16,
      // Tap action (Fix #17)
      tap_action: { action: 'more-info' },
      // Distance precision (Fix #16)
      distance_precision: 1,
      // Pair animation: when true, distance+travel alternate; when false, show separately
      pair_travel_animation: true,
      // Transparent background (glass/bio only)
      transparent_background: false,
      // Particles/orbs animation (glass/bio only)
      show_particles: true,
      // Second device (tablet/laptop) battery
      show_device_2_battery: true,
      device_2_battery_sensor: null,
      device_2_battery_state_sensor: null,
      device_2_battery_position: 'top-right-3',
      // Weather
      show_weather: false,
      weather_entity: null,
      show_weather_background: true,
      show_weather_temperature: true,
      weather_text_color: null,
      last_changed_color: null,
      // Geocoded location (on by default)
      show_geocoded_location: true,
      // Maps integration (opt-in: 'google' | 'apple' | 'osm', null = disabled)
      maps_provider: null,
      // Modern layout options
      modern_picture_size: 40,
      modern_ring_size: 38,
      modern_show_battery_ring: true,
      modern_show_travel_ring: true,
      modern_travel_max_time: 60,
      modern_distance_max: 100,
      modern_name_font_size: '14px',
      modern_state_font_size: '12px',
      ...config
    };
  }

  getCardSize() {
    return 3;
  }

  shouldUpdate(changedProps) {
    if (!this.config) {
      return false;
    }

    if (changedProps.has('config')) {
      return true;
    }

    const oldHass = changedProps.get('hass');
    if (!oldHass) {
      return true;
    }

    // Check the primary entity
    if (oldHass.states[this.config.entity] !== this.hass.states[this.config.entity]) {
      return true;
    }

    // If triggers_update is 'entity', update only for the primary entity
    if (this.config.triggers_update === 'entity') {
      return false;
    }

    // Check related entities if configured
    const relatedEntities = this._getRelatedEntities();
    for (const entityId of relatedEntities) {
      if (oldHass.states[entityId] !== this.hass.states[entityId]) {
        return true;
      }
    }

    return false;
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (this.hass && this.config) {
      if (!this._resolvedPrefix || changedProps.has('config') || changedProps.has('hass')) {
        this._resolvedPrefix = this._resolveDevicePrefix();
        this._resolvedPrefix2 = this._resolveDevicePrefix2();
      }
      this._updateSensorData();
    }

    if (this.config?.show_geocoded_location) {
      requestAnimationFrame(() => this._checkGeoOverflow());
    }
  }

  _getRelatedEntities() {
    const entities = [];
    const entityBase = this.config.entity.replace('person.', '');
    const p = this._resolvedPrefix;

    if (this.config.show_battery) {
      entities.push(this.config.battery_sensor || (p ? `sensor.${p}_battery_level` : `sensor.phone_${entityBase}_battery_level`));
      const bsId = this.config.battery_state_sensor || (p ? `sensor.${p}_battery_state` : null);
      if (bsId) entities.push(bsId);
    }
    if (this.config.show_watch_battery) {
      entities.push(this.config.watch_battery_sensor || (p ? `sensor.${p}_watch_battery_level` : `sensor.watch_${entityBase}_battery_level`));
      const wsId = this.config.watch_battery_state_sensor || (p ? `sensor.${p}_watch_battery_state` : null);
      if (wsId) entities.push(wsId);
    }
    if (this.config.show_activity) {
      entities.push(this.config.activity_sensor || (p ? `sensor.${p}_activity` : `sensor.phone_${entityBase}_activity`));
    }
    if (this.config.show_connection) {
      entities.push(this._getConnectionSensorId(p || entityBase, !!p));
    }
    if (this.config.show_distance && this.config.distance_sensor) {
      entities.push(this.config.distance_sensor);
    }
    if (this.config.show_travel_time && this.config.travel_sensor) {
      entities.push(this.config.travel_sensor);
    }
    if (this.config.show_distance_2 && this.config.distance_sensor_2) {
      entities.push(this.config.distance_sensor_2);
    }
    if (this.config.show_travel_time_2 && this.config.travel_sensor_2) {
      entities.push(this.config.travel_sensor_2);
    }
    if (this.config.show_weather && this.config.weather_entity) {
      entities.push(this.config.weather_entity);
    }
    if (this.config.show_device_2_battery !== false) {
      const d2Id = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
      if (d2Id) entities.push(d2Id);
      const d2StateId = this.config.device_2_battery_state_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_state` : null);
      if (d2StateId) entities.push(d2StateId);
    }
    if (this.config.state_entity) entities.push(this.config.state_entity);

    if (this.config.extra_chips) {
      for (const chip of this.config.extra_chips) {
        if (chip.entity) entities.push(chip.entity);
      }
    }

    if (this.config.wifi_ssid_sensor) entities.push(this.config.wifi_ssid_sensor);

    return entities;
  }

  _updateSensorData() {
    const entityBase = this.config.entity.replace('person.', '');
    const p = this._resolvedPrefix;

    // Battery
    if (this.config.show_battery) {
      const batteryEntityId = this.config.battery_sensor || (p ? `sensor.${p}_battery_level` : `sensor.phone_${entityBase}_battery_level`);
      const batteryEntity = this.hass.states[batteryEntityId];
      if (batteryEntity) {
        const newLevel = parseFloat(batteryEntity.state) || 0;
        const newIcon = batteryEntity.attributes?.icon || 'mdi:battery';

        if (this._batteryLevel !== newLevel) {
          this._batteryLevel = newLevel;
        }
        if (this._batteryIcon !== newIcon) {
          this._batteryIcon = newIcon;
        }
      }

      // Battery charging state — auto-detect sensor.{prefix}_battery_state
      const batteryStateEntityId = this.config.battery_state_sensor || (p ? `sensor.${p}_battery_state` : null);
      if (batteryStateEntityId) {
        const batteryStateEntity = this.hass.states[batteryStateEntityId];
        if (batteryStateEntity) {
          const newChargingState = this._isChargingState(
            batteryStateEntity.state,
            this.config.battery_charging_value
          );

          if (this._batteryCharging !== newChargingState) {
            this._batteryCharging = newChargingState;
          }
        }
      }
    }

    // Device 2 Battery (tablet/laptop)
    if (this.config.show_device_2_battery !== false) {
      const d2Id = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
      if (d2Id) {
        const d2Entity = this.hass.states[d2Id];
        if (d2Entity) {
          const newLevel = parseFloat(d2Entity.state) || 0;
          const newIcon = d2Entity.attributes?.icon || 'mdi:battery';
          if (this._battery2Level !== newLevel) this._battery2Level = newLevel;
          if (this._battery2Icon !== newIcon) this._battery2Icon = newIcon;
        }
      }
      const d2StateId = this.config.device_2_battery_state_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_state` : null);
      if (d2StateId) {
        const d2StateEntity = this.hass.states[d2StateId];
        if (d2StateEntity) {
          const newCharging = this._isChargingState(d2StateEntity.state, this.config.battery_charging_value);
          if (this._battery2Charging !== newCharging) this._battery2Charging = newCharging;
        }
      }
    }

    // Watch Battery
    if (this.config.show_watch_battery) {
      const watchBatteryEntityId = this.config.watch_battery_sensor || (p ? `sensor.${p}_watch_battery_level` : `sensor.watch_${entityBase}_battery_level`);
      const watchBatteryEntity = this.hass.states[watchBatteryEntityId];
      if (watchBatteryEntity) {
        const newLevel = parseFloat(watchBatteryEntity.state) || 0;
        const newIcon = watchBatteryEntity.attributes?.icon || 'mdi:battery';

        if (this._watchBatteryLevel !== newLevel) {
          this._watchBatteryLevel = newLevel;
        }
        if (this._watchBatteryIcon !== newIcon) {
          this._watchBatteryIcon = newIcon;
        }
      }

      // Watch Battery charging state — auto-detect sensor.{prefix}_watch_battery_state
      const watchBatteryStateEntityId = this.config.watch_battery_state_sensor || (p ? `sensor.${p}_watch_battery_state` : null);
      if (watchBatteryStateEntityId) {
        const watchBatteryStateEntity = this.hass.states[watchBatteryStateEntityId];
        if (watchBatteryStateEntity) {
          const newChargingState = this._isChargingState(
            watchBatteryStateEntity.state,
            this.config.watch_battery_charging_value
          );

          if (this._watchBatteryCharging !== newChargingState) {
            this._watchBatteryCharging = newChargingState;
          }
        }
      }
    }

    // Activity — auto-detect sensor.{prefix}_activity
    if (this.config.show_activity) {
      const activityEntityId = this.config.activity_sensor || (p ? `sensor.${p}_activity` : `sensor.phone_${entityBase}_activity`);
      const activityEntity = this.hass.states[activityEntityId];

      // Lista stati da escludere (case insensitive)
      const invalidStates = ['unknown', 'unavailable', 'none', 'null', ''];

      if (
        activityEntity &&
        !invalidStates.includes((activityEntity.state || '').toLowerCase().trim())
      ) {
        this._activity = activityEntity.state;
        // Legge l'icona dall'attributo icon dell'entità, se non presente usa il mapping hardcoded
        if (activityEntity.attributes?.icon) {
          this._activityIcon = activityEntity.attributes.icon;
        } else {
          this._activityIcon = this._getActivityIcon();
        }
      } else {
        // Reset per valori non validi
        this._activity = 'unknown';
        this._activityIcon = '';
      }
    }


    // Connection (Fix #14: iOS uses network_type, Android uses connection_type)
    if (this.config.show_connection) {
      const connectionEntityId = this._getConnectionSensorId(p || entityBase, !!p);
      const connectionEntity = this.hass.states[connectionEntityId];
      if (connectionEntity) {
        this._connectionType = connectionEntity.state;
        this._connectionIcon = connectionEntity.attributes?.icon || null;
      }
    }

    // Distance — only use explicitly configured sensor
    if (this.config.show_distance && this.config.distance_sensor) {
      const distanceEntityId = this.config.distance_sensor;
      const distanceEntity = this.hass.states[distanceEntityId];
      const validState = distanceEntity &&
        distanceEntity.state !== 'unavailable' &&
        distanceEntity.state !== 'unknown';
      if (validState) {
        const hasDistAttr = distanceEntity.attributes?.distance !== undefined;
        const distVal = hasDistAttr ? distanceEntity.attributes.distance : distanceEntity.state;
        this._distanceFromHome = parseFloat(distVal) || 0;
        const autoUnit = hasDistAttr
          ? (this.hass.config?.unit_system?.length || 'km')
          : (distanceEntity.attributes?.unit_of_measurement || 'km');
        this._distanceUnit = this.config.distance_unit || autoUnit;
        this._distanceIcon = distanceEntity.attributes?.icon || 'mdi:map-marker-distance';
        this._distanceSensorFound = true;
      } else {
        this._distanceSensorFound = false;
      }
    }

    // Travel time
    if (this.config.show_travel_time) {
      const travelEntityId = this.config.travel_sensor || `sensor.home_work_${entityBase}`;
      const travelEntity = this.hass.states[travelEntityId];
      if (travelEntity) {
        this._travelTime = this._parseTravelMinutes(travelEntity.state);
        // Legge l'icona dall'entità se disponibile
        this._travelIcon = travelEntity.attributes?.icon || 'mdi:car-clock';
      }
    }

    // Distance sensor 2 (lavoro → casa)
    if (this.config.show_distance_2 && this.config.distance_sensor_2) {
      const d2Entity = this.hass.states[this.config.distance_sensor_2];
      const valid2 = d2Entity && d2Entity.state !== 'unavailable' && d2Entity.state !== 'unknown';
      if (valid2) {
        const hasDistAttr2 = d2Entity.attributes?.distance !== undefined;
        const distVal2 = hasDistAttr2 ? d2Entity.attributes.distance : d2Entity.state;
        this._distanceFromHome2 = parseFloat(distVal2) || 0;
        const autoUnit2 = hasDistAttr2
          ? (this.hass.config?.unit_system?.length || 'km')
          : (d2Entity.attributes?.unit_of_measurement || 'km');
        this._distanceUnit2 = this.config.distance_unit || autoUnit2;
        this._distanceIcon2 = d2Entity.attributes?.icon || 'mdi:map-marker-distance';
        this._distanceSensorFound2 = true;
      } else {
        this._distanceSensorFound2 = false;
      }
    }

    // Travel time sensor 2 (e.g. travel time to work)
    if (this.config.show_travel_time_2 && this.config.travel_sensor_2) {
      const t2Entity = this.hass.states[this.config.travel_sensor_2];
      if (t2Entity) {
        this._travelTime2 = this._parseTravelMinutes(t2Entity.state);
        this._travelIcon2 = t2Entity.attributes?.icon || 'mdi:car-clock';
      }
    }

    // Weather
    if (this.config.show_weather && this.config.weather_entity) {
      const weatherEntity = this.hass.states[this.config.weather_entity];
      if (weatherEntity) {
        this._weatherState = weatherEntity.state;
        const temp = weatherEntity.attributes?.temperature;
        const unit = weatherEntity.attributes?.temperature_unit || '°';
        this._weatherTemp = temp != null ? `${Math.round(temp)}${unit}` : null;
      }
    }

    // Geocoded location (device 1 only)
    if (this.config.show_geocoded_location) {
      const geoId = this.config.geocoded_location_entity || (p ? `sensor.${p}_geocoded_location` : null);
      if (geoId) {
        const geoEntity = this.hass.states[geoId];
        const newGeo = (geoEntity && geoEntity.state !== 'unavailable' && geoEntity.state !== 'unknown') ? geoEntity.state : null;
        if (this._geocodedLocation !== newGeo) this._geocodedLocation = newGeo;
      } else {
        this._geocodedLocation = null;
      }
    } else {
      this._geocodedLocation = null;
    }

    // Wi-Fi SSID
    if (this.config.wifi_ssid_sensor) {
      const ssidEntity = this.hass.states[this.config.wifi_ssid_sensor];
      const ssidVal = (ssidEntity && ssidEntity.state !== 'unavailable' && ssidEntity.state !== 'unknown') ? ssidEntity.state : null;
      if (this._wifiSSID !== ssidVal) this._wifiSSID = ssidVal;
    } else {
      this._wifiSSID = null;
    }

    // GPS coordinates for maps integration
    const personEntityForGps = this.hass.states[this.config.entity];
    this._gpsLat = personEntityForGps?.attributes?.latitude ?? null;
    this._gpsLon = personEntityForGps?.attributes?.longitude ?? null;
  }

  _getActivityIcon() {
    const activity = this._activity?.toLowerCase() || '';
    const icons = {
      'walking': 'mdi:walk',
      'running': 'mdi:run',
      'automotive': 'mdi:car',
      'stationary': 'mdi:human',
      'cycling': 'mdi:bike',
      'still': 'mdi:human-handsdown',
      'unknown': 'mdi:help-circle-outline',
      'tilting': 'mdi:phone-rotate-landscape',
      'on_foot': 'mdi:walk',
      'on_bicycle': 'mdi:bike',
      'in_vehicle': 'mdi:car',
      // Italiano
      'a piedi': 'mdi:walk',
      'in bicicletta': 'mdi:bike',
      'in auto': 'mdi:car',
      'fermo': 'mdi:human-handsdown',
      'corsa': 'mdi:run'
    };
    return icons[activity] || 'mdi:human-male';
  }

  _getBatteryColor(level) {
    const batteryLevel = level !== undefined ? level : this._batteryLevel;
    if (batteryLevel < 10) return '#e45649';
    if (batteryLevel < 20) return '#e45649';
    if (batteryLevel < 30) return '#ff9800';
    if (batteryLevel < 50) return '#ffa229';
    if (batteryLevel < 80) return '#8bc34a';
    return '#50A14F';
  }

  // Fix #14: resolve connection sensor ID with iOS fallback (network_type vs connection_type)
  // When isPrefix=true, the name is already the full device prefix (e.g. "iphonedavide")
  // When isPrefix=false, it's the person entityBase used with "phone_" prefix pattern
  _getConnectionSensorId(name, isPrefix = false) {
    if (this.config.connection_sensor) return this.config.connection_sensor;
    const primary = isPrefix ? `sensor.${name}_connection_type` : `sensor.phone_${name}_connection_type`;
    const fallback = isPrefix ? `sensor.${name}_network_type` : `sensor.phone_${name}_network_type`;
    return (this.hass && this.hass.states[primary]) ? primary : fallback;
  }

  // Check if connection type is WiFi (case-insensitive, handles iOS "Wi-Fi" and Android "wifi")
  _isWifiConnection(connectionType) {
    if (!connectionType) return false;
    const normalized = connectionType.toLowerCase().replace(/[-_\s]/g, '');
    return normalized === 'wifi';
  }

  // Returns the WiFi label: SSID from wifi_ssid_sensor if configured, otherwise 'WiFi'
  _getWifiLabel() {
    return this._wifiSSID || 'WiFi';
  }

  // Resolve the mobile_app device prefix for the configured person entity.
  // Reads person.attributes.device_trackers, finds the first device_tracker
  // that has a corresponding battery sensor in hass, and returns its suffix
  // (e.g. "iphonedavide" from "device_tracker.iphonedavide").
  // Falls back to scanning all device_trackers whose name contains the person name.
  _resolveDevicePrefix() {
    if (!this.hass || !this.config.entity) return null;
    const personEntity = this.hass.states[this.config.entity];
    if (!personEntity) return null;

    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }

    // Fallback: scan all device_trackers whose name contains the person name
    const personName = this.config.entity.replace('person.', '');
    for (const entityId of Object.keys(this.hass.states)) {
      if (!entityId.startsWith('device_tracker.')) continue;
      const prefix = entityId.replace('device_tracker.', '');
      if (prefix.includes(personName) && this.hass.states[`sensor.${prefix}_battery_level`]) {
        return prefix;
      }
    }

    return null;
  }

  // Resolve the second device (tablet/laptop) prefix — skips the first resolved prefix.
  _resolveDevicePrefix2() {
    if (!this.hass || !this.config.entity) return null;
    const personEntity = this.hass.states[this.config.entity];
    if (!personEntity) return null;
    const skip = this._resolvedPrefix;

    const deviceTrackers = personEntity.attributes?.device_trackers || [];
    for (const dt of deviceTrackers) {
      const prefix = dt.replace('device_tracker.', '');
      if (prefix === skip) continue;
      if (this.hass.states[`sensor.${prefix}_battery_level`]) return prefix;
    }
    return null;
  }

  // Return mdi icon based on device sensor entity ID or prefix name
  _getDeviceIcon(entityIdOrPrefix) {
    if (!entityIdOrPrefix) return 'mdi:cellphone';
    const p = entityIdOrPrefix.replace('sensor.', '').replace('_battery_level', '').toLowerCase();
    if (/ipad|tablet|galaxy.?tab|lenovo.?tab/.test(p)) return 'mdi:tablet';
    if (/mac|laptop|macbook|surface|notebook|book|pc|computer/.test(p)) return 'mdi:laptop';
    return 'mdi:cellphone';
  }

  // Open more-info dialog for an entity
  _showMoreInfo(entityId) {
    if (!entityId) return;
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  // Handle tap_action (Fix #17: configurable on-tap behaviour)
  _handleTapAction() {
    const action = this.config.tap_action || { action: 'more-info' };
    switch (action.action) {
      case 'more-info':
        this._showMoreInfo(action.entity || this.config.entity);
        break;
      case 'navigate':
        if (action.navigation_path) {
          window.history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
        }
        break;
      case 'url':
        if (action.url_path) {
          window.open(action.url_path, action.url_target || '_blank');
        }
        break;
      case 'call-service': {
        if (!action.service) break;
        const [domain, service] = action.service.split('.');
        const target = action.target && Object.keys(action.target).length ? action.target : undefined;
        const svcData = { ...(target ? {} : { entity_id: this.config.entity }), ...(action.service_data || {}) };
        this.hass.callService(domain, service, svcData, target);
        break;
      }
      case 'none':
      default:
        break;
    }
  }

  // Handle per-chip tap action (extra_chips)
  _handleExtraChipAction(chip) {
    const action = chip.tap_action || { action: 'more-info' };
    switch (action.action) {
      case 'more-info':
        this._showMoreInfo(chip.entity);
        break;
      case 'navigate':
        if (action.navigation_path) {
          window.history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
        }
        break;
      case 'url':
        if (action.url_path) {
          window.open(action.url_path, action.url_target || '_blank');
        }
        break;
      case 'call-service': {
        if (!action.service) break;
        const [domain, svc] = action.service.split('.');
        const chipTarget = action.target && Object.keys(action.target).length ? action.target : undefined;
        const chipSvcData = { ...(chipTarget ? {} : { entity_id: chip.entity }), ...(action.service_data || {}) };
        this.hass.callService(domain, svc, chipSvcData, chipTarget);
        break;
      }
      case 'none':
      default:
        break;
    }
  }

  _openMaps(e) {
    if (e) e.stopPropagation();
    if (!this._gpsLat || !this._gpsLon || !this.config.maps_provider) return;
    const urls = {
      google: `https://www.google.com/maps?q=${this._gpsLat},${this._gpsLon}`,
      apple:  `https://maps.apple.com/?ll=${this._gpsLat},${this._gpsLon}`,
      osm:    `https://www.openstreetmap.org/?mlat=${this._gpsLat}&mlon=${this._gpsLon}`,
    };
    window.open(urls[this.config.maps_provider] || urls.google, '_blank');
  }

  // Get sensor entity ID for a specific type
  _getSensorEntityId(type) {
    const entityBase = this.config.entity?.split('.')[1] || '';
    const p = this._resolvedPrefix;
    const sensorMap = {
      'battery': this.config.battery_sensor || (p ? `sensor.${p}_battery_level` : `sensor.phone_${entityBase}_battery_level`),
      'watch_battery': this.config.watch_battery_sensor || (p ? `sensor.${p}_watch_battery_level` : `sensor.watch_${entityBase}_battery_level`),
      'activity': this.config.activity_sensor || (p ? `sensor.${p}_activity` : `sensor.phone_${entityBase}_activity`),
      'connection': this._getConnectionSensorId(p || entityBase, !!p),
      'distance': this.config.distance_sensor || null,
      'travel': this.config.travel_sensor || null,
      'distance_2': this.config.distance_sensor_2 || null,
      'travel_2': this.config.travel_sensor_2 || null,
    };
    return sensorMap[type] || null;
  }

  _getCurrentStateConfig() {
    if (!this.config.state || !this.hass) return undefined;

    const entity = this.hass.states[this.config.entity];
    if (!entity) return undefined;

    return this.config.state.find(s => s.value === entity.state);
  }

  _getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      const unit = diffDay === 1 ? this._t('time.day') : this._t('time.days');
      return `${diffDay} ${unit} ${this._t('time.ago')}`;
    } else if (diffHour > 0) {
      const unit = diffHour === 1 ? this._t('time.hour') : this._t('time.hours');
      return `${diffHour} ${unit} ${this._t('time.ago')}`;
    } else if (diffMin > 0) {
      const unit = diffMin === 1 ? this._t('time.minute') : this._t('time.minutes');
      return `${diffMin} ${unit} ${this._t('time.ago')}`;
    } else {
      return this._t('time.just_now');
    }
  }

  _getPositionStyles(position) {
    const positions = {
      'top-left': { top: '8px', left: '8px' },
      'top-right': { top: '8px', right: '8px' },
      'top-left-2': { top: '40px', left: '8px' },
      'top-right-2': { top: '40px', right: '8px' },
      'bottom-left': { bottom: '8px', left: '8px' },
      'bottom-left-2': { bottom: '28px', left: '8px' },
      'bottom-right': { bottom: '8px', right: '8px' },
      'bottom-right-2': { bottom: '28px', right: '8px' },
      'top-right-3': { top: '72px', right: '8px' },
      'top-left-3': { top: '72px', left: '8px' }
    };

    if (!position || !(position in positions)) {
      console.warn(`Invalid position "${position}" received, defaulting to "top-right"`);
      return positions['top-right'];
    }
    return positions[position];
  }

  // Get border color based on person state
  _getStateBorderColor(state) {
    if (!state) return 'gray';

    const lowerState = state.toLowerCase();
    if (lowerState === 'home') return '#50A14F';
    if (lowerState === 'not_home') return '#e45649';
    return '#ff9800'; // orange for other locations (zones)
  }

  // Get ring background color - adapts to light/dark theme
  _getRingBackgroundColor() {
    // Try to detect theme from CSS variables
    if (this.shadowRoot) {
      const computedStyle = getComputedStyle(this);
      const bgColor = computedStyle.getPropertyValue('--primary-background-color').trim();

      // If we can get the background color, check if it's light or dark
      if (bgColor) {
        // Parse the color to determine brightness
        const isLight = this._isLightColor(bgColor);
        return isLight ? '#d0d0d0' : '#333333';
      }
    }
    // Default to dark theme background
    return '#333333';
  }

  // Check if a color is light (for theme detection)
  _isLightColor(color) {
    // Handle rgb/rgba format
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }

    // Handle hex format
    const hexMatch = color.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }

    // Default to dark theme
    return false;
  }

  // Check if battery is charging based on state value
  // Supports custom value or auto-detection from predefined list
  _isChargingState(stateValue, customChargingValue) {
    if (!stateValue) return false;

    const state = String(stateValue).toLowerCase().trim();

    // If user specified a custom charging value, use exact match
    if (customChargingValue) {
      return state === customChargingValue.toLowerCase().trim();
    }

    // Auto-detect using predefined list of charging states
    const CHARGING_STATES = [
      'charging',      // iOS/Android Companion App
      'in carica',     // Italian
      'carica',        // Italian short
      'full',          // Full battery (still connected)
      'piena',         // Italian full
      'on',            // Binary sensor
      'true',          // Boolean
      '1',             // Numeric boolean
      'connected',     // Some devices
      'ac',            // AC power
      'usb',           // USB charging
      'wireless',      // Wireless charging
      'plugged',       // Plugged in
      'yes',           // Some devices
      'attivo',        // Italian active
      'en charge',     // French
      'laden',         // German
      'aufladen'       // German
    ];

    return CHARGING_STATES.includes(state);
  }

  // ===== WEATHER BACKGROUND ANIMATION =====

  _rng(seed) {
    let s = 0;
    for (let i = 0; i < seed.length; i++) s = ((s * 31) + seed.charCodeAt(i)) | 0;
    s = s || 12345;
    return () => { s = Math.imul(s, 1664525) + 1013904223 | 0; return (s >>> 0) / 0xffffffff; };
  }

  _getPairAnimationStyles(theme) {
    const styles = {
      classic: `
        @keyframes classic-inner-a{0%,43%{opacity:1;transform:translateY(0)}50%,93%{opacity:0;transform:translateY(-5px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes classic-inner-b{0%,43%{opacity:0;transform:translateY(5px)}50%,93%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(5px)}}
        .classic-pair{position:relative;display:inline-flex;align-items:center;justify-content:center}
        .classic-pair .pair-a{animation:classic-inner-a 8s ease-in-out infinite;display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap}
        .classic-pair .pair-b{animation:classic-inner-b 8s ease-in-out infinite;display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap;position:absolute;inset:0}`,
      compact: `
        @keyframes pair-a-compact{0%,43%{opacity:1;transform:rotateX(0deg)}50%,93%{opacity:0;transform:rotateX(90deg)}100%{opacity:1;transform:rotateX(0deg)}}
        @keyframes pair-b-compact{0%,43%{opacity:0;transform:rotateX(-90deg)}50%,93%{opacity:1;transform:rotateX(0deg)}100%{opacity:0;transform:rotateX(-90deg)}}
        .pair-a-compact{animation:pair-a-compact 8s ease-in-out infinite;transform-origin:center}
        .pair-b-compact{animation:pair-b-compact 8s ease-in-out infinite;transform-origin:center}
        .sensor-pair-compact{position:relative;flex-shrink:0}
        .sensor-pair-compact>*{position:absolute;top:0;left:0;right:0;bottom:0}
        @keyframes geo-state-slide{0%,42%{opacity:1;transform:translateY(0)}48%,92%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes geo-addr-slide{0%,42%{opacity:0;transform:translateY(6px)}48%,92%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(6px)}}
        .geo-wrap{position:relative;overflow:hidden;display:flex;align-items:center;min-height:1.2em}
        .geo-state{animation:geo-state-slide 7s ease-in-out infinite}
        .geo-addr{animation:geo-addr-slide 7s ease-in-out infinite;position:absolute;left:0;right:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
      modern: `
        @keyframes pair-a-modern{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-modern{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-modern{animation:pair-a-modern 8s ease-in-out infinite}
        .pair-b-modern{animation:pair-b-modern 8s ease-in-out infinite}
        .sensor-pair-modern{position:relative;flex-shrink:0}`,
      neon: `
        @keyframes pair-a-neon{0%,40%{opacity:1;transform:translateX(0);filter:none}44%{opacity:.4;transform:translateX(-2px);filter:hue-rotate(60deg) brightness(2)}50%,93%{opacity:0;transform:translateX(0);filter:none}97%{opacity:.3;filter:brightness(1.5)}100%{opacity:1}}
        @keyframes pair-b-neon{0%,43%{opacity:0;filter:none}47%{opacity:.4;transform:translateX(2px);filter:hue-rotate(120deg) brightness(2)}50%,90%{opacity:1;transform:translateX(0);filter:none}94%{opacity:.4;transform:translateX(-1px);filter:hue-rotate(60deg)}100%{opacity:0}}
        .pair-a-neon{animation:pair-a-neon 8s ease-in-out infinite;display:flex;align-items:center;gap:4px;white-space:nowrap}
        .pair-b-neon{animation:pair-b-neon 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap}
        .sensor-pair-neon{position:relative;flex-shrink:0;display:inline-flex;align-items:center;overflow:hidden}`,
      glass: `
        @keyframes pair-a-glass{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-glass{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-glass{animation:pair-a-glass 8s ease-in-out infinite;display:flex;align-items:center;gap:5px;white-space:nowrap}
        .pair-b-glass{animation:pair-b-glass 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
        .sensor-pair-glass{position:relative;flex-shrink:0;display:inline-flex;align-items:center;overflow:hidden}`,
      bio: `
        @keyframes pair-a-bio{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-bio{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-bio{animation:pair-a-bio 8s ease-in-out infinite}
        .pair-b-bio{animation:pair-b-bio 8s ease-in-out infinite}
        .sensor-pair-bio{position:relative;flex-shrink:0;display:inline-flex;align-items:center;overflow:hidden}`,
      holo: `
        @keyframes pair-a-holo{0%,48%{opacity:1}50%,98%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-holo{0%,48%{opacity:0}50%,98%{opacity:1}100%{opacity:0}}
        .pair-a-holo{animation:pair-a-holo 8s linear infinite}
        .pair-b-holo{animation:pair-b-holo 8s linear infinite}
        .sensor-pair-holo{position:relative;flex-shrink:0;min-width:44px;height:42px}
        .sensor-pair-holo>*{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}`,
      wxstation: `
        @keyframes pair-a-wx{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-wx{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-wx{animation:pair-a-wx 8s ease-in-out infinite;display:flex;align-items:center;gap:4px;white-space:nowrap}
        .pair-b-wx{animation:pair-b-wx 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap}
        .sensor-pair-wx{position:relative;overflow:hidden;display:inline-flex;align-items:center;flex-shrink:0;}`,
      matrix: `
        @keyframes pair-a-matrix{0%,43%{opacity:1}50%,93%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-matrix{0%,43%{opacity:0}50%,93%{opacity:1}100%{opacity:0}}
        .pair-a-matrix{animation:pair-a-matrix 8s ease-in-out infinite;display:flex;align-items:center;gap:5px;white-space:nowrap}
        .pair-b-matrix{animation:pair-b-matrix 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;gap:5px;white-space:nowrap}
        .sensor-pair-matrix{position:relative;overflow:hidden;display:inline-flex;align-items:center;flex-shrink:0;}`,
      orbital: `
        @keyframes pair-a-orbital{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-orbital{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-orbital{animation:pair-a-orbital 8s ease-in-out infinite;display:flex;align-items:center;gap:5px;white-space:nowrap}
        .pair-b-orbital{animation:pair-b-orbital 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
        .sensor-pair-orbital{position:relative;overflow:hidden;display:inline-flex;align-items:center;flex-shrink:0;}`,
      ink: `
        @keyframes pair-a-ink{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
        @keyframes pair-b-ink{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
        .pair-a-ink{animation:pair-a-ink 8s ease-in-out infinite;display:flex;align-items:center;gap:5px;white-space:nowrap}
        .pair-b-ink{animation:pair-b-ink 8s ease-in-out infinite;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
        .sensor-pair-ink{position:relative;overflow:hidden;display:inline-flex;align-items:center;flex-shrink:0;}`,
    };
    const geoStyle = `
      @keyframes geo-ticker{0%,15%{transform:translateX(0)}85%,100%{transform:translateX(var(--geo-overflow,0px))}}
      .geo-marquee-outer{overflow:hidden;width:100%;cursor:pointer}
      .geo-marquee-inner{display:inline-block;white-space:nowrap;will-change:transform}
      .geo-marquee-outer.geo-scrolling{text-align:left!important}`;
    return (styles[theme] || '') + geoStyle;
  }

  _renderGeocoded(entityId, style = '') {
    if (!this._geocodedLocation || !entityId) return html``;
    const text = this._geocodedLocation;
    // Structural styles always applied; animation applied after render by _checkGeoOverflow()
    const hasMaps = !!(this.config.maps_provider && this._gpsLat && this._gpsLon);
    return html`
      <div class="geo-marquee-outer clickable"
           @click=${(e) => { e.stopPropagation(); hasMaps ? this._openMaps(e) : this._showMoreInfo(entityId); }}
           style="display:block;width:100%;min-width:0;max-width:100%;overflow:hidden;align-self:stretch;box-sizing:border-box;cursor:pointer;${style}">
        <span class="geo-marquee-inner">📍 ${text}</span>
      </div>`;
  }

  _checkGeoOverflow() {
    this.shadowRoot?.querySelectorAll('.geo-marquee-outer').forEach(outer => {
      const inner = outer.querySelector('.geo-marquee-inner');
      if (!inner) return;
      const overflow = inner.scrollWidth - outer.clientWidth;
      if (overflow > 1) {
        const dur = Math.max(4, overflow * 0.06);
        outer.style.setProperty('--geo-overflow', `-${overflow}px`);
        outer.classList.add('geo-scrolling');
        inner.style.animation = `geo-ticker ${dur}s ease-in-out infinite alternate`;
      } else {
        outer.style.removeProperty('--geo-overflow');
        outer.classList.remove('geo-scrolling');
        inner.style.animation = '';
      }
    });
  }

  _renderWeatherBg() {
    if (!this.config.show_weather || !this._weatherState) return '';
    const state = this._weatherState;
    const isNight = this.hass?.states['sun.sun']?.state === 'below_horizon';
    const bgClass = `weather-bg weather-bg--${state}${isNight ? ' weather-bg--night' : ''}`;
    const r = this._rng(state + (isNight ? '_n' : '_d'));
    let particles;
    if (state === 'sunny' && !isNight) {
      particles = this._wSun(r);
    } else if (state === 'clear-night' || (isNight && state === 'sunny')) {
      particles = this._wStars(18, r, true);
    } else if (state === 'partlycloudy') {
      particles = isNight
        ? html`${this._wStars(8, r, true)}${this._wClouds(2, r, 'night')}`
        : html`${this._wSun(r)}${this._wClouds(2, r, 'day')}`;
    } else if (state === 'cloudy') {
      particles = this._wClouds(5, r, 'grey');
    } else if (state === 'fog') {
      particles = this._wFog(r);
    } else if (state === 'windy' || state === 'windy-variant') {
      particles = this._wWind(10, r);
    } else if (state === 'rainy') {
      particles = html`${this._wClouds(4, r, 'dark')}${this._wRain(26, r, false)}`;
    } else if (state === 'snowy-rainy') {
      particles = html`${this._wClouds(4, r, 'dark')}${this._wRain(18, r, false)}${this._wSnow(8, r)}`;
    } else if (state === 'pouring') {
      particles = html`${this._wClouds(5, r, 'dark')}${this._wRain(40, r, true)}`;
    } else if (state === 'snowy') {
      particles = html`${this._wClouds(3, r, 'grey')}${this._wSnow(18, r)}`;
    } else if (state === 'hail') {
      particles = html`${this._wClouds(4, r, 'dark')}${this._wHail(22, r)}`;
    } else if (state === 'lightning') {
      particles = html`${this._wClouds(5, r, 'storm')}${this._wRain(22, r, false)}${this._wLightning(r)}`;
    } else if (state === 'lightning-rainy') {
      particles = html`${this._wClouds(5, r, 'storm')}${this._wRain(36, r, true)}${this._wLightning(r)}`;
    } else if (state === 'exceptional') {
      particles = this._wExceptional(r);
    } else {
      particles = html``;
    }
    const clickHandler = this.config.weather_entity
      ? () => this._showMoreInfo(this.config.weather_entity)
      : null;
    const showBg = this.config.show_weather_background !== false;
    const showTemp = this.config.show_weather_temperature !== false;
    const floatingTemp = showTemp && this._weatherTemp
      && this.config.layout !== 'classic' && this.config.layout !== 'neon'
      && this.config.layout !== 'glass' && this.config.layout !== 'bio'
      && this.config.layout !== 'modern' && this.config.layout !== 'compact'
      && this.config.layout !== 'holo'
      && this.config.layout !== 'wxstation'
      && this.config.layout !== 'orbital'
      && this.config.layout !== 'ink';
    return html`
      ${showBg ? html`<div class="${bgClass}" @click=${clickHandler}>${particles}</div>` : ''}
      ${floatingTemp ? html`<span class="weather-bg-temp">${this._weatherTemp}</span>` : ''}
    `;
  }

  _wSun(r) {
    const rayCount = 18;
    const rays = Array.from({length: rayCount}, (_, i) => {
      const angle = (360 / rayCount) * i;
      const len  = r() * 55 + 55;
      const dist = r() * 10 + 52;
      const w    = r() * 1.5 + 1.5;
      const op   = r() * 0.4 + 0.2;
      return html`<div class="sun-ray" style="width:${w.toFixed(1)}px;height:${len.toFixed(0)}px;transform:rotate(${angle}deg) translateX(-50%) translateY(${dist.toFixed(0)}px);opacity:${op.toFixed(2)}"></div>`;
    });
    return html`
      <div class="w-sun">
        <div class="sun-halo"></div>
        <div class="sun-rays-wrap">${rays}</div>
        <div class="sun-core"></div>
      </div>
    `;
  }

  _wStars(count, r, withMoon = false) {
    const tClasses = ['t0','t1','t2','t3','t4'];
    const stars = Array.from({length: count}, () => {
      const size  = r() * 1.7 + 0.8;
      const top   = r() * (withMoon ? 70 : 78) + 2;
      const left  = r() * 94 + 3;
      const delay = r() * 5;
      const tc    = tClasses[Math.floor(r() * 5)];
      const sh    = `0 0 ${(size * 2).toFixed(1)}px rgba(220,220,255,${(r() * 0.5 + 0.3).toFixed(2)})`;
      return html`<div class="w-star ${tc}" style="width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;top:${top.toFixed(1)}%;left:${left.toFixed(1)}%;animation-delay:${delay.toFixed(1)}s;box-shadow:${sh}"></div>`;
    });
    let moon = html``;
    let aurora = html``;
    let shootingStar = html``;
    if (withMoon) {
      const craters = [[22,25,14,12],[40,55,8,7],[55,30,6,5]].map(([l,t,w,h]) =>
        html`<div class="moon-crater" style="left:${l}%;top:${t}%;width:${w}px;height:${h}px"></div>`
      );
      moon = html`<div class="w-moon">${craters}</div>`;
      const aColors = ['rgba(0,255,130,.18)','rgba(0,160,255,.14)','rgba(140,0,255,.12)','rgba(0,255,200,.10)'];
      const ribbons = aColors.map((bg, i) => {
        const top   = 8 + i * 9;
        const h     = 120 + Math.floor(r() * 60);
        const anim  = i % 2 === 0 ? 'auroraWave' : 'auroraWave2';
        const dur   = 7 + i * 2.3;
        const delay = i * 1.5;
        return html`<div class="aurora-ribbon" style="top:${top}%;height:${h}px;background:${bg};animation:${anim} ${dur}s ${delay}s ease-in-out infinite"></div>`;
      });
      aurora = html`<div class="w-aurora">${ribbons}</div>`;
      shootingStar = html`<div class="w-shooting-star" style="animation-delay:${(r() * 3).toFixed(1)}s"></div>`;
    }
    return html`<div style="position:absolute;inset:0;pointer-events:none">${moon}${aurora}${shootingStar}${stars}</div>`;
  }

  _wClouds(count, r, variant = 'day') {
    const configs = [
      { top:6,  left:8,  w:200, h:70, delay:0,   anim:'cloudFloat',  op:.88 },
      { top:2,  left:38, w:260, h:85, delay:1.5, anim:'cloudFloat2', op:.78 },
      { top:10, left:60, w:180, h:65, delay:.8,  anim:'cloudFloat3', op:.82 },
      { top:18, left:20, w:140, h:50, delay:2,   anim:'cloudFloat',  op:.65 },
      { top:4,  left:74, w:150, h:55, delay:3,   anim:'cloudFloat2', op:.7  },
    ];
    const bumpBg = { day:'rgba(255,255,255,.9)', night:'rgba(40,55,90,.8)', grey:'rgba(120,130,145,.75)', dark:'rgba(30,35,55,.85)', storm:'rgba(20,15,40,.9)' }[variant] || 'rgba(255,255,255,.9)';
    const take = Math.min(count, configs.length);
    return html`<div style="position:absolute;inset:0;pointer-events:none">${Array.from({length: take}, (_, i) => {
      const cfg = configs[i];
      const dur = 12 + i * 3 + Math.floor(r() * 5);
      return html`
        <div class="w-cloud" style="top:${cfg.top}%;left:${cfg.left}%;animation:${cfg.anim} ${dur}s ${cfg.delay}s ease-in-out infinite">
          <div class="cloud-body w-cloud-${variant}" style="width:${cfg.w}px;height:${cfg.h}px;opacity:${cfg.op}">
            <div style="position:absolute;top:-40%;left:18%;width:${(cfg.w*.45).toFixed(0)}px;height:${(cfg.h*1.1).toFixed(0)}px;border-radius:50%;background:${bumpBg}"></div>
            <div style="position:absolute;top:-55%;left:48%;width:${(cfg.w*.38).toFixed(0)}px;height:${(cfg.h*1.3).toFixed(0)}px;border-radius:50%;background:${bumpBg}"></div>
          </div>
        </div>`;
    })}</div>`;
  }

  _wFog(r) {
    const bands = [
      { top:15, h:55,  op:.22, dur:18, delay:0,   anim:'fogDrift'  },
      { top:30, h:45,  op:.28, dur:22, delay:-5,  anim:'fogDrift2' },
      { top:42, h:60,  op:.32, dur:15, delay:-3,  anim:'fogDrift'  },
      { top:55, h:50,  op:.35, dur:25, delay:-8,  anim:'fogDrift2' },
      { top:65, h:65,  op:.38, dur:20, delay:-2,  anim:'fogDrift'  },
      { top:75, h:70,  op:.42, dur:17, delay:-10, anim:'fogDrift2' },
      { top:82, h:80,  op:.5,  dur:14, delay:-4,  anim:'fogDrift'  },
      { top:88, h:90,  op:.55, dur:28, delay:-6,  anim:'fogDrift2' },
    ];
    return html`<div style="position:absolute;inset:0;pointer-events:none">${bands.map(b => {
      const blur = Math.floor(r() * 17) + 18;
      return html`<div class="w-fog-band" style="top:${b.top}%;height:${b.h}px;background:linear-gradient(to right,transparent,rgba(195,208,220,${b.op}) 30%,rgba(195,208,220,${b.op}) 70%,transparent);filter:blur(${blur}px);animation:${b.anim} ${b.dur}s ${b.delay}s ease-in-out infinite"></div>`;
    })}</div>`;
  }

  _wWind(count, r) {
    const pal = ['255,255,255','200,240,235','180,230,225'];
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length: count}, () => {
      const w    = r() * 160 + 60;
      const top  = r() * 87 + 5;
      const dur  = r() * 1.8 + 1.4;
      const delay= r() * 4;
      const op   = (r() * 0.37 + 0.18).toFixed(2);
      const col  = pal[Math.floor(r() * pal.length)];
      const rgba = `rgba(${col},${op})`;
      const h    = (r() * 1.5 + 1).toFixed(1);
      const blur = (r() + 0.5).toFixed(1);
      return html`<div class="w-wind-line" style="top:${top.toFixed(1)}%;width:${w.toFixed(0)}px;height:${h}px;background:linear-gradient(to right,transparent,${rgba} 40%,${rgba} 80%,transparent);filter:blur(${blur}px);animation:windSweep ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    })}</div>`;
  }

  _wRain(count, r, heavy = false) {
    const drops = Array.from({length: count}, () => {
      const w    = r() * (heavy ? 1 : 0.5) + 1;
      const h    = r() * (heavy ? 20 : 14) + (heavy ? 25 : 14);
      const left = r() * 100;
      const dur  = r() * (heavy ? 0.35 : 0.6) + (heavy ? 0.55 : 0.8);
      const delay= r() * 2;
      const op   = (r() * 0.4 + 0.35).toFixed(2);
      return html`<div class="w-rain-drop" style="left:${left.toFixed(1)}%;width:${w.toFixed(1)}px;height:${h.toFixed(0)}px;opacity:${op};animation:${heavy ? 'rainFallHeavy' : 'rainFall'} ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    });
    const splashes = Array.from({length: 6}, () => {
      const left = r() * 85 + 5;
      const size = r() * 12 + 8;
      const delay= r();
      const dur  = r() * 0.4 + 0.4;
      return html`<div class="w-splash" style="left:${left.toFixed(1)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;animation-delay:${delay.toFixed(2)}s;animation-duration:${dur.toFixed(2)}s"></div>`;
    });
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden"><div class="rain-atmosphere"></div>${drops}${splashes}</div>`;
  }

  _wSnow(count, r) {
    const flakes = ['❄','❅','❆','✻','✼'];
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length: count}, () => {
      const size  = r() * 16 + 10;
      const left  = r() * 100;
      const dur   = r() * 6 + 4;
      const delay = r() * 6;
      const sx    = r() * 120 - 60;
      const sr    = (r() * 280 + 120) * (r() > 0.5 ? 1 : -1);
      const ch    = flakes[Math.floor(r() * flakes.length)];
      return html`<div class="w-snowflake" style="left:${left.toFixed(1)}%;font-size:${size.toFixed(0)}px;--sx:${sx.toFixed(0)}px;--sr:${sr.toFixed(0)}deg;animation-duration:${dur.toFixed(1)}s;animation-delay:-${delay.toFixed(1)}s">${ch}</div>`;
    })}<div class="snow-ground"></div></div>`;
  }

  _wHail(count, r) {
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${Array.from({length: count}, () => {
      const size  = r() * 7 + 5;
      const left  = r() * 100;
      const dur   = r() * 0.3 + 0.45;
      const delay = r() * 2.5;
      const hx    = r() * 60 - 30;
      return html`<div class="w-hail-drop" style="left:${left.toFixed(1)}%;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;--hx:${hx.toFixed(0)}px;animation:hailFall ${dur.toFixed(2)}s ${delay.toFixed(2)}s linear infinite"></div>`;
    })}</div>`;
  }

  _wLightning(r) {
    const bolts = Array.from({length: 2}, (_, b) => {
      const left  = 20 + b * 35;
      const dur   = (r() * 2.5 + 2.5).toFixed(1);
      const delay = b * 1.8;
      const steps = Math.floor(r() * 5) + 7;
      let d = `M 35 0`; let x = 35, y = 0;
      for (let i = 0; i < steps; i++) {
        x += r() * 36 - 18; y += 200 / steps;
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        if (r() < 0.4 && i < steps - 2) {
          const bx = x + r() * 50 - 25; const by = y + r() * 30 + 20;
          d += ` M ${x.toFixed(1)} ${y.toFixed(1)} L ${bx.toFixed(1)} ${by.toFixed(1)} M ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
      }
      return html`<div class="w-lightning-bolt" style="top:0;left:${left}%;animation:boltFlash ${dur}s ${delay}s ease-in-out infinite">
        <svg width="70" height="200" viewBox="0 0 70 200" class="bolt-svg">
          <path d="${d}" stroke="rgba(200,160,255,.3)" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="${d}" stroke="#d0b0ff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></div>`;
    });
    const flashDur = (r() * 2.5 + 2.5).toFixed(1);
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
      <div class="w-sky-flash" style="animation-duration:${flashDur}s"></div>${bolts}</div>`;
  }

  _wExceptional(r) {
    const particles = Array.from({length: 30}, () => {
      const size  = r() * 6 + 2;
      const dr    = r() * 70 + 20;
      const dur   = r() * 5 + 3;
      const delay = r() * 5;
      const angle = r() * 360;
      const rc    = Math.floor(r() * 55) + 200;
      const gc    = Math.floor(r() * 80) + 80;
      const bc    = Math.floor(r() * 50) + 10;
      const op    = (r() * 0.4 + 0.3).toFixed(2);
      const blur  = r().toFixed(1);
      return html`<div class="w-exceptional-particle" style="top:60%;left:50%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;--dr:${dr.toFixed(0)}px;filter:blur(${blur}px);animation:dustSwirl ${dur.toFixed(1)}s ${delay.toFixed(1)}s linear infinite;transform:rotate(${angle.toFixed(0)}deg);background:rgba(${rc},${gc},${bc},${op})"></div>`;
    });
    const windLines = Array.from({length: 12}, () => {
      const dur   = r() * 1.5 + 1;
      const top   = r() * 80 + 10;
      const op    = (r() * 0.23 + 0.12).toFixed(2);
      const w     = r() * 140 + 40;
      const h     = (r() + 1).toFixed(1);
      const delay = (r() * 3).toFixed(1);
      const rgba  = `rgba(255,160,80,${op})`;
      return html`<div class="w-wind-line" style="top:${top.toFixed(1)}%;width:${w.toFixed(0)}px;height:${h}px;background:linear-gradient(to right,transparent,${rgba} 40%,${rgba} 75%,transparent);filter:blur(1px);animation:windSweep ${dur.toFixed(2)}s ${delay}s linear infinite"></div>`;
    });
    return html`<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(255,100,20,.08) 0%,transparent 60%)"></div>
      ${particles}${windLines}</div>`;
  }

  // Get vivid neon color based on person state
  _getNeonStateColor(state) {
    if (!state) return '#888888';
    const lower = state.toLowerCase();
    if (lower === 'home') return '#00ff88';
    if (lower === 'not_home') return '#ff2255';
    return '#ff9500';
  }

  // Get travel time color based on value
  _getTravelTimeColor(travelTime) {
    const maxTime = this.config.modern_travel_max_time || 60;
    if (travelTime >= maxTime * 0.67) return '#e45649'; // red
    if (travelTime >= maxTime * 0.33) return '#ffa229'; // yellow/orange
    return '#50A14F'; // green
  }

  // Parse travel time state into total minutes.
  // Handles: numeric "197", "h:mm" "3:27", "HH:MM:SS" "03:27:00"
  _parseTravelMinutes(state) {
    if (!state || state === 'unavailable' || state === 'unknown') return 0;
    const s = String(state).trim();
    if (s.includes(':')) {
      const parts = s.split(':').map(Number);
      if (parts.length >= 2 && !parts.some(isNaN)) {
        // h:mm or HH:MM or HH:MM:SS
        return parts[0] * 60 + parts[1];
      }
    }
    return parseFloat(s) || 0;
  }

  // Format total minutes as "Xh Ym" when >= 60, otherwise "X min"
  _formatTravelTime(minutes) {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = Math.round(minutes % 60);
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${Math.round(minutes)} min`;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    // If no entity is configured, show a different message
    if (!this.config.entity) {
      return html`
        <ha-card>
          <div class="warning">
            <ha-icon icon="mdi:account-question"></ha-icon>
            <span>Please select a person entity in the configuration</span>
          </div>
        </ha-card>
      `;
    }

    // Scegli il layout in base alla configurazione
    if (this.config.layout === 'compact') {
      return this._renderCompactLayout();
    } else if (this.config.layout === 'modern') {
      return this._renderModernLayout();
    } else if (this.config.layout === 'neon') {
      return this._renderNeonLayout();
    } else if (this.config.layout === 'glass') {
      return this._renderGlassLayout();
    } else if (this.config.layout === 'bio') {
      return this._renderBioLayout();
    } else if (this.config.layout === 'holo') {
      return this._renderHoloLayout();
    } else if (this.config.layout === 'wxstation') {
      return this._renderWxStationLayout();
    } else if (this.config.layout === 'matrix') {
      return this._renderMatrixLayout();
    } else if (this.config.layout === 'orbital') {
      return this._renderOrbitalLayout();
    } else if (this.config.layout === 'ink') {
      return this._renderInkLayout();
    } else {
      return this._renderClassicLayout();
    }
  }

  _getExtraChipIcon(chip, ent) {
    if (chip.icon) return chip.icon;
    if (ent.attributes?.icon) return ent.attributes.icon;
    const id = chip.entity.toLowerCase();
    const dc = (ent.attributes?.device_class || '').toLowerCase();
    if (id.includes('bluetooth')) return 'mdi:bluetooth';
    if (id.includes('android_auto') || id.includes('androidauto')) return 'mdi:car-wireless';
    if (id.includes('phone_state') || id.includes('phone_call') || id.includes('in_call')) return 'mdi:phone';
    if (id.includes('ringer') || id.includes('ringer_mode')) return 'mdi:volume-medium';
    if (id.includes('wifi') || id.includes('wi_fi')) return 'mdi:wifi';
    if (id.includes('charging') || dc === 'battery_charging') return 'mdi:battery-charging';
    if (id.includes('battery')) return 'mdi:battery';
    if (id.includes('screen') || id.includes('display')) return 'mdi:cellphone';
    if (id.includes('headset') || id.includes('headphone')) return 'mdi:headphones';
    if (id.includes('nfc')) return 'mdi:nfc';
    if (id.includes('hotspot')) return 'mdi:wifi-plus';
    if (id.includes('gps') || id.includes('location')) return 'mdi:map-marker';
    if (id.includes('silent') || id.includes('mute')) return 'mdi:volume-off';
    if (id.includes('dnd') || id.includes('do_not_disturb')) return 'mdi:minus-circle';
    const domain = chip.entity.split('.')[0];
    if (domain === 'binary_sensor') return dc === 'motion' ? 'mdi:motion-sensor' : dc === 'door' ? 'mdi:door' : dc === 'window' ? 'mdi:window-open' : 'mdi:checkbox-marked-circle';
    if (domain === 'sensor') return dc === 'temperature' ? 'mdi:thermometer' : dc === 'humidity' ? 'mdi:water-percent' : dc === 'battery' ? 'mdi:battery' : 'mdi:eye';
    if (domain === 'switch') return 'mdi:toggle-switch';
    if (domain === 'light') return 'mdi:lightbulb';
    return 'mdi:information-outline';
  }

  _getExtraChipLabel(chip, ent) {
    if (chip.label !== undefined) return chip.label;
    const domain = chip.entity.split('.')[0];
    const dc = (ent.attributes?.device_class || '').toLowerCase();
    const state = ent.state;
    // Try HA localization first
    const localized = this.hass.localize(`component.${domain}.entity_component.${dc}.state.${state}`)
      || this.hass.localize(`component.${domain}.entity_component._.state.${state}`)
      || this.hass.localize(`state.default.${state}`);
    if (localized) return localized;
    // Fallback translations for common states
    const lang = this.config?.language || this.hass?.language || 'en';
    const trans = { on: {it:'Attivo',en:'On',fr:'Actif',de:'An'}, off: {it:'Inattivo',en:'Off',fr:'Inactif',de:'Aus'} };
    return trans[state]?.[lang] || trans[state]?.en || state;
  }

  _renderExtraChips(mode = 'full', options = {}) {
    if (!this.config.extra_chips?.length) return html``;
    const satClasses = ['orb-sat-6','orb-sat-1','orb-sat-2','orb-sat-3'];
    let orbIdx = 0;
    return this.config.extra_chips.map(chip => {
      const ent = this.hass?.states[chip.entity];
      if (!ent) return html``;
      if (chip.show_when !== undefined && ent.state !== String(chip.show_when)) return html``;
      const icon = this._getExtraChipIcon(chip, ent);
      const colorStyle = chip.color ? `color:${chip.color};` : '';
      const color = chip.color || '#4a9eff';
      const showLabel = mode !== 'icon-only' && mode !== 'modern';
      const label = showLabel ? this._getExtraChipLabel(chip, ent) : '';
      const title = `${ent.attributes?.friendly_name || chip.entity}: ${ent.state}`;

      const chipAction = (e) => { e.stopPropagation(); this._handleExtraChipAction(chip); };
      if (mode === 'icon-only') {
        return html`
          <div class="compact-icon-badge extra-chip-badge clickable" title="${title}"
               style="${colorStyle}" @click=${chipAction}>
            <ha-icon icon="${icon}" style="--mdc-icon-size:14px;"></ha-icon>
          </div>`;
      }
      if (mode === 'modern') {
        const rs = options.ringSize || 38;
        const is = options.ringIconSize || 22;
        return html`
          <div class="ring-container ring-icon-only clickable" title="${title}"
               style="width:${rs}px;height:${rs}px;${colorStyle}"
               @click=${chipAction}>
            <ha-icon icon="${icon}" style="--mdc-icon-size:${is}px;"></ha-icon>
          </div>`;
      }
      if (mode === 'holo') {
        const ar = options.accentRgb || '74,158,255';
        return html`
          <div class="holo-metric clickable" style="cursor:pointer;${colorStyle}" title="${title}"
               @click=${chipAction}>
            <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${ar},0.35),transparent);"></div>
            <ha-icon icon="${icon}" style="--mdc-icon-size:13px;"></ha-icon>
            <div class="holo-mu">${label}</div>
          </div>`;
      }
      if (mode === 'wxstation') {
        return html`
          <div class="wx-chip clickable" title="${title}"
               @click=${chipAction} style="cursor:pointer;${colorStyle}">
            <ha-icon icon="${icon}" style="--mdc-icon-size:13px;"></ha-icon>
            ${label ? html`<span>${label}</span>` : ''}
          </div>`;
      }
      if (mode === 'matrix') {
        return html`
          <div class="matrix-chip clickable" title="${title}"
               @click=${chipAction} style="cursor:pointer;${colorStyle}">
            <ha-icon icon="${icon}" style="--mdc-icon-size:11px;filter:drop-shadow(0 0 3px ${color});"></ha-icon>
            ${label ? html`<span>${label}</span>` : ''}
          </div>`;
      }
      if (mode === 'orbital') {
        const sc = satClasses[orbIdx % satClasses.length]; orbIdx++;
        return html`
          <div class="orb-sat ${sc} clickable" title="${title}"
               style="border-color:${chip.color ? `${chip.color}44` : 'rgba(74,158,255,0.5)'};box-shadow:0 0 10px rgba(74,158,255,0.12);${colorStyle || 'color:#4a9eff;'}"
               @click=${chipAction}>
            <ha-icon icon="${icon}" style="--mdc-icon-size:11px;"></ha-icon>
            ${label ? html`<span>${label}</span>` : ''}
          </div>`;
      }
      return html`
        <div class="extra-chip clickable" style="${colorStyle}" @click=${chipAction}>
          <ha-icon icon="${icon}" style="--mdc-icon-size:13px;"></ha-icon>
          ${label ? html`<span>${label}</span>` : ''}
        </div>`;
    });
  }

  _renderClassicLayout() {
    const entity = this.hass.states[this.config.entity];


    const stateConfig = this._getCurrentStateConfig();
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const stateName = customStateEnt?.state || stateConfig?.name || this.config.name || this._translateState(entity.state);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const isCustomImage = !!this.config.entity_picture;

    const stateStyles = stateConfig?.styles?.name || {};
    const activityIcon = this._activityIcon;
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#4CAF50' : '#FF9800';

    // Calcola aspect ratio
    const [widthRatio, heightRatio] = (this.config.aspect_ratio || '1/1')
      .split('/')
      .map(n => parseFloat(n));
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

    // Posizioni elementi con fallback sicuro
    const batteryPos = this._getPositionStyles(this.config.battery_position) || {};
    const watchBatteryPos = this._getPositionStyles(this.config.watch_battery_position) || {};
    const device2BatteryPos = this._getPositionStyles(this.config.device_2_battery_position || 'top-right-3') || {};
    const device2Id = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
    const showDevice2Battery = this.config.show_device_2_battery !== false && device2Id && this._battery2Level > 0;
    const activityPos = this._getPositionStyles(this.config.activity_position) || {};
    const distancePos = this._getPositionStyles(this.config.distance_position) || {};
    const travelPos = this._getPositionStyles(this.config.travel_position) || {};
    const connectionPos = this._getPositionStyles(this.config.connection_position) || {};

    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);

    // Icon size configurabile
    const iconSize = this.config.classic_icon_size || 16;
    const iconStyle = `width: ${iconSize}px; height: ${iconSize}px;`;

    return html`
      <style>${this._getPairAnimationStyles('classic')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}">
        ${this._renderWeatherBg()}
        <div class="card-container" style="padding-bottom: ${paddingBottom}">
          <div class="card-content">
            <!-- Sezione superiore con foto, nome e stato -->
            <div class="content-top clickable" @click=${() => this._handleTapAction()} style="cursor: pointer;">
              ${this.config.show_entity_picture && entityPicture ? html`
                <div class="entity-picture" style="width: ${this.config.picture_size}%;">
                  <img
                    src="${stateConfig?.entity_picture || entityPicture}"
                    alt="${entity.attributes?.friendly_name || this.config.name || 'Person'}"
                    class="${stateConfig?.entity_picture ? 'custom-state-image' : (isCustomImage ? 'custom-image' : '')}"
                    style="${stateStyles.color && !stateConfig?.entity_picture && !isCustomImage ? `border-color: ${stateStyles.color};` : ''}"
                  />
                </div>
              ` : ''}

              ${this.config.show_person_name ? html`
                <div class="entity-person-name"
                     style="font-size: ${this.config.name_font_size};
                            margin-top: ${this.config.show_entity_picture ? `calc(${this.config.name_font_size} * 0.4)` : '0'};">
                  ${entity.attributes?.friendly_name || this.config.name || 'Person'}
                </div>
              ` : ''}

              ${this.config.show_name ? html`
                <div class="entity-state-name"
                     @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                     style="font-size: ${this.config.state_font_size};
                            color: ${stateStyles.color || 'var(--secondary-text-color)'};
                            margin-top: ${this.config.show_person_name ? `calc(${this.config.name_font_size} * 0.3)` : (this.config.show_entity_picture ? '16px' : '0')};
                            ${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">
                  ${stateName}
                </div>
              ` : ''}
              ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:10px;color:rgba(255,255,255,0.5);margin-top:3px;text-align:center;') : ''}
            </div>

            <!-- Sezione inferiore sempre in basso -->
            ${(this.config.show_last_changed || (this.config.show_weather && this._weatherTemp)) ? html`
              <div class="content-bottom">
                ${this.config.show_last_changed ? html`
                  <div class="entity-last-changed"
                       style="font-size: ${this.config.last_changed_font_size};${this.config.last_changed_color ? ` color: ${this.config.last_changed_color};` : ''}">
                    ${this._getRelativeTime(entity.last_changed)}
                  </div>
                ` : ''}
                ${this.config.show_weather && this.config.show_weather_temperature !== false && this._weatherTemp ? html`
                  <div class="weather-bg-temp-classic clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)} style="display:flex;align-items:center;gap:4px;cursor:pointer;pointer-events:auto;${this.config.weather_text_color ? `color:${this.config.weather_text_color};` : ''}">
                    <ha-icon icon="${({'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','partlycloudy':'mdi:weather-partly-cloudy','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','rainy':'mdi:weather-rainy','snowy-rainy':'mdi:weather-snowy-rainy','pouring':'mdi:weather-pouring','snowy':'mdi:weather-snowy','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','exceptional':'mdi:alert-circle-outline'})[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:12px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.8)'};"></ha-icon>
                    <span>${this._weatherTemp}${this._weatherState ? ' · ' + this._t('weather.' + this._weatherState) : ''}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            ${this.config.show_battery ? html`
              <div class="custom-field battery clickable ${this._batteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}
                   style="color: ${this._getBatteryColor()};
                          font-size: ${this.config.battery_font_size};
                          ${Object.entries(batteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>📱</span>
                <ha-icon icon="${this._batteryCharging ? 'mdi:battery-charging' : this._batteryIcon}" .style=${iconStyle}></ha-icon>
                <span>${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="custom-field watch-battery clickable ${this._watchBatteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}
                   style="color: ${this._getBatteryColor(this._watchBatteryLevel)};
                          font-size: ${this.config.watch_battery_font_size};
                          ${Object.entries(watchBatteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <span>⌚</span>
                <ha-icon icon="${this._watchBatteryCharging ? 'mdi:battery-charging' : this._watchBatteryIcon}" .style=${iconStyle}></ha-icon>
                <span>${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${showDevice2Battery ? html`
              <div class="custom-field battery clickable ${this._battery2Charging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(device2Id)}
                   style="color: ${this._getBatteryColor(this._battery2Level)};
                          font-size: ${this.config.battery_font_size};
                          ${Object.entries(device2BatteryPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${this._getDeviceIcon(device2Id)}" .style=${iconStyle}></ha-icon>
                <ha-icon icon="${this._battery2Charging ? 'mdi:battery-charging' : this._battery2Icon}" .style=${iconStyle}></ha-icon>
                <span>${this._battery2Level}%</span>
              </div>
            ` : ''}

            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="custom-field activity clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}
                   style="font-size: ${this.config.activity_font_size};
                          ${Object.entries(activityPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${activityIcon}" .style=${iconStyle}></ha-icon>
                <span style="margin-left: 4px; font-size: 11px;">${this._activity}</span>
              </div>
            ` : ''}

            ${(() => {
              const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
              const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
              const smartMode = this.config.smart_travel_mode !== false;
              const isHome = entity.state === 'home';
              const zone2Name = this.config.zone_2 ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' ')) : null;
              const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
              const showDir1 = !smartMode || !hasDir2 || !isZone2;
              const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
              const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
              const hasTravel1 = showDir1 && this.config.show_travel_time && this._travelTime > 0;
              const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
              const hasTravel2 = showDir2 && this.config.show_travel_time_2 && this._travelTime2 > 0;
              // Animate only when exactly one direction is active (avoids overlap at same position)
              const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
              const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);
              const distStyle1 = `font-size:${this.config.distance_font_size};${Object.entries(distancePos).map(([k,v])=>`${k}:${v}`).join(';')}`;
              const distStyle2 = distStyle1;
              const travStyle = `font-size:${this.config.travel_font_size};${Object.entries(travelPos).map(([k,v])=>`${k}:${v}`).join(';')}`;
              return html`
                ${pairDir1 ? html`
                  <!-- Dir1 paired: single chip alternating distance/travel -->
                  <div class="custom-field distance classic-pair" style="${distStyle1}">
                    <span class="pair-a" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))}>
                      <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" .style=${iconStyle}></ha-icon>
                      ${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit}
                    </span>
                    <span class="pair-b" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))}>
                      <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" .style=${iconStyle}></ha-icon>
                      ${this._formatTravelTime(this._travelTime)}
                    </span>
                  </div>
                ` : html`
                  ${hasDist1 ? html`
                    <div class="custom-field distance clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="${distStyle1}">
                      <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" .style=${iconStyle}></ha-icon>
                      <span>${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit}</span>
                    </div>
                  ` : ''}
                  ${hasTravel1 ? html`
                    <div class="custom-field travel clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="${travStyle}">
                      <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" .style=${iconStyle}></ha-icon>
                      <span>${this._formatTravelTime(this._travelTime)}</span>
                    </div>
                  ` : ''}
                `}

                ${pairDir2 ? html`
                  <!-- Dir2 paired: single chip alternating distance/travel (offset -4s to desync from dir1) -->
                  <div class="custom-field distance classic-pair" style="${distStyle2}">
                    <span class="pair-a" style="animation-delay:-4s;" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))}>
                      <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" .style=${iconStyle}></ha-icon>
                      ${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit2}
                    </span>
                    <span class="pair-b" style="animation-delay:-4s;" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))}>
                      <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" .style=${iconStyle}></ha-icon>
                      ${this._formatTravelTime(this._travelTime2)}
                    </span>
                  </div>
                ` : html`
                  ${hasDist2 ? html`
                    <div class="custom-field distance clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="${distStyle2}">
                      <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" .style=${iconStyle}></ha-icon>
                      <span>${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit2}</span>
                    </div>
                  ` : ''}
                  ${hasTravel2 ? html`
                    <div class="custom-field travel clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="${travStyle}">
                      <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" .style=${iconStyle}></ha-icon>
                      <span>${this._formatTravelTime(this._travelTime2)}</span>
                    </div>
                  ` : ''}
                `}
              `;
            })()}

            ${this.config.show_connection ? html`
              <div class="custom-field wifi clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}
                   style="font-size: ${this.config.connection_font_size};
                          ${Object.entries(connectionPos).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="width:${this.config.classic_icon_size||16}px;height:${this.config.classic_icon_size||16}px;color:${connectionColor};"></ha-icon>
                <span style="color:${connectionColor};font-weight:600;">${this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : this._connectionType}</span>
              </div>
            ` : ''}

          </div>
        </div>
        ${this.config.extra_chips?.length ? html`
        <div class="extra-chips-row" style="padding:4px 12px 10px;">
          ${this._renderExtraChips('full')}
        </div>` : ''}
      </ha-card>
    `;
  }

  _renderCompactLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();

    // Nome della persona (non dello stato!)
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';

    // Nome dello stato personalizzato (location)
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);

    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const stateStyles = stateConfig?.styles?.name || {};

    // Activity icon e color
    const activityIcon = this._activityIcon;
    let activityColor = 'var(--secondary-text-color)';
    if (this._activity === 'Stationary') activityColor = 'green';
    else if (this._activity === 'Walking' || this._activity === 'Running') activityColor = 'orange';
    else if (this._activity === 'Automotive') activityColor = 'blue';

    // Connection
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? 'blue' : 'orange';

    // Battery color
    const batteryColor = this._getBatteryColor();

    // Larghezza configurabile
    const maxWidth = this.config.compact_width || 300;

    // Icon size configurabile - tutto si scala proporzionalmente
    const iconSize = this.config.compact_icon_size || 16;
    const badgeSize = iconSize * 2; // Il badge è il doppio dell'icona
    const smallIconSize = Math.max(10, Math.round(iconSize * 0.75));
    const badgeFontSize = Math.max(8, Math.round(iconSize * 0.56)); // Font proporzionale
    const smallFontSize = Math.max(7, Math.round(iconSize * 0.5));
    const pictureSize = Math.max(36, Math.round(iconSize * 2.5)); // Immagine proporzionale
    const nameFontSize = Math.max(12, Math.round(iconSize * 0.875));
    const locationFontSize = Math.max(9, Math.round(iconSize * 0.625));
    const cardPadding = Math.max(6, Math.round(iconSize * 0.5));
    const badgeGap = Math.max(4, Math.round(iconSize * 0.5));

    return html`
      <style>${this._getPairAnimationStyles('compact')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}; padding: ${cardPadding}px; max-width: ${maxWidth}px;">
        ${this._renderWeatherBg()}
        <div class="compact-grid">
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="compact-picture clickable" @click=${() => this._handleTapAction()}>
              <img src="${entityPicture}" alt="${personName}" style="width: ${pictureSize}px; height: ${pictureSize}px;${stateStyles.color ? ` border-color: ${stateStyles.color};` : ''}" />
            </div>
          ` : ''}

          ${this.config.show_name ? html`
            <div class="compact-name clickable" @click=${() => this._handleTapAction()} style="color: inherit; cursor: pointer; font-size: ${nameFontSize}px;">
              ${personName}
            </div>
          ` : ''}

          <div class="compact-location clickable" @click=${() => this.config.maps_provider && this._gpsLat ? this._openMaps() : this._handleTapAction()} style="color: ${stateStyles.color || 'var(--secondary-text-color)'}; cursor: pointer; font-size: ${locationFontSize}px;">
            ${this.config.show_geocoded_location && this._geocodedLocation && entity.state !== 'home' ? html`
              <div class="geo-wrap" style="width:100%;">
                <span class="geo-state">${displayLocation}</span>
                <span class="geo-addr clickable" style="font-size:${Math.max(8, locationFontSize - 1)}px;opacity:0.85;cursor:pointer;" @click=${(e) => { e.stopPropagation(); this.config.maps_provider && this._gpsLat ? this._openMaps(e) : this._showMoreInfo(geoEntityId); }}>${this._geocodedLocation}</span>
              </div>
            ` : displayLocation}
            ${this.config.show_last_changed ? html`
              <div style="font-size:9px;color:${this.config.last_changed_color || 'rgba(255,255,255,0.45)'};margin-top:1px;letter-spacing:0.3px;line-height:1.2;">${this._getRelativeTime(entity.last_changed)}</div>
            ` : ''}
          </div>
          ${this.config.show_weather && this._weatherState && this.config.show_weather_temperature !== false ? html`
            <div style="grid-area:weather;display:flex;align-items:center;gap:3px;opacity:0.7;align-self:start;">
              <ha-icon icon="${({'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','partlycloudy':'mdi:weather-partly-cloudy','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','rainy':'mdi:weather-rainy','snowy-rainy':'mdi:weather-snowy-rainy','pouring':'mdi:weather-pouring','snowy':'mdi:weather-snowy','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','exceptional':'mdi:alert-circle-outline'})[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:11px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.75)'};"></ha-icon>
              <span style="font-size:10px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.75)'};line-height:1;">${this._weatherTemp ? `${this._weatherTemp}` : ''}${this._weatherTemp && this._t(`weather.${this._weatherState}`) ? ' · ' : ''}${this._t(`weather.${this._weatherState}`)}</span>
            </div>
          ` : ''}

          <div class="compact-icons" style="gap: ${badgeGap}px;">
           ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                <ha-icon icon="${activityIcon}" style="--mdc-icon-size: ${iconSize}px; color: ${activityColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size: ${iconSize}px; color: ${connectionColor};"></ha-icon>
              </div>
            ` : ''}

            ${this.config.show_battery ? html`
              <div class="compact-icon-badge clickable ${this._batteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="width: ${badgeSize}px; height: ${badgeSize}px;">
                ${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(iconSize * 0.6)}px; color: #4CAF50; position: absolute; top: -2px; right: -2px;"></ha-icon>` : ''}
                <span style="font-size: ${badgeFontSize}px; font-weight: bold; color: ${batteryColor};">${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="compact-icon-badge clickable ${this._watchBatteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="width: ${badgeSize}px; height: ${badgeSize}px; flex-direction: column; justify-content: center; align-items: center; gap: 0; line-height: 1; position: relative;">
                ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(iconSize * 0.5)}px; color: #4CAF50; position: absolute; top: -2px; right: -2px;"></ha-icon>` : ''}
                <span style="font-size: ${smallFontSize}px; line-height: 1;">⌚</span>
                <span style="font-size: ${smallFontSize}px; font-weight: bold; color: ${this._getBatteryColor(this._watchBatteryLevel)}; line-height: 1;">
                  ${this._watchBatteryLevel}%
                </span>
              </div>
            ` : ''}

            ${(() => {
              const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
              return (this.config.show_device_2_battery !== false && d2p && this._battery2Level > 0) ? html`
                <div class="compact-icon-badge clickable ${this._battery2Charging ? 'charging' : ''}"
                     @click=${() => this._showMoreInfo(d2p)}
                     style="width: ${badgeSize}px; height: ${badgeSize}px; flex-direction: column; justify-content: center; align-items: center; gap: 0; line-height: 1; position: relative;">
                  ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(iconSize * 0.5)}px; color: #4CAF50; position: absolute; top: -2px; right: -2px;"></ha-icon>` : ''}
                  <ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size: ${smallIconSize}px; color: ${this._getBatteryColor(this._battery2Level)}; line-height: 1;"></ha-icon>
                  <span style="font-size: ${smallFontSize}px; font-weight: bold; color: ${this._getBatteryColor(this._battery2Level)}; line-height: 1;">${this._battery2Level}%</span>
                </div>
              ` : '';
            })()}

            ${(() => {
              const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
              const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
              const smartMode = this.config.smart_travel_mode !== false;
              const isHome = entity.state === 'home';
              const zone2Name = this.config.zone_2 ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' ')) : null;
              const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
              const showDir1 = !smartMode || !hasDir2 || !isZone2;
              const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
              const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
              const hasTravel1 = showDir1 && this.config.show_travel_time && this._travelTime > 0;
              const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
              const hasTravel2 = showDir2 && this.config.show_travel_time_2 && this._travelTime2 > 0;
              const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
              const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);
              const badgeBaseStyle =`width:${badgeSize}px;height:${badgeSize}px;flex-direction:column;justify-content:center;align-items:center;gap:0;line-height:1`;
              return html`
                ${pairDir1 ? html`
                  <div class="sensor-pair-compact" style="width:${badgeSize}px;height:${badgeSize}px;">
                    <div class="compact-icon-badge pair-a-compact clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;color:#4A9EFF;line-height:1;">${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))}${this._distanceUnit}</span>
                    </div>
                    <div class="compact-icon-badge pair-b-compact clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;line-height:1;">${this._formatTravelTime(this._travelTime)}</span>
                    </div>
                  </div>
                ` : html`
                  ${hasDist1 ? html`
                    <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;color:#4A9EFF;line-height:1;">${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))}${this._distanceUnit}</span>
                    </div>
                  ` : ''}
                  ${hasTravel1 ? html`
                    <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;line-height:1;">${this._formatTravelTime(this._travelTime)}</span>
                    </div>
                  ` : ''}
                `}

                ${pairDir2 ? html`
                  <div class="sensor-pair-compact" style="width:${badgeSize}px;height:${badgeSize}px;">
                    <div class="compact-icon-badge pair-a-compact clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="${badgeBaseStyle};animation-delay:-4s;">
                      <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;color:#4A9EFF;line-height:1;">${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))}${this._distanceUnit2}</span>
                    </div>
                    <div class="compact-icon-badge pair-b-compact clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="${badgeBaseStyle};animation-delay:-4s;">
                      <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;line-height:1;">${this._formatTravelTime(this._travelTime2)}</span>
                    </div>
                  </div>
                ` : html`
                  ${hasDist2 ? html`
                    <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;color:#4A9EFF;line-height:1;">${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))}${this._distanceUnit2}</span>
                    </div>
                  ` : ''}
                  ${hasTravel2 ? html`
                    <div class="compact-icon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="${badgeBaseStyle}">
                      <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:${smallIconSize}px;"></ha-icon>
                      <span style="font-size:${smallFontSize}px;font-weight:bold;line-height:1;">${this._formatTravelTime(this._travelTime2)}</span>
                    </div>
                  ` : ''}
                `}
              `;
            })()}

            ${this._renderExtraChips('icon-only')}

          </div>
        </div>
      </ha-card>
    `;
  }

  // NEW: Modern Layout with circular progress indicators
  _renderModernLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();

    // Person name
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';

    // State name (location)
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);

    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;
    const stateStyles = stateConfig?.styles?.name || {};

    // Border color based on state
    const borderColor = stateStyles.color || this._getStateBorderColor(entity.state);

    // Battery colors and values
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const batteryLevel = Math.round(this._batteryLevel);

    // Watch Battery
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const watchBatteryLevel = Math.round(this._watchBatteryLevel);

    // Travel time
    const travelTime = Math.round(this._travelTime);
    const maxTravelTime = this.config.modern_travel_max_time || 60;
    const travelPercentage = travelTime > 0 ? Math.min((travelTime / maxTravelTime) * 100, 100) : 0;
    const travelColor = this._getTravelTimeColor(travelTime);

    // Distance (Fix #16: use configured precision)
    const distPrecision = this.config.distance_precision ?? 1;
    const distance = parseFloat(this._distanceFromHome.toFixed(distPrecision));
    const maxDistance = this.config.modern_distance_max || 100;
    const distancePercentage = distance > 0 ? Math.min((distance / maxDistance) * 100, 100) : 0;

    // Sensor 2 (work direction)
    const travelTime2 = Math.round(this._travelTime2);
    const travelPercentage2 = travelTime2 > 0 ? Math.min((travelTime2 / maxTravelTime) * 100, 100) : 0;
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const distance2 = parseFloat(this._distanceFromHome2.toFixed(distPrecision));
    const distancePercentage2 = distance2 > 0 ? Math.min((distance2 / maxDistance) * 100, 100) : 0;

    // Smart visibility
    const hasDir1Modern = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2Modern = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const smartModeModern = this.config.smart_travel_mode !== false;
    const isHomeModern = entity.state === 'home';
    const zone2NameModern = this.config.zone_2 ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' ')) : null;
    const isZone2Modern = zone2NameModern && entity.state.toLowerCase() === zone2NameModern.toLowerCase();
    const showDir1Modern = !smartModeModern || !hasDir2Modern || !isZone2Modern;
    const showDir2Modern = hasDir2Modern && (!smartModeModern || !isHomeModern || !hasDir1Modern);
    const hasDist1Modern = showDir1Modern && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1Modern = showDir1Modern && this.config.show_travel_time && travelTime > 0;
    const hasDist2Modern = showDir2Modern && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2Modern = showDir2Modern && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1Modern = hasDist1Modern && hasTravel1Modern && (this.config.pair_travel_animation !== false);
    const pairDir2Modern = hasDist2Modern && hasTravel2Modern && (this.config.pair_travel_animation !== false);

    // Activity
    const activityIcon = this._activityIcon;

    // Connection
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#4CAF50' : '#FF9800';

    // Picture size
    const pictureSize = this.config.modern_picture_size || 40;

    // Ring size (configurable)
    const ringSize = this.config.modern_ring_size || 38;
    const ringValueFontSize = Math.max(9, Math.round(ringSize * 0.29)); // Scale font with ring
    const ringUnitFontSize = Math.max(6, Math.round(ringSize * 0.18));
    const ringIconSize = Math.max(16, Math.round(ringSize * 0.58));

    // Ring background color (adapts to theme)
    const ringBgColor = this._getRingBackgroundColor();

    // Weather
    const weatherIconMap = {'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','partlycloudy':'mdi:weather-partly-cloudy','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','rainy':'mdi:weather-rainy','snowy-rainy':'mdi:weather-snowy-rainy','pouring':'mdi:weather-pouring','snowy':'mdi:weather-snowy','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','exceptional':'mdi:alert-circle-outline'};
    const modernWeatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';

    return html`
      <style>${this._getPairAnimationStyles('modern')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="background: ${this.config.card_background}; border-radius: ${this.config.card_border_radius}; padding: 10px 12px;${this.config.modern_width ? ` max-width: ${this.config.modern_width}px;` : ''}">
        ${this._renderWeatherBg()}
        <div class="modern-container">
          <!-- Picture with state-colored border - clicks open person entity -->
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="modern-picture clickable"
                 @click=${() => this._handleTapAction()}
                 style="
              border: 3px solid ${borderColor};
              border-radius: 50%;
              width: ${pictureSize}px;
              height: ${pictureSize}px;
              overflow: hidden;
              flex-shrink: 0;
              cursor: pointer;
            ">
              <img
                src="${entityPicture}"
                alt="${personName}"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
          ` : ''}

          <!-- Center: Name and State - clicks open person entity -->
          <div class="modern-info clickable" @click=${() => this._handleTapAction()} style="cursor: pointer;">
            ${this.config.show_person_name ? html`
              <div style="font-size: ${this.config.modern_name_font_size || '14px'}; font-weight: bold; text-transform: uppercase; margin: 0; padding: 0;">
                ${personName}
              </div>
            ` : ''}
            ${this.config.show_name ? html`
              <div @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                   style="font-size: ${this.config.modern_state_font_size || '12px'}; color: ${stateStyles.color || 'var(--secondary-text-color)'}; margin: 0; padding: 0; ${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">
                ${displayLocation}
              </div>
            ` : ''}
            ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:10px;color:rgba(255,255,255,0.45);margin-top:2px;') : ''}
            ${this.config.show_weather && this._weatherState && this.config.show_weather_temperature !== false ? html`
              <div style="display:flex;align-items:center;gap:3px;margin-top:3px;opacity:0.75;">
                <ha-icon icon="${weatherIconMap[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:12px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.7)'};"></ha-icon>
                <span style="font-size:10px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.7)'};line-height:1;">${this._weatherTemp ? `${this._weatherTemp}` : ''}${this._weatherTemp && modernWeatherLabel ? ' · ' : ''}${modernWeatherLabel}</span>
              </div>
            ` : ''}
          </div>

          <!-- Right: Circular indicators -->
          <div class="modern-rings">
            <!-- Battery -->
            ${this.config.show_battery ? html`
              <div class="ring-container clickable ${this._batteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="width: ${ringSize}px; height: ${ringSize}px; position: relative;">
                ${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(ringSize * 0.35)}px; color: #4CAF50; position: absolute; top: -4px; right: -4px; z-index: 1;"></ha-icon>` : ''}
                <svg viewBox="0 0 36 36" class="ring-svg ${this._batteryCharging ? 'charging-ring' : ''}">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._batteryCharging ? '#4CAF50' : batteryColor}" stroke-width="3" stroke-dasharray="${batteryLevel}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${batteryLevel}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">%</span>
                </div>
              </div>
            ` : ''}

            <!-- Watch Battery -->
            ${this.config.show_watch_battery ? html`
              <div class="ring-container clickable ${this._watchBatteryCharging ? 'charging' : ''}" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="width: ${ringSize}px; height: ${ringSize}px; position: relative;">
                ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(ringSize * 0.35)}px; color: #4CAF50; position: absolute; top: -4px; right: -4px; z-index: 1;"></ha-icon>` : ''}
                <svg viewBox="0 0 36 36" class="ring-svg ${this._watchBatteryCharging ? 'charging-ring' : ''}">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._watchBatteryCharging ? '#4CAF50' : watchBatteryColor}" stroke-width="3" stroke-dasharray="${watchBatteryLevel}, 100" stroke-linecap="round"/>
                </svg>
                <div class="ring-text">
                  <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${watchBatteryLevel}</span>
                  <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;">⌚</span>
                </div>
              </div>
            ` : ''}

            <!-- Device 2 Battery -->
            ${(() => {
              const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
              if (this.config.show_device_2_battery === false || !d2p || this._battery2Level <= 0) return '';
              const bat2Color = this._getBatteryColor(this._battery2Level);
              const bat2Level = Math.round(this._battery2Level);
              return html`
                <div class="ring-container clickable ${this._battery2Charging ? 'charging' : ''}" @click=${() => this._showMoreInfo(d2p)} style="width: ${ringSize}px; height: ${ringSize}px; position: relative;">
                  ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size: ${Math.round(ringSize * 0.35)}px; color: #4CAF50; position: absolute; top: -4px; right: -4px; z-index: 1;"></ha-icon>` : ''}
                  <svg viewBox="0 0 36 36" class="ring-svg ${this._battery2Charging ? 'charging-ring' : ''}">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._battery2Charging ? '#4CAF50' : bat2Color}" stroke-width="3" stroke-dasharray="${bat2Level}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size: ${ringValueFontSize}px;">${bat2Level}</span>
                    <span class="ring-unit" style="font-size: ${ringUnitFontSize}px;"><ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size:${ringUnitFontSize + 2}px;"></ha-icon></span>
                  </div>
                </div>
              `;
            })()}

            <!-- Activity -->
            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="ring-container ring-icon-only clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <ha-icon icon="${activityIcon}" style="--mdc-icon-size: ${ringIconSize}px;"></ha-icon>
              </div>
            ` : ''}

            <!-- Connection -->
            ${this.config.show_connection ? html`
              <div class="ring-container ring-icon-only clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="width: ${ringSize}px; height: ${ringSize}px;">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="color: ${connectionColor}; --mdc-icon-size: ${ringIconSize}px;"></ha-icon>
              </div>
            ` : ''}

            <!-- Extra chips as ring circles -->
            ${this._renderExtraChips('modern', {ringSize, ringIconSize})}

            <!-- Direction 1: distance + travel (animated pair if both) -->
            ${pairDir1Modern ? html`
              <div class="sensor-pair-modern" style="width:${ringSize}px;height:${ringSize}px;">
                <div class="ring-container pair-a-modern clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="width:${ringSize}px;height:${ringSize}px;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._distanceColor || '#4A9EFF'}" stroke-width="3" stroke-dasharray="${distancePercentage}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${distance}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;white-space:nowrap;">${this._distanceUnit}</span>
                  </div>
                </div>
                <div class="ring-container pair-b-modern clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="width:${ringSize}px;height:${ringSize}px;position:absolute;top:0;left:0;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${travelColor}" stroke-width="3" stroke-dasharray="${travelPercentage}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${travelTime >= 60 ? Math.max(7, ringValueFontSize - 3) : ringValueFontSize}px;">${travelTime >= 60 ? `${Math.floor(travelTime/60)}h` : travelTime}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;">${travelTime >= 60 ? `${Math.round(travelTime%60)}m` : 'min'}</span>
                  </div>
                </div>
              </div>
            ` : html`
              ${hasDist1Modern ? html`
                <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="width:${ringSize}px;height:${ringSize}px;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._distanceColor || '#4A9EFF'}" stroke-width="3" stroke-dasharray="${distancePercentage}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${distance}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;white-space:nowrap;">${this._distanceUnit}</span>
                  </div>
                </div>
              ` : ''}
              ${hasTravel1Modern ? html`
                <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="width:${ringSize}px;height:${ringSize}px;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${travelColor}" stroke-width="3" stroke-dasharray="${travelPercentage}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${travelTime >= 60 ? Math.max(7, ringValueFontSize - 3) : ringValueFontSize}px;">${travelTime >= 60 ? `${Math.floor(travelTime/60)}h` : travelTime}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;">${travelTime >= 60 ? `${Math.round(travelTime%60)}m` : 'min'}</span>
                  </div>
                </div>
              ` : ''}
            `}

            <!-- Direction 2: distance + travel (animated pair if both, offset -4s to desync from dir1) -->
            ${pairDir2Modern ? html`
              <div class="sensor-pair-modern" style="width:${ringSize}px;height:${ringSize}px;">
                <div class="ring-container pair-a-modern clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="width:${ringSize}px;height:${ringSize}px;animation-delay:-4s;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._distanceColor2 || '#4A9EFF'}" stroke-width="3" stroke-dasharray="${distancePercentage2}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${distance2}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;white-space:nowrap;">${this._distanceUnit2}</span>
                  </div>
                </div>
                <div class="ring-container pair-b-modern clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="width:${ringSize}px;height:${ringSize}px;position:absolute;top:0;left:0;animation-delay:-4s;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${travelColor2}" stroke-width="3" stroke-dasharray="${travelPercentage2}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${travelTime2}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;">min</span>
                  </div>
                </div>
              </div>
            ` : html`
              ${hasDist2Modern ? html`
                <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="width:${ringSize}px;height:${ringSize}px;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${this._distanceColor2 || '#4A9EFF'}" stroke-width="3" stroke-dasharray="${distancePercentage2}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${distance2}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;white-space:nowrap;">${this._distanceUnit2}</span>
                  </div>
                </div>
              ` : ''}
              ${hasTravel2Modern ? html`
                <div class="ring-container clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="width:${ringSize}px;height:${ringSize}px;">
                  <svg viewBox="0 0 36 36" class="ring-svg">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${ringBgColor}" stroke-width="3"/>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${travelColor2}" stroke-width="3" stroke-dasharray="${travelPercentage2}, 100" stroke-linecap="round"/>
                  </svg>
                  <div class="ring-text">
                    <span class="ring-value" style="font-size:${ringValueFontSize}px;">${travelTime2}</span>
                    <span class="ring-unit" style="font-size:${ringUnitFontSize}px;">min</span>
                  </div>
                </div>
              ` : ''}
            `}

          </div>
        </div>
      </ha-card>
    `;
  }



  _renderNeonLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();

    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    // Usa il colore configurato nell'editor per lo stato corrente, con fallback neon
    const stateColor = stateConfig?.styles?.name?.color || this._getNeonStateColor(entity.state);
    const glowColor = stateColor + '66';
    const bgGradient = `linear-gradient(160deg, #080810 0%, ${stateColor}18 60%, ${stateColor}08 100%)`;

    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const neonWeatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';
    const neonWeatherIconMap = {'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','partlycloudy':'mdi:weather-partly-cloudy','cloudy':'mdi:weather-cloudy','rainy':'mdi:weather-rainy','snowy':'mdi:weather-snowy','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','fog':'mdi:weather-fog','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','hail':'mdi:weather-hail','snowy-rainy':'mdi:weather-snowy-rainy','pouring':'mdi:weather-pouring','exceptional':'mdi:alert-circle-outline'};
    const travelTime = Math.round(this._travelTime);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#00d4ff' : '#ff9500';
    const hasDir1Neon = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2Neon = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHomeNeon = entity.state === 'home';
    const smartModeNeon = this.config.smart_travel_mode !== false;
    const zone2NameNeon = this.config.zone_2 ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' ')) : null;
    const isZone2Neon = zone2NameNeon && entity.state.toLowerCase() === zone2NameNeon.toLowerCase();
    const showDir1Neon = !smartModeNeon || !hasDir2Neon || !isZone2Neon;
    const showDir2Neon = hasDir2Neon && (!smartModeNeon || !isHomeNeon || !hasDir1Neon);
    const hasDist1Neon = showDir1Neon && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1Neon = showDir1Neon && this.config.show_travel_time && travelTime > 0;
    const hasDist2Neon = showDir2Neon && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2Neon = showDir2Neon && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1Neon = hasDist1Neon && hasTravel1Neon && (this.config.pair_travel_animation !== false);
    const pairDir2Neon = hasDist2Neon && hasTravel2Neon && (this.config.pair_travel_animation !== false);

    return html`
      <style>${this._getPairAnimationStyles('neon')}</style>
      <ha-card style="
        background: ${bgGradient};
        border: 1px solid ${stateColor};
        border-radius: ${this.config.card_border_radius};
        box-shadow: 0 0 18px ${glowColor}, 0 0 40px ${stateColor}22, inset 0 0 40px rgba(0,0,0,0.6);
        position: relative;
        overflow: hidden;
      ">
        <!-- Scanlines -->
        <div class="neon-scanlines"></div>

        <!-- Corner decorations -->
        <div class="neon-corner neon-corner-tl" style="border-color: ${stateColor};"></div>
        <div class="neon-corner neon-corner-tr" style="border-color: ${stateColor};"></div>
        <div class="neon-corner neon-corner-bl" style="border-color: ${stateColor};"></div>
        <div class="neon-corner neon-corner-br" style="border-color: ${stateColor};"></div>

        ${this._renderWeatherBg()}

        <div class="neon-container">

          <!-- Photo with animated glow ring -->
          ${this.config.show_entity_picture && entityPicture ? html`
            <div class="neon-picture-wrapper clickable" @click=${() => this._handleTapAction()}>
              <div class="neon-ring-outer" style="
                border-color: ${stateColor};
                box-shadow: 0 0 10px ${stateColor}, 0 0 24px ${glowColor};
                --neon-color: ${stateColor};
                --neon-glow: ${glowColor};
              "></div>
              <img class="neon-photo" src="${entityPicture}" alt="${personName}" />
            </div>
          ` : ''}

          <!-- Name + Location + Time -->
          <div class="neon-info clickable" @click=${() => this._handleTapAction()}>
            ${this.config.show_person_name ? html`
              <div class="neon-name" style="color: #fff; text-shadow: 0 0 8px ${stateColor}33;">
                <span class="neon-status-dot" style="background: ${stateColor}; box-shadow: 0 0 8px ${stateColor};"></span>
                ${personName.toUpperCase()}
              </div>
            ` : ''}
            ${this.config.show_name ? html`
              <div class="neon-location" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                   style="color: ${stateColor}; text-shadow: 0 0 8px ${glowColor}; ${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">
                ${displayLocation}
              </div>
            ` : ''}
            ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:9px;color:rgba(255,255,255,0.4);margin-top:2px;text-align:center;') : ''}
            ${this.config.show_last_changed ? html`
              <div class="neon-time" style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : ''}">${this._getRelativeTime(entity.last_changed)}</div>
            ` : ''}
            ${this.config.show_weather && this.config.show_weather_temperature !== false && (this._weatherTemp || this._weatherState) ? html`
              <div class="neon-temp" style="display:flex;align-items:center;gap:4px;${this.config.weather_text_color ? `color:${this.config.weather_text_color};text-shadow:none;` : ''}">
                ${this._weatherState ? html`<ha-icon icon="${neonWeatherIconMap[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:11px;opacity:0.7;"></ha-icon>` : ''}
                ${this._weatherTemp ? html`<span>${this._weatherTemp}</span>` : ''}
                ${neonWeatherLabel ? html`<span style="opacity:0.6;">· ${neonWeatherLabel}</span>` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Sensor badges -->
          <div class="neon-badges">
            ${this.config.show_battery ? html`
              <div class="neon-badge clickable ${this._batteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}
                   style="border-color: ${batteryColor}; box-shadow: 0 0 6px ${batteryColor}44;">
                ${this._batteryCharging
                  ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:12px; color:#4CAF50;"></ha-icon>`
                  : html`<span>📱</span>`}
                <span style="color:${batteryColor};">${this._batteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_watch_battery ? html`
              <div class="neon-badge clickable ${this._watchBatteryCharging ? 'charging' : ''}"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}
                   style="border-color: ${watchBatteryColor}; box-shadow: 0 0 6px ${watchBatteryColor}44;">
                ${this._watchBatteryCharging
                  ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:12px; color:#4CAF50;"></ha-icon>`
                  : html`<span>⌚</span>`}
                <span style="color:${watchBatteryColor};">${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${(() => {
              const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
              if (this.config.show_device_2_battery === false || !d2p || this._battery2Level <= 0) return '';
              const bat2Color = this._getBatteryColor(this._battery2Level);
              return html`
                <div class="neon-badge clickable ${this._battery2Charging ? 'charging' : ''}"
                     @click=${() => this._showMoreInfo(d2p)}
                     style="border-color: ${bat2Color}; box-shadow: 0 0 6px ${bat2Color}44;">
                  ${this._battery2Charging
                    ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:12px; color:#4CAF50;"></ha-icon>`
                    : html`<ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size:13px; color:${bat2Color};"></ha-icon>`}
                  <span style="color:${bat2Color};">${this._battery2Level}%</span>
                </div>
              `;
            })()}

            ${pairDir1Neon ? html`
              <div class="sensor-pair-neon">
                <div class="neon-badge pair-a-neon clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="border-color:#00d4ff;box-shadow:0 0 6px #00d4ff44;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit}</span>
                </div>
                <div class="neon-badge pair-b-neon clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="border-color:${travelColor};box-shadow:0 0 6px ${travelColor}44;">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span style="color:${travelColor};">${this._formatTravelTime(travelTime)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist1Neon ? html`
                <div class="neon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="border-color:#00d4ff;box-shadow:0 0 6px #00d4ff44;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit}</span>
                </div>
              ` : ''}
              ${hasTravel1Neon ? html`
                <div class="neon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="border-color:${travelColor};box-shadow:0 0 6px ${travelColor}44;">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span style="color:${travelColor};">${this._formatTravelTime(travelTime)}</span>
                </div>
              ` : ''}
            `}

            ${pairDir2Neon ? html`
              <div class="sensor-pair-neon">
                <div class="neon-badge pair-a-neon clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="border-color:#00d4ff;box-shadow:0 0 6px #00d4ff44;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit2}</span>
                </div>
                <div class="neon-badge pair-b-neon clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="border-color:${travelColor2};box-shadow:0 0 6px ${travelColor2}44;">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist2Neon ? html`
                <div class="neon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="border-color:#00d4ff;box-shadow:0 0 6px #00d4ff44;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome2.toFixed(this.config.distance_precision ?? 1))} ${this._distanceUnit2}</span>
                </div>
              ` : ''}
              ${hasTravel2Neon ? html`
                <div class="neon-badge clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="border-color:${travelColor2};box-shadow:0 0 6px ${travelColor2}44;">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</span>
                </div>
              ` : ''}
            `}

            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="neon-badge clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}
                   style="border-color: #b44fff; box-shadow: 0 0 6px #b44fff44;">
                <ha-icon icon="${this._activityIcon}" style="--mdc-icon-size:13px; color:#b44fff;"></ha-icon>
                <span style="color:#b44fff;">${this._activity}</span>
              </div>
            ` : ''}

            ${this.config.show_connection ? html`
              <div class="neon-badge clickable"
                   @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}
                   style="border-color: ${connectionColor}; box-shadow: 0 0 6px ${connectionColor}44;">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size:13px; color:${connectionColor};"></ha-icon>
                <span style="color:${connectionColor};">${this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : this._connectionType}</span>
              </div>
            ` : ''}

            ${this._renderExtraChips('full')}

          </div>

        </div>
      </ha-card>
    `;
  }

  _renderGlassLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const accentColor = stateConfig?.styles?.name?.color || this._getNeonStateColor(entity.state);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#00d4ff' : '#ff9500';
    const distPrecision = this.config.distance_precision ?? 1;
    const weatherIconMap = {'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','partlycloudy':'mdi:weather-partly-cloudy','pouring':'mdi:weather-pouring','rainy':'mdi:weather-rainy','snowy':'mdi:weather-snowy','snowy-rainy':'mdi:weather-snowy-rainy','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','exceptional':'mdi:alert-circle'};
    const weatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    return html`
      <style>${this._getPairAnimationStyles('glass')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="
        background: ${this.config.transparent_background ? 'transparent' : 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 60%, #0a0f1a 100%)'};
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: ${this.config.card_border_radius};
        box-shadow: ${this.config.transparent_background ? 'none' : '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'};
        position: relative;
        overflow: hidden;
      ">
        <!-- Background orbs -->
        ${this.config.show_particles !== false ? html`
        <div style="position:absolute;top:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,${accentColor}28 0%,transparent 70%);pointer-events:none;z-index:0;"></div>
        <div style="position:absolute;bottom:-50px;left:-50px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(0,180,255,0.16) 0%,transparent 70%);pointer-events:none;z-index:0;"></div>` : ''}

        ${this._renderWeatherBg()}

        <div class="glass-container">

          <!-- Header: avatar + name block + battery -->
          <div class="glass-header">
            ${this.config.show_entity_picture && entityPicture ? html`
              <div class="glass-avatar clickable" @click=${() => this._handleTapAction()}
                   style="box-shadow:0 0 0 2px ${accentColor},0 0 18px ${accentColor}50;">
                <img src="${entityPicture}" alt="${personName}"
                     style="width:52px;height:52px;border-radius:50%;object-fit:cover;display:block;" />
              </div>
            ` : html`
              <div class="glass-avatar glass-avatar-icon clickable" @click=${() => this._handleTapAction()}
                   style="background:linear-gradient(135deg,${accentColor}55,rgba(0,180,255,0.35));box-shadow:0 0 0 2px ${accentColor},0 0 18px ${accentColor}50;">
                👤
              </div>
            `}

            <div class="glass-name-block clickable" @click=${() => this._handleTapAction()}>
              ${this.config.show_person_name ? html`<div class="glass-name">${personName}</div>` : ''}
              ${this.config.show_name ? html`
                <div class="glass-zone-row">
                  <span class="glass-dot" style="background:${accentColor};box-shadow:0 0 6px ${accentColor};"></span>
                  <span class="glass-zone-text" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                        style="${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">${displayLocation}</span>
                </div>
              ` : ''}
              ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:9px;color:rgba(255,255,255,0.38);margin-top:2px;') : ''}
              ${this.config.show_last_changed ? html`<div class="glass-time" style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : ''}">${this._getRelativeTime(entity.last_changed)}</div>` : ''}
            </div>

            ${(this.config.show_battery || this.config.show_connection || (this.config.show_device_2_battery !== false && (this.config.device_2_battery_sensor || this._resolvedPrefix2) && this._battery2Level > 0)) ? html`
              <div class="glass-battery-pill">
                ${this.config.show_battery ? html`
                  <div class="${this._batteryCharging ? 'glass-bat-svg-wrap glass-bat-charging clickable' : 'glass-bat-svg-wrap clickable'}" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}>
                    <svg width="32" height="15" viewBox="0 0 32 15" style="display:block;">
                      <rect x="0.5" y="0.5" width="27" height="14" rx="2.5" fill="rgba(255,255,255,0.07)" stroke="${batteryColor}99" stroke-width="1.2"/>
                      <rect x="28" y="4.5" width="3.5" height="6" rx="1.5" fill="${batteryColor}99"/>
                      <rect x="2" y="2" width="${Math.max(0,(this._batteryLevel/100)*23)}" height="11" rx="1.5" fill="${batteryColor}" style="filter:drop-shadow(0 0 2px ${batteryColor});"/>
                      ${this._batteryCharging ? html`<text x="13.5" y="11" text-anchor="middle" font-size="8" font-weight="700" fill="#4ade80">⚡</text>` : ''}
                    </svg>
                    <span style="font-size:11px;font-weight:700;color:${batteryColor};margin-left:5px;">${this._batteryLevel}%</span>
                  </div>
                ` : ''}
                ${(() => {
                  const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
                  if (this.config.show_device_2_battery === false || !d2p || this._battery2Level <= 0) return '';
                  const bat2Color = this._getBatteryColor(this._battery2Level);
                  return html`
                    <div class="glass-bat-svg-wrap clickable ${this._battery2Charging ? 'glass-bat-charging' : ''}" @click=${() => this._showMoreInfo(d2p)}>
                      <ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size:14px;color:${bat2Color};"></ha-icon>
                      <span style="font-size:11px;font-weight:700;color:${bat2Color};margin-left:3px;">${this._battery2Level}%</span>
                      ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;margin-left:2px;"></ha-icon>` : ''}
                    </div>
                  `;
                })()}
                ${this.config.show_connection ? html`
                  <div class="glass-conn-pill clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}>
                    <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size:16px;color:${connectionColor};"></ha-icon>
                    <span style="font-size:10px;color:${connectionColor};font-weight:600;">${this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : this._connectionType}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Divider -->
          <div class="glass-divider" style="background:linear-gradient(90deg,transparent,${accentColor}50,rgba(0,180,255,0.25),transparent);"></div>

          <!-- Sensor chips -->
          <div class="glass-chips">

            ${this.config.show_watch_battery ? html`
              <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}>
                ${this._watchBatteryCharging
                  ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:13px;color:#4ade80;"></ha-icon>`
                  : html`<span style="font-size:13px;">⌚</span>`}
                <span style="color:${watchBatteryColor};">${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_connection && !this.config.show_battery ? html`
              <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}>
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size:14px;color:${connectionColor};"></ha-icon>
              </div>
            ` : ''}

            ${pairDir1 ? html`
              <div class="sensor-pair-glass">
                <div class="glass-chip pair-a-glass clickable"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))}
                     style="border-color:rgba(0,212,255,0.3);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
                <div class="glass-chip pair-b-glass clickable"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))}
                     style="border-color:${travelColor}50;color:${travelColor};">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist1 ? html`
                <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="border-color:rgba(0,212,255,0.3);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
              ` : ''}
              ${hasTravel1 ? html`
                <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="border-color:${travelColor}50;color:${travelColor};">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
              ` : ''}
            `}

            ${pairDir2 ? html`
              <div class="sensor-pair-glass">
                <div class="glass-chip pair-a-glass clickable"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))}
                     style="border-color:rgba(0,212,255,0.3);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
                <div class="glass-chip pair-b-glass clickable"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))}
                     style="border-color:${travelColor2}50;color:${travelColor2};">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist2 ? html`
                <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="border-color:rgba(0,212,255,0.3);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
              ` : ''}
              ${hasTravel2 ? html`
                <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="border-color:${travelColor2}50;color:${travelColor2};">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
              ` : ''}
            `}

            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}>
                <ha-icon icon="${this._activityIcon}" style="--mdc-icon-size:13px;color:#b44fff;"></ha-icon>
                <span style="color:#b44fff;">${this._activity}</span>
              </div>
            ` : ''}

            ${this.config.show_steps && this._steps > 0 ? html`
              <div class="glass-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('steps'))}>
                <ha-icon icon="mdi:shoe-sneaker" style="--mdc-icon-size:13px;color:rgba(255,255,255,0.55);"></ha-icon>
                <span>${this._steps.toLocaleString()}</span>
              </div>
            ` : ''}

            ${this._renderExtraChips('full')}

          </div>

          ${this.config.show_weather && this._weatherState && this.config.show_weather_temperature !== false ? html`
            <div class="glass-weather-bar">
              <div class="glass-weather-bar-left clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)}
                   style="${this.config.weather_text_color ? `color:${this.config.weather_text_color};` : ''}">
                <ha-icon icon="${weatherIconMap[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:14px;color:${this.config.weather_text_color || 'rgba(255,255,255,0.45)'};"></ha-icon>
                <span>${this._weatherTemp ? `${this._weatherTemp} · ` : ''}${weatherLabel}</span>
              </div>
            </div>
          ` : ''}

        </div>
      </ha-card>
    `;
  }

  _renderBioLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const stateAccent = entity.state === 'home' ? '#00ffb4' : entity.state === 'not_home' ? '#b400ff' : '#00d4ff';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _bioHexRgb = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _bioHexRgb(accentColor) || '0,212,255';
    // Fixed teal for sensor icons — not affected by state color picker
    const sensorColor = '#00d4ff';
    const sensorRgb = '0,212,255';

    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? sensorColor : '#ff9500';
    const distPrecision = this.config.distance_precision ?? 1;
    const weatherIconMap = {'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','partlycloudy':'mdi:weather-partly-cloudy','pouring':'mdi:weather-pouring','rainy':'mdi:weather-rainy','snowy':'mdi:weather-snowy','snowy-rainy':'mdi:weather-snowy-rainy','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','exceptional':'mdi:alert-circle'};
    const weatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    return html`
      <style>${this._getPairAnimationStyles('bio')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="
        border-radius: ${this.config.card_border_radius};
        overflow: hidden;
        position: relative;
        background: ${this.config.transparent_background ? 'transparent' : '#000a0d'};
        border: 1px solid rgba(${sensorRgb},0.12);
        box-shadow: ${this.config.transparent_background ? 'none' : `0 0 40px rgba(${sensorRgb},0.05), 0 30px 60px rgba(0,0,0,0.8)`};
      ">
        ${this._renderWeatherBg()}

        <!-- Orbs -->
        ${this.config.show_particles !== false ? html`
        <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;">
          <div class="bio-orb" style="width:140px;height:90px;background:rgba(${sensorRgb},0.18);top:-10%;left:-20%;animation-delay:0s;"></div>
          <div class="bio-orb" style="width:100px;height:120px;background:rgba(0,200,255,0.12);bottom:0%;right:-10%;animation-delay:2s;animation-duration:10s;"></div>
          <div class="bio-orb" style="width:70px;height:70px;background:rgba(${sensorRgb},0.10);top:50%;left:55%;animation-delay:4s;animation-duration:9s;"></div>
        </div>
        <!-- Particles -->
        <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;">
          <div class="bio-particle" style="left:12%;bottom:5%;background:${sensorColor};width:3px;height:3px;box-shadow:0 0 6px ${sensorColor};animation-delay:0s;animation-duration:5s;"></div>
          <div class="bio-particle" style="left:35%;bottom:12%;background:#00d4ff;box-shadow:0 0 6px #00d4ff;animation-delay:1.5s;animation-duration:7s;"></div>
          <div class="bio-particle" style="left:60%;bottom:4%;background:${sensorColor};width:3px;height:3px;box-shadow:0 0 5px ${sensorColor};animation-delay:3s;animation-duration:6s;"></div>
          <div class="bio-particle" style="left:78%;bottom:10%;background:rgba(${sensorRgb},0.9);box-shadow:0 0 4px ${sensorColor};animation-delay:0.8s;animation-duration:8s;"></div>
          <div class="bio-particle" style="left:22%;bottom:7%;background:rgba(0,212,255,0.9);box-shadow:0 0 4px #00d4ff;animation-delay:2.2s;animation-duration:5.5s;"></div>
        </div>` : ''}

        <div style="position:relative;z-index:2;padding:18px 16px 14px;">
          <!-- Header -->
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
            <div style="position:relative;flex-shrink:0;">
              <div class="bio-pulse-ring" style="border-color:rgba(${accentRgb},0.5);"></div>
              <div class="bio-pulse-ring-2" style="border-color:rgba(${accentRgb},0.25);"></div>
              ${this.config.show_entity_picture && entityPicture ? html`
                <div class="bio-avatar clickable" @click=${() => this._handleTapAction()}
                     style="border-color:rgba(${accentRgb},0.4);box-shadow:0 0 20px rgba(${accentRgb},0.25);">
                  <img src="${entityPicture}" alt="${personName}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;display:block;filter:saturate(0.7) brightness(0.9);">
                </div>
              ` : html`
                <div class="bio-avatar bio-avatar-icon clickable" @click=${() => this._handleTapAction()}
                     style="border-color:rgba(${accentRgb},0.4);box-shadow:0 0 20px rgba(${accentRgb},0.25);background:rgba(${accentRgb},0.08);">
                  👤
                </div>
              `}
            </div>

            <div class="clickable" @click=${() => this._handleTapAction()} style="flex:1;min-width:0;">
              ${this.config.show_person_name ? html`<div class="bio-name">${personName}</div>` : ''}
              ${this.config.show_name ? html`<div class="bio-zone" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined} style="color:rgba(${sensorRgb},0.65);${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">◉ ${displayLocation}</div>` : ''}
              ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, `font-size:9px;color:rgba(${sensorRgb},0.38);margin-top:1px;`) : ''}
              ${this.config.show_last_changed ? html`<div style="font-size:10px;color:${this.config.last_changed_color || `rgba(${sensorRgb},0.35)`};margin-top:2px;letter-spacing:0.5px;">${this._getRelativeTime(entity.last_changed)}</div>` : ''}
            </div>

            ${(this.config.show_battery || this.config.show_connection || (this.config.show_device_2_battery !== false && (this.config.device_2_battery_sensor || this._resolvedPrefix2) && this._battery2Level > 0)) ? html`
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
                ${this.config.show_battery ? html`
                  <div class="${this._batteryCharging ? 'bio-bat-charging' : ''} clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                    <svg width="32" height="15" viewBox="0 0 32 15" style="display:block;">
                      <rect x="0.5" y="0.5" width="27" height="14" rx="2.5" fill="rgba(${sensorRgb},0.07)" stroke="rgba(${sensorRgb},0.45)" stroke-width="1.2"/>
                      <rect x="28" y="4.5" width="3.5" height="6" rx="1.5" fill="rgba(${sensorRgb},0.45)"/>
                      <rect x="2" y="2" width="${Math.max(0,(this._batteryLevel/100)*23)}" height="11" rx="1.5" fill="${batteryColor}" style="filter:drop-shadow(0 0 2px ${batteryColor});"/>
                      ${this._batteryCharging ? html`<text x="13.5" y="11" text-anchor="middle" font-size="8" font-weight="700" fill="#4ade80">⚡</text>` : ''}
                    </svg>
                    <span style="font-size:11px;font-weight:700;color:${batteryColor};">${this._batteryLevel}%</span>
                  </div>
                ` : ''}
                ${(() => {
                  const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
                  if (this.config.show_device_2_battery === false || !d2p || this._battery2Level <= 0) return '';
                  const bat2Color = this._getBatteryColor(this._battery2Level);
                  return html`
                    <div class="clickable ${this._battery2Charging ? 'bio-bat-charging' : ''}" @click=${() => this._showMoreInfo(d2p)} style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                      <ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size:15px;color:${bat2Color};"></ha-icon>
                      <span style="font-size:11px;font-weight:700;color:${bat2Color};">${this._battery2Level}%</span>
                      ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;"></ha-icon>` : ''}
                    </div>
                  `;
                })()}
                ${this.config.show_connection ? html`
                  <div class="clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                    <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size:14px;color:${connectionColor};"></ha-icon>
                    <span style="font-size:10px;color:${connectionColor};font-weight:600;">${this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : this._connectionType}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Divider -->
          <div style="height:1px;margin:0 0 14px;background:linear-gradient(90deg,transparent,rgba(${sensorRgb},0.35),rgba(0,200,255,0.2),transparent);"></div>

          <!-- Chips -->
          <div style="display:flex;flex-wrap:wrap;gap:7px;align-items:center;">

            ${this.config.show_watch_battery ? html`
              <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="border-color:rgba(${sensorRgb},0.2);">
                ${this._watchBatteryCharging
                  ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:13px;color:#4ade80;"></ha-icon>`
                  : html`<span style="font-size:13px;">⌚</span>`}
                <span style="color:${watchBatteryColor};">${this._watchBatteryLevel}%</span>
              </div>
            ` : ''}

            ${this.config.show_connection && !this.config.show_battery ? html`
              <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="border-color:rgba(${sensorRgb},0.2);">
                <ha-icon icon="${this._connectionIcon || connectionIcon}" style="--mdc-icon-size:14px;color:${connectionColor};"></ha-icon>
              </div>
            ` : ''}

            ${pairDir1 ? html`
              <div class="sensor-pair-bio">
                <div class="bio-chip pair-a-bio clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="border-color:rgba(0,212,255,0.25);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
                <div class="bio-chip pair-b-bio clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-color:${travelColor}44;color:${travelColor};">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist1 ? html`
                <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="border-color:rgba(0,212,255,0.25);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
              ` : ''}
              ${hasTravel1 ? html`
                <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="border-color:${travelColor}44;color:${travelColor};">
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
              ` : ''}
            `}

            ${pairDir2 ? html`
              <div class="sensor-pair-bio">
                <div class="bio-chip pair-a-bio clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="border-color:rgba(0,212,255,0.25);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
                <div class="bio-chip pair-b-bio clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-color:${travelColor2}44;color:${travelColor2};">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
              </div>
            ` : html`
              ${hasDist2 ? html`
                <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="border-color:rgba(0,212,255,0.25);color:#00d4ff;">
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#00d4ff;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
              ` : ''}
              ${hasTravel2 ? html`
                <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="border-color:${travelColor2}44;color:${travelColor2};">
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
              ` : ''}
            `}

            ${this.config.show_activity && this._activity !== 'unknown' ? html`
              <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="border-color:rgba(${sensorRgb},0.2);">
                <ha-icon icon="${this._activityIcon}" style="--mdc-icon-size:13px;color:${sensorColor};"></ha-icon>
                <span style="color:${sensorColor};">${this._activity}</span>
              </div>
            ` : ''}

            ${this.config.show_steps && this._steps > 0 ? html`
              <div class="bio-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('steps'))} style="border-color:rgba(${sensorRgb},0.15);">
                <ha-icon icon="mdi:shoe-sneaker" style="--mdc-icon-size:13px;color:rgba(${sensorRgb},0.6);"></ha-icon>
                <span>${this._steps.toLocaleString()}</span>
              </div>
            ` : ''}

            ${this._renderExtraChips('full')}

          </div>

          <!-- Weather footer -->
          ${this.config.show_weather && this._weatherState && this.config.show_weather_temperature !== false ? html`
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(${sensorRgb},0.1);display:flex;justify-content:space-between;align-items:center;">
              <div class="clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)}
                   style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:10px;color:${this.config.weather_text_color || `rgba(${sensorRgb},0.35)`};">
                <ha-icon icon="${weatherIconMap[this._weatherState] || 'mdi:weather-cloudy'}" style="--mdc-icon-size:13px;color:${this.config.weather_text_color || `rgba(${sensorRgb},0.35)`};"></ha-icon>
                <span>${this._weatherTemp ? `${this._weatherTemp} · ` : ''}${weatherLabel}</span>
              </div>
              <span style="font-size:9px;color:rgba(${sensorRgb},0.2);letter-spacing:1px;">◎ LIVE</span>
            </div>
          ` : ''}

        </div>
      </ha-card>
    `;
  }

  _renderHoloLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const stateAccent = entity.state === 'home' ? '#00d4ff' : entity.state === 'not_home' ? '#7f50ff' : '#00d4ff';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _hexRgb = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _hexRgb(accentColor) || '0,212,255';

    const batteryLevel = Math.round(this._batteryLevel);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryLevel = Math.round(this._watchBatteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const distPrecision = this.config.distance_precision ?? 1;

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    const weatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';
    const weatherLine = (this.config.show_weather && this.config.show_weather_temperature !== false && (this._weatherTemp || weatherLabel))
      ? [this._weatherTemp, weatherLabel].filter(Boolean).join(' · ')
      : '';
    const lastChanged = this.config.show_last_changed ? this._getRelativeTime(entity.last_changed) : '';

    return html`
      <style>${this._getPairAnimationStyles('holo')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="
        background: transparent;
        border: none;
        box-shadow: 0 20px 60px rgba(0,0,0,0.85), 0 0 40px rgba(${accentRgb},0.07);
        border-radius: ${this.config.card_border_radius};
        overflow: visible;
        perspective: 900px;
        perspective-origin: 50% 40%;
      ">
        <div class="holo-scene" style="border-radius:${this.config.card_border_radius};">
          <!-- Card body -->
          <div class="holo-body">
            <!-- Weather background (above shimmer, below content) -->
            <div style="position:absolute;inset:0;z-index:2;overflow:hidden;pointer-events:none;">${this._renderWeatherBg()}</div>
            <!-- Shimmer -->
            <div class="holo-shimmer"></div>
            <!-- Top glow line -->
            <div class="holo-topline" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.55) 30%,rgba(${accentRgb},0.65) 50%,rgba(${accentRgb},0.55) 70%,transparent);"></div>
            <!-- Scan -->
            <div class="holo-scan"><div class="holo-scan-bar"></div></div>
            <!-- Left grid deco -->
            <div class="holo-grid-deco">
              <div class="holo-grid" style="background-image:linear-gradient(rgba(${accentRgb},0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(${accentRgb},0.04) 1px,transparent 1px);background-size:14px 14px;"></div>
              <div class="holo-corner holo-tl" style="border-color:rgba(${accentRgb},0.5);"></div>
              <div class="holo-corner holo-br" style="border-color:rgba(${accentRgb},0.5);"></div>
            </div>
            <!-- Vertical separator -->
            <div class="holo-sep" style="background:linear-gradient(180deg,transparent,rgba(${accentRgb},0.28) 20%,rgba(${accentRgb},0.22) 80%,transparent);"></div>

            <!-- Main layout -->
            <div class="holo-main">
              <!-- Left: Avatar -->
              <div class="holo-left">
                <div class="holo-avatar-wrap" style="transform:translateZ(22px);">
                  <div class="holo-ring-outer" style="background:linear-gradient(#0c0c1e,#0c0c1e) padding-box,linear-gradient(135deg,${accentColor},#7f50ff,${accentColor}) border-box;"></div>
                  <div class="holo-ring-mid" style="border-color:rgba(${accentRgb},0.22);"></div>
                  <div class="holo-avatar-pic clickable" @click=${()=>this._handleTapAction()}
                       style="border-color:rgba(${accentRgb},0.38);box-shadow:0 0 20px rgba(${accentRgb},0.22),0 0 40px rgba(127,80,255,0.12);">
                    ${this.config.show_entity_picture && entityPicture
                      ? html`<img src="${entityPicture}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">`
                      : html`<span style="font-size:28px;">👤</span>`}
                  </div>
                  <div class="holo-orbit-dot" style="background:rgba(${accentRgb},1);box-shadow:0 0 6px rgba(${accentRgb},1),0 0 12px rgba(${accentRgb},0.8);animation:holo-orbit-go 3s linear infinite;"></div>
                  <div class="holo-orbit-dot" style="background:#7f50ff;box-shadow:0 0 6px #7f50ff,0 0 12px #7f50ff;animation:holo-orbit-go2 5s linear infinite;"></div>
                </div>
              </div>

              <!-- Right: Text + Metrics -->
              <div class="holo-right">
                <div style="transform:translateZ(30px);">
                  <div class="holo-live-chip" style="background:rgba(${accentRgb},0.08);border-color:rgba(${accentRgb},0.28);color:rgba(${accentRgb},0.85);">
                    <div class="holo-live-dot" style="background:rgba(${accentRgb},1);"></div>
                    LIVE
                  </div>
                  ${this.config.show_person_name ? html`
                    <div class="holo-name" style="text-shadow:0 0 20px rgba(${accentRgb},0.35),0 0 40px rgba(127,80,255,0.2);">${personName.toUpperCase()}</div>
                  ` : ''}
                  ${this.config.show_name ? html`
                    <div class="holo-loc" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                         style="background:linear-gradient(90deg,${accentColor},#7f50ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">${displayLocation}</div>
                  ` : ''}
                  ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:9px;color:rgba(255,255,255,0.35);margin-top:1px;') : ''}
                  <div class="holo-sub">
                    ${lastChanged ? html`<span style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : ''}">${lastChanged}</span>` : ''}
                    ${weatherLine ? html`${lastChanged ? html`<span style="opacity:0.3">·</span>` : ''}<span class="clickable" style="cursor:pointer;${this.config.weather_text_color ? `color:${this.config.weather_text_color};` : ''}" @click=${() => this._showMoreInfo(this.config.weather_entity)}>🌤 ${weatherLine}</span>` : ''}
                  </div>
                </div>

                <div class="holo-metrics" style="transform:translateZ(26px);">
                  ${this.config.show_battery && batteryLevel > 0 ? html`
                    <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="cursor:pointer;">
                      <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                      <div class="holo-mv" style="color:${this._batteryCharging ? '#4ade80' : batteryColor};">${batteryLevel}%${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;vertical-align:middle;margin-left:2px;"></ha-icon>` : ''}</div>
                      <div class="holo-mu">🔋</div>
                    </div>
                  ` : ''}
                  ${this.config.show_watch_battery && watchBatteryLevel > 0 ? html`
                    <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="cursor:pointer;">
                      <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                      <div class="holo-mv" style="color:${this._watchBatteryCharging ? '#4ade80' : watchBatteryColor};">${watchBatteryLevel}%${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;vertical-align:middle;margin-left:2px;"></ha-icon>` : ''}</div>
                      <div class="holo-mu">⌚</div>
                    </div>
                  ` : ''}
                  ${(() => {
                    const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
                    if (this.config.show_device_2_battery === false || !d2p || this._battery2Level <= 0) return '';
                    const bat2Color = this._getBatteryColor(this._battery2Level);
                    return html`
                      <div class="holo-metric clickable" @click=${() => this._showMoreInfo(d2p)} style="cursor:pointer;">
                        <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                        <div class="holo-mv" style="color:${this._battery2Charging ? '#4ade80' : bat2Color};">${Math.round(this._battery2Level)}%${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;vertical-align:middle;margin-left:2px;"></ha-icon>` : ''}</div>
                        <div class="holo-mu"><ha-icon icon="${this._getDeviceIcon(d2p)}" style="--mdc-icon-size:13px;color:${this._battery2Charging ? '#4ade80' : bat2Color};"></ha-icon></div>
                      </div>
                    `;
                  })()}
                  ${this.config.show_connection && this._connectionType ? html`
                    <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="cursor:pointer;">
                      <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                      <ha-icon icon="${connectionIcon}" style="--mdc-icon-size:13px;color:rgba(${accentRgb},0.75);"></ha-icon>
                      <div class="holo-mu">${this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : 'LTE'}</div>
                    </div>
                  ` : ''}
                  ${pairDir1 ? html`
                    <div class="holo-metric sensor-pair-holo clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                      <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                      <div class="pair-a-holo">
                        <div class="holo-mv" style="color:${travelColor};">${this._formatTravelTime(travelTime)}</div>
                        <div class="holo-mu">🚗</div>
                      </div>
                      <div class="pair-b-holo">
                        <div class="holo-mv">${parseFloat(this._distanceFromHome?.toFixed(distPrecision))} ${this._distanceUnit}</div>
                        <div class="holo-mu">📍</div>
                      </div>
                    </div>
                  ` : html`
                    ${hasTravel1 ? html`
                      <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                        <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                        <div class="holo-mv" style="color:${travelColor};">${this._formatTravelTime(travelTime)}</div>
                        <div class="holo-mu">🚗</div>
                      </div>
                    ` : ''}
                    ${hasDist1 ? html`
                      <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="cursor:pointer;">
                        <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                        <div class="holo-mv">${parseFloat(this._distanceFromHome?.toFixed(distPrecision))} ${this._distanceUnit}</div>
                        <div class="holo-mu">📍</div>
                      </div>
                    ` : ''}
                  `}
                  ${pairDir2 ? html`
                    <div class="holo-metric sensor-pair-holo clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;animation-delay:-4s;">
                      <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                      <div class="pair-a-holo" style="animation-delay:-4s;">
                        <div class="holo-mv" style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</div>
                        <div class="holo-mu">🚗</div>
                      </div>
                      <div class="pair-b-holo" style="animation-delay:-4s;">
                        <div class="holo-mv">${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))} ${this._distanceUnit2}</div>
                        <div class="holo-mu">📍</div>
                      </div>
                    </div>
                  ` : html`
                    ${hasTravel2 ? html`
                      <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;">
                        <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                        <div class="holo-mv" style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</div>
                        <div class="holo-mu">🚗</div>
                      </div>
                    ` : ''}
                    ${hasDist2 ? html`
                      <div class="holo-metric clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="cursor:pointer;">
                        <div class="holo-metric-line" style="background:linear-gradient(90deg,transparent,rgba(${accentRgb},0.35),transparent);"></div>
                        <div class="holo-mv">${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))} ${this._distanceUnit2}</div>
                        <div class="holo-mu">📍</div>
                      </div>
                    ` : ''}
                  `}
                  ${this._renderExtraChips('holo', {accentRgb})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderWxStationLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const stateAccent = entity.state === 'home' ? '#22c55e' : entity.state === 'not_home' ? '#6b7280' : '#3b82f6';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _wxHex = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _wxHex(accentColor) || '34,197,94';

    const batteryLevel = Math.round(this._batteryLevel);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryLevel = Math.round(this._watchBatteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionColor = this._isWifiConnection(this._connectionType) ? '#38bdf8' : '#f97316';
    const distPrecision = this.config.distance_precision ?? 1;
    const activityIcon = this._getActivityIcon();
    const last_changed_color = this.config.last_changed_color || null;

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);
    const hasChips = hasDist1 || hasTravel1 || hasDist2 || hasTravel2;

    // Weather
    const weatherEntity = this.config.show_weather && this.config.weather_entity ? this.hass.states[this.config.weather_entity] : null;
    const weatherAttr = weatherEntity?.attributes || {};
    const weatherHumidity = weatherAttr.humidity != null ? Math.round(weatherAttr.humidity) : null;
    const weatherWindSpeed = weatherAttr.wind_speed != null ? Math.round(weatherAttr.wind_speed) : null;
    const weatherWindUnit = weatherAttr.wind_speed_unit || 'km/h';
    const weatherFeels = weatherAttr.apparent_temperature != null ? `${Math.round(weatherAttr.apparent_temperature)}${weatherAttr.temperature_unit || '°'}` : null;
    const weatherTempRaw = weatherAttr.temperature != null ? Math.round(weatherAttr.temperature) : null;
    const weatherTempUnit = weatherAttr.temperature_unit || '°';
    const weatherState = this._weatherState;
    const weatherIconMap = {'sunny':'mdi:weather-sunny','clear-night':'mdi:weather-night','cloudy':'mdi:weather-cloudy','fog':'mdi:weather-fog','hail':'mdi:weather-hail','lightning':'mdi:weather-lightning','lightning-rainy':'mdi:weather-lightning-rainy','partlycloudy':'mdi:weather-partly-cloudy','pouring':'mdi:weather-pouring','rainy':'mdi:weather-rainy','snowy':'mdi:weather-snowy','snowy-rainy':'mdi:weather-snowy-rainy','windy':'mdi:weather-windy','windy-variant':'mdi:weather-windy-variant','exceptional':'mdi:alert-circle'};
    const weatherLabel = weatherState ? this._t(`weather.${weatherState}`) : '';
    const weatherIcon = weatherState ? (weatherIconMap[weatherState] || 'mdi:weather-partly-cloudy') : null;
    const weatherTextColor = this.config.weather_text_color || 'rgba(150,200,255,0.85)';
    const showWeatherTemp = this.config.show_weather && this.config.show_weather_temperature !== false && weatherTempRaw != null;

    const lastChanged = this._getRelativeTime(entity.last_changed);

    // Build gauge list — up to 4 shown
    const gauges = [];
    if (this.config.show_battery && batteryLevel > 0)
      gauges.push({ icon: 'mdi:battery', val: `${batteryLevel}%`, label: this._t('wx.battery'), color: batteryColor, entityType: 'battery', charging: this._batteryCharging });
    if (this.config.show_watch_battery && watchBatteryLevel > 0)
      gauges.push({ icon: 'mdi:watch-vibrate', val: `${watchBatteryLevel}%`, label: this._t('wx.watch'), color: watchBatteryColor, entityType: 'watch_battery', charging: this._watchBatteryCharging });
    const wxD2Id = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
    if (this.config.show_device_2_battery !== false && wxD2Id && this._battery2Level > 0) {
      const bat2Color = this._getBatteryColor(this._battery2Level);
      gauges.push({ icon: this._getDeviceIcon(wxD2Id), val: `${Math.round(this._battery2Level)}%`, label: this._t('wx.device2'), color: bat2Color, entityId: wxD2Id, charging: this._battery2Charging });
    }
    const wxGaugeColor = 'rgba(150,200,255,0.85)';
    if (this.config.show_weather && weatherWindSpeed != null)
      gauges.push({ icon: 'mdi:weather-windy', val: `${weatherWindSpeed} ${weatherWindUnit}`, label: this._t('wx.wind'), color: wxGaugeColor, weatherClick: true });
    if (this.config.show_weather && weatherHumidity != null)
      gauges.push({ icon: 'mdi:water-percent', val: `${weatherHumidity}%`, label: this._t('wx.humidity'), color: wxGaugeColor, weatherClick: true });
    if (this.config.show_connection && this._connectionType)
      gauges.push({ icon: connectionIcon, val: this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : this._connectionType, label: this._t('wx.network'), color: connectionColor, entityType: 'connection' });
    if (this.config.show_activity && this._activity)
      gauges.push({ icon: activityIcon, val: this._activity, label: this._t('wx.activity'), color: wxGaugeColor, entityType: 'activity' });
    if (this.config.show_weather && weatherAttr.pressure != null)
      gauges.push({ icon: 'mdi:gauge', val: `${Math.round(weatherAttr.pressure)}`, label: this._t('wx.pressure'), color: wxGaugeColor, weatherClick: true });
    if (this.config.show_weather && weatherFeels)
      gauges.push({ icon: 'mdi:thermometer-water', val: weatherFeels, label: this._t('wx.feels'), color: wxGaugeColor, weatherClick: true });

    const visibleGauges = gauges.slice(0, 4);
    const overflowGauges = gauges.slice(4);
    const gridCols = visibleGauges.length < 3 ? visibleGauges.length || 1 : visibleGauges.length === 3 ? 3 : 4;

    return html`
      <style>${this._getPairAnimationStyles('wxstation')}</style>
      <ha-card style="
        border-radius: ${this.config.card_border_radius};
        overflow: hidden;
        background: ${this.config.transparent_background ? 'transparent' : 'linear-gradient(160deg, #0a1628 0%, #0d2040 50%, #1a0d30 100%)'};
        border: 1px solid rgba(100,150,255,0.12);
        box-shadow: ${this.config.transparent_background ? 'none' : '0 8px 32px rgba(0,0,0,0.5)'};
      ">
        <!-- Top: weather bg + person row -->
        <div class="wx-top">
          ${this._renderWeatherBg()}
          <div class="wx-person-row">
            <!-- Avatar -->
            <div class="wx-avatar" style="border-color:rgba(${accentRgb},0.45);box-shadow:0 0 12px rgba(${accentRgb},0.2);">
              ${this.config.show_entity_picture && entityPicture
                ? html`<img src="${entityPicture}" @click=${() => this._handleTapAction()} style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;cursor:pointer;">`
                : html`<span style="font-size:28px;cursor:pointer;" @click=${() => this._handleTapAction()}>👤</span>`}
            </div>
            <!-- Info block -->
            <div style="flex:1;min-width:0;z-index:2;">
              ${this.config.show_person_name ? html`
                <div class="wx-name" @click=${() => this._handleTapAction()} style="cursor:pointer;">${personName}</div>
              ` : ''}
              ${this.config.show_name ? html`
                <div class="wx-location" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined}
                     style="${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">${this.config.show_geocoded_location && this._geocodedLocation && entity.state !== 'home' ? '' : '📍 '}${displayLocation}</div>
              ` : ''}
              ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, 'font-size:9px;color:rgba(255,255,255,0.38);margin-top:1px;') : ''}
              ${this.config.show_last_changed && lastChanged ? html`
                <div style="font-size:10px;color:${last_changed_color || 'rgba(255,255,255,0.28)'};margin-top:3px;">${lastChanged}</div>
              ` : ''}
            </div>
            <!-- Big temperature + condition below -->
            ${showWeatherTemp ? html`
              <div class="wx-temp-display" @click=${() => this._showMoreInfo(this.config.weather_entity)} style="cursor:pointer;">
                <div class="wx-temp-big" style="color:${weatherTextColor};">${weatherTempRaw}<span class="wx-temp-unit">${weatherTempUnit}</span></div>
                ${weatherState ? html`
                  <div class="wx-condition" style="color:${weatherTextColor};text-align:right;margin-top:2px;">
                    ${weatherIcon ? html`<ha-icon icon="${weatherIcon}" style="--mdc-icon-size:12px;vertical-align:middle;"></ha-icon>` : ''}
                    ${weatherLabel}
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Gauges grid -->
        ${visibleGauges.length > 0 ? html`
          <div class="wx-gauges" style="grid-template-columns:repeat(${gridCols},1fr);">
            ${visibleGauges.map(g => html`
              <div class="wx-gauge" @click=${() => g.entityId ? this._showMoreInfo(g.entityId) : g.entityType ? this._showMoreInfo(this._getSensorEntityId(g.entityType)) : g.weatherClick ? this._showMoreInfo(this.config.weather_entity) : null} style="cursor:${g.entityId || g.entityType || g.weatherClick ? 'pointer' : 'default'};">
                <div class="wx-gauge-icon" style="position:relative;">
                  <ha-icon icon="${g.charging ? 'mdi:battery-charging' : g.icon}" style="--mdc-icon-size:20px;color:${g.charging ? '#4ade80' : g.color};"></ha-icon>
                  ${g.charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:10px;color:#4ade80;position:absolute;top:-3px;right:-4px;"></ha-icon>` : ''}
                </div>
                <div class="wx-gauge-val" style="color:${g.charging ? '#4ade80' : g.color};">${g.val}</div>
                <div class="wx-gauge-label">${g.label}</div>
              </div>
            `)}
          </div>
        ` : ''}

        <!-- Travel / distance chips + overflow sensors + extra chips -->
        ${(hasChips || overflowGauges.length > 0 || this.config.extra_chips?.length) ? html`
          <div class="wx-chips">
            ${overflowGauges.map(g => html`
              <div class="wx-chip" @click=${() => g.entityId ? this._showMoreInfo(g.entityId) : g.entityType ? this._showMoreInfo(this._getSensorEntityId(g.entityType)) : g.weatherClick ? this._showMoreInfo(this.config.weather_entity) : null} style="cursor:${g.entityId || g.entityType || g.weatherClick ? 'pointer' : 'default'};color:${g.color};">
                <ha-icon icon="${g.icon}" style="--mdc-icon-size:13px;color:${g.color};"></ha-icon>
                <span>${g.val}</span>
              </div>
            `)}
            ${pairDir1 ? html`
              <div class="wx-chip sensor-pair-wx" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                <div class="pair-a-wx">
                  <ha-icon icon="mdi:car" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span style="color:${travelColor};">${this._formatTravelTime(travelTime)}</span>
                </div>
                <div class="pair-b-wx">
                  <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:13px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome?.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
              </div>
            ` : html`
              ${hasTravel1 ? html`
                <div class="wx-chip" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                  <ha-icon icon="mdi:car" style="--mdc-icon-size:13px;color:${travelColor};"></ha-icon>
                  <span style="color:${travelColor};">${this._formatTravelTime(travelTime)}</span>
                </div>
              ` : ''}
              ${hasDist1 ? html`
                <div class="wx-chip" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="cursor:pointer;">
                  <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:13px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome?.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
              ` : ''}
            `}
            ${pairDir2 ? html`
              <div class="wx-chip sensor-pair-wx" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;animation-delay:-4s;">
                <div class="pair-a-wx" style="animation-delay:-4s;">
                  <ha-icon icon="mdi:car" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</span>
                </div>
                <div class="pair-b-wx" style="animation-delay:-4s;">
                  <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:13px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
              </div>
            ` : html`
              ${hasTravel2 ? html`
                <div class="wx-chip" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;">
                  <ha-icon icon="mdi:car" style="--mdc-icon-size:13px;color:${travelColor2};"></ha-icon>
                  <span style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</span>
                </div>
              ` : ''}
              ${hasDist2 ? html`
                <div class="wx-chip" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="cursor:pointer;">
                  <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:13px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
              ` : ''}
            `}
            ${this._renderExtraChips('wxstation')}
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="wx-footer">
          <div class="wx-status-dot" style="background:${accentColor};box-shadow:0 0 8px rgba(${accentRgb},0.7);"></div>
          <div class="wx-footer-text">${displayLocation}</div>
          <div class="wx-updated">${lastChanged}</div>
        </div>
      </ha-card>
    `;
  }

  _renderMatrixLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const stateAccent = entity.state === 'home' ? '#00ff41' : entity.state === 'not_home' ? '#ff4141' : '#00d4ff';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _hexRgb = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _hexRgb(accentColor) || '0,255,65';

    const batteryLevel = Math.round(this._batteryLevel);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const watchBatteryLevel = Math.round(this._watchBatteryLevel);
    const watchBatteryColor = this._getBatteryColor(this._watchBatteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const distPrecision = this.config.distance_precision ?? 1;

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    const lastChanged = this.config.show_last_changed ? this._getRelativeTime(entity.last_changed) : '';

    const d2p = this.config.device_2_battery_sensor || (this._resolvedPrefix2 ? `sensor.${this._resolvedPrefix2}_battery_level` : null);
    const showDevice2 = this.config.show_device_2_battery !== false && d2p && this._battery2Level > 0;
    const battery2Level = Math.round(this._battery2Level);
    const battery2Color = this._getBatteryColor(this._battery2Level);

    // Deterministic matrix rain columns via seeded PRNG
    const r = this._rng(987654);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノラリルレロ0123456789ABCDEF@#$%';
    const matrixCols = Array.from({ length: 24 }, () => {
      const x = r() * 97;
      const duration = 2.5 + r() * 5;
      const delay = -(r() * 8);
      const opacity = 0.2 + r() * 0.5;
      const fontSize = 9 + Math.floor(r() * 5);
      let txt = '';
      const len = 14 + Math.floor(r() * 14);
      for (let j = 0; j < len; j++) txt += chars[Math.floor(r() * chars.length)] + '\n';
      return { x, duration, delay, opacity, fontSize, txt };
    });

    const hasChips = (this.config.show_activity && this._activity !== 'unknown' && this._activity) ||
                     (this.config.show_connection && this._connectionType) ||
                     hasDist1 || hasTravel1 || hasDist2 || hasTravel2;

    return html`
      <style>${this._getPairAnimationStyles('matrix')}</style>
      <ha-card style="
        background:#000;
        font-family:'Courier New',monospace;
        border-radius:${this.config.card_border_radius};
        ${this.config.card_background ? `background:${this.config.card_background};` : ''}
      ">
        <!-- Rain columns -->
        <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;">
          ${matrixCols.map(col => html`
            <div style="
              position:absolute;left:${col.x}%;top:0;
              color:#00ff41;font-size:${col.fontSize}px;opacity:${col.opacity};
              writing-mode:vertical-lr;white-space:pre;line-height:1.2;
              animation:matrix-fall ${col.duration}s linear ${col.delay}s infinite;
              user-select:none;
            ">${col.txt}</div>
          `)}
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.5) 45%,rgba(0,0,0,0.88) 70%,#000 90%);"></div>
        </div>

        <!-- Content -->
        <div class="matrix-content">
          <!-- Person row -->
          <div class="matrix-person-row">
            <div class="matrix-avatar-box clickable" @click=${() => this._handleTapAction()}
                 style="border-color:${accentColor};box-shadow:0 0 14px rgba(${accentRgb},.45),inset 0 0 10px rgba(${accentRgb},.08);">
              ${this.config.show_entity_picture && entityPicture
                ? html`<img src="${entityPicture}" style="width:100%;height:100%;object-fit:cover;border-radius:3px;">`
                : html`<span style="font-size:26px;">👤</span>`}
              <div class="matrix-avatar-scanlines" style="background:repeating-linear-gradient(transparent 0px,transparent 2px,rgba(${accentRgb},.04) 2px,rgba(${accentRgb},.04) 4px);"></div>
              <div class="matrix-avatar-scan" style="background:rgba(${accentRgb},.18);"></div>
            </div>
            <div style="flex:1;min-width:0;">
              ${this.config.show_person_name !== false ? html`<div class="matrix-name">${personName.toUpperCase()}</div>` : ''}
              ${this.config.show_name !== false ? html`<div class="matrix-state" @click=${this.config.maps_provider && this._gpsLat ? (e) => this._openMaps(e) : undefined} style="${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">STATUS:: ${displayLocation.toUpperCase()}</div>` : ''}
              ${this.config.show_geocoded_location && entity.state !== 'home' ? this._renderGeocoded(geoEntityId, "font-size:8px;color:#00ff4160;margin-top:1px;font-family:'Courier New',monospace;letter-spacing:0.5px;") : ''}
              ${lastChanged ? html`<div class="matrix-last-changed" style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : ''}">${lastChanged}</div>` : ''}
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="color:#00ff41;font-size:9px;letter-spacing:2px;opacity:.6;animation:matrix-blink 2s step-end infinite;">◼ LIVE</div>
            </div>
          </div>

          <hr class="matrix-divider">

          <!-- Stats blocks -->
          <div class="matrix-stats">
            ${this.config.show_battery && batteryLevel > 0 ? html`
              <div class="matrix-stat-block clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))} style="cursor:pointer;">
                <div class="matrix-stat-label">BATTERY${this._batteryCharging ? html` <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;vertical-align:middle;"></ha-icon>` : ''}</div>
                <div class="matrix-stat-val" style="color:${this._batteryCharging ? '#4ade80' : batteryColor};">${batteryLevel}%</div>
                <div class="matrix-stat-bar"><div class="matrix-stat-bar-fill" style="width:${batteryLevel}%;background:${this._batteryCharging ? '#4ade80' : batteryColor};box-shadow:0 0 5px ${this._batteryCharging ? '#4ade80' : batteryColor};"></div></div>
              </div>
            ` : ''}
            ${this.config.show_watch_battery && watchBatteryLevel > 0 ? html`
              <div class="matrix-stat-block clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))} style="cursor:pointer;">
                <div class="matrix-stat-label">WATCH${this._watchBatteryCharging ? html` <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;vertical-align:middle;"></ha-icon>` : ''}</div>
                <div class="matrix-stat-val" style="color:${this._watchBatteryCharging ? '#4ade80' : watchBatteryColor};">${watchBatteryLevel}%</div>
                <div class="matrix-stat-bar"><div class="matrix-stat-bar-fill" style="width:${watchBatteryLevel}%;background:${this._watchBatteryCharging ? '#4ade80' : watchBatteryColor};box-shadow:0 0 5px ${this._watchBatteryCharging ? '#4ade80' : watchBatteryColor};"></div></div>
              </div>
            ` : ''}
            ${showDevice2 ? html`
              <div class="matrix-stat-block clickable" @click=${() => this._showMoreInfo(d2p)} style="cursor:pointer;">
                <div class="matrix-stat-label">DEV.2${this._battery2Charging ? html` <ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;vertical-align:middle;"></ha-icon>` : ''}</div>
                <div class="matrix-stat-val" style="color:${this._battery2Charging ? '#4ade80' : battery2Color};">${battery2Level}%</div>
                <div class="matrix-stat-bar"><div class="matrix-stat-bar-fill" style="width:${battery2Level}%;background:${this._battery2Charging ? '#4ade80' : battery2Color};box-shadow:0 0 5px ${this._battery2Charging ? '#4ade80' : battery2Color};"></div></div>
              </div>
            ` : ''}
            ${this.config.show_weather && this._weatherTemp ? html`
              <div class="matrix-stat-block clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)} style="cursor:pointer;">
                <div class="matrix-stat-label">TEMP</div>
                <div class="matrix-stat-val" style="color:${this.config.weather_text_color || '#00ff41'};">${this._weatherTemp}</div>
                <div class="matrix-stat-bar"><div class="matrix-stat-bar-fill" style="width:65%;"></div></div>
              </div>
            ` : ''}
          </div>

          <!-- Chips: activity, connection, travel/distance -->
          ${hasChips || this.config.extra_chips?.length ? html`
            <div class="matrix-chips-row">
              ${this.config.show_activity && this._activity && this._activity !== 'unknown' ? html`
                <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))} style="cursor:pointer;">
                  <ha-icon icon="${this._activityIcon || 'mdi:run'}" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                  <span>${this._activity.toUpperCase()}</span>
                </div>
              ` : ''}
              ${this.config.show_connection && this._connectionType ? html`
                <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))} style="cursor:pointer;">
                  <ha-icon icon="${connectionIcon}" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                  <span>${this._isWifiConnection(this._connectionType) ? this._getWifiLabel().toUpperCase() : 'LTE'}</span>
                </div>
              ` : ''}
              ${pairDir1 ? html`
                <div class="matrix-chip sensor-pair-matrix clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                  <div class="pair-a-matrix">
                    <ha-icon icon="mdi:car" style="--mdc-icon-size:12px;color:${travelColor};"></ha-icon>
                    <span style="color:${travelColor};">${travelTime}M</span>
                  </div>
                  <div class="pair-b-matrix">
                    <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                    <span>${parseFloat(this._distanceFromHome?.toFixed(distPrecision))}${this._distanceUnit}</span>
                  </div>
                </div>
              ` : html`
                ${hasTravel1 ? html`
                  <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))} style="cursor:pointer;">
                    <ha-icon icon="mdi:car" style="--mdc-icon-size:12px;color:${travelColor};"></ha-icon>
                    <span style="color:${travelColor};">${travelTime}M</span>
                  </div>
                ` : ''}
                ${hasDist1 ? html`
                  <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))} style="cursor:pointer;">
                    <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                    <span>${parseFloat(this._distanceFromHome?.toFixed(distPrecision))}${this._distanceUnit}</span>
                  </div>
                ` : ''}
              `}
              ${pairDir2 ? html`
                <div class="matrix-chip sensor-pair-matrix clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;">
                  <div class="pair-a-matrix" style="animation-delay:-4s;">
                    <ha-icon icon="mdi:car" style="--mdc-icon-size:12px;color:${travelColor2};"></ha-icon>
                    <span style="color:${travelColor2};">${travelTime2}M</span>
                  </div>
                  <div class="pair-b-matrix" style="animation-delay:-4s;">
                    <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                    <span>${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))}${this._distanceUnit2}</span>
                  </div>
                </div>
              ` : html`
                ${hasTravel2 ? html`
                  <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))} style="cursor:pointer;">
                    <ha-icon icon="mdi:car" style="--mdc-icon-size:12px;color:${travelColor2};"></ha-icon>
                    <span style="color:${travelColor2};">${travelTime2}M</span>
                  </div>
                ` : ''}
                ${hasDist2 ? html`
                  <div class="matrix-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))} style="cursor:pointer;">
                    <ha-icon icon="mdi:map-marker" style="--mdc-icon-size:12px;color:#00ff41;"></ha-icon>
                    <span>${parseFloat(this._distanceFromHome2?.toFixed(distPrecision))}${this._distanceUnit2}</span>
                  </div>
                ` : ''}
              `}
              ${this._renderExtraChips('matrix')}
            </div>
          ` : ''}

          <!-- Footer -->
          <div class="matrix-footer-row">
            <div class="matrix-status-line">SYS::TRACKER v${CARD_VERSION}</div>
            ${lastChanged ? html`<div class="matrix-status-line" style="color:rgba(0,255,65,.45);">UPD ${lastChanged.toUpperCase()}</div>` : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderOrbitalLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    const stateAccent = entity.state === 'home' ? '#00d4aa' : entity.state === 'not_home' ? '#b44fff' : '#4a9eff';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _hexRgb = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _hexRgb(accentColor) || '0,212,170';

    const batteryLevel = Math.round(this._batteryLevel);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const travelTime = Math.round(this._travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const travelColor = this._getTravelTimeColor(travelTime);
    const travelColor2 = this._getTravelTimeColor(travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionLabel = this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : '4G';
    const distPrecision = this.config.distance_precision ?? 1;

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    const weatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';
    const weatherLine = (this.config.show_weather && this.config.show_weather_temperature !== false && (this._weatherTemp || weatherLabel))
      ? [this._weatherTemp, weatherLabel].filter(Boolean).join(' · ')
      : '';

    // Deterministic star positions via seeded PRNG
    const r = this._rng('orbital_stars');
    const stars = Array.from({ length: 45 }, () => ({
      x: r() * 100, y: r() * 100,
      s: r() * 1.8 + 0.4,
      d: 2 + r() * 5,
      dl: r() * 5,
      a: 0.05 + r() * 0.12,
      b: 0.25 + r() * 0.5,
    }));

    // All sensors orbit as satellites (battery/device2 shown on coin back, not in orbit)
    const showSat2 = this.config.show_connection && !!this._connectionType;
    const showSat3 = this.config.show_activity && this._activity && this._activity !== 'unknown';
    const showSat4 = hasDist1 || hasTravel1;
    const showSat5 = hasDist2 || hasTravel2;
    const battery2Level = Math.round(this._battery2Level);
    const batteryColor2 = this._getBatteryColor(this._battery2Level);

    const cardBg = this.config.transparent_background
      ? 'transparent'
      : `linear-gradient(160deg,rgba(${accentRgb},0.03) 0%,#05050f 40%,#05050f 100%)`;
    const cardBorder = this.config.transparent_background ? 'transparent' : `rgba(${accentRgb},0.22)`;
    const cardShadow = this.config.transparent_background
      ? 'none'
      : `0 24px 64px rgba(0,0,0,0.85),0 0 80px rgba(${accentRgb},0.05),inset 0 1px 0 rgba(255,255,255,0.05)`;

    return html`
      <style>${this._getPairAnimationStyles('orbital')}</style>
      <ha-card class="${this.config.show_weather && this._weatherState && this.config.show_weather_background !== false ? 'weather-active' : ''}" style="
        background:${cardBg};
        border:1px solid ${cardBorder};
        border-radius:${this.config.card_border_radius};
        box-shadow:${cardShadow};
        overflow:hidden;
        position:relative;
      ">
        ${this._renderWeatherBg()}

        <!-- Stars -->
        ${this.config.show_particles !== false ? html`
        <div class="orb-stars" aria-hidden="true">
          ${stars.map(s => html`<div class="orb-star" style="
            left:${s.x}%;top:${s.y}%;
            width:${s.s}px;height:${s.s}px;
            --orb-d:${s.d}s;--orb-dl:-${s.dl}s;
            --orb-a:${s.a};--orb-b:${s.b};
          "></div>`)}
        </div>` : ''}

        <!-- Grid overlay -->
        <div class="orb-grid" style="background-image:linear-gradient(rgba(${accentRgb},0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(${accentRgb},0.03) 1px,transparent 1px);" aria-hidden="true"></div>

        <!-- Scan sweep -->
        <div class="orb-scan" style="background:linear-gradient(transparent,rgba(${accentRgb},0.04),transparent);" aria-hidden="true"></div>

        <!-- Content -->
        <div class="orb-content">

          <!-- Header: name + LIVE -->
          <div class="orb-header">
            <div class="orb-name clickable" @click=${() => this._handleTapAction()}
                 style="text-shadow:0 0 24px rgba(${accentRgb},0.5);">
              ${this.config.show_person_name ? personName : ''}
            </div>
            <div class="orb-live" style="color:rgba(${accentRgb},0.85);border-color:rgba(${accentRgb},0.3);">● LIVE</div>
          </div>

          <!-- Zone row -->
          ${this.config.show_name ? html`
          <div class="orb-zone clickable" @click=${() => this.config.maps_provider && this._gpsLat ? this._openMaps() : this._handleTapAction()}>
            <div class="orb-zone-dot" style="background:${accentColor};box-shadow:0 0 8px ${accentColor};"></div>
            <span class="orb-zone-name">${displayLocation}</span>
          </div>` : ''}

          <!-- ── SPHERE SECTION ── -->
          <div class="orb-sphere">

            <!-- Pulse rings (expand outward, 3 staggered) -->
            ${this.config.show_particles !== false ? html`
            <div class="orb-pulse" style="border-color:rgba(${accentRgb},0.5);"></div>
            <div class="orb-pulse" style="border-color:rgba(${accentRgb},0.4);animation-delay:1s;"></div>
            <div class="orb-pulse" style="border-color:rgba(${accentRgb},0.3);animation-delay:2s;"></div>` : ''}

            <!-- Glow halo -->
            <div class="orb-halo" style="background:radial-gradient(circle,rgba(${accentRgb},0.14) 0%,transparent 70%);"></div>

            <!-- Orbital rings -->
            <div class="orb-ring orb-ring-1" style="border-color:rgba(${accentRgb},0.32);box-shadow:0 0 10px rgba(${accentRgb},0.08);"></div>
            <div class="orb-ring orb-ring-2" style="border-color:rgba(${accentRgb},0.18);"></div>
            <div class="orb-ring orb-ring-3" style="border-color:rgba(${accentRgb},0.1);"></div>

            <!-- Orbiting satellites – connection / activity / travel -->
            ${showSat2 ? html`
            <div class="orb-sat orb-sat-2 clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}
                 style="border-color:rgba(0,212,255,0.5);color:#00d4ff;box-shadow:0 0 10px rgba(0,212,255,0.12);">
              <ha-icon icon="${connectionIcon}" style="--mdc-icon-size:11px;color:#00d4ff;"></ha-icon>
              <span>${connectionLabel}</span>
            </div>` : ''}
            ${showSat3 ? html`
            <div class="orb-sat orb-sat-3 clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}
                 style="border-color:rgba(180,80,255,0.5);color:#b44fff;box-shadow:0 0 10px rgba(180,80,255,0.12);">
              <ha-icon icon="${this._activityIcon || 'mdi:run'}" style="--mdc-icon-size:11px;color:#b44fff;"></ha-icon>
              <span>${this._activity}</span>
            </div>` : ''}
            ${showSat4 ? html`
            <div class="orb-sat orb-sat-4" style="overflow:hidden;border-color:rgba(0,212,255,0.5);">
              ${pairDir1 ? html`
                <div class="pair-a-orbital" style="display:flex;align-items:center;gap:4px;color:#00d4ff;"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))}>
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:11px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
                <div class="pair-b-orbital" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4px;color:${travelColor};"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))}>
                  <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:11px;"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
              ` : hasDist1 ? html`
                <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:11px;color:#00d4ff;"></ha-icon>
                <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
              ` : html`
                <ha-icon icon="${this._travelIcon || 'mdi:car-clock'}" style="--mdc-icon-size:11px;color:${travelColor};"></ha-icon>
                <span style="color:${travelColor};">${this._formatTravelTime(travelTime)}</span>
              `}
            </div>` : ''}
            ${this._renderExtraChips('orbital', {accentRgb})}
            ${showSat5 ? html`
            <div class="orb-sat orb-sat-5" style="overflow:hidden;border-color:rgba(0,212,255,0.45);">
              ${pairDir2 ? html`
                <div class="pair-a-orbital" style="display:flex;align-items:center;gap:4px;color:#00d4ff;"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))}>
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:11px;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
                <div class="pair-b-orbital" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:4px;color:${travelColor2};"
                     @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))}>
                  <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:11px;"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
              ` : hasDist2 ? html`
                <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:11px;color:#00d4ff;"></ha-icon>
                <span style="color:#00d4ff;">${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
              ` : html`
                <ha-icon icon="${this._travelIcon2 || 'mdi:car-clock'}" style="--mdc-icon-size:11px;color:${travelColor2};"></ha-icon>
                <span style="color:${travelColor2};">${this._formatTravelTime(travelTime2)}</span>
              `}
            </div>` : ''}
            <!-- 3D Coin (front=photo, back=batteries) -->
            <div class="orb-coin">
              <!-- Front face: entity picture -->
              <div class="orb-face orb-front clickable" @click=${() => this._handleTapAction()}
                   style="border-color:${accentColor};box-shadow:0 0 0 4px rgba(${accentRgb},0.12),0 0 32px rgba(${accentRgb},0.3);">
                ${this.config.show_entity_picture && entityPicture
                  ? html`<img src="${entityPicture}" alt="${personName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">`
                  : html`<span style="font-size:46px;line-height:1;">👤</span>`}
              </div>
              <!-- Back face: battery levels -->
              <div class="orb-face orb-back" style="border-color:rgba(${accentRgb},0.45);box-shadow:0 0 20px rgba(${accentRgb},0.15);">
                ${batteryLevel > 0 ? html`
                <div class="orb-back-bat clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}>
                  <ha-icon icon="mdi:cellphone" style="--mdc-icon-size:11px;color:${this._batteryCharging ? '#4ade80' : batteryColor};"></ha-icon>
                  <span style="color:${this._batteryCharging ? '#4ade80' : batteryColor};">${batteryLevel}%</span>
                  ${this._batteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;"></ha-icon>` : ''}
                </div>` : ''}
                ${this._watchBatteryLevel > 0 ? html`
                <div class="orb-back-bat clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}>
                  <ha-icon icon="mdi:watch" style="--mdc-icon-size:11px;color:${this._watchBatteryCharging ? '#4ade80' : this._getBatteryColor(this._watchBatteryLevel)};"></ha-icon>
                  <span style="color:${this._watchBatteryCharging ? '#4ade80' : this._getBatteryColor(this._watchBatteryLevel)};">${Math.round(this._watchBatteryLevel)}%</span>
                  ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;"></ha-icon>` : ''}
                </div>` : ''}
                ${battery2Level > 0 ? html`
                <div class="orb-back-bat clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('device_2_battery'))}>
                  <ha-icon icon="${this._getDeviceIcon(this._resolvedPrefix2 || this.config.device_2_prefix)}" style="--mdc-icon-size:11px;color:${this._battery2Charging ? '#4ade80' : batteryColor2};"></ha-icon>
                  <span style="color:${this._battery2Charging ? '#4ade80' : batteryColor2};">${battery2Level}%</span>
                  ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4ade80;"></ha-icon>` : ''}
                </div>` : ''}
                <span class="orb-back-lbl" style="margin-top:3px;">batteries</span>
              </div>
            </div>

          </div>
          <!-- ── END SPHERE ── -->

          <!-- Last changed -->
          ${this.config.show_last_changed ? html`
          <div class="orb-last-changed" style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : `color:rgba(${accentRgb},0.4);`}">
            ${this._getRelativeTime(entity.last_changed)}
          </div>` : ''}

          <!-- Geocoded address -->
          ${this.config.show_geocoded_location && entity.state !== 'home' && this._geocodedLocation ? html`
          <div class="orb-geo clickable" @click=${() => this._showMoreInfo(geoEntityId)}
               style="border-color:rgba(${accentRgb},0.12);background:rgba(${accentRgb},0.04);">
            ${this._renderGeocoded(geoEntityId, `font-size:10px;color:rgba(${accentRgb},0.55);text-align:center;`)}
          </div>` : ''}

          <!-- ── WEATHER FOOTER ── -->
          ${weatherLine ? html`
          <div class="orb-weather">
            <span class="clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)}
                  style="${this.config.weather_text_color ? `color:${this.config.weather_text_color};` : ''}">
              ${this._weatherIcon ? html`<ha-icon icon="${this._weatherIcon}" style="--mdc-icon-size:14px;vertical-align:middle;margin-right:3px;"></ha-icon>` : ''}
              ${weatherLine}
            </span>
          </div>` : ''}

        </div><!-- /orb-content -->
      </ha-card>
    `;
  }

  _renderInkLayout() {
    const entity = this.hass.states[this.config.entity];
    const stateConfig = this._getCurrentStateConfig();
    const personName = this.config.name || entity.attributes?.friendly_name || 'Person';
    const customStateEnt = this.config.state_entity ? this.hass.states[this.config.state_entity] : null;
    const displayLocation = customStateEnt?.state || stateConfig?.name || this._translateState(entity.state);
    const geoEntityId = this.config.geocoded_location_entity || (this._resolvedPrefix ? `sensor.${this._resolvedPrefix}_geocoded_location` : null);
    const entityPicture = stateConfig?.entity_picture || this.config.entity_picture || entity.attributes?.entity_picture;

    // Default ink accents: green=home, violet=away, navy=zone — overridden by custom state color
    const stateAccent = entity.state === 'home' ? '#2563eb' : entity.state === 'not_home' ? '#7c3aed' : '#0f766e';
    const accentColor = stateConfig?.styles?.name?.color || stateAccent;
    const _hexRgb = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex); return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : null; };
    const accentRgb = _hexRgb(accentColor) || '45,106,79';

    const batteryLevel = Math.round(this._batteryLevel);
    const batteryColor = this._getBatteryColor(this._batteryLevel);
    const battery2Level = Math.round(this._battery2Level);
    const batteryColor2 = this._getBatteryColor(this._battery2Level);
    const travelTime = Math.round(this._travelTime);
    const travelTime2 = Math.round(this._travelTime2);
    const connectionIcon = this._isWifiConnection(this._connectionType) ? 'mdi:wifi' : 'mdi:signal';
    const connectionLabel = this._isWifiConnection(this._connectionType) ? this._getWifiLabel() : '4G';
    const distPrecision = this.config.distance_precision ?? 1;

    const hasDir1 = !!(this.config.travel_sensor || this.config.distance_sensor);
    const hasDir2 = !!(this.config.travel_sensor_2 || this.config.distance_sensor_2);
    const isHome = entity.state === 'home';
    const smartMode = this.config.smart_travel_mode !== false;
    const zone2Name = this.config.zone_2
      ? (this.hass.states[this.config.zone_2]?.attributes?.friendly_name || this.config.zone_2.replace('zone.', '').replace(/_/g, ' '))
      : null;
    const isZone2 = zone2Name && entity.state.toLowerCase() === zone2Name.toLowerCase();
    const showDir1 = !smartMode || !hasDir2 || !isZone2;
    const showDir2 = hasDir2 && (!smartMode || !isHome || !hasDir1);
    const hasDist1 = showDir1 && this.config.show_distance && this._distanceSensorFound;
    const hasTravel1 = showDir1 && this.config.show_travel_time && travelTime > 0;
    const hasDist2 = showDir2 && this.config.show_distance_2 && this._distanceSensorFound2;
    const hasTravel2 = showDir2 && this.config.show_travel_time_2 && travelTime2 > 0;
    const pairDir1 = hasDist1 && hasTravel1 && (this.config.pair_travel_animation !== false);
    const pairDir2 = hasDist2 && hasTravel2 && (this.config.pair_travel_animation !== false);

    const weatherLabel = this._weatherState ? this._t(`weather.${this._weatherState}`) : '';
    const weatherLine = (this.config.show_weather && this.config.show_weather_temperature !== false && (this._weatherTemp || weatherLabel))
      ? [this._weatherTemp, weatherLabel].filter(Boolean).join(' · ')
      : '';

    // Zone icon from HA zone entity
    const zoneEntity = entity.state !== 'home' && entity.state !== 'not_home'
      ? (this.hass.states[`zone.${entity.state}`] || null) : null;
    const zoneHaIcon = zoneEntity?.attributes?.icon
      || (entity.state === 'home' ? 'mdi:home' : entity.state === 'not_home' ? 'mdi:map-marker-off' : 'mdi:map-marker');

    const cardBg = this.config.transparent_background ? 'transparent' : '#ffffff';
    const hasWeather = !!(this.config.show_weather && this._weatherState && this.config.show_weather_background !== false);

    return html`
      <style>${this._getPairAnimationStyles('ink')}</style>
      <ha-card class="${hasWeather ? 'weather-active' : ''}" style="
        --ha-card-background:${cardBg};
        background:${cardBg};
        --ink-accent:${accentColor};
        --ink-accent-rgb:${accentRgb};
        border:none;
        border-radius:${this.config.card_border_radius || '20px'};
        box-shadow:${this.config.transparent_background ? 'none' : '0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06)'};
        overflow:hidden;position:relative;
      ">
        ${this._renderWeatherBg()}

        <!-- Main content wrapper -->
        <div class="ink-main">

          <!-- ── TOP ROW: photo | info | battery panel ── -->
          <div class="ink-top">

            <!-- Photo -->
            <div class="ink-photo-wrap clickable" @click=${() => this._handleTapAction()}>
              <div class="ink-photo">
                ${this.config.show_entity_picture && entityPicture
                  ? html`<img src="${entityPicture}" alt="${personName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;">`
                  : html`<span style="font-size:38px;line-height:1;">👤</span>`}
              </div>
            </div>

            <!-- Name + zone + last changed -->
            <div class="ink-info">
              ${this.config.show_person_name ? html`
              <div class="ink-name clickable" @click=${() => this._handleTapAction()}
                   style="${this.config.name_font_size ? `font-size:${this.config.name_font_size};` : ''}color:#111827;">
                ${personName}
              </div>` : ''}

              ${this.config.show_name || this.config.show_last_changed ? html`
              <div class="ink-meta">
                ${this.config.show_name ? html`
                <span class="ink-zone clickable"
                      @click=${() => this.config.maps_provider && this._gpsLat ? this._openMaps() : this._handleTapAction()}
                      style="color:#4b5563;${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">
                  <ha-icon icon="${zoneHaIcon}" style="--mdc-icon-size:13px;color:#9ca3af;vertical-align:middle;margin-right:2px;"></ha-icon>${displayLocation}
                </span>` : ''}
                ${this.config.show_name && this.config.show_last_changed ? html`<span class="ink-meta-sep">·</span>` : ''}
                ${this.config.show_last_changed ? html`
                <span class="ink-time" style="${this.config.last_changed_color ? `color:${this.config.last_changed_color};` : 'color:#6b7280;'}">
                  ${this._getRelativeTime(entity.last_changed)}
                </span>` : ''}
              </div>` : ''}

              <!-- Geocoded address (below meta line) -->
              ${this.config.show_geocoded_location !== false && entity.state !== 'home' && this._geocodedLocation ? html`
              <div class="ink-geo clickable"
                   @click=${() => this.config.maps_provider && this._gpsLat ? this._openMaps() : this._showMoreInfo(geoEntityId)}
                   style="${this.config.maps_provider && this._gpsLat ? 'cursor:pointer;' : ''}">
                ${this._renderGeocoded(geoEntityId, `font-size:10px;color:#9ca3af;`)}
              </div>` : ''}
            </div>

            <!-- Battery panel: icon + % + connection/device2 -->
            ${this.config.show_battery && batteryLevel > 0 ? html`
            <div class="ink-bat-panel clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('battery'))}>
              <ha-icon icon="${this._batteryIcon || 'mdi:battery'}" style="--mdc-icon-size:22px;color:${batteryColor};${this._batteryCharging ? 'filter:drop-shadow(0 0 4px rgba(76,175,80,0.6));' : ''}"></ha-icon>
              <div class="ink-bat-pct" style="color:${batteryColor};">${batteryLevel}%</div>
              ${this.config.show_connection && this._connectionType ? html`
              <div class="ink-bat-conn" @click=${(e) => { e.stopPropagation(); this._showMoreInfo(this._getSensorEntityId('connection')); }}>
                <ha-icon icon="${connectionIcon}" style="--mdc-icon-size:10px;color:#9ca3af;margin-right:1px;vertical-align:middle;"></ha-icon>${connectionLabel}
              </div>` : ''}
            </div>` : html`
            ${this.config.show_connection && this._connectionType ? html`
            <div class="ink-bat-panel clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('connection'))}>
              <ha-icon icon="${connectionIcon}" style="--mdc-icon-size:22px;color:${accentColor};"></ha-icon>
              <div class="ink-bat-pct" style="color:${accentColor};">${connectionLabel}</div>
            </div>` : ''}`}
          </div><!-- /ink-top -->

          <!-- ── ACCENT SEPARATOR ── -->
          <div class="ink-sep"></div>

          <!-- ── CHIPS ROW ── -->
          <div class="ink-chips">
            <!-- Watch battery -->
            ${this.config.show_watch_battery && this._watchBatteryLevel > 0 ? html`
            <div class="ink-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('watch_battery'))}>
              <ha-icon icon="mdi:watch" style="--mdc-icon-size:13px;color:${this._watchBatteryCharging ? '#4caf50' : this._getBatteryColor(this._watchBatteryLevel)};"></ha-icon>
              <span>${Math.round(this._watchBatteryLevel)}%</span>
              ${this._watchBatteryCharging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4caf50;"></ha-icon>` : ''}
            </div>` : ''}

            <!-- Device 2 battery -->
            ${this.config.show_device_2_battery !== false && battery2Level > 0 ? html`
            <div class="ink-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('device_2_battery'))}>
              <ha-icon icon="${this._getDeviceIcon(this._resolvedPrefix2 || this.config.device_2_prefix)}" style="--mdc-icon-size:13px;color:${this._battery2Charging ? '#4caf50' : batteryColor2};"></ha-icon>
              <span>${battery2Level}%</span>
              ${this._battery2Charging ? html`<ha-icon icon="mdi:lightning-bolt" style="--mdc-icon-size:9px;color:#4caf50;"></ha-icon>` : ''}
            </div>` : ''}

            <!-- Travel dir 1 -->
            ${(hasDist1 || hasTravel1) ? html`
            <div class="ink-chip sensor-pair-ink">
              ${pairDir1 ? html`
                <div class="pair-a-ink" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel'))}>
                  <ha-icon icon="${this._travelIcon || 'mdi:home-clock'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                  <span>${this._formatTravelTime(travelTime)}</span>
                </div>
                <div class="pair-b-ink" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance'))}>
                  <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
                </div>
              ` : hasDist1 ? html`
                <ha-icon icon="${this._distanceIcon || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                <span>${parseFloat(this._distanceFromHome.toFixed(distPrecision))} ${this._distanceUnit}</span>
              ` : html`
                <ha-icon icon="${this._travelIcon || 'mdi:home-clock'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                <span>${this._formatTravelTime(travelTime)}</span>
              `}
            </div>` : ''}

            <!-- Travel dir 2 -->
            ${(hasDist2 || hasTravel2) ? html`
            <div class="ink-chip sensor-pair-ink">
              ${pairDir2 ? html`
                <div class="pair-a-ink" @click=${() => this._showMoreInfo(this._getSensorEntityId('travel_2'))}>
                  <ha-icon icon="${this._travelIcon2 || 'mdi:office-building-marker'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                  <span>${this._formatTravelTime(travelTime2)}</span>
                </div>
                <div class="pair-b-ink" @click=${() => this._showMoreInfo(this._getSensorEntityId('distance_2'))}>
                  <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                  <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
                </div>
              ` : hasDist2 ? html`
                <ha-icon icon="${this._distanceIcon2 || 'mdi:map-marker-distance'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                <span>${parseFloat(this._distanceFromHome2.toFixed(distPrecision))} ${this._distanceUnit2}</span>
              ` : html`
                <ha-icon icon="${this._travelIcon2 || 'mdi:office-building-marker'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
                <span>${this._formatTravelTime(travelTime2)}</span>
              `}
            </div>` : ''}

            <!-- Activity -->
            ${this.config.show_activity && this._activity && this._activity !== 'unknown' ? html`
            <div class="ink-chip clickable" @click=${() => this._showMoreInfo(this._getSensorEntityId('activity'))}>
              <ha-icon icon="${this._activityIcon || 'mdi:run'}" style="--mdc-icon-size:13px;color:#6b7280;"></ha-icon>
              <span>${this._activity}</span>
            </div>` : ''}
            ${this._renderExtraChips('full')}
          </div><!-- /ink-chips -->

          <!-- ── WEATHER FOOTER ── -->
          ${weatherLine ? html`
          <div class="ink-weather-row">
            <span class="ink-weather clickable" @click=${() => this._showMoreInfo(this.config.weather_entity)}
                  style="${this.config.weather_text_color ? `color:${this.config.weather_text_color};` : 'color:#6b7280;'}">
              ${this._weatherIcon ? html`<ha-icon icon="${this._weatherIcon}" style="--mdc-icon-size:14px;vertical-align:middle;margin-right:3px;"></ha-icon>` : ''}
              ${weatherLine}
            </span>
            ${this.config.show_last_changed && !this.config.show_name ? html`
            <span style="color:#6b7280;font-size:10px;">${this._getRelativeTime(entity.last_changed)}</span>` : ''}
          </div>` : ''}

        </div><!-- /ink-main -->
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
      }

      ha-card:hover {
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }

      /* Charging animation */
      @keyframes charging-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.6);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
      }

      @keyframes charging-glow {
        0%, 100% {
          filter: brightness(1);
        }
        50% {
          filter: brightness(1.3);
        }
      }

      .charging {
        animation: charging-glow 2s ease-in-out infinite;
      }


      .charging-ring {
        animation: charging-glow 2s ease-in-out infinite;
      }

      .card-container {
        position: relative;
        width: 100%;
        height: 0;
      }

      .card-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        overflow: hidden;
      }

      .content-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      .content-bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: auto;
      }

      .entity-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 0 auto;
        max-width: 100%;
        max-height: 100%;
      }


      .entity-picture img {
        display: block;
        margin: auto;
        width: 100%;       /* o una dimensione fissa, es. 100px */
        height: 100%;      /* stessa misura per avere un cerchio */
        max-width: 100%;
        border-radius: 50%;  /* rende l'immagine circolare */
        border: 3px solid var(--primary-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        background-color: white;
        object-fit: cover;   /* fa il ritaglio proporzionale */
      }


      .entity-picture img.custom-image {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        object-fit: contain !important;
      }

      .entity-picture img.custom-state-image {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        object-fit: contain !important;
      }



      .position-button-group.buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .position-button-group.buttons button {
        padding: 6px 12px;
        border: 1px solid var(--divider-color);
        background: none;
        cursor: pointer;
        border-radius: 4px;
        color: var(--primary-text-color);
        transition: background-color 0.3s;
      }

      .position-button-group.buttons button.selected {
        background-color: var(--primary-color);
        color: white;
      }

      .custom-field.watch-battery {
        font-weight: 500;
      }

      .entity-person-name {
        font-weight: 600;
        text-align: center;
        color: var(--primary-text-color);
        line-height: 1.2;
      }

      .entity-state-name {
        font-weight: 500;
        text-align: center;
        line-height: 1.3;
      }

      .entity-last-changed {
        color: var(--secondary-text-color);
        text-align: center;
        font-size: 0.9em;
        line-height: 1.2;
      }

      .entity-name {
        font-weight: 500;
        text-align: center;
        margin: 8px 0 4px 0;
      }

      .entity-state {
        color: var(--secondary-text-color);
        text-align: center;
      }

      .custom-field {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 2px;
        background: var(--card-background-color);
        padding: 2px 6px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      }

      .custom-field.battery {
        font-weight: 500;
      }

      .warning {
        padding: 16px;
        color: var(--error-color);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .warning ha-icon {
        --mdc-icon-size: 48px;
      }

      ha-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      /* Compact Layout Styles */
      .compact-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto auto auto;
        grid-template-areas:
          "picture name"
          "picture location"
          "picture weather"
          "icons   icons";
        row-gap: 1px;
      }

      .compact-picture {
        grid-area: picture;
        justify-self: start;
        align-self: start;
        margin-right: 8px;
      }

      .compact-picture img {
        border: 3px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        object-fit: cover;
      }

      .compact-name {
        grid-area: name;
        justify-self: start;
        align-self: end;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding: 0;
      }

      .compact-location {
        grid-area: location;
        justify-self: stretch;
        align-self: start;
        font-size: 10px;
        margin: 0;
        padding: 0;
        margin-bottom: 3px;
        min-width: 0;
        overflow: hidden;
      }

      .compact-icons {
        grid-area: icons;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        padding-top: 6px;
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.1));
        margin-top: 3px;
      }

      .compact-icon-badge {
        background: var(--secondary-background-color, rgba(255,255,255,0.1));
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color, #fff);
      }
      /* ── Compact weather contrast ── */
      .weather-active .compact-icon-badge {
        background: rgba(0,0,0,0.45);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .weather-active .compact-name {
        color: #fff !important;
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7);
      }
      .weather-active .compact-location {
        text-shadow: 0 1px 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.7);
      }
      .weather-active .compact-icons span,
      .weather-active .compact-icons ha-icon {
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));
      }
      .weather-active .compact-picture img {
        box-shadow: 0 0 0 2px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.7);
      }

      /* ── Classic weather contrast ── */
      .weather-active .entity-person-name,
      .weather-active .entity-state-name {
        color: #fff !important;
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
      }
      .weather-active .geo-marquee-outer,
      .weather-active .geo-marquee-inner {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
        color: rgba(255,255,255,0.75) !important;
      }
      .weather-active .entity-last-changed {
        color: #fff;
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
      }
      .weather-active .entity-picture img {
        box-shadow: 0 0 0 3px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.7);
      }
      .weather-active .sensor-badge,
      .weather-active .icon-badge {
        background: rgba(0,0,0,0.5) !important;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        color: #fff !important;
        text-shadow: 0 1px 3px rgba(0,0,0,0.9);
      }
      .weather-active .sensor-badge ha-icon,
      .weather-active .icon-badge ha-icon {
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));
      }

      /* ── Modern weather contrast ── */
      .weather-active .modern-container .entity-person-name,
      .weather-active .modern-container div[style*="color"] {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
      }
      .weather-active .modern-chip,
      .weather-active .sensor-chip {
        background: rgba(0,0,0,0.5) !important;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        color: #fff !important;
        border-color: rgba(255,255,255,0.15) !important;
      }

      /* ── Glass weather contrast ── */
      .weather-active .glass-name,
      .weather-active .glass-zone-text,
      .weather-active .glass-time {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
        color: #fff !important;
      }
      .weather-active .glass-chip {
        background: rgba(0,0,0,0.5) !important;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      /* ── Bio weather contrast ── */
      .weather-active .bio-name,
      .weather-active .bio-zone {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
        color: #fff !important;
      }
      .weather-active .bio-chip {
        background: rgba(0,0,0,0.5) !important;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      /* ── Holo weather contrast ── */
      .weather-active .holo-name {
        text-shadow: 0 1px 8px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8) !important;
        color: #fff !important;
      }
      .weather-active .holo-loc,
      .weather-active .holo-sub {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.8);
      }
      .weather-active .holo-metric {
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
      }

      /* Modern Layout Styles */
      .modern-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        width: 100%;
        overflow: hidden;
      }

      .modern-picture {
        flex-shrink: 0;
      }

      .modern-info {
        flex: 1 1 auto;
        min-width: 60px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
      }

      .modern-info div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .modern-rings {
        display: flex;
        flex-direction: row;
        gap: 6px;
        flex-shrink: 1;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-left: auto;
        min-width: 0;
      }

      .ring-container {
        position: relative;
        width: 38px;
        height: 38px;
        flex-shrink: 0;
        border-radius: 50%;
        background: rgba(0,0,0,0.45);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      .ring-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .ring-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .ring-value {
        font-size: 11px;
        font-weight: bold;
        color: var(--primary-text-color, #fff);
      }

      .ring-unit {
        font-size: 7px;
        color: var(--secondary-text-color, #aaa);
        margin-top: 1px;
      }

      .ring-icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-background-color, rgba(255,255,255,0.1));
        border-radius: 50%;
      }

      .ring-icon-only ha-icon {
        --mdc-icon-size: 22px;
      }

      .clickable {
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }

      .clickable:hover {
        transform: scale(1.1);
        opacity: 0.8;
      }

      .clickable:active {
        transform: scale(0.95);
      }

      .circular-chart {
        display: block;
      }

      .circle-bg {
        stroke-linecap: round;
      }

      .circle {
        stroke-linecap: round;
        transition: stroke-dasharray 0.3s ease;
      }

      @media (max-width: 400px) {
        .custom-field {
          font-size: 11px !important;
        }

        .custom-field ha-icon {
          --mdc-icon-size: 14px;
        }
      }

      /* ===== WEATHER BACKGROUND ANIMATIONS ===== */

      /* Content layers stay above the weather background */
      .card-container { z-index: 1; }
      .compact-grid { position: relative; z-index: 1; }
      .modern-container { position: relative; z-index: 1; }

      .weather-bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
        border-radius: inherit;
        transition: background 1.4s ease;
      }
      .weather-bg[data-clickable] { pointer-events: auto; cursor: pointer; }

      /* Dark scrim overlay — ensures text readability on any weather background */
      .weather-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.48) 100%);
        pointer-events: none;
        z-index: 1;
      }

      /* ── State gradients ── */
      .weather-bg--sunny           { background: linear-gradient(155deg, #0a3a7a 0%, #1260a8 30%, #c27a10 75%, #c8a020 100%); }
      .weather-bg--clear-night     { background: linear-gradient(175deg, #000208 0%, #030b1e 40%, #060d22 70%, #0b1535 100%); }
      .weather-bg--partlycloudy    { background: linear-gradient(155deg, #0d3d80 0%, #1e6aaa 45%, #3a7fc0 100%); }
      .weather-bg--partlycloudy.weather-bg--night { background: linear-gradient(175deg, #020510 0%, #050d22 50%, #0d1a3a 100%); }
      .weather-bg--cloudy          { background: linear-gradient(175deg, #2a3440 0%, #3a4a58 40%, #506070 100%); }
      .weather-bg--fog             { background: linear-gradient(180deg, #3a4450 0%, #566070 50%, #728090 100%); }
      .weather-bg--windy,
      .weather-bg--windy-variant   { background: linear-gradient(145deg, #003028 0%, #004840 40%, #0d6a60 80%, #207870 100%); }
      .weather-bg--rainy           { background: linear-gradient(175deg, #1a237e 0%, #283593 40%, #37474f 100%); }
      .weather-bg--snowy-rainy     { background: linear-gradient(175deg, #1b2a4a 0%, #2e3f6b 50%, #546380 100%); }
      .weather-bg--pouring         { background: linear-gradient(175deg, #090c20 0%, #10152e 40%, #1a2035 100%); }
      .weather-bg--snowy           { background: linear-gradient(175deg, #2a3840 0%, #3e5460 50%, #587080 100%); }
      .weather-bg--hail            { background: linear-gradient(165deg, #263238 0%, #37474f 40%, #546e7a 100%); }
      .weather-bg--lightning       { background: linear-gradient(175deg, #0a0a1f 0%, #12103a 40%, #1e1040 100%); }
      .weather-bg--lightning-rainy { background: linear-gradient(175deg, #050510 0%, #0a0820 40%, #110c28 100%); }
      .weather-bg--exceptional     { background: linear-gradient(145deg, #bf360c 0%, #e64a19 40%, #ff7043 100%); }

      /* ── Sun ── */
      .w-sun { position: absolute; top: 10%; left: 50%; transform: translateX(-50%); pointer-events: none; }
      .sun-core {
        width: 90px; height: 90px; border-radius: 50%;
        background: radial-gradient(circle at 38% 36%, #fff8e1 0%, #ffe082 30%, #ffb300 65%, #e65100 100%);
        box-shadow: 0 0 0 10px rgba(255,224,82,.12), 0 0 30px 12px rgba(255,193,7,.4), 0 0 80px 30px rgba(255,152,0,.3), 0 0 140px 60px rgba(230,81,0,.15);
        animation: sunBreath 4s ease-in-out infinite;
      }
      @keyframes sunBreath {
        0%,100% { box-shadow: 0 0 0 10px rgba(255,224,82,.12), 0 0 30px 12px rgba(255,193,7,.4), 0 0 80px 30px rgba(255,152,0,.3), 0 0 140px 60px rgba(230,81,0,.15); }
        50%     { box-shadow: 0 0 0 18px rgba(255,224,82,.18), 0 0 50px 20px rgba(255,193,7,.55), 0 0 110px 50px rgba(255,152,0,.35), 0 0 180px 80px rgba(230,81,0,.2); }
      }
      .sun-rays-wrap { position: absolute; inset: -60px; animation: rotateSun 22s linear infinite; }
      @keyframes rotateSun { to { transform: rotate(360deg); } }
      .sun-ray {
        position: absolute; top: 50%; left: 50%;
        transform-origin: 0 0; border-radius: 2px;
        background: linear-gradient(to right, rgba(255,236,100,.55), transparent);
      }
      .sun-halo {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 200px; height: 200px; border-radius: 50%;
        background: radial-gradient(circle, rgba(255,220,50,.12) 0%, transparent 70%);
        animation: haloFloat 6s ease-in-out infinite;
      }
      @keyframes haloFloat {
        0%,100% { transform: translate(-50%, -50%) scale(1); }
        50%     { transform: translate(-50%, -52%) scale(1.08); }
      }

      /* ── Stars / Moon / Aurora ── */
      .w-star { border-radius: 50%; background: #fff; position: absolute; }
      .w-star.t0 { animation: twinkle0 3.1s ease-in-out infinite; }
      .w-star.t1 { animation: twinkle1 4.2s ease-in-out infinite; }
      .w-star.t2 { animation: twinkle2 2.8s ease-in-out infinite; }
      .w-star.t3 { animation: twinkle3 5.1s ease-in-out infinite; }
      .w-star.t4 { animation: twinkle4 3.7s ease-in-out infinite; }
      @keyframes twinkle0 { 0%,100%{opacity:.9;transform:scale(1)} 50%{opacity:.2;transform:scale(.6)} }
      @keyframes twinkle1 { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:.15;transform:scale(.5)} }
      @keyframes twinkle2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
      @keyframes twinkle3 { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:.1;transform:scale(.4)} }
      @keyframes twinkle4 { 0%,100%{opacity:.85;transform:scale(1)} 50%{opacity:.25;transform:scale(.65)} }
      .w-shooting-star {
        position: absolute; top: 5%; left: 65%;
        width: 2px; height: 85px;
        background: linear-gradient(to top, rgba(255,255,255,.95), transparent);
        border-radius: 1px;
        transform: rotate(-30deg);
        animation: shootingStar 6s ease-in infinite 2s;
      }
      @keyframes shootingStar {
        0%   { opacity: 0; transform: rotate(-30deg) translate(0, 0); }
        6%   { opacity: 1; }
        35%  { opacity: 0; transform: rotate(-30deg) translate(-55px, 210px); }
        100% { opacity: 0; transform: rotate(-30deg) translate(-55px, 210px); }
      }
      .w-moon {
        position: absolute; top: 12%; left: 50%; transform: translateX(-50%);
        width: 70px; height: 70px; border-radius: 50%;
        background: radial-gradient(circle at 38% 35%, #f0f0e0 0%, #d8d8b0 50%, #b0a870 100%);
        box-shadow: inset -12px -8px 0 rgba(0,0,0,.18), 0 0 30px 10px rgba(220,210,150,.18), 0 0 80px 30px rgba(200,190,120,.08);
        animation: moonGlow 6s ease-in-out infinite;
      }
      @keyframes moonGlow {
        0%,100% { box-shadow: inset -12px -8px 0 rgba(0,0,0,.18), 0 0 30px 10px rgba(220,210,150,.18), 0 0 80px 30px rgba(200,190,120,.08); }
        50%     { box-shadow: inset -12px -8px 0 rgba(0,0,0,.18), 0 0 45px 18px rgba(220,210,150,.28), 0 0 110px 50px rgba(200,190,120,.14); }
      }
      .moon-crater { position: absolute; border-radius: 50%; background: rgba(0,0,0,.08); border: 1px solid rgba(0,0,0,.06); }
      .w-aurora { position: absolute; top: 0; left: -20%; right: -20%; height: 55%; pointer-events: none; overflow: hidden; }
      .aurora-ribbon { position: absolute; left: 0; right: 0; border-radius: 50%; filter: blur(28px); mix-blend-mode: screen; }
      @keyframes auroraWave  { 0%,100%{transform:translateY(0) scaleY(1) scaleX(1)} 50%{transform:translateY(20px) scaleY(1.4) scaleX(1.05)} }
      @keyframes auroraWave2 { 0%,100%{transform:translateY(0) scaleY(1) scaleX(1)} 50%{transform:translateY(-18px) scaleY(1.2) scaleX(.97)} }

      /* ── Clouds ── */
      .w-cloud { position: absolute; pointer-events: none; }
      .cloud-body { border-radius: 50px; position: relative; }
      .cloud-body.w-cloud-day   { background: rgba(255,255,255,.82); box-shadow: 0 8px 24px rgba(0,0,0,.12), inset 0 -4px 8px rgba(0,0,0,.06); }
      .cloud-body.w-cloud-night { background: rgba(40,55,90,.8);     box-shadow: 0 6px 20px rgba(0,0,0,.4); }
      .cloud-body.w-cloud-grey  { background: rgba(120,130,145,.75); box-shadow: 0 6px 18px rgba(0,0,0,.25), inset 0 -3px 6px rgba(0,0,0,.1); }
      .cloud-body.w-cloud-dark  { background: rgba(30,35,55,.85);    box-shadow: 0 8px 20px rgba(0,0,0,.5), inset 0 -4px 8px rgba(0,0,0,.2); }
      .cloud-body.w-cloud-storm { background: rgba(20,15,40,.9);     box-shadow: 0 8px 24px rgba(80,40,200,.2), inset 0 -4px 8px rgba(0,0,0,.3); }
      @keyframes cloudFloat  { 0%,100%{transform:translateX(0) translateY(0)} 33%{transform:translateX(6px) translateY(-3px)} 66%{transform:translateX(-4px) translateY(2px)} }
      @keyframes cloudFloat2 { 0%,100%{transform:translateX(0) translateY(0)} 40%{transform:translateX(-8px) translateY(2px)} 75%{transform:translateX(5px) translateY(-2px)} }
      @keyframes cloudFloat3 { 0%,100%{transform:translateX(0) translateY(0)} 30%{transform:translateX(10px) translateY(3px)} 65%{transform:translateX(-6px) translateY(-3px)} }

      /* ── Fog ── */
      .w-fog-band { position: absolute; left: -10%; width: 120%; border-radius: 60%; pointer-events: none; }
      @keyframes fogDrift  { 0%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(4%) scaleY(1.1)} 100%{transform:translateX(0) scaleY(1)} }
      @keyframes fogDrift2 { 0%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(-5%) scaleY(.9)} 100%{transform:translateX(0) scaleY(1)} }

      /* ── Wind ── */
      .w-wind-line { position: absolute; border-radius: 2px; left: -30%; pointer-events: none; }
      @keyframes windSweep { 0%{transform:translateX(0);opacity:0} 8%{opacity:1} 85%{opacity:.6} 100%{transform:translateX(160%);opacity:0} }

      /* ── Rain ── */
      .w-rain-drop {
        position: absolute; top: -8%; border-radius: 1px; pointer-events: none;
        background: linear-gradient(to bottom, rgba(180,210,255,.7), rgba(140,180,240,.3));
      }
      @keyframes rainFall      { 0%{transform:translateY(0) translateX(0);opacity:0} 5%{opacity:1} 95%{opacity:.7} 100%{transform:translateY(120vh) translateX(-60px);opacity:0} }
      @keyframes rainFallHeavy { 0%{transform:translateY(0) translateX(0);opacity:0} 4%{opacity:1} 94%{opacity:.8} 100%{transform:translateY(120vh) translateX(-90px);opacity:0} }
      .w-splash {
        position: absolute; bottom: 2%; border-radius: 50%; pointer-events: none;
        border: 1px solid rgba(180,210,255,.4);
        animation: splash .6s ease-out infinite;
      }
      @keyframes splash { 0%{transform:scale(0);opacity:.8} 100%{transform:scale(1);opacity:0} }
      .rain-atmosphere {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(to bottom, transparent 60%, rgba(10,20,60,.3) 100%);
      }

      /* ── Snow ── */
      .w-snowflake {
        position: absolute; top: -5%; pointer-events: none; user-select: none;
        color: rgba(255,255,255,.85); text-shadow: 0 0 6px rgba(200,230,255,.6);
        animation-name: snowFall; animation-timing-function: ease-in; animation-fill-mode: both;
      }
      @keyframes snowFall {
        0%  { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
        8%  { opacity: 1; }
        90% { opacity: .8; }
        100%{ transform: translateY(110vh) translateX(var(--sx,0px)) rotate(var(--sr,360deg)); opacity: 0; }
      }
      .snow-ground {
        position: absolute; bottom: 0; left: -5%; right: -5%; height: 28%; pointer-events: none;
        background: linear-gradient(to top, rgba(255,255,255,.55), transparent);
        border-radius: 60% 60% 0 0;
      }

      /* ── Hail ── */
      .w-hail-drop {
        position: absolute; top: -5%; border-radius: 50%; pointer-events: none;
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.9), rgba(200,230,255,.6) 60%, rgba(150,200,240,.3));
        box-shadow: 0 2px 6px rgba(0,0,0,.25), inset 0 1px 2px rgba(255,255,255,.7);
      }
      @keyframes hailFall { 0%{transform:translateY(0) translateX(0);opacity:0} 6%{opacity:1} 92%{opacity:1} 100%{transform:translateY(110vh) translateX(var(--hx,0px));opacity:0} }

      /* ── Lightning ── */
      .w-lightning-bolt { position: absolute; pointer-events: none; z-index: 10; }
      .bolt-svg { filter: drop-shadow(0 0 6px #c8b0ff) drop-shadow(0 0 20px #9060ff); }
      @keyframes boltFlash { 0%,100%{opacity:0} 2%{opacity:1} 5%{opacity:.3} 7%{opacity:1} 12%{opacity:0} }
      .w-sky-flash {
        position: absolute; inset: 0; pointer-events: none;
        background: rgba(200,180,255,.12);
        animation: skyFlash 1s ease-in-out infinite;
      }
      @keyframes skyFlash { 0%,100%{opacity:0} 3%{opacity:1} 6%{opacity:.2} 9%{opacity:.8} 15%{opacity:0} }

      /* ── Exceptional ── */
      .w-exceptional-particle { position: absolute; border-radius: 50%; pointer-events: none; }
      @keyframes dustSwirl { 0%{transform:rotate(0deg) translateX(var(--dr,40px)) rotate(0deg);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:rotate(360deg) translateX(var(--dr,40px)) rotate(-360deg);opacity:0} }

      /* Temperature label — absolute sibling of weather-bg, always on top */
      .weather-bg-temp {
        position: absolute;
        bottom: 7px;
        right: 10px;
        z-index: 2;
        font-size: 11px;
        font-weight: 700;
        color: rgba(255,255,255,0.85);
        text-shadow: 0 1px 4px rgba(0,0,0,0.65);
        pointer-events: none;
        letter-spacing: 0.03em;
        line-height: 1;
      }
.weather-bg-temp-classic {
        color: rgba(255,255,255,0.80);
        text-shadow: 0 1px 3px rgba(0,0,0,0.65);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.03em;
        margin-top: 3px;
        line-height: 1;
        pointer-events: none;
      }

      /* ===== NEON LAYOUT ===== */

      @keyframes neon-ring-pulse {
        0%, 100% {
          box-shadow: 0 0 10px var(--neon-color, #00ff88), 0 0 22px var(--neon-glow, #00ff8866);
        }
        50% {
          box-shadow: 0 0 18px var(--neon-color, #00ff88), 0 0 44px var(--neon-glow, #00ff8866), 0 0 70px var(--neon-glow, #00ff8833);
        }
      }

      @keyframes neon-status-blink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }

      .neon-scanlines {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
        background: repeating-linear-gradient(
          0deg,
          rgba(0,0,0,0) 0px,
          rgba(0,0,0,0) 2px,
          rgba(255,255,255,0.018) 2px,
          rgba(255,255,255,0.018) 4px
        );
        z-index: 3;
      }

      .neon-corner {
        position: absolute;
        width: 14px;
        height: 14px;
        z-index: 2;
        pointer-events: none;
      }
      .neon-corner-tl { top: 7px; left: 7px; border-top: 2px solid; border-left: 2px solid; }
      .neon-corner-tr { top: 7px; right: 7px; border-top: 2px solid; border-right: 2px solid; }
      .neon-corner-bl { bottom: 7px; left: 7px; border-bottom: 2px solid; border-left: 2px solid; }
      .neon-corner-br { bottom: 7px; right: 7px; border-bottom: 2px solid; border-right: 2px solid; }

      .neon-container {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 22px 16px 16px;
        gap: 12px;
      }

      .neon-picture-wrapper {
        position: relative;
        width: 76px;
        height: 76px;
        flex-shrink: 0;
      }

      .neon-ring-outer {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        border: 2px solid;
        animation: neon-ring-pulse 2.8s ease-in-out infinite;
      }

      .neon-photo {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }

      .neon-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 100%;
      }

      .neon-name {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 3px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Courier New', monospace;
      }

      .neon-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
        animation: neon-status-blink 2.2s ease-in-out infinite;
      }

      .neon-location {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-family: 'Courier New', monospace;
      }

      .neon-time {
        font-size: 10px;
        color: rgba(255,255,255,0.3);
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      }
      .neon-temp {
        font-size: 11px;
        font-weight: 700;
        color: rgba(255,255,255,0.70);
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
        margin-top: 3px;
        text-shadow: 0 0 6px rgba(255,255,255,0.25);
      }

      .neon-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding-top: 10px;
        border-top: 1px solid rgba(255,255,255,0.07);
      }

      .neon-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 9px;
        border-radius: 20px;
        border: 1px solid;
        background: rgba(0,0,0,0.5);
        font-size: 11px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .neon-badge:hover {
        transform: scale(1.08);
      }

      /* ── GLASSMORPHISM LAYOUT ── */
      .glass-container {
        position: relative;
        z-index: 1;
        padding: 18px 16px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .glass-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .glass-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        flex-shrink: 0;
        cursor: pointer;
      }

      .glass-avatar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
      }

      .glass-name-block {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
        cursor: pointer;
      }

      .glass-name {
        font-size: 17px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .glass-zone-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .glass-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
        animation: glass-dot-pulse 2.2s ease-in-out infinite;
      }

      @keyframes glass-dot-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.45; transform: scale(0.7); }
      }

      .glass-zone-text {
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .glass-time {
        font-size: 10px;
        color: rgba(255,255,255,0.28);
        letter-spacing: 0.3px;
      }

      .glass-weather-inline {
        font-size: 11px;
        color: rgba(255,255,255,0.45);
        margin-top: 1px;
      }

      .glass-battery-pill {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        flex-shrink: 0;
      }

      .glass-bat-svg-wrap {
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      @keyframes bat-charge-pulse {
        0%, 100% { filter: drop-shadow(0 0 2px #4ade8066); }
        50% { filter: drop-shadow(0 0 7px #4ade80cc) drop-shadow(0 0 14px #4ade8055); }
      }

      .glass-bat-charging svg {
        animation: bat-charge-pulse 1.6s ease-in-out infinite;
      }

      .glass-conn-pill {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }

      .glass-weather-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 14px 8px;
        font-size: 11px;
        color: rgba(255,255,255,0.38);
        border-top: 1px solid rgba(255,255,255,0.06);
        margin-top: 4px;
      }

      .glass-weather-bar-left {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
      }

      .glass-weather-bar-right {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .glass-divider {
        height: 1px;
        border-radius: 1px;
      }

      .glass-chips {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
      }

      .glass-chip {
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 100px;
        padding: 5px 11px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255,255,255,0.70);
        cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease;
        white-space: nowrap;
      }

      .glass-chip:hover {
        background: rgba(255,255,255,0.12);
        transform: scale(1.05);
      }

      /* ── Bio layout ── */
      @keyframes bio-float {
        0%,100% { transform: translateY(0) scale(1); opacity: 0.5; }
        50%      { transform: translateY(-15px) scale(1.1); opacity: 0.7; }
      }
      @keyframes bio-rise {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        20%  { opacity: 0.8; }
        80%  { opacity: 0.6; }
        100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
      }
      @keyframes bio-pulse {
        0%   { transform: scale(0.9); opacity: 0.8; }
        100% { transform: scale(1.3); opacity: 0; }
      }
      @keyframes bio-chip-glow {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes bio-bat-pulse {
        0%,100% { filter: drop-shadow(0 0 2px #4ade8066); }
        50%     { filter: drop-shadow(0 0 7px #4ade80cc) drop-shadow(0 0 14px #4ade8055); }
      }
      .bio-orb {
        position: absolute; border-radius: 50%;
        filter: blur(30px);
        animation: bio-float 8s ease-in-out infinite;
      }
      .bio-particle {
        position: absolute; width: 2px; height: 2px; border-radius: 50%;
        animation: bio-rise 6s ease-in-out infinite;
        opacity: 0;
      }
      .bio-pulse-ring {
        position: absolute; inset: -6px; border-radius: 50%;
        border: 1px solid;
        animation: bio-pulse 2.5s ease-out infinite;
        pointer-events: none;
      }
      .bio-pulse-ring-2 {
        position: absolute; inset: -12px; border-radius: 50%;
        border: 1px solid;
        animation: bio-pulse 2.5s ease-out infinite 0.5s;
        pointer-events: none;
      }
      .bio-avatar {
        width: 56px; height: 56px; border-radius: 50%; overflow: hidden;
        border: 2px solid; display: block;
      }
      .bio-avatar-icon {
        display: flex; align-items: center; justify-content: center;
        font-size: 24px;
      }
      .bio-name {
        font-size: 18px; font-weight: 300; letter-spacing: 3px;
        color: rgba(255,255,255,0.9);
      }
      .bio-zone {
        font-size: 11px; margin-top: 3px; letter-spacing: 1px;
      }
      .bio-chip {
        display: flex; align-items: center; gap: 5px;
        padding: 5px 11px; border-radius: 100px;
        background: rgba(0,255,180,0.04);
        border: 1px solid;
        font-size: 12px; font-weight: 500;
        color: rgba(0,255,180,0.7);
        white-space: nowrap; position: relative; overflow: hidden;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.15s ease;
      }
      .bio-chip::after {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at center, rgba(0,255,180,0.08) 0%, transparent 70%);
        animation: bio-chip-glow 3s ease-in-out infinite alternate;
      }
      .bio-chip:hover {
        transform: scale(1.05);
        background: rgba(0,255,180,0.08);
      }
      .bio-bat-charging svg {
        animation: bio-bat-pulse 1.6s ease-in-out infinite;
      }

      /* ── Holographic 3D Theme ─────────────────────────── */
      @keyframes holo-float {
        0%,100% { transform: rotateX(8deg)  rotateY(-6deg) translateZ(0px); }
        25%      { transform: rotateX(4deg)  rotateY(-10deg) translateZ(8px); }
        50%      { transform: rotateX(10deg) rotateY(-3deg)  translateZ(4px); }
        75%      { transform: rotateX(5deg)  rotateY(-8deg)  translateZ(10px); }
      }
      @keyframes holo-shimmer-spin { to { transform: rotate(360deg); } }
      @keyframes holo-scan-move { 0%{top:-60px} 100%{top:110%} }
      @keyframes holo-ring-spin  { to { transform: rotate(360deg); } }
      @keyframes holo-ring-spin-rev { to { transform: rotate(-360deg); } }
      @keyframes holo-orbit-go  {
        0%  { transform: rotate(0deg)   translateX(42px); }
        100%{ transform: rotate(360deg) translateX(42px); }
      }
      @keyframes holo-orbit-go2 {
        0%  { transform: rotate(120deg) translateX(42px); }
        100%{ transform: rotate(480deg) translateX(42px); }
      }
      @keyframes holo-live-pulse { 0%,100%{opacity:1} 50%{opacity:0.15} }
      @keyframes holo-top-shine  { 0%,100%{opacity:0.4} 50%{opacity:1} }

      .holo-scene {
        width: 100%;
        transform-style: preserve-3d;
        animation: holo-float 6s ease-in-out infinite;
        position: relative;
        transition: transform 0.3s ease;
      }
      .holo-scene:hover {
        animation: none;
        transform: rotateX(0deg) rotateY(0deg) translateZ(0px);
      }
      .holo-body {
        border-radius: inherit;
        background: linear-gradient(155deg, rgba(12,12,30,0.97) 0%, rgba(8,8,20,0.99) 100%);
        border: 1px solid rgba(255,255,255,0.07);
        overflow: hidden;
        position: relative;
      }
      .holo-shimmer {
        position: absolute; inset: -50%;
        background: conic-gradient(
          from 0deg at 60% 40%,
          rgba(127,80,255,0.07) 0deg,
          rgba(0,212,255,0.09) 60deg,
          rgba(125,218,159,0.07) 120deg,
          rgba(255,100,150,0.05) 180deg,
          rgba(255,200,50,0.06) 240deg,
          rgba(0,150,255,0.08) 300deg,
          rgba(127,80,255,0.07) 360deg
        );
        animation: holo-shimmer-spin 8s linear infinite;
        pointer-events: none; z-index: 0;
      }
      .holo-topline {
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        animation: holo-top-shine 4s ease-in-out infinite;
        pointer-events: none; z-index: 2;
      }
      .holo-scan {
        position: absolute; inset: 0;
        pointer-events: none; overflow: hidden; z-index: 1;
      }
      .holo-scan-bar {
        position: absolute; left: 0; right: 0; height: 60px;
        background: linear-gradient(180deg, transparent, rgba(0,212,255,0.022), transparent);
        animation: holo-scan-move 5s linear infinite;
      }
      .holo-grid-deco {
        position: absolute; left: 0; top: 0; bottom: 0; width: 110px;
        pointer-events: none; z-index: 0;
      }
      .holo-grid { position: absolute; inset: 0; }
      .holo-corner {
        position: absolute; width: 14px; height: 14px;
        border-style: solid; border-width: 0;
      }
      .holo-tl { top: 10px; left: 10px; border-top-width: 1.5px; border-left-width: 1.5px; }
      .holo-br { bottom: 10px; right: 0;  border-bottom-width: 1.5px; border-right-width: 1.5px; }
      .holo-sep {
        position: absolute; left: 110px; top: 12px; bottom: 12px; width: 1px;
        pointer-events: none; z-index: 1;
      }
      .holo-main {
        position: relative; z-index: 2;
        display: flex; flex-direction: row;
        padding: 14px 14px 14px 0;
        gap: 0; align-items: center;
      }
      .holo-left {
        width: 110px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
      }
      .holo-avatar-wrap {
        position: relative; width: 68px; height: 68px;
      }
      .holo-ring-outer {
        position: absolute; inset: -12px; border-radius: 50%;
        border: 1.5px solid transparent;
        animation: holo-ring-spin 4s linear infinite;
      }
      .holo-ring-mid {
        position: absolute; inset: -6px; border-radius: 50%;
        border: 1px solid rgba(0,212,255,0.18);
        animation: holo-ring-spin-rev 6s linear infinite;
      }
      .holo-avatar-pic {
        position: absolute; inset: 0; border-radius: 50%;
        background: linear-gradient(135deg,#1a1a35,#0d0d20);
        border: 2px solid rgba(0,212,255,0.3);
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
      }
      .holo-orbit-dot {
        position: absolute;
        width: 6px; height: 6px; border-radius: 50%;
        top: 50%; left: 50%;
        margin-left: -3px; margin-top: -3px;
        transform-origin: 0 0;
      }
      .holo-right {
        flex: 1; padding-left: 12px;
        display: flex; flex-direction: column; justify-content: space-between;
        gap: 8px;
      }
      .holo-live-chip {
        display: inline-flex; align-items: center; gap: 4px;
        border: 1px solid; border-radius: 20px; padding: 2px 8px;
        font-size: 8px; letter-spacing: 0.12em;
        margin-bottom: 4px;
      }
      .holo-live-dot {
        width: 4px; height: 4px; border-radius: 50%;
        animation: holo-live-pulse 1.2s ease-in-out infinite;
      }
      .holo-name {
        font-size: 16px; font-weight: 800; color: #fff;
        letter-spacing: 0.04em; line-height: 1.1;
      }
      .holo-loc {
        font-size: 11px; font-weight: 500; margin-top: 3px;
      }
      .holo-sub {
        font-size: 9px; color: rgba(255,255,255,0.28); margin-top: 2px;
        display: flex; gap: 5px; flex-wrap: wrap; align-items: center;
      }
      .holo-metrics {
        display: flex; gap: 5px; flex-wrap: wrap; align-items: flex-start;
      }
      .holo-metric {
        border-radius: 8px; padding: 0; height: 42px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        position: relative; overflow: hidden;
        min-width: 44px; flex-shrink: 0;
      }
      .holo-metric-line {
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
      }
      .holo-mv { font-size: 12px; font-weight: 700; color: #fff; line-height: 1; }
      .holo-mu { font-size: 8px; color: rgba(255,255,255,0.32); line-height: 1; }

      /* ── Weather Station Theme ───────────────────────────── */
      @keyframes wx-dot-pulse {
        0%,100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(1.4); opacity: 0.7; }
      }
      .wx-top {
        position: relative;
        padding: 14px 16px 10px;
        overflow: hidden;
      }
      .wx-top::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 44px;
        background: linear-gradient(to bottom, transparent, #0d2040);
        pointer-events: none;
        z-index: 1;
      }
      .wx-person-row {
        display: flex;
        align-items: center;
        gap: 14px;
        position: relative;
        z-index: 2;
      }
      .wx-avatar {
        width: 56px; height: 56px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        border: 2px solid rgba(100,150,255,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 28px;
        flex-shrink: 0;
        overflow: hidden;
      }
      .wx-name { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.2; }
      .wx-location { font-size: 12px; color: rgba(150,200,255,0.7); margin-top: 3px; }
      .wx-condition { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; cursor: pointer; }
      .wx-temp-display { margin-left: auto; text-align: right; flex-shrink: 0; z-index: 2; }
      .wx-temp-big { font-size: 42px; font-weight: 200; color: #fff; line-height: 1; }
      .wx-temp-unit { font-size: 18px; vertical-align: super; color: inherit; opacity: 0.55; }
      .wx-feels { font-size: 10px; color: rgba(255,255,255,0.28); margin-top: 2px; }
      .wx-gauges {
        padding: 8px 16px 10px;
        display: grid;
        gap: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.04);
      }
      .wx-gauge {
        text-align: center;
        padding: 6px 4px;
        border-radius: 8px;
        transition: background 0.2s;
      }
      .wx-gauge:hover { background: rgba(255,255,255,0.04); }
      .wx-gauge-icon { font-size: 18px; margin-bottom: 3px; display: flex; align-items: center; justify-content: center; }
      .wx-gauge-val { font-size: 12px; font-weight: 700; }
      .wx-gauge-label { font-size: 8px; color: rgba(255,255,255,0.25); margin-top: 1px; letter-spacing: 1px; text-transform: uppercase; }
      .wx-chips {
        padding: 6px 12px 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .wx-chip {
        display: flex; align-items: center; gap: 5px;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 11px; font-weight: 600;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.7);
        position: relative;
        overflow: hidden;
      }
      .wx-footer {
        padding: 9px 16px;
        display: flex; align-items: center; gap: 8px;
        background: rgba(0,0,0,0.15);
      }
      .wx-status-dot {
        width: 7px; height: 7px; border-radius: 50%;
        flex-shrink: 0;
        animation: wx-dot-pulse 2.5s ease-in-out infinite;
      }
      .wx-footer-text { font-size: 11px; color: rgba(255,255,255,0.4); flex: 1; }
      .wx-updated { font-size: 10px; color: rgba(255,255,255,0.2); }

      /* ── Matrix Rain layout ── */
      @keyframes matrix-fall { 0%{transform:translateY(-150%)} 100%{transform:translateY(220%)} }
      @keyframes matrix-scan { 0%{top:-35%;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:120%;opacity:0} }
      @keyframes matrix-blink { 50%{opacity:0} }
      .matrix-content {
        position: relative; z-index: 2;
        padding: 16px 16px 12px;
        display: flex; flex-direction: column; gap: 10px;
      }
      .matrix-person-row { display: flex; align-items: center; gap: 13px; }
      .matrix-avatar-box {
        width: 52px; height: 52px; border-radius: 4px;
        background: #000; border: 1px solid #00ff41;
        display: flex; align-items: center; justify-content: center; font-size: 26px;
        box-shadow: 0 0 14px rgba(0,255,65,.45), inset 0 0 10px rgba(0,255,65,.08);
        position: relative; overflow: hidden; flex-shrink: 0;
      }
      .matrix-avatar-scanlines {
        position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(transparent 0px,transparent 2px,rgba(0,255,65,.04) 2px,rgba(0,255,65,.04) 4px);
      }
      .matrix-avatar-scan {
        position: absolute; top: -35%; left: 0; right: 0; height: 35%;
        background: rgba(0,255,65,.18);
        animation: matrix-scan 3s linear infinite;
      }
      .matrix-name {
        color: #00ff41; font-size: 15px; font-weight: 700;
        text-shadow: 0 0 10px #00ff41; letter-spacing: 2px;
      }
      .matrix-state { color: rgba(0,255,65,.5); font-size: 10px; margin-top: 2px; letter-spacing: 1px; }
      .matrix-last-changed { color: rgba(0,255,65,.3); font-size: 9px; margin-top: 1px; letter-spacing: 1px; }
      .matrix-divider { border: none; border-top: 1px solid rgba(0,255,65,.18); margin: 2px 0; }
      .matrix-stats { display: flex; gap: 14px; flex-wrap: wrap; }
      .matrix-stat-block { display: flex; flex-direction: column; gap: 3px; min-width: 52px; }
      .matrix-stat-label { color: rgba(0,255,65,.38); font-size: 8px; letter-spacing: 2px; }
      .matrix-stat-val { color: #00ff41; font-size: 13px; font-weight: 700; text-shadow: 0 0 8px #00ff41; letter-spacing: 1px; }
      .matrix-stat-bar { height: 2px; background: rgba(0,255,65,.1); border-radius: 1px; width: 100%; margin-top: 2px; }
      .matrix-stat-bar-fill { height: 100%; background: #00ff41; border-radius: 1px; box-shadow: 0 0 6px #00ff41; }
      .matrix-chips-row { display: flex; gap: 7px; flex-wrap: wrap; }
      .matrix-chip {
        display: flex; align-items: center; gap: 5px;
        padding: 4px 9px; border-radius: 3px;
        background: rgba(0,255,65,.07); border: 1px solid rgba(0,255,65,.22);
        font-size: 10px; color: #00ff41; letter-spacing: 1px;
        text-shadow: 0 0 6px #00ff41; font-family: inherit;
        position: relative; overflow: hidden;
      }
      .matrix-footer-row {
        display: flex; justify-content: space-between; align-items: center;
        border-top: 1px solid rgba(0,255,65,.1); padding-top: 8px; margin-top: 2px;
      }
      .matrix-status-line { color: rgba(0,255,65,.28); font-size: 9px; letter-spacing: 1.5px; }

      /* ══════════════════════════════
         Orbital Layout
      ══════════════════════════════ */
      .orb-stars { position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
      .orb-star {
        position:absolute;border-radius:50%;background:#fff;
        animation:orb-twinkle var(--orb-d,3s) ease-in-out infinite var(--orb-dl,0s);
      }
      @keyframes orb-twinkle {
        0%,100%{opacity:var(--orb-a,.08);transform:scale(1)}
        50%{opacity:var(--orb-b,.45);transform:scale(1.3)}
      }
      .orb-grid {
        position:absolute;inset:0;background-size:28px 28px;
        pointer-events:none;z-index:0;opacity:0.7;
      }
      .orb-scan {
        position:absolute;left:0;right:0;height:35%;
        animation:orb-sweep 9s ease-in-out infinite;
        pointer-events:none;z-index:1;
      }
      @keyframes orb-sweep { 0%{top:-35%} 100%{top:120%} }

      .orb-content { position:relative;z-index:10;padding:12px 14px 10px; }

      /* Header */
      .orb-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:3px; }
      .orb-name {
        font-size:20px;font-weight:800;letter-spacing:2px;
        color:#fff;text-transform:uppercase;cursor:pointer;
      }
      .orb-live {
        font-size:7px;font-weight:800;letter-spacing:2px;
        border:1px solid;border-radius:6px;padding:2px 6px;
        animation:orb-live-blink 2s ease-in-out infinite;
      }
      @keyframes orb-live-blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

      .orb-zone { display:flex;align-items:center;gap:6px;margin-bottom:2px;cursor:pointer; }
      .orb-zone-dot {
        width:7px;height:7px;border-radius:50%;flex-shrink:0;
        animation:orb-dot-pulse 2.2s ease-in-out infinite;
      }
      @keyframes orb-dot-pulse {
        0%,100%{transform:scale(1)} 50%{transform:scale(1.5)}
      }
      .orb-zone-name { font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.38);text-transform:uppercase; }

      /* Sphere */
      .orb-sphere {
        position:relative;height:192px;
        display:flex;align-items:center;justify-content:center;
        perspective:600px;
        margin:4px 0 2px;
      }

      /* Orbital rings */
      .orb-ring {
        position:absolute;border-radius:50%;border:1px solid;pointer-events:none;
      }
      .orb-ring-1 {
        width:182px;height:182px;
        animation:orb-ring1 14s linear infinite;
      }
      .orb-ring-2 {
        width:155px;height:155px;
        animation:orb-ring2 10s linear infinite reverse;
      }
      .orb-ring-3 {
        width:213px;height:213px;
        animation:orb-ring3 19s linear infinite;
      }
      @keyframes orb-ring1 {
        from{transform:rotateX(72deg) rotateZ(0deg)} to{transform:rotateX(72deg) rotateZ(360deg)}
      }
      @keyframes orb-ring2 {
        from{transform:rotateX(68deg) rotateZ(60deg)} to{transform:rotateX(68deg) rotateZ(-300deg)}
      }
      @keyframes orb-ring3 {
        from{transform:rotateX(64deg) rotateZ(120deg)} to{transform:rotateX(64deg) rotateZ(480deg)}
      }

      /* Halo glow */
      .orb-halo {
        position:absolute;width:152px;height:152px;border-radius:50%;
        animation:orb-halo-pulse 3s ease-in-out infinite;pointer-events:none;
      }
      @keyframes orb-halo-pulse {
        0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.12);opacity:1}
      }

      /* Pulse rings */
      .orb-pulse {
        position:absolute;width:128px;height:128px;border-radius:50%;
        border:1.5px solid;pointer-events:none;
        animation:orb-pulse-expand 3s ease-out infinite;
      }
      @keyframes orb-pulse-expand {
        0%{transform:scale(1);opacity:0.55} 100%{transform:scale(2.3);opacity:0}
      }

      /* 3D Coin */
      .orb-coin {
        position:relative;z-index:10;width:128px;height:128px;
        transform-style:preserve-3d;
        animation:orb-coin-spin 10s linear infinite;
      }
      @keyframes orb-coin-spin {
        from{transform:perspective(600px) rotateY(0deg)}
        to{transform:perspective(600px) rotateY(360deg)}
      }
      .orb-face {
        position:absolute;inset:0;border-radius:50%;
        backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;
      }
      .orb-front {
        border:2px solid;
        display:flex;align-items:center;justify-content:center;
        background:linear-gradient(135deg,rgba(10,10,30,1),rgba(20,20,50,1));
      }
      .orb-back {
        transform:rotateY(180deg);
        background:rgba(4,4,18,0.97);
        border:2px solid rgba(0,212,255,0.45);
        box-shadow:0 0 20px rgba(0,212,255,0.15);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
      }
      .orb-back-bat {
        display:flex;align-items:center;gap:5px;
        font-size:11px;font-weight:700;font-family:'Courier New',monospace;
        cursor:pointer;
      }
      .orb-back-lbl { font-size:7px;letter-spacing:2px;text-transform:uppercase;opacity:0.35;color:#fff; }

      /* Satellites */
      .orb-sat {
        position:absolute;top:50%;left:50%;
        display:flex;align-items:center;gap:4px;
        background:rgba(0,0,0,0.82);border:1px solid;border-radius:20px;
        padding:4px 8px;font-size:10px;font-weight:700;
        white-space:nowrap;backdrop-filter:blur(4px);cursor:pointer;
        overflow:hidden;
      }
      .orb-sat-1 { animation:orb-sat-a 14s linear infinite; }
      .orb-sat-2 { animation:orb-sat-b 10s linear infinite reverse; }
      .orb-sat-3 { animation:orb-sat-c 19s linear infinite; }
      .orb-sat-4 { animation:orb-sat-d 16s linear infinite; }
      .orb-sat-5 { animation:orb-sat-e 13s linear infinite reverse; }
      .orb-sat-6 { animation:orb-sat-f 17s linear infinite; }
      @keyframes orb-sat-a {
        0%{transform:translate(-50%,-50%) rotate(0deg) translateX(90px) rotate(0deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(360deg) translateX(90px) rotate(-360deg);opacity:1}
      }
      @keyframes orb-sat-b {
        0%{transform:translate(-50%,-50%) rotate(120deg) translateX(78px) rotate(-120deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(-240deg) translateX(78px) rotate(240deg);opacity:1}
      }
      @keyframes orb-sat-c {
        0%{transform:translate(-50%,-50%) rotate(240deg) translateX(100px) rotate(-240deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(600deg) translateX(100px) rotate(-600deg);opacity:1}
      }
      @keyframes orb-sat-d {
        0%{transform:translate(-50%,-50%) rotate(60deg) translateX(84px) rotate(-60deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(420deg) translateX(84px) rotate(-420deg);opacity:1}
      }
      @keyframes orb-sat-e {
        0%{transform:translate(-50%,-50%) rotate(180deg) translateX(96px) rotate(-180deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(-180deg) translateX(96px) rotate(180deg);opacity:1}
      }
      @keyframes orb-sat-f {
        0%{transform:translate(-50%,-50%) rotate(300deg) translateX(76px) rotate(-300deg);opacity:1}
        42%{opacity:1} 50%{opacity:0} 58%{opacity:0}
        100%{transform:translate(-50%,-50%) rotate(660deg) translateX(76px) rotate(-660deg);opacity:1}
      }

      /* Last changed */
      .orb-last-changed {
        font-size:9px;text-align:center;letter-spacing:0.5px;
        margin-bottom:4px;
      }

      /* Geocoded strip */
      .orb-geo {
        border:1px solid;border-radius:10px;
        padding:5px 10px;margin-bottom:6px;
        overflow:hidden;text-align:center;cursor:pointer;
      }

      /* Weather footer */
      .orb-weather {
        text-align:center;font-size:11px;
        color:rgba(255,255,255,0.38);
        padding-top:8px;
        border-top:1px solid rgba(255,255,255,0.04);
        cursor:pointer;
      }

      /* Weather contrast when bg active */
      .weather-active .orb-name,
      .weather-active .orb-zone-name {
        text-shadow:0 1px 6px rgba(0,0,0,0.9),0 0 14px rgba(0,0,0,0.8);
        color:#fff !important;
      }
      .weather-active .orb-sat {
        background:rgba(0,0,0,0.85) !important;
      }

      /* ── LIQUID INK LAYOUT ── */
      .ink-main {
        position:relative;z-index:1;
        padding:14px 16px 12px;
        display:flex;flex-direction:column;gap:10px;
        transform:translateZ(0);
      }
      .ink-top {
        display:flex;align-items:center;gap:12px;
      }
      .ink-photo-wrap { flex-shrink:0;cursor:pointer; }
      .ink-photo {
        width:72px;height:72px;border-radius:50%;overflow:hidden;
        display:flex;align-items:center;justify-content:center;
        background:#fff;border:2.5px solid var(--ink-accent,#2563eb);
        box-shadow:0 0 0 4px rgba(var(--ink-accent-rgb,37,99,235),0.12),
                   0 6px 20px rgba(0,0,0,0.14);
        transition:none;
      }
      .ink-info {
        flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;
      }
      .ink-name {
        font-size:18px;font-weight:700;letter-spacing:0.3px;
        line-height:1.15;cursor:pointer;white-space:nowrap;
        overflow:hidden;text-overflow:ellipsis;
        text-shadow:0 1px 3px rgba(0,0,0,0.06);
      }
      .ink-meta {
        display:flex;align-items:center;gap:5px;font-size:12px;flex-wrap:wrap;
      }
      .ink-meta-sep { color:#9ca3af; }
      .ink-zone { white-space:nowrap;font-weight:500; }
      .ink-time { white-space:nowrap; }
      .ink-geo {
        font-size:10px;color:#6b7280;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
      }
      .ink-bat-panel {
        flex-shrink:0;display:flex;flex-direction:column;
        align-items:center;gap:2px;cursor:pointer;min-width:44px;
        background:#f8fafc;border-radius:14px;padding:8px 10px;
        box-shadow:0 2px 8px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.05);
      }
      .ink-bat-pct {
        font-size:13px;font-weight:700;line-height:1.1;
      }
      .ink-bat-conn {
        font-size:10px;color:#6b7280;display:flex;align-items:center;
      }
      .ink-sep {
        height:2px;border-radius:1px;margin:0 2px;
        background:linear-gradient(90deg,transparent,var(--ink-accent,#2563eb) 30%,var(--ink-accent,#2563eb) 70%,transparent);
        transition:none;
      }
      .ink-chips {
        display:flex;flex-wrap:wrap;gap:7px;
      }
      .ink-chip {
        display:inline-flex;align-items:center;gap:4px;
        padding:5px 11px;border-radius:20px;
        font-size:11px;font-weight:600;color:#1f2937;
        background:#f1f3f5;
        box-shadow:0 2px 6px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.07);
        cursor:pointer;white-space:nowrap;
        transition:box-shadow 0.15s;
      }
      .ink-chip:hover {
        background:#e9ecef;
        box-shadow:0 4px 14px rgba(0,0,0,0.12),0 0 0 1px rgba(0,0,0,0.09);
      }
      .ink-weather-row {
        display:flex;align-items:center;justify-content:space-between;
        padding-top:2px;
      }
      .ink-weather {
        font-size:11px;font-weight:400;
        display:inline-flex;align-items:center;gap:2px;
        cursor:pointer;
      }
      /* weather-active contrast: light bg → vivid weather bg */
      .weather-active .ink-name { color:#fff !important;text-shadow:0 1px 6px rgba(0,0,0,0.5); }
      .weather-active .ink-meta { color:#fff !important; }
      .weather-active .ink-zone,
      .weather-active .ink-time,
      .weather-active .ink-meta-sep { color:rgba(255,255,255,0.8) !important; }
      .weather-active .ink-chip {
        background:rgba(0,0,0,0.45) !important;
        color:#fff !important;
        box-shadow:none !important;
      }
      .weather-active .ink-bat-panel {
        background:rgba(0,0,0,0.35) !important;
        box-shadow:none !important;
      }
      .weather-active .ink-bat-pct { color:#fff !important; }
      .weather-active .ink-chips .extra-chip {
        background:rgba(0,0,0,0.45) !important;
        color:#fff !important;
        box-shadow:none !important;
      }

      /* ── EXTRA CHIPS ── */
      .extra-chip {
        display:inline-flex;align-items:center;gap:4px;
        padding:4px 10px;border-radius:20px;
        font-size:11px;font-weight:500;
        background:rgba(255,255,255,0.08);
        color:rgba(255,255,255,0.75);
        border:1px solid rgba(255,255,255,0.12);
        cursor:pointer;white-space:nowrap;
        transition:background 0.15s;
      }
      .extra-chip:hover { background:rgba(255,255,255,0.14); }
      /* light mode (ink layout) */
      .ink-chips .extra-chip {
        background:#f1f3f5;color:#1f2937;
        border:none;
        box-shadow:0 2px 6px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.07);
      }
      .ink-chips .extra-chip:hover { background:#e9ecef; }
      .extra-chips-row {
        display:flex;flex-wrap:wrap;gap:6px;
        padding:8px 12px 10px;
        border-top:1px solid rgba(255,255,255,0.07);
        position:relative;z-index:1;
      }
    `;
  }
}

// Card registration
if (!customElements.get('person-tracker-card')) {
  customElements.define('person-tracker-card', PersonTrackerCard);
  console.info(
    '%c PERSON-TRACKER-CARD %c v1.4.12 %c!',
    'background-color: #7DDA9F; color: black; font-weight: bold;',
    'background-color: #93ADCB; color: white; font-weight: bold;',
    'background-color: #A0D4A0; color: black; font-weight: bold;'
  );
}

// Add info for Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'person-tracker-card',
  name: 'Person Tracker Card',
  description: 'Advanced person tracking card with full visual editor',
  preview: true
});

// Cache-busting: automatically update the Lovelace resource URLs with the current
// version query param (?v=X.X.X). When HACS updates the files the browser would
// otherwise serve the cached old versions because the URLs haven't changed.
// This ensures all users get the new version without manually clearing the cache.
// Both person-tracker-card.js and person-tracker-card-editor.js are updated.
(async () => {
  const CARD_FILES = ['person-tracker-card.js', 'person-tracker-card-editor.js'];

  try {
    // Wait until home-assistant element is available
    await customElements.whenDefined('home-assistant');
    const ha = document.querySelector('home-assistant');
    if (!ha) return;

    // Wait for hass object (may take a moment on startup)
    let attempts = 0;
    while (!(ha.__hass || ha._hass) && attempts < 20) {
      await new Promise(r => setTimeout(r, 500));
      attempts++;
    }
    const hass = ha.__hass || ha._hass;
    if (!hass) return;

    // Only admins can update Lovelace resources
    if (!hass.user?.is_admin) return;

    const resources = await hass.callWS({ type: 'lovelace/resources' });
    if (!Array.isArray(resources)) return;

    let needsReload = false;

    for (const cardFile of CARD_FILES) {
      const res = resources.find(r => r.url && r.url.includes(cardFile));
      if (!res) continue;

      const baseUrl = res.url.split('?')[0];
      const expectedUrl = `${baseUrl}?v=${CARD_VERSION}`;

      if (res.url !== expectedUrl) {
        await hass.callWS({
          type: 'lovelace/resources/update',
          resource_id: res.id,
          res_type: res.type,
          url: expectedUrl,
        });
        console.info(`[Person Tracker Card] Resource URL updated: ${cardFile} → v${CARD_VERSION}`);
        needsReload = true;
      }
    }

    if (needsReload) {
      console.info('[Person Tracker Card] Reloading page to clear cache...');
      window.location.reload();
    }
  } catch (e) {
    // Silent fail — non-critical, user can still clear cache manually
  }
})();
