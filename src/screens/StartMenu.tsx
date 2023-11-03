import { useEffect, useState } from 'react';
import useGameStore from '../stores/useGameStore';


function StartMenu() {
  const setGameState = useGameStore(state => state.setGameState);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleClick = (e: any) => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen({
        navigationUI: 'hide'
      }).catch((e) => {
        alert(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      })
        .then(() => {
          setGameState('game');
        });

    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
    };
  }, []);

  return (
    <div style={{ width, height, backgroundColor: '#000' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: 32 }}>Ooze</p>
        <button
          onClick={handleClick}
          style={{ fontSize: 20, color: 'white', height: 50, width: 100, backgroundColor: 'gray', borderWidth: 0, fontWeight: 'bolder' }}
        >
          START
        </button>
      </div>
    </div>
  );
}

export default StartMenu;