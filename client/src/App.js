import "./App.css";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import data from "./data.json";

function App() {
  const [content, setContent] = useState("");
  const [receivedTime, setReceivedTime] = useState("");
  const [updateTime, setUpdateTime] = useState();
  const performReq = async () => {
    try {
      const response = await fetch(
        "https://1341-103-246-40-110.ngrok-free.app/msg",
        {
          method: "get",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
          contentType: "application/json; charset=utf-8",
        }
      );
      // console.log(response.body);
      const data = await response.json();
      // console.log(data);
      if (data && data.content) {
        const stringContent = data.content;
        const inJson = JSON.parse(stringContent);
        // console.log(inJson);
        const utcDate = new Date(data.createdAt);
        const istDate = new Date(
          utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        const formattedTime = istDate.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
        if (JSON.stringify(inJson.content) !== JSON.stringify(content)) {
          setContent(inJson.content);
          setReceivedTime(format(new Date(), "h:mm:ss a"));
          // console.log(formattedTime);
          setUpdateTime(formattedTime);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    performReq();
    const interval = setInterval(performReq, 1000);
    // console.log("interval made ");
    return () => clearInterval(interval);
  }, [content]);

  // useEffect(() => {
  //     const performReq = async () => {
  //         await fetch("http://localhost:8080/msg", {
  //             method: "POST",
  //             contentType: "application/json; charset=utf-8",
  //             // body: JSON.stringify({
  //             //   userMessage: 'Give me a quote'
  //             // })
  //         })
  //             .then(() => console.log("req sent done from front end"))
  //             .catch((err) => console.log(err));
  //     };

  //     const interval = setInterval(performReq, 12000);
  //     console.log("interval made");
  //     return() => clearInterval(interval);
  // }, []);

  return (
    <>
      <div className="h-screen grid place-content-center bg-[#FFB996] sm:bg-[#FFB996] md:bg-[#FFB996]">
        <div className="mx-auto justify-center font-bold font-mono text-2xl sm:text-4xl md:text-6xl">
          Words to live by
        </div>
        <br />
        <div className="grid grid-cols-2 gap-2 mx-2 my-2 flex-1	max-w-xl font-serif bg-[#FFB996] text-white sm:bg-[#FFB996] sm:text-black md:bg-[#FFB996] md:text-black max-h-xl place-content-center p-6 ">
          <div className="grid mx-1  max-w-xl font-serif bg-[#365486] text-white sm:bg-[#D2E3C8] sm:text-black md:bg-[#FDFFAB] md:text-black max-h-xl place-content-center p-2 border-2 border-gray-500 rounded-lg shadow">
            received @: {receivedTime}
          </div>
          <div className="grid mx-1 max-w-xl font-serif bg-[#365486] text-white sm:bg-[#D2E3C8] sm:text-black md:bg-[#FDFFAB] md:text-black max-h-xl place-content-center p-2 border-2 border-gray-500 rounded-lg shadow">
            updated @: {updateTime}
          </div>
        </div>
        <div className="grid mx-2 my-2 flex-1	max-w-xl font-serif bg-[#365486] text-white sm:bg-[#D2E3C8] sm:text-black md:bg-[#FDFFAB] md:text-black max-h-xl place-content-center p-6 border-4 border-gray-500 rounded-lg shadow">
          <p className="align-middle text-2xl">{content}</p>
        </div>
      </div>
    </>
  );
}

export default App;
