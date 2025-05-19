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
    console.log("Model Worker ID: " + modelWorkerId);
    if (modelWorkerId) {
      startWebcam();
    }
  }, [modelWorkerId]);

  const startWebcam = () => {
    var constraints = {
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "environment",
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = function () {
        videoRef.current.play();
      };

      videoRef.current.onplay = () => {
        var ctx = canvasRef.current.getContext("2d");

        var height = videoRef.current.videoHeight;
        var width = videoRef.current.videoWidth;

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
    if (!modelWorkerId) setTimeout(detectFrame, 100 / 3);

    const img = new CVImage(videoRef.current);
    inferEngine.infer(modelWorkerId, img).then((predictions) => {
      var ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (var i = 0; i < predictions.length; i++) {
        console.log(predictions[i]);
        var prediction = predictions[i];

        // draw detections
        ctx.strokeStyle = prediction.color;

        var x = prediction.bbox.x - prediction.bbox.width / 2;
        var y = prediction.bbox.y - prediction.bbox.height / 2;
        var width = prediction.bbox.width;
        var height = prediction.bbox.height;

        ctx.rect(x, y, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fill();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = "4";
        ctx.strokeRect(x, y, width, height);

        var text = ctx.measureText(
          prediction.class + " " + Math.round(prediction.confidence * 100) + "%"
        );
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x - 2, y - 30, text.width + 4, 30);
        ctx.font = "15px monospace";
        ctx.fillStyle = "black";
        ctx.fillText(
          prediction.class +
            " " +
            Math.round(prediction.confidence * 100) +
            "%",
          x,
          y - 10
        );
      }

      setTimeout(detectFrame, 100 / 3);
    });
  };
  return (
  <>
    
    <div className="w-full max-w-full px-4 mt-20">
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

      <section id="settings"> 
        <MaterialForm />
      </section>

    </div>
  </>

  );
}

export default App;
