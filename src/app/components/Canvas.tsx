// @ts-nocheck

'use client'

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
import { useCallback, useEffect } from 'react';
const nodeTypes = { customNode: CustomNode };


export default function Canvas() {
    const { nodes, edges } = useNodesAndEdges()
    const elk = new ELK();

    const useLayoutedElements = () => {
        const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
        const defaultOptions = {
            'elk.algorithm': 'mrtree',
            'elk.layered.spacing.nodeNodeBetweenLayers': 100,
            'elk.spacing.nodeNode': 110,
        };
        const getLayoutedElements = useCallback((options: any) => {
            const layoutOptions = { ...defaultOptions, ...options };
            const graph = {
                id: 'root',
                layoutOptions: layoutOptions,
                children: getNodes(),
                edges: getEdges(),
            };

            elk.layout(graph).then(({ children }) => {
                // By mutating the children in-place we saves ourselves from creating a
                // needless copy of the nodes array.
                children.forEach((node) => {
                    node.position = { x: node.x, y: node.y };
                });

                setNodes(children);
                window.requestAnimationFrame(() => {
                    fitView();
                });
            });
        }, []);

        return { getLayoutedElements };
    };

    const LayoutFlow = ({ InitialNodes, InitialEdges }: { InitialNodes: any[], InitialEdges: any[] }) => {
        console.log(InitialEdges, InitialNodes)
        const [nodes, , onNodesChange] = useNodesState(InitialNodes);
        const [edges, , onEdgesChange] = useEdgesState(InitialEdges);
        const { getLayoutedElements } = useLayoutedElements();
        useEffect(() => {
            getLayoutedElements({ 'elk.algorithm': 'mrtree', 'elk.direction': 'RIGHT' });
        }, [InitialNodes, InitialEdges, getLayoutedElements]);

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
                    <div class='space-x-1'>
                        <button
                            class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border border-white-900 text-white-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
                            onClick={() =>
                                getLayoutedElements({ 'elk.algorithm': 'mrtree', 'elk.direction': 'RIGHT' })
                            }
                        >
                            horizontal layout
                        </button>
                        <button class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border border-white-900 text-white-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85]"
                            onClick={() =>
                                getLayoutedElements({ 'elk.algorithm': 'mrtree', 'elk.direction': 'DOWN' })
                            }
                        >
                            vertical layout
                        </button>
                    </div>

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

