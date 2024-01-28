"use client";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { useSocket } from "@/context/SocketProvider";
import { Input } from "@/components/ui/input";

const Home = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-start gap-2">
        {/* Map Messages here */}
        {messages?.map((message: string) => {
          return <span>{message}</span>;
        })}
      </div>
      <div className="flex items-center justify-between gap-1">
        <Input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="type message..."
          type="text"
        />
        <Button onClick={(e) => sendMessage(message)}>Send</Button>
      </div>
    </div>
  );
};

export default Home;
