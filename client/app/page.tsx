"use client";

import ChatRoom from "@/components/ChatRoom";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-start pb-8 pt-12 h-screen">
      <Typography variant="h2">Let's Talkk</Typography>
      <ChatRoom />
    </section>
  );
}
