import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase/supabase";
import { motion } from "framer-motion";
import { Mail, User as UserIcon, Upload, Trash2 } from "lucide-react";

type UserModel = {
  id: string;
  name: string;
  description: string;
  f1_score: number;
  created_at: string;
};

export function UserProfile({ user }: { user: User }) {
  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserModels();
  }, []);

  const fetchUserModels = async () => {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserModels(data || []);
    } catch (error) {
      console.error("Error fetching user models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const { error } = await supabase
        .from("models")
        .delete()
        .eq("id", modelId);

      if (error) throw error;
      setUserModels(userModels.filter((model) => model.id !== modelId));
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Profile Card with gradient */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Profile
        </h2>
        <div className="space-y-6">
          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/80">
            <UserIcon className="w-6 h-6 text-indigo-500" />
            <span className="text-base sm:text-lg">
              {user.email?.split("@")[0]}
            </span>
          </motion.div>
          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/80">
            <Mail className="w-6 h-6 text-indigo-500" />
            <span className="text-base sm:text-lg">{user.email}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Models Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Models
          </h2>
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <Upload className="w-6 h-6 text-indigo-500" />
            <span className="text-base sm:text-lg text-gray-600">
              {userModels.length} models uploaded
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : userModels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 text-lg">
            You haven't uploaded any models yet
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {userModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {model.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {model.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                      F1 Score: {model.f1_score.toFixed(4)}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteModel(model.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
