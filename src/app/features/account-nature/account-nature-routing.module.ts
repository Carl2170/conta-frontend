import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountNatureListComponent } from './account-nature-list/account-nature-list.component';

const routes: Routes = [
  {
    path: '',
    component: AccountNatureListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountNatureRoutingModule { }
