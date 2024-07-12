import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverspeedComponent } from './overspeed.component';

describe('OverspeedComponent', () => {
  let component: OverspeedComponent;
  let fixture: ComponentFixture<OverspeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverspeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverspeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
