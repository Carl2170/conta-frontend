import type { InvoiceStatus } from "./invoice-status.enum"

export interface CustomerInvoice {
  id: number
  invoiceNumber: string
  customer: any
  accountingPeriod: any
  invoiceDate: string
  dueDate?: string
  subtotal: string
  taxAmount: string
  totalAmount: string
  status: InvoiceStatus
  journalEntry?: any
  createdAt: string
  updatedAt: string
  details: CustomerInvoiceDetail[]
  paidAmount: string
  pendingAmount: string
}

export interface CustomerInvoiceDetail {
  id: number
  description: string
  quantity: string
  unitPrice: string
  totalAmount: string
}

export interface CustomerInvoiceInput {
  invoiceNumber?: string
  customerId: number
  accountingPeriodId: number
  invoiceDate: string
  dueDate?: string
  taxAmount?: string
  details: CustomerInvoiceDetailInput[]
}

export interface CustomerInvoiceDetailInput {
  description: string
  quantity: string
  unitPrice: string
}
