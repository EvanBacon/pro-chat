import * as admin from 'firebase-admin';
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bute-e5df0.firebaseio.com',
});

export default admin;
