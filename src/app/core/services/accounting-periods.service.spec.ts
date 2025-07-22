import { TestBed } from '@angular/core/testing';

import { AccountingPeriodsService } from './accounting-periods.service';

describe('AccountingPeriodsService', () => {
  let service: AccountingPeriodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingPeriodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
