import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebase-config.json" assert { type: "json" };

let app: FirebaseApp;
let auth: Auth;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);

  // Set up a listener for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, set up a timer to refresh the token
      const tokenRefreshTimer = setInterval(async () => {
        try {
          await user.getIdToken(true);
          console.log("Token refreshed");
        } catch (error) {
          console.error("Failed to refresh token", error);
          clearInterval(tokenRefreshTimer);
        }
      }, 10 * 60 * 1000); // Refresh every 10 minutes
    }
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error; // Re-throw the error to be caught by error boundaries
}

export { auth };
