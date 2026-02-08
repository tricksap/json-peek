// @ts-nocheck
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    ReactFlowProvider,
    useReactFlow,
    Node,
    Position,
    NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { JsonNode } from '../utils/jsonToGraph';
import { CustomNode } from './CustomNode';
import ELK from 'elkjs/lib/elk.bundled.js';
import type {
    LayoutOptions,
} from 'elkjs';
import { NodeDialog } from './NodeDialog';
import { useNodeDialogStore } from '../store/useNodeDialogStore';

interface JsonGraphProps {
    nodes: JsonNode[];
    edges: Array<{ id: string; source: string; target: string; type?: string; animated?: boolean }>;
}

const nodeTypes = { customNode: CustomNode };
const elk = new ELK();

const nodeColors: Record<string, string> = {
    root: '#4A9EFF',
    object: '#9D7CD8',
    array: '#7FB069',
    primitive: '#FF8B4D',
};

const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 15,
    'elk.direction': 'RIGHT'
};

const getLayoutedElements = async (
    nodes: Node[],
    edges: Position[],
    options: LayoutOptions) => {
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,

            targetPosition: 'left',
            sourcePosition: 'right',

            width: 300, height: 50
        })),
        edges: edges,
    };

    try {
        const layoutedGraph = await elk.layout(graph);

        return ({
            nodes: layoutedGraph.children?.map((node) => ({
                ...node,

                position: { x: node.x, y: node.y },
            })),
        });
    } catch (message) {
        return console.error(message);
    }
};

function LayoutFlow({ initialNodes, initialEdges }: { initialNodes: any, initialEdges: any }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { fitView } = useReactFlow();
    const { setOpen, setSelectedNode } = useNodeDialogStore();
    const [layoutDone, setLayoutDone] = useState(false);

    const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
        setSelectedNode(node);
        setOpen(true);
    }, [setSelectedNode, setOpen]);


    // Run layout when initialNodes/initialEdges change
    useLayoutEffect(() => {
        setLayoutDone(false);

        getLayoutedElements(initialNodes, initialEdges, elkOptions)
            .then(({ nodes: layoutedNodes }) => {
                setNodes(layoutedNodes);
                setEdges(initialEdges);

                setLayoutDone(true);
            });
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    useEffect(() => {
        console.log('asd1`223weds')
        fitView();
    }, [layoutDone, fitView]);

    return (
        <div className="h-full bg-[#1A1A1A] dark:bg-[#1A1A1A]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodesDraggable={false}
                nodesConnectable={false}
                minZoom={0.1}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
                onNodeClick={handleNodeClick}
            >
                <Background
                    gap={20}
                    variant={BackgroundVariant.Dots}
                    size={1}
                />
                <Controls
                    className="bg-[#2A2A2A] border-[#444]"
                    position='top-right'
                    showInteractive={false} />

                <MiniMap
                    nodeColor={(node) => {
                        const type = node.data?.type || 'primitive';
                        const colors: Record<string, string> = nodeColors
                        return colors[type] || '#666';
                    }}
                    className="bg-[#2A2A2A] border-[#444]"
                    maskColor="rgba(0, 0, 0, 0.7)"
                />

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-[10px] font-medium">
                    {Object.entries(nodeColors).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-border">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                            <span className="capitalize text-muted-foreground">{type}</span>
                        </div>
                    ))}
                </div>
            </ReactFlow>
        </div>
    );
}

export function JsonGraph({ nodes: initialNodes, edges: initialEdges }: JsonGraphProps) {
    return (
        <>
            <ReactFlowProvider>
                <LayoutFlow initialNodes={initialNodes} initialEdges={initialEdges} />
            </ReactFlowProvider>
            <NodeDialog />;
        </>
    );
}
