import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    try {
      socket.broadcast.emit("message", message);
    } catch (error) {
      socket.emit("error", "Failed to broadcast message");
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    socket.emit("error", "Internal server error");
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected:", reason);
  });
});

// Error handling for the server itself
io.on("error", (error) => {
  console.error("Socket.IO server error:", error);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
