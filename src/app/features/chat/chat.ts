import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class ChatPage {}
