import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { TypeSelectorComponent } from './type-selector';
import { CreationType } from '../../new-form.types';

@Component({
  template: `<app-type-selector [type]="type" (typeChange)="onTypeChange($event)" />`,
  imports: [TypeSelectorComponent],
})
class TestHostComponent {
  type: CreationType = 'partida';
  emitted: CreationType | null = null;
  onTypeChange(t: CreationType) { this.emitted = t; }
}

describe('TypeSelectorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideIonicAngular()],
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

  it('should have "partida" and "evento" values', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const values = Array.from(el.querySelectorAll('ion-segment-button')).map(
      (b) => b.getAttribute('value')
    );
    expect(values).toContain('partida');
    expect(values).toContain('evento');
  });

  it('should emit typeChange when ionChange fires', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const segment = fixture.nativeElement.querySelector('ion-segment') as HTMLElement;
    segment.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'evento' }, bubbles: true }));
    expect(fixture.componentInstance.emitted).toBe('evento');
  });
});
