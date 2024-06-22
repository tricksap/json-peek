// @ts-nocheck

'use client'
// import { initialNodes, initialEdges } from './nodes-edges.js';
import ELK from 'elkjs/lib/elk.bundled.js';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Panel,
    useReactFlow,
    MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../components/CustomNode'
import useNodesAndEdges from '../store/useNodesAndEdges'; // Import your custom hook if necessary
import { useCallback, useEffect, useLayoutEffect } from 'react';
const nodeTypes = { customNode: CustomNode };




const elk = new ELK();

const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 90,
};

const getLayoutedElements = (nodes, edges, options = {}) => {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            // Adjust the target and source handle positions based on the layout
            // direction.
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',

            // Conditionally include width and height if useInitialNodes is true.
            ...(options.useInitialNodes ? { width: 300, height: 50 } : {})
        })),
        edges: edges,
    };
    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: { x: node.x, y: node.y },
            })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};

export default function Canvas() {
    const { nodes: initialNodes, edges: initialEdges } = useNodesAndEdges()


    function LayoutFlow() {
        const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
        const { fitView } = useReactFlow();

        const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
        const onLayout = useCallback(
            ({ direction, useInitialNodes = false }) => {
                const opts = { 'elk.direction': direction, useInitialNodes, ...elkOptions };
                const ns = useInitialNodes ? initialNodes : nodes;
                const es = useInitialNodes ? initialEdges : edges;
                console.log(opts)
                getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                    setNodes(layoutedNodes);
                    setEdges(layoutedEdges);

                    window.requestAnimationFrame(() => fitView());
                });
            },
            [nodes, edges]
        );

        // Calculate the initial layout on mount.
        useLayoutEffect(() => {
            onLayout({ direction: 'RIGHT', useInitialNodes: true });
        }, []);

        return (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Panel position="top-right">
                    <div className='space-x-1'>

                        <button className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border border-white-900 text-white-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]'
                            onClick={() => onLayout({ direction: 'DOWN' })}>vertical layout</button>

                        <button className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border border-white-900 text-white-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]'
                            onClick={() => onLayout({ direction: 'RIGHT' })}>horizontal layout</button>
                    </div>
                </Panel>
            </ReactFlow>
        );
    }





    return (

        <div style={{ height: '100vh', width: '70%' }}>
            <ReactFlowProvider>
                <LayoutFlow />

            </ReactFlowProvider>
        </div>
    );
}

