"use client";

import { InferenceEngine, CVImage } from "inferencejs";
import { useEffect, useRef, useState, useMemo } from "react";
import MaterialForm from "./components/material-form";

function App() {
  const inferEngine = useMemo(() => {
    return new InferenceEngine();
  }, []);

  const [modelWorkerId, setModelWorkerId] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predictionsList, setPredictionsList] = useState([]); // ✅ New state

  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (!modelLoading) {
      setModelLoading(true);
      inferEngine
        .startWorker("wall-damage-detection", "1", "rf_JxQJZ3g98BRqZKzDm9tt8fZCWHB3")
        .then((id) => setModelWorkerId(id));
    }
  }, [inferEngine, modelLoading]);

  useEffect(() => {
    if (modelWorkerId) {
      startWebcam();
    }
  }, [modelWorkerId]);

  const startWebcam = () => {
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };

      videoRef.current.onplay = () => {
        const ctx = canvasRef.current.getContext("2d");

        const height = videoRef.current.videoHeight;
        const width = videoRef.current.videoWidth;

        videoRef.current.width = width;
        videoRef.current.height = height;

        canvasRef.current.width = width;
        canvasRef.current.height = height;

        ctx.scale(1, 1);

        detectFrame();
      };
    });
  };

  const detectFrame = () => {
    if (!modelWorkerId) return setTimeout(detectFrame, 100 / 3);

    const img = new CVImage(videoRef.current);
    inferEngine.infer(modelWorkerId, img).then((predictions) => {
      setPredictionsList(predictions); // ✅ Update UI state

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];

        ctx.strokeStyle = prediction.color;

        const x = prediction.bbox.x - prediction.bbox.width / 2;
        const y = prediction.bbox.y - prediction.bbox.height / 2;
        const width = prediction.bbox.width;
        const height = prediction.bbox.height;

        ctx.rect(x, y, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fill();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = "4";
        ctx.strokeRect(x, y, width, height);

        const text = ctx.measureText(
          prediction.class + " " + Math.round(prediction.confidence * 100) + "%"
        );
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x - 2, y - 30, text.width + 4, 30);
        ctx.font = "15px monospace";
        ctx.fillStyle = "black";
        ctx.fillText(
          prediction.class + " " + Math.round(prediction.confidence * 100) + "%",
          x,
          y - 10
        );
      }

      setTimeout(detectFrame, 100 / 3);
    });
  };

  return (
    <>
      <div className="w-full max-w-full px-4 mt-30">
        {/* Webcam */}
        <div className="relative w-full max-w-md mx-auto aspect-video">
          <video
            id="video"
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          <canvas
            id="canvas"
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>

        <div className="flex justify-center my-5">
          <button className="bg-foreground hover:bg-primary text-white px-30 py-3 rounded">
             Calculate
          </button>
        </div>

        {/* Show predictions */}
        <div className="max-w-md mx-auto p-4 mt-6 my-5  bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold text-center mb-5">Detected Predictions</h2>
          <ul className="space-y-2">
            {predictionsList.map((prediction, index) => (
              <li key={index} className="text-sm text-gray-800">
                {prediction.class} — {Math.round(prediction.confidence * 100)}%
              </li>
            ))}
          </ul>
        </div>

        {/* Form section */}
        <section id="settings">
          <MaterialForm />
        </section>
      </div>
    </>
  );
}

export default App;
