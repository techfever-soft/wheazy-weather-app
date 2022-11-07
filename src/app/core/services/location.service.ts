import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddSavedLocationDialogComponent } from 'src/app/pages/main/add-saved-location-dialog/add-saved-location-dialog.component';
import {
  AddressComponents,
  LocationPoint,
  SavedLocationPoint,
} from '../interfaces/location.interface';
import { AppService } from './app.service';

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

  // ANCHOR: settings
  private maxLocations$: BehaviorSubject<number> = new BehaviorSubject(5);

  constructor(private matDialog: MatDialog, private app: AppService) {}

  public set maxLocations(max: number) {
    this.maxLocations$.next(max);
  }

  public set currentLocation(newLocation: SavedLocationPoint) {
    let newLocations = this.savedLocations$.value;

    newLocations.forEach((location: SavedLocationPoint) => {
      location.selected = false;
    });

    newLocation.selected = true;

    this.currentLocation$.next(newLocation);
    this.savedLocations$.next(newLocations);

    window.localStorage.setItem('savedLocations', JSON.stringify(newLocations));
    window.localStorage.setItem('currentLocation', JSON.stringify(newLocation));

    this.app.openSnackBar('Localisation actuelle sélectionnée');
  }

  public set savedLocations(newLocation: SavedLocationPoint) {
    if (
      this.getSavedLocationsNative().length <= this.maxLocations$.getValue()
    ) {
      let newLocationsArray = this.savedLocations$.getValue();
      newLocationsArray.push(newLocation);

      this.savedLocations$.next(newLocationsArray);

      window.localStorage.setItem(
        'savedLocations',
        JSON.stringify(newLocationsArray)
      );
      this.app.openSnackBar('Nouvelle localisation ajoutée');
    } else {
      this.app.openSnackBar('Nombre maximal de localisation atteint');
    }
  }

  public setSavedLocations(locations: SavedLocationPoint[]) {
    this.savedLocations$.next(locations);

    window.localStorage.setItem('savedLocations', JSON.stringify(locations));
  }

  public deleteSavedLocation(index: number) {
    let newLocationsArray = this.savedLocations$.getValue();
    newLocationsArray.splice(index, 1);

    this.savedLocations$.next(newLocationsArray);

    window.localStorage.setItem(
      'savedLocations',
      JSON.stringify(newLocationsArray)
    );

    this.app.openSnackBar('Localisation supprimée');
  }

  public openAddLocationDialog() {
    this.matDialog.open(AddSavedLocationDialogComponent, {
      // maxHeight: '500px',
    });
  }

  public getMaxLocations(): Observable<number> {
    return this.maxLocations$.asObservable();
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
    const rawSavedLocations = window.localStorage.getItem(
      'savedLocations'
    ) as string;

    const savedLocationStorage = JSON.parse(
      rawSavedLocations
    ) as SavedLocationPoint[];

    if (savedLocationStorage && savedLocationStorage.length) {
      this.savedLocations$.next(savedLocationStorage);
    }

    return this.savedLocations$.asObservable();
  }
}
