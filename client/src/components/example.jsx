/* ReportForm.jsx */

import React, { useState, useEffect } from "react";
import { jsonGPT } from "../api/api";
import "../styles/forms.css";
import InsertData from "./InsertData";
import { useLoading } from "../contexts/LoadingContext";
import Loading from "./Loading";

const ReportForm = ({
  report,
  setJson,
  json,
  databaseEntry,
  setDatabaseEntry,
}) => {
  const [formData, setFormData] = useState({
    report: "", // Initialize with empty string
  });

  // Initially, consider the form not ready to submit until we verify the report is loaded.
  const [isFormReady, setIsFormReady] = useState(false);
  const { setLoading, isLoading } = useLoading();
  // Populate the text area with report on component mount
  useEffect(() => {
    if (!report) {
      setLoading(true);
    } else {
      setFormData({ report: report });
      setIsFormReady(true); // Only allow submissions once report is loaded
      setLoading(false);
    }
  }, [report, setLoading]);

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
    setLoading(true);
    try {
      console.log("form 38 formdata", formData);
      const response = await jsonGPT(formData);
      setJson(response);
      if (json){

      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form report-form" onSubmit={handleSubmit}>
      <label htmlFor="report" id="radiology-label">
        Radiology Report
      </label>
      <textarea
        id="report-textarea"
        className="form-textarea"
        name="report"
        value={formData.report}
        onChange={handleChange}
        required
      />
      {!json  ? (
        <button
          type="submit"
          className="submit-btn btn"
          disabled={!isFormReady}
          style={{
            padding: "10px",
            cursor: isFormReady ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      ) : (
        <InsertData
          json={json}
          databaseEntry={databaseEntry}
          setDatabaseEntry={setDatabaseEntry}
        />
      )}
    </form>
  );
};

export default ReportForm;


/* InsertData.jsx */

import React, { useEffect, useState } from "react";
import {
  getBetterToken,
  makeComposition,
  showComposition,
} from "../utils/utils.js";


const InsertData = ({ json, databaseEntry, setDatabaseEntry  }) => {

  const handleProcessReport = async () => {
    try {
      const token = await getBetterToken();
      if (!token) {
        console.error("Failed to obtain token");
        return;
      }

      // Assuming jsonString is the JSON string of the radiology report to be processed
      const composition = await makeComposition(token, json);
      console.log("Composition created:", composition);

      // Optionally, fetch the most recent composition
      const recentComposition = await showComposition(token);
      if (recentComposition){
        console.log(recentComposition);
        console.log(typeof recentComposition);
        setDatabaseEntry(recentComposition);
      }
      console.log("Most recent composition:", recentComposition);
    } catch (error) {
      console.error("Error processing report:", error);
    }
  };

  return (
    <button
      className="submit-btn btn"
      onClick={handleProcessReport}
    >
      Insert Data
    </button>
  );
};

export default InsertData;
