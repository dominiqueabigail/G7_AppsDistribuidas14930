import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClaseComponent } from './clase.component';

describe('ClaseComponent', () => {
  let component: ClaseComponent;
  let fixture: ComponentFixture<ClaseComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClaseComponent] // Import the HttpClientTestingModule and the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ClaseComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Handle initial HTTP request
    const req = httpMock.expectOne('http://localhost:8002/cursos');
    req.flush([{ id: 1, nombre: 'Curso 1' }]);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch classes on initialization', () => {
    expect(component.clases.length).toBe(1);
    expect(component.clases[0].nombre).toBe('Curso 1');
  });

  it('should handle adding a class', () => {
    component.nombre = 'New Class';
    component.isAddOrUpdate = true;
    component.handleAceptarClick();

    const req = httpMock.expectOne('http://localhost:8002/cursos');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 2, nombre: 'New Class' });

    const fetchReq = httpMock.expectOne('http://localhost:8002/cursos');
    fetchReq.flush([{ id: 1, nombre: 'Curso 1' }, { id: 2, nombre: 'New Class' }]);

    expect(component.clases.length).toBe(2);
  });

  it('should handle updating a class', () => {
    component.id = 1;
    component.nombre = 'Updated Class';
    component.isAddOrUpdate = false;
    component.handleAceptarClick();

    const req = httpMock.expectOne('http://localhost:8002/cursos/1');
    expect(req.request.method).toBe('PUT');
    req.flush(null);

    const fetchReq = httpMock.expectOne('http://localhost:8002/cursos');
    fetchReq.flush([{ id: 1, nombre: 'Updated Class' }]);

    expect(component.clases.length).toBe(1);
    expect(component.clases[0].nombre).toBe('Updated Class');
  });

  it('should handle deleting a class', () => {
    component.handleDelete(1);

    const req = httpMock.expectOne('http://localhost:8002/cursos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const fetchReq = httpMock.expectOne('http://localhost:8002/cursos');
    fetchReq.flush([]);

    expect(component.clases.length).toBe(0);
  });
});
