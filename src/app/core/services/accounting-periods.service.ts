import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GraphQLClient, gql } from 'graphql-request';
import {
  AccountingPeriod,
  AccountingPeriodInput,
} from '../models/accounting-period.model';

@Injectable({
  providedIn: 'root',
})
export class AccountingPeriodsService {
  private graphQLClient: GraphQLClient;

  constructor() {
    this.graphQLClient = new GraphQLClient(environment.graphqlEndpoint);
  }

  async getAll(): Promise<AccountingPeriod[]> {
    const query = gql`
      query {
        accountingPeriods {
          id
          name
          startDate
          endDate
          status
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      accountingPeriods: AccountingPeriod[];
    }>(query);
    return data.accountingPeriods;
  }

  async create(input: AccountingPeriodInput): Promise<AccountingPeriod> {
    const mutation = gql`
      mutation CreateAccountingPeriod($input: AccountingPeriodInput!) {
        createAccountingPeriod(input: $input) {
          id
          name
          startDate
          endDate
          status
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      createAccountingPeriod: AccountingPeriod;
    }>(mutation, { input });
    return data.createAccountingPeriod;
  }

  async update(
    id: number,
    input: AccountingPeriodInput
  ): Promise<AccountingPeriod> {
    const mutation = gql`
      mutation UpdateAccountingPeriod(
        $id: ID!
        $input: AccountingPeriodInput!
      ) {
        updateAccountingPeriod(id: $id, input: $input) {
          id
          name
          startDate
          endDate
          status
        }
      }
    `;
    const data = await this.graphQLClient.request<{
      updateAccountingPeriod: AccountingPeriod;
    }>(mutation, { id, input });
    return data.updateAccountingPeriod;
  }

  async delete(id: number): Promise<boolean> {
    const mutation = gql`
      mutation DeleteAccountingPeriod($id: ID!) {
        deleteAccountingPeriod(id: $id)
      }
    `;
    const data = await this.graphQLClient.request<{
      deleteAccountingPeriod: boolean;
    }>(mutation, { id });
    return data.deleteAccountingPeriod;
  }
}

