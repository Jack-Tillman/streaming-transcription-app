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
    const inputObject = JSON.parse(jsonString);
    //convert to target json fields for ehr insertion
    const targetInput = transformRadiologyReport(inputObject);
    const raw = JSON.stringify(targetInput);

    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        Allow: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: `${raw}`,
    });
    console.log("client repsonse is", response)
    const data = await response.json();
    console.log("client data is", data)
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















/* TO IMPLEMENT LATER ON */

/* potential setup for implementation of automatic refresh token retrieval. None have been tested yet */
// Utility function to decode JWT and get its expiry time
function getTokenExpiry(token) {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decodes the payload
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
    const response = await fetch('/api/token/refresh', { method: 'POST' });
    const { token } = await response.json();
    sessionStorage.setItem('authToken', token); // Update stored token
    return token;
}

// Wrapper function to make API calls with auto-refresh logic
async function fetchWithTokenRefresh(url, options = {}) {
    let token = sessionStorage.getItem('authToken');
    
    // Check if token needs refresh
    if (needsTokenRefresh(token)) {
        token = await refreshToken();
    }

    // Ensure the header has the updated token
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    // Proceed with the original fetch request
    return fetch(url, options);
}

// Example usage
async function makeAPICall() {
    try {
        const response = await fetchWithTokenRefresh('/api/protected');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error making API call:', error);
        // Handle error
    }
}
