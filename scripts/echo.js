import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import Config from "react-native-config";

const REVERB_APP_KEY = "your-app-key";
const REVERB_HOST = "your-host.com";
const REVERB_PORT = 443;
const REVERB_SCHEME = "https";

const echo = new Echo({
  broadcaster: "reverb",
  key: REVERB_APP_KEY,
  wsHost: Config.API_URL,
  wsPort: REVERB_PORT,
  wssPort: REVERB_PORT,
  forceTLS: REVERB_SCHEME === "https",
  enabledTransports: ["ws", "wss"],
});

export default echo;
