export type UnitSystem = 'metric' | 'imperial';

export function getUnitSystem(): UnitSystem {
  try {
    const saved = localStorage.getItem('volcanic_settings');
    if (saved) {
      const settings: unknown = JSON.parse(saved);
      if (
        typeof settings === 'object' &&
        settings !== null &&
        'unitSystem' in settings &&
        (settings.unitSystem === 'metric' ||
          settings.unitSystem === 'imperial')
      ) {
        return settings.unitSystem;
      }
    }
  } catch {
    // Fall back to metric when storage is unavailable or invalid.
  }

  return 'metric';
}

export function formatDistanceKm(
  km: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(km)) return 'N/A';

  return system === 'imperial'
    ? `${(km * 0.621371).toFixed(1)} mi`
    : `${km.toFixed(1)} km`;
}

export function formatDepthKm(
  km: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(km)) return 'N/A';

  return system === 'imperial'
    ? `${(km * 0.621371).toFixed(1)} mi`
    : `${km.toFixed(1)} km`;
}

export function formatElevationM(
  meters: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(meters)) return 'N/A';

  return system === 'imperial'
    ? `${(meters * 3.28084).toFixed(0)} ft`
    : `${meters.toFixed(0)} m`;
}

export function formatTemperatureC(
  celsius: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(celsius)) return 'N/A';

  return system === 'imperial'
    ? `${((celsius * 9) / 5 + 32).toFixed(1)}°F`
    : `${celsius.toFixed(1)}°C`;
}

export function formatWindSpeedKmh(
  kmh: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(kmh)) return 'N/A';

  return system === 'imperial'
    ? `${(kmh * 0.621371).toFixed(1)} mph`
    : `${kmh.toFixed(1)} km/h`;
}

export function formatPrecipitationMm(
  mm: number,
  system: UnitSystem = getUnitSystem(),
): string {
  if (!Number.isFinite(mm)) return 'N/A';

  return system === 'imperial'
    ? `${(mm / 25.4).toFixed(2)} in`
    : `${mm.toFixed(1)} mm`;
}
