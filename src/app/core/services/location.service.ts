import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AddSavedLocationDialogComponent } from 'src/app/pages/main/add-saved-location-dialog/add-saved-location-dialog.component';
import {
  addSavedLocationAction,
  getCurrentLocationAction,
  getSavedLocationsAction,
  setCurrentLocationAction,
  moveSavedLocationsAction,
  setSelectedSavedLocationAction,
  deleteSavedLocationAction,
} from '../state/location.action';
import { SavedLocationPoint } from '../interfaces/location.interface';
import { AppService } from './app.service';
import {
  currentLocationsSelector,
  savedLocationsSelector,
} from '../state/location.selectors';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private savedLocations$: Observable<SavedLocationPoint[]> = this.store.select(
    savedLocationsSelector
  );
  private currentLocation$: Observable<SavedLocationPoint> = this.store.select(
    currentLocationsSelector
  );

  // ANCHOR: settings
  private maxLocations$: BehaviorSubject<number> = new BehaviorSubject(5);

  constructor(
    private matDialog: MatDialog,
    private app: AppService,
    private store: Store<{
      savedLocations: SavedLocationPoint[];
      currentLocation: SavedLocationPoint;
    }>
  ) {
    this.store.dispatch(getSavedLocationsAction());
    this.store.dispatch(getCurrentLocationAction());

    // this.savedLocations$.subscribe((state) => {
    //   console.log('savedLocations =>', state);
    // });

    // this.currentLocation$.subscribe((state) => {
    //   console.log('currentLocation =>', state);
    // });
  }

  public set maxLocations(max: number) {
    this.maxLocations$.next(max);
  }

  public moveLocation(event: CdkDragDrop<SavedLocationPoint>) {
    this.store.dispatch(moveSavedLocationsAction(event));
  }

  public setCurrentLocation(location: SavedLocationPoint) {
    this.store.dispatch(setSelectedSavedLocationAction(location));
    this.store.dispatch(setCurrentLocationAction(location));
  }

  public addSavedLocation(location: SavedLocationPoint) {
    this.store.dispatch(addSavedLocationAction(location));
  }

  public deleteSavedLocation(index: number) {
    this.store.dispatch(deleteSavedLocationAction(index));
  }

  public openAddLocationDialog() {
    this.matDialog.open(AddSavedLocationDialogComponent, {
      // maxHeight: '500px',
    });
  }

  public getMaxLocations(): Observable<number> {
    return this.maxLocations$.asObservable();
  }

  public getCurrentLocation(): Observable<SavedLocationPoint> {
    return this.store.select(currentLocationsSelector);
  }

  public getSavedLocations(): Observable<SavedLocationPoint[]> {
    return this.store.select(savedLocationsSelector);
  }
}
