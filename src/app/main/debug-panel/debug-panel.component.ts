import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-debug-panel',
  templateUrl: './debug-panel.component.html',
  styleUrls: ['./debug-panel.component.scss'],
})
export class DebugPanelComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

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
    }
  }

  public seasonChanged(number: number | null) {
    if (number) {
      this.weatherService.currentSeason = number;
    }
  }

  public resetDayTime() {
    this.weatherService.setActualDayTime();
  }

  public resetSeason() {
    this.weatherService.setActualSeason();
  }
}
