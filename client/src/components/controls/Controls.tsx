"use client";

import { MutableRefObject, useState } from "react";
import { BoardRef } from "../board/Board";

export default function Controls({
  boardRef,
}: {
  boardRef: MutableRefObject<BoardRef | null>;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <div>
      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => {
          isPlaying ? boardRef.current?.stop() : boardRef.current?.start();
          setIsPlaying((curr) => !curr);
        }}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>
      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => boardRef.current?.reset()}
      >
        Reset
      </button>
      <button
        className="p-2 bg-slate-400 rounded-md m-2"
        onClick={() => boardRef.current?.clear()}
      >
        Clear
      </button>

      {/* <button onClick={() => setZoomFactor((curr) => curr + 0.2)}>
        Zoom In
      </button>
      <button onClick={() => setZoomFactor((curr) => curr - 0.2)}>
        Zoom Out
      </button> */}
    </div>
  );
}
