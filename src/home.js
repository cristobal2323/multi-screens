import React from 'react';
import './App.css';
import MultiScreen from "./screens.js"

function App() {
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
