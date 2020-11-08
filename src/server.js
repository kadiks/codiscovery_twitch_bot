require("dotenv").config();

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let socket = null;

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
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on("connection", (curSocket) => {
  console.log("user connected");
  socket = curSocket;
});

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

app.post("/api/avatars/messages/", (req, res) => {
  const { message } = req.body;

  console.log("POST /api/avatars/messages/ req.body", req.body);
  console.log("POST /api/avatars/messages/ message", message.text);

  // io.emit("avatar:message", message.text);
  io.emit("avatar:message", `${message.displayName}\n${message.text}`);

  res.send("ok");
});

server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
