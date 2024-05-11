export const chatWithGPT = async (content) => {
    try {
      const response = await fetch("/api/createReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      if (data) {
        console.log('report data is:', data);
        return data.content[0];
      } else {
        console.error("Error while setting your report.");
      }
      console.log("Report creation successful:", data);
    } catch (error) {
      console.error("Error while making your report:", error);
    }
  };

  // convert report to json
 export const jsonGPT = async (content) => {
    try {
      const response = await fetch("/api/createJson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      console.log("JSON creation successful:", data);
      if (data) {
        console.log(data);
        return data;
      } else {
        console.error("Error while setting json.");
      }
    } catch (error) {
      console.error("Error while formatting your JSON data:", error);
    }
  };

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
      console.log("client repsonse is", response);
      const data = await response.json();
      console.log("client data is", data);
      console.log("Composition inserted : )!");
      return data;
    } catch (error) {
      throw error;
    }
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
  