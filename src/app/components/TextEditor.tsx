'use client'

import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import JSONparser from '../utils/JsonParser';
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary

/**
 * task: add to the store make it async wait for it to upload all of the nodes and edgees before going to next step of the code
 */
export default function TextEditor() {
    const { addNode, nodes, resetNodes, resetEdges, addEdge } = useNodesAndEdges()
    const [first, setfirst] = useState("second")
    const editorRef = useRef(null);
    function handleEditorChange(value) {
        const result = JSONparser(value)
        resetNodes()
        resetEdges()
        result?.nodes.map(node => { addNode(node) })
        result?.edges.map(edge => { addEdge(edge) })
        console.log(result, 'final result')

    }
    return (
        <Editor height="100vh" width='30%'
            language='json'
            onChange={handleEditorChange}
        />

    )
}