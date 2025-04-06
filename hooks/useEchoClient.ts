import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let echoInstance: Echo<any> | null = null;

export const getEcho = async (): Promise<Echo<any>> => {
  if (echoInstance) return echoInstance;

  const socketKey = process.env.EXPO_PUBLIC_SOCKET_KEY || "";
  const token = await AsyncStorage.getItem("@token");

  const PusherClient = new Pusher(socketKey, {
    cluster: "mt1",
    wsHost: process.env.EXPO_PUBLIC_SOCKET_URL,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
    disableStats: true,
    authEndpoint: `${process.env.EXPO_PUBLIC_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  echoInstance = new Echo({
    broadcaster: "reverb",
    client: PusherClient,
  });

  return echoInstance;
};
