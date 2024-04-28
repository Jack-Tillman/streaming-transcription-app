import React from "react";
import "../styles/recentinsertionpage.css";

const RecentInsertionPage = ({ databaseEntry, handleProgress }) => {
  const entry = databaseEntry ? Object.values(databaseEntry)[0][0] : null;
  const clinicalSummary = entry ? entry.Clinical_summary.value : "";

  const timeValue = entry ? entry.time.value : ""; // Getting the time value
  const date = new Date(timeValue);

  // Format the date and time in a human-readable format
  const formattedTime = date.toLocaleString("en-GB", {
    day: "2-digit", // two digit day
    month: "short", // abbreviated month name
    year: "numeric", // four digit year
    hour: "2-digit", // two digit hour
    minute: "2-digit", // two digit minute
    hour12: false, // use 24-hour time without AM/PM
  });

  const parseClinicalSummary = (summary, time) => {
    const mainKeys = [
      "EXAM",
      "HISTORY",
      "TECHNIQUE",
      "COMPARISON",
      "FINDINGS",
      "IMPRESSION",
    ];
    const parts = { Clinical_summary: summary, TIME: time }; // Including time directly

    let currentKey = null;

    summary.split(". ").forEach((sentence) => {
      const foundKey = mainKeys.find((key) => sentence.startsWith(key));
      if (foundKey) {
        currentKey = foundKey;
        parts[currentKey] = parts[currentKey]
          ? `${parts[currentKey]}. ${sentence.substring(foundKey.length + 2)}`
          : sentence.substring(foundKey.length + 2);
      } else {
        if (currentKey) {
          parts[currentKey] = `${parts[currentKey]}. ${sentence}`;
        }
      }
    });

    Object.keys(parts).forEach((key) => {
      if (!parts[key].trim().endsWith(".")) {
        parts[key] = `${parts[key]}.`;
      }
    });

    return parts;
  };

  const parseAndRenderSummary = (summaryText) => {
    // Define the main keys that separate the sections
    const mainKeys = [
      "EXAM",
      "HISTORY",
      "TECHNIQUE",
      "COMPARISON",
      "FINDINGS",
      "IMPRESSION",
    ];

    // Object to hold the JSX for each section
    const summaryJSX = {};

    // Temporary variable to hold the current key while iterating
    let currentKey = null;

    // Split the summary text at each main key
    summaryText.split(/(?<=\.)\s*(?=[A-Z]+:)/).forEach((section) => {
      mainKeys.forEach((key) => {
        if (section.startsWith(key)) {
          currentKey = key;
          summaryJSX[key] = section.substring(key.length + 1).trim();
        }
      });
    });

    // Convert findings and IMPRESSION into ordered list items
    if (summaryJSX["FINDINGS"]) {
      summaryJSX["FINDINGS"] = renderListItems(summaryJSX["FINDINGS"]);
    } else if (summaryJSX["findings"]) {
      summaryJSX["findings"] = renderListItems(summaryJSX["findings"]);
    }

    if (summaryJSX["IMPRESSION"]) {
      summaryJSX["IMPRESSION"] = renderListItems(summaryJSX["IMPRESSION"]);
    } else if (summaryJSX["IMPRESSIONS"]) {
      summaryJSX["IMPRESSIONS"] = renderListItems(summaryJSX["IMPRESSIONS"]);
    } 

    return summaryJSX;
  };

  const data = parseClinicalSummary(clinicalSummary, formattedTime); // Pass the time value to the function
  console.log(data); // This will now include the time as well as other sections

  const renderListItems = (text) => {
    return text.split(/(?=\d\. )/).map((item, index) => (
      // The regex (?=\d\. ) looks ahead for a digit followed by a dot and a space without including it in the result
      <li key={index}>{item}</li>
    ));
  };

  const summaryJSX = parseAndRenderSummary(data["Clinical_summary"]);

  return (
    <div id="insertion-container">
      <div className="document-header">
        <h1 className="document-title">Radiology Examination Report</h1>
        <div className="document-metadata">
          <div className="metadata-item">
            <div>
              <span className="metadata-title">Name</span>
              <span>Test Patient</span>
            </div>
            <span className="metadata-title">Assessment date</span>
            <span className="metadata-content">{data["TIME"]}</span>
          </div>
        </div>
      </div>
      <main className="entry-main">
        {/* Imaging Examination Results Section */}
        <section className="entry-section examination-results">
          <h2 className="section-title">Imaging Examination Results</h2>
          <div className="section-content">
            <div className="section-row">
              <span className="section-label">Exam Name</span>
              <span className="section-text">{data["EXAM"]}</span>
            </div>
            <div className="section-row">
              <span className="section-label">Technique</span>
              <span className="section-text">{data["TECHNIQUE"]}</span>
            </div>
            <div className="section-row">
              <span className="section-label">Comparison</span>
              <span className="section-text">{data["COMPARISON"]}</span>
            </div>
            <div className="section-row">
              <span className="section-label">History</span>
              <span className="section-text">{data["HISTORY"]}</span>
            </div>
          </div>
        </section>
        {summaryJSX["FINDINGS"] && (
          <section className="entry-section findings">
            <div className="section-row">
              <span className="section-label">Findings</span>
              <ol className="section-text">{summaryJSX["FINDINGS"]}</ol>
            </div>
          </section>
        )}

          {summaryJSX["IMPRESSION"] && (
            <section
              className="entry-section impressions"
              style={{ borderTop: "0px" }}
            >
              <div className="section-row">
                <span className="section-label">Impressions</span>
                <span className="section-text">
                  <p>
                    <strong>Impressions</strong>
                  </p>
                  <ol className="section-text">{summaryJSX["IMPRESSION"]}</ol>
                </span>
              </div>
            </section>
          )}

        {/* Clinical Summary Sections */}
        <section className="entry-section examination-results">
          <div className="section-content">
            <div className="section-row">
              <span className="section-label">Clinical Summary</span>
              <span className="section-text">
                <p>
                  <strong>Exam</strong>
                </p>
                {data["EXAM"]}
              </span>
            </div>
            <div className="section-row">
              <span className="section-label"></span>
              <span className="section-text">
                <p>
                  <strong>Technique</strong>
                </p>
                {data["TECHNIQUE"]}
              </span>
            </div>
            <div className="section-row">
              <span className="section-label"></span>
              <span className="section-text">
                <p>
                  <strong style={{ textAlign: "left" }}>Comparison</strong>
                </p>
                {data["COMPARISON"]}
              </span>
            </div>
            <div className="section-row">
              <span className="section-label"></span>
              <span className="section-text">
                <p>
                  <strong>History</strong>
                </p>
                {data["HISTORY"]}
              </span>
            </div>
          </div>

          {summaryJSX["FINDINGS"] && (
            <section
              className="entry-section findings"
              style={{ borderTop: "0px" }}
            >
              <div className="section-row">
                <span className="section-label"></span>
                <span className="section-text">
                  <p>
                    <strong>Findings</strong>
                  </p>
                  <ol className="section-text">{summaryJSX["FINDINGS"]}</ol>
                </span>
              </div>
            </section>
          )}
          {summaryJSX["IMPRESSION"] && (
            <section
              className="entry-section impressions"
              style={{ borderTop: "0px" }}
            >
              <div className="section-row">
                <span className="section-label"></span>
                <span className="section-text">
                  <p>
                    <strong>Impressions</strong>
                  </p>
                  <ol className="section-text">{summaryJSX["IMPRESSION"]}</ol>
                </span>
              </div>
            </section>
          )}
          {summaryJSX["IMPRESSIONS"] && (
            <section
              className="entry-section impressions"
              style={{ borderTop: "0px" }}
            >
              <div className="section-row">
                <span className="section-label"></span>
                <span className="section-text">
                  <p>
                    <strong>Impressions</strong>
                  </p>
                  <ol className="section-text">{summaryJSX["IMPRESSIONS"]}</ol>
                </span>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
};

export default RecentInsertionPage;
