import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PiControlsComponent } from './pi-controls.component';

describe('PiControlsComponent', () => {
  let component: PiControlsComponent;
  let fixture: ComponentFixture<PiControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PiControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
