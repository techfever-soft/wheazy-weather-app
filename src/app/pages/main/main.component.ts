import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { grow } from 'src/app/shared/animations/grow';
import { SavedLocationPoint } from '../../core/interfaces/location.interface';
import {
  AirQuality,
  CurrentWeather,
  DayWeather,
  HourWeather,
} from '../../core/interfaces/weather.interface';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [grow],
})
export class MainComponent implements OnInit {
  public savedLocations: Observable<SavedLocationPoint[]>;

  public currentWeather!: CurrentWeather;
  public actualHoursWeather: any[] = [];
  public actualDaysWeather: DayWeather[] = [];

  public currentAirQuality!: Observable<AirQuality>;

  public isCurrentWeatherLoading: boolean = true;

  public isAirQualityShowed: boolean = false;

  public showDebug: Observable<boolean>;
  public unit: Observable<string>;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService
  ) {
    this.showDebug = this.weatherService.getDebug();
    this.unit = this.weatherService.getUnit();

    /** ANCHOR: Saved locations */
    this.savedLocations = this.locationService.getSavedLocations();

    /** ANCHOR: Current weather */
    // NOTE: Pre-fetch the current weather by the selected place
    this.locationService
      .getCurrentLocation()
      .subscribe((location: SavedLocationPoint) => {
        if (location && location.selected) {
          this.weatherService.fetchWeatherAtLocation(location);
          this.currentAirQuality = this.weatherService.getAirQuality();
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

  ngOnInit(): void {}

  public toggleAirQuality() {
    this.isAirQualityShowed = !this.isAirQualityShowed;
  }

  public selectLocation(location: SavedLocationPoint): void {
    this.locationService.currentLocation = location;
  }

  public openAddSavedLocationDialog() {
    this.locationService.openAddLocationDialog();
  }
}
