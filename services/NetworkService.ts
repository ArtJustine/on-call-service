import NetInfo from "@react-native-community/netinfo"

// Check if the device is connected to the internet
export const isConnected = async (): Promise<boolean> => {
  const state = await NetInfo.fetch()
  return state.isConnected === true
}

// Subscribe to network state changes
export const subscribeToNetworkChanges = (callback: (isConnected: boolean) => void): (() => void) => {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected === true)
  })
}

