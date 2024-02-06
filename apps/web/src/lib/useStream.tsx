import { useState, useEffect } from "react";

type UseStreamHookProps = {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
};

const useStream = () => {
  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const fetchUserStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1920 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },

        audio: {
          sampleSize: 16,
          channelCount: 2,
        },
      });
      setUserStream(stream);
    } catch (err) {
      console.error("Error fetching stream:", err);
    }
  };

  useEffect(() => {
    setUserStream(null);
    fetchUserStream();
  }, []);

  return userStream;
};

export default useStream;
