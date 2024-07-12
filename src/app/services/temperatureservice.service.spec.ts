import { TestBed } from '@angular/core/testing';

import { TemperatureserviceService } from './temperatureservice.service';

describe('TemperatureserviceService', () => {
  let service: TemperatureserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemperatureserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
