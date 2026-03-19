import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MapPage } from './map';

describe('MapPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPage],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MapPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Mapa"', () => {
    const fixture = TestBed.createComponent(MapPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Mapa');
  });
});
