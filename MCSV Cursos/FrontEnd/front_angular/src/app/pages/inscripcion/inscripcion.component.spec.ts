import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InscripcionComponent } from './inscripcion.component';
import { By } from '@angular/platform-browser';

describe('InscripcionComponent', () => {
  let component: InscripcionComponent;
  let fixture: ComponentFixture<InscripcionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, InscripcionComponent] // Import the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(InscripcionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Handle initial HTTP requests
    const reqUsuarios = httpMock.expectOne('http://localhost:8001/api/usuarios/listar');
    reqUsuarios.flush([{ id: 1, nombre: 'Usuario 1' }]);

    const reqCursos = httpMock.expectOne('http://localhost:8002/cursos');
    reqCursos.flush([{ id: 1, nombre: 'Curso 1', cursoUsuarios: [] }]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should unenroll a user from a course', () => {
    const mockUsuario = { id: 1, nombre: 'Usuario 1', email: 'user1@example.com', password: 'password' };
    const mockCurso = { id: 1, nombre: 'Curso 1', cursoUsuarios: [{ id: 1, usuarioId: 1 }] };

    component.selectedUsuario = mockUsuario;
    component.cursos = [mockCurso];
    component.selectedCurso = [mockCurso];
    component.isEnrolled = true;

    component.handleDesinscribir(mockCurso.id);

    const reqDesinscribir = httpMock.expectOne(`http://localhost:8002/cursos/${mockCurso.id}/eliminar-usuario/1`);
    reqDesinscribir.flush(null);

    httpMock.expectOne('http://localhost:8002/cursos').flush([{ ...mockCurso, cursoUsuarios: [] }]);

    fixture.detectChanges();

    expect(component.selectedCurso).not.toContain(mockCurso);
    expect(component.isEnrolled).toBeFalse();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
