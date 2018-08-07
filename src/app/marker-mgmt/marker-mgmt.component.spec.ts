import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerMgmtComponent } from './marker-mgmt.component';

describe('MarkerMgmtComponent', () => {
  let component: MarkerMgmtComponent;
  let fixture: ComponentFixture<MarkerMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
