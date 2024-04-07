'use client'
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from '@/app/components/TextUpdaterNode'
import { useMemo } from 'react';

const edges = [{ id: '1-2', source: '1', target: '2', type: 'step' }];
const nodes = [
    {
        id: 'node-2', type: 'textUpdater', position: { x: 0, y: 100 }, data: {
            value: "member"
        }
    },
];

const nodeTypes = { textUpdater: TextUpdaterNode };
export default function Canvas() {

    return (
        <div style={{ height: '100vh', width: '70%' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}

