import { memo, useEffect, useState } from 'react';
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

  const handlePlayAudio = () => {
    const audio = new Audio(); // Use the file path if not importing
    audio.src = '/song.mp3';
    audio.loop = true; // Loop the music
    audio.volume = 0.5; // Set the volume (0.0 to 1.0)

    // Start playing when the component mounts
    audio.play().catch(error => console.error("Audio play failed", error));

    // Pause the music when the component unmounts
    return () => audio.pause();
  };


  const handleClick = (e: any) => {
    handlePlayAudio();
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
    setGameState('game');
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
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width, height, backgroundColor: '#000' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {showLandscapeAlert && <img src='/alerts/rotate-alert.png' style={{ maxWidth: 350 }} width={'90%'} height={160} />}
        {showStartAlert && <img onClick={handleClick} src='/alerts/ooze-start-alert.png' style={{ maxWidth: 350 }} width={'90%'} height={220} />}
      </div>
    </div>
  );
}


export default StartMenu;