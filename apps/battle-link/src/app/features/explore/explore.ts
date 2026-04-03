import {
  Component,
  OnInit,
  signal,
  computed,
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
import {
  MOCK_EXPLORE_ITEMS,
  ExploreItem,
} from '../../shared/mock/events.mock';
import { EventCardComponent } from '../../shared/components/event-card/event-card';

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
    DatePipe,
    TranslatePipe,
    GoogleMap,
    MapMarker,
    MapInfoWindow,
    EventCardComponent,
  ],
})
export class ExplorePage implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  viewMode = signal<'list' | 'map'>('list');
  searchQuery = signal('');

  private readonly allItems = signal<ExploreItem[]>(MOCK_EXPLORE_ITEMS);

  filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allItems();
    return this.allItems().filter(
      (i) =>
        i.data.title.toLowerCase().includes(q) ||
        i.data.game.toLowerCase().includes(q),
    );
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
