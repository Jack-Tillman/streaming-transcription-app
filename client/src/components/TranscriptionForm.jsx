import React, { useState, useEffect } from "react";
import { chatWithGPT } from "../api/api";
import "../styles/forms.css";
import { useLoading } from "../contexts/LoadingContext";
import Loading from "./Loading";

const TranscriptionForm = ({
  fullTranscription,
  setReport,
  showRecord,
  setShowRecord,
  handleProgress
}) => {
  const [formData, setFormData] = useState({
    transcription: "", // Initialize with empty string
  });
  const { setLoading, isLoading } = useLoading();
  // Initially, consider the form not ready to submit until we verify the transcription is loaded.
  const [isFormReady, setIsFormReady] = useState(false);

  // Populate the text area with fullTranscription on component mount
  useEffect(() => {
    if (!fullTranscription) {
      setLoading(true);
    } else {
      setFormData({ transcription: fullTranscription });
      setIsFormReady(true); // Only allow submissions once fullTranscription is loaded
      setLoading(false);
    }
  }, [fullTranscription, setLoading]);

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
    setLoading(true);
    try {
      console.log("form 38 formdata", formData);
      const response = await chatWithGPT(formData);
      setReport(response);
      handleProgress();
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <form className="form transcription-form" onSubmit={handleSubmit}>
          <label htmlFor="transcription" id="transcription-label">
            Edit Your Transcription Below
          </label>
          <textarea
            id="transcription-textarea"
            className="form-textarea"
            name="transcription"
            value={formData.transcription}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="submit-btn btn"
            disabled={!isFormReady}
            style={{
              padding: "10px",
              cursor: isFormReady ? "pointer" : "not-allowed",
            }}
          >
            Make Report
          </button>
        </form>
      )}
    </>
  );
};

export default TranscriptionForm;
