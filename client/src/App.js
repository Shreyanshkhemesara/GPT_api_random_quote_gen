import "./App.css";
import React, { useEffect, useState } from "react";
import data from "./data.json";

function App() {
    const performReq = async () => {
        await fetch("http://localhost:8080/msg", {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            // body: JSON.stringify({
            //   userMessage: 'Give me a quote'
            // })
        })
            .then(() => console.log("req sent done from front end"))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        const interval = setInterval(performReq, 600000);
        console.log("interval made ");
        return () => clearInterval(interval);
    }, [data]);

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

    //     setInterval(performReq, 120000);
    // }, [data]);

    return (
        <>
            {data.map((item, index) => (
                <li key={index}>{item.content}</li>
            ))}
        </>
    );
}

export default App;
