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
    const defaultValue = {
        "title": "Mystery Adventures",
        "genre": "Mystery",
        "seasons": 5,
        "episodes": [
            {
                "season": 1,
                "episode": 1,
                "title": "The Beginning",
                "air_date": "2020-01-15"
            },
            {
                "season": 1,
                "episode": 2,
                "title": "The Mystery Deepens",
                "air_date": "2020-01-22"
            },
            {
                "season": 1,
                "episode": 3,
                "title": "Unveiling Secrets",
                "air_date": "2020-01-29"
            }
        ],
        "cast": [
            {
                "name": "Jane Smith",
                "role": "Detective Jane"
            },
            {
                "name": "John Doe",
                "role": "Assistant John"
            }
        ]
    }
    function formatJSON(val: string = "{}"): string {
        try {
            const res = JSON.parse(val);
            return JSON.stringify(res, null, 2);
        } catch {
            const errorJson = {
                "error": `${val}`
            }
            return JSON.stringify(errorJson, null, 2);
        }
    }
    function onMount() {
        try {
            const result = JSONparser(JSON.stringify(defaultValue));
            resetNodes();
            resetEdges();
            result?.nodes.map(node => addNode(node));
            result?.edges.map(edge => addEdge(edge));
            console.log(result, 'final result');
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    }
    return (
        <Editor height="100vh" width='30%'
            language='json'
            theme="vs-dark"
            onChange={handleEditorChange}
            value={formatJSON(JSON.stringify(defaultValue))}
            onMount={onMount}
        />

    )
}