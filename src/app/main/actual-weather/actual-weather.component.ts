import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SavedLocationPoint } from 'src/app/core/interfaces/location.interface';

@Component({
  selector: 'app-actual-weather',
  templateUrl: './actual-weather.component.html',
  styleUrls: ['./actual-weather.component.scss'],
})
export class ActualWeatherComponent implements OnInit {
  @Input('actualWeather') actualWeather!: Observable<SavedLocationPoint>;

  constructor() {}

  ngOnInit(): void {}
}
