import { Component, OnInit, signal, inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { GoogleMap, MapMarker, MapInfoWindow } from '@angular/google-maps';
import { toSignal } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { ApiService } from '../../core/services/api.service';
import { Venue } from '../../shared/models/IVenue';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrl: './mapa.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink,
    GoogleMap,
    MapMarker,
    MapInfoWindow,
  ],
})
export class MapaPage implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  private readonly api = inject(ApiService);

  venues = toSignal(this.api.getVenues(), { initialValue: [] as Venue[] });

  center = signal<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 });
  zoom = signal(12);
  selectedVenue = signal<Venue | null>(null);

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
  };

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.center.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // fallback: Madrid
        },
      );
    }
  }

  markerPosition(venue: Venue): google.maps.LatLngLiteral {
    return {
      lat: venue.location.coordinates[1],
      lng: venue.location.coordinates[0],
    };
  }

  openInfo(marker: MapMarker, venue: Venue) {
    this.selectedVenue.set(venue);
    this.infoWindow.open(marker);
  }
}
