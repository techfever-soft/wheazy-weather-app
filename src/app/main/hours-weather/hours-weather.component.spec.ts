import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursWeatherComponent } from './hours-weather.component';

describe('HoursWeatherComponent', () => {
  let component: HoursWeatherComponent;
  let fixture: ComponentFixture<HoursWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursWeatherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
