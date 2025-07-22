import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntryDetailService } from '../../core/services/journal-entry-detail.service';
import { JournalEntryDetail } from '../../core/models/journal-entry-detail.model';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';


@Component({
  selector: 'app-journal-entry-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './journal-entry-detail.component.html',
  styleUrl: './journal-entry-detail.component.css'
})
export class JournalEntryDetailComponent implements OnInit {
  @Input() journalEntryId!: number;
  details: JournalEntryDetail[] = [];
  form: JournalEntryDetail = this.resetForm();

  constructor(private detailService: JournalEntryDetailService) {}

  ngOnInit(): void {
    if (this.journalEntryId) {
      this.loadDetails();
    }
  }

  loadDetails(): void {
    this.detailService.getByEntryId(this.journalEntryId).subscribe((res) => {
      this.details = res;
    });
  }

  save(): void {
    this.form.journalEntryId = this.journalEntryId;
    this.detailService.create(this.form).subscribe(() => {
      this.loadDetails();
      this.form = this.resetForm();
    });
  }

  delete(id?: number): void {
    if (id && confirm('¿Eliminar línea?')) {
      this.detailService.delete(id).subscribe(() => this.loadDetails());
    }
  }

  resetForm(): JournalEntryDetail {
    return {
      journalEntryId: this.journalEntryId,
      accountId: 0,
      description: '',
      debitAmount: 0,
      creditAmount: 0,
    };
  }

  get totalDebits(): number {
    return this.details.reduce((sum, d) => sum + (d.debitAmount || 0), 0);
  }

  get totalCredits(): number {
    return this.details.reduce((sum, d) => sum + (d.creditAmount || 0), 0);
  }
}
