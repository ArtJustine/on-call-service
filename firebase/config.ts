import { initializeApp } from "firebase/app"
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { Platform } from "react-native"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQR3lfkpxqRFtVWlgnyJd1nxhCYRKiZYo",
  authDomain: "fixie-52851.firebaseapp.com",
  projectId: "fixie-52851",
  storageBucket: "fixie-52851.appspot.com", // Make sure this is correct
  messagingSenderId: "565245031723",
  appId: "1:565245031723:web:2e123bd6ef39ae5777816e",
  measurementId: "G-QZ2Z9QE1G1",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth with persistence
const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      })

const firestore = getFirestore(app)
const storage = getStorage(app)

// Enable offline persistence for Firestore
if (Platform.OS !== "web") {
  enableIndexedDbPersistence(firestore).catch((error) => {
    if (error.code === "failed-precondition") {
      console.warn("Firestore persistence can only be enabled in one tab at a time")
    } else if (error.code === "unimplemented") {
      console.warn("The current browser does not support offline persistence")
    }
  })
}

export { app, auth, firestore, storage }
