'use client';
import { useState, useMemo } from 'react';
import { JsonEditor } from "./components/TextEditor";
import { JsonGraph } from "./components/JsonGraph";
import { jsonToGraph, validateJson } from './utils/jsonToGraph';
import { Braces } from 'lucide-react';

export default function Page() {
  const defaultJson = `{
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
}`;

  const [jsonValue, setJsonValue] = useState(defaultJson);

  const { graphData, error } = useMemo(() => {
    const validation = validateJson(jsonValue);
    if (validation.valid && validation.data !== undefined) {
      return {
        graphData: jsonToGraph(validation.data),
        error: undefined,
      };
    }
    return {
      graphData: { nodes: [], edges: [] },
      error: validation.error,
    };
  }, [jsonValue]);

  return (<div className="h-screen flex flex-col bg-background">

    {/* Top Bar */}
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/30">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 animate-pulse-glow">
          <Braces className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            JSON Peeker
          </h1>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - Editor */}
      <div className="w-1/4 border-r border-border flex flex-col">
        <JsonEditor value={jsonValue} onChange={setJsonValue} error={error} />
      </div>

      {/* Right Panel - Graph */}
      <div className="w-3/4 flex flex-col">
        <JsonGraph nodes={graphData.nodes} edges={graphData.edges} />
      </div>
    </div>
  </div>);
}