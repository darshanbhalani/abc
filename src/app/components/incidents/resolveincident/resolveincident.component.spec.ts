import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveincidentComponent } from './resolveincident.component';

describe('ResolveincidentComponent', () => {
  let component: ResolveincidentComponent;
  let fixture: ComponentFixture<ResolveincidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveincidentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolveincidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
