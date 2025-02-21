"use client";

import { Message } from "@/types/chat";
import { Paper } from "@mui/material";

interface ChatBoxProps {
  messages: Message[];
}

export default function ChatBox({ messages }: ChatBoxProps) {
  return (
    <Paper
      className="w-[600px] h-[400px] p-4 overflow-y-auto mt-8"
      elevation={3}
    >
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.isMe
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </Paper>
  );
}
