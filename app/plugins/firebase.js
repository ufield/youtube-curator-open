const firebase = require('@firebase/app').default
require('@firebase/firestore')
require("firebase/functions")

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

if (!firebase.apps.length) {
  var app = firebase.initializeApp(firebaseConfig)
}
export const firestore = firebase.firestore(app)
export const functions = firebase.functions()
