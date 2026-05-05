import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { ProfileEventsComponent } from './profile-events';
import { ApiService } from '../../../../core/services/api.service';
import { provideTestTranslations } from '../../../../testing/translate-testing';

const MOCK_EVENT = {
  _id: 'e1',
  title: 'Battle',
  type: 'game' as const,
  game: 'wh40k',
  startDate: '2026-06-01',
  status: 'published' as const,
  currentPlayers: 1,
  createdBy: 'u1',
  participants: ['u1'],
  createdAt: '',
  updatedAt: '',
};

function makeApiMock(activeEvents: any[] = [], historyEvents: any[] = []) {
  return {
    getMyEvents: (params: { fromDate?: string; toDate?: string } = {}) =>
      of(params.fromDate ? activeEvents : historyEvents),
  } satisfies Partial<ApiService>;
}

describe('ProfileEventsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEventsComponent],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: ApiService, useValue: makeApiMock() },
        provideTestTranslations(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProfileEventsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should default to active tab', () => {
    const fixture = TestBed.createComponent(ProfileEventsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('active');
  });

  it('should render active events when on active tab', () => {
    TestBed.overrideProvider(ApiService, { useValue: makeApiMock([MOCK_EVENT]) });
    const fixture = TestBed.createComponent(ProfileEventsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.activeEvents()).toEqual([MOCK_EVENT]);
  });

  it('should switch to history tab', () => {
    const fixture = TestBed.createComponent(ProfileEventsComponent);
    fixture.detectChanges();
    fixture.componentInstance.activeTab.set('history');
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('history');
  });

  it('should load history events on history tab', () => {
    const historyEvent = { ...MOCK_EVENT, _id: 'e2', startDate: '2025-01-01' };
    TestBed.overrideProvider(ApiService, { useValue: makeApiMock([], [historyEvent]) });
    const fixture = TestBed.createComponent(ProfileEventsComponent);
    fixture.detectChanges();
    fixture.componentInstance.activeTab.set('history');
    fixture.detectChanges();
    expect(fixture.componentInstance.historyEvents()).toEqual([historyEvent]);
  });
});
