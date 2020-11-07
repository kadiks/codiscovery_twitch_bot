const mongoose = require("mongoose");

const schema = {
  displayName: String,
  username: String,
  twitchUserId: String,
  twichChannelId: String,
  channelName: String,
  text: String,
  created: {
    type: Date,
    default: Date.now,
  },
};

const Model = mongoose.Model("Message", schema);

module.exports = Model;
