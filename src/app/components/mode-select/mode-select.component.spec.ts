import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModeSelectComponent } from './mode-select.component';

describe('ModeSelectComponent', () => {
  let component: ModeSelectComponent;
  let fixture: ComponentFixture<ModeSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
