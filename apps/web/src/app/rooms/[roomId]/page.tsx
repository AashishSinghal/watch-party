import Chat from "@/components/Chat";
import Video from "@/components/Video";
import React from "react";

const Room = ({ params: { roomId } }: { params: { roomId: string } }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center pt-[55px]">
      <div className="flex h-full w-full">
        <div className="h-auto w-9/12 border border-red-500">Content</div>
        <div className="flex h-auto w-3/12 flex-col border border-red-500">
          <div className="flex flex-1 border border-blue-500">
            {/* Video */}
            <Video/>
          </div>
          <div className="flex flex-1 border border-blue-500">
            {/* Chat */}
            <Chat roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
