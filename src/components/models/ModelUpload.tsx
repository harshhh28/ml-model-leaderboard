/*
 * Model Upload Component
 * ---------------------
 * This component allows users to upload machine learning models for evaluation.
 *
 * Requirements:
 * 1. Model must be a Python file (.py)
 * 2. File must contain a train_model() function
 * 3. train_model() must return a scikit-learn compatible model
 *
 * Example Usage:
 * ```python
 * def train_model():
 *     model = RandomForestClassifier()
 *     model.fit(X_train, y_train)
 *     return model
 * ```
 */

import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase/supabase";
import { evaluateModel } from "../../lib/evaluator/modelEvaluator";
import { motion } from "framer-motion";

const MODEL_REQUIREMENTS = [
  "File must be a Python (.py) file",
  "Must contain a train_model() function",
  "Model must be scikit-learn compatible",
  "Should return a trained model object",
];

const downloadSampleCode = () => {
  const sampleCode = `"""
Example Model Template
---------------------
This is a sample template showing how to structure your model file.
Your file must include a train_model() function that returns a trained model.

Required imports:
- scikit-learn
- numpy (optional)
- pandas (optional)
"""

from sklearn.ensemble import RandomForestClassifier
import numpy as np

def train_model():
    """
    Train and return a machine learning model.
    Returns: A trained scikit-learn compatible model
    """
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
  const [nameError, setNameError] = useState<string>("");

  const validateModelName = (name: string) => {
    if (name.length <= 2) {
      setNameError("Model name must be longer than 2 characters");
    } else {
      setNameError("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    validateModelName(newName);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate model name length
    if (name.length <= 2) {
      setNameError("Model name must be longer than 2 characters");
      return;
    }

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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleUpload}
      className="space-y-8 max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg">
      {/* Requirements Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-base sm:text-lg font-medium text-blue-800 mb-2">
          Requirements:
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {MODEL_REQUIREMENTS.map((req, index) => (
            <li key={index} className="text-xs sm:text-sm text-blue-600">
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
            Model Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${nameError ? "border-red-500" : ""}`}
            placeholder="Enter model name"
          />
          {nameError && (
            <p className="mt-2 text-sm text-red-600">{nameError}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            rows={4}
          />
        </div>

        {/* Update the file upload area */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border-3 border-dashed border-indigo-200 rounded-xl p-8 bg-indigo-50/50">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="model-file"
            accept=".py"
          />
          <label
            htmlFor="model-file"
            className="flex flex-col items-center justify-center cursor-pointer gap-4">
            <Upload className="w-16 h-16 text-indigo-500" />
            <span className="text-base sm:text-lg text-gray-600 text-center">
              {file ? file.name : "Click to upload Python model file (.py)"}
            </span>
          </label>
        </motion.div>

        {/* Error message styling */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-600">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="text-sm sm:text-base font-medium">
                Error uploading model:
              </p>
              <p className="text-xs sm:text-sm">{error}</p>
              <p className="text-sm mt-1">
                Please check the requirements above and try again.
              </p>
            </div>
          </motion.div>
        )}

        {/* Button group */}
        <div className="space-y-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Processing..." : "Upload Model"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={downloadSampleCode}
            className="w-full py-3 px-6 text-lg font-medium text-indigo-600 bg-white border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors">
            Download Sample Template
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
