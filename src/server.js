require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

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

const MessageModel = require("./models/message");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Homepage");
});
app.get(
  "/messages/count/:period(day|week|month|year|all-time)",
  async (req, res) => {
    const { period } = req.params;
    console.log("app.get /messages/count period");
    const { count } = await MessageModel.getCountByPeriod({ period });

    res.send(`Message of the ${period}: ${count}`);
  }
);

app.get(
  "/messages/politeness/:period(day|week|month|year|all-time)",
  async (req, res) => {
    const { period } = req.params;
    console.log("app.get /messages/politeness");
    const messages = await MessageModel.getPolitePeopleByPeriod({ period });

    res.send(
      `Message of the ${period}: ${messages
        .map((u) => `[${u.username} - ${u.count}]`)
        .join("<br/>")}`
    );
  }
);

app.get("/overlay", (req, res) => {
  res.send(
    '<link rel="stylesheet" href="/css/style.css" /><canvas width="600" height="150" id="testCanvas"></canvas><div class="sprite" data-char-name="zero" /><script src="https://code.createjs.com/1.0.0/createjs.min.js"></script><script src="https://code.createjs.com/1.0.0/easeljs.min.js"></script><script src="/js/main.js"></script>'
  );
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
