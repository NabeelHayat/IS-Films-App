// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->

// <script>
//   // Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyCXYGtOcEyTdyJGYdO72aJy8qj9Q3dxR-o",
//     authDomain: "is-films-app.firebaseapp.com",
//     projectId: "is-films-app",
//     storageBucket: "is-films-app.appspot.com",
//     messagingSenderId: "1015486515504",
//     appId: "1:1015486515504:web:df2c628b3c4ff8872220f5"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
// </script>
// https://firebasestorage.googleapis.com/is-films-app.appspot.com/Screenshot 2020-12-28 at 3.41.07 PM.png

import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'is-films-app.appspot.com'
});

// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
  bucket
};
