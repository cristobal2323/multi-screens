let ROWS = 1;
let COLS = 1;
const WINDOW_CHROME_Y = 51;
const WINDOW_CHROME_X = 1;

let popups = [];
let popupMonitor = null;
let cachedScreens = null;


const createPopup = (width, height ,screenX, screenY, screen, page) => {

  const features = [
    `left=${screenX}`,
    `top=${screenY}`,
    `width=${width}`,
    `height=${height}`,
    `menubar=no`,
    `toolbar=yes`,
    `location=yes`,
    `status=yes`,
    `resizable=yes`,
    `scrollbars=yes`
  ].join(",");

  let screens = localStorage.getItem("screens");
  screens = screens ? JSON.parse(screens) : [];
  const index = screens.findIndex((o)=> o.page === page);
  
  if(index < 0){
    const obj = {availHeight: screen.availHeight, availTop: screen.availTop, availLeft: screen.availLeft, availWidth: screen.availWidth, page: page}
    screens.push(obj);
    localStorage.setItem("screens", JSON.stringify(screens));
  }

  return window.open(page, Math.random().toString(), features);  
};

const isSupported = "getScreens" in window || "getScreenDetails";

const getScreensInfo = async (pages) => {
  if (isSupported && (window.getScreens || window.getScreenDetails) ) {
    if (cachedScreens) {
      return cachedScreens.screens;
    } else {
      cachedScreens = "getScreens" in window ? await window.getScreens() : await window.getScreenDetails();
      console.log(cachedScreens)
      cachedScreens.addEventListener("screenschange", async e => {
        console.log("screenschange", e);
        closeAllPopups();
        await elmerify();
      });
      cachedScreens.addEventListener("currentscreenchange", async e => {
        console.log("currentscreenchange", e);
      });
      return cachedScreens.screens;
    }
  }
  const arrPages = []
  console.log(window.screen)
  pages.forEach((e)=>{
    arrPages.push(window.screen)
  })

  return arrPages;
};

const onPopupClose = e => {
  e.preventDefault();
  closeAllPopups();
  return e.returnValue = "This string must be non-empty";
};

const closeAllPopups = () => {
  popups.forEach(popup => {
    popup.removeEventListener("beforeunload", onPopupClose); 
    popup.close();
  });
  popups = [];  
  clearInterval(popupMonitor);
};

const checkPopupClose = () => {
  popups.forEach(popup => {
    if (popup.closed) {
      closeAllPopups();
      return;
    }
  });
}
const onPopupClick = async e => {
  const body = e.target.closest("body");
  popups.forEach(popup => {
    if (e.view === popup) {
      return;
    }
    popup.document.exitFullscreen();
  });
  try {
    if (e.view.document.fullscreenElement) {
      return await e.view.document.exitFullscreen();
    }
    const screensInterface = "getScreens" in window ? await e.view.getScreens() : await e.view.getScreenDetails();
    let otherScreen = screensInterface.screens.filter(
      screen => screen !== screensInterface.currentScreen
    )[0];
    if (!otherScreen) {
      otherScreen = screensInterface.screens[0];
    }
    await body.requestFullscreen({
      screen: otherScreen
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const elmerify = async (pages) => {
  // For now, don't run in an iframe, but pop out to a new window.
  // TODO(crbug.com/1182855): Run full demo from iframe once it's supported.
  if (window.self !== window.top) {
    //window.open(location.href)//, "", "noopener,noreferrer");
    return;
  }
  
  const screens = localStorage.getItem("screens") ? JSON.parse(localStorage.getItem("screens")) : await getScreensInfo(pages);

  popups = [];
  screens.forEach((screen, numScreen) => {
    loop: for (let i = 0; i < COLS; i++) {
        // feature screen 
        let width = Math.floor((screen.availWidth - COLS * WINDOW_CHROME_X) / COLS);
        let height = Math.floor(
          (screen.availHeight - ROWS * WINDOW_CHROME_Y) / ROWS
        );

        let screenX = i * width + screen.availLeft + i * WINDOW_CHROME_X;
        //let screenY = j * height + screen.availTop + j * WINDOW_CHROME_Y;
        let screenY = screen.availTop;
    
        let sendpage = screen.page ? screen.page : pages[numScreen];
        const popup = createPopup(width, height, screenX, screenY, screen, sendpage);
        if (!popup) {
          popups.forEach(popup => popup.close());
          alert(
            "It looks like you are blocking popup windows. Please allow them as outlined at https://goo.gle/allow-popups."
          );
          break loop;
        }
        //popup.addEventListener("beforeunload", onPopupClose);
        //popup.addEventListener("click", onPopupClick);
        popups.push(popup);
      
    }
  });
  
  // Workaround for beforeunload event listener not being called; see crbug.com/1153004.
  popupMonitor = setInterval(checkPopupClose, 500);
};

const init = async (pages) => {
  await fetch("iframe.html");
  closeAllPopups();
  await elmerify(pages);


  window.addEventListener("beforeunload", () => {
    closeAllPopups();
  });
};

export default init
