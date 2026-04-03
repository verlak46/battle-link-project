import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ChatPage } from './chat';
import { provideTestTranslations } from '../../testing/translate-testing';

describe('ChatPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPage],
      providers: [provideIonicAngular(), provideTestTranslations()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChatPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Chat"', () => {
    const fixture = TestBed.createComponent(ChatPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Chat');
  });
});
