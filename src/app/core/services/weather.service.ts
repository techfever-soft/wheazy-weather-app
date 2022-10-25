import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SunCalc from 'suncalc';
import { SunPosition } from '../interfaces/weather.interface';
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

  constructor(private locationService: LocationService) {
    this.setActualDayTime();
    this.setActualSeason();
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

      let times: SunPosition = SunCalc.getTimes(
        now.toDate(),
        this.locationService.getCurrentLocationNative().position.lat,
        this.locationService.getCurrentLocationNative().position.lng
      );

      let sunrise = moment().diff(times.sunrise, 'hour');
      let sunriseEnd = moment().diff(times.sunriseEnd, 'hour');
      let dawn = moment().diff(times.dawn, 'hour');
      let sunsetStart = moment().diff(times.sunsetStart, 'hour');
      let dusk = moment().diff(times.dusk, 'hour');
      let goldenHourEnd = moment().diff(times.goldenHourEnd, 'hour');
      let solarNoon = moment().diff(times.solarNoon, 'hour');
      let goldenHour = moment().diff(times.solarNoon, 'hour');
      let sunset = moment().diff(times.solarNoon, 'hour');
      let nauticalDusk = moment().diff(times.solarNoon, 'hour');
      let night = moment().diff(times.solarNoon, 'hour');
      let nadir = moment().diff(times.solarNoon, 'hour');
      let nightEnd = moment().diff(times.solarNoon, 'hour');
      let nauticalDawn = moment().diff(times.solarNoon, 'hour');

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

      this.currentDayTime$.next(currentState);
    }
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
}
