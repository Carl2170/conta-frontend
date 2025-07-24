import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { CustomerInvoiceInput } from "../models/customers/customer-invoice.model"
import { InvoiceStatus } from "../models/customers/invoice-status.enum"
@Injectable({
  providedIn: "root",
})
export class CustomerInvoiceService {
  private readonly graphqlUrl = "http://localhost:8080/graphql"

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<any> {
    const query = `
      query {
        customerInvoices {
          id
          invoiceNumber
          customer {
            id
            code
            name
          }
          invoiceDate
          dueDate
          subtotal
          taxAmount
          totalAmount
          status
          paidAmount
          pendingAmount
          createdAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, { query })
  }

  getInvoiceById(id: number): Observable<any> {
    const query = `
      query GetInvoice($id: ID!) {
        customerInvoice(id: $id) {
          id
          invoiceNumber
          customer {
            id
            code
            name
            email
            phone
          }
          accountingPeriod {
            id
            name
          }
          invoiceDate
          dueDate
          subtotal
          taxAmount
          totalAmount
          status
          paidAmount
          pendingAmount
          createdAt
          details {
            id
            description
            quantity
            unitPrice
            totalAmount
          }
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { id: id.toString() },
    })
  }

  getInvoicesByCustomer(customerId: number): Observable<any> {
    const query = `
      query GetInvoicesByCustomer($customerId: ID!) {
        customerInvoicesByCustomer(customerId: $customerId) {
          id
          invoiceNumber
          invoiceDate
          dueDate
          totalAmount
          status
          paidAmount
          pendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { customerId: customerId.toString() },
    })
  }

  getInvoicesByStatus(status: InvoiceStatus): Observable<any> {
    const query = `
      query GetInvoicesByStatus($status: InvoiceStatus!) {
        customerInvoicesByStatus(status: $status) {
          id
          invoiceNumber
          customer {
            id
            name
          }
          invoiceDate
          dueDate
          totalAmount
          paidAmount
          pendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query,
      variables: { status },
    })
  }

  getOverdueInvoices(): Observable<any> {
    const query = `
      query {
        overdueInvoices {
          id
          invoiceNumber
          customer {
            id
            name
            phone
            email
          }
          invoiceDate
          dueDate
          totalAmount
          pendingAmount
        }
      }
    `

    return this.http.post(this.graphqlUrl, { query })
  }

  createInvoice(input: CustomerInvoiceInput): Observable<any> {
    const mutation = `
      mutation CreateInvoice($input: CustomerInvoiceInput!) {
        createCustomerInvoice(input: $input) {
          id
          invoiceNumber
          customer {
            id
            name
          }
          invoiceDate
          dueDate
          subtotal
          taxAmount
          totalAmount
          status
          createdAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { input },
    })
  }

  updateInvoice(id: number, input: CustomerInvoiceInput): Observable<any> {
    const mutation = `
      mutation UpdateInvoice($id: ID!, $input: CustomerInvoiceInput!) {
        updateCustomerInvoice(id: $id, input: $input) {
          id
          invoiceNumber
          invoiceDate
          dueDate
          subtotal
          taxAmount
          totalAmount
          status
          updatedAt
        }
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString(), input },
    })
  }

  deleteInvoice(id: number): Observable<any> {
    const mutation = `
      mutation DeleteInvoice($id: ID!) {
        deleteCustomerInvoice(id: $id)
      }
    `

    return this.http.post(this.graphqlUrl, {
      query: mutation,
      variables: { id: id.toString() },
    })
  }
}
