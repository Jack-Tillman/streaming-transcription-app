import React, { useState, useEffect } from "react";
import { chatWithGPT } from "../api/api";
const Form = ({ fullTranscription, setReport }) => {
  const [formData, setFormData] = useState({
    transcription: "", // Initialize with empty string
  });

  // Initially, consider the form not ready to submit until we verify the transcription is loaded.
  const [isFormReady, setIsFormReady] = useState(false);

  // Populate the text area with fullTranscription on component mount
  useEffect(() => {
    if (fullTranscription) {
      setFormData({ transcription: fullTranscription });
      setIsFormReady(true); // Only allow submissions once fullTranscription is loaded
    }
  }, [fullTranscription]);

  // Handle changes in the text area
  const handleChange = (e) => {
    setFormData({ transcription: e.target.value });
    if (e.target.value.trim() !== "") {
      setIsFormReady(true);
    } else {
      setIsFormReady(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady) {
      alert("Please fill in the transcription.");
      return;
    }

    try {
      console.log("form 38 formdata", formData);

      const response = await chatWithGPT(formData);
      //   const data = await response.json();
      if (response) {
        setReport(response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "500px",
      }}
    >
      <label htmlFor="transcription">Transcription</label>
      <textarea
        id="transcription"
        name="transcription"
        value={formData.transcription}
        onChange={handleChange}
        required
        style={{ width: "100%", height: "300px", padding: "8px" }}
      />
      <button
        type="submit"
        disabled={!isFormReady}
        style={{
          padding: "10px",
          cursor: isFormReady ? "pointer" : "not-allowed",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
