import React from "react";
import "../styles/transcriptionprocessor.css";

const TranscriptionProcessor = ({ report, json, setReport, setJson, fullTranscription }) => {


  const chatWithGPT = async (content) => {
    try {
      const response = await fetch("/api/createReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      if (data) {
        setReport(data.choices[0].message.content);
      } else {
        console.error("Error while setting your report.");
      }
      console.log("Report creation successful:", data);
    } catch (error) {
      console.error("Error while making your report:", error);
    }
  };

  // convert report to json
  const jsonGPT = async (content) => {
    try {
      const response = await fetch("/api/createJson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      console.log("JSON creation successful:", data);
      if (data) {
        setJson(data.choices[0].message.content);
      } else {
        console.error("Error while setting json.");
      }
    } catch (error) {
      console.error("Error while formatting your JSON data:", error);
    }
  };

  // Function to handle the button click and initiate the API calls
  const handleProcessClick = async () => {
    chatWithGPT(fullTranscription);
    jsonGPT(fullTranscription);
  };

  return (
    <div className="returned-data" id="returned-data">
      <button
        className="info-button reformat-button"
        id="reformat-button"
        onClick={handleProcessClick}
      >
        Make Report
      </button>

    </div>
  );
};

export default TranscriptionProcessor;
