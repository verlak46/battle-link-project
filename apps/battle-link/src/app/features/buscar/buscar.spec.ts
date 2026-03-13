import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { BuscarPage } from './buscar';

describe('BuscarPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarPage],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BuscarPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Buscar"', () => {
    const fixture = TestBed.createComponent(BuscarPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Buscar');
  });

  it('should render ion-searchbar', () => {
    const fixture = TestBed.createComponent(BuscarPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-searchbar')).toBeTruthy();
  });
});
