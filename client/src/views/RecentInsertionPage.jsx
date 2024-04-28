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
      "IMPRESSIONS",
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

  const data = parseClinicalSummary(clinicalSummary, formattedTime); // Pass the time value to the function
  console.log(data); // This will now include the time as well as other sections
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
        {/* Findings Section */}
        <section className="entry-section findings">
          <div className="section-row">
            <span className="section-label">Findings</span>
            <span className="section-text">{data["FINDINGS"]}</span>
          </div>
        </section>

        {/* Impressions Section */}
        <section className="entry-section impressions">
          <div className="section-row">
            <span className="section-label">Impressions</span>
            <span className="section-text">{data["IMPRESSIONS"]}</span>
          </div>
        </section>

        {/* Clinical Summary Section */}
        <section className="entry-section clinical-summary">
          <div className="section-row">
            <span className="section-label">Clinical Summary</span>
            <span className="section-text">{data["Clinical_summary"]}</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RecentInsertionPage;

/*

 <div id="insertion-container">
      <header>
        <div title="Patient Summary" id="patient-summary">
          Patient Summary
        </div>
        <div>
          <strong>Name:</strong>
          <span style={{paddingLeft: "0.5rem"}}>Test Patient</span>
        </div>
        <div>
          <strong>Assessment Date:</strong>
          <span style={{paddingLeft: "0.5rem"}}>{data["TIME"]}</span>
        </div>
      </header>
      <main className="entry-main">
        <section id="top-section" className="entry-section">
          <h2>Imaging Examination Results</h2>
          <div>
            <strong className="left-text">Exam Name</strong> {data["EXAM"]}
          </div>
          <div>
            <strong className="left-text">History</strong> {data["HISTORY"]}
          </div>
          <div>
            <strong className="left-text">Technique</strong> {data["TECHNIQUE"]}
          </div>
          <div>
            <strong className="left-text">Comparison</strong> {data["COMPARISON"]}
          </div>
        </section>
        <section id="findings-section" className="entry-section">
          <h2>Findings</h2>
          <div>{data["FINDINGS"]}</div>
        </section>
        <section id="impressions-section" className="entry-section">
          <h2>Impressions</h2>
          <div>{data["IMPRESSIONS"]}</div>
        </section>
        <section id="summary-section" className="entry-section">
          <h2>Clinical Summary</h2>

          <div>{data["Clinical_summary"]}</div>
        </section>
      </main>
    </div>


*/
