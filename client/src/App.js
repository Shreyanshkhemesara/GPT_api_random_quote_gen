import './App.css';
import React, { useEffect, useState } from 'react';
import data from './data.json'
function App() {


  const performReq = async() => {
    await fetch('http://localhost:3000/msg')
  }

  setInterval(performReq,5000);

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
