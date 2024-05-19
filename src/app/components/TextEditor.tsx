'use client'

import Editor, { OnChange } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import JSONparser from '../utils/JsonParser';
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary


export default function TextEditor() {
    const { addNode, nodes, resetNodes, resetEdges, addEdge } = useNodesAndEdges()
    const [first, setfirst] = useState("second")
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const handleEditorChange: OnChange = (value: string | undefined) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (typeof value === 'string') {
                try {
                    const result = JSONparser(value);
                    resetNodes();
                    resetEdges();
                    result?.nodes.map(node => addNode(node));
                    result?.edges.map(edge => addEdge(edge));
                    console.log(result, 'final result');
                } catch (error) {
                    console.error('Invalid JSON:', error);
                }
            }
        }, 1000)

    };
    return (
        <Editor height="100vh" width='30%'
            language='json'
            onChange={handleEditorChange}
        />

    )
}