import React, {useEffect} from 'react';
import './App.css';
import MultiScreen from "./screens.js"



function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);

  event
    .currentTarget
    .style
    .backgroundColor = 'yellow';
}


function App() {

  useEffect(() => {
    function checkDrop() {
      const item = localStorage.getItem('drop')
      const element = document.getElementById(item);
      element.remove();
    }
  
    window.addEventListener('storage', checkDrop)
  
    return () => {
      window.removeEventListener('storage', checkDrop)
    }
  }, [])


  return (
    <section>
      <h1>Multy screen.</h1>
      <button type="button" onClick={() => MultiScreen([`${window.location.origin}/contact`, `${window.location.origin}/about`])}>
        Open screens
      </button>

      <div className="example-parent">

        <div className="example-origin">
          Widtgets
          <div
            id="widget1"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            Widtget 1
          </div>
          <div
            id="widget2"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            Widtget 2
          </div>
          <div
            id="widget3"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            Widtget 3
          </div>
          <div
            id="widget4"
            className="example-draggable"
            draggable="true"
            onDragStart={onDragStart}
          >
            Widtget 4
          </div>
        </div>


      </div>
    </section>
  );

}

export default App;
