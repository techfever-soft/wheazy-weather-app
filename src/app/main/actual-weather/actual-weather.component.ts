import { Component, Input, OnInit } from '@angular/core';
import moment, { Moment } from 'moment';
import { interval, Observable, timer } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { SavedLocationPoint } from 'src/app/core/interfaces/location.interface';
import { CurrentWeather } from 'src/app/core/interfaces/weather.interface';

@Component({
  selector: 'app-actual-weather',
  templateUrl: './actual-weather.component.html',
  styleUrls: ['./actual-weather.component.scss'],
})
export class ActualWeatherComponent implements OnInit {
  @Input('currentWeather') currentWeather!: Observable<CurrentWeather>;
  public currentTime: string = moment().locale('fr').format('ddd Do MMM [à] HH[h]mm');

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = moment().locale('fr').format('ddd Do MMM [à] HH[h]mm');
    }, 1000)
  }

  update() {
    
  }
}
