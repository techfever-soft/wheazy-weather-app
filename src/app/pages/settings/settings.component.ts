import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public debug: any;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {
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

  public changeMaxLocations(event: any) {
    this.locationService.maxLocations = event.value;
  }

  public toggleDebug(event: any) {
    this.weatherService.debug = event;
  }
}
