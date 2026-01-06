import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
    label: string;
    value?: string;
    type: 'object' | 'array' | 'primitive' | 'root';
    fullPath: string;
}

export function CustomNode({ data }: NodeProps<CustomNodeData>) {
    const getNodeStyle = (type: string) => {
        switch (type) {
            case 'root':
                return {
                    background: '#2A2A2A',
                    border: '2px solid #4A9EFF',
                    color: '#FFFFFF',
                };
            case 'object':
                return {
                    background: '#2D2A3E',
                    border: '2px solid #9D7CD8',
                    color: '#E0E0E0',
                };
            case 'array':
                return {
                    background: '#2A3A2E',
                    border: '2px solid #7FB069',
                    color: '#E0E0E0',
                };
            case 'primitive':
                return {
                    background: '#3A2E2A',
                    border: '2px solid #FF8B4D',
                    color: '#E0E0E0',
                };
            default:
                return {
                    background: '#2A2A2A',
                    border: '2px solid #666',
                    color: '#E0E0E0',
                };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'root':
                return '◆';
            case 'object':
                return '{}';
            case 'array':
                return '[]';
            case 'primitive':
                return '';
            default:
                return '';
        }
    };

    const style = getNodeStyle(data.type);
    const icon = getTypeIcon(data.type);

    return (
        <div
            className="px-4 py-2 rounded-md shadow-lg min-w-[120px] max-w-[300px]"
            style={{
                ...style,
                fontSize: '13px',
                fontFamily: 'ui-monospace, monospace',
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: style.border.split(' ')[2],
                    width: 8,
                    height: 8,
                    border: 'none',
                }}
            />

            <div className="flex items-center gap-2">
                {icon && (
                    <span className="opacity-60 font-bold text-xs">{icon}</span>
                )}
                <span className="font-medium truncate">
                    {data.label}
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: style.border.split(' ')[2],
                    width: 8,
                    height: 8,
                    border: 'none',
                }}
            />
        </div>
    );
}