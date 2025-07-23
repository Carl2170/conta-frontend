import { Injectable } from '@angular/core';
import { GraphQLClient, gql } from 'graphql-request';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AccountNature {
  id: number;
  name: string;
  defaultBalanceType: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountNatureService {
  // private endpoint = 'http://localhost:8002/graphql';
  private endpoint = environment.graphqlEndpoint;
  private client = new GraphQLClient(this.endpoint);

  private GET_ALL_ACCOUNT_NATURES = gql`
    query GetAllAccountNatures {
      accountNatures {
        id
        name
        defaultBalanceType
      }
    }
  `;

  private CREATE_ACCOUNT_NATURE = gql`
    mutation CreateAccountNature($input: AccountNatureInput!) {
      createAccountNature(input: $input) {
        id
        name
        defaultBalanceType
      }
    }
  `;
  private DELETE_ACCOUNT_NATURE = gql`
    mutation DeleteAccountNature($id: ID!) {
      deleteAccountNature(id: $id)
    }
  `;

private UPDATE_ACCOUNT_NATURE = gql`
  mutation UpdateAccountNature($id: ID!, $input: AccountNatureInput!) {
    updateAccountNature(id: $id, input: $input) {
      id
      name
      defaultBalanceType
    }
  }
`;

  constructor() {}

  getAllAccountNatures(): Observable<AccountNature[]> {
    return from(
      this.client
        .request<{ accountNatures: AccountNature[] }>(
          this.GET_ALL_ACCOUNT_NATURES
        )
        .then((data) => data.accountNatures)
    );
  }

  createAccountNature(input: {
    name: string;
    defaultBalanceType: string;
  }): Observable<AccountNature> {
    return from(
      this.client
        .request<{ createAccountNature: AccountNature }>(
          this.CREATE_ACCOUNT_NATURE,
          { input }
        )
        .then((data) => data.createAccountNature)
    );
  }

  deleteAccountNature(id: number): Observable<boolean> {
    return from(
      this.client
        .request<{ deleteAccountNature: boolean }>(this.DELETE_ACCOUNT_NATURE, {
          id,
        })
        .then((data) => data.deleteAccountNature)
    );
  }

updateAccountNature(id: number, input: { name: string; defaultBalanceType: string }): Observable<AccountNature> {
  return from(
    this.client.request<{ updateAccountNature: AccountNature }>(this.UPDATE_ACCOUNT_NATURE, {
      id,
      input
    }).then(res => res.updateAccountNature)
  );
}
}
