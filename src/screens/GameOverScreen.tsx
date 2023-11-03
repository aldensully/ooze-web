import useGameStore from '../stores/useGameStore';

const width = window.innerWidth;
const height = window.innerHeight;

const GameOverScreen = () => {
  const setGameState = useGameStore(state => state.setGameState);

  return (
    <div style={{ width, height, backgroundColor: '#EBFF00' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: 32 }}>GAME OVER</p>
        <button
          onClick={() => setGameState('game')}
          style={{ fontSize: 20, color: 'white', height: 50, width: 150, backgroundColor: 'gray', borderWidth: 0, fontWeight: 'bolder' }}
        >
          TRY AGAIN
        </button>
        <button
          onClick={() => setGameState('start')}
          style={{ fontSize: 20, color: 'white', height: 50, marginTop: 16, width: 100, backgroundColor: 'gray', borderWidth: 0, fontWeight: 'bolder' }}
        >
          MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;