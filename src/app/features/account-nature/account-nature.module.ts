import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountNatureRoutingModule } from './account-nature-routing.module'; // IMPORT correcto
import { AccountNatureListComponent } from './account-nature-list/account-nature-list.component';

@NgModule({
  imports: [
    CommonModule,
    AccountNatureRoutingModule,
    AccountNatureListComponent
  ]
})
export class AccountNatureModule { }
