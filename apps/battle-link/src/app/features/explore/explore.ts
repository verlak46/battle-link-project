import {
  Component,
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
  IonIcon,
  IonButton,
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
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
import { EventCardComponent } from '../../shared/components/event-card/event-card';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Event } from '@battle-link/shared-models';

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
    IonIcon,
    IonButton,
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    DatePipe,
    TranslatePipe,
    GoogleMap,
    MapMarker,
    MapInfoWindow,
    EventCardComponent,
  ],
})
export class ExplorePage {
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  viewMode = signal<'list' | 'map'>('list');
  searchQuery = signal('');

  readonly activeTimeFilter = signal<'upcoming' | 'today' | 'weekend'>('upcoming');
  readonly activeCategoryFilter = signal<'all' | 'event' | 'tournament'>('all');

  private readonly _items = signal<Event[]>([]);
  private readonly _page = signal(1);
  readonly hasMore = signal(true);
  readonly isLoading = signal(false);

  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const category = this.activeCategoryFilter();

    let items = this._items();

    if (q) {
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.game.toLowerCase().includes(q),
      );
    }

    if (category === 'tournament') {
      items = items.filter((i) => i.type === 'tournament');
    } else if (category === 'event') {
      items = items.filter((i) => i.type !== 'tournament');
    }

    return items;
  });

  center = signal<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 });
  zoom = signal(12);
  selectedItem = signal<Event | null>(null);
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

  ionViewWillEnter(): void {
    const doLoad = (lat?: number, lng?: number) => {
      if (lat != null && lng != null) this.center.set({ lat, lng });
      this.loadPage(1);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => doLoad(pos.coords.latitude, pos.coords.longitude),
        () => doLoad(),
      );
    } else {
      doLoad();
    }
  }

  private buildParams(page: number): Parameters<ApiService['getEvents']>[0] {
    const user = this.auth.user();
    const coords = user?.location?.coordinates; // [lng, lat]
    const params: Parameters<ApiService['getEvents']>[0] = { page, limit: 20 };
    if (coords) { params.lng = coords[0]; params.lat = coords[1]; }
    if (user?._id) params.excludeUserId = user._id;
    return params;
  }

  private loadPage(page: number): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.api.getEvents(this.buildParams(page)).subscribe({
      next: ({ items, total }) => {
        if (page === 1) this._items.set(items);
        else this._items.update((prev) => [...prev, ...items]);
        this._page.set(page);
        this.hasMore.set(this._items().length < total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent): void {
    if (!this.hasMore()) {
      ev.target.complete();
      return;
    }
    const page = this._page() + 1;

    this.api.getEvents(this.buildParams(page)).subscribe({
      next: ({ items, total }) => {
        this._items.update((prev) => [...prev, ...items]);
        this._page.set(page);
        this.hasMore.set(this._items().length < total);
        ev.target.complete();
      },
      error: () => ev.target.complete(),
    });
  }

  markerPosition(item: Event): google.maps.LatLngLiteral | null {
    const loc = item.location;
    return loc ? { lat: loc.coordinates[1], lng: loc.coordinates[0] } : null;
  }

  openInfo(marker: MapMarker, item: Event) {
    this.selectedItem.set(item);
    this.infoWindow?.open(marker);
  }

  onSearch(event: CustomEvent) {
    this.searchQuery.set((event.detail.value as string) ?? '');
  }
}
