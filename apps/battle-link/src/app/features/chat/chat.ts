import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TranslatePipe],
})
export class ChatPage {}
