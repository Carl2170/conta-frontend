import { Component, OnInit } from '@angular/core';
import { AccountingAccountService } from '../../core/services/accounting-account.service';
import { AccountNatureService } from '../../core/services/account-nature.service';
import { ChartOfAccountService } from '../../core/services/chart-of-account.service';
import { AccountingAccount, AccountingAccountInput } from '../../core/models/accounting-account.model';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms'

@Component({
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, ReactiveFormsModule],
  selector: 'app-accounting-accounts',
  templateUrl: './accounting-accounts.component.html',
})
export class AccountingAccountsComponent implements OnInit {
  accounts: AccountingAccount[] = [];
  form: AccountingAccountInput = this.defaultForm();
  selectedAccount: AccountingAccount | null = null;
  isEditing = false;
  showForm = false;
  loading = false;
  accountNatures: any[] = [];
  chartOfAccounts: any[] = [];
  error = '';
  constructor(private accountService: AccountingAccountService,
              private accountNatureService: AccountNatureService,
              private chartOfAccountService: ChartOfAccountService,  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.fetchAccountNatures();
    this.loadCharts();
  }

  async loadAccounts() {
    this.loading = true;
    this.accounts = await this.accountService.getAllAccounts();
    this.loading = false;
  }
  fetchAccountNatures() {
  this.accountNatureService.getAllAccountNatures().subscribe(data => {
    this.accountNatures = data;
  });
}

 async loadCharts() {
    this.loading = true;
    try {
      this.chartOfAccounts = await this.chartOfAccountService.getAll();
    } catch (e) {
      this.error = 'Error al cargar los catálogos.';
    }
    this.loading = false;
  }
  
  edit(account: AccountingAccount) {
    this.selectedAccount = account;
    this.isEditing = true;
    this.form = {
      accountNatureId: account.accountNature?.id ?? '',
      chartOfAccountId: account.chartOfAccount?.id ?? '',
      parentAccountId: account.parentAccount?.id,
      code: account.code,
      name: account.name,
      description: account.description,
      level: account.level,
      isActive: account.isActive,
      isTransactional: account.isTransactional,
    };
    this.showForm = true;
  }

  async save() {
    if (this.isEditing && this.selectedAccount) {
      await this.accountService.updateAccountingAccount(this.selectedAccount.id, this.form);
    } else {
      await this.accountService.createAccountingAccount(this.form);
    }

    this.resetForm();
    this.loadAccounts();
  }

  async delete(id: string) {
    if (confirm('¿Estás seguro de eliminar esta cuenta contable?')) {
      await this.accountService.deleteAccountingAccount(id);
      this.loadAccounts();
    }
  }

  resetForm() {
    this.form = this.defaultForm();
    this.selectedAccount = null;
    this.isEditing = false;
    this.showForm = false;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  private defaultForm(): AccountingAccountInput {
    return {
      accountNatureId: '',
      chartOfAccountId: '',
      code: '',
      name: '',
      level: 1,
      isActive: true,
      isTransactional: false,
    };
  }
}
