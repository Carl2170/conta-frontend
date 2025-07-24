import { Component, type OnInit } from "@angular/core"
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { CustomerService } from "../../../core/services/customer.service"
import type { CustomerInput } from "../../../core/models/customers/customer.model"
import { CommonModule } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  selector: "app-customer-form",
  templateUrl: "./customer-form.component.html",
  styleUrls: ["./customer-form.component.css"],
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup
  isEditMode = false
  customerId: number | null = null
  loading = false
  submitting = false

  documentTypes = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "NIT", label: "NIT" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "PP", label: "Pasaporte" },
    { value: "TI", label: "Tarjeta de Identidad" },
  ]

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.customerForm = this.createForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true
        this.customerId = +params["id"]
        this.loadCustomer()
      }
    })
  }

  createForm(): FormGroup {
    return this.fb.group({
      code: [""],
      name: ["", [Validators.required, Validators.minLength(2)]],
      documentType: [""],
      documentNumber: [""],
      email: ["", [Validators.email]],
      phone: [""],
      address: [""],
      isActive: [true],
    })
  }

  loadCustomer(): void {
    if (!this.customerId) return

    this.loading = true
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (response) => {
        const customer = response.data.customer
        if (customer) {
          this.customerForm.patchValue({
            code: customer.code,
            name: customer.name,
            documentType: customer.documentType,
            documentNumber: customer.documentNumber,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            isActive: customer.isActive,
          })
        }
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading customer:", error)
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.submitting = true
      const formValue = this.customerForm.value

      const customerInput: CustomerInput = {
        code: formValue.code || undefined,
        name: formValue.name,
        documentType: formValue.documentType || undefined,
        documentNumber: formValue.documentNumber || undefined,
        email: formValue.email || undefined,
        phone: formValue.phone || undefined,
        address: formValue.address || undefined,
        isActive: formValue.isActive,
      }

      const operation$ =
        this.isEditMode && this.customerId
          ? this.customerService.updateCustomer(this.customerId, customerInput)
          : this.customerService.createCustomer(customerInput)

      operation$.subscribe({
        next: (response) => {
          const success = this.isEditMode ? response.data.updateCustomer : response.data.createCustomer

          if (success) {
            this.router.navigate(["/customers"])
          }
          this.submitting = false
        },
        error: (error) => {
          console.error("Error saving customer:", error)
          alert("Error al guardar el cliente")
          this.submitting = false
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  onCancel(): void {
    this.router.navigate(["/customers"])
  }

  private markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach((key) => {
      const control = this.customerForm.get(key)
      control?.markAsTouched()
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string): string {
    const field = this.customerForm.get(fieldName)
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} es requerido`
      if (field.errors["email"]) return "Email inválido"
      if (field.errors["minlength"])
        return `${fieldName} debe tener al menos ${field.errors["minlength"].requiredLength} caracteres`
    }
    return ""
  }
}
