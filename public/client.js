import {transformRadiologyReport, getBetterToken, makeComposition} from "/utils.js";

const captions = window.document.getElementById("captions");
const fullTranscription = window.document.getElementById("full-transcription");
const fullJson = window.document.getElementById("json-response");
const fulLBetter = window.document.getElementById("full-better");
const fullEhr = window.document.getElementById("full-ehr");

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
  console.log("Updated full transcription:", transcription);
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
    console.error("Error during chat:", error);
    throw error;
  }
}

/* send request to GPT-4 to format radiology report into JSON */
async function jsonGPT(content) {
  try {
    console.log("time to make the json");
    const response = await fetch("/api/createJson", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ content: content }),
    });

    const data = await response.json();
    console.log("done making json : )!");
    return data.choices[0].message.content;

  } catch (error) {
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
      gptResponseEl.innerHTML = gptResponse; // Displaying the response from ChatGPT-4
    } else {
      console.log("waiting for transcription");
    }
  });

// Event listener for the json button
document.getElementById("json-button").addEventListener("click", async () => {
  const content = gptResponseEl.innerText || gptResponseEl.textContent || "";
  if (content) {
    const gptResponse = await jsonGPT(content);
    jsonResponseEl.innerHTML = gptResponse; // Displaying the response from ChatGPT-4
  } else {
    console.log("waiting for JSON");
  }
});

// make call-> make call to post new composition
document.getElementById("ehr-button").addEventListener("click", async () => {
  const dataToInsert =
    jsonResponseEl.innerText || jsonResponseEl.textContent || "";
  try {
    if (dataToInsert) {
      const jsonString = jsonResponseEl.innerText;
      const token = await getBetterToken();
      const ehrResponse = await makeComposition(token, jsonString);

      ehrResponseEl.innerHTML = ehrResponse;
      betterResponseEl.innerHTML = "Inserted  ehr!"; // Displaying the response from Better
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
        ? `<span>${data.channel.alternatives[0].transcript}</span>`
        : "";
      processTranscription(data.channel.alternatives[0].transcript);
    }
  });

  socket.addEventListener("close", () => {
    console.log("client: disconnected from server");
  });
});
