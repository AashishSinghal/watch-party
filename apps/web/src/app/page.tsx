import { CreateRoom } from "@/components/CreateRoom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

let user = true;

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Your Media Sharing Platform!
        </h1>
        <p className="text-lg mb-8">
          Share and watch media together with your friends in real-time.
        </p>
        <div>
          {!user ? (
            <>
              <p className="mb-4">Please sign up or log in to get started:</p>
              <div className="flex justify-center">
                <a
                  href="/sign-in"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
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
