import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JournalEntryDetail } from '../models/journal-entry-detail.model';

@Injectable({ providedIn: 'root' })
export class JournalEntryDetailService {
  constructor(private apollo: Apollo) {}

  getByEntryId(journalEntryId: number): Observable<JournalEntryDetail[]> {
    return this.apollo
      .watchQuery<{ journalEntryDetails: JournalEntryDetail[] }>({
        query: gql`
          query GetDetails($journalEntryId: Int!) {
            journalEntryDetails(journalEntryId: $journalEntryId) {
              id
              journalEntryId
              accountId
              description
              debitAmount
              creditAmount
              createdAt
            }
          }
        `,
        variables: { journalEntryId },
      })
      .valueChanges.pipe(map((result) => result.data.journalEntryDetails));
  }

  create(detail: JournalEntryDetail): Observable<JournalEntryDetail> {
    return this.apollo
      .mutate<{ createJournalEntryDetail: JournalEntryDetail }>({
        mutation: gql`
          mutation CreateDetail($input: JournalEntryDetailInput!) {
            createJournalEntryDetail(input: $input) {
              id
              journalEntryId
              accountId
              description
              debitAmount
              creditAmount
              createdAt
            }
          }
        `,
        variables: { input: detail },
      })
      .pipe(map((result) => result.data!.createJournalEntryDetail));
  }

  update(id: number, detail: JournalEntryDetail): Observable<JournalEntryDetail> {
    return this.apollo
      .mutate<{ updateJournalEntryDetail: JournalEntryDetail }>({
        mutation: gql`
          mutation UpdateDetail($id: Int!, $input: JournalEntryDetailInput!) {
            updateJournalEntryDetail(id: $id, input: $input) {
              id
              journalEntryId
              accountId
              description
              debitAmount
              creditAmount
              createdAt
            }
          }
        `,
        variables: { id, input: detail },
      })
      .pipe(map((result) => result.data!.updateJournalEntryDetail));
  }

  delete(id: number): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteJournalEntryDetail: boolean }>({
        mutation: gql`
          mutation DeleteDetail($id: Int!) {
            deleteJournalEntryDetail(id: $id)
          }
        `,
        variables: { id },
      })
      .pipe(map((result) => result.data!.deleteJournalEntryDetail));
  }
}
