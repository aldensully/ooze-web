import { useEffect, useState } from 'react';
import useGameStore from '../stores/useGameStore';


function StartMenu() {
  const setGameState = useGameStore(state => state.setGameState);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [showLandscapeAlert, setShowLandscapeAlert] = useState(false);
  const [showStartAlert, setShowStartAlert] = useState(true);

  function isLandscape() {
    return window.innerWidth > window.innerHeight;
  }


  const handleClick = (e: any) => {
    e.preventDefault();
    if (!isLandscape()) {
      setShowStartAlert(false);
      setShowLandscapeAlert(true);
    } else {
      handleFullScreen();
    }
  };

  function handleFullScreen() {
    setShowLandscapeAlert(false);
    var doc = window.document;
    var docEl = document.body;
    //doc.documentElement;

    //@ts-ignore
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    //@ts-ignore
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    //@ts-ignore
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
    // document.body.requestFullscreen({
    //   navigationUI: 'hide'
    // }).catch((e) => {
    //   alert(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
    // })
    //   .then(() => {
    //     setTimeout(() => {
    //       setGameState('game');
    //     }, 500);
    //   });
    // setGameState('game');
  }

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    if (isLandscape()) {
      handleFullScreen();
    } else {
      console.log('Device is in portrait mode');
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // document.addEventListener('fullscreenchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // document.removeEventListener('fullscreenchange', handleResize);
    };
  }, []);


  return (
    <div style={{ width, height, backgroundColor: '#000' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {showLandscapeAlert && <img src='/alerts/rotate-alert.png' width={'90%'} height={160} />}
        {showStartAlert && <img onClick={handleClick} src='/alerts/ooze-start-alert.png' width={'90%'} height={220} />}
        {/* <p style={{ color: '#fff', fontSize: 32 }}>Ooze</p> */}
        {/* <button
          onClick={handleClick}
          style={{ fontSize: 20, color: 'white', height: 50, width: 100, backgroundColor: 'gray', borderWidth: 0, fontWeight: 'bolder' }}
        >
          START
        </button> */}
      </div>
    </div>
  );
}

export default StartMenu;