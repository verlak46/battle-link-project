import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepDetailsComponent } from './step-details';
import { CreationType } from '../../new-form.types';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';

@Component({
  template: `
    <app-step-details
      [type]="type"
      [title]="title"
      [description]="description"
      [maxPlayers]="maxPlayers"
      (titleChange)="lastTitle = $event"
      (descriptionChange)="lastDescription = $event"
      (maxPlayersChange)="lastMax = $event"
    />
  `,
  imports: [StepDetailsComponent],
})
class TestHostComponent {
  type: CreationType = 'partida';
  title = '';
  description = '';
  maxPlayers = '';
  lastTitle: string | null = null;
  lastDescription: string | null = null;
  lastMax: string | null = null;
}

describe('StepDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideIonicAngular(),
        { provide: StorageService, useValue: { upload: () => {} } },
        { provide: AuthService, useValue: { user: signal(null) } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 3 ion-item elements', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('ion-item').length).toBe(3);
  });

  it('should show "Título de la partida" when type is partida', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Título de la partida');
  });

  it('should show "Título del evento" when type is evento', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = 'evento';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Título del evento');
  });

  it('should render ion-textarea for description', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ion-textarea')).toBeTruthy();
  });

  it('should emit titleChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Torneo primavera' }, bubbles: true }));
    expect(fixture.componentInstance.lastTitle).toBe('Torneo primavera');
  });

  it('should emit maxPlayersChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '8' }, bubbles: true }));
    expect(fixture.componentInstance.lastMax).toBe('8');
  });
});
