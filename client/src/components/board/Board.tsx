"use client";
import React, { useRef, useState } from "react";
import { useBoardState } from "./hooks/useBoardState";

export default function Board() {
  const { boardState, boardDispatch, cacheBoard, loadCachedBoard } =
    useBoardState(20);

  // tells UI elements if game is playing
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // stores id for shutting down setInterval for game loop
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // runs on each game tick
  const onTick = () => {
    boardDispatch({
      action: "game-tick",
      payload: {
        gameFunction(params) {
          const { numAlive, state } = params;
          switch (numAlive) {
            case 2: {
              if (state) return true;
              return false;
            }
            case 3: {
              return true;
            }
            default:
              return false;
          }
        },
      },
    });
  };

  // stops game
  const stopPlaying = () => {
    setIsPlaying(false);
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // starts game
  const startPlaying = () => {
    setIsPlaying(true);
    cacheBoard();
    const playInterval = setInterval(() => {
      onTick();
    }, 200);
    intervalRef.current = playInterval;
  };

  const clearGame = () => {
    boardDispatch({ action: "clear" });
  };

  return (
    <div>
      {boardState.map((row, y) => (
        <div className="flex flex-row" key={y}>
          {row.map((state, x) => (
            <div
              style={{ height: 20, width: 20 }}
              className={`${state ? "bg-black" : "bg-white"} hover:bg-slate-400 border border-black`}
              onClick={() =>
                boardDispatch({
                  action: "toggle",
                  payload: { coord: { x, y } },
                })
              }
              key={x}
            />
          ))}
        </div>
      ))}
      <button onClick={() => (isPlaying ? stopPlaying() : startPlaying())}>
        {isPlaying ? "Stop" : "Start"}
      </button>
      <button onClick={() => loadCachedBoard()}>Reset</button>
      <button onClick={() => clearGame()}>Clear</button>
    </div>
  );
}
