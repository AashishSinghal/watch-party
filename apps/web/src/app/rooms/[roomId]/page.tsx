"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { useUser } from "@clerk/nextjs";
import { getFormatedUserData } from "@/lib/utils";
import Chat from "@/components/Chat";
import Video from "@/components/Video";

const Room = ({ params: { roomId } }: { params: { roomId: string } }) => {
  const [isUserJoined, setIsUserJoined] = useState<boolean>(true);
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const { sendMessage, socket, messages, setMessages } = useSocket();
  const [message, setMessage] = useState<string>("");
  const { user } = useUser();
  const formattedUser = getFormatedUserData(user, true);

  const handleUserJoin = useCallback(({ user, roomId, socketId }: any) => {
    console.log("User joined client - ", user, socketId);
    setIsUserJoined(true);
    setRemoteSocketId(socketId);
  }, []);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoin);
    console.log("🚀 ~ useEffect ~ handleUserJoin:");
    return () => {
      socket?.off("user:joined", handleUserJoin);
    };
  }, [socket, handleUserJoin]);

  useEffect(() => {
    // const userJoinedMessage = `${formattedUser?.email} joined chat...`;
    setIsUserJoined(true);
  }, []);
  return (
    <div className="flex h-screen w-screen flex-col items-center pt-[55px]">
      <div className="flex h-full w-full">
        <div className="h-auto w-9/12 border border-red-500">Content</div>
        <div className="flex h-auto w-3/12 flex-col border border-red-500">
          <div className="flex flex-1 border border-blue-500">
            {/* Video */}
            <Video
              remoteSocketId={remoteSocketId}
              setRemoteSocketId={setRemoteSocketId}
            />
          </div>
          <div className="flex flex-1 border border-blue-500">
            {/* Chat */}
            <Chat
              roomId={roomId}
              isUserJoined={isUserJoined}
              remoteSocketId={remoteSocketId}
              messages={messages}
              message={message}
              handleUserJoin={handleUserJoin}
              sendMessage={sendMessage}
              setMessage={setMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
