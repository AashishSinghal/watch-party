'use client'

import { useState } from "react";
import { getFormatedUserData } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";

export default function CreateRoom() {
  const [name, setName] = useState<string>('')
  const { isSignedIn, user, isLoaded } = useUser();
  console.log("user in client - ", user)
  if(user){
    console.log("formated user - ", getFormatedUserData(user, true))
  }

  const createRoom = () => {
    const createRoomMutation = api.room.createRoom.useMutation().mutate({
      name,
      
    })


  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          //   onClick={}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>
            You can make a private room with a password. Just toggle room type.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Room Name
            </Label>
            <Input id="name" name="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="submit">
            Cancle
          </Button>
          <Button type="submit" onClick={createRoom}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
