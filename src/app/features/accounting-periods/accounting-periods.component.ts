import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountingPeriod,
  AccountingPeriodInput,
} from '../../core/models/accounting-period.model';
import { AccountingPeriodsService } from '../../core/services/accounting-periods.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-accounting-periods',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './accounting-periods.component.html',
  styleUrl: './accounting-periods.component.css',
})
export class AccountingPeriodsComponent implements OnInit {
  isEditing = false;
  periods: AccountingPeriod[] = [];
  selectedPeriod: AccountingPeriod | null = null;
  form: AccountingPeriodInput = {
    name: '',
    startDate: '',
    endDate: '',
    status: 'ABIERTO',
  };
  showForm = false;
  loading = false;


  constructor(private periodService: AccountingPeriodsService) {}

  ngOnInit(): void {
    this.loadPeriods();
  }

  async loadPeriods() {
    this.periods = await this.periodService.getAll();
  }

  edit(period: AccountingPeriod) {
    this.selectedPeriod = period;
    this.isEditing = true;
    this.form = { ...period };
  }

  async save() {
    if (this.isEditing && this.selectedPeriod) {
      await this.periodService.update(this.selectedPeriod.id, this.form);
    } else {
      await this.periodService.create(this.form);
    }

    this.resetForm();
    this.loadPeriods();
  }

  async delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este período contable?')) {
      await this.periodService.delete(id);
      this.loadPeriods();
    }
  }

  resetForm() {
    this.form = {
      name: '',
      startDate: '',
      endDate: '',
      status: 'ABIERTO',
    };
    this.selectedPeriod = null;
    this.isEditing = false;
  }

  toggleForm() { this.showForm = !this.showForm; }

}
