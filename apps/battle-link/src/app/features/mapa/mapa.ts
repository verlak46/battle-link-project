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
import { Place } from '@battle-link/shared-models';

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

  places = toSignal(this.api.getPlaces(), { initialValue: [] as Place[] });

  center = signal<google.maps.LatLngLiteral>({ lat: 40.4168, lng: -3.7038 });
  zoom = signal(12);
  selectedPlace = signal<Place | null>(null);

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

  markerPosition(place: Place): google.maps.LatLngLiteral {
    return {
      lat: place.location.coordinates[1],
      lng: place.location.coordinates[0],
    };
  }

  openInfo(marker: MapMarker, place: Place) {
    this.selectedPlace.set(place);
    this.infoWindow.open(marker);
  }
}
