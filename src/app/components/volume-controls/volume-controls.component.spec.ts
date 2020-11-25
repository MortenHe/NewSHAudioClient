import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VolumeControlsComponent } from './volume-controls.component';

describe('VolumeControlsComponent', () => {
  let component: VolumeControlsComponent;
  let fixture: ComponentFixture<VolumeControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
