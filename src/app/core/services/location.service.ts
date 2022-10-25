import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddSavedLocationDialogComponent } from 'src/app/main/add-saved-location-dialog/add-saved-location-dialog.component';
import {
  AddressComponents,
  LocationPoint,
  SavedLocationPoint,
} from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private savedLocations$: BehaviorSubject<SavedLocationPoint[]> =
    new BehaviorSubject([
      {
        position: <LocationPoint>{
          lat: 0,
          lng: 0,
        },
        address: <AddressComponents>{
          city: '',
          province: '',
          zip: 0,
          formattedAddress: '',
          street: '',
          country: '',
        },
        createdAt: new Date(),
        simplifiedAddress: 'test 1',
        selected: true,
      },
      {
        position: <LocationPoint>{
          lat: 1,
          lng: 1,
        },
        address: <AddressComponents>{
          city: '',
          province: '',
          zip: 0,
          formattedAddress: '',
          street: '',
          country: '',
        },
        createdAt: new Date(),
        simplifiedAddress: 'test 2',
        selected: false,
      },
    ]);
  private currentLocation$: BehaviorSubject<SavedLocationPoint> =
    new BehaviorSubject(this.savedLocations$.getValue()[0]);

  constructor(private matDialog: MatDialog) {}

  public set currentLocation(newLocation: SavedLocationPoint) {
    this.savedLocations$.value.forEach((location: SavedLocationPoint) => {
      location.selected = false;
    });

    newLocation.selected = true;

    this.currentLocation$.next(newLocation);
  }

  public set savedLocations(newLocation: SavedLocationPoint) {
    let newLocationsArray = this.savedLocations$.getValue();
    newLocationsArray.push(newLocation);

    this.savedLocations$.next(newLocationsArray);
  }

  public getCurrentLocationNative(): SavedLocationPoint {
    return this.currentLocation$.getValue();
  }

  public getCurrentLocation(): Observable<SavedLocationPoint> {
    return this.currentLocation$.asObservable();
  }

  public getSavedLocationsNative(): SavedLocationPoint[] {
    return this.savedLocations$.getValue();
  }

  public getSavedLocations(): Observable<SavedLocationPoint[]> {
    return this.savedLocations$.asObservable();
  }

  public deleteSavedLocation(index: number) {
    let newLocationsArray = this.savedLocations$.getValue();
    newLocationsArray.splice(index, 1);

    this.savedLocations$.next(newLocationsArray);
  }

  public openAddLocationDialog() {
    this.matDialog.open(AddSavedLocationDialogComponent, {
      // maxHeight: '500px',
    });
  }
}
