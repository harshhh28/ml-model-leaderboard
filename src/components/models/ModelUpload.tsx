import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase/supabase";
import { evaluateModel } from "../../lib/evaluator/modelEvaluator";

const downloadSampleCode = () => {
  const sampleCode = `from sklearn.ensemble import RandomForestClassifier
import numpy as np

def train_model():
    # This is just a dummy model for demonstration
    # In a real scenario, you would train on your actual data
    X_train = np.array([[1, 2], [2, 3], [3, 4], [4, 5]])
    y_train = np.array([0, 0, 1, 1])
    
    # Initialize and train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    return model
`;

  const blob = new Blob([sampleCode], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_model.py";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function ModelUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    try {
      setLoading(true);
      setError("");

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Please sign in to upload models");

      // Get the code content
      const codeContent = await file.text();

      // Evaluate the model
      const metrics = await evaluateModel(codeContent);

      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Math.random()}.py`;
      const { error: uploadError, data } = await supabase.storage
        .from("models")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create model record with calculated metrics
      const { error: dbError } = await supabase.from("models").insert({
        name,
        description,
        user_id: user.id,
        file_path: data.path,
        f1_score: metrics.f1_score,
        accuracy: metrics.accuracy,
        precision: metrics.precision,
        recall: metrics.recall,
      });

      if (dbError) throw dbError;

      // Reset form
      setFile(null);
      setName("");
      setDescription("");

      alert("Model uploaded and evaluated successfully!");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Model Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>
          Upload a Python file containing your ML model implementation. The
          model should:
        </p>
        <ul className="list-disc ml-5 mt-2">
          <li>Implement scikit-learn's BaseEstimator interface</li>
          <li>Include fit() and predict() methods</li>
          <li>Be compatible with numpy arrays</li>
        </ul>
        <p className="mt-2">
          Download the sample template below to see the expected format.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="model-file"
          accept=".py"
        />
        <label
          htmlFor="model-file"
          className="flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            {file ? file.name : "Click to upload Python model file (.py)"}
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {loading ? "Processing..." : "Upload Model"}
        </button>

        <button
          type="button"
          onClick={downloadSampleCode}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Download Sample Model Template
        </button>
      </div>
    </form>
  );
}
