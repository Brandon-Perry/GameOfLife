"use client";
import Board, { BoardRef } from "@/components/board/Board";
import Controls from "@/components/controls/Controls";
import { useRef } from "react";

export default function Home() {
  const boardRef = useRef<BoardRef | null>(null);
  return (
    <main className="flex min-h-screen flex-rows bg-slate-200">
      <Controls boardRef={boardRef} />
      <Board ref={boardRef} />
    </main>
  );
}
