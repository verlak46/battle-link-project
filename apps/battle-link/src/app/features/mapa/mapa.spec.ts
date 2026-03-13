import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MapaPage } from './mapa';

describe('MapaPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaPage],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MapaPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Mapa"', () => {
    const fixture = TestBed.createComponent(MapaPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Mapa');
  });
});
