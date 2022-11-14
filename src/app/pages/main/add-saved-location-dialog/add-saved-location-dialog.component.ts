import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AddressComponents,
  SavedLocationPoint,
} from 'src/app/core/interfaces/location.interface';
import {
  Geolocation,
  Geoposition,
} from '@awesome-cordova-plugins/geolocation/ngx';
import { v4 as uuidv4 } from 'uuid';
import { LocationService } from 'src/app/core/services/location.service';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-add-saved-location-dialog',
  templateUrl: './add-saved-location-dialog.component.html',
  styleUrls: ['./add-saved-location-dialog.component.scss'],
})
export class AddSavedLocationDialogComponent implements OnInit {
  @ViewChild('map') public map!: google.maps.Map;
  @ViewChild('addressText') addressText!: ElementRef<HTMLInputElement>;

  public newLocationForm: FormGroup;

  public mapOptions: google.maps.MapOptions = {
    center: { lat: 48.856614, lng: 2.3522219 },
    zoom: 4,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
  };
  public mapCenter = { lat: 48.856614, lng: 2.3522219 };
  public mapZoom = 5;
  public markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };

  private placeSubject: Subject<google.maps.places.PlaceResult> =
    new Subject<google.maps.places.PlaceResult>();
  private placeObservable = this.placeSubject.asObservable();
  protected placeSubscription?: Subscription;

  private pickedPlace!: SavedLocationPoint | undefined;

  public mapsLoaded!: Observable<boolean>;

  constructor(
    private httpClient: HttpClient,
    private geolocation: Geolocation,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSavedLocationDialogComponent>,
    private locationService: LocationService,
    private app: AppService
  ) {
    this.newLocationForm = this.fb.group({
      place: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.mapsLoaded = this.httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyC_hauewhaMW9LzWrFFOvv02gv1SJZ_8xg&libraries=places',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  /**
   * Get the Google Maps autocomplete to attach to an input element
   * @param addressText ElementRef
   */
  private getPlaceAutocomplete(addressText: ElementRef): any {
    const autocomplete = new google.maps.places.Autocomplete(
      addressText.nativeElement,
      {
        componentRestrictions: { country: ['FR'] },
        types: ['address'],
      }
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.placeSubject.next(place);
    });
  }

  public getUserLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((location: Geoposition) => {
        this.geolocate(location.coords.latitude, location.coords.longitude);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  private geolocate(lat: number, lng: number) {
    this.mapCenter = { lat, lng };
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: { ...this.mapCenter },
      },
      (place: google.maps.GeocoderResult[]) => {
        const picked_place = this.formalizePickedPlace(place);
        const place_components = picked_place.address;
        if (place_components && place_components.country) {
          this.newLocationForm
            ?.get('place')
            ?.patchValue(
              place_components.city +
                ', ' +
                place_components.zip +
                ', ' +
                place_components.province +
                ', ' +
                place_components.country
            );
          this.pickedPlace = picked_place;
          this.newLocationForm?.get('place')?.markAsTouched();
          this.newLocationForm?.get('place')?.setErrors(null);
        } else {
          this.pickedPlace = undefined;
          this.newLocationForm
            ?.get('place')
            ?.patchValue('Emplacement invalide');
          this.newLocationForm?.get('place')?.markAsTouched();
          this.newLocationForm?.get('place')?.setErrors({
            invalid_address: true,
          });
        }
      }
    );
  }

  public onAddressChange(): void {
    this.getPlaceAutocomplete(this.addressText);
    this.placeSubscription = this.placeObservable.subscribe(
      (place: google.maps.places.PlaceResult) => {
        if (place && place.geometry?.location) {
          this.geolocate(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        }
      }
    );
  }

  public dragMarkerEnd(event: any) {
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();

    this.geolocate(lat, lng);
  }

  private formalizePickedPlace(
    place: google.maps.GeocoderResult[]
  ): SavedLocationPoint {
    const formatted_address = place[0].formatted_address;
    const lat = place[0].geometry.location.lat();
    const lng = place[0].geometry.location.lng();
    const province = this.getAddressComponent(place, {
      administrative_area_level_1: 'long_name',
    });
    const zip = this.getAddressComponent(place, {
      postal_code: 'long_name',
    });
    const city = this.getAddressComponent(place, {
      locality: 'long_name',
    });
    const street = this.getAddressComponent(place, {
      street: 'long_name',
    });
    const country = this.getAddressComponent(place, {
      country: 'long_name',
    });
    return <SavedLocationPoint>{
      position: {
        lat,
        lng,
      },
      address: <AddressComponents>{
        formattedAddress: street,
        province: province,
        country: country,
        zip: zip,
        city: city,
      },
      createdAt: new Date(),
      simplifiedAddress: formatted_address,
      selected: false,
    };
  }

  private getAddressComponent(
    result: any,
    fields: any
  ): google.maps.GeocoderResult[] {
    let res;
    for (const component of result[0].address_components) {
      const addressType = component.types[0];
      if (fields[addressType]) {
        res = component[fields[addressType]];
      }
    }
    return res;
  }

  public addLocation() {
    if (this.pickedPlace) {
      console.log(this.pickedPlace);

      this.locationService.addSavedLocation(this.pickedPlace);
      
      this.dialogRef.close();
    }
  }
}
