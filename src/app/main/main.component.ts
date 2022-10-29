import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SavedLocationPoint } from '../core/interfaces/location.interface';
import {
  CurrentWeather,
  DayWeather,
  HourWeather,
} from '../core/interfaces/weather.interface';
import { LocationService } from '../core/services/location.service';
import { WeatherService } from '../core/services/weather.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public savedLocations: Observable<SavedLocationPoint[]>;

  public currentWeather!: CurrentWeather;
  public actualHoursWeather: any[] = [];
  public actualDaysWeather: DayWeather[] = [];

  public isCurrentWeatherLoading: boolean = true;
  // TODO: others loaders
  // public isLoading: boolean = true;
  // public isLoading: boolean = true;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService
  ) {
    this.savedLocations = this.locationService.getSavedLocations();

    /** ANCHOR: Current weather */
    // NOTE: Pre-fetch the current weather by the selected place
    this.locationService
      .getCurrentLocation()
      .subscribe((location: SavedLocationPoint) => {
        if (location && location.selected) {
          this.weatherService.fetchWeatherAtLocation(location);
        }
      });

    // NOTE: Fetch and display the current weather data
    this.weatherService.getCurrentWeather().subscribe((currentWeather) => {
      this.isCurrentWeatherLoading = true;
      setTimeout(() => {
        this.currentWeather = currentWeather;
          this.isCurrentWeatherLoading = false;
        }, 2500);
    });

    /** ANCHOR: Weather by hours */
    this.weatherService
      .getCurrentWeatherHours()
      .subscribe((hours: HourWeather[]) => {
        if (hours && hours.length) {
          setTimeout(() => {
            this.actualHoursWeather = hours;
          }, 2500);
        }
      });

    /** ANCHOR: Weather by week */
    this.weatherService
      .getCurrentWeatherWeek()
      .subscribe((week: DayWeather[]) => {
        if (week && week.length) {
          setTimeout(() => {
            this.actualDaysWeather = week;
          }, 2500);
        }
      });
  }

  ngOnInit(): void {
    // this.openAddSavedLocationDialog();
  }

  public selectLocation(location: SavedLocationPoint): void {
    this.locationService.currentLocation = location;
  }

  public openAddSavedLocationDialog() {
    this.locationService.openAddLocationDialog();
  }
}
