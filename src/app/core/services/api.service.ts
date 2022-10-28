import { Injectable } from '@angular/core';
import moment from 'moment';
import { SavedLocationPoint } from '../interfaces/location.interface';
import {
  CurrentWeather,
  DayWeather,
  SunPosition,
} from '../interfaces/weather.interface';
import * as SunCalc from 'suncalc';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast?';

  constructor() {}

  public fetchWeekWeather() {}

  public async fetchCurrentWeather(location: SavedLocationPoint): Promise<any> {
    const lat = location.position.lat;
    const lng = location.position.lng;

    const request = await fetch(
      this.baseUrl +
        'latitude=' +
        lat +
        '&longitude=' +
        lng +
        '&current_weather=true' +
        '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
        '&hourly=relativehumidity_2m' +
        '&timezone=auto'
    );
    const result = await request.json();
    // return result;
    const rawCurrentDayData = {
      temperature: result.current_weather.temperature,
      weathercode: result.current_weather.weathercode,
      windspeed: result.current_weather.windspeed,
      precipitation: result.daily.precipitation_sum[0],
      minTemperature: result.daily.temperature_2m_min[0],
      maxTemperature: result.daily.temperature_2m_max[0],
      humidity: result.hourly.relativehumidity_2m[0],
    };

    const currentWeather: any = {
      // place: location,
      // icon: this.translateWeatherIcon(rawCurrentDayData.weathercode, location),
      // description: this.translateWeatherDescription(
      //   rawCurrentDayData.weathercode
      // ),
      weatherCode: rawCurrentDayData.weathercode,
      currentTemperature: rawCurrentDayData.temperature,
      windSpeed: rawCurrentDayData.windspeed,
      minTemperature: rawCurrentDayData.minTemperature,
      maxTemperature: rawCurrentDayData.maxTemperature,
      precipitation: rawCurrentDayData.precipitation,
      humidity: rawCurrentDayData.humidity,
    };

    return currentWeather;
  }

  public async fetchHoursWeather(location: SavedLocationPoint) {
    const lat = location.position.lat;
    const lng = location.position.lng;

    const request = await fetch(
      this.baseUrl +
        'latitude=' +
        lat +
        '&longitude=' +
        lng +
        '&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m' +
        '&timezone=auto'
    );
    const result = await request.json();


    const rawHourlyWeather: any = {
      precipitation: result.hourly.precipitation as any[],
      humidity: result.hourly.relativehumidity_2m as any[],
      temperature: result.hourly.temperature_2m as any[],
      weatherCode: result.hourly.weathercode as any[],
      windSpeed: result.hourly.windspeed_10m as any[],
    };

    let index = result.hourly.time.findIndex((time: string) =>
      moment(time).isAfter(moment().subtract(1, 'hour'))
    );

    const hourlyWeather = {
      time: result.hourly.time.splice(index, 12),
      precipitation: rawHourlyWeather.precipitation.splice(index, 12),
      humidity: rawHourlyWeather.humidity.splice(index, 12),
      temperature: rawHourlyWeather.temperature.splice(index, 12),
      weatherCode: rawHourlyWeather.weatherCode.splice(index, 12),
      windSpeed: rawHourlyWeather.windSpeed.splice(index, 12),
    };

    console.log(hourlyWeather);

    return hourlyWeather;
  }

  // private translateWeatherDescription(weatherCode: number): string {
  //   let description;
  //   if (weatherCode == 0 || weatherCode == 1 || weatherCode == 2) {
  //     description = 'Nuageux';
  //   }
  //   return description ? description : 'Code de temps invalide';
  // }

  // private translateWeatherIcon(
  //   weatherCode: number,
  //   currentLocation: SavedLocationPoint
  // ): string {
  //   let icon;

  //   // TODO: if it's day or night at the selected location

  //   let now = moment();

  //   let times: SunPosition = SunCalc.getTimes(
  //     now.toDate(),
  //     currentLocation.position.lat,
  //     currentLocation.position.lng
  //   );

  //   // console.log(times);

  //   let sunrise = moment().diff(times.sunrise, 'hour');
  //   let sunriseEnd = moment().diff(times.sunriseEnd, 'hour');
  //   let dawn = moment().diff(times.dawn, 'hour');
  //   let sunsetStart = moment().diff(times.sunsetStart, 'hour');
  //   let dusk = moment().diff(times.dusk, 'hour');
  //   let goldenHourEnd = moment().diff(times.goldenHourEnd, 'hour');
  //   let solarNoon = moment().diff(times.solarNoon, 'hour');
  //   let goldenHour = moment().diff(times.goldenHour, 'hour');
  //   let sunset = moment().diff(times.sunset, 'hour');
  //   let nauticalDusk = moment().diff(times.nauticalDusk, 'hour');
  //   let night = moment().diff(times.night, 'hour');
  //   let nadir = moment().diff(times.nadir, 'hour');
  //   let nightEnd = moment().diff(times.nightEnd, 'hour');
  //   let nauticalDawn = moment().diff(times.nauticalDawn, 'hour');

  //   // if it's night

  //   if (night <= 0 || nadir <= 0) {
  //     if (weatherCode === 0) {
  //       icon = 'nightlight';
  //     }
  //     if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
  //       icon = 'nights_stay';
  //     }
  //   } else {
  //     if (weatherCode === 0) {
  //       icon = 'clear_day';
  //     }
  //     if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
  //       icon = 'partly_cloudy_day';
  //     }
  //   }

  //   return icon ? icon : 'help';
  // }

  // public async fetchDayWeather(lat: number, lng: number) {
  //   const request = await fetch(
  //     'https://api.open-meteo.com/v1/forecast?latitude=' +
  //       lat +
  //       '&longitude=' +
  //       lng +
  //       '&current_weather=true&hourly=relativehumidity_2m,precipitation,temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon'
  //   );
  //   const result = await request.json();
  //   return this.normalizeDays(result);
  // }

  // public getTodayWeather(lat: number, lng: number) {
  //   return this.http.get(
  //     'https://api.open-meteo.com/v1/forecast?latitude=' +
  //       lat +
  //       '&longitude=' +
  //       lng +
  //       '&current_weather=true&hourly=relativehumidity_2m,precipitation,temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon'
  //   );
  // }

  // public getForecastWeather(lat: number, lng: number) {
  //   return this.http.get(
  //     'https://api.open-meteo.com/v1/forecast?latitude=' +
  //       lat +
  //       '&longitude=' +
  //       lng +
  //       '&hourly=temperature_2m,relativehumidity_2m&daily=precipitation_sum,weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FLondon'
  //   );
  // }
}
