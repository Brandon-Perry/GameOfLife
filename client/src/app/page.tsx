"use client";
import Board, { BoardRef } from "@/components/board/Board";
import Controls from "@/components/controls/Controls";
import { useRef } from "react";

export default function Home() {
  const boardRef = useRef<BoardRef | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-200">
      <Board ref={boardRef} />
      <Controls boardRef={boardRef} />
    </main>
  );
}
