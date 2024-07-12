import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularCounterComponent } from './circular-counter.component';

describe('CircularCounterComponent', () => {
  let component: CircularCounterComponent;
  let fixture: ComponentFixture<CircularCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularCounterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircularCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
