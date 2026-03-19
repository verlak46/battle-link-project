import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { NewPage } from './new';

describe('NewPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPage],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('tipo signal', () => {
    it('should default to "partida"', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.tipo()).toBe('partida');
    });

    it('should update tipo via signal set', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.tipo.set('evento');
      expect(comp.tipo()).toBe('evento');
    });

    it('should show "Nueva Partida" title when tipo is partida', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Nueva Partida');
    });

    it('should show "Nuevo Evento" title when tipo is evento', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.componentInstance.tipo.set('evento');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('ion-title')?.textContent?.trim()).toBe('Nuevo Evento');
    });
  });

  describe('form signal', () => {
    it('should initialize with empty strings', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      const f = comp.form();
      expect(f.juego).toBe('');
      expect(f.fecha).toBe('');
      expect(f.ciudad).toBe('');
      expect(f.titulo).toBe('');
    });

    it('patch() should update only the provided fields', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Infinity' });
      expect(comp.form().juego).toBe('Infinity');
      expect(comp.form().sistema).toBe('');
    });
  });

  describe('wizard navigation', () => {
    it('should start on step 1', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.pasoActual()).toBe(1);
    });

    it('should have 4 steps defined', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.pasos.length).toBe(4);
    });

    it('should not advance if step 1 is invalid (juego empty)', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.siguiente();
      expect(comp.pasoActual()).toBe(1);
    });

    it('should advance to step 2 when juego is filled', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Warhammer 40K' });
      comp.siguiente();
      expect(comp.pasoActual()).toBe(2);
    });

    it('should go back with anterior()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'D&D' });
      comp.siguiente();
      comp.anterior();
      expect(comp.pasoActual()).toBe(1);
    });

    it('should not go below step 1 with anterior()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.anterior();
      expect(comp.pasoActual()).toBe(1);
    });

    it('should allow jumping back to a completed step with irAPaso()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Bolt Action' });
      comp.siguiente();
      comp.irAPaso(1);
      expect(comp.pasoActual()).toBe(1);
    });

    it('should not jump forward with irAPaso()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.irAPaso(3);
      expect(comp.pasoActual()).toBe(1);
    });
  });

  describe('esPasoValido computed', () => {
    it('step 1 invalid when juego is empty', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.esPasoValido()).toBe(false);
    });

    it('step 1 valid when juego has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Infinity' });
      expect(comp.esPasoValido()).toBe(true);
    });

    it('step 2 valid when fecha has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Infinity' });
      comp.siguiente();
      comp.patch({ fecha: '2026-04-01' });
      expect(comp.esPasoValido()).toBe(true);
    });

    it('step 3 valid when ciudad has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Infinity' });
      comp.siguiente();
      comp.patch({ fecha: '2026-04-01' });
      comp.siguiente();
      comp.patch({ ciudad: 'Madrid' });
      expect(comp.esPasoValido()).toBe(true);
    });

    it('step 4 valid when titulo has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ juego: 'Infinity' });
      comp.siguiente();
      comp.patch({ fecha: '2026-04-01' });
      comp.siguiente();
      comp.patch({ ciudad: 'Madrid' });
      comp.siguiente();
      comp.patch({ titulo: 'Torneo de primavera' });
      expect(comp.esPasoValido()).toBe(true);
    });
  });

  describe('esUltimoPaso computed', () => {
    it('should be false on step 1', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.esUltimoPaso()).toBe(false);
    });

    it('should be true on step 4', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.pasoActual.set(4);
      expect(comp.esUltimoPaso()).toBe(true);
    });
  });

  describe('subcomponents rendered', () => {
    it('should render app-type-selector', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-type-selector')).toBeTruthy();
    });

    it('should render 4 app-step-header elements', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('app-step-header').length).toBe(4);
    });

    it('should render app-step-game on step 1', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-step-game')).toBeTruthy();
    });

    it('should render app-step-nav on active step', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-step-nav')).toBeTruthy();
    });
  });
});
