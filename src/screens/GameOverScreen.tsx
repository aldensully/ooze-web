import { useEffect, useRef, useState } from 'react';
import useGameStore from '../stores/useGameStore';
import '../styles/App.css';

const navigateToYouTube = () => {
  window.open('https://youtu.be/lrYZircVPEg?si=45MwrY_L-NmQTqM_', '_blank');
};

const GameOverScreen = () => {
  const setGameState = useGameStore(state => state.setGameState);
  const finalScore = useGameStore(state => state.score);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [showDogs, setShowDogs] = useState(false);
  const [showTooMuch, setShowTooMuch] = useState(false);
  const [showDrowned, setShowDrowned] = useState(false);
  const [showRestartButton, setShowRestartButton] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowDogs(true);
    }, 2000);
    const timer2 = setTimeout(() => {
      setShowTooMuch(true);
    }, 2500);
    const timer3 = setTimeout(() => {
      setShowDrowned(true);
    }, 200);
    const timer4 = setTimeout(() => {
      setShowRestartButton(true);
    }, 4000);
    const timer5 = setTimeout(() => {
      setShowCongrats(true);
    }, 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div style={{ width, height, backgroundColor: '#EBFF00', overflow: 'hidden' }}>
      <img
        onClick={navigateToYouTube}
        style={{ maxWidth: 300, position: 'absolute', left: 20, top: 30 }}
        src='/alerts/prime-ad.png'
        width={'auto'} height={height * 0.7}
      />
      {showDogs && <img
        onClick={navigateToYouTube}
        style={{ maxWidth: 300, position: 'absolute', left: '30%', zIndex: 1000, top: 50 }}
        src='/alerts/dogs.png'
        width={'auto'} height={height * 0.5}
      />
      }
      {showDrowned && <img
        onClick={() => setGameState('game')}
        style={{ maxWidth: 300, position: 'absolute', right: 0, zIndex: 4600, top: 0 }}
        src='/alerts/start-over-alert.png'
        width={'auto'} height={height * 0.4}
      />
      }
      {showTooMuch && <img
        onClick={() => setGameState('game')}
        style={{ maxWidth: 300, position: 'absolute', left: 10, zIndex: 1600, bottom: 10 }}
        src='/alerts/too-much-ooze.png'
        width={'auto'} height={height * 0.25}
      />
      }
      {showRestartButton && <img
        onClick={() => setGameState('game')}
        style={{ maxWidth: 300, zIndex: 2000, position: 'absolute', left: '25%', bottom: 30 }}
        src='/alerts/start-over-button.png'
        width={'auto'} height={height * 0.2}
        className="flashing-image" alt="Flashing image"
      />
      }
      {showCongrats && <img
        onClick={navigateToYouTube}
        style={{ maxWidth: 300, zIndex: 2000, position: 'absolute', top: 5, left: 10 }}
        src='/alerts/congrats.png'
        width={'auto'} height={height * 0.3}
        className="flashing-image-2" alt="Flashing image"
      />
      }
      <WatchScreenPopups />
    </div>
  );
};


function WatchScreenPopups() {
  const [showState, setShowState] = useState(0);
  const imgs = [
    '/alerts/watch-1.png',
    '/alerts/watch-2.png',
    '/alerts/watch-3.png',
    '/alerts/watch-4.png',
    '/alerts/watch-5.png',
    '/alerts/watch-6.png',
  ];

  useEffect(() => {
    const inter = setInterval(() => {
      setShowState(s => s + 1 % imgs.length);
    }, 300);
    return () => {
      clearInterval(inter);
    };
  }, []);


  return (
    <div style={{ zIndex: 100, position: 'absolute', left: '40%', top: 20, right: 0, bottom: 0 }}>
      {imgs.map((img, i) => i <= showState && (
        <img
          onClick={navigateToYouTube}
          key={'image' + i}
          style={{ maxWidth: 500, position: 'absolute', left: 20 * i, top: 20 * i }}
          src={img}
          width={'auto'} height={window.innerHeight * 0.7}
        />
      ))}
    </div>
  );
}


export default GameOverScreen;