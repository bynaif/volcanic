import { useState, useEffect, useCallback, useRef } from 'react';

export interface WeatherData {
  timezone: string;
  timezoneAbbreviation: string;
  utcOffsetSeconds: number;
  localTimeFormatted: string;
  elevation: number;
  current: {
    time: string;
    temperature: number;
    relativeHumidity: number;
    apparentTemperature: number;
    weatherCode: number;
    windSpeed: number;
    precipitation: number;
  };
  daily: Array<{
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
  }>;
}

export function useVolcanoWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Open-Meteo returned status ${res.status} (${res.statusText})`);
      }

      const json = await res.json();
      if (!json || !json.current || !json.daily) {
        throw new Error('Invalid weather forecast payload received.');
      }

      // Calculate local time for the volcano's timezone
      let localTimeFormatted = 'N/A';
      try {
        if (json.timezone) {
          localTimeFormatted = new Intl.DateTimeFormat('en-US', {
            timeZone: json.timezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          }).format(new Date());
        }
      } catch {
        localTimeFormatted = new Date().toLocaleString();
      }

      // 5-day daily forecast slice
      const dailyItems: WeatherData['daily'] = [];
      const times = json.daily.time || [];
      const codes = json.daily.weather_code || [];
      const maxs = json.daily.temperature_2m_max || [];
      const mins = json.daily.temperature_2m_min || [];
      const precips = json.daily.precipitation_sum || [];

      for (let i = 0; i < Math.min(5, times.length); i++) {
        dailyItems.push({
          date: times[i],
          weatherCode: codes[i] ?? 0,
          tempMax: maxs[i] ?? 0,
          tempMin: mins[i] ?? 0,
          precipitationSum: precips[i] ?? 0,
        });
      }

      const parsed: WeatherData = {
        timezone: json.timezone || 'UTC',
        timezoneAbbreviation: json.timezone_abbreviation || 'UTC',
        utcOffsetSeconds: json.utc_offset_seconds || 0,
        localTimeFormatted,
        elevation: json.elevation || 0,
        current: {
          time: json.current.time,
          temperature: json.current.temperature_2m,
          relativeHumidity: json.current.relative_humidity_2m,
          apparentTemperature: json.current.apparent_temperature,
          weatherCode: json.current.weather_code,
          windSpeed: json.current.wind_speed_10m,
          precipitation: json.current.precipitation ?? 0,
        },
        daily: dailyItems,
      };

      if (isMounted.current) {
        setWeather(parsed);
        setError(null);
        setLoading(false);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to retrieve meteorological forecast from Open-Meteo.'
        );
        setLoading(false);
      }
    }
  }, [latitude, longitude]);

  useEffect(() => {
    isMounted.current = true;
    fetchWeather();

    return () => {
      isMounted.current = false;
    };
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
    lastUpdated,
  };
}

export function getWeatherDescription(code: number): {
  label: string;
  iconName: 'sun' | 'cloud' | 'rain' | 'snow' | 'thunder';
} {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', iconName: 'sun' };
    case 1:
      return { label: 'Mainly Clear', iconName: 'sun' };
    case 2:
      return { label: 'Partly Cloudy', iconName: 'cloud' };
    case 3:
      return { label: 'Overcast', iconName: 'cloud' };
    case 45:
    case 48:
      return { label: 'Fog / Depositing Rime', iconName: 'cloud' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', iconName: 'rain' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', iconName: 'rain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow Fall', iconName: 'snow' };
    case 77:
      return { label: 'Snow Grains', iconName: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', iconName: 'rain' };
    case 85:
    case 86:
      return { label: 'Snow Showers', iconName: 'snow' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', iconName: 'thunder' };
    default:
      return { label: 'Fair Conditions', iconName: 'sun' };
  }
}
