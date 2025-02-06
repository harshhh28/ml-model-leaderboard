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
      className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span>{user.email?.split("@")[0]}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Models</h2>
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500">
              {userModels.length} models uploaded
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : userModels.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            You haven't uploaded any models yet
          </div>
        ) : (
          <div className="space-y-4">
            {userModels.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-gray-500">{model.description}</p>
                  <div className="text-sm text-gray-500">
                    F1 Score: {model.f1_score.toFixed(4)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteModel(model.id)}
                  className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
