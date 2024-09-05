import { useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoPlayCount, setVideoPlayCount] = useState(0);

  function createBlobURL(data: any) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    // Append recorded message to messages
    const myMessage = { sender: "me", blobUrl };
    const messagesArr = [...messages, myMessage];

    // convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // send form data to api endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "arraybuffer", // Set the response type to handle binary data
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);

            // Append to audio
            const rachelMessage = { sender: "rachel", blobUrl: audio.src };
            messagesArr.push(rachelMessage);
            setMessages(messagesArr);

            // Play audio
            setIsLoading(false);
            audio.play();

            // Start the video when the first API response is received
            if (!videoStarted) {
              const video = document.getElementById("bg-video");
              video.play();
              setVideoStarted(true);
            } else {
              // Increment the video play count and restart the video
              setVideoPlayCount(videoPlayCount + 1);
              const video = document.getElementById("bg-video");
              video.currentTime = 0;
              video.play();
            }
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };

  useEffect(() => {
    // Stop the video when the last audio message finishes playing
    if (videoStarted && videoEnded) {
      const video = document.getElementById("bg-video");
      video.pause();
    }
  }, [videoStarted, videoEnded]);

  return (
    <div className="h-screen overflow-y-hidden">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        {/* Conversation */}
        <div className="mt-5 px-5">
          {messages?.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " +
                  (audio.sender == "rachel" && "flex items-end")
                }
              >
                {/* Sender */}
                <div className="mt-4 ">
                  <p
                    className={
                      audio.sender == "rachel"
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>
                  {/* Message */}
                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                    onEnded={() => {
                      setVideoEnded(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Ask Zoe anything, she's here for you...
            </div>
          )}
          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Give her time, she's worth it!
            </div>
          )}
        </div>

        {/* Video */}
        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
          <div className="flex justify-center items-center w-full">
            {/* <div>               <Video />             </div> */}
            <video id="bg-video" style={{ width: "100%" }}>
              <source src="ZoePerfect.mp4" type="video/mp4" />
            </video>
            {/* Recorder */}
            <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
              <div className="flex justify-center items-center w-full">
                <div>
                  <RecordMessage handleStop={handleStop} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;