import { Component, type OnInit } from "@angular/core"
import  { RouterModule, Router } from "@angular/router"
import  { CustomerService } from "../../../core/services/customer.service"
import  { Customer } from "../../../core/models/customers/customer.model"
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms'
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: "app-customer-list",
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.css"],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = []
  filteredCustomers: Customer[] = []
  searchTerm = ""
  loading = false
  showActiveOnly = true

  constructor(
    private customerService: CustomerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCustomers()
  }

  loadCustomers(): void {
    this.loading = true

    const service$ = this.showActiveOnly
      ? this.customerService.getActiveCustomers()
      : this.customerService.getAllCustomers()

    service$.subscribe({
      next: (response) => {
        const data = this.showActiveOnly ? response.data.activeCustomers : response.data.customers
        this.customers = data || []
        this.filteredCustomers = [...this.customers]
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading customers:", error)
        this.loading = false
      },
    })
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.customerService.searchCustomers(this.searchTerm).subscribe({
        next: (response) => {
          this.filteredCustomers = response.data.searchCustomers || []
        },
        error: (error) => {
          console.error("Error searching customers:", error)
        },
      })
    } else {
      this.filteredCustomers = [...this.customers]
    }
  }

  onToggleActiveFilter(): void {
    this.loadCustomers()
  }

  navigateToNew() {
    console.log("Navigating to new customer form");
    
    this.router.navigate(["dashboard/customers/new"])
  }

  navigateToEdit(id: number): void {
    this.router.navigate(["dashboard/customers/edit", id])
  }

  navigateToInvoices(id: number): void {
    this.router.navigate(["dashboard/customers", id, "invoices"])
  }

  navigateToPayments(id: number): void {
    this.router.navigate(["dashboard/customers", id, "payments"])
  }

  deleteCustomer(id: number): void {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      this.customerService.deleteCustomer(id).subscribe({
        next: (response) => {
          if (response.data.deleteCustomer) {
            this.loadCustomers()
          }
        },
        error: (error) => {
          console.error("Error deleting customer:", error)
          alert("Error al eliminar el cliente")
        },
      })
    }
  }

  formatCurrency(amount: string): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(Number.parseFloat(amount))
  }

  getAmountClass(amount: string): string {
    const value = parseFloat(amount || '0')
    return value > 0 ? 'text-red-600' : 'text-green-600'
  }
}