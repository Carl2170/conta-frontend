import { TestBed } from '@angular/core/testing';

import { AccountNatureService } from './account-nature.service';

describe('AccountNatureService', () => {
  let service: AccountNatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountNatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
