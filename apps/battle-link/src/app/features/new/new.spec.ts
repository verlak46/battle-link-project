import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NewPage } from './new';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../core/services/storage.service';
import { AuthService } from '../../core/services/auth.service';
import { signal } from '@angular/core';
import type { Event as BattleEvent } from '@battle-link/shared-models';
import { provideTestTranslations } from '../../testing/translate-testing';

describe('NewPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            getPlaces: () => of([]),
            getWargames: () => of([]),
            createEvent: () => of({} as BattleEvent),
          } satisfies Partial<ApiService>,
        },
        { provide: StorageService, useValue: { upload: () => of('') } },
        { provide: AuthService, useValue: { user: signal(null) } },
        provideTestTranslations(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('type signal', () => {
    it('should default to "game"', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.type()).toBe('game');
    });

    it('should update type via signal set', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.type.set('tournament');
      expect(comp.type()).toBe('tournament');
    });

    it('should show "Nueva Partida" title when type is game', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Nueva Partida');
    });

    it('should show "Nuevo Evento" title when type is tournament', () => {
      const fixture = TestBed.createComponent(NewPage);
      fixture.componentInstance.type.set('tournament');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('ion-title')?.textContent?.trim()).toBe('Nuevo Evento');
    });
  });

  describe('form signal', () => {
    it('should initialize with empty strings', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      const f = comp.form();
      expect(f.game).toBe('');
      expect(f.startDate).toBe('');
      expect(f.city).toBe('');
      expect(f.title).toBe('');
    });

    it('patch() should update only the provided fields', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Infinity' });
      expect(comp.form().game).toBe('Infinity');
      expect(comp.form().system).toBe('');
    });
  });

  describe('wizard navigation', () => {
    it('should start on step 1', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.currentStep()).toBe(1);
    });

    it('should have 4 steps defined', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.steps.length).toBe(4);
    });

    it('should not advance if step 1 is invalid (game empty)', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.next();
      expect(comp.currentStep()).toBe(1);
    });

    it('should advance to step 2 when game is filled', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Warhammer 40K' });
      comp.next();
      expect(comp.currentStep()).toBe(2);
    });

    it('should go back with previous()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'D&D' });
      comp.next();
      comp.previous();
      expect(comp.currentStep()).toBe(1);
    });

    it('should not go below step 1 with previous()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.previous();
      expect(comp.currentStep()).toBe(1);
    });

    it('should allow jumping back to a completed step with goToStep()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Bolt Action' });
      comp.next();
      comp.goToStep(1);
      expect(comp.currentStep()).toBe(1);
    });

    it('should not jump forward with goToStep()', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.goToStep(3);
      expect(comp.currentStep()).toBe(1);
    });
  });

  describe('isStepValid computed', () => {
    it('always invalid when type is null (event without sub-type)', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.type.set(null);
      comp.patch({ game: 'Infinity' });
      expect(comp.isStepValid()).toBe(false);
    });

    it('step 1 invalid when game is empty', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.isStepValid()).toBe(false);
    });

    it('step 1 valid when game has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Infinity' });
      expect(comp.isStepValid()).toBe(true);
    });

    it('step 2 valid when startDate has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Infinity' });
      comp.next();
      comp.patch({ startDate: '2026-04-01' });
      expect(comp.isStepValid()).toBe(true);
    });

    it('step 3 valid when city has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Infinity' });
      comp.next();
      comp.patch({ startDate: '2026-04-01' });
      comp.next();
      comp.patch({ city: 'Madrid' });
      expect(comp.isStepValid()).toBe(true);
    });

    it('step 4 valid when title has value', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.patch({ game: 'Infinity' });
      comp.next();
      comp.patch({ startDate: '2026-04-01' });
      comp.next();
      comp.patch({ city: 'Madrid' });
      comp.next();
      comp.patch({ title: 'Torneo de primavera' });
      expect(comp.isStepValid()).toBe(true);
    });
  });

  describe('isLastStep computed', () => {
    it('should be false on step 1', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      expect(comp.isLastStep()).toBe(false);
    });

    it('should be true on step 4', () => {
      const { componentInstance: comp } = TestBed.createComponent(NewPage);
      comp.currentStep.set(4);
      expect(comp.isLastStep()).toBe(true);
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
