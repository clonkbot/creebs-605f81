import { useConvexAuth } from "convex/react";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-amber-200/60 font-light tracking-widest text-sm">LOADING</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
}
