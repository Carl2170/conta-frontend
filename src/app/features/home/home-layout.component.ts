import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css',
})
export class HomeLayoutComponent {
  constructor(private router: Router) {}

  goToAccountNature() {
    this.router.navigate(['/dashboard/account-natures']);
  }

  goToChartAccounts() {
    this.router.navigate(['/dashboard/chart-account']); 
  }

  goToAccounts() {
    this.router.navigate(['/dashboard/accounts']);
  }

  goToPeriods() {
    this.router.navigate(['/dashboard/periods-account']);
  } 

  goToJournalEntry() {
    this.router.navigate(['/dashboard/journal-entry']);
  }
  goToJournalEntryDetail(id: string) {
    this.router.navigate(['/dashboard/journal-entry', id]);
  }
  

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  goToUsers() {
    this.router.navigate(['/dashboard/users']);
  }

  logout() {
    // Aquí podrías limpiar el token, etc.
    this.router.navigate(['/']);
  }
}
