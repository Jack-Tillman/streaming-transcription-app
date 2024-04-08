import React, { useState, useEffect, useRef } from "react";
import {
  getBetterToken,
  makeComposition,
  transformRadiologyReport,
} from "../utils/utils";

const AudioTranscriptionComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [captions, setCaptions] = useState("");
  const [fullTranscription, setFullTranscription] = useState("");
  //   const [jsonResponse, setJsonResponse] = useState('');
  //   const [betterResponse, setBetterResponse] = useState('');
  //   const [ehrResponse, setEhrResponse] = useState('');
  const socket = useRef(null);
  const microphone = useRef(null);

  // WebSocket connection setup
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3001");

    socket.current.addEventListener("open", async () => {
      console.log("client: connected to server");
      // Your code to handle the socket connection opening
    });

    socket.current.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.channel.alternatives[0].transcript !== "") {
        setCaptions(data.channel.alternatives[0].transcript);
      }
    });

    socket.current.addEventListener("close", () => {
      console.log("client: disconnected from server");
    });
    return () => {
      socket.current.close();
    };
  }, []);
  // each update of captions, add the state of captions to previous state of FulLTranscription
  useEffect(() => {
    if (isRecording) {
      setFullTranscription(
        (prevFullTranscription) => prevFullTranscription + captions + " "
      );
    }
  }, [captions]);

  // Microphone handling
  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
    } catch (error) {
      console.error("error accessing microphone:", error);
      throw error;
    }
  };

  const openMicrophone = async () => {
    await getMicrophone();
    microphone.current.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(event.data);
      }
    };
    microphone.current.start(1000);
    setIsRecording(true);
  };

  const closeMicrophone = () => {
    microphone.current.stop();
    setIsRecording(false);
  };

  // Simplified for demonstration
  // You will need to add more logic here based on your application's needs
  return (
    <div>
      <button onClick={!isRecording ? openMicrophone : closeMicrophone}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <div id="captions">{captions}</div>
      <div id="full-transcription">{fullTranscription}</div>
      {/* Render other elements like jsonResponse, betterResponse, ehrResponse as needed */}
    </div>
  );
};

export default AudioTranscriptionComponent;
