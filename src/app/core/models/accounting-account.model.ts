// export interface AccountingAccount {
//   id: number;
//   name: string;
//   description?: string;
//   isDefault: boolean;
//   createdAt?: string;  // o Date si haces parse
//   updatedAt?: string;
//   accounts?: any[]; // puedes definirlo mejor si lo necesitas
// }

// export interface AccountingAccount {
//   id: number;
//   account_nature_id: number;
//   chart_of_account_id: number;
//   parent_account_id?: number | null;
//   code: string;
//   name: string;
//   description?: string;
//   level: number;
//   is_active: boolean;
//   is_transactional: boolean;
//   created_at?: string;
//   updated_at?: string;
// }

// accounting-account.model.ts
export interface AccountingAccount {
  id: string;
  code: string;
  name: string;
  description?: string;
  level: number;
  isActive?: boolean;
  isTransactional?: boolean;
  createdAt?: string;
  updatedAt?: string;
  accountNature?: {
    id: string;
    name: string;
    defaultBalanceType: string;
  };
  chartOfAccount?: {
    id: string;
    name: string;
  };
  parentAccount?: {
    id: string;
    name: string;
  };
  childAccounts?: AccountingAccount[];
}

export interface AccountingAccountInput {
  accountNatureId: string;
  chartOfAccountId: string;
  parentAccountId?: string;
  code: string;
  name: string;
  description?: string;
  level: number;
  isActive?: boolean;
  isTransactional?: boolean;
}
