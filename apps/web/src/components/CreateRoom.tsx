"use client";

import { Suspense, useEffect, useState } from "react";
import { getFormatedUserData } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { DNA } from "react-loader-spinner";
import {
  Dialog,
  DialogClose,
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
import { IRoomData } from "@/lib/types";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const router = useRouter();
  const [roomData, setRoomData] = useState<IRoomData>({
    name: "",
    password: "",
    isPrivate: false,
  });
  const { name, password, isPrivate } = roomData;
  const { isSignedIn, user, isLoaded } = useUser();
  const formattedUser = getFormatedUserData(user, true);
  const { isPending, isSuccess, data, mutate } =
    api.room.createRoom.useMutation();

  const createRoom = async () => {
    if (formattedUser) {
      await mutate({
        name,
        password,
        isPrivate,
        createdby: formattedUser,
      });
      if (isSuccess) {
        router.push("/rooms");
      }
    } else {
      console.log("formatted user null !!");
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRoomData({ ...roomData, [e.currentTarget.name]: e.currentTarget.value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          //   onClick={}
          className="rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-600"
        >
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Suspense
          fallback={
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          }
        >
          {!isPending && (
            <>
              <DialogHeader>
                <DialogTitle>Create Room</DialogTitle>
                <DialogDescription>
                  You can make a private room with a password. Just toggle room
                  type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Room Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                {isPrivate && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex sm:justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="private">Private</Label>
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={(val) => {
                      setRoomData({ ...roomData, isPrivate: val });
                    }}
                  />
                </div>
                <div className="flex gap-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="submit">
                      Cancle
                    </Button>
                  </DialogClose>
                  <Button type="submit" onClick={createRoom}>
                    Create
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
