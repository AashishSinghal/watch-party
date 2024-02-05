"use client";
import { IRedisMessageEventData } from "@/lib/types";
import React from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Message = ({
  messageData,
  currentUserId,
}: {
  messageData: IRedisMessageEventData;
  currentUserId: string;
}) => {
  const { message, user, roomId } = messageData;
  if (message.includes("joined")) {
    return (
      <div>
        <Badge className="h-[10px] px-1 py-2 text-[8px]">
          {user.email} Joined
        </Badge>
      </div>
    );
  }

  if (user.id === currentUserId) {
    return (
      <div className="flex w-full items-center justify-between gap-2 p-1 pl-5">
        <Badge className="w-full">{message}</Badge>
        <Avatar className="h-5 w-5">
          <AvatarImage src={user.imageUrl} alt="@shadcn" />
          <AvatarFallback>
            `${user.firstName[0]}${user.lastName[0]}`
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-between gap-2 p-1 pr-5">
      <Avatar className="h-5 w-5">
        <AvatarImage src={user.imageUrl} alt="@shadcn" />
        <AvatarFallback>
          `${user.firstName[0]} ${user.lastName[0]}`
        </AvatarFallback>
      </Avatar>
      <Badge variant={"secondary"} className="w-full">
        {message}
      </Badge>
    </div>
  );
};

export default Message;
