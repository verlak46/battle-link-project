import * as admin from 'firebase-admin';
import * as path from 'path';

let firebaseApp: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (!firebaseApp) {
    const credential = buildCredential();
    firebaseApp = admin.initializeApp({ credential });
  }
  return firebaseApp;
}

function buildCredential(): admin.credential.Credential {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Render escapa los saltos de línea; hay que revertirlos
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  // Fallback para desarrollo local con el archivo JSON
  const serviceAccountPath = path.resolve(
    __dirname,
    '../../../../apps/battle-link-api/data/serviceAccountKey.json',
  );
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return admin.credential.cert(require(serviceAccountPath));
}
