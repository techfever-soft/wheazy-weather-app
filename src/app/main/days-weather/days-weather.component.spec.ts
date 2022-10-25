import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysWeatherComponent } from './days-weather.component';

describe('DaysWeatherComponent', () => {
  let component: DaysWeatherComponent;
  let fixture: ComponentFixture<DaysWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaysWeatherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
