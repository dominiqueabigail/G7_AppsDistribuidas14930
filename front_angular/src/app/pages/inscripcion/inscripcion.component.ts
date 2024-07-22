import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
}

interface CursoUsuario {
  id: number;
  usuarioId: number;
}

interface Curso {
  id: number;
  nombre: string;
  cursoUsuarios: CursoUsuario[];
}

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.css']
})
export class InscripcionComponent {

  usuarios: Usuario[] = [];
  cursos: Curso[] = [];
  selectedUsuario: Usuario | null = null;
  selectedCurso: Curso[] = [];
  isEnrolled: boolean = false;

  private http = inject(HttpClient);

  constructor() {
    this.fetchUsuarios();
    this.fetchCursos();
  }

  fetchUsuarios(): void {
    this.http.get<Usuario[]>('http://localhost:8001/usuarios').subscribe(
      data => {
        this.usuarios = data;
      },
      error => {
        console.error('Error fetching usuarios:', error);
      }
    );
  }

  fetchCursos(): void {
    this.http.get<Curso[]>('http://localhost:8002/cursos').subscribe(
      data => {
        this.cursos = data;
      },
      error => {
        console.error('Error fetching cursos:', error);
      }
    );
  }

  getCursoUsuarioId(cursoId: number, usuarioId: number): number | null {
    const curso = this.cursos.find(c => c.id === cursoId);
    if (curso) {
      const cursoUsuario = curso.cursoUsuarios.find((cu: CursoUsuario) => cu.usuarioId === usuarioId);
      if (cursoUsuario) {
        return cursoUsuario.id;
      }
    }
    return null;
  }

  handleUsuarioChange(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    const usuario = this.usuarios.find(u => u.id === parseInt(selectedId));
    this.selectedUsuario = usuario || null;

    let enrolled = false;
    for (let curso of this.cursos) {
      for (let cursoUsuario of curso.cursoUsuarios) {
        if (cursoUsuario.usuarioId === usuario?.id) {
          enrolled = true;
          this.isEnrolled = true;
          this.selectedCurso = [curso];
          break;
        }
      }
      if (enrolled) {
        return;
      }
    }
    this.isEnrolled = false;
  }

  handleInscribir(cursoId: number): void {
    if (!this.selectedUsuario) return;

    this.http.put(`http://localhost:8002/cursos/asignar-usuario/${cursoId}`, {
      id: this.selectedUsuario.id,
      nombre: this.selectedUsuario.nombre,
      email: this.selectedUsuario.email,
      password: this.selectedUsuario.password
    }).subscribe(
      () => {
        this.cursos = this.cursos.map(curso => {
          if (curso.id === cursoId) {
            return {
              ...curso,
              cursoUsuarios: [...curso.cursoUsuarios, { id: 0, usuarioId: this.selectedUsuario?.id || 0 }]
            };
          }
          return curso;
        });
        this.selectedCurso = this.cursos.filter(curso => curso.id === cursoId);
        this.isEnrolled = true;
        this.fetchCursos();
      },
      error => {
        console.error('Error adding inscripcion:', error);
      }
    );
  }

  handleDesinscribir(cursoId: number): void {
    const usuarioId = this.selectedUsuario?.id || 0;

    this.http.delete(`http://localhost:8002/cursos/${cursoId}/eliminar-usuario/${usuarioId}`).subscribe(
      () => {
        this.selectedCurso = this.selectedCurso.filter(curso => curso.id !== cursoId);
        if (this.selectedCurso.length === 0) {
          this.isEnrolled = false;
        }
        this.fetchCursos();
      },
      error => {
        console.error('Error removing inscripcion:', error);
      }
    );
  }
}
