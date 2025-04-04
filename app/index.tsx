"use client"
import { Redirect } from "expo-router"

export default function Index() {
  // Redirect to the welcome screen when the app first loads
  return <Redirect href="/welcome" />
}

