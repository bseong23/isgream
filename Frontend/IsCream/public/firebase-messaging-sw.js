/* eslint-env serviceworker */
/* global importScripts, firebase, self, console */
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCP8mGauQdHF9Wb6_r6ZDH7CcANiOEmjE",
  authDomain: "ssafy-449307.firebaseapp.com",
  projectId: "ssafy-449307",
  storageBucket: "ssafy-449307.firebasestorage.app",
  messagingSenderId: "500251459785",
  appId: "1:500251459785:web:957c50a189ad224f450d18"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
