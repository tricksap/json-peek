'use client'
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from '@/app/components/TextUpdaterNode'
import { useMemo } from 'react';
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary


// const edges = [{ id: '1-2', source: '1', target: '2', type: 'step' }];

const nodeTypes = { textUpdater: TextUpdaterNode };
export default function Canvas() {
    const { addNode, nodes, resetNodes, edges } = useNodesAndEdges()

    return (
        <div style={{ height: '100vh', width: '70%' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}

