import { Injectable } from '@angular/core';
import moment from 'moment';
import { SavedLocationPoint } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast?';

  constructor() {}

  public async fetchWeekWeather(location: SavedLocationPoint): Promise<any> {
    const lat = location.position.lat;
    const lng = location.position.lng;

    const request = await fetch(
      this.baseUrl +
        'latitude=' +
        lat +
        '&longitude=' +
        lng +
        '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max' +
        '&timezone=auto'
    );
    const result = await request.json();

    const rawWeekData = {
      weatherCode: result.daily.weathercode as any[],
      precipitation: result.daily.precipitation_sum as any[],
      minTemperature: result.daily.temperature_2m_min as any[],
      maxTemperature: result.daily.temperature_2m_max as any[],
      windSpeed: result.daily.windspeed_10m_max as any[],
      date: result.daily.time as any[]
    };

    return rawWeekData;
  }

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

    return hourlyWeather;
  }
}
