'use client'
import Dagre from '@dagrejs/dagre';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Panel,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '@/app/components/CustomNode'
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary
import { useCallback, useEffect } from 'react';
const nodeTypes = { customNode: CustomNode };
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));



export default function Canvas() {
    const { nodes, edges } = useNodesAndEdges()
    const getLayoutedElements = (nodes, edges, options) => {
        g.setGraph({ rankdir: options.direction, align: 'UR', nodesep: 150, edgesep: 150, ranksep: 300 });
        edges.forEach((edge) => g.setEdge(edge.source, edge.target));
        nodes.forEach((node) => g.setNode(node.id, node));

        Dagre.layout(g);
        return {
            nodes: nodes.map((node) => {
                const { x, y } = g.node(node.id);
                console.log(x, y, 'adadasaXY')
                return { ...node, position: { x, y } };
            }),
            edges,
        };
    };

    const LayoutFlow = ({ InitialNodes, InitialEdges }) => {
        const { fitView } = useReactFlow();
        const [nodes, setNodes, onNodesChange] = useNodesState(InitialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(InitialEdges);

        console.log(nodes, 'didid')
        const onLayout = useCallback(
            (direction) => {

                const layouted = getLayoutedElements(nodes, edges, { direction });

                setNodes([...layouted.nodes]);
                setEdges([...layouted.edges]);

                window.requestAnimationFrame(() => {
                    fitView();
                });
            },
            [nodes, edges]
        );

        return (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <Panel position="top-right">
                    <button onClick={() => onLayout('LR')}>horizontal layout </button>
                    <br />
                    <button onClick={() => onLayout('TB')}>vertical layout </button>
                </Panel>
            </ReactFlow>
        );
    };




    return (

        <div style={{ height: '100vh', width: '70%' }}>
            <ReactFlowProvider>
                <LayoutFlow InitialNodes={nodes} InitialEdges={edges} />

            </ReactFlowProvider>
        </div>
    );
}

