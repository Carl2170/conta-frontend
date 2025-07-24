import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { CustomerInput } from "../models/customers/customer.model"

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private readonly graphqlUrl = "http://localhost:8080/graphql"

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<any> {
    const query = `
      query {
        customers {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          address
          isActive
          createdAt
          updatedAt
          totalPendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, { query })
  }

  getCustomerById(id: number): Observable<any> {
    const query = `
      query GetCustomer($id: ID!) {
        customer(id: $id) {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          address
          isActive
          createdAt
          updatedAt
          totalPendingAmount
          accountingAccount {
            id
            code
            name
          }
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { id: id.toString() },
    })
  }

  getActiveCustomers(): Observable<any> {
    const query = `
      query {
        activeCustomers {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          address
          totalPendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, { query })
  }

  searchCustomers(searchTerm: string): Observable<any> {
    const query = `
      query SearchCustomers($searchTerm: String!) {
        searchCustomers(searchTerm: $searchTerm) {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          totalPendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { searchTerm },
    })
  }

  createCustomer(input: CustomerInput): Observable<any> {
    const mutation = `
      mutation CreateCustomer($input: CustomerInput!) {
        createCustomer(input: $input) {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          address
          isActive
          createdAt
          updatedAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { input },
    })
  }

  updateCustomer(id: number, input: CustomerInput): Observable<any> {
    const mutation = `
      mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
        updateCustomer(id: $id, input: $input) {
          id
          code
          name
          documentType
          documentNumber
          email
          phone
          address
          isActive
          updatedAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString(), input },
    })
  }

  deleteCustomer(id: number): Observable<any> {
    const mutation = `
      mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id)
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString() },
    })
  }
}
