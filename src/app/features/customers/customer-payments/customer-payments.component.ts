import { Component, type OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { CustomerPaymentService } from "../../../core/services/customer-payment.service"
import  { CustomerInvoiceService } from "../../../core/services/customer-invoice.service"
import  { CustomerService } from "../../../core/services/customer.service"
import  { CustomerPayment, CustomerPaymentInput } from "../../../core/models/customers/customer-payment.model"
import  { Customer } from "../../../core/models/customers/customer.model"
import  { CustomerInvoice } from "../../../core/models/customers/customer-invoice.model"
import { CommonModule } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import {
  PaymentMethod,
  PaymentMethodOptions,
  PaymentMethodLabels,
} from "../../../core/models/customers/payment-method.enum"
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  selector: "app-customer-payments",
  templateUrl: "./customer-payments.component.html",
  styleUrls: ["./customer-payments.component.css"],
})

export class CustomerPaymentsComponent implements OnInit {
  customerId: number | null = null
  selectedInvoiceId: number | null = null
  customer: Customer | null = null
  payments: CustomerPayment[] = []
  filteredPayments: CustomerPayment[] = []
  customerInvoices: CustomerInvoice[] = []

  // Form for new payment
  paymentForm: FormGroup
  showPaymentForm = false
  editingPayment: CustomerPayment | null = null

  // Filters
  searchTerm = ""
  paymentMethodFilter: PaymentMethod | "" = ""

  loading = false
  submitting = false

  paymentMethods = PaymentMethodOptions

