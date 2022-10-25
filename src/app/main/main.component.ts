import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { SavedLocationPoint } from '../core/interfaces/location.interface';
import { LocationService } from '../core/services/location.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public currentLocation: Observable<SavedLocationPoint>;
  public savedLocations: Observable<SavedLocationPoint[]>;

  public actualHoursWeather: any[] = [
    {
      now: moment().get('hours') === moment().get('hours') ? true : false,
      hour: moment().get('hours'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(1, 'hours').get('hours') === moment().get('hours')
          ? true
          : false,
      hour: moment().add(1, 'hours').get('hours'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(2, 'hours').get('hours') === moment().get('hours')
          ? true
          : false,
      hour: moment().add(2, 'hours').get('hours'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
  ];
  public actualDaysWeather: any[] = [
    {
      now: moment().format('DD') === moment().format('DD') ? true : false,
      day: moment().locale('fr').format('dddd'),
      fullDate: moment().locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(1, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(1, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(1, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(2, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(2, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(2, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(3, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(3, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(3, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(4, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(4, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(4, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(5, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(5, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(5, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(6, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(6, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(6, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
    {
      now:
        moment().add(7, 'day').format('DD') === moment().format('DD')
          ? true
          : false,
      day: moment().add(7, 'day').locale('fr').format('dddd'),
      fullDate: moment().add(7, 'day').locale('fr').format('Do MMMM'),
      stateCode: 0,
      stateDescription: 'Temps nuageux',
      minTemperature: 0,
      maxTemperature: 1,
      windSpeed: 1,
      precipitations: 12,
    },
  ];

  constructor(
    private locationService: LocationService,
  ) {
    this.currentLocation = this.locationService.getCurrentLocation();
    this.savedLocations = this.locationService.getSavedLocations();
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
