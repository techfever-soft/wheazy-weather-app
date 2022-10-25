import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import build from 'src/build';
import { SavedLocationPoint } from './core/interfaces/location.interface';
import { LocationService } from './core/services/location.service';
import { WeatherService } from './core/services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public savedLocations: Observable<SavedLocationPoint[]>;

  public currentSeason: Observable<string>;
  public currentSeasonAsNumber: Observable<number>;
  public currentDayTime: Observable<string>;
  public currentDayTimeAsNumber: Observable<number>;

  public version: string = build.version;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService
  ) {
    this.savedLocations = this.locationService.getSavedLocations();

    this.currentSeason = this.weatherService.getCurrentSeason();
    this.currentSeasonAsNumber = this.weatherService.getCurrentSeasonAsNumber();

    this.currentDayTime = this.weatherService.getCurrentDayTime();
    this.currentDayTimeAsNumber =
      this.weatherService.getCurrentDayTimeAsNumber();
  }

  public selectLocation(location: SavedLocationPoint) {
    this.locationService.currentLocation = location;
  }

  public deleteSavedLocation(index: number) {
    this.locationService.deleteSavedLocation(index);
  }

  public openAddSavedLocationDialog() {
    this.locationService.openAddLocationDialog();
  }

  public onLocationDropped(event: CdkDragDrop<SavedLocationPoint>) {
    moveItemInArray(
      this.locationService.getSavedLocationsNative(),
      event.previousIndex,
      event.currentIndex
    );
  }
}
