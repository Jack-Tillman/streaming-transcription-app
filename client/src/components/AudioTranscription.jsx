import React, { useState, useEffect, useRef } from "react";
import "../styles/audiotranscription.css";

const AudioTranscription = ({
  captions,
  setCaptions,
  isRecording,
  setIsRecording,
  fullTranscription,
  setFullTranscription,
}) => {


  const socket = useRef(null);
  const microphone = useRef(null);

  useEffect(() => {
    console.log("Setting up WebSocket connection...");
    socket.current = new WebSocket("ws://localhost:3001");

    socket.current.onopen = () => console.log("WebSocket connected");
    socket.current.onclose = () => console.log("WebSocket disconnected");
    socket.current.onerror = (error) => console.log("WebSocket error:", error);

    socket.current.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const data = JSON.parse(event.data);
      if (data.channel.alternatives[0].transcript !== "") {
        console.log(
          "Updating captions:",
          data.channel.alternatives[0].transcript
        );
        setCaptions(data.channel.alternatives[0].transcript);
      }
    };

    return () => {
      console.log("Closing WebSocket connection...");
      socket.current.close();
    };
  }, [setCaptions]);

  useEffect(() => {
    if (isRecording) {
      console.log("Appending to full transcription:", captions);
      setFullTranscription((prev) => `${prev}${captions} `);
    }
  }, [captions, isRecording, setFullTranscription]);

  const toggleRecording = async () => {
    if (isRecording) {
      microphone.current.stop();
      setIsRecording(false);
      console.log("Stopped recording.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        microphone.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        microphone.current.ondataavailable = (event) => {
          if (
            event.data.size > 0 &&
            socket.current.readyState === WebSocket.OPEN
          ) {
            socket.current.send(event.data);
          }
        };
        microphone.current.start(1000);
        setIsRecording(true);
        setCaptions(""); // Ensure captions are reset for the new session
        console.log("Started recording.");
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  return (
    <div className="content">
        <input
          type="checkbox"
          id="record"
          className="mic-checkbox"
          checked={isRecording}
          onChange={toggleRecording} // This line ensures the checkbox reflects the current recording state and can toggle it
        />
        <label htmlFor="record" className="mic-button">
          <div className="mic">
            <div className="mic-button-loader"></div>
            <div className="mic-base"></div>
          </div>
          <div className="button-message">
            <span>{isRecording ? "STOP" : "START"}</span>
          </div>
        </label>
   
    </div>
  );
};

export default AudioTranscription;
