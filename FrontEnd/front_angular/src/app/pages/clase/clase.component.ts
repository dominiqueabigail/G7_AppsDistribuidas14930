import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent {

  clases: any[] = [];
  showModal: boolean = false;
  id: number | null = null;
  nombre: string = '';
  isAddOrUpdate: boolean | null = null;

  private http = inject(HttpClient);

  constructor() {
    this.fetchClases();
  }

  fetchClases(): void {
    this.http.get<any[]>('http://localhost:8002/cursos').subscribe(
      data => {
        this.clases = data;
      },
      error => {
        console.error('Error fetching clases:', error);
      }
    );
  }

  handleAgregarClick(): void {
    this.showModal = true;
    this.isAddOrUpdate = true;
  }

  handleCloseModal(): void {
    this.showModal = false;
    this.nombre = '';
  }

  handleNombreChange(event: Event): void {
    this.nombre = (event.target as HTMLInputElement).value;
  }

  handleAceptarClick(): void {
    if (this.isAddOrUpdate) {
      this.http.post('http://localhost:8002/cursos', { nombre: this.nombre }).subscribe(
        () => {
          this.fetchClases();
          this.handleCloseModal();
        },
        error => {
          console.error('Error adding clase:', error);
        }
      );
    } else {
      this.http.put(`http://localhost:8002/cursos/${this.id}`, { nombre: this.nombre }).subscribe(
        () => {
          this.fetchClases();
          this.handleCloseModal();
        },
        error => {
          console.error('Error updating clase:', error);
        }
      );
    }
  }

  handleUpdate(id: number, nombre: string): void {
    this.id = id;
    this.nombre = nombre;
    this.showModal = true;
    this.isAddOrUpdate = false;
  }

  handleDelete(id: number): void {
    this.http.delete(`http://localhost:8002/cursos/${id}`).subscribe(
      () => {
        this.fetchClases();
      },
      error => {
        console.error('Error deleting clase:', error);
      }
    );
  }
}
