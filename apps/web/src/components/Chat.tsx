"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketProvider";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { DNA } from "react-loader-spinner";
import { useUser } from "@clerk/nextjs";
import { getFormatedUserData } from "@/lib/utils";
import { IRedisMessageEventData } from "@/lib/types";
import Message from "./Message";
import { Badge } from "./ui/badge";

type IChatProps = {
  roomId: string;
  isUserJoined: boolean;
  remoteSocketId: string;
  messages: IRedisMessageEventData[];
  message: string;
  handleUserJoin: (params: any) => void;
  sendMessage: (
    message: string,
    user: any,
    roomId: string,
    remoteSocketId: string,
  ) => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const Chat = ({
  roomId,
  isUserJoined,
  remoteSocketId,
  messages,
  message,
  handleUserJoin,
  sendMessage,
  setMessage,
}: IChatProps) => {
  const { user } = useUser();
  const formattedUser = getFormatedUserData(user, true);

  const handleMessageSend = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setMessage("");
    sendMessage(message, formattedUser, roomId, remoteSocketId);
  };
  return (
    <div className="flex w-full flex-col items-center justify-end">
      {isUserJoined ? (
        <>
          <div className="flex h-72 w-full flex-col items-center justify-start gap-2 overflow-x-hidden overflow-y-scroll border border-cyan-300">
            {remoteSocketId.length > 0 ? <Badge>{remoteSocketId}</Badge> : null}
            {messages?.map((data: IRedisMessageEventData) => (
              <Message
                currentUserId={formattedUser?.id || ""}
                messageData={data}
              />
            ))}
          </div>
          <div className="flex w-full items-center justify-between gap-1 p-1">
            <Input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="type message..."
              type="text"
            />
            <Button variant={"outline"} onClick={(e) => handleMessageSend(e)}>
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
