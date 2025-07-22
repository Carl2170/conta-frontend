import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JournalEntry,
  JournalEntryInput,
  JournalEntryDetailInput,
} from '../../core/models/journal-entry.model';
import { JournalEntriesService } from '../../core/services/journal-entry.service';
import { AccountingPeriodsService } from '../../core/services/accounting-periods.service';
import { AccountingAccountService } from '../../core/services/accounting-account.service'; // Asegúrate de importar el servicio correcto
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountingPeriod } from '../../core/models/accounting-period.model';
import { AccountingAccount } from '../../core/models/accounting-account.model';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './journal-entry.component.html',
  styleUrl: './journal-entry.component.css',
})
export class JournalEntryComponent implements OnInit {
  entries: JournalEntry[] = [];
  periods: AccountingPeriod[] = [];
  accounts: AccountingAccount[] = [];
  loading = false;
  error = '';
  showForm = false;
  isEditing = false;
  form: Partial<JournalEntryInput> & { id?: number } = {};
  details: JournalEntryDetailInput[] = [];

  constructor(
    private journalEntriesService: JournalEntriesService,
    private accountingPeriodsService: AccountingPeriodsService,
    private accountingAccountsService: AccountingAccountService // Asegúrate de importar el servicio correcto
  ) {}

  async ngOnInit() {
    await this.loadEntries();
    await this.loadPeriods();
    await this.loadAccounts();
  }

  async loadEntries() {
    this.loading = true;
    try {
      this.entries = await this.journalEntriesService.getAll();
    } catch (err) {
      this.error = 'Error al cargar los asientos contables.';
    } finally {
      this.loading = false;
    }
  }

  async loadPeriods() {
    try {
      this.periods = await this.accountingPeriodsService.getAll();
    } catch (err) {
      this.error = 'Error al cargar los períodos contables.';
    }
  }

  async loadAccounts() {
    try {
      // Aquí deberías llamar al servicio de cuentas contables
      this.accounts = await this.accountingAccountsService.getAllAccounts();
    } catch (err) {
      this.error = 'Error al cargar las cuentas contables.';
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  edit(entry: JournalEntry) {
    this.isEditing = true;
    this.showForm = true;
    this.form = {
      id: entry.id,
      accountingPeriodId: entry.accountingPeriod.id,
      entryDate: entry.entryDate,
      description: entry.description,
      sourceDocumentId: entry.sourceDocumentId,
      sourceDocumentType: entry.sourceDocumentType,
    };

    // Convertir detalles en formato JournalEntryDetailInput[]
    this.details = entry.details.map((detail) => ({
      journalEntryId: entry.id,
      accountId: detail.account.id,
      description: detail.description,
      debitAmount: detail.debitAmount,
      creditAmount: detail.creditAmount,
    }));
  }

  resetForm() {
    this.form = {};
    this.details = [];
    this.isEditing = false;
    this.showForm = false;
  }

  async save() {
    if (!this.form.accountingPeriodId) {
      this.error = 'Debes seleccionar un período contable antes de guardar.';
      return;
    }

    if (this.isEditing && this.form.id) {
      await this.updateEntry();
    } else {
      await this.createEntry();
    }
  }

  async createEntry() {
    try {
      const created = await this.journalEntriesService.create({
        accountingPeriodId: this.form.accountingPeriodId!,
        entryDate: this.form.entryDate!,
        description: this.form.description,
        sourceDocumentId: this.form.sourceDocumentId,
        sourceDocumentType: this.form.sourceDocumentType,
        details: this.details.map((d) => ({
          ...d,
          debitAmount: String(d.debitAmount),
          creditAmount: String(d.creditAmount),
        })),
      });
      this.entries.push(created);
      this.resetForm();
    } catch (err) {
      this.error = 'Error al crear el asiento contable.';
    }
  }

  async updateEntry() {
    try {
      const updated = await this.journalEntriesService.update(this.form.id!, {
        accountingPeriodId: this.form.accountingPeriodId!,
        entryDate: this.form.entryDate!,
        description: this.form.description,
        sourceDocumentId: this.form.sourceDocumentId,
        sourceDocumentType: this.form.sourceDocumentType,
        details: this.details.map((d) => ({
          ...d,
          debitAmount: String(d.debitAmount),
          creditAmount: String(d.creditAmount),
        })),
      });
      this.entries = this.entries.map((e) =>
        e.id === updated.id ? updated : e
      );
      this.resetForm();
    } catch (err) {
      this.error = 'Error al actualizar el asiento contable.';
    }
  }

  async delete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este asiento contable?')) return;
    try {
      const success = await this.journalEntriesService.delete(id);
      if (success) {
        this.entries = this.entries.filter((e) => e.id !== id);
        if (this.form.id === id) this.resetForm();
      }
    } catch (err) {
      this.error = 'Error al eliminar el asiento contable.';
    }
  }

  // Métodos para manipular detalles
  addDetail() {
    this.details.push({
      journalEntryId: this.form.id,
      accountId: '',
      description: '',
      debitAmount: '0',
      creditAmount: '0',
    });
  }

  removeDetail(index: number) {
    this.details.splice(index, 1);
  }
}
