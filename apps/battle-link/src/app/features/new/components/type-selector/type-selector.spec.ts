import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { TypeSelectorComponent } from './type-selector';
import { CreationType } from '../../new-form.types';
import { provideTestTranslations } from '../../../../testing/translate-testing';

@Component({
  template: `<app-type-selector [type]="type" (typeChange)="onTypeChange($event)" />`,
  imports: [TypeSelectorComponent],
})
class TestHostComponent {
  type: CreationType | null = 'game';
  emitted: CreationType | null | undefined = undefined;
  onTypeChange(t: CreationType | null) { this.emitted = t; }
}

describe('TypeSelectorComponent', () => {
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

  it('should render ion-segment with 2 buttons', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('ion-segment-button').length).toBe(2);
  });

  it('should have game and event segment values', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const values = Array.from(el.querySelectorAll('ion-segment-button')).map(
      (b) => b.getAttribute('value')
    );
    expect(values).toContain('game');
    expect(values).toContain('event');
  });

  it('should not show sub-type chips when type is game', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.event-kind')).toBeNull();
  });

  it('should show sub-type chips when type is an event sub-type', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = 'tournament';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.event-kind')).toBeTruthy();
    const chips = el.querySelectorAll('ion-chip');
    expect(chips.length).toBe(3);
  });

  it('should show sub-type chips when type is null (event selected, no sub-type)', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = null;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.event-kind')).toBeTruthy();
  });

  it('should emit null when switching from game to event segment', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const segment = fixture.nativeElement.querySelector('ion-segment') as HTMLElement;
    segment.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'event' }, bubbles: true }));
    expect(fixture.componentInstance.emitted).toBeNull();
  });

  it('should emit game when switching to game segment', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = 'tournament';
    fixture.detectChanges();
    const segment = fixture.nativeElement.querySelector('ion-segment') as HTMLElement;
    segment.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'game' }, bubbles: true }));
    expect(fixture.componentInstance.emitted).toBe('game');
  });

  it('should emit tournament when tournament chip is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = null;
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('ion-chip') as NodeListOf<HTMLElement>;
    chips[0].click();
    expect(fixture.componentInstance.emitted).toBe('tournament');
  });

  it('should emit campaign when campaign chip is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = null;
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('ion-chip') as NodeListOf<HTMLElement>;
    chips[1].click();
    expect(fixture.componentInstance.emitted).toBe('campaign');
  });

  it('should emit league when league chip is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.type = null;
    fixture.detectChanges();
    const chips = fixture.nativeElement.querySelectorAll('ion-chip') as NodeListOf<HTMLElement>;
    chips[2].click();
    expect(fixture.componentInstance.emitted).toBe('league');
  });
});
