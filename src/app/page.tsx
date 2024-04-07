import Image from "next/image";
import TextEditor from "./components/TextEditor";
import Canvas from "./components/Canvas";
//flex min-h-screen flex-row items-center justify-between
export default function Home() {
  return (
    <main className="flex">
      <TextEditor />
      <Canvas />
    </main>

  );
}
