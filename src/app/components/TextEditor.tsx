import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Upload, Sparkles, FileJson } from 'lucide-react';
import { formatJson } from '../utils/jsonToGraph';

interface JsonEditorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditorMount: OnMount = (editor) => {
        editor.updateOptions({
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineHeight: 20,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
        });
    };

    const handleFormat = () => {
        onChange(formatJson(value));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                onChange(content);
            };
            reader.readAsText(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-editor-bg">
            {/* Header */}
            <div className="panel-header ">
                <div className="flex items-center gap-2">
                    <button onClick={handleFormat} className="toolbar-btn-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Format
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="toolbar-btn flex items-center gap-1.5"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        Load File
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={value}
                    onChange={(v) => onChange(v || '')}
                    onMount={handleEditorMount}
                    theme="vs-dark"
                    options={{
                        automaticLayout: true,
                        formatOnPaste: true,
                        tabSize: 2,
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="json-error animate-fade-in">
                    <span className="font-semibold">Parse Error:</span> {error}
                </div>
            )}
        </div>
    );
}
