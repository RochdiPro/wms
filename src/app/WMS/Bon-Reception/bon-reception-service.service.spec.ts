import { TestBed } from '@angular/core/testing';

import { BonReceptionServiceService } from './bon-reception-service.service';

describe('BonReceptionServiceService', () => {
  let service: BonReceptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonReceptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
