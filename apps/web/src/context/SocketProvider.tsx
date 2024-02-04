"use client";

import { IRedisMessageEventData } from "@/lib/types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  socket: Socket | undefined;
  sendMessage: (msg: string, user: any, roomId: string) => any;
  messages: string[];
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
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, user, roomId) => {
      console.log("Send Message - ", msg);
      if (socket) {
        socket.emit("event:messsage", { message: msg, user, roomId });
      }
    },
    [socket],
  );

  const onMessageRec = useCallback((data: string) => {
    console.log("Message rec from server - ", data);
    const { message } = JSON.parse(data) as IRedisMessageEventData;
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    console.log("socket - ", _socket);
    return () => {
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
