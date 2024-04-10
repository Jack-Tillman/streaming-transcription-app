import React, { useEffect, useState } from "react";
import {
  getBetterToken,
  makeComposition,
  showComposition,
} from "../utils/utils.js";


const InsertData = ({ json }) => {

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
      console.log("Most recent composition:", recentComposition);
    } catch (error) {
      console.error("Error processing report:", error);
    }
  };

  return (
    <button
      className="info-button insert-button"
      id="insert-button"
      onClick={handleProcessReport}
    >
      Insert Data
    </button>
  );
};

export default InsertData;
