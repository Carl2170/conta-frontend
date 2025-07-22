import { AccountingAccount } from './accounting-account.model';
import { AccountingPeriod } from './accounting-period.model';

export interface JournalEntry {
  id: number;
  accountingPeriod: AccountingPeriod;
  entryDate: string;
  description?: string;
  sourceDocumentId?: string;
  sourceDocumentType?: string;
  status: JournalEntryStatus;
  userId?: string;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
  details: JournalEntryDetail[];
  totalDebits: string;
  totalCredits: string;
  isBalanced: boolean;
}

export interface JournalEntryInput {
  accountingPeriodId: number;
  entryDate: string;
  description?: string;
  sourceDocumentId?: string;
  sourceDocumentType?: string;
  userId?: string;
  details: JournalEntryDetailInput[];
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}

export interface JournalEntryDetail {
  id: number;
  journalEntry: JournalEntry;
  account: AccountingAccount;
  description?: string;
  debitAmount: string;
  creditAmount: string;
  createdAt: string;
}

export interface JournalEntryDetailInput {
  journalEntryId?: number;
  accountId: string;
  description?: string;
  debitAmount: string;
  creditAmount: string;
}
