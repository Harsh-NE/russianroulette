require("dotenv").config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

const slotPersonalities = {
  1: "sweet",
  2: "cold",
  3: "flirty",
  4: "gen z",
  5: "insecure",
};

const IMPOSTER_SLOT = 6;
const conversationMemory = {};
const messageCount = {};

async function generateAIReply(messages, personality) {
  const systemPrompt = `You are pretending to be a human in a game where you are being questioned by investigators, whose job is to guess whether you are really the human.
    Speak casually and like a human. Do not use tech terms without good reason. Do not use asterisk actions, RP formatting, or emoting.
    Do not ask any questions to the investigators or use question marks. Keep answers short and strictly within 20 words.
    Personality: ${personality}`;

  const formattedMessages = [{ role: "system", content: systemPrompt }];

  messages.forEach((m) => {
    formattedMessages.push({
      role: m.role === "investigator" ? "user" : "assistant",
      content: m.text,
    });
  });

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: formattedMessages,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "RussianRouletteBot",
      },
    },
  );

  return response.data.choices[0].message.content;
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bot server running");
});

// BOT RESPONSE API
app.post("/bot-reply", async (req, res) => {
  const userMessage = req.body.message;
  const slot = req.body.slot;
  if (!messageCount[slot]) {
    messageCount[slot] = 0;
  }
  if (!conversationMemory[slot]) {
    conversationMemory[slot] = [];
  }

  conversationMemory[slot].push({
    role: "investigator",
    text: userMessage,
  });
  messageCount[slot]++;

  /*if (messageCount[slot] >= 3) {
    return res.json({
      chatEnded: true,
      message: "Conversation limit reached",
    });
  }*/

  if (slot == IMPOSTER_SLOT) {
    return res.json({
      imposter: true,
      message: "Human should respond",
    });
  }

  const botType = slotPersonalities[slot];
  const msg = userMessage.toLowerCase();

  const memory = conversationMemory[slot];

  const reply = await generateAIReply(memory, botType);

  const delay = Math.floor(Math.random() * 3000) + 1000;

  setTimeout(() => {
    // save bot reply to memory
    conversationMemory[slot].push({
      role: "bot",
      text: reply,
    });

    if (conversationMemory[slot].length > 10) {
      conversationMemory[slot].shift();
    }

    res.json({
      reply: reply,
    });
  }, delay);
});

app.listen(3001, () => {
  console.log("Bot server started on port 3001");
});
