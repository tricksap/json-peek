'use client'
import Dagre from '@dagrejs/dagre';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '@/app/components/CustomNode'
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));


const nodeTypes = { customNode: CustomNode };
export default function Canvas() {
    const { nodes, edges } = useNodesAndEdges()

    return (
        <div style={{ height: '100vh', width: '70%' }}>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}

