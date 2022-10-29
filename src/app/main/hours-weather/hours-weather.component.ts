import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hours-weather',
  templateUrl: './hours-weather.component.html',
  styleUrls: ['./hours-weather.component.scss'],
})
export class HoursWeatherComponent implements OnInit {
  @Input('hours') hours!: any[];
  public fakeHours: number[] = [];

  constructor() {
    for (let i = 0; i < 12; i++) {
      this.fakeHours.push(i);
    }
  }

  ngOnInit(): void {}
}
