import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hours-weather',
  templateUrl: './hours-weather.component.html',
  styleUrls: ['./hours-weather.component.scss'],
})
export class HoursWeatherComponent implements OnInit {
  @Input('hours') hours!: any[];
  @Input('unit') unit!: Observable<string>;
  public fakeHours: number[] = [];

  constructor() {
    for (let i = 0; i < 12; i++) {
      this.fakeHours.push(i);
    }
  }

  ngOnInit(): void {}
}
