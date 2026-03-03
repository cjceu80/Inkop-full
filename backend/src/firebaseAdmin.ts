import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    // Uses GOOGLE_APPLICATION_CREDENTIALS or other default credentials.
    credential: admin.credential.applicationDefault(),
  })
}

export { admin }

