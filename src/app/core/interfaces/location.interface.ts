export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface AddressComponents {
  formattedAddress: google.maps.GeocoderResult[] | string;
  city: google.maps.GeocoderResult[] | string;
  province: google.maps.GeocoderResult[] | string;
  country: google.maps.GeocoderResult[] | string;
  zip: google.maps.GeocoderResult[] | number;
}

export interface SavedLocationPoint {
  position: LocationPoint;
  address: AddressComponents;
  createdAt: Date;
  simplifiedAddress: string;
  selected: boolean;
}
