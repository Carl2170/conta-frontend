export interface Customer {
  id: number
  code: string
  name: string
  documentType?: string
  documentNumber?: string
  email?: string
  phone?: string
  address?: string
  accountingAccount?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalPendingAmount: string
}

export interface CustomerInput {
  code?: string
  name: string
  documentType?: string
  documentNumber?: string
  email?: string
  phone?: string
  address?: string
  accountingAccountId?: number
  isActive?: boolean
}
