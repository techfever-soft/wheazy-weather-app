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

export interface AirQuality {
  uvIndex: number;
  globalQuality?: string;
  dusts: {
    sand: {
      status: string;
      value: number;
    };
  };
  particles: {
    pm2_5: {
      status: string;
      value: number;
    };
    pm10: {
      status: string;
      value: number;
    }
  };
  // TODO: reform others
  gases: {
    carbonMonoxide: {
      status: string;
      value: number;
    }
    nitrogenDioxide: {
      status: string;
      value: number;
    }
    sulphurDioxide: {
      status: string;
      value: number;
    }
    ozone: {
      status: string;
      value: number;
    }
  };
  pollens: {
    alder: {
      status: string;
      value: number;
    }
    birch: {
      status: string;
      value: number;
    }
    grass: {
      status: string;
      value: number;
    }
    mugwort: {
      status: string;
      value: number;
    }
    olive: {
      status: string;
      value: number;
    }
    ragweed: {
      status: string;
      value: number;
    }
  };
}
