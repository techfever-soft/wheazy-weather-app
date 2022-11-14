import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SavedLocationPoint } from '../interfaces/location.interface';

export const savedLocationsState =
  createFeatureSelector<SavedLocationPoint[]>('savedLocations');

export const selectedLocationState =
  createFeatureSelector<SavedLocationPoint>('currentLocation');

export const savedLocationsSelector = createSelector(
  savedLocationsState,
  (savedLocations) => savedLocations
);

export const currentLocationsSelector = createSelector(
  selectedLocationState,
  (selectedLocation) => selectedLocation
);
