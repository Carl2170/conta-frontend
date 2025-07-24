import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { CustomerPaymentInput } from "../models/customers/customer-payment.model"
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class CustomerPaymentService {
  private readonly graphqlUrl = environment.graphqlEndpoint;

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<any> {
    const query = `
      query {
        customerPayments {
          id
          paymentNumber
          customer {
            id
            code
            name
          }
          customerInvoice {
            id
            invoiceNumber
          }
          paymentDate
          amount
          paymentMethod
          reference
          createdAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, { query })
  }

  getPaymentById(id: number): Observable<any> {
    const query = `
      query GetPayment($id: ID!) {
        customerPayment(id: $id) {
          id
          paymentNumber
          customer {
            id
            code
            name
          }
          customerInvoice {
            id
            invoiceNumber
            totalAmount
          }
          accountingPeriod {
            id
            name
          }
          paymentDate
          amount
          paymentMethod
          bankAccountId
          reference
          createdAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { id: id.toString() },
    })
  }

  getPaymentsByCustomer(customerId: number): Observable<any> {
    const query = `
      query GetPaymentsByCustomer($customerId: ID!) {
        customerPaymentsByCustomer(customerId: $customerId) {
          id
          paymentNumber
          customerInvoice {
            id
            invoiceNumber
          }
          paymentDate
          amount
          paymentMethod
          reference
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { customerId: customerId.toString() },
    })
  }

  getPaymentsByInvoice(invoiceId: number): Observable<any> {
    const query = `
      query GetPaymentsByInvoice($invoiceId: ID!) {
        customerPaymentsByInvoice(invoiceId: $invoiceId) {
          id
          paymentNumber
          paymentDate
          amount
          paymentMethod
          reference
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { invoiceId: invoiceId.toString() },
    })
  }

  createPayment(input: CustomerPaymentInput): Observable<any> {
    const mutation = `
      mutation CreatePayment($input: CustomerPaymentInput!) {
        createCustomerPayment(input: $input) {
          id
          paymentNumber
          customer {
            id
            name
          }
          customerInvoice {
            id
            invoiceNumber
          }
          paymentDate
          amount
          paymentMethod
          reference
          createdAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { input },
    })
  }

  updatePayment(id: number, input: CustomerPaymentInput): Observable<any> {
    const mutation = `
      mutation UpdatePayment($id: ID!, $input: CustomerPaymentInput!) {
        updateCustomerPayment(id: $id, input: $input) {
          id
          paymentNumber
          paymentDate
          amount
          paymentMethod
          reference
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString(), input },
    })
  }

  deletePayment(id: number): Observable<any> {
    const mutation = `
      mutation DeletePayment($id: ID!) {
        deleteCustomerPayment(id: $id)
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString() },
    })
  }
}
