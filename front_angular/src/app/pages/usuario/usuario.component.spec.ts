import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioComponent } from './usuario.component';

describe('UsuarioComponent', () => {
  let component: UsuarioComponent;
  let fixture: ComponentFixture<UsuarioComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UsuarioComponent], // Import UsuarioComponent here
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch data on init', async () => {
    const mockUsuarios = [{ id: 1, nombre: 'John Doe', email: 'email', password: 'password' }];

    // Wait for async operations to complete
    await fixture.whenStable();

    // Check for HTTP request
    const req = httpMock.expectOne('http://localhost:8001/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios); // Provide the mock response

    // Verify the component's usuarios property
    fixture.detectChanges(); // Trigger change detection to update the view
    expect(component.usuarios).toEqual(mockUsuarios);
  });
});
