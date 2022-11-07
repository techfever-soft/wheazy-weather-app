import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import {
  AirQuality,
  CurrentWeather,
} from 'src/app/core/interfaces/weather.interface';

@Component({
  selector: 'app-actual-weather',
  templateUrl: './actual-weather.component.html',
  styleUrls: ['./actual-weather.component.scss'],
})
export class ActualWeatherComponent implements OnInit {
  @Input('currentWeather') currentWeather!: CurrentWeather;
  @Input('isLoading') isLoading: boolean = true;
  @Input('unit') unit!: Observable<string>;
  @Input('uvIndex') uvIndex?: number;
  @Input('globalAirQuality') globalAirQuality?: string;

  public currentTime: string = moment()
    .locale('fr')
    .format('dddd Do MMMM [, à] HH[h]mm');

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = moment()
        .locale('fr')
        .format('dddd Do MMMM[, à] HH[h]mm');
    }, 1000);
  }

  update() {}
}
