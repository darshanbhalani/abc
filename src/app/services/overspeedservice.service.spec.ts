import { TestBed } from '@angular/core/testing';

import { OverspeedserviceService } from './overspeedservice.service';

describe('OverspeedserviceService', () => {
  let service: OverspeedserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverspeedserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
