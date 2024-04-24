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

          <div>{data["Clinical_summary"]}</div>
        </section>
      </main>
    </div>
  );
};

export default RecentInsertionPage;

// {
//   <h2>Imaging Examination Results</h2>
//   <div>
//     <strong>Exam Name:</strong> {data["EXAM"]}
//   </div>
//   <div>
//     <strong>History:</strong> {data["HISTORY"]}
//   </div>
//   <div>
//     <strong>Technique:</strong> {data["TECHNIQUE"]}
//   </div>
//   <div>
//     <strong>Comparison:</strong> {data["COMPARISON"]}
//   </div>
// </section>
// <section>
//   <h2>Findings</h2>
//   <div>{data["FINDINGS"]}</div>
// </section>
// <section>
//   <h2>Impressions</h2>
//   <div>{data["IMPRESSIONS"]}</div>
// </section>
// <section>
//   <h2>Clinical Summary</h2>

//   <div>{data["Clinical_summary"]}</div>
// }

// THIS IS TO BE WORKED ON

// {
//   <header
//   style={{
//     display: "block",
//     position: "relative",
//     padding: "0px 28px 17.5px",
//     boxSizing: "border-box",
//   }}
// >
//   <div
//     style={{
//       display: "flex",
//       flexWrap: "wrap",
//       lineHeight: "32px",
//       marginBottom: "7px",
//       boxSizing: "border-box",
//     }}
//   >
//     <div
//       title="Document"
//       style={{
//         flexBasis: "0px",
//         flexGrow: 1,
//         maxWidth: "100%",
//         position: "relative",
//         width: "100%",
//         paddingRight: "0px",
//         paddingLeft: "0px",
//         boxSizing: "border-box",
//         fontSize: "16.1px",
//         whiteSpace: "nowrap",
//         color: "rgb(80, 80, 82)",
//         letterSpacing: "0.644px",
//         textTransform: "uppercase",
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//       }}
//     >
//       Document
//     </div>
//     <div
//       style={{
//         flex: "0 0 auto",
//         width: "auto",
//         maxWidth: "100%",
//         position: "relative",
//         paddingRight: "0px",
//         paddingLeft: "0px",
//         boxSizing: "border-box",
//         display: "block",
//         float: "right",
//         cursor: "pointer",
//         zIndex: 100,
//         top: "-1px",
//       }}
//     >
//       <i
//         style={{
//           padding: "2px",
//           color: "rgb(0, 0, 0)",
//           fontSize: "23.8px",
//           fontStyle: "normal",
//           lineHeight: "23.8px",
//           display: "inline-block",
//           paddingLeft: "2px",
//           marginBottom: "0px",
//           boxSizing: "border-box",
//           verticalAlign: "middle",
//         }}
//       ></i>
//     </div>
//   </div>
//   <div style={{ zIndex: 105, boxSizing: "border-box" }}>
//     <h2
//       style={{
//         fontSize: "22.4px",
//         marginBottom: "0px",
//         fontWeight: 600,
//         lineHeight: "32px",
//         marginTop: "0px",
//         boxSizing: "border-box",
//       }}
//     >
//       Full-Radiology-Examination
//     </h2>
//   </div>
//   <div style={{ marginBottom: "16px", boxSizing: "border-box" }}>
//     <span style={{ color: "rgb(70, 90, 99)", boxSizing: "border-box" }}>
//       Assessment date: {data["Time"]}
//     </span>
//   </div>
//   <div
//     style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
//   >
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       <span
//         style={{
//           fontWeight: "700",
//           fontSize: "16.03px",
//           lineHeight: "32px",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           whiteSpace: "nowrap",
//           maxWidth: "350px",
//         }}
//       >
//         FELLA, test
//       </span>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div
//           style={{
//             fontSize: "21px",
//             background: "rgb(211, 216, 219)",
//             borderRadius: "4px",
//             width: "0.875rem",
//             height: "14px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             marginLeft: "8px",
//           }}
//         ></div>
//         <div style={{ marginLeft: "3.5px" }}>∙</div>
//         <div>{"17 Apr 1915"}</div>
//         <div style={{ marginLeft: "3.5px" }}>∙</div>
//         <div>{"109y"}</div>
//       </div>
//     </div>
//     <div
//       style={{
//         marginLeft: "8px",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <span>MRN: 20140321727</span>
//     </div>
//   </div>
// </header>

