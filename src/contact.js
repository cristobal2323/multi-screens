import React, { useEffect } from 'react';

function Contact() {
  useEffect(() => {
    var oldX = window.screenX,
      oldY = window.screenY;

    var interval = setInterval(function () {
      if (oldX != window.screenX || oldY != window.screenY) {
        console.log('moved!',  window.location.href );

        let screens = localStorage.getItem("screens");
        screens = screens ? JSON.parse(screens) : [];

        const index = screens.findIndex((o)=> o.page === window.location.href);
       
        if(index > -1){
          console.log(index,window.location.href)
          screens.splice(index, 1);
          
         
          const obj = {availHeight: window.screen.availHeight, availTop: window.screen.availTop, availLeft: window.screen.availLeft, availWidth: window.screen.availWidth, page: window.location.href };
          screens.push(obj)
          console.log(screens)
          localStorage.setItem("screens", JSON.stringify(screens)); 
        }
      } else {
        console.log('not moved!', window.screen);
      }

      oldX = window.screenX;
      oldY = window.screenY;
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  return (
    <div className='App' style={{background: "red", width: "100vw", height: "100vh"}}>
      <h1>Contact</h1>
      <button>
        Save position
      </button>

    </div>
  );

}

export default Contact;
