require("dotenv").config();

const tmi = require("tmi.js");
const mongoose = require("mongoose");
const axios = require("axios");

const commands = require("../config/commands.json");
const politenessList = require("../config/politeness.json");
const supportList = require("../config/support.json");
const MessageModel = require("./models/message");

const avatarTriggers = politenessList.concat(supportList);

const {
  TWITCH_BOT_USERNAME,
  TWITCH_CHANNEL_NAME,
  TWITCH_OAUTH,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

mongoose
  .connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.jyq0k.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("DB connected succesfully");
  })
  .catch((err) => {
    console.log("DB connection has failed. Error:", err);
  });

// Define configuration options
const opts = {
  debug: true,
  identity: {
    username: TWITCH_BOT_USERNAME,
    password: TWITCH_OAUTH,
  },
  channels: [TWITCH_CHANNEL_NAME],
};
// Create a client with our options
const client = new tmi.client(opts);

// Called every time a message comes in
const onMessageHandler = async (target, context, msg, self) => {
  //   console.log("#onMessageHandler");
  //   console.log("#onMessageHandler target", target);
  //   console.log("#onMessageHandler context", context);
  //   console.log("#onMessageHandler msg", msg);
  //   console.log("#onMessageHandler self", self);
  if (self) {
    return;
  } // Ignore messages from the bot

  const message = {
    displayName: context["display-name"],
    username: context["username"],
    twitchUserId: context["user-id"],
    twichChannelId: context["room-id"],
    channelName: target.replace("#", ""),
    text: msg,
  };

  console.log("message", message);

  const commandKeys = Object.keys(commands); // ['!youtube', '!twitter']
  if (commandKeys.includes(msg.trim().toLowerCase()) === true) {
    const commandIndex = commandKeys.indexOf(msg.trim().toLowerCase());
    const reply = Object.values(commands)[commandIndex];
    client.say(target, reply);
  }

  let isAvatarTriggered = false;

  avatarTriggers.forEach((avatarTrigger) => {
    if (msg.toLowerCase().includes(avatarTrigger) === true) {
      isAvatarTriggered = true;
      return;
    }
  });

  if (isAvatarTriggered) {
    axios.post("http://localhost:3000/api/avatars/messages/", { message });
  }

  await MessageModel.insert({ data: message });
};

// Function called when the "dice" command is issued
// Called every time the bot connects to Twitch chat
const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
};

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();
