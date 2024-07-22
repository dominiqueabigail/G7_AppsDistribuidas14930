import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { UsuarioComponent } from '../usuario/usuario.component';
import { ClaseComponent } from '../clase/clase.component';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
import { CommonModule } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HomeComponent,
        UsuarioComponent,
        ClaseComponent,
        InscripcionComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tabla to usuario when Usuarios button is clicked', () => {
    const usuarioButton = fixture.debugElement.query(By.css('button.boton-tabla:nth-child(1)')).nativeElement;
    usuarioButton.click();
    fixture.detectChanges();
    expect(component.tabla).toBe('usuario');
    const usuarioComponent = fixture.debugElement.query(By.css('app-usuario'));
    expect(usuarioComponent).not.toBeNull();
  });

  it('should set tabla to curso when Cursos button is clicked', () => {
    const cursoButton = fixture.debugElement.query(By.css('button.boton-tabla:nth-child(2)')).nativeElement;
    cursoButton.click();
    fixture.detectChanges();
    expect(component.tabla).toBe('curso');
    const claseComponent = fixture.debugElement.query(By.css('app-clase'));
    expect(claseComponent).not.toBeNull();
  });

  it('should set tabla to inscripcion when Inscripcion button is clicked', () => {
    const inscripcionButton = fixture.debugElement.query(By.css('button.boton-tabla:nth-child(3)')).nativeElement;
    inscripcionButton.click();
    fixture.detectChanges();
    expect(component.tabla).toBe('inscripcion');
    const inscripcionComponent = fixture.debugElement.query(By.css('app-inscripcion'));
    expect(inscripcionComponent).not.toBeNull();
  });
});
