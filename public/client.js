// const fetch = require("node-fetch");
const captions = window.document.getElementById("captions");
const fullTranscription = window.document.getElementById("full-transcription");

const gptResponseEl = document.getElementById("gpt-response");

const transcriptButton = window.document.getElementById("transcript-button");
let transcriptionArray = [];

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

async function processTranscription(transcription) {
  // Update fullTranscription to include each chunk
  fullTranscription.innerHTML += `<span>${transcription}</span><br>`;
  console.log("Updated full transcription:", transcription);
}
let formattedReport = '';
async function chatWithGPT(content) {
  try {
    console.log('time to make the report');
    const response = await fetch("/api/chat-with-gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content }),
    });

    const data = await response.json();
    console.log("reformat-transcript data is:", data);
    // return just the content of the response, which is the plain text report
    formattedReport = data.choices[0].message.content;
    console.log('done making reports : )!')
    console.log('formattedReport is', formattedReport)
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

// Event listener for the reformat button
document
  .getElementById("reformat-button")
  .addEventListener("click", async () => {
    const content =
      fullTranscription.innerText || fullTranscription.textContent || "";
    if (content) {
      console.log('content is:', content);
      const gptResponse = await chatWithGPT(content);
      gptResponseEl.innerHTML = gptResponse; // Displaying the response from ChatGPT-4
    } else {
      console.log("waiting for transcription");
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
