import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, collection } from "firebase/firestore"
import { auth, firestore } from "../firebase/config"
import { Alert } from "react-native"

// User types
export type UserRole = "client" | "worker"

export interface UserData {
  uid: string
  email: string
  firstName?: string
  lastName?: string
  displayName: string
  photoURL?: string
  role: UserRole
  phoneNumber?: string
  location?: string
  profession?: string
  experience?: string
  createdAt: any
  updatedAt?: any
}

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  phoneNumber?: string,
  location?: string,
  profession?: string,
  experience?: string,
): Promise<UserData> => {
  try {
    console.log("Starting user registration process...")

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("User created in Firebase Auth:", user.uid)

    // Combine first and last name for displayName
    const displayName = `${firstName} ${lastName}`

    // Update profile with display name
    await updateProfile(user, { displayName })

    console.log("User profile updated with display name:", displayName)

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      displayName,
      role,
      phoneNumber,
      location,
      profession,
      experience,
      createdAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp for offline support
    }

    try {
      // Ensure the users collection exists
      const usersCollectionRef = collection(firestore, "users")

      console.log("Creating user document in Firestore...")
      // Use set with merge option to ensure it works even if document exists
      await setDoc(doc(usersCollectionRef, user.uid), userData, { merge: true })

      console.log("User document created successfully in Firestore")
    } catch (firestoreError) {
      console.error("Error saving user data to Firestore:", firestoreError)
      // Continue with authentication even if Firestore fails
      // We'll handle this case in the login flow
      Alert.alert(
        "Account Created",
        "Your account was created successfully, but we couldn't save all your profile data due to connectivity issues. Some features may be limited until you reconnect.",
        [{ text: "OK" }],
      )
    }

    return userData
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// Sign in existing user
export const signInUser = async (email: string, password: string): Promise<UserData | null> => {
  try {
    console.log("Attempting to sign in user:", email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log("User signed in:", user.uid)

    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(firestore, "users", user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        console.log("User data retrieved from Firestore")

        // Update last login time
        try {
          await updateDoc(doc(firestore, "users", user.uid), {
            lastLogin: new Date().toISOString(),
          })
        } catch (updateError) {
          console.error("Error updating last login time:", updateError)
          // Non-critical error, continue with login
        }

        return userData
      } else {
        console.log("No user document found in Firestore, creating minimal user data")
        // If no document exists (possibly due to previous offline registration),
        // create a minimal user document
        const minimalUserData: UserData = {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || email.split("@")[0],
          role: "client", // Default role
          createdAt: new Date().toISOString(),
        }

        try {
          await setDoc(doc(firestore, "users", user.uid), minimalUserData, { merge: true })
        } catch (setDocError) {
          console.error("Error creating minimal user document:", setDocError)
          // Continue with login using minimal data
        }

        return minimalUserData
      }
    } catch (firestoreError) {
      console.error("Error accessing Firestore:", firestoreError)

      // Create minimal user data from auth
      const minimalUserData: UserData = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split("@")[0],
        role: "client", // Default role
        createdAt: new Date().toISOString(),
      }

      Alert.alert(
        "Limited Access Mode",
        "You're signed in with limited access due to connectivity issues. Some features may not be available until you reconnect.",
        [{ text: "OK" }],
      )

      return minimalUserData
    }
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

// Sign out user
export const signOutUser = async (): Promise<void> => {
  try {
    console.log("Signing out user")
    await signOut(auth)
    console.log("User signed out successfully")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Get current user data
export const getCurrentUserData = async (): Promise<UserData | null> => {
  const user = auth.currentUser

  if (!user) {
    console.log("No user is currently signed in")
    return null
  }

  try {
    console.log("Getting data for current user:", user.uid)
    const userDoc = await getDoc(doc(firestore, "users", user.uid))

    if (userDoc.exists()) {
      console.log("User document found")
      return userDoc.data() as UserData
    }

    console.log("No user document found in Firestore, returning basic data from auth")
    // Return basic data from auth if Firestore document doesn't exist
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email?.split("@")[0] || "User",
      role: "client", // Default role
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting user data from Firestore:", error)
    // Return basic data from auth if Firestore fails
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email?.split("@")[0] || "User",
      role: "client", // Default role
      createdAt: new Date().toISOString(),
    }
  }
}

// Update user profile
export const updateUserProfile = async (userData: Partial<UserData>): Promise<void> => {
  const user = auth.currentUser

  if (!user) {
    console.log("No user is signed in")
    throw new Error("No user is signed in")
  }

  try {
    console.log("Updating user profile for:", user.uid)

    // Update displayName and photoURL in auth profile if provided
    if (userData.displayName || userData.photoURL) {
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      })
      console.log("Auth profile updated")
    }

    try {
      // Update user document in Firestore
      await updateDoc(doc(firestore, "users", user.uid), {
        ...userData,
        updatedAt: new Date().toISOString(),
      })

      console.log("User document updated in Firestore")
    } catch (firestoreError) {
      console.error("Error updating user document in Firestore:", firestoreError)
      Alert.alert(
        "Partial Update",
        "Your basic profile was updated, but we couldn't save all your data due to connectivity issues.",
        [{ text: "OK" }],
      )
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    console.log("Sending password reset email to:", email)
    await sendPasswordResetEmail(auth, email)
    console.log("Password reset email sent")
  } catch (error) {
    console.error("Error sending password reset:", error)
    throw error
  }
}

// Change password (requires reauthentication)
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser

  if (!user || !user.email) {
    throw new Error("No user is signed in or email is missing")
  }

  try {
    console.log("Reauthenticating user before password change")
    // Reauthenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    console.log("Updating password")
    // Update password
    await updatePassword(user, newPassword)
    console.log("Password updated successfully")
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

