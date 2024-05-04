import React, { useState, useEffect } from "react";
import { chatWithGPT } from "../api/api";
import "../styles/forms.css";
import { useLoading } from "../contexts/LoadingContext";
import Loading from "./Loading";
import Textfield  from "./Textfield";
import OutlinedButtons from "./Button";

const TranscriptionForm = ({
  fullTranscription,
  setReport,
  showRecord,
  setShowRecord,
  handleProgress,
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

          <Textfield
            id="fullWidth"
            label="Transcription"
            variant="outlined"
            value={formData.transcription}
            onChange={handleChange}
          />

          {/* <textarea
            id="transcription-textarea"
            className="form-textarea"
            name="transcription"
            value={formData.transcription}
            onChange={handleChange}
            required
          /> */}
          <OutlinedButtons 
          type="submit"
          disabled={!isFormReady}
          text={"Make Report"}
        
          />
          {/* <button
            type="submit"
            className="submit-btn btn"
            disabled={!isFormReady}
            style={{
              padding: "10px",
              cursor: isFormReady ? "pointer" : "not-allowed",
            }}
          >
            Make Report
          </button> */}
        </form>
      )}
    </>
  );
};

export default TranscriptionForm;


/* 

"X-ray of the lumbar and sacral spine. Patient present with a history of poor posture and pain in the left hip. X-ray imaging was utilized. Prior x-ray dated March 16 2022 available for comparison? Findings. 1. Pelican leveling is present, prominent on the right side. 2 mild level scoliosis at the thoraculumbar region to the right, with Apex atlone 3. S 1 exhibits mild transitional signal characteristics but appears to be functionally sacrum. 4 No abnormality detected in the sacroiliac joints bilaterally. 5, mild left posterior pelvic rotation observed, 6 Schmorals nodes present at l3dash4disclevel. 7 Sacral Schmorals nodes also noted at l3dash4. 8 disguise are maintained? 9 No acute fracture or osteopathology noted. Impressions, 1. Pastural changes are visible. To mild low scoliosis, the Thraculumbar region to the right? 3. Presence of Schmarshal's note at the L3 dash 4 disc level. "


*/