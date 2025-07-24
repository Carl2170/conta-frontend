import { Component, type OnInit } from "@angular/core"
import { FormBuilder,ReactiveFormsModule,FormsModule, type FormGroup, Validators, type FormArray } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import  { CustomerInvoiceService } from "../../../core/services/customer-invoice.service"
import  { CustomerService } from "../../../core/services/customer.service"
import { CustomerInvoice, CustomerInvoiceInput } from "../../../core/models/customers/customer-invoice.model"
import  { Customer } from "../../../core/models/customers/customer.model"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import {
  InvoiceStatus,
  InvoiceStatusOptions,
  InvoiceStatusLabels,
  InvoiceStatusClasses,
} from "../../../core/models/customers/invoice-status.enum"

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  selector: "app-customer-invoices",
  templateUrl: "./customer-invoices.component.html",
  styleUrls: ["./customer-invoices.component.css"],
})
export class CustomerInvoicesComponent implements OnInit {
  customerId: number | null = null
  customer: Customer | null = null
  invoices: CustomerInvoice[] = []
  filteredInvoices: CustomerInvoice[] = []

  // Form for new invoice
  invoiceForm: FormGroup
  showInvoiceForm = false
  editingInvoice: CustomerInvoice | null = null

  // Filters
  statusFilter: InvoiceStatus | "" = ""
  searchTerm = ""

  loading = false
  submitting = false

