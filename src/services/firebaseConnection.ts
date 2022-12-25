import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCy0cF2J8TOFNwcIPGeeGCuTeJoN62Q-ZU',
  authDomain: 'boardapp-c53e5.firebaseapp.com',
  projectId: 'boardapp-c53e5',
  storageBucket: 'boardapp-c53e5.appspot.com',
  messagingSenderId: '812475969049',
  appId: '1:812475969049:web:c3f1b378ba4fe866aa4488',
  measurementId: 'G-YZY17CBL9C',
};

if (firebase.getApps().length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
