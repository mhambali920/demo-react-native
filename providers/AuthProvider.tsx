import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

const AuthContext = createContext<{
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  token: MutableRefObject<string | null> | null;
  user: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  token: null,
  user: null,
  isLoading: true,
});

// Access the context as a hook
export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const tokenRef = useRef<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const token = await AsyncStorage.getItem("@token");
      const userJson = await AsyncStorage.getItem("@user");
      tokenRef.current = token || "";

      if (userJson) {
        setUser(JSON.parse(userJson));
      }

      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (token: string, user: User) => {
    await AsyncStorage.setItem("@token", token);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    tokenRef.current = token;
    setUser(user);
    router.replace("/");
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");

    tokenRef.current = null;
    setUser(null);
    router.replace("/login");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        token: tokenRef,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
