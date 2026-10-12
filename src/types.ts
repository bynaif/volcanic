export type MainRoute = 'home' | 'map' | 'alerts' | 'news' | 'more';

export type MoreSubRoute =
  | 'search'
  | 'reports'
  | 'safety'
  | 'shelters'
  | 'donations'
  | 'settings'
  | 'help';

export type AppRoute = MainRoute | `more/${MoreSubRoute}`;

export interface EarthquakeProperties {
  mag: number | null;
  place: string | null;
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string | null;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: 'Point';
  coordinates: [number, number, number]; // [longitude, latitude, depthKm]
}

export interface EarthquakeFeature {
  type: 'Feature';
  id: string;
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
}

export interface EarthquakeFeedMetadata {
  generated: number;
  url: string;
  title: string;
  status: number;
  api: string;
  count: number;
}

export interface EarthquakeFeed {
  type: 'FeatureCollection';
  metadata: EarthquakeFeedMetadata;
  features: EarthquakeFeature[];
}

export interface AppSettings {
  notificationsEnabled: boolean;
  unitSystem: 'metric' | 'imperial';
  alertThreshold: 'all' | 'advisory' | 'warning' | 'aviation-red';
  refreshInterval: 'manual' | '1m' | '5m' | '15m';
  neonAccents: boolean;
}


