import useGameStore from '../stores/useGameStore';

const width = window.innerWidth;
const height = window.innerHeight;

function StartMenu() {
  const setGameState = useGameStore(state => state.setGameState);

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

  return (
    <div style={{ width, height, backgroundColor: '#000' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: 32 }}>Ooze</p>
        {/* <p style={{ color: '#fff' }}>Voyage into the void</p> */}
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