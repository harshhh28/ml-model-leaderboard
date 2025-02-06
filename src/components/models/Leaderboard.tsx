import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trophy, Download } from "lucide-react";
import { supabase } from "../../lib/supabase/supabase";

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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Model Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              F1 Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accuracy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precision
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recall
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {models.map((model, index) => (
            <tr key={model.id} className={index === 0 ? "bg-yellow-50" : ""}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {index === 0 && (
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  )}
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {model.name}
                </div>
                {model.description && (
                  <div className="text-sm text-gray-500">
                    {model.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {model.f1_score?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {model.accuracy?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {model.precision?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {model.recall?.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(model.created_at), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => handleDownload(model.file_path, model.name)}
                  className="text-indigo-600 hover:text-indigo-900">
                  <Download className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
