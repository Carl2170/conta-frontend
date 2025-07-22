export interface ChartOfAccount {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt?: string;  // o Date si haces parse
  updatedAt?: string;
  accounts?: any[]; // puedes definirlo mejor si lo necesitas
}