"use client";
import { Mic, MicOff, VideoIcon, VideoOff } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./ui/button";
import useStream from "@/lib/useStream";
// import usePeer from "@/lib/usePeer";
import PeerService from "@/lib/PeerService";
import { useSocket } from "@/context/SocketProvider";

type IVideoProps = {
  remoteSocketId: string | null;
  setRemoteSocketId: any;
  handleUserJoin: any;
};

const Video = ({
  remoteSocketId,
  setRemoteSocketId,
  handleUserJoin,
}: IVideoProps) => {
  const [myStream, setMySteram] = useState<MediaStream | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [localStream, setLocalStream] = useState<any>(null);
  const [videoDimensions, setVideoDimensions] = useState<any>({
    height: "",
    width: "",
  });
  const videoWrapper = useRef<HTMLDivElement | null>(null);

  const { socket } = useSocket();

  // Handle Ref Events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // Get Wrapper DimenssionsP
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

  // Initiat Call
  const initiateCall = useCallback(
    async (remoteSocketId: string | null) => {
      console.log("Initiating Call...");
      if (remoteSocketId) {
        const offer = await PeerService.getOffer();
        socket?.emit("user:call", { to: remoteSocketId, offer });
      }
    },
    [socket, remoteSocketId, localStream],
  );

  const handleNegotiation = useCallback(async () => {
    const offer = await PeerService.getOffer();
    socket?.emit("peer:negotiation:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    const negotiationListener = PeerService.peer.addEventListener(
      "negotiationneeded",
      handleNegotiation,
    );

    return () => {
      if (negotiationListener) {
        PeerService.peer.removeEventListener(
          "negotiationneeded",
          negotiationListener,
        );
      }
    };
  }, [handleNegotiation]);

  // Track Event Listener for Setting Remote stream to state
  useEffect(() => {
    const trackListner = PeerService.peer.addEventListener(
      "track",
      async (ev: any) => {
        const remoteStream = ev.streams;
        console.log("remote stream - ", remoteStream, ev);
        setRemoteStream(remoteStream[0]);
      },
    );
    sendStream();
    return () => {
      if (trackListner) {
        PeerService.peer.removeEventListener("track", trackListner);
      }
    };
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      setRemoteSocketId(from);
      console.log("Incoming Call - ", from, offer);
      const answer = await PeerService.getAnswer(offer);
      console.log("Generated Answer - ", answer);
      socket?.emit("call:accepted", { to: from, answer });
    },
    [socket],
  );

  const sendStream = useCallback(async () => {
    if (localStream) {
      for (const track of localStream?.getTracks()) {
        await PeerService.peer?.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }: any) => {
      console.log("Call accepted from - ", from, answer);
      if (answer) {
        await PeerService.setLocalDescription(answer);
        console.log("Call accepted!!");
        sendStream();
      }
    },
    [sendStream],
  );

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }: any) => {
      const answer = await PeerService.getAnswer(offer);
      socket?.emit("peer:negotiation:done", { to: from, answer });
    },
    [socket],
  );

  const handleNegotiationFinal = useCallback(async ({ from, answer }: any) => {
    if (answer) {
      await PeerService.setLocalDescription(answer);
    }
  }, []);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoin);
    socket?.on("incoming:call", handleIncomingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:negotiation:needed", handleNegotiationIncoming);
    socket?.on("peer:negotiation:final", handleNegotiationFinal);

    return () => {
      socket?.off("user:joined", handleUserJoin);
      socket?.off("incoming:call", handleIncomingCall);
      socket?.off("call:accepted", handleCallAccepted);
      socket?.off("peer:negotiation:needed", handleNegotiationIncoming);
      socket?.off("peer:negotiation:final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiation,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  useEffect(() => {
    console.log("Remote Stream - ", remoteStream);
  }, [remoteStream]);

  return (
    <div className="flex w-full">
      <div className="w-72">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={videoWrapper}
          className="relative flex aspect-video w-full items-center justify-center border border-red-400 object-contain p-2"
        >
          {/* Show Controls when Video Container is being hovered on */}
          {isHovered && (
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
                playing={isVideoEnabled}
                muted={isAudioEnabled}
                height={`${videoDimensions.height || 0}px`}
                width={`${videoDimensions.width || 0}px`}
                url={localStream}
                className="z-0"
              />
            ) : null}
          </div>
        </div>
        {/* Other Video */}
        <div className="relative flex aspect-video w-full items-center justify-center border border-red-400 object-contain p-2">
          <div>
            {remoteStream ? (
              <>
                <ReactPlayer
                  playing={true}
                  muted={false}
                  height={`${videoDimensions.height || 0}px`}
                  width={`${videoDimensions.width || 0}px`}
                  url={remoteStream}
                  className="z-0"
                />
              </>
            ) : (
              "Call Not yet Connected"
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          onClick={() => {
            if (!remoteStream) {
              setIsVideoEnabled(true);
              setIsAudioEnabled(true);
              const stream = useStream();
              setLocalStream(stream);
              initiateCall(remoteSocketId);
            }
          }}
          disabled={remoteSocketId ? false : true}
        >
          Call
        </button>
        <button
          onClick={() => {
            sendStream();
          }}
          disabled={localStream ? true : false}
        >
          Send Stream
        </button>
      </div>
    </div>
  );
};

export default Video;
