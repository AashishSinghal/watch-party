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

const Chat = ({ roomId }: { roomId: string }) => {
  const [isUserJoined, setIsUserJoined] = useState<boolean>(true);
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const { sendMessage, socket, messages, setMessages } = useSocket();
  const [message, setMessage] = useState<string>("");
  const { user } = useUser();
  const formattedUser = getFormatedUserData(user, true);

  const handleUserJoin = useCallback(({ user, roomId, socketId }: any) => {
    console.log("User joined client - ", user.email);
    setIsUserJoined(true);
    setRemoteSocketId(socketId);
    const userJoinedMessage = {
      message: `${formattedUser?.email} joined chat...`,
      roomId,
      user: formattedUser,
    };
    setMessages((prev) => [...prev, userJoinedMessage]);
  }, []);

  const handleMessageSend = (e) => {
    e.preventDefault();
    setMessage("");
    sendMessage(message, formattedUser, roomId, remoteSocketId);
  };

  useEffect(() => {
    socket?.on("user:joined", handleUserJoin);

    return () => {
      socket?.off("user:joined", handleUserJoin);
    };
  }, [socket, handleUserJoin]);

  useEffect(() => {
    const userJoinedMessage = `${formattedUser?.email} joined chat...`;
    sendMessage(userJoinedMessage, user, roomId, remoteSocketId);
    setIsUserJoined(true);
  }, []);
  return (
    <div className="flex w-full flex-col items-center justify-end">
      {isUserJoined ? (
        <>
          <div className="flex h-72 w-full flex-col items-center justify-start gap-2 overflow-x-hidden overflow-y-scroll border border-cyan-300">
            {/* Map Messages here */}
            {console.log("remotesocketId -  ", remoteSocketId.length)}
            {remoteSocketId.length > 0 ? <Badge>{remoteSocketId}</Badge> : null}
            {messages?.map((data: IRedisMessageEventData) => {
              const { message: content, roomId, user: messageUser } = data;
              console.log("message data - ", message);
              return (
                <Message currentUserId={user?.id || ""} messageData={data} />
              );
            })}
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
