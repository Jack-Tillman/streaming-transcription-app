const fetch = require('node-fetch');
const path = require("path");
const dotenv = require("dotenv/config");


const { OPENAI_API_KEY } = process.env;

export async function chatWithGPT(content) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ content: content}),
  });

  const data = await response.json();
  console.log("reformat-transcript data is:", data);
  // return just the content of the response, which is the plain text report

  return data.choices[0].message.content;
}
