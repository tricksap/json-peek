'use client'

import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import NodeGenerator from '../utils/nodeGenerator';
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary

/**
 * task: add to the store make it async wait for it to upload all of the nodes and edgees before going to next step of the code
 */
export default function TextEditor() {
    const { addNode, nodes } = useNodesAndEdges()
    const [first, setfirst] = useState("second")
    const editorRef = useRef(null);
    function handleEditorChange(value) {
        const result = NodeGenerator(value)
        result?.nodes.map(it => { addNode(it) })
        console.log(nodes, 'sssndie')

    }
    return (
        <Editor height="100vh" width='30%'
            language='json'
            onChange={handleEditorChange}
        />

    )
}