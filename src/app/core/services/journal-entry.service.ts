import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GraphQLClient, gql } from 'graphql-request';
import {
  JournalEntry,
  JournalEntryInput,
  JournalEntryDetail,
  JournalEntryDetailInput,
} from '../models/journal-entry.model';

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  private graphQLClient: GraphQLClient;

  constructor() {
    this.graphQLClient = new GraphQLClient(environment.graphqlEndpoint);
  }

  async getAll(): Promise<JournalEntry[]> {
    const query = gql`
      query {
        journalEntries {
          id
          entryDate
          description
          status
          totalDebits
          totalCredits
          isBalanced
          createdAt
          updatedAt
          accountingPeriod {
            id
            name
          }
          details {
            id
            account {
              id
              name
            }
            description
            debitAmount
            creditAmount
          }
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      journalEntries: JournalEntry[];
    }>(query);
    return data.journalEntries;
  }

  async getById(id: string): Promise<JournalEntry> {
    const query = gql`
      query GetJournalEntry($id: ID!) {
        journalEntry(id: $id) {
          id
          entryDate
          description
          status
          totalDebits
          totalCredits
          isBalanced
          createdAt
          updatedAt
          details {
            id
            account {
              id
              name
            }
            description
            debitAmount
            creditAmount
          }
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      journalEntry: JournalEntry;
    }>(query, { id });
    return data.journalEntry;
  }

  async create(input: JournalEntryInput): Promise<JournalEntry> {
    const mutation = gql`
      mutation CreateJournalEntry($input: JournalEntryInput!) {
        createJournalEntry(input: $input) {
          id
          entryDate
          description
          status
          totalDebits
          totalCredits
          isBalanced
          createdAt
          updatedAt
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      createJournalEntry: JournalEntry;
    }>(mutation, { input });
    return data.createJournalEntry;
  }

  async update(id: number, input: JournalEntryInput): Promise<JournalEntry> {
    const mutation = gql`
      mutation UpdateJournalEntry($id: ID!, $input: JournalEntryInput!) {
        updateJournalEntry(id: $id, input: $input) {
          id
          entryDate
          description
          status
          totalDebits
          totalCredits
          isBalanced
          createdAt
          updatedAt
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      updateJournalEntry: JournalEntry;
    }>(mutation, { id, input });
    return data.updateJournalEntry;
  }

  async delete(id: number): Promise<boolean> {
    const mutation = gql`
      mutation DeleteJournalEntry($id: ID!) {
        deleteJournalEntry(id: $id)
      }
    `;
    const data = await this.graphQLClient.request<{
      deleteJournalEntry: boolean;
    }>(mutation, { id });
    return data.deleteJournalEntry;
  }

  // Métodos para gestionar JournalEntryDetail
  async createDetail(
    input: JournalEntryDetailInput
  ): Promise<JournalEntryDetail> {
    const mutation = gql`
      mutation CreateJournalEntryDetail($input: JournalEntryDetailInput!) {
        createJournalEntryDetail(input: $input) {
          id
          account {
            id
            name
          }
          description
          debitAmount
          creditAmount
          createdAt
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      createJournalEntryDetail: JournalEntryDetail;
    }>(mutation, { input });
    return data.createJournalEntryDetail;
  }

  async updateDetail(
    id: string,
    input: JournalEntryDetailInput
  ): Promise<JournalEntryDetail> {
    const mutation = gql`
      mutation UpdateJournalEntryDetail(
        $id: ID!
        $input: JournalEntryDetailInput!
      ) {
        updateJournalEntryDetail(id: $id, input: $input) {
          id
          account {
            id
            name
          }
          description
          debitAmount
          creditAmount
          createdAt
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      updateJournalEntryDetail: JournalEntryDetail;
    }>(mutation, { id, input });
    return data.updateJournalEntryDetail;
  }

  async deleteDetail(id: string): Promise<boolean> {
    const mutation = gql`
      mutation DeleteJournalEntryDetail($id: ID!) {
        deleteJournalEntryDetail(id: $id)
      }
    `;
    const data = await this.graphQLClient.request<{
      deleteJournalEntryDetail: boolean;
    }>(mutation, { id });
    return data.deleteJournalEntryDetail;
  }
}
