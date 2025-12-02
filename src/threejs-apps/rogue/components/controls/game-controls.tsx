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

  // Prevent page scroll on arrow keys and WASD
  useEffect(() => {
    const preventScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventScroll);
    return () => window.removeEventListener('keydown', preventScroll);
  }, []);

  useFrame(() => {
    const controls = get();
    const { makeTurn, controller } = useStore.getState();
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

    if (moved) {
      lastMoveTimeRef.current = now;
      initialDelayPassedRef.current = true;
    } else {
      initialDelayPassedRef.current = false;
    }
  });

  useEffect(() => {
    const unsubEnter = sub(
      (state) => state.enter,
      (pressed) => {
        if (!pressed) return;
        const { controller, startGame, restart } = useStore.getState();
        const gameState = controller?.getStatuses().gameState;

        if (gameState === EGameState.Start) {
          startGame();
        } else if (gameState === EGameState.End) {
          restart();
        }
      }
    );

    const unsubBackpack = sub(
      (state) => state.backpack,
      (pressed) => {
        if (!pressed) return;
        const { controller, makeTurn, closeBackpack } = useStore.getState();
        const gameState = controller?.getStatuses().gameState;

        if (gameState === EGameState.Game) {
          makeTurn('b');
        } else if (gameState === EGameState.Backpack) {
          closeBackpack();
        }
      }
    );

    const unsubEscape = sub(
      (state) => state.escape,
      async (pressed) => {
        if (!pressed) return;
        const { controller, exitToMenu, closeBackpack } = useStore.getState();
        const gameState = controller?.getStatuses().gameState;

        if (gameState === EGameState.Game) {
          await exitToMenu();
        } else if (gameState === EGameState.Backpack) {
          closeBackpack();
        }
      }
    );

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

    const digitHandlers = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
      const controlKey = `digit${digit}` as EControls;
      return sub(
        (state) => state[controlKey],
        (pressed) => {
          if (!pressed) return;
          const { controller, makeTurn } = useStore.getState();
          const gameState = controller?.getStatuses().gameState;

          if (gameState === EGameState.Backpack) {
            makeTurn(String(digit));
          }
        }
      );
    });

    return () => {
      unsubEnter();
      unsubBackpack();
      unsubEscape();
      unsubRestart();
      digitHandlers.forEach((unsub) => unsub());
    };
  }, [sub]);

  return null;
}
