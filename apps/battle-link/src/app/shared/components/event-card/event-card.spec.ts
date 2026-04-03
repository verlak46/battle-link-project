import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { EventCardComponent } from './event-card';
import { provideTestTranslations } from '../../../testing/translate-testing';
import { Event } from '../../../core/services/api.service';

const MOCK_EVENT: Event = {
  _id: 'e1',
  title: 'Batalla en Macragge',
  type: 'partida',
  game: 'Warhammer 40K',
  startDate: '2026-05-10T18:00:00Z',
  status: 'published',
  currentPlayers: 2,
  maxPlayers: 4,
  participants: [],
  city: 'Madrid',
  placeName: 'Tienda del Dragón',
  description: 'Una épica batalla en el espacio.',
  createdBy: 'u1',
  createdAt: '',
  updatedAt: '',
};

describe('EventCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
      providers: [provideIonicAngular(), provideTestTranslations()],
    }).compileComponents();
  });

  function create(event: Event = MOCK_EVENT) {
    const fixture = TestBed.createComponent(EventCardComponent);
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(create().componentInstance).toBeTruthy();
  });

  it('should render event title', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.textContent).toContain('Batalla en Macragge');
  });

  it('should render game chip', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.textContent).toContain('Warhammer 40K');
  });

  it('should render placeName when provided', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.textContent).toContain('Tienda del Dragón');
  });

  it('should fall back to city when placeName is absent', () => {
    const event = { ...MOCK_EVENT, placeName: undefined };
    const el = create(event).nativeElement as HTMLElement;
    expect(el.textContent).toContain('Madrid');
  });

  it('should render image when imageUrl is provided', () => {
    const event = { ...MOCK_EVENT, imageUrl: 'https://example.com/img.jpg' };
    const el = create(event).nativeElement as HTMLElement;
    const img = el.querySelector('img.card-img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/img.jpg');
  });

  it('should not render image when imageUrl is absent', () => {
    const event = { ...MOCK_EVENT, imageUrl: undefined };
    const el = create(event).nativeElement as HTMLElement;
    expect(el.querySelector('img.card-img')).toBeNull();
  });

  it('should render players count when maxPlayers is set', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.textContent).toContain('2');
    expect(el.textContent).toContain('4');
  });

  it('should render kind badge when showKindBadge is true', () => {
    const fixture = TestBed.createComponent(EventCardComponent);
    fixture.componentRef.setInput('event', MOCK_EVENT);
    fixture.componentRef.setInput('showKindBadge', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-kind-badge')).toBeTruthy();
  });

  it('should not render kind badge by default', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.querySelector('.card-kind-badge')).toBeNull();
  });

  it('should render description when provided', () => {
    const el = create().nativeElement as HTMLElement;
    expect(el.textContent).toContain('Una épica batalla en el espacio.');
  });
});
