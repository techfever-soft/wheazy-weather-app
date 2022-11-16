import { Injectable } from '@angular/core';
import { SavedLocationPoint } from '../interfaces/location.interface';

import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseWeatherUrl: string = 'https://api.open-meteo.com/v1/forecast?';
  private baseAirUrl: string =
    'https://air-quality-api.open-meteo.com/v1/air-quality?';

  constructor() {}

  /**
   * Fetch the raw weather of the entire week
   *
   * @public
   * @async
   * @param SavedLocationPoint location
   * @returns Promise<any>
   */
  public async fetchWeekWeather(location: SavedLocationPoint): Promise<any> {
    const lat: number = location.position.lat;
    const lng: number = location.position.lng;

    const request = await fetch(
      this.baseWeatherUrl +
        'latitude=' +
        lat +
        '&longitude=' +
        lng +
        '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max' +
        '&timezone=auto'
    );
    const result = await request.json();

    const rawWeekData: any = {
      weatherCode: result.daily.weathercode as any[],
      precipitation: result.daily.precipitation_sum as any[],
      minTemperature: result.daily.temperature_2m_min as any[],
      maxTemperature: result.daily.temperature_2m_max as any[],
      windSpeed: result.daily.windspeed_10m_max as any[],
      date: result.daily.time as any[],
    };

    return rawWeekData;
  }

  /**
   * Fetch the raw current weather of the hour
   *
   * @public
   * @async
   * @param SavedLocationPoint location
   * @returns Promise<any>
   */
  public async fetchCurrentWeather(location: SavedLocationPoint): Promise<any> {
    const lat: number = location.position.lat;
    const lng: number = location.position.lng;

    const request = await fetch(
      this.baseWeatherUrl +
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

    const rawCurrentDayData: any = {
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

  /**
   * Fetch the raw weather of the day by hours
   *
   * @public
   * @async
   * @param SavedLocationPoint location
   * @returns Promise<any>
   */
  public async fetchHoursWeather(location: SavedLocationPoint): Promise<any> {
    const lat: number = location.position.lat;
    const lng: number = location.position.lng;

    const request = await fetch(
      this.baseWeatherUrl +
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

    let index: number = result.hourly.time.findIndex((time: string) =>
      moment(time).isAfter(moment().subtract(1, 'hour'))
    );

    const hourlyWeather: any = {
      time: result.hourly.time.splice(index, 12),
      precipitation: rawHourlyWeather.precipitation.splice(index, 12),
      humidity: rawHourlyWeather.humidity.splice(index, 12),
      temperature: rawHourlyWeather.temperature.splice(index, 12),
      weatherCode: rawHourlyWeather.weatherCode.splice(index, 12),
      windSpeed: rawHourlyWeather.windSpeed.splice(index, 12),
    };

    return hourlyWeather;
  }

  
  /**
   * Fetch the current air quality of the day
   *
   * @public
   * @async
   * @param SavedLocationPoint location
   * @returns Promise<any>
   */
  public async fetchAirQuality(location: SavedLocationPoint): Promise<any> {
    const lat: number = location.position.lat;
    const lng: number = location.position.lng;

    const request = await fetch(
      this.baseAirUrl +
        'latitude=' +
        lat +
        '&longitude=' +
        lng +
        '&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,uv_index_clear_sky,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen' +
        '&timezone=auto'
    );
    const result = await request.json();

    const rawAirQuality: any = {
      uvIndex: result.hourly.uv_index as any[],
      dusts: {
        sand: result.hourly.dust as any[],
      },
      gases: {
        carbonMonoxide: result.hourly.carbon_monoxide as any[],
        nitrogenDioxide: result.hourly.nitrogen_dioxide as any[],
        sulphurDioxide: result.hourly.sulphur_dioxide as any[],
        ozone: result.hourly.ozone as any[],
      },
      pollens: {
        alder: result.hourly.alder_pollen as any[],
        birch: result.hourly.birch_pollen as any[],
        grass: result.hourly.grass_pollen as any[],
        mugwort: result.hourly.mugwort_pollen as any[],
        olive: result.hourly.olive_pollen as any[],
        ragweed: result.hourly.ragweed_pollen as any[],
      },
      particles: {
        pm2_5: result.hourly.pm2_5 as any[],
        pm10: result.hourly.pm10 as any[],
      },
    };

    const airQuality: any = {
      uvIndex: rawAirQuality.uvIndex[0],
      dusts: {
        sand: rawAirQuality.dusts.sand[0],
      },
      gases: {
        carbonMonoxide: rawAirQuality.gases.carbonMonoxide[0],
        nitrogenDioxide: rawAirQuality.gases.nitrogenDioxide[0],
        sulphurDioxide: rawAirQuality.gases.sulphurDioxide[0],
        ozone: rawAirQuality.gases.ozone[0],
      },
      pollens: {
        alder: rawAirQuality.pollens.alder[0],
        birch: rawAirQuality.pollens.birch[0],
        grass: rawAirQuality.pollens.grass[0],
        mugwort: rawAirQuality.pollens.mugwort[0],
        olive: rawAirQuality.pollens.olive[0],
        ragweed: rawAirQuality.pollens.ragweed[0],
      },
      particles: {
        pm2_5: rawAirQuality.particles.pm2_5[0],
        pm10: rawAirQuality.particles.pm10[0],
      },
    };

    return airQuality;
  }
}
