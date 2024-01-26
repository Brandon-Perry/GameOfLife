"use client";
import React, { useRef, useState } from "react";
import { useBoardState } from "./hooks/useBoardState";
import { Coord } from "@/types";
import { usePaint } from "./hooks/usePaint";
import { Group, Layer, Rect, Stage } from "react-konva";

export default function Board() {
  const { boardState, boardDispatch, cacheBoard, loadCachedBoard } =
    useBoardState(35);

  const { startPaint, onPaint, stopPaint } = usePaint((coord: Coord) =>
    boardDispatch({ action: "toggle", payload: { coord } }),
  );

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

  // resets game state
  const clearGame = () => {
    boardDispatch({ action: "clear" });
  };

  return (
    <div onMouseLeave={stopPaint}>
      <Stage height={600} width={600}>
        <Layer height={400} width={400}>
          {boardState.map((row, y) => (
            <Group>
              {row.map((state, x) => (
                <Rect
                  height={20}
                  width={20}
                  fill={state ? "black" : "white"}
                  x={20 * x}
                  y={20 * y}
                  stroke={"gray"}
                  strokeWidth={1}
                  onClick={() =>
                    boardDispatch({
                      action: "toggle",
                      payload: { coord: { x, y } },
                    })
                  }
                  key={x}
                  onMouseDown={startPaint}
                  onMouseUp={stopPaint}
                  onMouseOver={(e) => {
                    e.currentTarget.setAttr(
                      "fill",
                      state ? "#525454" : "#ebeded",
                    );
                    onPaint({ x, y });
                  }}
                  onMouseOut={(e) =>
                    e.currentTarget.setAttr("fill", state ? "black" : "white")
                  }
                />
              ))}
            </Group>
          ))}
        </Layer>
      </Stage>

      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => (isPlaying ? stopPlaying() : startPlaying())}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>
      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => loadCachedBoard()}
      >
        Reset
      </button>
      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => clearGame()}
      >
        Clear
      </button>
    </div>
  );
}
