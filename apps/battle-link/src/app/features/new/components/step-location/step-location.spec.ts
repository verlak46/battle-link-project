import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { StepLocationComponent } from './step-location';

// Mock Google Maps API
(window as any)['google'] = {
  maps: {
    places: {
      Autocomplete: class {
        addListener() {}
        getPlace() { return {}; }
      },
    },
  },
};

@Component({
  template: `
    <app-step-location
      [city]="city"
      [address]="address"
      (cityChange)="lastCity = $event"
      (addressChange)="lastAddress = $event"
    />
  `,
  imports: [StepLocationComponent],
})
class TestHostComponent {
  city = '';
  address = '';
  lastCity: string | null = null;
  lastAddress: string | null = null;
}

describe('StepLocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideIonicAngular(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-select for place selection', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ion-select')).toBeTruthy();
  });

  it('should show "Ciudad" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ciudad');
  });

  it('should show register-place button when no place is selected', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.register-place')).toBeTruthy();
  });

  it('should emit cityChange on ionInput of city field', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    // inputs[0] = placeName (visible when no placeId), inputs[1] = city, inputs[2] = address
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Sevilla' }, bubbles: true }));
    expect(fixture.componentInstance.lastCity).toBe('Sevilla');
  });

  it('should emit addressChange on ionInput of address field', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    // inputs[2] = address
    inputs[2].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Calle Sierpes 1' }, bubbles: true }));
    expect(fixture.componentInstance.lastAddress).toBe('Calle Sierpes 1');
  });
});