  statusOptions = [{ value: "", label: "Todos los estados" }, ...InvoiceStatusOptions]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private customerInvoiceService: CustomerInvoiceService,
    private customerService: CustomerService,
  ) {
    this.invoiceForm = this.createInvoiceForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.customerId = +params["id"]
        this.loadCustomer()
        this.loadInvoices()
      }
    })
  }

  createInvoiceForm(): FormGroup {
    return this.fb.group({
      invoiceNumber: [""],
      invoiceDate: [new Date().toISOString().split("T")[0], Validators.required],
      dueDate: [""],
      taxAmount: [0, [Validators.min(0)]],
      details: this.fb.array([this.createDetailForm()]),
    })
  }

  createDetailForm(): FormGroup {
    return this.fb.group({
      description: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    })
  }

  get detailsArray(): FormArray {
    return this.invoiceForm.get("details") as FormArray
  }

  loadCustomer(): void {
    if (!this.customerId) return

    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (response) => {
        this.customer = response.data.customer
      },
      error: (error) => {
        console.error("Error loading customer:", error)
      },
    })
  }

  loadInvoices(): void {
    if (!this.customerId) return

    this.loading = true
    this.customerInvoiceService.getInvoicesByCustomer(this.customerId).subscribe({
      next: (response) => {
        this.invoices = response.data.customerInvoicesByCustomer || []
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading invoices:", error)
        this.loading = false
      },
    })
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter((invoice) => {
      const matchesStatus = !this.statusFilter || invoice.status === this.statusFilter
      const matchesSearch =
        !this.searchTerm || invoice.invoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }

  onStatusFilterChange(): void {
    this.applyFilters()
  }

  onSearch(): void {
    this.applyFilters()
  }

  showNewInvoiceForm(): void {
    this.showInvoiceForm = true
    this.editingInvoice = null
    this.invoiceForm.reset()
    this.invoiceForm.patchValue({
      invoiceDate: new Date().toISOString().split("T")[0],
      taxAmount: 0,
    })

    // Reset details array
    while (this.detailsArray.length > 1) {
      this.detailsArray.removeAt(1)
    }
    this.detailsArray.at(0)?.reset()
  }

  editInvoice(invoice: CustomerInvoice): void {
    this.showInvoiceForm = true
    this.editingInvoice = invoice

    // Load full invoice details
    this.customerInvoiceService.getInvoiceById(invoice.id).subscribe({
      next: (response) => {
        const fullInvoice = response.data.customerInvoice
        if (fullInvoice) {
          this.invoiceForm.patchValue({
            invoiceNumber: fullInvoice.invoiceNumber,
            invoiceDate: fullInvoice.invoiceDate,
            dueDate: fullInvoice.dueDate,
            taxAmount: fullInvoice.taxAmount,
          })

          // Clear and populate details
          while (this.detailsArray.length > 0) {
            this.detailsArray.removeAt(0)
          }

          fullInvoice.details.forEach((detail: CustomerInvoice['details'][number]) => {
            const detailForm = this.createDetailForm()
            detailForm.patchValue({
              description: detail.description,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
            })
            this.detailsArray.push(detailForm)
          })
        }
      },
      error: (error) => {
        console.error("Error loading invoice details:", error)
      },
    })
  }

  cancelInvoiceForm(): void {
    this.showInvoiceForm = false
    this.editingInvoice = null
    this.invoiceForm.reset()
  }

  addDetail(): void {
    this.detailsArray.push(this.createDetailForm())
  }

  removeDetail(index: number): void {
    if (this.detailsArray.length > 1) {
      this.detailsArray.removeAt(index)
    }
  }

  calculateDetailTotal(index: number): number {
    const detail = this.detailsArray.at(index)
    const quantity = detail?.get("quantity")?.value || 0
    const unitPrice = detail?.get("unitPrice")?.value || 0
    return quantity * unitPrice
  }

  calculateSubtotal(): number {
    let subtotal = 0
    for (let i = 0; i < this.detailsArray.length; i++) {
      subtotal += this.calculateDetailTotal(i)
    }
    return subtotal
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal()
    const taxAmount = this.invoiceForm.get("taxAmount")?.value || 0
    return subtotal + taxAmount
  }

  onSubmitInvoice(): void {
    if (this.invoiceForm.valid && this.customerId) {
      this.submitting = true
      const formValue = this.invoiceForm.value

      const invoiceInput: CustomerInvoiceInput = {
        invoiceNumber: formValue.invoiceNumber || undefined,
        customerId: this.customerId,
        accountingPeriodId: 1, // Default accounting period
        invoiceDate: formValue.invoiceDate,
        dueDate: formValue.dueDate || undefined,
        taxAmount: formValue.taxAmount?.toString() || "0",
        details: formValue.details.map((detail: any) => ({
          description: detail.description,
          quantity: detail.quantity.toString(),
          unitPrice: detail.unitPrice.toString(),
        })),
      }

      const operation$ = this.editingInvoice
        ? this.customerInvoiceService.updateInvoice(this.editingInvoice.id, invoiceInput)
        : this.customerInvoiceService.createInvoice(invoiceInput)

      operation$.subscribe({
        next: (response) => {
          const success = this.editingInvoice
            ? response.data.updateCustomerInvoice
            : response.data.createCustomerInvoice

          if (success) {
            this.cancelInvoiceForm()
            this.loadInvoices()
          }
          this.submitting = false
        },
        error: (error) => {
          console.error("Error saving invoice:", error)
          alert("Error al guardar la factura")
          this.submitting = false
        },
      })
    }
  }

  deleteInvoice(invoice: CustomerInvoice): void {
    if (confirm(`¿Está seguro de que desea eliminar la factura ${invoice.invoiceNumber}?`)) {
      this.customerInvoiceService.deleteInvoice(invoice.id).subscribe({
        next: (response) => {
          if (response.data.deleteCustomerInvoice) {
            this.loadInvoices()
          }
        },
        error: (error) => {
          console.error("Error deleting invoice:", error)
          alert("Error al eliminar la factura")
        },
      })
    }
  }

  navigateToPayments(invoiceId: number): void {
    this.router.navigate(["/customers", this.customerId, "payments"], {
      queryParams: { invoiceId },
    })
  }

  goBack(): void {
    this.router.navigate(["/customers"])
  }

  formatCurrency(amount: string | number): string {
    const value = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value)
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-CO")
  }

  getStatusClass(status: InvoiceStatus): string {
    return InvoiceStatusClasses[status] || "bg-gray-100 text-gray-800"
  }

  getStatusLabel(status: InvoiceStatus): string {
    return InvoiceStatusLabels[status] || status
  }

   getAmountClass(amount: string): string {
    const value = parseFloat(amount || '0')
    return value > 0 ? 'text-red-600' : 'text-green-600'
  }
}
