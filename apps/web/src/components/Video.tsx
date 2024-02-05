"use client";
import { Mic, MicOff, VideoIcon, VideoOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import useStream from "@/lib/useStream";
import peer from "@/lib/peer";

const Video = () => {
  const [myStream, setMySteram] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState<any>({
    height: "",
    width: "",
  });
  const videoWrapper = useRef<HTMLDivElement | null>(null);
  const localStream = useStream({ isAudioEnabled, isVideoEnabled });

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

  return (
    <div className="w-full">
      {/* <div
        ref={videoWrapper}
        className="flex aspect-video  items-center justify-center border border-red-400 object-contain p-2"
      >
        {localStream && (isVideoEnabled || isAudioEnabled) ? (
          <ReactPlayer
            playing={true}
            height={`${videoDimensions.height || 0}px`}
            width={`${videoDimensions.width || 0}px`}
            url={localStream}
          />
        ) : (
          <div className="flex items-center justify-between gap-4">
            {!isVideoEnabled && <VideoOff />}
            {!isAudioEnabled && <MicOff />}
          </div>
        )}
      </div> */}
      {/* Other Video */}
      <div
        ref={videoWrapper}
        className="relative flex aspect-video w-full items-center justify-center border border-red-400 object-contain p-2"
      >
        <div className="absolute flex items-center justify-around border border-yellow-200 p-1">
          <Button
            variant={isAudioEnabled ? "default" : "outline"}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="bor"
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          <Button
            variant={isVideoEnabled ? "default" : "outline"}
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          >
            {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
          </Button>
        </div>
        {localStream && (isVideoEnabled || isAudioEnabled) ? (
          <ReactPlayer
            playing={true}
            height={`${videoDimensions.height || 0}px`}
            width={`${videoDimensions.width || 0}px`}
            url={localStream}
          />
        ) : (
          <div className="flex items-center justify-between gap-4">
            {!isVideoEnabled && <VideoOff />}
            {!isAudioEnabled && <MicOff />}
          </div>
        )}
      </div>

      {/* Controls */}
    </div>
  );
};

export default Video;
