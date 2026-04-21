import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceExpression = () => {
  const videoRef = useRef();
  const [emotion, setEmotion] = useState(""); // ✅ inside component

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  };

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]);
    detectExpressions();
  };

  const detectExpressions = () => {
    setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const expressions = detections[0]?.expressions;

      if (expressions) {
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setEmotion(maxExpression); // ✅ Step 6
      }

    }, 100);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="600" height="500" />
      <h2>Emotion: {emotion}</h2> {/* ✅ Step 7 */}
    </div>
  );
};

export default FaceExpression;