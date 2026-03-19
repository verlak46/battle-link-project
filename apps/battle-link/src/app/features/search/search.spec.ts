import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { SearchPage } from './search';

describe('SearchPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Buscar"', () => {
    const fixture = TestBed.createComponent(SearchPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Buscar');
  });

  it('should render ion-searchbar', () => {
    const fixture = TestBed.createComponent(SearchPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-searchbar')).toBeTruthy();
  });
});
