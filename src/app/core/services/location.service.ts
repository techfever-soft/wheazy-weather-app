import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
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
import {
  currentLocationsSelector,
  savedLocationsSelector,
} from '../state/location.selectors';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private maxLocations$: BehaviorSubject<number> = new BehaviorSubject(5);

  constructor(
    private matDialog: MatDialog,
    private store: Store<{
      savedLocations: SavedLocationPoint[];
      currentLocation: SavedLocationPoint;
    }>
  ) {
    // NOTE: Getting our data with NgRX, data is located in the window.localStorage
    this.store.dispatch(getSavedLocationsAction());
    this.store.dispatch(getCurrentLocationAction());

    // NOTE: for debugging
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

  /**
   * Drag and drop a location in the saved locations list
   *
   * @public
   * @param CdkDragDrop<SavedLocationPoint> event
   * @returns void
   */
  public moveLocation(event: CdkDragDrop<SavedLocationPoint>): void {
    this.store.dispatch(moveSavedLocationsAction(event));
  }

  /**
   * Setting the current location
   *
   * @public
   * @param SavedLocationPoint location
   * @returns void
   */
  public setCurrentLocation(location: SavedLocationPoint): void {
    this.store.dispatch(setSelectedSavedLocationAction(location));
    this.store.dispatch(setCurrentLocationAction(location));
  }

  /**
   * Add a location in the saved locations list
   *
   * @public
   * @param SavedLocationPoint location
   * @returns void
   */
  public addSavedLocation(location: SavedLocationPoint): void {
    this.store.dispatch(addSavedLocationAction(location));
  }

  /**
   * Delete a location in the saved locations list
   *
   * @public
   * @param number index
   * @returns void
   */
  public deleteSavedLocation(index: number): void {
    this.store.dispatch(deleteSavedLocationAction(index));
  }

  /**
   * Open the dialog to add a new location into the saved locations list
   *
   * @public
   * @returns void
   */
  public openAddLocationDialog(): void {
    this.matDialog.open(AddSavedLocationDialogComponent, {
      // maxHeight: '500px',
    });
  }

  /**
   *  Get the max number of allowed saved locations
   *
   * @public
   * @returns Observable<number>
   */
  public getMaxLocations(): Observable<number> {
    return this.maxLocations$.asObservable();
  }

  /**
   * Get the active current location
   *
   * @public
   * @returns Observable<SavedLocationPoint>
   */
  public getCurrentLocation(): Observable<SavedLocationPoint> {
    return this.store.select(currentLocationsSelector);
  }

  /**
   * Get the saved locations list
   *
   * @public
   * @returns Observable<SavedLocationPoint[]>
   */
  public getSavedLocations(): Observable<SavedLocationPoint[]> {
    return this.store.select(savedLocationsSelector);
  }
}
