import { useState } from "react";
import { Brain, LogOut, Menu, X, Layout, Upload, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type NavbarProps = {
  user: SupabaseUser;
  activeTab: "upload" | "leaderboard" | "profile";
  setActiveTab: (tab: "upload" | "leaderboard" | "profile") => void;
  onSignOut: () => void;
};

export function Navbar({
  user,
  activeTab,
  setActiveTab,
  onSignOut,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "leaderboard", label: "Leaderboard", icon: Layout },
    { id: "upload", label: "Upload Model", icon: Upload },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                ML Model Leaderboard
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-indigo-50"
                    }`}>
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignOut}
              className="inline-flex items-center px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id as typeof activeTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-indigo-600 text-white"
                        : "text-gray-500 hover:bg-indigo-50"
                    }`}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </motion.button>
                );
              })}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
