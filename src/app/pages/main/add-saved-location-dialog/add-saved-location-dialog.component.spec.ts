import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSavedLocationDialogComponent } from './add-saved-location-dialog.component';

describe('AddSavedLocationDialogComponent', () => {
  let component: AddSavedLocationDialogComponent;
  let fixture: ComponentFixture<AddSavedLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSavedLocationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSavedLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
