import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { TabsPage } from './tabs';
import { tabsRoutes } from './tabs.routes';

describe('TabsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter(tabsRoutes), provideIonicAngular()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TabsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-tab-bar', () => {
    const fixture = TestBed.createComponent(TabsPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-tab-bar')).toBeTruthy();
  });

  it('should have 5 tab buttons', () => {
    const fixture = TestBed.createComponent(TabsPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('ion-tab-button');
    expect(buttons.length).toBe(5);
  });

  it('should have tabs: mapa, buscar, nuevo, chat, perfil', () => {
    const fixture = TestBed.createComponent(TabsPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(el.querySelectorAll('ion-tab-button')).map((b) =>
      b.getAttribute('tab')
    );
    expect(tabs).toEqual(['mapa', 'buscar', 'nuevo', 'chat', 'perfil']);
  });
});
