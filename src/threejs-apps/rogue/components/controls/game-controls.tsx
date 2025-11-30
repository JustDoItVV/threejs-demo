'use client';

import { useEffect, useRef } from 'react';

import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { useStore } from '../../store';
import { EControls, EGameState } from '../../types';

const INITIAL_DELAY = 300;
const REPEAT_DELAY = 150;

export function GameControls() {
  const [sub, get] = useKeyboardControls<EControls>();

  const lastMoveTimeRef = useRef<number>(0);
  const initialDelayPassedRef = useRef<boolean>(false);

  useFrame(() => {
    const controls = get();
    const { makeTurn, controller, restart } = useStore.getState();
    const gameState = controller?.getStatuses().gameState;

    if (gameState !== EGameState.Game) {
      return;
    }

    const now = Date.now();
    const timeSinceLastMove = now - lastMoveTimeRef.current;

    const requiredDelay = initialDelayPassedRef.current ? REPEAT_DELAY : INITIAL_DELAY;

    if (timeSinceLastMove < requiredDelay) {
      return;
    }

    let moved = false;

    if (controls.up) {
      makeTurn('up');
      moved = true;
    }
    if (controls.down) {
      makeTurn('down');
      moved = true;
    }
    if (controls.left) {
      makeTurn('left');
      moved = true;
    }
    if (controls.right) {
      makeTurn('right');
      moved = true;
    }
    if (controls.backpack) {
    }
    if (controls.restart) {
      restart();
    }

    if (moved) {
      lastMoveTimeRef.current = now;
      initialDelayPassedRef.current = true;
    } else {
      initialDelayPassedRef.current = false;
    }
  });

  useEffect(() => {
    const unsubRestart = sub(
      (state) => state.restart,
      (pressed) => {
        if (!pressed) return;
        const { controller, restart } = useStore.getState();
        const gameState = controller?.getStatuses().gameState;
        if (gameState === EGameState.Game) {
          restart();
        }
      }
    );

    return () => {
      unsubRestart();
    };
  }, [sub]);

  return null;
}
