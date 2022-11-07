import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as SunCalc from 'suncalc';
import {
  LocationPoint,
  SavedLocationPoint,
} from '../interfaces/location.interface';
import {
  AirQuality,
  CurrentWeather,
  DayWeather,
  HourWeather,
  SunPosition,
} from '../interfaces/weather.interface';
import { ApiService } from './api.service';
import { LocationService } from './location.service';

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

  private currentWeather$: Subject<CurrentWeather> = new Subject();
  private currentHourlyWeather$: Subject<HourWeather[]> = new Subject();
  private currentDaysWeather$: Subject<DayWeather[]> = new Subject();

  private currentAirQuality$: Subject<AirQuality> = new Subject();

  // ANCHOR: Settings
  private unit$: BehaviorSubject<string> = new BehaviorSubject('celcius');
  private showDebug$ = new BehaviorSubject(false);

  constructor(
    private locationService: LocationService,
    private apiService: ApiService
  ) {
    this.setActualDayTime();
    this.setActualSeason();

    // NOTE: On current location changed
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

  public getDebug() {
    return this.showDebug$.asObservable();
  }

  public getUnit() {
    return this.unit$.asObservable();
  }

  public getAirQuality(): Observable<AirQuality> {
    return this.currentAirQuality$.asObservable();
  }

  // public set showDebug(debug: boolean) {
  //   this.showDebug$.next(debug);
  // }

  public fetchWeatherAtLocation(location: SavedLocationPoint): void {
    // ANCHOR : get current weather
    this.apiService
      .fetchCurrentWeather(location)
      .then((rawCurrentWeather: any) => {
        const finalCurrentWeather: CurrentWeather =
          this.transformCurrentWeather(location, rawCurrentWeather);

        this.currentWeather$.next(finalCurrentWeather);
      });

    // ANCHOR : get current hour weathers
    this.apiService.fetchHoursWeather(location).then((rawHoursWeather: any) => {
      const finalHourlyWeather: HourWeather[] =
        this.transformHourlyWeather(rawHoursWeather);

      this.currentHourlyWeather$.next(finalHourlyWeather);
    });

    // ANCHOR : get current week weather
    this.apiService.fetchWeekWeather(location).then((rawWeekWeather: any) => {
      const finalWeekWeather: DayWeather[] =
        this.transformWeekWeather(rawWeekWeather);

      this.currentDaysWeather$.next(finalWeekWeather);
    });

    // ANCHOR: get actual air quality
    this.apiService.fetchAirQuality(location).then((res: any) => {
      console.log(res);
      const finalAirQuality: AirQuality = this.transformAirQuality(res);

      this.currentAirQuality$.next(finalAirQuality);
    });
  }

  private transformAirQuality(rawAirQuality: any): AirQuality {
    let score = 100;
    let quality = 'excellent';

    // if (rawAirQuality.particles.pm2_5 && rawAirQuality.particles.pm10) {
    //   score = score - 10;
    // }
    // if (rawAirQuality.gases.carbonMonoxide) {
    //   if (rawAirQuality.gases.carbonMonoxide >= 200) {
    //     score = score - 20;
    //   }
    //   if (rawAirQuality.gases.carbonMonoxide >= 300) {
    //     score = score - 35;
    //   }
    // }
    // if (rawAirQuality.gases.nitrogenDioxide) {
    // }

    // TODO: calculate score and switch it

    // switch(score) {}

    const airQuality: AirQuality = {
      globalQuality: quality,
      uvIndex: rawAirQuality.uvIndex,
      dusts: {
        sand: {
          status: rawAirQuality.dusts.sand > 10 ? 'high' : 'low',
          value: rawAirQuality.dusts.sand,
        },
      },
      particles: {
        pm10: {
          status: rawAirQuality.particles.pm10 > 10 ? 'medium' : 'low',
          value: rawAirQuality.particles.pm10
        },
        pm2_5: {
          status: rawAirQuality.particles.pm2_5 > 10 ? 'medium' : 'low',
          value: rawAirQuality.particles.pm2_5
        }
      },
      // TODO: reform others
      pollens: {
        ...rawAirQuality.pollens,
      },
      gases: {
        ...rawAirQuality.gases,
      },
    };

    return airQuality;
  }

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

  private translateWeatherDescription(code: number) {
    return 'Temps nuageux';
  }

  public setActualDayTime() {
    this.currentDayTimeAsNumber$.next(moment().get('hour'));
    this.currentDayTime = this.currentDayTimeAsNumber$.getValue();
  }

  public setActualSeason() {
    this.currentSeasonAsNumber$.next(moment().get('month'));
    this.currentSeason = this.currentSeasonAsNumber$.getValue();
  }

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

  public set currentDayTime(time: number) {
    let currentState = '';

    if (time) {
      this.currentDayTimeAsNumber$.next(time);

      if (time == 1 || time == 2 || time == 3) {
        currentState = 'nadir';
      }
      if (time == 4 || time == 5 || time == 6) {
        currentState = 'dawn';
      }
      if (time == 7 || time == 8 || time == 9) {
        currentState = 'nauticalDawn';
      }
      if (time == 10 || time == 11 || time == 12) {
        currentState = 'dusk';
      }
      if (time == 13 || time == 14 || time == 15) {
        currentState = 'goldenHour';
      }
      if (time == 16 || time == 17 || time == 18) {
        currentState = 'sunsetStart';
      }
      if (time == 19 || time == 20 || time == 21) {
        currentState = 'nauticalDusk';
      }
      if (time == 22 || time == 23 || time == 24) {
        currentState = 'night';
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
