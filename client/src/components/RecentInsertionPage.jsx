import React from "react";

const RecentInsertionPage = ({ databaseEntry }) => {
  const entry = databaseEntry ? Object.values(databaseEntry)[0][0] : null;
  const clinicalSummary = entry ? entry.Clinical_summary.value : "";

  const parseClinicalSummary = (summary) => {
    const mainKeys = [
      "EXAM",
      "HISTORY",
      "TECHNIQUE",
      "COMPARISON",
      "FINDINGS",
      "IMPRESSIONS",
    ];
    const parts = { Clinical_summary: summary }; // Include the entire summary under Clinical_summary
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
    console.log("parts is");
    console.log(parts);
    return parts;
  };

  const data = parseClinicalSummary(clinicalSummary);

  return (
    <div style={{ padding: "20px" }}>
      <header>
        <h1>Patient Information</h1>
        <div>
          <strong>Name:</strong> {/* Display patient name */}
        </div>
        <div>
          <strong>MRN:</strong> {/* Display MRN */}
        </div>
        <div>
          <strong>Assessment Date:</strong> {/* Display assessment date */}
        </div>
      </header>
      <main>
        <section>
          <h2>Imaging Examination Results</h2>
          <div>
            <strong>Exam Name:</strong> {data["EXAM"]}
          </div>
          <div>
            <strong>History:</strong> {data["HISTORY"]}
          </div>
          <div>
            <strong>Technique:</strong> {data["TECHNIQUE"]}
          </div>
          <div>
            <strong>Comparison:</strong> {data["COMPARISON"]}
          </div>
        </section>
        <section>
          <h2>Findings</h2>
          <div>{data["FINDINGS"]}</div>
        </section>
        <section>
          <h2>Impressions</h2>
          <div>{data["IMPRESSIONS"]}</div>
        </section>
        <section>
          <h2>Clinical Summary</h2>
          {/* Assuming Clinical Findings would be separately delineated within your data structure; adjust as necessary. */}
          <div>{data["Clinical_summary"]}</div>
        </section>
      </main>
    </div>
  );
};

export default RecentInsertionPage;
