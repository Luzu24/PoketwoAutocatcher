const { Client } = require("discord.js-selfbot-v13");
require("dotenv").config();

const config = require("./config.json");

const client = new Client({ checkUpdate: false });

// Constants
const TOKEN = process.env.TOKEN; // Remeber to put your token in the .env file for it to work. Take a look at token.js to see how to get yours.
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

let incenseChannel;
let isIncenseActive = false;

// Spam function
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

// Incense prompt
function startIncensePrompt() {
  readline.question("Start incense? (Y | N)\n\t>", (answer) => {
    const normalizedAnswer = answer.trim().toUpperCase();
    if (normalizedAnswer === "Y") {
      if (!incenseChannel) {
        console.error(
          `ERROR: Main channel "${ALLOWED_CHANNELS[0]}" not found.`
        );
        readline.close();
        return;
      }
      isIncenseActive = true;
      console.log(
        "Incense will run and will be paused when the bot is terminated."
      );
      incenseChannel.send(`<@${POKETWO_BOT_ID}> incense resume`);
      console.log("Incense command sent successfully.");
      readline.close();
    } else {
      console.log("Incense will not run.");
      readline.close();
    }
  });
}

client.on("ready", async () => {
  console.log(`"${client.user.tag}" is online.`);
  if (ALLOWED_CHANNELS && ALLOWED_CHANNELS.length > 0) {
    incenseChannel = client.channels.cache.get(ALLOWED_CHANNELS[0]);
  }

  startIncensePrompt();

  const spamChannel = client.channels.cache.get(SPAM_CHANNEL);
  if (!spamChannel) {
    console.error(
      `ERROR: Spam channel with ID "${SPAM_CHANNEL}" not found.`
    );
  } else {
    console.log(`Spam functionality started in channel: #${spamChannel.name}`);
    const sendSpamMessage = () => {
      spamChannel
        .send(generateRandomMessage())
        .catch(() => { })
        .finally(() => {
          const nextInterval =
            Math.floor(
              Math.random() * (MAX_SPAM_INTERVAL - MIN_SPAM_INTERVAL + 1)
            ) + MIN_SPAM_INTERVAL;
          setTimeout(sendSpamMessage, nextInterval);
        });
    };
    sendSpamMessage();
  }
});

// Autocatcher
client.on("messageCreate", async (message) => {
  try {
    if (!ALLOWED_CHANNELS.includes(message.channelId)) return;

    if (
      message.author.id === POKENAME_BOT_ID &&
      message.components?.length > 0
    ) {
      let firstButton = null;

      for (const row of message.components) {
        firstButton = row.components.find((component) => component.type === 2);
        if (firstButton) {
          break;
        }
      }
      
      if (firstButton) {
        activeInteractions.set(message.id, { timestamp: Date.now() });
        await message.clickButton(firstButton).catch(() => { });
      }
      return;
    }

    if (message.author.id === POKENAME_BOT_ID && message.embeds?.length > 0) {
      const originalMessageId = message.reference?.messageId;
      if (!originalMessageId || !activeInteractions.has(originalMessageId))
        return;

      const embed = message.embeds[0];
      const pokemonMatch = embed.title?.match(/#\d+ - (.+)/);
      if (!pokemonMatch) return;

      const pokemonName = pokemonMatch[1].trim().toLowerCase();
      console.log(`Pokémon found: "${pokemonName}"`);

      const catchDelay =
        Math.floor(Math.random() * (MAX_CATCH_DELAY - MIN_CATCH_DELAY + 1)) +
        MIN_CATCH_DELAY;

      setTimeout(() => {
        message.channel
          .send(`<@${POKETWO_BOT_ID}> c ${pokemonName}`)
          .catch(() => { });
        console.log(`Caught "${pokemonName}".`);
        activeInteractions.delete(originalMessageId);
      }, catchDelay);
    }
  } catch (err) { }
});

// Incense stop on exit, if it was started
process.on("exit", () => {
  if (incenseChannel && isIncenseActive) {
    incenseChannel.send(`<@${POKETWO_BOT_ID}> incense pause`);
    console.log("Sent 'incense pause' command before closing.");
  }
});

client
  .login(TOKEN)
  .catch((e) => console.error("Error during login. Check your TOKEN.", e));
