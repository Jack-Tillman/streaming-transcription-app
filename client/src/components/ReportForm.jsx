import React, { useState, useEffect } from "react";
import { jsonGPT } from "../api/api";
import {
  getBetterToken,
  makeComposition,
  showComposition,
} from "../utils/utils.js";
import "../styles/forms.css";
import { useLoading } from "../contexts/LoadingContext";
import Loading from "./Loading";

const ReportForm = ({
  report,
  setJson,
  json,
  databaseEntry,
  setDatabaseEntry,
  handleProgress
}) => {
  const [formData, setFormData] = useState({
    report: "",
  });
  const [isFormReady, setIsFormReady] = useState(false);
  const { setLoading, isLoading } = useLoading();

  useEffect(() => {
    if (!report) {
      setLoading(true);
    } else {
      setFormData({ report: report });
      setIsFormReady(true);
      setLoading(false);
    }
  }, [report, setLoading]);

  const handleChange = (e) => {
    setFormData({ report: e.target.value });
    setIsFormReady(e.target.value.trim() !== "");
  };

  const handleProcessReport = async (jsonResponse) => {
    try {
      const token = await getBetterToken();
      if (!token) {
        console.error("Failed to obtain token");
        return;
      }
      const composition = await makeComposition(token, jsonResponse);
      handleProgress();
      const recentComposition = await showComposition(token);
      setDatabaseEntry(recentComposition);
    } catch (error) {
      console.error("Error processing report:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormReady) {
      alert("Please fill in the report.");
      return;
    }
    setLoading(true); 
    try {
      const response = await jsonGPT(formData);
      setJson(response);
      if (response) {
        handleProgress();
        await handleProcessReport(response);
      }
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
          <button
            type="submit"
            className="submit-btn btn"
            disabled={!isFormReady}
            style={{
              padding: "10px",
              cursor: isFormReady ? "pointer" : "not-allowed",
            }}
          >
            Insert Report
          </button>
        </form>
      )}
    </>
  );
};

export default ReportForm;
