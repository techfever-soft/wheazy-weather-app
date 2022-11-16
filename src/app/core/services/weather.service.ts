import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SavedLocationPoint } from '../interfaces/location.interface';
import {
  AirQuality,
  CurrentWeather,
  DayWeather,
  HourWeather,
  SunPosition,
} from '../interfaces/weather.interface';
import { ApiService } from './api.service';
import { LocationService } from './location.service';

import * as SunCalc from 'suncalc';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private currentSeason$: BehaviorSubject<string> = new BehaviorSubject(
    'autumn'
  );
  private currentDayTime$: BehaviorSubject<string> = new BehaviorSubject(
    'dawn'
  );
  private currentDayTimeAsNumber$: BehaviorSubject<number> =
    new BehaviorSubject(0);
  private currentSeasonAsNumber$: BehaviorSubject<number> = new BehaviorSubject(
    0
  );

  private unit$: BehaviorSubject<string> = new BehaviorSubject('celcius');
  private showDebug$ = new BehaviorSubject(false);

  private currentWeather$: Subject<CurrentWeather> = new Subject();
  private currentHourlyWeather$: Subject<HourWeather[]> = new Subject();
  private currentDaysWeather$: Subject<DayWeather[]> = new Subject();
  private currentAirQuality$: Subject<AirQuality> = new Subject();
  
  constructor(
    private locationService: LocationService,
    private apiService: ApiService
  ) {
    // NOTE: First init of weather and daytime
    this.setActualDayTime();
    this.setActualSeason();

    this.locationService
      .getCurrentLocation()
      .subscribe((location: SavedLocationPoint) => {
        this.fetchWeatherAtLocation(location);
      });
  }

  public set unit(unit: string) {
    this.unit$.next(unit);
  }

  public set debug(debug: boolean) {
    this.showDebug$.next(debug);
  }



  // public set showDebug(debug: boolean) {
  //   this.showDebug$.next(debug);
  // }

  
  /**
   * Prepare to fetch the weather at a precise location
   *
   * @public
   * @param SavedLocationPoint location
   */
  public fetchWeatherAtLocation(location: SavedLocationPoint): void {
    this.apiService
      .fetchCurrentWeather(location)
      .then((rawCurrentWeather: any) => {
        const finalCurrentWeather: CurrentWeather =
          this.transformCurrentWeather(location, rawCurrentWeather);

        this.currentWeather$.next(finalCurrentWeather);
      });

    this.apiService.fetchHoursWeather(location).then((rawHoursWeather: any) => {
      const finalHourlyWeather: HourWeather[] =
        this.transformHourlyWeather(rawHoursWeather);

      this.currentHourlyWeather$.next(finalHourlyWeather);
    });

    this.apiService.fetchWeekWeather(location).then((rawWeekWeather: any) => {
      const finalWeekWeather: DayWeather[] =
        this.transformWeekWeather(rawWeekWeather);

      this.currentDaysWeather$.next(finalWeekWeather);
    });

    this.apiService.fetchAirQuality(location).then((res: any) => {
      const finalAirQuality: AirQuality = this.transformAirQuality(res);

      this.currentAirQuality$.next(finalAirQuality);
    });
  }

  /**
   *  Transform the raw air quality data into mapped object
   *
   * @private
   * @param any rawAirQuality
   * @returns AirQuality
   */
  private transformAirQuality(rawAirQuality: any): AirQuality {
    let quality = 'excellent';

    const airQuality: AirQuality = {
      globalQuality: quality,
      uvIndex: rawAirQuality.uvIndex,
      dusts: {
        sand: {
          status:
            rawAirQuality.dusts.sand <= 50
              ? 'low'
              : rawAirQuality.dusts.sand <= 100
              ? 'medium'
              : 'high',
          value: rawAirQuality.dusts.sand,
        },
      },
      particles: {
        pm10: {
          status:
            rawAirQuality.particles.pm10 <= 100
              ? 'low'
              : rawAirQuality.particles.pm10 <= 250
              ? 'medium'
              : 'high',
          value: rawAirQuality.particles.pm10,
        },
        pm2_5: {
          status:
            rawAirQuality.particles.pm2_5 <= 60
              ? 'low'
              : rawAirQuality.particles.pm2_5 <= 90
              ? 'medium'
              : 'high',
          value: rawAirQuality.particles.pm2_5,
        },
      },
      pollens: {
        alder: {
          status: '',
          value: rawAirQuality.pollens.alder,
        },
        birch: {
          status: '',
          value: rawAirQuality.pollens.birch,
        },
        grass: {
          status: '',
          value: rawAirQuality.pollens.grass,
        },
        mugwort: {
          status: '',
          value: rawAirQuality.pollens.mugwort,
        },
        olive: {
          status: '',
          value: rawAirQuality.pollens.olive,
        },
        ragweed: {
          status: '',
          value: rawAirQuality.pollens.ragweed,
        },
      },
      gases: {
        carbonMonoxide: {
          status:
            rawAirQuality.gases.carbonMonoxide <= 150
              ? 'low'
              : rawAirQuality.gases.carbonMonoxide <= 600
              ? 'medium'
              : 'high',
          value: rawAirQuality.gases.carbonMonoxide,
        },
        nitrogenDioxide: {
          status:
            rawAirQuality.gases.nitrogenDioxide <= 250
              ? 'low'
              : rawAirQuality.gases.nitrogenDioxide <= 1500
              ? 'medium'
              : 'high',
          value: rawAirQuality.gases.nitrogenDioxide,
        },
        sulphurDioxide: {
          status:
            rawAirQuality.gases.sulphurDioxide <= 100
              ? 'low'
              : rawAirQuality.gases.sulphurDioxide <= 500
              ? 'medium'
              : 'high',
          value: rawAirQuality.gases.sulphurDioxide,
        },
        ozone: {
          status:
            rawAirQuality.gases.ozone <= 50
              ? 'low'
              : rawAirQuality.gases.ozone <= 125
              ? 'medium'
              : 'high',
          value: rawAirQuality.gases.ozone,
        },
      },
    };

    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    let qualityObj = Object.entries(airQuality);
    qualityObj.forEach((comp) => {
      let statusObj = Object.entries(comp[1]);
      statusObj.forEach((s) => {
        let status = (s[1] as any).status;
        if (status === 'low') {
          lowCount = lowCount + 1;
        }
        if (status === 'medium') {
          mediumCount = mediumCount + 1;
        }
        if (status === 'high') {
          highCount = highCount + 1;
        }
      });
    });

    if (mediumCount >= 2 || highCount === 1) {
      quality = 'moderate';
    }
    if (mediumCount > 2 || highCount > 1) {
      quality = 'dangerous';
    }

    airQuality.globalQuality = quality;

    return airQuality;
  }

  /**
   * Transforms raw week weather into an array of mapped days object
   *
   * @private
   * @param any rawWeekWeather
   * @returns DayWeather[]
   */
  private transformWeekWeather(rawWeekWeather: any): DayWeather[] {
    let newWeekWeather: DayWeather[] = [];

    for (let i = 0; i < 7; i++) {
      const weekWeather: DayWeather = {
        isNow: i == 0 ? true : false,
        currentDay: moment().add(i, 'days').locale('fr').format('dddd'),
        precipitation: rawWeekWeather.precipitation[i],
        fullDate: moment(rawWeekWeather.date[i]).locale('fr').format('Do MMMM'),
        minTemperature: rawWeekWeather.minTemperature[i],
        maxTemperature: rawWeekWeather.maxTemperature[i],
        windSpeed: rawWeekWeather.windSpeed[i],
        icon: this.translateWeatherIcon(
          rawWeekWeather.weatherCode[i],
          moment().add(i, 'days')
        ),
        description: this.translateWeatherDescription(
          rawWeekWeather.weatherCode[i]
        ),
      };

      newWeekWeather.push(weekWeather);
    }

    return newWeekWeather;
  }

  /**
   * Transforms the raw hourly weather into mapped hourly object
   *
   * @private
   * @param any rawHoursWeather
   * @returns HourWeather[]
   */
  private transformHourlyWeather(rawHoursWeather: any): HourWeather[] {
    let newHourWeather: HourWeather[] = [];

    for (let i = 0; i < 12; i++) {
      const hourlyWeather: HourWeather = {
        isNow: i == 0 ? true : false,
        hour: moment().add(i, 'hours').format('HH'),
        icon: this.translateWeatherIcon(
          rawHoursWeather.weatherCode[i],
          moment().add(i, 'hours')
        ),
        description: this.translateWeatherDescription(
          rawHoursWeather.weatherCode[i]
        ),
        windSpeed: rawHoursWeather.windSpeed[i],
        precipitation: rawHoursWeather.precipitation[i],
        currentTemperature: rawHoursWeather.temperature[i],
        humidity: rawHoursWeather.humidity[i],
      };
      newHourWeather.push(hourlyWeather);
    }

    return newHourWeather;
  }

  /**
   * Transforms the raw current weather into mapped current weather object
   *
   * @private
   * @param SavedLocationPoint location
   * @param any rawWeather
   * @returns CurrentWeather
   */
  private transformCurrentWeather(
    location: SavedLocationPoint,
    rawWeather: any
  ): CurrentWeather {
    const currentWeather: CurrentWeather = {
      place: location,
      icon: this.translateWeatherIcon(rawWeather.weatherCode),
      description: this.translateWeatherDescription(rawWeather.weatherCode),
      currentTemperature: rawWeather.currentTemperature,
      windSpeed: rawWeather.windSpeed,
      minTemperature: rawWeather.minTemperature,
      maxTemperature: rawWeather.maxTemperature,
      precipitation: rawWeather.precipitation,
      humidity: rawWeather.humidity,
    };

    return currentWeather;
  }

  /**
   * Transforms the weather code into Material icon, defines if it's day or night by setting timestamp
   *
   * @private
   * @param number code
   * @param ?moment.Moment [timestamp]
   * @returns string
   */
  private translateWeatherIcon(
    code: number,
    timestamp?: moment.Moment
  ): string {
    let icon: string = '';

    const dayTime = timestamp
      ? timestamp.hours()
      : this.currentDayTimeAsNumber$.getValue();

    if (dayTime < 6 || dayTime > 20) {
      if (code === 0) {
        icon = 'nightlight';
      }
      if (code === 1 || code === 2 || code === 3) {
        icon = 'nights_stay';
      }
    } else {
      if (code === 0) {
        icon = 'clear_day';
      }
      if (code === 1 || code === 2 || code === 3) {
        icon = 'partly_cloudy_day';
      }
    }

    if (code === 45 || code === 48) {
      icon = 'foggy';
    }
    if (code === 61 || code === 63 || code === 65) {
      icon = 'rainy';
    }
    if (code === 80 || code === 81 || code === 82) {
      icon = 'rainy';
    }
    if (code === 95 || code === 96 || code === 99) {
      icon = 'thunderstorm';
    }
    if (code === 71 || code === 85) {
      icon = 'sunny_snowing';
    }
    if (code === 73 || code === 75 || code === 86) {
      icon = 'cloudy_snowing';
    }
    if (code === 77) {
      icon = 'snowing';
    }
    if (code === 51 || code === 53 || code === 55) {
      icon = 'grain';
    }

    return icon ? icon : 'help';
  }

  /**
   * Transforms the weather code by a readable description
   *
   * @private
   * @param number code
   * @returns string
   */
  private translateWeatherDescription(code: number) {
    let description = '';

    if (code === 0 || code === 1) {
      description = 'Temps clair';
    }
    if (code === 2 || code === 3) {
      description = 'Partiellement couvert';
    }
    if (code === 45 || code === 48) {
      description = 'Temps brumeux';
    }
    if (code === 61 || code === 63 || code === 65) {
      description = 'Temps pluvieux';
    }
    if (code === 80 || code === 81 || code === 82) {
      description = 'Averses éparses';
    }
    if (code === 95 || code === 96 || code === 99) {
      description = 'Temps orageux';
    }
    if (code === 71 || code === 85) {
      description = 'Neige éparse';
    }
    if (code === 73 || code === 75 || code === 86) {
      description = 'Averses de neige';
    }
    if (code === 77) {
      description = 'Temps de neige';
    }

    return description;
  }

  /**
   * Set the actual daytime (for the sun position pricipally)
   * Can be changed in the debug panel
   *
   * @public
   * @returns void
   */
  public setActualDayTime(): void {
    this.currentDayTimeAsNumber$.next(moment().get('hour'));
    this.currentDayTime = this.currentDayTimeAsNumber$.getValue();
  }

  /**
   * Set the actual season
   * Can be changed in the debug panel
   *
   * @public
   * @returns void
   */
  public setActualSeason(): void {
    this.currentSeasonAsNumber$.next(moment().get('month'));
    this.currentSeason = this.currentSeasonAsNumber$.getValue();
  }

  
  /**
   * Set the actual season by providing a month number
   * Can be changed in the debug panel
   * 
   * @public
   * @type {number}
   */
  public set currentSeason(month: number) {
    const now = moment();

    let season: string = '';

    const winter_months = [1, 2, 11, 12];
    const spring_months = [3, 4];
    const summer_months = [5, 6, 7];
    const autumn_months = [8, 9, 10];

    if (month) {
      this.currentSeasonAsNumber$.next(month);

      if (winter_months.includes(month)) {
        season = 'winter';
      }
      if (spring_months.includes(month)) {
        season = 'spring';
      }
      if (summer_months.includes(month)) {
        season = 'summer';
      }
      if (autumn_months.includes(month)) {
        season = 'autumn';
      }
    } else {
      const current_month = now.get('month');

      this.currentSeasonAsNumber$.next(current_month);

      if (winter_months.includes(current_month)) {
        season = 'winter';
      }
      if (spring_months.includes(current_month)) {
        season = 'spring';
      }
      if (summer_months.includes(current_month)) {
        season = 'summer';
      }
      if (autumn_months.includes(current_month)) {
        season = 'autumn';
      }
    }

    this.currentSeason$.next(season);
  }

  
  /**
   * Set the current daytime by providing the time on 24 hours
   * Can be set in the debug panel
   *
   * @public
   * @type number
   */
  public set currentDayTime(time: number) {
    let currentState = '';

    if (time) {
      this.currentDayTimeAsNumber$.next(time);

      if (time == 1 || time == 2 || time == 3 || time == 4 || time == 5) {
        currentState = 'nadir';
      }
      if (time == 6 || time == 7 || time == 8) {
        currentState = 'dawn';
      }
      if (time == 9 || time == 10) {
        currentState = 'nauticalDawn';
      }
      if (time == 11 || time == 12) {
        currentState = 'dusk';
      }
      if (time == 13 || time == 14) {
        currentState = 'goldenHour';
      }
      if (time == 15 || time == 16) {
        currentState = 'sunsetStart';
      }
      if (time == 17 || time == 18) {
        currentState = 'nauticalDawn';
      }
      if (time == 19 || time == 20) {
        currentState = 'dawn';
      }
      if (time == 21 || time == 22) {
        currentState = 'night';
      }
      if (time == 23 || time == 24) {
        currentState = 'nadir';
      }

      this.currentDayTime$.next(currentState);
    } else {
      const now = moment();

      this.currentDayTimeAsNumber$.next(now.get('hours'));

      this.locationService
        .getCurrentLocation()
        .subscribe((currentLocation: SavedLocationPoint) => {
          this.getSunStateAtLocation(now.toDate(), currentLocation).then(
            (state: string) => {
              currentState = state;

              this.currentDayTime$.next(currentState);
            }
          );
        });
    }
  }


  
  /**
   * Get the sun position by providing the local time and location point
   *
   * @public
   * @param Date time
   * @param SavedLocationPoint point
   * @returns Promise<string>
   */
  public getSunStateAtLocation(
    time: Date,
    point: SavedLocationPoint
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let currentState;

      let times: SunPosition = SunCalc.getTimes(
        time,
        point.position.lat,
        point.position.lng
      );

      let sunrise = moment().diff(times.sunrise, 'hour');
      let sunriseEnd = moment().diff(times.sunriseEnd, 'hour');
      let dawn = moment().diff(times.dawn, 'hour');
      let sunsetStart = moment().diff(times.sunsetStart, 'hour');
      let dusk = moment().diff(times.dusk, 'hour');
      let goldenHourEnd = moment().diff(times.goldenHourEnd, 'hour');
      let solarNoon = moment().diff(times.solarNoon, 'hour');
      let goldenHour = moment().diff(times.goldenHour, 'hour');
      let sunset = moment().diff(times.sunset, 'hour');
      let nauticalDusk = moment().diff(times.nauticalDusk, 'hour');
      let night = moment().diff(times.night, 'hour');
      let nadir = moment().diff(times.nadir, 'hour');
      let nightEnd = moment().diff(times.nightEnd, 'hour');
      let nauticalDawn = moment().diff(times.nauticalDawn, 'hour');

      // NOTE: for debugging sun states
      // console.log('sunrise =>' + sunrise);
      // console.log('sunriseEnd =>' + sunriseEnd);
      // console.log('dawn =>' + dawn);
      // console.log('dusk =>' + dusk);
      // console.log('sunsetStart =>' + sunsetStart);
      // console.log('goldenHourEnd =>' + goldenHourEnd);
      // console.log('solarNoon =>' + solarNoon);
      // console.log('goldenHour =>' + goldenHour);
      // console.log('sunset =>' + sunset);
      // console.log('nauticalDusk =>' + nauticalDusk);

      if (dawn <= 0) {
        currentState = 'dawn';
      }
      if (sunrise <= 0) {
        currentState = 'sunrise';
      }
      if (sunriseEnd <= 0) {
        currentState = 'sunriseEnd';
      }
      if (dusk <= 0) {
        currentState = 'dusk';
      }
      if (sunsetStart <= 0) {
        currentState = 'sunsetStart';
      }
      if (goldenHourEnd <= 0) {
        currentState = 'goldenHourEnd';
      }
      if (solarNoon <= 0) {
        currentState = 'solarNoon';
      }
      if (goldenHour <= 0) {
        currentState = 'goldenHour';
      }
      if (sunset <= 0) {
        currentState = 'sunset';
      }
      if (nauticalDusk <= 0) {
        currentState = 'nauticalDusk';
      }
      if (night <= 0) {
        currentState = 'night';
      }
      if (nadir <= 0) {
        currentState = 'nadir';
      }
      if (nightEnd <= 0) {
        currentState = 'nightEnd';
      }
      if (nauticalDawn <= 0) {
        currentState = 'nauticalDawn';
      }

      if (currentState) {
        resolve(currentState);
      } else {
        reject('currentState not detected');
      }
    });
  }

  public getDebug(): Observable<boolean> {
    return this.showDebug$.asObservable();
  }

  public getUnit(): Observable<string> {
    return this.unit$.asObservable();
  }

  public getAirQuality(): Observable<AirQuality> {
    return this.currentAirQuality$.asObservable();
  }

  public getCurrentDayTime(): Observable<string> {
    return this.currentDayTime$.asObservable();
  }

  public getCurrentDayTimeAsNumber(): Observable<number> {
    return this.currentDayTimeAsNumber$.asObservable();
  }

  public getCurrentSeason(): Observable<string> {
    return this.currentSeason$.asObservable();
  }

  public getCurrentSeasonAsNumber(): Observable<number> {
    return this.currentSeasonAsNumber$.asObservable();
  }

  public getCurrentWeather(): Observable<CurrentWeather> {
    return this.currentWeather$.asObservable();
  }

  public getCurrentWeatherHours(): Observable<HourWeather[]> {
    return this.currentHourlyWeather$.asObservable();
  }

  public getCurrentWeatherWeek(): Observable<DayWeather[]> {
    return this.currentDaysWeather$.asObservable();
  }
}
