import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DayWeather } from 'src/app/core/interfaces/weather.interface';

@Component({
  selector: 'app-days-weather',
  templateUrl: './days-weather.component.html',
  styleUrls: ['./days-weather.component.scss'],
})
export class DaysWeatherComponent implements OnInit {
  @Input('days') days!: DayWeather[];
  @Input('unit') unit!: Observable<string>;
  @Input('isLoading') isLoading: boolean = true;
  public fakeDays: number[] = [];

  constructor() {
    for (let i = 0; i < 7; i++) {
      this.fakeDays.push(i);
    }
  }

  ngOnInit(): void {}
}
