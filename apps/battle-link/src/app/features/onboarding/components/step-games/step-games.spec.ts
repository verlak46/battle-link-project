import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OnboardingStepGamesComponent } from './step-games';
import { Wargame } from '../../../../shared/models/IWargame';
import { provideTestTranslations } from '../../../../testing/translate-testing';

const MOCK_WARGAMES: Wargame[] = [
  { id: 'wh40k', name: 'Warhammer 40K', players: 2, scale: '28mm', publisher: 'GW', active: true },
  { id: 'aos', name: 'Age of Sigmar', players: 2, scale: '28mm', publisher: 'GW', active: true },
  { id: 'warmachine', name: 'Warmachine', players: 2, scale: '28mm', publisher: 'PP', active: true },
];

@Component({
  template: `
    <app-onboarding-step-games
      [wargames]="wargames"
      [selectedIds]="selectedIds"
      (selectedIdsChange)="lastChange = $event"
    />
  `,
  imports: [OnboardingStepGamesComponent],
})
class TestHostComponent {
  wargames: Wargame[] = MOCK_WARGAMES;
  selectedIds: string[] = [];
  lastChange: string[] = [];
}

describe('OnboardingStepGamesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideIonicAngular(), provideTestTranslations()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one ion-item per wargame', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    expect(items.length).toBe(MOCK_WARGAMES.length);
  });

  it('should render one ion-chip per wargame', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('ion-chip');
    expect(chips.length).toBe(MOCK_WARGAMES.length);
  });

  it('should emit selectedIdsChange with the toggled id added when selecting', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const chips = Array.from(fixture.nativeElement.querySelectorAll('ion-chip')) as HTMLElement[];
    chips[0].click();
    expect(fixture.componentInstance.lastChange).toEqual(['wh40k']);
  });

  it('should emit selectedIdsChange with the id removed when deselecting', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.selectedIds = ['wh40k'];
    fixture.detectChanges();
    const chips = Array.from(fixture.nativeElement.querySelectorAll('ion-chip')) as HTMLElement[];
    chips[0].click();
    expect(fixture.componentInstance.lastChange).toEqual([]);
  });

  it('should show "Seleccionado" text for selected game chip', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.selectedIds = ['aos'];
    fixture.detectChanges();
    const chips = Array.from(fixture.nativeElement.querySelectorAll('ion-chip')) as HTMLElement[];
    expect(chips[1].textContent?.trim()).toContain('Seleccionado');
  });

  it('should show "Elegir" text for unselected game chip', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const chips = Array.from(fixture.nativeElement.querySelectorAll('ion-chip')) as HTMLElement[];
    expect(chips[0].textContent?.trim()).toContain('Elegir');
  });

  it('should render empty list when no wargames provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.wargames = [];
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('ion-item');
    expect(items.length).toBe(0);
  });
});
