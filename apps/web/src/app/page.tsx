import CreateRoom from "@/components/CreateRoom";
import { createUser } from "@/lib/userService";
import { getFormatedUserData, prismaClient } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (user) {
    const formattedUser = getFormatedUserData(user);
    if (formattedUser) {
      await createUser(formattedUser);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-6 text-4xl font-bold">
          Welcome to Your Media Sharing Platform!
        </h1>
        <p className="mb-8 text-lg">
          Share and watch media together with your friends in real-time.
        </p>
        <div>
          {!user ? (
            <>
              <p className="mb-4">Please sign up or log in to get started:</p>
              <div className="flex justify-center">
                <a
                  href="/sign-in"
                  className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                >
                  Join Watchtogether
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">You&apos;re signed in!</p>
              <div className="flex justify-center gap-2">
                <CreateRoom />
                <Link
                  href={"/rooms"}
                  className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
                >
                  Join Room
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
