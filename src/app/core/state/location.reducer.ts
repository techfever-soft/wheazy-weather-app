import { createReducer, on } from '@ngrx/store';
import {
  addSavedLocationAction,
  getCurrentLocationAction,
  getSavedLocationsAction,
  setCurrentLocationAction,
  moveSavedLocationsAction,
  setSelectedSavedLocationAction,
  deleteSavedLocationAction,
} from './location.action';
import { SavedLocationPoint } from '../interfaces/location.interface';
import { moveItemInArray } from '@angular/cdk/drag-drop';

const savedLocationsState: SavedLocationPoint[] = [];

export const currentLocationReducer = createReducer(
  {},
  on(setCurrentLocationAction, (state: {}, action) => {
    action.selected = true;
    return action;
  }),
  on(getCurrentLocationAction, (state: {}, action) => {
    return state;
  })
);

export const savedLocationsReducer = createReducer(
  savedLocationsState,
  on(addSavedLocationAction, (state: SavedLocationPoint[], action) => {
    state.push(action);
    return state;
  }),
  on(setSelectedSavedLocationAction, (state: SavedLocationPoint[], action) => {
    state.forEach((loc, index) => {
      state[index].selected = false;
      if (loc.position.lat === action.position.lat) {
        state[index].selected = true;
      }
    });
    return state;
  }),
  on(moveSavedLocationsAction, (state: SavedLocationPoint[], action) => {
    moveItemInArray(state, action.previousIndex, action.currentIndex);
    return state;
  }),
  on(
    deleteSavedLocationAction,
    (state: SavedLocationPoint[], action: number) => {
      state.splice(action, 1);
      return state;
    }
  ),
  on(getSavedLocationsAction, (state: SavedLocationPoint[], action) => {
    return state;
  })
);
