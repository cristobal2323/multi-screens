import React from 'react';
import './App.css';
import MultiScreen from "./screens.js"
import {useLocation} from "react-router-dom";

function App() {
  const location = useLocation();
  console.log(window.location.host)
  return (
    <div className='App'>
      <h1>Multy screen.</h1>
      <button type="button" onClick={() => MultiScreen([`${window.location.origin}/contact`, `${window.location.origin}/about`])}>
        Open screens
      </button>
    </div>
  );

}

export default App;
