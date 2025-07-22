import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOfAccountService } from '../../core/services/chart-of-account.service';
import { NgIf, NgFor } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ChartOfAccount } from '../../core/models/chart-of-account.model';

@Component({
  selector: 'app-chart-account',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './chart-account.component.html',
  styleUrl: './chart-account.component.css',
})

export class ChartOfAccountComponent implements OnInit {
  form: FormGroup;
  charts: ChartOfAccount[] = [];
  editingId: number | null = null;
  showForm = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private chartService: ChartOfAccountService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isDefault: [false],
    });
  }

  ngOnInit(): void {
    this.loadCharts();
  }

  async loadCharts() {
    this.loading = true;
    try {
      this.charts = await this.chartService.getAll();
    } catch (e) {
      this.error = 'Error al cargar los catálogos.';
    }
    this.loading = false;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelEdit();
    }
  }

  async submit() {
    if (this.form.invalid) return;

    const input = this.form.value;

    try {
      if (this.editingId) {
        await this.chartService.update(this.editingId, input);
      } else {
        await this.chartService.create(input);
      }
      this.form.reset({ isDefault: false });
      this.editingId = null;
      this.showForm = false;
      await this.loadCharts();
    } catch (err) {
      this.error = 'Ocurrió un error al guardar el catálogo.';
    }
  }

  edit(chart: ChartOfAccount) {
    this.editingId = chart.id;
    this.showForm = true;
    this.form.setValue({
      name: chart.name,
      description: chart.description || '',
      isDefault: chart.isDefault,
    });
  }

  async delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este catálogo de cuentas?')) {
      try {
        await this.chartService.delete(id);
        await this.loadCharts();
      } catch (e) {
        this.error = 'No se pudo eliminar el catálogo.';
      }
    }
  }

  async loadDefault() {
    try {
      const defaultChart = await this.chartService.getDefault();
      alert(`El catálogo por defecto es: ${defaultChart.name}`);
    } catch (e) {
      alert('Error al obtener el catálogo por defecto.');
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ isDefault: false });
  }
}
