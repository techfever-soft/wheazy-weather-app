import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public debug: any;

  constructor(private weatherService: WeatherService) {
    this.debug = this.weatherService.debug;
  }

  ngOnInit(): void {}

  public changeUnit(event: any) {
    if (event) {
      this.weatherService.unit = 'celcius';
    } else {
      this.weatherService.unit = 'fahrenheit';
    }
  }

  public toggleDebug(event: any) {
    this.weatherService.debug = event;
  }
}
