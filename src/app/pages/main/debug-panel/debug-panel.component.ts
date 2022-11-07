import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-debug-panel',
  templateUrl: './debug-panel.component.html',
  styleUrls: ['./debug-panel.component.scss'],
})
export class DebugPanelComponent implements OnInit {
  public dayTimeInput: string = '';
  public seasonInput: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.seasonInput = moment().locale('fr').format('MMMM');
    this.dayTimeInput = moment().locale('fr').format('HH[:00]');
  }

  public get dayTimeAsNumber(): Observable<number> {
    return this.weatherService.getCurrentDayTimeAsNumber();
  }

  public get seasonAsNumber(): Observable<number> {
    return this.weatherService.getCurrentSeasonAsNumber();
  }

  public get currentDayTime(): Observable<string> {
    return this.weatherService.getCurrentDayTime();
  }

  public get currentSeason(): Observable<string> {
    return this.weatherService.getCurrentSeason();
  }

  public timeChanged(number: number | null) {
    if (number) {
      this.weatherService.currentDayTime = number;
      this.dayTimeInput = moment().hours(number ).locale('fr').format('HH[:00]');
    }
  }

  public seasonChanged(number: number | null) {
    if (number) {
      this.weatherService.currentSeason = number;
      this.seasonInput = moment().month(number - 1).locale('fr').format('MMMM');
    }
  }

  public resetDayTime() {
    this.weatherService.setActualDayTime();
    this.dayTimeInput = moment().locale('fr').format('HH[:00]');
  }

  public resetSeason() {
    this.weatherService.setActualSeason();
    this.seasonInput = moment().locale('fr').format('MMMM');
  }
}
