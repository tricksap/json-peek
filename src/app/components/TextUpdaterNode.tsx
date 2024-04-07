import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = { left: 10 };

interface IData {
    [key: string]: string | boolean | number;
}
export default function TextUpdaterNode({ data }: { data: IData }) {

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='border-2 p-2 rounded bg-cyan-950'>
                <ul>
                    {Object.entries(data.value).map(([key, value]) => (
                        <li key={key}>
                            <strong className='text-blue-500'>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </>
    );
}