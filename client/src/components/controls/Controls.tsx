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
    <div className="p-5 bg-slate-500">
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
    </div>
  );
}
