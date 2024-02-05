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
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async function setLocalDescription(answer: any) {
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async function getOffer() {
    if (peer) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
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
