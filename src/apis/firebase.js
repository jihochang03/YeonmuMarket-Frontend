import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { saveFCMToken } from "./api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FCM_VAPID_KEY,
    });
    if (token) {
      console.log("FCM Token:", token);
      // FCM 토큰을 백엔드로 전송 (Django 서버)
      saveFCMToken(token);
    } else {
      console.log("No FCM token available");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// 메시지 수신 처리
export const onPushNotificationReceived = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    callback(payload.notification);
  });
};

// onBackgroundMessage(messaging, (payload) => {
//   console.log("Received background message: ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
