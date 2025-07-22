// src/app/models/accounting-period.model.ts

export interface AccountingPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountingPeriodInput {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}
