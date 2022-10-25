import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { MaterialModule } from './material.module';
import { AddSavedLocationDialogComponent } from './main/add-saved-location-dialog/add-saved-location-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocationService } from './core/services/location.service';
import { ActualWeatherComponent } from './main/actual-weather/actual-weather.component';
import { HoursWeatherComponent } from './main/hours-weather/hours-weather.component';
import { DaysWeatherComponent } from './main/days-weather/days-weather.component';
import { MomentModule } from 'ngx-moment';
import { WeatherLayoutComponent } from './main/weather-layout/weather-layout.component';
import { DebugPanelComponent } from './main/debug-panel/debug-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AddSavedLocationDialogComponent,
    ActualWeatherComponent,
    HoursWeatherComponent,
    DaysWeatherComponent,
    WeatherLayoutComponent,
    DebugPanelComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    GoogleMapsModule,
    MomentModule,
  ],
  providers: [Geolocation, LocationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
