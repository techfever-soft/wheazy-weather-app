import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-days-weather',
  templateUrl: './days-weather.component.html',
  styleUrls: ['./days-weather.component.scss']
})
export class DaysWeatherComponent implements OnInit {
  @Input('days') days!: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
