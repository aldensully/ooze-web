import { create } from 'zustand';

type GameStateType = 'loading' | 'start' | 'game' | 'end';
type GameStoreType = {
  gameState: GameStateType;
  setGameState: (gameState: GameStateType) => void;
  score: number;
  setScore: (score: number) => void;
};

const useGameStore = create<GameStoreType>((set) => ({
  gameState: 'end',
  setGameState: (gameState) => set({ gameState }),
  score: 0,
  setScore: (score) => set({ score })
}));

export default useGameStore;