import { TestBed } from '@angular/core/testing';

import { JournalEntryDetailService } from './journal-entry-detail.service';

describe('JournalEntryDetailService', () => {
  let service: JournalEntryDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalEntryDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
