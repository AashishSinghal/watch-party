"use client";
import { api } from "@/trpc/react";
import React, { useCallback, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, DeleteIcon, Edit2Icon, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketProvider";
import { useUser } from "@clerk/nextjs";
import { getFormatedUserData } from "@/lib/utils";

const Rooms = () => {
  const router = useRouter();
  const { user } = useUser();
  const { isSuccess, data, isPending } = api.room.getAllRooms.useQuery();
  const { socket } = useSocket();
  const formattedUser = getFormatedUserData(user);

  //   Handle User Join Room

  const handleUserJoin = useCallback((data: any) => {
    console.log("data on room join - ", data);
    router.push(`/rooms/${data.roomId}`);
  }, []);

  const joinRoom = (id: string) => {
    if (id) {
      socket?.emit("room:join", {
        user: formattedUser,
        roomId: id,
      });
    } else {
      alert("Id null");
    }
  };

  useEffect(() => {
    socket?.on("room:join", handleUserJoin);
    return () => {
      socket?.off("room:join", handleUserJoin);
    };
  }, [socket]);

  const openDialog = () => {};
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-[50px]">
      <h1>List of Rooms</h1>
      <Table>
        <TableCaption>A list of active rooms.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Room Name</TableHead>
            <TableHead>Private</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((room) => {
            const { id, name, isPrivate } = room;
            return (
              <TableRow key={id}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{isPrivate ? "Yes" : "No"}</TableCell>
                <TableCell className="flex items-center justify-end gap-3">
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => {
                      if (isPrivate) {
                        openDialog();
                      } else {
                        joinRoom(id);
                      }
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <DeleteIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Rooms;
