import { useState, useEffect } from "react";

const usePeer = () => {
  const [peer, setPeer] = useState<RTCPeerConnection | null>();

  useEffect(() => {
    if (!peer) {
      const newPeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
      setPeer(newPeer);
    }
  }, []);

  async function getAnswer(offer: any) {
    if (peer) {
      let answerResponse: RTCSessionDescriptionInit | null;
      await peer
        .setRemoteDescription(offer)
        .then(() => {
          return peer.createAnswer();
        })
        .then((answer) => {
          console.log("🚀 ~ getAnswer ~ answer:", answer);
          answerResponse = answer;
          return peer.setLocalDescription(new RTCSessionDescription(answer));
        })
        .then(() => {
          return answerResponse;
        });
    }
  }

  async function setLocalDescription(answer: any) {
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async function getOffer() {
    if (peer) {
      let offer: any;
      await peer
        .createOffer()
        .then((offer) => {
          return peer.setLocalDescription(new RTCSessionDescription(offer));
        })
        .then(() => {
          return offer;
        });
    }
  }

  return {
    peer,
    getOffer,
    getAnswer,
    setLocalDescription,
  };
};

export default usePeer;
