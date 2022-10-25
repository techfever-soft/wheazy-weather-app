import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather-layout',
  templateUrl: './weather-layout.component.html',
  styleUrls: ['./weather-layout.component.scss'],
})
export class WeatherLayoutComponent implements OnInit {
  @Input('season') season!: Observable<string>;

  constructor() {}

  ngOnInit(): void {}
}
