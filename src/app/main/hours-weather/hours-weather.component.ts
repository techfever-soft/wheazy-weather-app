import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hours-weather',
  templateUrl: './hours-weather.component.html',
  styleUrls: ['./hours-weather.component.scss'],
})
export class HoursWeatherComponent implements OnInit {
  @Input('hours') hours!: any[];

  constructor() {}

  ngOnInit(): void {}
}
