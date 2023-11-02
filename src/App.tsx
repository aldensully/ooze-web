import './styles/App.css';
import Game from './screens/Game';
import { useEffect } from 'react';
import StartMenu from './screens/StartMenu';
import GameOverScreen from './screens/GameOverScreen';
import useGameStore from './stores/useGameStore';

function App() {
  const gameState = useGameStore(state => state.gameState);

  const handleOrientation = () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    if (!isLandscape) {
      alert('Please rotate your device to landscape mode to play the game.');
    }
  };

  useEffect(() => {
    handleOrientation(); // Call on mount to check initial orientation
    window.addEventListener('resize', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleOrientation);
    };
  }, []);

  const height = window.innerHeight;
  const width = window.innerWidth;

  return (
    <div className="App" style={{ backgroundColor: '#000', height, width }}>
      {gameState === 'start' && <StartMenu />}
      {gameState === 'game' && <Game />}
      {gameState === 'end' && <GameOverScreen />}
    </div>
  );
}


export default App;
