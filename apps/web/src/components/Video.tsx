"use client";
import { Mic, MicOff, VideoIcon, VideoOff } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import useStream from "@/lib/useStream";
import usePeer from "@/lib/usePeer";
import { useSocket } from "@/context/SocketProvider";

type IVideoProps = {
  remoteSocketId: string;
  setRemoteSocketId: any;
};

const Video = ({ remoteSocketId, setRemoteSocketId }: IVideoProps) => {
  const [myStream, setMySteram] = useState<MediaStream | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState<any>({
    height: "",
    width: "",
  });
  const videoWrapper = useRef<HTMLDivElement | null>(null);
  const localStream = useStream({
    isAudioEnabled,
    isVideoEnabled,
  });

  const { socket } = useSocket();
  const { getOffer, getAnswer, setLocalDescription } = usePeer();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const getDivDimensions = () => {
      if (videoWrapper.current) {
        const { height, width } = videoWrapper.current.getBoundingClientRect();
        setVideoDimensions({ height, width });
      }
    };
    getDivDimensions();
    const handleResize = () => {
      getDivDimensions();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const initiateCall = useCallback(
    async (remoteSocketId: string) => {
      console.log("Initiating Call...");
      const offer = await getOffer();
      socket?.emit("user:call", { to: remoteSocketId, offer });
    },
    [socket, remoteSocketId],
  );

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ remoteSocketId:", remoteSocketId);
    if (remoteSocketId) {
      initiateCall(remoteSocketId);
    }
  }, [remoteSocketId]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      setRemoteSocketId(from);
      console.log("Incoming Call - ", from, offer);
      const answer = await getAnswer(offer);
      socket?.emit("call:accepted", { to: from, answer });
    },
    [socket],
  );

  const handleCallAccepted = useCallback(({ from, answer }: any) => {
    console.log("Call accepted from - ", from);
    setLocalDescription(answer);
    console.log("Call accepted!!");
  }, []);

  useEffect(() => {
    socket?.on("incoming:call", handleIncomingCall);
    socket?.on("call:accepted", handleCallAccepted);

    return () => {
      socket?.off("incoming:call", handleIncomingCall);
      socket?.off("call:accepted", handleCallAccepted);
    };
  }, [socket]);

  return (
    <div className="w-full">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={videoWrapper}
        className="relative flex aspect-video w-full items-center justify-center border border-red-400 object-contain p-2"
      >
        {/* Show Controls when Video Container is being hovered on */}
        {((!isAudioEnabled && !isVideoEnabled) || isHovered) && (
          <div className="absolute z-10 flex h-full w-full items-center justify-center gap-2 border border-yellow-200 p-1">
            <Button
              variant={isVideoEnabled ? "default" : "outline"}
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            >
              {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
            </Button>
            <Button
              variant={isAudioEnabled ? "default" : "outline"}
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="bor"
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </Button>
          </div>
        )}
        <div>
          {localStream && (isVideoEnabled || isAudioEnabled) ? (
            <ReactPlayer
              playing={true}
              height={`${videoDimensions.height || 0}px`}
              width={`${videoDimensions.width || 0}px`}
              url={localStream}
              className="z-0"
            />
          ) : null}
        </div>
      </div>
      {/* Other Video */}
    </div>
  );
};

export default Video;
