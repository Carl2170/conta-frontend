import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GraphQLClient, gql } from 'graphql-request';
import { AccountingAccount } from '../models/accounting-account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountingAccountService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(environment.graphqlEndpoint);
  }

    // 1. Obtener todas las cuentas
  getAllAccounts(): Promise<AccountingAccount[]> {
    const query = gql`
      query {
        accountingAccounts {
          id
          code
          name
          description
          level
          isActive
          isTransactional
          createdAt
          updatedAt
          accountNature {
            id
            name
            defaultBalanceType
          }
          chartOfAccount {
            id
            name
          }
          parentAccount {
            id
            name
          }
          childAccounts {
            id
            name
          }
        }
      }
    `;
    return this.client
      .request<{ accountingAccounts: AccountingAccount[] }>(query)
      .then(res => res.accountingAccounts);
  }

  // 2. Obtener cuenta por ID
  getAccountById(id: string): Promise<AccountingAccount> {
    const query = gql`
      query ($id: ID!) {
        accountingAccount(id: $id) {
          id
          code
          name
          description
          level
          isActive
          isTransactional
          createdAt
          updatedAt
          accountNature {
            id
            name
            defaultBalanceType
          }
          chartOfAccount {
            id
            name
          }
          parentAccount {
            id
            name
          }
          childAccounts {
            id
            name
          }
        }
      }
    `;
    return this.client
      .request<{ accountingAccount: AccountingAccount }>(query, { id })
      .then(res => res.accountingAccount);
  }

  // 3. Crear nueva cuenta
  createAccountingAccount(input: {
    accountNatureId: string;
    chartOfAccountId: string;
    parentAccountId?: string;
    code: string;
    name: string;
    description?: string;
    level: number;
    isActive?: boolean;
    isTransactional?: boolean;
  }): Promise<AccountingAccount> {
    const mutation = gql`
      mutation ($input: AccountingAccountInput!) {
        createAccountingAccount(input: $input) {
          id
          code
          name
          isActive
        }
      }
    `;
    return this.client
      .request<{ createAccountingAccount: AccountingAccount }>(mutation, { input })
      .then(res => res.createAccountingAccount);
  }

  // 4. Actualizar cuenta
  updateAccountingAccount(id: string, input: {
    accountNatureId: string;
    chartOfAccountId: string;
    parentAccountId?: string;
    code: string;
    name: string;
    description?: string;
    level: number;
    isActive?: boolean;
    isTransactional?: boolean;
  }): Promise<AccountingAccount> {
    const mutation = gql`
      mutation ($id: ID!, $input: AccountingAccountInput!) {
        updateAccountingAccount(id: $id, input: $input) {
          id
          code
          name
          isActive
        }
      }
    `;
    return this.client
      .request<{ updateAccountingAccount: AccountingAccount }>(mutation, { id, input })
      .then(res => res.updateAccountingAccount);
  }

  // 5. Eliminar cuenta
  deleteAccountingAccount(id: string): Promise<boolean> {
    const mutation = gql`
      mutation ($id: ID!) {
        deleteAccountingAccount(id: $id)
      }
    `;
    return this.client
      .request<{ deleteAccountingAccount: boolean }>(mutation, { id })
      .then(res => res.deleteAccountingAccount);
  }

  // 6. Obtener por plan contable
  getAccountsByChartOfAccount(chartOfAccountId: string): Promise<AccountingAccount[]> {
    const query = gql`
      query ($chartOfAccountId: ID!) {
        accountingAccountsByChartOfAccount(chartOfAccountId: $chartOfAccountId) {
          id
          code
          name
          level
          isActive
          chartOfAccount { id name }
        }
      }
    `;
    return this.client
      .request<{ accountingAccountsByChartOfAccount: AccountingAccount[] }>(query, { chartOfAccountId })
      .then(res => res.accountingAccountsByChartOfAccount);
  }

  // 7. Obtener por cuenta padre
  getAccountsByParent(parentId: string): Promise<AccountingAccount[]> {
    const query = gql`
      query ($parentId: ID!) {
        accountingAccountsByParent(parentId: $parentId) {
          id
          code
          name
          level
          isActive
        }
      }
    `;
    return this.client
      .request<{ accountingAccountsByParent: AccountingAccount[] }>(query, { parentId })
      .then(res => res.accountingAccountsByParent);
  }
}
