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
                    {
                        typeof data.value === 'object' && !Array.isArray(data.value) ? (Object.entries(data.value).map(([key, value]) => (
                            <div key={key}>
                                <strong className='text-blue-500'>{key}:</strong> {value}
                            </div>
                        ))) : (data.value)
                    }
                    {
                        data.type !== '' && <span> <strong>{data.type}</strong> </span>
                    }
                </div>
                <Handle type="source" position={Position.Right} id="right" />
            </div>

        </>
    );
}