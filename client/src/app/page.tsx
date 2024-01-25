import Board from "@/components/board/Board";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-200">
      <Board />
    </main>
  );
}
