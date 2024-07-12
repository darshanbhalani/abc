import { TestBed } from '@angular/core/testing';

import { AqiserviceService } from './aqiservice.service';

describe('AqiserviceService', () => {
  let service: AqiserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AqiserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
