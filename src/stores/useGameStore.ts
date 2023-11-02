import { create } from 'zustand';

type GameStateType = 'loading' | 'start' | 'game' | 'end';
type GameStoreType = {
  gameState: GameStateType;
  setGameState: (gameState: GameStateType) => void;
};

const useGameStore = create<GameStoreType>((set) => ({
  gameState: 'start',
  setGameState: (gameState) => set({ gameState })
}));

export default useGameStore;