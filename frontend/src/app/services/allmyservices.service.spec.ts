import { TestBed } from '@angular/core/testing';

import { AllmyservicesService } from './allmyservices.service';

describe('AllmyservicesService', () => {
  let service: AllmyservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllmyservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
