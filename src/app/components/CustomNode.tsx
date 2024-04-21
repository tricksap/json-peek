import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = { left: 10 };

interface IData {
    [key: string]: string | boolean | number;
}
export default function CustomNode({ data }: { data: IData }) {
    return (
        <>
            <div className='max-w-md break-words'>
                <Handle type="target" position={Position.Left} id='left' />
                <div className='border-2 p-2 rounded bg-cyan-950'>
                    <ul>
                        {

                            typeof data.value === 'object' && !Array.isArray(data.value) ? (Object.entries(data.value).map(([key, value]) => (
                                <li key={key}>
                                    <strong className='text-blue-500'>{key}:</strong> {value}
                                </li>
                            ))) : (data.value)}
                    </ul>
                </div>
                <Handle type="source" position={Position.Right} id="right" />
            </div>

        </>
    );
}