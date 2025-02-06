import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trophy, Download } from "lucide-react";
import { supabase } from "../../lib/supabase/supabase";
import { motion } from "framer-motion";

type Model = {
  id: string;
  name: string;
  description: string;
  f1_score: number;
  accuracy: number;
  precision: number;
  recall: number;
  created_at: string;
  file_path: string;
};

export function Leaderboard() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .order("f1_score", { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string, modelName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("models")
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = modelName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading model:", error);
    }
  };

  const headers = [
    "Rank",
    "Model Name",
    "F1 Score",
    "Accuracy",
    "Precision",
    "Recall",
    "Uploaded",
    "Actions",
  ];

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8">
      {" "}
      {/* Add outer padding container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-8" // Add bottom margin
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className={`
                      px-3 sm:px-6 py-3 
                      text-left text-xs sm:text-sm 
                      font-medium text-white 
                      uppercase tracking-wider
                      ${
                        header === "Accuracy" || header === "Precision"
                          ? "hidden lg:table-cell"
                          : ""
                      }
                    `}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {models.map((model, index) => (
                <motion.tr
                  key={model.id}
                  whileHover={{ scale: 1.01 }}
                  className={`transition-colors hover:bg-gray-100 ${
                    index === 0 ? "bg-yellow-50" : ""
                  }`}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && (
                        <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                      )}
                      <span className="text-lg font-medium">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm sm:text-base font-medium text-gray-900">
                      {model.name}
                    </div>
                    {model.description && (
                      <div className="text-xs sm:text-sm text-gray-500">
                        {model.description}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {model.f1_score?.toFixed(4)}
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.accuracy?.toFixed(4)}
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.precision?.toFixed(4)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.recall?.toFixed(4)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(model.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleDownload(model.file_path, model.name)
                      }
                      className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors">
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
