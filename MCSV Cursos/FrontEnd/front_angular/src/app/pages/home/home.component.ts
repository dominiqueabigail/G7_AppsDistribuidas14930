import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from '../usuario/usuario.component';
import { ClaseComponent } from '../clase/clase.component';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UsuarioComponent, ClaseComponent, InscripcionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tabla: string = 'usuario';

  setTabla(tabla: string) {
    this.tabla = tabla;
  }
}
