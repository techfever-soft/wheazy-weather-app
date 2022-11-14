import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { createAction, props } from '@ngrx/store';
import { SavedLocationPoint } from '../interfaces/location.interface';

export const addSavedLocationAction = createAction(
  '[Location] Added location',
  props<SavedLocationPoint>()
);

export const getSavedLocationsAction = createAction(
  '[Location] Get saved locations'
);

export const deleteSavedLocationAction = createAction(
  '[Location] Deleted saved location',
  props<any>()
);

export const moveSavedLocationsAction = createAction(
  '[Location] Moved saved location',
  props<CdkDragDrop<SavedLocationPoint>>()
);

export const setSelectedSavedLocationAction = createAction(
  '[Location] Setted selected saved location',
  props<SavedLocationPoint>()
);

// Current location

export const setCurrentLocationAction = createAction(
  '[Location] Setted current location',
  props<SavedLocationPoint>()
);

export const getCurrentLocationAction = createAction(
  '[Location] Get current location'
);