  paymentMethodFilterOptions = [{ value: "", label: "Todos los métodos" }, ...PaymentMethodOptions]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private customerPaymentService: CustomerPaymentService,
    private customerInvoiceService: CustomerInvoiceService,
    private customerService: CustomerService,
  ) {
    this.paymentForm = this.createPaymentForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.customerId = +params["id"]
        this.loadCustomer()
        this.loadPayments()
        this.loadCustomerInvoices()
      }
    })

    // Check if there's a specific invoice to filter by
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["invoiceId"]) {
        this.selectedInvoiceId = +queryParams["invoiceId"]
        this.applyFilters()
      }
    })
  }

  createPaymentForm(): FormGroup {
    return this.fb.group({
      paymentNumber: [""],
      customerInvoiceId: [""],
      paymentDate: [new Date().toISOString().split("T")[0], Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      paymentMethod: [PaymentMethod.CASH, Validators.required],
      bankAccountId: [""],
      reference: [""],
    })
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

  loadPayments(): void {
    if (!this.customerId) return

    this.loading = true
    this.customerPaymentService.getPaymentsByCustomer(this.customerId).subscribe({
      next: (response) => {
        this.payments = response.data.customerPaymentsByCustomer || []
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading payments:", error)
        this.loading = false
      },
    })
  }

  loadCustomerInvoices(): void {
    if (!this.customerId) return

    this.customerInvoiceService.getInvoicesByCustomer(this.customerId).subscribe({
      next: (response) => {
        this.customerInvoices = response.data.customerInvoicesByCustomer || []
      },
      error: (error) => {
        console.error("Error loading customer invoices:", error)
      },
    })
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter((payment) => {
      const matchesSearch =
        !this.searchTerm ||
        payment.paymentNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (payment.reference && payment.reference.toLowerCase().includes(this.searchTerm.toLowerCase()))

      const matchesPaymentMethod = !this.paymentMethodFilter || payment.paymentMethod === this.paymentMethodFilter

      const matchesInvoice =
        !this.selectedInvoiceId || (payment.customerInvoice && payment.customerInvoice.id === this.selectedInvoiceId)

      return matchesSearch && matchesPaymentMethod && matchesInvoice
    })
  }

  onPaymentMethodFilterChange(): void {
    this.applyFilters()
  }

  onSearch(): void {
    this.applyFilters()
  }

  showNewPaymentForm(): void {
    this.showPaymentForm = true
    this.editingPayment = null
    this.paymentForm.reset()
    this.paymentForm.patchValue({
      paymentDate: new Date().toISOString().split("T")[0],
      amount: 0,
      paymentMethod: PaymentMethod.CASH,
    })

    // Pre-select invoice if coming from invoice view
    if (this.selectedInvoiceId) {
      this.paymentForm.patchValue({
        customerInvoiceId: this.selectedInvoiceId,
      })
    }
  }

  editPayment(payment: CustomerPayment): void {
    this.showPaymentForm = true
    this.editingPayment = payment

    // Load full payment details
    this.customerPaymentService.getPaymentById(payment.id).subscribe({
      next: (response) => {
        const fullPayment = response.data.customerPayment
        if (fullPayment) {
          this.paymentForm.patchValue({
            paymentNumber: fullPayment.paymentNumber,
            customerInvoiceId: fullPayment.customerInvoice?.id || "",
            paymentDate: fullPayment.paymentDate,
            amount: fullPayment.amount,
            paymentMethod: fullPayment.paymentMethod,
            bankAccountId: fullPayment.bankAccountId || "",
            reference: fullPayment.reference || "",
          })
        }
      },
      error: (error) => {
        console.error("Error loading payment details:", error)
      },
    })
  }

  cancelPaymentForm(): void {
    this.showPaymentForm = false
    this.editingPayment = null
    this.paymentForm.reset()
  }

  onSubmitPayment(): void {
    if (this.paymentForm.valid && this.customerId) {
      this.submitting = true
      const formValue = this.paymentForm.value

      const paymentInput: CustomerPaymentInput = {
        paymentNumber: formValue.paymentNumber || undefined,
        customerId: this.customerId,
        customerInvoiceId: formValue.customerInvoiceId || undefined,
        accountingPeriodId: 1, // Default accounting period
        paymentDate: formValue.paymentDate,
        amount: formValue.amount.toString(),
        paymentMethod: formValue.paymentMethod,
        bankAccountId: formValue.bankAccountId || undefined,
        reference: formValue.reference || undefined,
      }

      const operation$ = this.editingPayment
        ? this.customerPaymentService.updatePayment(this.editingPayment.id, paymentInput)
        : this.customerPaymentService.createPayment(paymentInput)

      operation$.subscribe({
        next: (response) => {
          const success = this.editingPayment
            ? response.data.updateCustomerPayment
            : response.data.createCustomerPayment

          if (success) {
            this.cancelPaymentForm()
            this.loadPayments()
            this.loadCustomerInvoices() // Refresh invoices to update balances
          }
          this.submitting = false
        },
        error: (error) => {
          console.error("Error saving payment:", error)
          alert("Error al guardar el pago")
          this.submitting = false
        },
      })
    }
  }

  deletePayment(payment: CustomerPayment): void {
    if (confirm(`¿Está seguro de que desea eliminar el pago ${payment.paymentNumber}?`)) {
      this.customerPaymentService.deletePayment(payment.id).subscribe({
        next: (response) => {
          if (response.data.deleteCustomerPayment) {
            this.loadPayments()
            this.loadCustomerInvoices() // Refresh invoices to update balances
          }
        },
        error: (error) => {
          console.error("Error deleting payment:", error)
          alert("Error al eliminar el pago")
        },
      })
    }
  }

  clearInvoiceFilter(): void {
    this.selectedInvoiceId = null
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    })
    this.applyFilters()
  }

  goBack(): void {
    this.router.navigate(["/customers"])
  }

  navigateToInvoices(): void {
    this.router.navigate(["/customers", this.customerId, "invoices"])
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

  getPaymentMethodLabel(method: PaymentMethod): string {
    return PaymentMethodLabels[method] || method
  }

  getPaymentMethodClass(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CASH:
        return "bg-green-100 text-green-800"
      case PaymentMethod.BANK_TRANSFER:
        return "bg-blue-100 text-blue-800"
      case PaymentMethod.CHECK:
        return "bg-yellow-100 text-yellow-800"
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getSelectedInvoiceInfo(): CustomerInvoice | null {
    if (!this.selectedInvoiceId) return null
    return this.customerInvoices.find((inv) => inv.id === this.selectedInvoiceId) || null
  }
}
