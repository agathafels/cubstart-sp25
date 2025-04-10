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

// When opening http://localhost:3000 -> Server sends the index.html file
// "/" means the homepage -> Someone visit homepage & send GET request to / path
// -> Response: send index.html (__dirname is the file path)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", async (socket) => {
  console.log("A user connected");

  try {
    const messages = await messageModel.find({});
    console.log("Previous messages", messages);
  } catch (err) {
    console.error("Error retrieving message", err);
  }

  // FOR NEW MESSAGES
  // 'async' -> 'await' (pause function until a promise finish) inside.
  // Not blocking the rest of the program. This is useful for handling things
  socket.on("chat message", async (msg) => {
    console.log("message: " + msg);
    const message = new messageModel({ content: msg });

    try {
      await message.save(); //Wait mongodb to finish saving -> Need to use async for await
      io.emit("chat message", msg); // Then, send to all clients
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

//When visit /messages -> Query the database of all msg, return as JSON array
app.get("/messages", async (req, res) => {
  const messages = await messageModel.find();

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chat History</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f5f5f5;
        }
        h2 {
          color: rgb(208, 69, 189)
        }
        .message {
          background:rgb(191, 218, 220);
          padding: 10px 20px;
          margin: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        }
      </style>
    </head>
    <body>
      <h2>Chat History</h2>
  `;

  messages.forEach((msg) => {
    html += `<div class="message">${msg.content}</div>`;
  });

  html += `
    </body>
    </html>
  `;

  res.send(html);
});
