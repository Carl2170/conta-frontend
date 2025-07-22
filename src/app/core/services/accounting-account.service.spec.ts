import { TestBed } from '@angular/core/testing';

import { AccountingAccountService } from './accounting-account.service';

describe('AccountingAccountService', () => {
  let service: AccountingAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
