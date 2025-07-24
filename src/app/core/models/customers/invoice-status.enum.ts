export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  OVERDUE = "OVERDUE",
}

export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PENDING]: "Pendiente",
  [InvoiceStatus.PAID]: "Pagada",
  [InvoiceStatus.CANCELLED]: "Cancelada",
  [InvoiceStatus.OVERDUE]: "Vencida",
}

export const InvoiceStatusOptions = [
  { value: InvoiceStatus.PENDING, label: InvoiceStatusLabels[InvoiceStatus.PENDING] },
  { value: InvoiceStatus.PAID, label: InvoiceStatusLabels[InvoiceStatus.PAID] },
  { value: InvoiceStatus.CANCELLED, label: InvoiceStatusLabels[InvoiceStatus.CANCELLED] },
  { value: InvoiceStatus.OVERDUE, label: InvoiceStatusLabels[InvoiceStatus.OVERDUE] },
]

export const InvoiceStatusClasses: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [InvoiceStatus.PAID]: "bg-green-100 text-green-800",
  [InvoiceStatus.CANCELLED]: "bg-gray-100 text-gray-800",
  [InvoiceStatus.OVERDUE]: "bg-red-100 text-red-800",
}
