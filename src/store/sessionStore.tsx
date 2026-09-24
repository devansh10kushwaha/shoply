import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type UserRole = "customer" | "supplier";

interface SessionContextType {
  role: UserRole | null;
  isLoading: boolean;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
}

const SESSION_ROLE_KEY = "shoply-active-role";

const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem(SESSION_ROLE_KEY);

        if (storedRole === "customer" || storedRole === "supplier") {
          setRoleState(storedRole);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void restoreRole();
  }, []);

  const setRole = async (nextRole: UserRole) => {
    await AsyncStorage.setItem(SESSION_ROLE_KEY, nextRole);
    setRoleState(nextRole);
  };

  const clearRole = async () => {
    await AsyncStorage.removeItem(SESSION_ROLE_KEY);
    setRoleState(null);
  };

  return (
    <SessionContext.Provider
      value={{ role, isLoading, setRole, clearRole }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return context;
}
