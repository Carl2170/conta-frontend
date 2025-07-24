export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHECK = "CHECK",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Efectivo",
  [PaymentMethod.BANK_TRANSFER]: "Transferencia Bancaria",
  [PaymentMethod.CHECK]: "Cheque",
  [PaymentMethod.CREDIT_CARD]: "Tarjeta de Crédito",
  [PaymentMethod.DEBIT_CARD]: "Tarjeta de Débito",
}

export const PaymentMethodOptions = [
  { value: PaymentMethod.CASH, label: PaymentMethodLabels[PaymentMethod.CASH] },
  { value: PaymentMethod.BANK_TRANSFER, label: PaymentMethodLabels[PaymentMethod.BANK_TRANSFER] },
  { value: PaymentMethod.CHECK, label: PaymentMethodLabels[PaymentMethod.CHECK] },
  { value: PaymentMethod.CREDIT_CARD, label: PaymentMethodLabels[PaymentMethod.CREDIT_CARD] },
  { value: PaymentMethod.DEBIT_CARD, label: PaymentMethodLabels[PaymentMethod.DEBIT_CARD] },
]
