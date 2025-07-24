import type { PaymentMethod } from "./payment-method.enum"

export interface CustomerPayment {
  id: number
  paymentNumber: string
  customer: any
  customerInvoice?: any
  accountingPeriod: any
  paymentDate: string
  amount: string
  paymentMethod: PaymentMethod
  bankAccountId?: number
  reference?: string
  journalEntry?: any
  createdAt: string
}

export interface CustomerPaymentInput {
  paymentNumber?: string
  customerId: number
  customerInvoiceId?: number
  accountingPeriodId: number
  paymentDate: string
  amount: string
  paymentMethod: PaymentMethod
  bankAccountId?: number
  reference?: string
}
