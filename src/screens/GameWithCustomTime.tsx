import React, { useState, useEffect, useRef, CanvasHTMLAttributes } from 'react';
import useGameStore from '../stores/useGameStore';

const PLAYER_WIDTH = 25;
const PLAYER_HEIGHT = 65;
const OBSTACLE_WIDTH = 25;
const OBSTACLE_HEIGHT = 30;
const OBSTACLE_SPEED = 50;

type ObstacleType = {
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: HTMLImageElement;
};

type PlayerType = {
  x: number;
  y: number;
  vy: number;
};

let x1 = 0; // initial position of first image
let x2 = window.innerWidth;

const GameWithCustomTime = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(new Date().getTime());
  const obstaclesRef = useRef<ObstacleType[]>([]);
  const speed_multiplier = useRef(1);
  const nextObstacleTimeRef = useRef<number>(Date.now() + randomInterval());
  const setGameState = useGameStore(state => state.setGameState);
  const setScore = useGameStore(state => state.setScore);
  const playerImage = useRef(new Image());
  const oozeMeter = useRef(new Image());
  const oozeSprites = useRef([]);
  oozeSprites.current = [
    '/sprites/double-ooze.png',
    '/sprites/face-ooze.png',
    '/sprites/poop-ooze.png',
  ].map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;
  const GROUND_Y = SCREEN_HEIGHT * 0.9;
  const gravity = useRef(35);
  const jumpForce = useRef(-85);

  const playerRef = useRef<PlayerType>({
    x: SCREEN_WIDTH / 3 - PLAYER_WIDTH / 2,
    y: GROUND_Y,
    vy: 0
  });
  const scoreRef = useRef(0);
  const isJumpingRef = useRef(false);
  const jumpCount = useRef(0);
  const maxJumps = useRef(1);

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
    const spriteIndex = Math.floor(Math.random() * oozeSprites.current.length);
    const newObstacle: ObstacleType = {
      x: canvasRef.current?.width,
      y: GROUND_Y - OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      sprite: oozeSprites.current[spriteIndex],
    };
    obstaclesRef.current.push(newObstacle);
  };

  const jump = () => {
    if (jumpCount.current < maxJumps.current) {
      playerRef.current.vy = jumpForce.current;
      isJumpingRef.current = true;
      jumpCount.current++;
    }
  };

  function updateGame(deltaTime: number) {
    // Apply gravity and jump physics
    if (playerRef.current.y < GROUND_Y) {
      playerRef.current.vy += gravity.current * deltaTime;
    }
    playerRef.current.y += playerRef.current.vy * deltaTime;
    if (playerRef.current.y > GROUND_Y) {
      playerRef.current.y = GROUND_Y;
      playerRef.current.vy = 0;
      isJumpingRef.current = false;
      jumpCount.current = 0;
    }

    // Update obstacles
    obstaclesRef.current.forEach(obstacle => {
      obstacle.x -= OBSTACLE_SPEED * speed_multiplier.current * deltaTime;
    });

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Check for collisions
    for (const obstacle of obstaclesRef.current) {
      if (checkCollision(playerRef.current, obstacle)) {
        setGameState('end');
        setScore(Math.floor(scoreRef.current / 100));
        return false; // Collision detected, stop updating
      }
    }

    // Handle obstacle spawning
    const now = Date.now();
    if (now >= nextObstacleTimeRef.current) {
      spawnObstacle();
      nextObstacleTimeRef.current = now + randomInterval();
    }

    // Increment score
    scoreRef.current += 1;

    // Speed and gravity scaling
    if (scoreRef.current % 300 === 0) {
      speed_multiplier.current += 0.05;
      gravity.current += 0.15;
      jumpForce.current -= 1;
    }

    return true;
  }

  function drawGame() {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, GROUND_Y, SCREEN_WIDTH, SCREEN_HEIGHT - GROUND_Y);

    // Draw player
    ctx.drawImage(
      playerImage.current,
      playerRef.current.x,
      playerRef.current.y - PLAYER_HEIGHT,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );

    // Draw obstacles
    obstaclesRef.current.forEach(obstacle => {
      ctx.drawImage(
        obstacle.sprite,
        obstacle.x - 20, obstacle.y - 20,
        obstacle.width + 20, obstacle.height + 20
      );
    });

    // Draw score
    ctx.fillStyle = '#FFEB2C';
    ctx.fillText(`${Math.floor(scoreRef.current / 100)}`, 320, 54);
    ctx.drawImage(
      oozeMeter.current,
      160,
      25,
      155,
      30
    );
  }

  function gameLoop(timestamp: number) {
    const deltaTime = timestamp - (animationFrameRef.current || timestamp);
    animationFrameRef.current = timestamp;

    if (updateGame(deltaTime / 100)) {
      drawGame();
      requestAnimationFrame(gameLoop);
    } else {
      // Handle end game logic here, e.g., cancel the animation frame if needed
      window.cancelAnimationFrame(animationFrameRef.current);
    }
  }


  const checkCollision = (player: PlayerType, obs: ObstacleType) => {
    return (
      (player.x + PLAYER_WIDTH) - obs.x >= 0 &&
      (player.x + PLAYER_WIDTH) - (obs.x + OBSTACLE_WIDTH) < PLAYER_WIDTH &&
      (player.y + PLAYER_HEIGHT) - (obs.y + OBSTACLE_HEIGHT) >= 0
    );
  };

  function resetGame() {
    window.cancelAnimationFrame(animationFrameRef.current);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '40px Arial';
  }

  function initializeScene() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.style.background = '#000000';
    const ctx = canvas.getContext('2d');
    playerImage.current.src = '/sprites/dude.png';
    oozeMeter.current.src = '/sprites/ooze-meter.png';
  }

  function resizeCanvas() {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    resetGame();
  }

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('fullscreenchange', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('fullscreenchange', resizeCanvas);
    };
  }, []);


  useEffect(() => {
    initializeScene();
    resetGame(); // Setup game state
    animationFrameRef.current = requestAnimationFrame(gameLoop); // Start the loop
    window.addEventListener('touchstart', jump);
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') { // 'Space' is the code for the spacebar
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('touchstart', jump);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return <canvas ref={canvasRef} id='canvas' width={window.innerWidth} height={window.innerHeight} />;
};
export default GameWithCustomTime;