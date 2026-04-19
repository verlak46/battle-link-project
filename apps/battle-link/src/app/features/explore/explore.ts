import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { GoogleMap, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { addIcons } from 'ionicons';
import {
  mapOutline,
  listOutline,
  calendarOutline,
  trophyOutline,
  storefrontOutline,
  peopleOutline,
} from 'ionicons/icons';
import { MOCK_TOURNAMENTS, ExploreItem } from '../../shared/mock/events.mock';
import { EventCardComponent } from '../../shared/components/event-card/event-card';
import { ApiService, Event } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonButton,
    IonSearchbar,
    IonSkeletonText,
    DatePipe,
    TranslatePipe,
    GoogleMap,
    MapMarker,
    MapInfoWindow,
    EventCardComponent,
  ],
})
export class ExplorePage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  viewMode = signal<'list' | 'map'>('list');
  searchQuery = signal('');

  readonly events = signal<Event[]>([]);
  readonly loadingEvents = signal(true);
  readonly currentUserId = computed(() => this.auth.user()?._id ?? null);

  private readonly allItems = computed<ExploreItem[]>(() => [
    ...this.events().map((data) => ({ kind: 'event' as const, data })),
    ...MOCK_TOURNAMENTS.map((data) => ({ kind: 'tournament' as const, data })),
  ]);

  readonly activeTimeFilter = signal<'upcoming' | 'today' | 'weekend'>('upcoming');
  readonly activeCategoryFilter = signal<'all' | 'event' | 'tournament'>('all');

  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const category = this.activeCategoryFilter();

    let items = this.allItems();

    if (q) {
      items = items.filter(
        (i) =>
          i.data.title.toLowerCase().includes(q) ||
          i.data.game.toLowerCase().includes(q),
      );
    }

    if (category !== 'all') {
      items = items.filter((i) => i.kind === category);
    }

    return items;
  });

  center = signal<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 });
  zoom = signal(12);
  selectedItem = signal<ExploreItem | null>(null);
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
  };

  constructor() {
    addIcons({
      mapOutline,
      listOutline,
      calendarOutline,
      trophyOutline,
      storefrontOutline,
      peopleOutline,
    });
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.center.set({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // fallback: Madrid
        },
      );
    }
    this.loadEvents();
  }

  private loadEvents(): void {
    this.loadingEvents.set(true);
    this.api.getEvents().subscribe({
      next: (data) => {
        this.events.set(data);
        this.loadingEvents.set(false);
      },
      error: () => {
        this.loadingEvents.set(false);
      },
    });
  }

  onEventJoined(updated: Event): void {
    this.events.update((list) =>
      list.map((e) => (e._id === updated._id ? updated : e)),
    );
  }

  onEventLeft(updated: Event): void {
    this.events.update((list) =>
      list.map((e) => (e._id === updated._id ? updated : e)),
    );
  }

  markerPosition(item: ExploreItem): google.maps.LatLngLiteral | null {
    const loc = item.data.location;
    return loc ? { lat: loc.coordinates[1], lng: loc.coordinates[0] } : null;
  }

  openInfo(marker: MapMarker, item: ExploreItem) {
    this.selectedItem.set(item);
    this.infoWindow?.open(marker);
  }

  onSearch(event: CustomEvent) {
    this.searchQuery.set((event.detail.value as string) ?? '');
  }
}
