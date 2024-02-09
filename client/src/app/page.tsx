"use client";
import Board, { BoardRef } from "@/components/board/Board";
import { useRef, useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const boardRef = useRef<BoardRef | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-200">
      <Board ref={boardRef} />
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
    </main>
  );
}
