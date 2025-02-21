"use client";

import { Message } from "@/types/chat";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatBox from "./ChatBox";

export default function ChatRoom() {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 5000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected to server");
      setError(null);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setError("Failed to connect to server");
    });

    socket.on("error", (errorMessage: string) => {
      console.error("Server error:", errorMessage);
      setError(errorMessage);
    });

    socket.on("disconnect", (reason) => {
      console.log("disconnected from server:", reason);
      if (reason === "io server disconnect") {
        socket.connect(); // Attempt to reconnect
      }
      setError("Disconnected from server");
    });

    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, { content: msg, isMe: false }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!socketRef.current?.connected) {
      setError("Not connected to server");
      return;
    } else if (!message) {
      setError("Message cannot be empty");
      return;
    }

    if (socketRef.current && message) {
      try {
        socketRef.current.emit("message", message);
        setMessages((prev) => [...prev, { content: message, isMe: true }]);
      } catch (error) {
        setError("Failed to send message");
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        className="flex justify-center items-center mt-8 w-full max-w-[600px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
          setMessage("");
        }}
      >
        <TextField
          fullWidth
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    edge="end"
                    disabled={!message.trim()}
                  >
                    <SendIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
      <ChatBox messages={messages} />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
