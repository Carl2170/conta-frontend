export interface JournalEntryDetail {
  id?: number;
  journalEntryId: number;
  accountId: number;
  description?: string;
  debitAmount?: number;
  creditAmount?: number;
  createdAt?: string;
}