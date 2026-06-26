import { AuthProvider } from "./contexts/AuthContext";
import { GroupProvider } from "./contexts/GroupContext";
import { TripDataProvider } from "./contexts/TripDataContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <GroupProvider>
        <TripDataProvider>{children}</TripDataProvider>
      </GroupProvider>
    </AuthProvider>
  );
}
