"use client";

import { IRedisMessageEventData } from "@/lib/types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  socket: Socket | undefined;
  sendMessage: (
    message: string,
    user: any,
    roomId: string,
    remoteSocketId: string,
  ) => any;
  messages: IRedisMessageEventData[];
  setMessages: React.Dispatch<React.SetStateAction<IRedisMessageEventData[]>>;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("State is undefined !!");
  }
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IRedisMessageEventData[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (message, user, roomId, remoteSocketId) => {
      console.log("🚀 ~ remoteSocketId:", remoteSocketId);
      console.log("🚀 ~ message:", message);
      if (socket) {
        socket.emit("event:messsage", {
          message,
          user,
          roomId,
          remoteSocketId,
        });
      }
    },
    [socket],
  );

  const onMessageRec = useCallback((data: string) => {
    const { message, user, roomId } = JSON.parse(
      data,
    ) as IRedisMessageEventData;
    setMessages((prev: IRedisMessageEventData[]) => [
      ...prev,
      { message, user, roomId },
    ]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ sendMessage, messages, socket, setMessages }}
    >
      {children}
    </SocketContext.Provider>
  );
};
