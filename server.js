const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fetch = require("node-fetch");
const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const dotenv = require("dotenv");
dotenv.config();
const { OPENAI_API_KEY, BETTERUSER, BETTERPASS } = process.env;


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
let keepAlive;

/* DEEPGRAM SET UP */

const setupDeepgram = (ws) => {
  const deepgram = deepgramClient.listen.live({
    language: "en",
    punctuate: true,
    smart_format: true,
    model: "nova",
  });

  if (keepAlive) clearInterval(keepAlive);
  keepAlive = setInterval(() => {
    console.log("deepgram: keepalive");
    deepgram.keepAlive();
  }, 10 * 1000);

  deepgram.addListener(LiveTranscriptionEvents.Open, async () => {
    console.log("deepgram: connected");

    deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
      console.log("deepgram: transcript received");
      console.log("ws: transcript sent to client");
      ws.send(JSON.stringify(data));
    });

    deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
      console.log("deepgram: disconnected");
      clearInterval(keepAlive);
      deepgram.finish();
    });

    deepgram.addListener(LiveTranscriptionEvents.Error, async (error) => {
      console.log("deepgram: error received");
      console.error(error);
    });

    deepgram.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
      console.log("deepgram: warning received");
      console.warn(warning);
    });

    deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
      console.log("deepgram: metadata received");
      console.log("ws: metadata sent to client");
      ws.send(JSON.stringify({ metadata: data }));
    });
  });

  return deepgram;
};

/* WEB SOCKET */

wss.on("connection", (ws) => {
  console.log("ws: client connected");
  let deepgram = setupDeepgram(ws);

  ws.on("message", (message) => {
    console.log("ws: client data received");

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      console.log("ws: data sent to deepgram");
      deepgram.send(message);
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      console.log("ws: data couldn't be sent to deepgram");
      console.log("ws: retrying connection to deepgram");
      /* Attempt to reopen the Deepgram connection */
      deepgram.finish();
      deepgram.removeAllListeners();
      deepgram = setupDeepgram(ws);
    } else {
      console.log("ws: data couldn't be sent to deepgram");
    }
  });

  ws.on("close", () => {
    console.log("ws: client disconnected");
    deepgram.finish();
    deepgram.removeAllListeners();
    deepgram = null;
  });
});

/* APP USE & GET */

app.use(express.static(__dirname + "/public/"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public/" });
});

/* APP POST */

/* API call to GPT-4 to format content into report */
app.post("/api/createReport", async (req, res) => {
  try {
    const { content } = req.body;
    console.log("server report content is:", content);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",

            content: `Your role is to assist users in formatting unstructured medical dictations into proper radiology report format. A properly formatted radiology report features 6 main headers EXAM, HISTORY, TECHNIQUE, COMPARISON, FINDINGS, IMPRESSIONS). When a user asks you to produce a radiology report from provided information, take a moment to read and analyze the medical dictation, making note of information that could fall into the following six categories: EXAM, HISTORY, TECHNIQUE, COMPARISON, FINDINGS, and IMPRESSION. After analysis is complete, produce a properly formatted radiology report based off the analysis of the medical dictation. Make sure the report consists of only the following 6 subsections in the following order: EXAM, HISTORY, TECHNIQUE, COMPARISON, FINDINGS, and IMPRESSION. Do not make additional subheaders beyond the aforementioned six subsections. Information for TECHNIQUE should state just the technique used without usage of past participles or verbs and should be a sentence fragment. Information under the FINDINGS and IMPRESSIONS fields should be formatted as a numeric list. Information under EXAM, HISTORY, TECHNIQUE, and COMPARISON should be formatted as plain text without any listing at all. If information is not provided for HISTORY or COMPARISON, insert either 'Not available' or 'None' respectively.  Use examples as templates for formatting and ensure the output aligns with radiology reporting standards. Avoid giving medical advice or diagnoses unless explicitly requested by the user in the context of a report format suggestion. Ask for clarification when necessary, tailor your responses to be concise, professional, and friendly, mirroring the precision required in medical documentation while maintaining an engaging interaction.`,
          },
          {
            role: "user",
            content: `Please produce a radiology report from the following information:  ${content}`,
          },
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    console.log("server data is:", data);
    console.log("server data.choices etc is", data.choices[0].message.content);
    res.json(data);
    // return just the content of the response, which is the plain text report
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* api call to format report into JSON data */

app.post("/api/createJson", async (req, res) => {
  try {
    const { content } = req.body;
    console.log("server json content is:", content);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",

            content: `Your role is to assist users in converting Radiology reports in plaintext format into JSON format. The response to the user should resemble the following JSON format:{"exam": exam, "history": history,"technique": technique, "comparison": comparison,"findings": findings,"impressions": impressions}, with fields not in quotations being filled by the relevant content from the information given by the user. When a user asks you to convert a radiology report into JSON, take a moment to read and analyze the given information, making note of information that could fall into the following six categories: EXAM, HISTORY, TECHNIQUE, COMPARISON, FINDINGS, and IMPRESSION. After analysis is complete, produce a JSON version of the file based off the analysis of the given information. Make sure the JSON consists of only the following 6 subsections in the following order: EXAM, HISTORY, TECHNIQUE, COMPARISON, FINDINGS, and IMPRESSION. Do not make additional subheaders beyond the aforementioned six subsections. JSON key-values should all be one lined strings. If a report features multiple entries under a single header, the multiple entries should be converted to a single line string with a period and a space separating each entry. Do not use arrays in the JSON. Do not include any new words or remove words from the radiology report when making the JSON. Use examples as templates for formatting and ensure the output aligns with typical JSON conventions. Avoid giving medical advice or diagnoses unless explicitly requested by the user in the context of a report format suggestion.`,
          },
          {
            role: "user",
            content: `Please convert the following information into JSON format with only 6 keys: exam, history, technique, comparison, findings, impression. ${content}`,
          },
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    res.json(data);
    // return just the content of the response, which is the plain text report
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* API call to Better to get access token */
app.post("/api/token", async (req, res) => {
  try {
    const loginHeaders = new Headers();
    loginHeaders.append("Allow", "application/json");
    loginHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "portal");
    urlencoded.append("username", `${BETTERUSER}`);
    urlencoded.append("password", `${BETTERPASS}`);

    const requestOptionsLogin = {
      method: "POST",
      headers: loginHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    const response = await fetch(
      "https://sandbox.better.care/auth/realms/portal/protocol/openid-connect/token",
      requestOptionsLogin
    );
    const data = await response.json();
    res.json(data);
    token = data.access_token;
    return token;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* API CALL TO POST COMPOSITION */

app.post("/api/post", async (req, res) => {
  try {
    const body = JSON.stringify(req.body);

    const postHeaders = new Headers();
    postHeaders.append("Accept", "application/json");
    postHeaders.append("Content-Type", "application/json");
    postHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptionsPost = {
      method: "POST",
      headers: postHeaders,
      body: body,
      redirect: "follow",
    };
    const response = await fetch(
      "https://sandbox.better.care/ehr/rest/v1/composition?templateId=radiology-report&ehrId=b09c82b5-bdb4-4928-9617-bf81512e032d&format=FLAT&committerName=JackT",
      requestOptionsPost
    );
    const data = await response.json();
    res.json(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
