/* BETTER RELATED HELPER FUNCTIONS */

export async function getBetterToken() {
  try {
    console.log("time to get the token");
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        Allow: "application/json",
        "Content-Type": "application/json",
      },
    });
    //likely error thrower
    if (!response.ok) throw new Error("Failed to refresh token.");

    const data = await response.json();
    console.log("done getting access token : )!");
    return data.access_token;
  } catch (error) {
    throw error;
  }
}

export async function makeComposition(token, jsonString) {
  try {
    //current error location
    console.log('jsonString is:', jsonString);
    const inputObject = JSON.parse(jsonString);
    console.log('inputobject is')
    console.log(inputObject);
    //convert to target json fields for ehr insertion
    const targetInput = transformRadiologyReport(inputObject);
    const raw = JSON.stringify(targetInput);
    console.log('raw is ');
    console.log(raw);
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        Allow: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: `${raw}`,
    });
    console.log("client repsonse is", response);
    const data = await response.json();
    console.log("client data is", data);
    console.log("Composition inserted : )!");
    return data;
  } catch (error) {
    throw error;
  }
}

/* MISC HELPER FUNCTIONS */
export function transformRadiologyReport(inputReport) {
  const targetReport = {
    "ctx/language": "en",
    "ctx/territory": "SI",
    "ctx/composer_name": "JackT",
  };

  const keyMap = {
    exam: "full-radiology-report/imaging_examination_result:0/any_event:0/study_name",
    technique:
      "full-radiology-report/imaging_examination_result:0/any_event:0/modality",
    history:
      "full-radiology-report/imaging_examination_result:0/any_event:0/target_body_site",
    comparison:
      "full-radiology-report/imaging_examination_result:0/any_event:0/comparison_findings",
    findings:
      "full-radiology-report/imaging_examination_result:0/any_event:0/imaging_findings",
    impressions:
      "full-radiology-report/imaging_examination_result:0/any_event:0/overall_impression",
    clinical_summary:
      "full-radiology-report/imaging_examination_result:0/any_event:0/clinical_summary",
  };

  // map over input keys to insert into target report
  Object.keys(inputReport).forEach((key) => {
    const newKey = keyMap[key];
    if (newKey) {
      targetReport[newKey] = inputReport[key];
    }
  });

  return targetReport;
}

export async function showComposition(token){
  try {
    console.log("time to fetch the composition");
    const response = await fetch("/api/getComposition", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `${token}`},
    });

    const data = await response.json();
    console.log(response);
    console.log("done fetching the most recent composition : )!");
    console.log(data);
    // return data.choices[0].message.content;
    return data;
  } catch (error) {
    console.error("Error while fetching most recent composition:", error)
    throw error;
  }
}

export function formatToJSON(inputObject) {
  console.log(inputObject);
  // Combine the array into a single string and remove unwanted formatting
  let combinedString = inputObject.report.replace(/\n+/g, ' ').replace(/[*]/g, '').replace(/\s{2,}/g, ' ');

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
  console.log(JSON.stringify(data, null, 2));
  return JSON.stringify(data, null, 2);

}



/* TO IMPLEMENT LATER ON */

/* potential setup for implementation of automatic refresh token retrieval. None have been tested yet */
// Utility function to decode JWT and get its expiry time
function getTokenExpiry(token) {
  const decoded = JSON.parse(atob(token.split(".")[1])); // Decodes the payload
  return decoded.exp;
}

// Function to check if the token needs refreshing
function needsTokenRefresh(token) {
  const now = Date.now() / 1000; // Current time in seconds
  const expiry = getTokenExpiry(token);
  return now > expiry - 60; // Refresh if less than 60 seconds left
}

// Refresh token function
async function refreshToken() {
  // Your logic to refresh the token
  const response = await fetch("/api/token/refresh", { method: "POST" });
  const { token } = await response.json();
  sessionStorage.setItem("authToken", token); // Update stored token
  return token;
}
