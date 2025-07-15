const { Client } = require("discord.js-selfbot-v13");
require("dotenv").config(); // Remeber to put your token in the .env file for it to work. Take a look at token.js to see how to get yours.

const config = require("./config.json"); 

const client = new Client({ checkUpdate: false });

// Constants
const TOKEN = process.env.TOKEN;
const {
  // You can edit all those values in the config.json file.
  // I'd keep MIN_SPAM_INTERVAL and MAX_SPAM_INTERVAL values at the one I've put if I was you, yet nothing stops you from changing them.
  ALLOWED_CHANNELS,
  SPAM_CHANNEL,
  MIN_CATCH_DELAY,
  MAX_CATCH_DELAY,
  MIN_SPAM_INTERVAL,
  MAX_SPAM_INTERVAL,
} = config;
const POKENAME_BOT_ID = "874910942490677270";
const POKETWO_BOT_ID = "716390085896962058";

// Runtime variables
const activeInteractions = new Map();
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let incenseChannel = null;
let spamChannel = null;
let isIncenseActive = false;
let spamInterval = null;

// Random message
function generateRandomMessage() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
}

// Spam function
async function startSpam() {
  if (!spamChannel) {
    console.error(`ERROR: Spam channel not found. Please check SPAM_CHANNEL in config.json.`);
  }

  const sendMessage = async () => {
    try {
      await spamChannel.send(generateRandomMessage());
    } catch (error) {
      console.error("Error sending spam message:", error);
    } finally {
      const delay =
        Math.floor(
          Math.random() * (MAX_SPAM_INTERVAL - MIN_SPAM_INTERVAL + 1)
        ) + MIN_SPAM_INTERVAL;
      spamInterval = setTimeout(sendMessage, delay);
    }
  };

  sendMessage();
  console.log(`Spam started in channel: ${spamChannel.name}`);
}

// Incense prompt
async function promptIncense() {
  return new Promise((resolve) => {
    readline.question("Start incense? (Y | N)\n\t>", async (answer) => {
      const normalizedAnswer = answer.trim().toUpperCase();
      if (normalizedAnswer === "Y") {
        if (!incenseChannel) {
          console.error(`ERROR: Main channel not found. Please check ALLOWED_CHANNELS in config.json.`);
          readline.close();
          resolve();
          return;
        }
        isIncenseActive = true;
        console.log("Incense activated");
        try {
          await incenseChannel.send(`<@${POKETWO_BOT_ID}> incense resume`);
          console.log("Incense command sent");
        } catch (error) {
          console.error("Error sending incense command:", error);
        }
      } else {
        console.log("Incense not activated");
      }
      readline.close();
      resolve();
    });
  });
}

client.on("ready", async () => {
  console.log(`"${client.user.tag}" is online`);

  if (ALLOWED_CHANNELS?.length > 0) {
    incenseChannel = client.channels.cache.get(ALLOWED_CHANNELS[0]);
    if (!incenseChannel) {
      console.warn(`Warning: Incense channel with ID ${ALLOWED_CHANNELS[0]} not found.`);
    }
  }
  spamChannel = client.channels.cache.get(SPAM_CHANNEL);
  if (!spamChannel) {
    console.warn(`Warning: Spam channel with ID ${SPAM_CHANNEL} not found.`);
  }

  await promptIncense();
  startSpam();
});

// Autocatcher
client.on("messageCreate", async (message) => {
  if (!ALLOWED_CHANNELS.includes(message.channelId)) return;

  try {
    if (message.author.id === POKENAME_BOT_ID && message.components?.length > 0) {
      const btn = message.components[0].components[0];
      if (btn && btn.customId) {
        activeInteractions.set(message.id, { timestamp: Date.now() });
        await message.clickButton(btn.customId);
        return;
      }
    }

    if (message.author.id === POKENAME_BOT_ID && message.embeds?.[0]?.title) {
      const refId = message.reference?.messageId;
      if (!refId || !activeInteractions.has(refId)) return;

      const pokemonNameMatch = message.embeds[0].title.match(/ - (.+)$/);
      const pokemonName = pokemonNameMatch ? pokemonNameMatch[1].trim().toLowerCase() : null;

      if (!pokemonName) {
        console.warn("Could not extract Pokémon name from embed title:", message.embeds[0].title);
        activeInteractions.delete(refId);
        return;
      }

      setTimeout(async () => {
        try {
          await message.channel.send(`<@${POKETWO_BOT_ID}> c ${pokemonName}`);
          activeInteractions.delete(refId);
        } catch (error) {
          console.error(`Error sending catch command for ${pokemonName}:`, error);
        }
      }, Math.floor(Math.random() * (MAX_CATCH_DELAY - MIN_CATCH_DELAY + 1)) + MIN_CATCH_DELAY);
    }
  } catch (err) {
    console.error("Error in messageCreate handler:", err);
  }
});

// Incense stop on exit, if it was started
process.on("exit", async () => {
  console.log("Shutting down...");
  if (incenseChannel && isIncenseActive) {
    try {
      await incenseChannel.send(`<@${POKETWO_BOT_ID}> incense pause`);
      console.log("Incense pause command sent on exit.");
    } catch (error) {
      console.error("Error sending incense pause command on exit:", error);
    }
  }
  if (spamInterval) {
    clearTimeout(spamInterval);
    console.log("Spam interval cleared.");
  }
  readline.close();
  client.destroy();
});

process.on("SIGINT", () => {
    console.log("Received SIGINT. Exiting gracefully.");
    process.exit(0);
});


client.login(TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error); // More descriptive error
  process.exit(1); // Exit with an error code on login failure
});
