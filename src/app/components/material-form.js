// I:\FromGit\Wall-Damage-Analysis-and-Cost-Estimation-project\src\app\components\material-form.js
"use client";

import { useState } from "react";

export default function MaterialForm({ onSubmit }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && onSubmit) {
      onSubmit(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Image Upload</h2>
      <div>
        <label htmlFor="image" className="block mb-1 font-medium text-gray-700">
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        disabled={!file}
      >
        Upload
      </button>
    </form>
  );
}
