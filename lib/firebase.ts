import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  // Mock Firebase config - replace with real values when deploying
  apiKey: "mock-api-key",
  authDomain: "edenred-demo.firebaseapp.com",
  projectId: "edenred-demo",
  storageBucket: "edenred-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app
