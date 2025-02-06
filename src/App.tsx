import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { ModelUpload } from "./components/models/ModelUpload";
import { Leaderboard } from "./components/models/Leaderboard";
import { Auth } from "./components/auth/Auth";
import { supabase } from "./lib/supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "./components/profile/UserProfile";
import { Navbar } from "./components/navigation/Navbar";

function App() {
  const [activeTab, setActiveTab] = useState<
    "upload" | "leaderboard" | "profile"
  >("leaderboard");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Checking auth session...");
    // Check current session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("Session data:", session);
        setUser(session?.user ?? null);
      })
      .catch((error) => {
        console.error("Auth session error:", error);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  if (!user) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-8">
            <Brain className="w-10 h-10 text-indigo-600" />
            <span className="ml-3 text-2xl font-bold text-gray-900">
              ML Model Leaderboard
            </span>
          </div>
          <Auth />
        </div>
      </motion.div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.2 }}>
            {activeTab === "upload" ? (
              <ModelUpload />
            ) : activeTab === "profile" ? (
              <UserProfile user={user} />
            ) : (
              <Leaderboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
