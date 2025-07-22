import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountNatureService,
  AccountNature,
} from '../../../core/services/account-nature.service';
import { NgIf, NgFor } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-account-nature-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './account-nature-list.component.html',
  styleUrls: ['./account-nature-list.component.css'],
})
export class AccountNatureListComponent implements OnInit {
  accountNatures: AccountNature[] = [];
  loading = false;
  error: string | null = null;
  editMode: boolean = false;
  editNature: AccountNature = { id: 0, name: '', defaultBalanceType: '' };
  showForm = false;

  form: ReturnType<FormBuilder['group']>;

  constructor(
    private accountNatureService: AccountNatureService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      defaultBalanceType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAccountNatures();
  }

  loadAccountNatures(): void {
    this.loading = true;
    this.error = null;
    this.accountNatureService.getAllAccountNatures().subscribe({
      next: (data) => {
        this.accountNatures = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando las naturalezas de cuenta';
        this.loading = false;
        console.error(err);
      },
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.form.reset();
    this.error = null;
    this.editMode = false;
    this.editNature = { id: 0, name: '', defaultBalanceType: '' };
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    if (this.editMode) {
      // Actualizar
      const updatedNature: AccountNature = {
        ...this.editNature,
        ...this.form.value,
      };

      this.accountNatureService
        .updateAccountNature(updatedNature.id, {
          name: updatedNature.name,
          defaultBalanceType: updatedNature.defaultBalanceType,
        })
        .subscribe({
          next: () => {
            this.loadAccountNatures();
            this.toggleForm(); // Oculta formulario y limpia estados
            this.editMode = false;
            this.loading = false;
            alert('Naturaleza actualizada correctamente');
          },
          error: (err) => {
            this.error = 'Error al actualizar la naturaleza';
            this.loading = false;
            console.error(err);
          },
        });
    } else {
      // Crear nuevo
      this.accountNatureService.createAccountNature(this.form.value).subscribe({
        next: () => {
          this.loadAccountNatures();
          this.toggleForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al crear naturaleza';
          this.loading = false;
          console.error(err);
        },
      });
    }
  }

  deleteNature(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta naturaleza de cuenta?')) {
      this.accountNatureService.deleteAccountNature(id).subscribe({
        next: () => {
          this.accountNatures = this.accountNatures.filter((n) => n.id !== id);
        },
        error: (err) => {
          this.error = 'Error eliminando la naturaleza de cuenta';
          console.error(err);
        },
      });
    }
  }

  startEdit(nature: AccountNature): void {
    this.editMode = true;
    this.showForm = true; // <--- agregar esto para mostrar el formulario
    this.editNature = { ...nature };

    // Actualiza el form reactivo con los datos que quieres editar
    this.form.patchValue({
      name: nature.name,
      defaultBalanceType: nature.defaultBalanceType,
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editNature = { id: 0, name: '', defaultBalanceType: '' };
  }

  updateNature() {
    const nature = this.editNature;

    if (!nature.name.trim() || !nature.defaultBalanceType.trim()) {
      alert('Nombre y tipo de saldo no pueden estar vacíos');
      return;
    }

    this.accountNatureService
      .updateAccountNature(nature.id, {
        name: nature.name,
        defaultBalanceType: nature.defaultBalanceType,
      })
      .subscribe({
        next: (updatedNature) => {
          console.log('Actualizado correctamente:', updatedNature);
          this.editMode = false;
          this.loadAccountNatures(); // recargar la lista actualizada
          alert('Naturaleza actualizada correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar la naturaleza');
        },
      });
  }
}
