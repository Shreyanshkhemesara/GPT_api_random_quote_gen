import './App.css';
import React, { useEffect, useState } from 'react';
import data from './data.json'
function App() {


  useEffect(() => {
    const performReq = async() => {
      await fetch('http://localhost:3000/msg', {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        // body: JSON.stringify({
        //   userMessage: 'Give me a quote'
        // })
      }).catch(err => console.log(err))
    }

    setInterval(performReq,5000);
  },[data])
  
  

  return (
    <>
    {
      data.map((item,index) => (
        <li key={index}>{item.content}</li>
      ))
    }
    </>
  );
}

export default App;
