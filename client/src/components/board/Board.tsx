"use client";
import React, { Ref, forwardRef, useImperativeHandle, useRef } from "react";
import { useBoardState } from "./hooks/useBoardState";
import { Coord } from "@/types";
import { usePaint } from "./hooks/usePaint";
import { Group, Layer, Rect, Stage } from "react-konva";
import useBoardSize from "./hooks/useBoardSize";

export type BoardRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
  clear: () => void;
};

type BoardProps = {};

export default forwardRef(function Board(
  props: BoardProps,
  ref: Ref<BoardRef>,
) {
  const { boardState, boardDispatch, cacheBoard, loadCachedBoard } =
    useBoardState(65);

  const { startPaint, onPaint, stopPaint } = usePaint((coord: Coord) =>
    boardDispatch({ action: "turnOn", payload: { coord } }),
  );

  // stores id for shutting down setInterval for game loop
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const viewRef = useRef<HTMLDivElement | null>(null);

  const { height, width } = useBoardSize(viewRef);

  useImperativeHandle<BoardProps, BoardRef>(ref, () => {
    return {
      start: () => startPlaying(),
      stop: () => stopPlaying(),
      clear: () => clearGame(),
      reset: () => loadCachedBoard(),
    };
  });

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
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // starts game
  const startPlaying = () => {
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
    <div onMouseLeave={stopPaint} className="w-full" ref={viewRef}>
      <Stage height={height} width={width}>
        <Layer height={height} width={width}>
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
    </div>
  );
});
