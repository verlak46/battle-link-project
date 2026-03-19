import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar],
})
export class SearchPage {}
