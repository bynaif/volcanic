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

export interface AppSettings {
  notificationsEnabled: boolean;
  unitSystem: 'metric' | 'imperial';
  alertThreshold: 'all' | 'advisory' | 'warning' | 'aviation-red';
  refreshInterval: 'manual' | '1m' | '5m' | '15m';
  neonAccents: boolean;
}
