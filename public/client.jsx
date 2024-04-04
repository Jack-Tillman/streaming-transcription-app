import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);



import {
  transformRadiologyReport,
  getBetterToken,
  makeComposition,
} from "./utils.js";



const captions = window.document.getElementById("captions");
const fullTranscription = window.document.getElementById("full-transcription");
const fullJson = window.document.getElementById("json-response");
const fulLBetter = window.document.getElementById("full-better");
const fullEhr = window.document.getElementById("full-ehr");
const returnHeader = window.document.getElementById("left-h2");

const gptResponseEl = document.getElementById("gpt-response");
const jsonResponseEl = document.getElementById("json-response");
const betterResponseEl = document.getElementById("better-response");
const ehrResponseEl = document.getElementById("ehr-response");
/* Microphone functions */

async function getMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream, { mimeType: "audio/webm" });
  } catch (error) {
    console.error("error accessing microphone:", error);
    throw error;
  }
}

async function openMicrophone(microphone, socket) {
  return new Promise((resolve) => {
    microphone.onstart = () => {
      console.log("client: microphone opened");
      document.body.classList.add("recording");
      resolve();
    };

    microphone.onstop = () => {
      console.log("client: microphone closed");
      document.body.classList.remove("recording");
    };

    microphone.ondataavailable = (event) => {
      console.log("client: microphone data received");
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    microphone.start(1000);
  });
}

async function closeMicrophone(microphone) {
  microphone.stop();
}

async function start(socket) {
  const listenButton = document.querySelector("#record");
  let microphone;

  console.log("client: waiting to open microphone");

  listenButton.addEventListener("click", async () => {
    if (!microphone) {
      try {
        microphone = await getMicrophone();
        await openMicrophone(microphone, socket);
      } catch (error) {
        console.error("error opening microphone:", error);
      }
    } else {
      await closeMicrophone(microphone);
      microphone = undefined;
    }
  });
}

/* called after each spoken chunk to make full transcription */
async function processTranscription(transcription) {
  // Update fullTranscription to include each chunk
  fullTranscription.innerHTML += `<span>${transcription}</span><br>`;
}

/* send request to GPT-4 to format data into a radiology report */
async function chatWithGPT(content) {
  try {
    console.log("time to make the report");
    const response = await fetch("/api/createReport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content }),
    });
    //likely error thrower
    if (!response.ok) throw new Error("Network response was not ok.");

    const data = await response.json();
    console.log("done making reports : )!");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error while making your report:", error);
    throw error;
  }
}

/* send request to GPT-4 to format radiology report into JSON */
async function jsonGPT(content) {
  try {
    console.log("time to make the json");
    const response = await fetch("/api/createJson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content }),
    });

    const data = await response.json();
    console.log("done making json : )!");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error while formatting your JSON data:", error)
    throw error;
  }
}

async function showComposition(token){
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
    return;
  } catch (error) {
    console.error("Error while fetching most recent composition:", error)
    throw error;
  }
}

/* EVENT LISTENERS */

// Event listener for the reformat button
document
  .getElementById("reformat-button")
  .addEventListener("click", async () => {
    const content =
      fullTranscription.innerText || fullTranscription.textContent || "";
    if (content) {
      const gptResponse = await chatWithGPT(content);
      fullTranscription.innerText = await gptResponse; // Displaying the response from ChatGPT-4
      returnHeader.innerText = "Radiology Report Below";
      captions.innerHTML = '';
    } else {
      console.log("waiting for transcription");
    }
  });

// Event listener for the json button
document.getElementById("json-button").addEventListener("click", async () => {
  const content =
    fullTranscription.innerText || fullTranscription.textContent || "";
  if (content) {
    const gptResponse = await jsonGPT(content);
    fullTranscription.innerText = await gptResponse;
    returnHeader.innerText = "JSON Data Below";
  } else {
    console.log("waiting for JSON");
  }
});


// make call-> make call to post new composition
document.getElementById("ehr-button").addEventListener("click", async () => {
  const dataToInsert =
    fullTranscription.innerText || fullTranscription.textContent || "";
  // const dataToInsert = `{"exam": "Lumbar Spine Radiograph", "history": "Patient complaints of low back pain.", "technique": "Radiograph", "comparison": "Radiograph from March 6, 2022.", "findings": "1. Mild convexity of the lower lumbar on the right side. 2. Apex at L4-5. 3. List of the upper lumbar spine to the left side, extending cephalically to T12.", "impressions": "1. Mild curvature of the lower lumbar spine to the right, corresponding with patient's reported low back pain.", "clinical_summary": "EXAM: Lumbar Spine Radiograph. HISTORY: Patient complaints of low back pain. TECHNIQUE: Radiograph. COMPARISON: Radiograph from March 6, 2022. FINDINGS: 1. Mild convexity of the lower lumbar on the right side. 2. Apex at L4-5. 3. List of the upper lumbar spine to the left side, extending cephalically to T12. IMPRESSIONS: 1. Mild curvature of the lower lumbar spine to the right, corresponding with patient's reported low back pain."}`

  try {
    if (dataToInsert) {
      const jsonString = fullTranscription.innerText;
      const token = await getBetterToken();
      console.log('client token 186', token);
      console.log(typeof token);
      const ehrResponse = await makeComposition(token, jsonString);
      const composition = await showComposition(token);

      fullTranscription.innerText = '';
      returnHeader.innerText = "Data successfully inserted!";
      console.log('composition is', composition)
      console.table(composition)
      
    } else {
      console.log("waiting for JSON to insert");
    }
  } catch (error) {
    throw error;
  }
});

window.addEventListener("load", () => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", async () => {
    console.log("client: connected to server");
    await start(socket);
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.channel.alternatives[0].transcript !== "") {
      captions.innerHTML = data
        ? `<span id="realtime-caption">${data.channel.alternatives[0].transcript}</span>`
        : "";
      processTranscription(data.channel.alternatives[0].transcript);
    }
  });

  socket.addEventListener("close", () => {
    console.log("client: disconnected from server");
  });
});
