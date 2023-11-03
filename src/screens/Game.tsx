import React, { useState, useEffect, useRef, CanvasHTMLAttributes } from 'react';
import useGameStore from '../stores/useGameStore';

const PLAYER_WIDTH = 25;
const PLAYER_HEIGHT = 65;
const OBSTACLE_WIDTH = 25;
const OBSTACLE_HEIGHT = 30;
const OBSTACLE_SPEED = 7;

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

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const obstaclesRef = useRef<ObstacleType[]>([]);
  const speed_multiplier = useRef(1);
  const nextObstacleTimeRef = useRef<number>(Date.now() + randomInterval());
  const setGameState = useGameStore(state => state.setGameState);
  const setScore = useGameStore(state => state.setScore);
  const playerImage = useRef(new Image());
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
  const gravity = useRef(1.2);
  const jumpForce = useRef(-17);

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

  const gameLoop = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    //draw floor
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, GROUND_Y, window.innerWidth, (window.innerHeight - GROUND_Y));



    // Apply gravity only if the player is airborne
    if (playerRef.current.y < GROUND_Y) {
      playerRef.current.vy += gravity.current;
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
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(
    //   playerRef.current.x,
    //   playerRef.current.y - PLAYER_HEIGHT,
    //   PLAYER_WIDTH,
    //   PLAYER_HEIGHT
    // );
    ctx.drawImage(
      playerImage.current,  // The image element
      playerRef.current.x,
      playerRef.current.y - PLAYER_HEIGHT,
      PLAYER_WIDTH,     // The width of the image to draw
      PLAYER_HEIGHT     // The height of the image to draw
    );

    // Update and draw obstacles
    for (const obstacle of obstaclesRef.current) {
      obstacle.x -= OBSTACLE_SPEED * speed_multiplier.current;

      ctx.drawImage(
        obstacle.sprite,  // The image element
        obstacle.x - 20, obstacle.y - 20, obstacle.width + 20, obstacle.height + 20
      );
      if (checkCollision(playerRef.current, obstacle)) {
        setGameState('end');
        setScore(Math.floor(scoreRef.current / 100));
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



    // Update image positions
    x1 -= OBSTACLE_SPEED * 0.5;
    x2 -= OBSTACLE_SPEED * 0.5;

    // If the first image is completely off screen
    if (x1 < -window.innerWidth) {
      x1 = window.innerWidth;
    }
    // If the second image is completely off screen
    if (x2 < -window.innerWidth) {
      x2 = window.innerWidth;
    }



    //SPAWN OBSTACLES 
    const now = Date.now();
    if (now >= nextObstacleTimeRef.current) {
      spawnObstacle();
      // Calculate the next spawn time, adjusting for the speed multiplier
      nextObstacleTimeRef.current = now + randomInterval();
    }

    if (scoreRef.current % 300 === 0) {
      speed_multiplier.current += 0.05;
      gravity.current += 0.15;
      jumpForce.current -= 1;
    }

    // Draw the score
    ctx.fillStyle = 'white';
    const score = Math.floor(scoreRef.current / 100);
    ctx.fillText(`Score: ${score}`, 120, 30);

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

  function resetGame() {
    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Arial';
  }

  function initializeScene() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.style.background = '#000000';
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Arial';
    playerImage.current.src = '/sprites/dude.png';
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
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    window.addEventListener('touchstart', jump);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.addEventListener('touchstart', jump);
    };
  }, []);

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
};
export default Game;