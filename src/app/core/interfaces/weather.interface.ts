import { SavedLocationPoint } from './location.interface';

export interface SunPosition {
  sunrise: Date;
  sunriseEnd: Date;
  goldenHourEnd: Date;
  solarNoon: Date;
  goldenHour: Date;
  sunsetStart: Date;
  sunset: Date;
  dusk: Date;
  nauticalDusk: Date;
  night: Date;
  nadir: Date;
  nightEnd: Date;
  nauticalDawn: Date;
  dawn: Date;
}

export interface Weather {
  icon: string;
  description: string;
  minTemperature?: number;
  maxTemperature?: number;
  windSpeed: number;
  precipitation: number;
  humidity?: number;
}

export interface DayWeather extends Weather {
  isNow: boolean;
  currentDay: string;
  fullDate: string;
}

export interface HourWeather extends Weather {
  isNow: boolean;
  hour: string;
  currentTemperature: number;
}

export interface CurrentWeather extends Weather {
  place: SavedLocationPoint;
  currentTemperature: number;
}