// <div
// style={{
//   outline: "none",
//   WebkitFontSmoothing: "antialiased",
//   boxSizing: "border-box",
// }}
// >
// <div
//   style={{
//     outline: "none",
//     WebkitFontSmoothing: "antialiased",
//     paddingLeft: "8px",
//     boxSizing: "border-box",
//   }}
// >
//   <div
//     style={{
//       display: "flex",
//       flexWrap: "wrap",
//       boxSizing: "border-box",
//     }}
//   >
//     <div
//       style={{
//         flexBasis: "100%",
//         maxWidth: "100%",
//         position: "relative",
//         width: "100%",
//         paddingRight: "0px",
//         paddingLeft: "0px",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0)",
//           borderColor: "rgba(0, 0, 0, 0)",
//           display: "flex",
//           flexWrap: "wrap",
//           marginRight: "4px",
//           marginLeft: "4px",
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             flex: "0 0 100%",
//             maxWidth: "100%",
//             position: "relative",
//             width: "100%",
//             paddingRight: "7px",
//             paddingLeft: "7px",
//             boxSizing: "border-box",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: "24px",
//               marginBottom: "0px",
//               fontWeight: 700,
//               lineHeight: "31.92px",
//               marginTop: "0px",
//               boxSizing: "border-box",
//             }}
//           >
//             Imaging Examination Results
//           </h1>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
// <div style={{ display: "flex", flexDirection: "column" }}>
// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Exam Name
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       Lumbar and Thoracic Spine X-Ray
//     </span>
//   </label>
// </div>

// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     History
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       Not available
//     </span>
//   </label>
// </div>

// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Technique
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       Lateral and postural projection views
//     </span>
//   </label>
// </div>

// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Comparison
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       None
//     </span>
//   </label>
// </div>
// </div>
// <div style={{ display: "flex", flexDirection: "column" }}>
// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Findings
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       1. Vertebral bodies maintain their height throughout the
//       visible thoracic spine. 2. Upper thoracic spine and lower
//       thoracic segments are not well visualized in the lateral plane
//       due to underpenetration radiographically relative to larger
//       body habitus. 3. Minor convexity of the lower thoracic spine
//       to the left, with the apex of the curvature at T10. 4. No
//       definite fracture or osseous pathology identified at the
//       visible levels, though subtle fractures and osseous pathology
//       cannot be completely excluded on the lateral projection. 5.
//       Right posterior pelvic rotation and minor pelvic unleveling
//       along the left side are observed. 6. The lumbar spine also
//       lists to the left side into the lower thoracic region.
//     </span>
//   </label>
// </div>

// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Impressions
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       1. No definite fracture or osseous pathology identified,
//       though subtle abnormalities cannot be completely excluded. 2.
//       Postural changes as described including right posterior pelvic
//       rotation, minor pelvic unleveling along the left, and lumbar
//       spine listing to the left into the lower thoracic region. 3.
//       Further evaluation with a well-calibrated lateral view may be
//       beneficial for better visualization of thoracic segments if
//       symptoms persist or progress.
//     </span>
//   </label>
// </div>

// <div style={{ marginBottom: "4px" }}>
//   <label
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontSize: "12px",
//       lineHeight: "15.96px",
//     }}
//   >
//     Clinical Summary
//     <span style={{ fontWeight: "700", fontSize: "16px" }}>
//       EXAM: Lumbar and Thoracic Spine X-Ray HISTORY: Not available
//       TECHNIQUE: Lateral and postural projection views COMPARISON:
//       None FINDINGS: Detailed as above in the Findings section.
//     </span>
//   </label>
// </div>
// </div>
// }
