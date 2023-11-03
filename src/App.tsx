import './styles/App.css';
import Game from './screens/Game';
import { useEffect, useState } from 'react';
import StartMenu from './screens/StartMenu';
import GameOverScreen from './screens/GameOverScreen';
import useGameStore from './stores/useGameStore';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  const handleOrientation = () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    if (!isLandscape) {
    }
    const h = window.innerHeight;
    const w = window.innerWidth;
    setWidth(w);
    setHeight(h);
  };

  useEffect(() => {
    handleOrientation(); // Call on mount to check initial orientation
    window.addEventListener('resize', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleOrientation);
    };
  }, []);


  return (
    <div className="App" style={{ backgroundColor: '#000', height, width }}>
      {gameState === 'start' && <StartMenu />}
      {gameState === 'game' && <Game />}
      {gameState === 'end' && <GameOverScreen />}
    </div>
  );
}


export default App;
