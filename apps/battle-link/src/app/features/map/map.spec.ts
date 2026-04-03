import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MapPage } from './map';
import { ApiService } from '../../core/services/api.service';
import { provideTestTranslations } from '../../testing/translate-testing';

// Mock Google Maps API for @angular/google-maps
(window as any)['google'] = {
  maps: {
    Map: class {
      setValues() {}
      addListener() { return { remove() {} }; }
      fitBounds() {}
      panTo() {}
      getZoom() { return 8; }
      getCenter() { return null; }
      getBounds() { return null; }
    },
    Marker: class {
      setMap() {}
      addListener() { return { remove() {} }; }
      getPosition() { return null; }
    },
    InfoWindow: class {
      setContent() {}
      setOptions() {}
      open() {}
      close() {}
      addListener() { return { remove() {} }; }
    },
    event: {
      addListener: () => ({ remove() {} }),
      removeListener: () => {},
      clearInstanceListeners: () => {},
      trigger: () => {},
    },
    LatLng: class {
      lat() { return 0; }
      lng() { return 0; }
    },
    LatLngBounds: class {
      extend() {}
      contains() { return false; }
    },
    Size: class {},
    Point: class {},
    Animation: { DROP: 2, BOUNCE: 1 },
    MapTypeId: { ROADMAP: 'roadmap' },
    places: {
      Autocomplete: class {
        addListener() {}
        getPlace() { return {}; }
      },
    },
  },
};

describe('MapPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            getPlaces: () => of([]),
          } satisfies Partial<ApiService>,
        },
        provideTestTranslations(),
      ],
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
