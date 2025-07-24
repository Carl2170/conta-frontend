import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './features/home/home-layout.component';
import { WelcomeLayoutComponent } from './features/welcome/welcome-layout.component';
import { AccountNatureListComponent } from './features/account-nature/account-nature-list/account-nature-list.component';
import { ChartOfAccountComponent } from './features/chart-account/chart-account.component';
import { AccountingPeriodsComponent } from './features/accounting-periods/accounting-periods.component';
import { AccountingAccountsComponent } from './features/accounting-accounts/accounting-accounts.component';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { JournalEntryDetailComponent } from './features/journal-entry-detail/journal-entry-detail.component';

import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';
import { CustomerInvoicesComponent } from './features/customers/customer-invoices/customer-invoices.component';
import { CustomerPaymentsComponent } from './features/customers/customer-payments/customer-payments.component';

export const routes: Routes = [
  { path: '', component: WelcomeLayoutComponent }, // landing
  {
    path: 'dashboard',
    component: HomeLayoutComponent, // layout del panel
    children: [
      { path: 'account-natures', component: AccountNatureListComponent },
      { path: 'chart-account', component: ChartOfAccountComponent },
      { path: 'periods-account', component: AccountingPeriodsComponent },
      { path: 'accounts', component: AccountingAccountsComponent },
      { path: 'journal-entry', component: JournalEntryComponent },
      { path: 'journal-entry/:id', component: JournalEntryDetailComponent },

      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/new', component: CustomerFormComponent },
      { path: 'customers/edit/:id', component: CustomerFormComponent },
      { path: 'customers/:id/invoices', component: CustomerInvoicesComponent },
      { path: 'customers/:id/payments', component: CustomerPaymentsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
