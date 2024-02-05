import { useState, useEffect } from "react";

type UseStreamHookProps = {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
};

const useStream = ({ isAudioEnabled, isVideoEnabled }: UseStreamHookProps) => {
  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const fetchUserStream = async () => {
    try {
      if (isAudioEnabled || isVideoEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled
            ? {
                width: { min: 640, ideal: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: { ideal: 1.7777777778 },
              }
            : false,
          audio: isAudioEnabled
            ? {
                sampleSize: 16,
                channelCount: 2,
              }
            : false,
        });

        setUserStream(stream);
      } else {
        setUserStream(null);
      }
    } catch (err) {
      console.error("Error fetching stream:", err);
    }
  };

  useEffect(() => {
    setUserStream(null);
    fetchUserStream();
  }, [isAudioEnabled, isVideoEnabled]);

  return userStream;
};

export default useStream;
