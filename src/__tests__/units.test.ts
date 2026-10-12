import { describe, expect, it } from 'vitest';
import {
  formatDistanceKm,
  formatDepthKm,
  formatElevationM,
  formatTemperatureC,
  formatWindSpeedKmh,
  formatPrecipitationMm,
} from '../utils/units';

describe('unit formatters', () => {
  it('formats distances and depths in metric and imperial units', () => {
    expect(formatDistanceKm(10, 'metric')).toBe('10.0 km');
    expect(formatDistanceKm(10, 'imperial')).toBe('6.2 mi');
    expect(formatDepthKm(10, 'imperial')).toBe('6.2 mi');
  });

  it('formats elevation correctly', () => {
    expect(formatElevationM(1000, 'metric')).toBe('1000 m');
    expect(formatElevationM(1000, 'imperial')).toBe('3281 ft');
  });

  it('formats temperature correctly', () => {
    expect(formatTemperatureC(0, 'metric')).toBe('0.0°C');
    expect(formatTemperatureC(0, 'imperial')).toBe('32.0°F');
  });

  it('formats wind speed correctly', () => {
    expect(formatWindSpeedKmh(10, 'metric')).toBe('10.0 km/h');
    expect(formatWindSpeedKmh(10, 'imperial')).toBe('6.2 mph');
  });

  it('formats precipitation correctly', () => {
    expect(formatPrecipitationMm(25.4, 'metric')).toBe('25.4 mm');
    expect(formatPrecipitationMm(25.4, 'imperial')).toBe('1.00 in');
  });

  it('handles invalid numeric values', () => {
    expect(formatDistanceKm(Number.NaN, 'metric')).toBe('N/A');
    expect(formatElevationM(Number.POSITIVE_INFINITY, 'metric')).toBe('N/A');
  });
});
