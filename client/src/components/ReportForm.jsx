import React, { useState, useEffect } from "react";
import { jsonGPT } from "../api/api";
import "../styles/forms.css"
import InsertData from "./InsertData";


const ReportForm = ({ report, setJson, json }) => {
  const [formData, setFormData] = useState({
    report: "", // Initialize with empty string
  });

  // Initially, consider the form not ready to submit until we verify the report is loaded.
  const [isFormReady, setIsFormReady] = useState(false);

  // Populate the text area with report on component mount
  useEffect(() => {
    if (report) {
      setFormData({ report: report });
      setIsFormReady(true); // Only allow submissions once report is loaded
    }
  }, [report]);

  // Handle changes in the text area
  const handleChange = (e) => {
    setFormData({ report: e.target.value });
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
      alert("Please fill in the report.");
      return;
    }

    try {
      console.log("form 38 formdata", formData);

      const response = await jsonGPT(formData);
      //   const data = await response.json();
      if (response) {
        setJson(response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <form
    className="form report-form"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "500px",
      }}
    >
      <label htmlFor="report">Report</label>
      <textarea
        id="report-textarea"
        className="form-textarea"
        name="report"
        value={formData.report}
        onChange={handleChange}
        required
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
      {json && <InsertData json={json} />}
    </form>
  );
};

export default ReportForm;
