import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AirQuality } from 'src/app/core/interfaces/weather.interface';

@Component({
  selector: 'app-air-quality',
  templateUrl: './air-quality.component.html',
  styleUrls: ['./air-quality.component.scss'],
})
export class AirQualityComponent implements OnInit {
  @Input('currentAirQuality') currentAirQuality?: Observable<AirQuality>;
  @Input('isLoading') isLoading?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
