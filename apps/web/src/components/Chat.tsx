"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketProvider";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { DNA } from "react-loader-spinner";
import { useUser } from "@clerk/nextjs";
import { getFormatedUserData } from "@/lib/utils";

const Chat = ({ roomId }: { roomId: string }) => {
  const [isUserJoined, setIsUserJopined] = useState<boolean>(false);
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  const { socket } = useSocket();
  const { user } = useUser();
  const formattedUser = getFormatedUserData(user, true);
  useEffect(() => {
    console.log("formattedUser - ", formattedUser, user);
    if (user && socket && formattedUser) {
      socket.emit("room:join", { roomId, formattedUser });
      setIsUserJopined(true);
    }
  }, [isUserJoined, socket, user]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {isUserJoined ? (
        <>
          <div className="flex w-full flex-1 flex-col items-center justify-start gap-2 border border-cyan-300">
            {/* Map Messages here */}
            {messages?.map((message: string) => {
              return <span>{message}</span>;
            })}
          </div>
          <div className="flex w-full items-center justify-between gap-1 p-1">
            <Input
              onChange={(e) => setMessage(e.target.value)}
              placeholder="type message..."
              type="text"
            />
            <Button
              variant={"outline"}
              onClick={(e) => sendMessage(message, user, roomId)}
            >
              <Send />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1">
          <DNA
            visible={true}
            height="40"
            width="40"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          Connecting to Room...
        </div>
      )}
    </div>
  );
};

export default Chat;
