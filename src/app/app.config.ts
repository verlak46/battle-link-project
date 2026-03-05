import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp(environment.firebase);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular(),
  ],
};
