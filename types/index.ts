export interface Category {
  id: string
  name: string
  icon: string
}

export interface Expert {
  id: string
  name: string
  profession: string
  verified: boolean
  price: string
  description: string
  rating: number
  image: string | null
  location?: string
  experience?: string
  completedJobs?: number
  contactNumber?: string
  email?: string
}

export interface Location {
  id: string
  name: string
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export interface Booking {
  id: string
  expertId: string
  expertName: string
  service: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
}

