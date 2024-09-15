import Canvas from "../components/Canvas";
import TextEditor from "../components/TextEditor";

export default function Page() {
    return <div className="flex">
        <TextEditor />
        <Canvas />
    </div>
}