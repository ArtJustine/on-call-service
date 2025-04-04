import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, firestore } from "../firebase/config"

// User types
export type UserRole = "client" | "worker"

export interface UserData {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  phoneNumber?: string
  location?: string
  createdAt: number
}

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  phoneNumber?: string,
  location?: string,
): Promise<UserData> => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    await updateProfile(user, { displayName })

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName,
      role,
      phoneNumber,
      location,
      createdAt: Date.now(),
    }

    await setDoc(doc(firestore, "users", user.uid), userData)

    return userData
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// Sign in existing user
export const signInUser = async (email: string, password: string): Promise<UserData | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(firestore, "users", user.uid))

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }

    return null
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Get current user data
export const getCurrentUserData = async (): Promise<UserData | null> => {
  const user = auth.currentUser

  if (!user) return null

  try {
    const userDoc = await getDoc(doc(firestore, "users", user.uid))

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }

    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (userData: Partial<UserData>): Promise<void> => {
  const user = auth.currentUser

  if (!user) throw new Error("No user is signed in")

  try {
    // Update displayName and photoURL in auth profile if provided
    if (userData.displayName || userData.photoURL) {
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      })
    }

    // Update user document in Firestore
    await setDoc(doc(firestore, "users", user.uid), userData, { merge: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

