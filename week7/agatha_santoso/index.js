const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  //Like the overall template definition
  content: { type: String },
});

const messageModel = mongoose.model("Message", messageSchema);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", async (socket) => {
  console.log("a user connected");

  try {
    const messages = await messageModel.find({});
    console.log("Previous messages", messages);

    socket.emit("previous messages", messages);
  } catch (err) {
    console.error("Error retrieving message", err);
  }

  //for new messages
  socket.on("chat message", async (msg) => {
    console.log("message: " + msg);

    const message = new messageModel({ content: msg });

    try {
      await message.save();
      io.emit("chat message", msg); // Send to all clients
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  //for disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, async function () {
  await mongoose
    .connect(
      "mongodb+srv://agathafelisitas:agathafels@cluster0.scov9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("successfully connected");
    })
    .catch((e) => {
      console.log("not connected");
    });
  console.log("listening on *:3000");
});
