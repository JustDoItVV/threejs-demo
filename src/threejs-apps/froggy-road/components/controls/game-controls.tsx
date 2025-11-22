'use client';

import { useEffect, useRef } from 'react';

import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { useStore } from '../../store';
import { Controls, EGameState } from '../../types';

const INITIAL_DELAY = 300;
const REPEAT_DELAY = 150;

export function GameControls() {
  const [sub, get] = useKeyboardControls<Controls>();

  const lastMoveTimeRef = useRef<number>(0);
  const initialDelayPassedRef = useRef<boolean>(false);

  useFrame(() => {
    const controls = get();
    const { state: gameState, isMoving, moveForward, moveLeft, moveRight } = useStore.getState();

    if (gameState !== EGameState.Game || isMoving) {
      return;
    }

    const now = Date.now();
    const timeSinceLastMove = now - lastMoveTimeRef.current;

    const requiredDelay = initialDelayPassedRef.current ? REPEAT_DELAY : INITIAL_DELAY;

    if (timeSinceLastMove < requiredDelay) {
      return;
    }

    let moved = false;

    if (controls.forward) {
      moveForward();
      moved = true;
    } else if (controls.left) {
      moveLeft();
      moved = true;
    } else if (controls.right) {
      moveRight();
      moved = true;
    }

    if (moved) {
      lastMoveTimeRef.current = now;
      initialDelayPassedRef.current = true;
    } else {
      initialDelayPassedRef.current = false;
    }
  });

  useEffect(() => {
    const unsubPause = sub(
      (state) => state.pause,
      (pressed) => {
        if (!pressed) return;
        const { state: gameState, pauseGame, resumeGame } = useStore.getState();
        if (gameState === EGameState.Game) pauseGame();
        if (gameState === EGameState.Pause) resumeGame();
      }
    );

    const unsubConfirm = sub(
      (state) => state.confirm,
      (pressed) => {
        if (!pressed) return;
        const { state: gameState, startGame, restart } = useStore.getState();
        if (gameState === EGameState.Menu) startGame();
        if (gameState === EGameState.Gameover) restart();
      }
    );

    const unsubEscape = sub(
      (state) => state.escape,
      (pressed) => {
        if (!pressed) return;
        const { state: gameState, gameOver, resumeGame } = useStore.getState();
        if (gameState === EGameState.Game) gameOver();
        if (gameState === EGameState.Pause) resumeGame();
      }
    );

    const unsubRestart = sub(
      (state) => state.restart,
      (pressed) => {
        if (!pressed) return;
        const { state: gameState, restart } = useStore.getState();
        if (gameState === EGameState.Game || gameState === EGameState.Pause || gameState === EGameState.Gameover) {
          restart();
        }
      }
    );

    return () => {
      unsubPause();
      unsubConfirm();
      unsubEscape();
      unsubRestart();
    };
  }, [sub]);

  return null;
}
