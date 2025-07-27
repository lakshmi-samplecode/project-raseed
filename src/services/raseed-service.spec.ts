import { TestBed } from '@angular/core/testing';

import { RaseedService } from './raseed-service';

describe('RaseedService', () => {
  let service: RaseedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaseedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
