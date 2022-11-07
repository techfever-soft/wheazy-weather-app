import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { ActualWeatherComponent } from './main/actual-weather/actual-weather.component';
import { AddSavedLocationDialogComponent } from './main/add-saved-location-dialog/add-saved-location-dialog.component';
import { DaysWeatherComponent } from './main/days-weather/days-weather.component';
import { DebugPanelComponent } from './main/debug-panel/debug-panel.component';
import { HoursWeatherComponent } from './main/hours-weather/hours-weather.component';
import { WeatherLayoutComponent } from './main/weather-layout/weather-layout.component';
import { MaterialModule } from '../material.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MomentModule } from 'ngx-moment';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AirQualityComponent } from './main/air-quality/air-quality.component';

@NgModule({
  declarations: [
    AboutComponent,
    MainComponent,
    SettingsComponent,
    // Components
    ActualWeatherComponent,
    AddSavedLocationDialogComponent,
    DebugPanelComponent,
    HoursWeatherComponent,
    WeatherLayoutComponent,
    DaysWeatherComponent,
    AirQualityComponent,
  ],
  exports: [
    AboutComponent,
    MainComponent,
    SettingsComponent,
    // Components
    ActualWeatherComponent,
    AddSavedLocationDialogComponent,
    DebugPanelComponent,
    HoursWeatherComponent,
    WeatherLayoutComponent,
    DaysWeatherComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    MomentModule,
    GoogleMapsModule,
  ],
})
export class PagesModule {}
