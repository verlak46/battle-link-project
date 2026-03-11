import * as admin from 'firebase-admin';
import * as path from 'path';

let firebaseApp: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    const serviceAccountPath = path.resolve(process.cwd(), 'data/serviceAccountKey.json');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require(serviceAccountPath);

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return firebaseApp;
}
