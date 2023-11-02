import React, { useState, useEffect, useRef, CanvasHTMLAttributes } from 'react';
import useGameStore from '../stores/useGameStore';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 20;
const GRAVITY = 1.5;
const JUMP_FORCE = -15;
const GROUND_Y = SCREEN_HEIGHT * 0.8;
const OBSTACLE_SPEED = 10;
const SCORE_INTERVAL = 100;

type ObstacleType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PlayerType = {
  x: number;
  y: number;
  vy: number;
};

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const obstaclesRef = useRef<ObstacleType[]>([]);
  const speed_multiplier = useRef(1);
  const nextObstacleTimeRef = useRef<number>(Date.now() + randomInterval());
  const setGameState = useGameStore(state => state.setGameState);
  const farBgRef = useRef(new Image());
  farBgRef.current.src = '/sprites/ooze-bg-far.png';
  const playerRef = useRef<PlayerType>({
    x: SCREEN_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GROUND_Y,
    vy: 0
  });
  const scoreRef = useRef(0);
  const isJumpingRef = useRef(false);
  const jumpCount = useRef(0);
  const maxJumps = useRef(2);

  function randomInterval() {
    // Define base min and max intervals
    const minBaseInterval = 500; // in milliseconds
    const maxBaseInterval = 2000; // in milliseconds

    // Adjust interval based on speed multiplier (assuming the multiplier increases over time)
    const minInterval = minBaseInterval / speed_multiplier.current;
    const maxInterval = maxBaseInterval / speed_multiplier.current;

    // Generate random interval within the adjusted range
    return Math.random() * (maxInterval - minInterval) + minInterval;
  }

  const spawnObstacle = () => {
    if (!canvasRef.current) return;
    const newObstacle: ObstacleType = {
      x: canvasRef.current?.width,
      y: GROUND_Y - OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
    };
    obstaclesRef.current.push(newObstacle);
  };

  const jump = () => {
    if (jumpCount.current < maxJumps.current) {
      playerRef.current.vy = JUMP_FORCE;
      isJumpingRef.current = true;
      jumpCount.current++;
    }
  };

  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    //draw background
    // ctx.drawImage(
    //   farBgRef.current,  // The image element
    //   0,         // The x-coordinate on the canvas
    //   0,         // The y-coordinate on the canvas
    //   SCREEN_WIDTH,     // The width of the image to draw
    //   SCREEN_HEIGHT     // The height of the image to draw
    // );

    //draw ground
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, GROUND_Y - 5, SCREEN_WIDTH, SCREEN_HEIGHT - GROUND_Y + 5);


    // Apply gravity only if the player is airborne
    if (playerRef.current.y < GROUND_Y) {
      playerRef.current.vy += GRAVITY;
    }

    // Update player's Y position
    playerRef.current.y += playerRef.current.vy;

    // Collision with the ground
    if (playerRef.current.y > GROUND_Y) {
      playerRef.current.y = GROUND_Y;
      playerRef.current.vy = 0; // Stop the falling movement by resetting velocity
      isJumpingRef.current = false;
      jumpCount.current = 0;
    }

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      playerRef.current.x,
      playerRef.current.y - PLAYER_HEIGHT,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );

    // Update and draw obstacles
    for (const obstacle of obstaclesRef.current) {
      obstacle.x -= OBSTACLE_SPEED * speed_multiplier.current;

      ctx.fillStyle = 'red';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      if (checkCollision(playerRef.current, obstacle)) {
        setGameState('end');
        window.cancelAnimationFrame(animationFrameRef.current);
        return;
      }
    }

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter(
      (obstacle) => obstacle.x + obstacle.width > 0
    );

    //INCREMENT SCORE
    scoreRef.current++;

    //OLD SPAWN CODE
    // if (scoreRef.current % SCORE_INTERVAL === 0) {
    //   spawnObstacle();
    // }

    //SPAWN OBSTACLES 
    const now = Date.now();
    if (now >= nextObstacleTimeRef.current) {
      spawnObstacle();
      // Calculate the next spawn time, adjusting for the speed multiplier
      nextObstacleTimeRef.current = now + randomInterval();
    }

    if (scoreRef.current % 300 === 0) {
      speed_multiplier.current += 0.1;
    }

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${scoreRef.current}`, 15, 30);

    // Continue the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const checkCollision = (player: PlayerType, obs: ObstacleType) => {
    return (
      (player.x + PLAYER_WIDTH) - obs.x >= 0 &&
      (player.x + PLAYER_WIDTH) - (obs.x + OBSTACLE_WIDTH) < PLAYER_WIDTH &&
      (player.y + PLAYER_HEIGHT) - (obs.y + OBSTACLE_HEIGHT) >= 0
    );
  };


  useEffect(() => {
    if (!canvasRef.current || !isReady) return;
    const canvas = canvasRef.current;
    canvas.style.background = '#000000';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '20px Arial';

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    window.addEventListener('touchstart', jump);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.addEventListener('touchstart', jump);
    };
  }, [isReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);



  return isReady ? <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} /> : null;
};
export default Game;