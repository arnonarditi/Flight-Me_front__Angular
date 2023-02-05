import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPreviewComponent } from './flight-preview.component';

describe('FlightPreviewComponent', () => {
  let component: FlightPreviewComponent;
  let fixture: ComponentFixture<FlightPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
