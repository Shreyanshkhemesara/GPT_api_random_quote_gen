import "./App.css";
import React, { useState, useEffect } from "react";
import data from "./data.json";

function App() {
  const [content, setContent] = useState("");
  const performReq = async () => {
    try {
      const response = await fetch(
        "https://aa10-202-148-59-157.ngrok-free.app/msg",
        {
          method: "get",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
          contentType: "application/json; charset=utf-8",
        }
      );
      console.log(response.body);
      const data = await response.json();
      console.log(data);
      if (data && data.content) {
        const stringContent = data.content;
        const inJson = JSON.parse(stringContent);
        setContent(inJson.content);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    performReq();
    const interval = setInterval(performReq, 1000);
    console.log("interval made ");
    return () => clearInterval(interval);
  }, []);

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
      <div className="h-screen grid place-content-center bg-[#DCF2F1] sm:bg-[#739072] md:bg-[#FFB996]">
        <div className="mx-auto justify-center font-bold font-mono text-2xl sm:text-4xl md:text-6xl">
          Words to live by
        </div>
        <br />
        <div className="grid mx-2 my-2 max-w-xl font-serif bg-[#365486] text-white sm:bg-[#D2E3C8] sm:text-black md:bg-[#FDFFAB] md:text-black max-h-xl place-content-center p-6 border-4 border-gray-500 rounded-lg shadow">
          <p className="align-middle text-2xl">{content}</p>
        </div>
      </div>
    </>
  );
}

export default App;
