import { Injectable } from '@angular/core';
import { GraphQLClient, gql } from 'graphql-request';
import { Observable } from 'rxjs';
import { ChartOfAccount } from '../models/chart-of-account.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(environment.graphqlEndpoint);
  }

  async getAll(): Promise<ChartOfAccount[]> {
    const query = gql`
      query {
        chartOfAccounts {
          id
          name
          description
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.client.request<{ chartOfAccounts: ChartOfAccount[] }>(query);
    return data.chartOfAccounts;
  }

  async getById(id: string): Promise<ChartOfAccount> {
    const query = gql`
      query ($id: ID!) {
        chartOfAccount(id: $id) {
          id
          name
          description
          isDefault
          createdAt
          updatedAt
          accounts {
            id
            name
            code
          }
        }
      }
    `;

    const data = await this.client.request<{ chartOfAccount: ChartOfAccount }>(query, { id });
    return data.chartOfAccount;
  }

  async create(input: {
    name: string;
    description?: string;
    isDefault?: boolean;
  }): Promise<ChartOfAccount> {
    const mutation = gql`
      mutation ($input: ChartOfAccountInput!) {
        createChartOfAccount(input: $input) {
          id
          name
          description
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.client.request<{ createChartOfAccount: ChartOfAccount }>(mutation, { input });
    return data.createChartOfAccount;
  }

  async update(id: number, input: {
    name: string;
    description?: string;
    isDefault?: boolean;
  }): Promise<ChartOfAccount> {
    const mutation = gql`
      mutation ($id: ID!, $input: ChartOfAccountInput!) {
        updateChartOfAccount(id: $id, input: $input) {
          id
          name
          description
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.client.request<{ updateChartOfAccount: ChartOfAccount }>(mutation, { id, input });
    return data.updateChartOfAccount;
  }

  async delete(id: number): Promise<boolean> {
    const mutation = gql`
      mutation ($id: ID!) {
        deleteChartOfAccount(id: $id)
      }
    `;

    const data = await this.client.request<{ deleteChartOfAccount: boolean }>(mutation, { id });
    return data.deleteChartOfAccount;
  }

  async getDefault(): Promise<ChartOfAccount> {
    const query = gql`
      query {
        defaultChartOfAccount {
          id
          name
          description
          isDefault
          createdAt
          updatedAt
        }
      }
    `;

    const data = await this.client.request<{ defaultChartOfAccount: ChartOfAccount }>(query);
    return data.defaultChartOfAccount;
  }
}