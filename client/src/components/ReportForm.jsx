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
import Textfield  from "./Textfield";
import OutlinedButtons from "./Button";
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

  function formatToJSON(inputObject) {
    console.log('input object in reportform is:');
    console.log(inputObject);
    // Combine the array into a single string and remove unwanted formatting
    let combinedString = inputObject.report.replace(/\n+/g, ' ').replace(/[*]/g, '').replace(/\s{2,}/g, ' ');
    console.log('combined string is:', combinedString);

    // Define the keys to search for
    const keys = ["EXAM", "HISTORY", "TECHNIQUE", "COMPARISON", "FINDINGS", "IMPRESSIONS"];
    
    // Create an empty object to store the extracted data
    let data = {
        exam: "",
        history: "",
        technique: "",
        comparison: "",
        findings: "",
        impressions: "",
        clinical_summary: ""
    };

    // Iterate through the keys to extract the corresponding values
    for (let i = 0; i < keys.length; i++) {
        let startIndex = combinedString.indexOf(keys[i] + ": ");
        let endIndex = i < keys.length - 1 ? combinedString.indexOf(keys[i + 1] + ": ") : combinedString.length;
        if (startIndex !== -1) {
            data[keys[i].toLowerCase()] = combinedString.substring(startIndex + keys[i].length + 2, endIndex).trim();
        }
    }

    // Create the clinical summary with key names included
    data.clinical_summary = `EXAM: ${data.exam} HISTORY: ${data.history} TECHNIQUE: ${data.technique} COMPARISON: ${data.comparison} FINDINGS: ${data.findings} IMPRESSIONS: ${data.impressions}`;

    // Return the JSON object
    console.log('json object from reportform is...');
    console.log(JSON.stringify(data, null, 2));
    return JSON.stringify(data, null, 2);
}


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
      console.log("formdata is:", formData);
      const response = formatToJSON(formData);
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
          <Textfield 
            id="fullWidth"
            label="Report"
            variant="outlined"
            value={formData.report}
            onChange={handleChange}
          />
            <OutlinedButtons 
          type="submit"
          disabled={!isFormReady}
          text={"Insert Into Database"}
        
          />
        </form>
      )}
    </>
  );
};

export default ReportForm;
