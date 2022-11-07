import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import build from 'src/build';
import { SavedLocationPoint } from './core/interfaces/location.interface';
import { AppService } from './core/services/app.service';
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

  public drawerOpened = true;

  public maxSavedLocations: Observable<number>;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
    private router: Router,
    private app: AppService
  ) {
    // TODO: Pipe saved locations until it reach maxSavedLocations
    this.savedLocations = this.locationService.getSavedLocations();

    this.currentSeason = this.weatherService.getCurrentSeason();
    this.currentSeasonAsNumber = this.weatherService.getCurrentSeasonAsNumber();

    this.currentDayTime = this.weatherService.getCurrentDayTime();
    this.currentDayTimeAsNumber =
      this.weatherService.getCurrentDayTimeAsNumber();

    // Settings
    this.maxSavedLocations = this.locationService.getMaxLocations();

    this.app.showSignature();
  }

  public get isNotAtWeatherPage(): boolean {
    return this.router.url === '/main' ? false : true;
  }

  public get asReachedMaxLocations(): boolean {
    let savedLength = 0;
    this.savedLocations.subscribe((saved) => {
      savedLength = saved.length;
    });

    let maxLength = 0;
    this.maxSavedLocations.subscribe((max) => {
      maxLength = max;
    });

    if (savedLength >= maxLength) {
      return true;
    }

    return false;
  }

  public toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  public closeDrawer() {
    this.drawerOpened = false;
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
    let newSavedLocations;
    this.locationService.getSavedLocations().subscribe((savedLocations) => {
      newSavedLocations = savedLocations;

      moveItemInArray(
        newSavedLocations,
        event.previousIndex,
        event.currentIndex
      );

      this.locationService.setSavedLocations(newSavedLocations);

      this.app.openSnackBar('Localisation déplacée');
    });
  }
}
