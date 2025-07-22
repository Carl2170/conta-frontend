import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './features/home/home-layout.component';
import { WelcomeLayoutComponent } from './features/welcome/welcome-layout.component';
import { AccountNatureListComponent } from './features/account-nature/account-nature-list/account-nature-list.component';
import { ChartOfAccountComponent } from './features/chart-account/chart-account.component';
import { AccountingPeriodsComponent } from './features/accounting-periods/accounting-periods.component';
import { AccountingAccountsComponent } from './features/accounting-accounts/accounting-accounts.component';
import { JournalEntryComponent } from './features/journal-entry/journal-entry.component';
import { JournalEntryDetailComponent } from './features/journal-entry-detail/journal-entry-detail.component';

export const routes: Routes = [
  { path: '', component: WelcomeLayoutComponent }, // landing
  {
    path: 'dashboard',
    component: HomeLayoutComponent,               // layout del panel
    children: [
      { path: 'account-natures', component: AccountNatureListComponent },
      { path: 'chart-account', component: ChartOfAccountComponent},
      { path: 'periods-account', component: AccountingPeriodsComponent },
      { path: 'accounts', component:AccountingAccountsComponent},
      { path: 'journal-entry', component: JournalEntryComponent },
      { path: 'journal-entry/:id', component: JournalEntryDetailComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
