"use client";

import { InferenceEngine, CVImage } from "inferencejs";
import { useEffect, useRef, useState, useMemo } from "react";
import MaterialForm from "./components/material-form";

export default function Home() {
  const inferEngine = useMemo(() => new InferenceEngine(), []);
  const [modelWorkerId, setModelWorkerId] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predictionsList, setPredictionsList] = useState([]);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef();

  // Your damage cost rates in LKR
  const damageCostRates = {
    crack_damages: 5000,
    flaking_paint: 7000,
    water_damage: 2000,
    missing_piece: 25000,
  };

  useEffect(() => {
    if (!modelLoading) {
      setModelLoading(true);
      inferEngine
        .startWorker(
          "wall-damage-detection",
          "1",
          process.env.NEXT_PUBLIC_INFERENCE_API_KEY
        )
        .then((id) => setModelWorkerId(id))
        .catch((err) => setError("Failed to load model: " + err.message));
    }
  }, [inferEngine, modelLoading]);

  const handleImageUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    setPredictionsList([]);
    setUploadedImage(null);

    try {
      if (!file.type.startsWith("image/"))
        throw new Error("File is not an image");
      if (file.size > 15 * 1024 * 1024)
        throw new Error("Image size exceeds 15MB");

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setUploadedImage(img);
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        processImage(img);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setError("Failed to load image.");
        setIsProcessing(false);
      };
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const processImage = (img) => {
    const cvImage = new CVImage(img);
    inferEngine
      .infer(modelWorkerId, cvImage)
      .then((predictions) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);

        const predictionsWithCost = predictions.map((prediction) => {
          const { width, height } = prediction.bbox;
          const pixelArea = width * height;
          const damageType = prediction.class;
          const rate = damageCostRates[damageType] || 0;

          // Fixed cost per damage type, no area scaling
          const estimatedCost = rate;

          return {
            ...prediction,
            pixelArea,
            estimatedCost,
          };
        });

        setPredictionsList(predictionsWithCost);

        for (const prediction of predictionsWithCost) {
          const { width, height } = prediction.bbox;
          const x = prediction.bbox.x - width / 2;
          const y = prediction.bbox.y - height / 2;

          ctx.strokeStyle = prediction.color || "red";
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          const label = `${prediction.class} (${Math.round(
            prediction.confidence * 100
          )}%)`;
          ctx.font = "15px monospace";
          const text = ctx.measureText(label);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fillRect(x - 2, y - 30, text.width + 4, 30);
          ctx.fillStyle = "black";
          ctx.fillText(label, x, y - 10);
        }
      })
      .catch((err) => {
        setError("Image processing failed: " + err.message);
        setPredictionsList([]);
        setUploadedImage(null);
        setIsProcessing(false);
      });
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(predictionsList, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Total cost calculation
  const totalEstimatedCost = predictionsList.reduce(
    (acc, p) => acc + p.estimatedCost,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-20 min-h-screen flex flex-col items-center">
      {isProcessing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-4 mb-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="relative w-full max-w-md mx-auto aspect-video">
        {uploadedImage && (
          <img
            src={uploadedImage.src}
            className="w-full h-full object-cover"
            alt="Uploaded"
          />
        )}
        <canvas
          id="canvas"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <div className="max-w-md mx-auto p-4 mt-6 my-5 bg-gray-100 rounded shadow">
        <h2 className="text-xl font-bold text-center mb-5">Detected Damage</h2>
        {predictionsList.length === 0 && (
          <p className="text-sm text-gray-800 mb-2">
            No damage detected yet. Upload an image to start.
          </p>
        )}
        <ul className="space-y-3">
          {predictionsList.map((prediction, index) => (
            <li key={index} className="text-sm text-gray-800">
              <strong>{prediction.class}</strong> —{" "}
              {Math.round(prediction.confidence * 100)}% — Pixel Area:{" "}
              {prediction.pixelArea} px² — Estimated Cost: LKR{" "}
              {prediction.estimatedCost.toLocaleString()}
            </li>
          ))}
        </ul>

        {predictionsList.length > 0 && (
          <>
            <div className="mt-4 font-bold text-lg text-center">
              Total Estimated Repair Cost: LKR{" "}
              {totalEstimatedCost.toLocaleString()}
            </div>

            <button
              onClick={handleDownloadJson}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded shadow"
            >
              Download JSON Results
            </button>

            <details className="mt-4 text-sm bg-white p-3 rounded shadow max-h-64 overflow-y-auto">
              <summary className="font-medium cursor-pointer">
                Raw Prediction Output (JSON)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {JSON.stringify(predictionsList, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>

      <section id="settings">
        <MaterialForm onSubmit={handleImageUpload} />
      </section>
    </div>
  );
}
