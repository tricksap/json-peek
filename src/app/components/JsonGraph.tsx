import { useCallback, useLayoutEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Panel,
    BackgroundVariant,
    ReactFlowProvider,
    useReactFlow,
    Node,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { JsonNode } from '../utils/jsonToGraph';
import CustomNode from './CustomNode';
import ELK from 'elkjs/lib/elk.bundled.js';
import type {
    LayoutOptions,
} from 'elkjs';

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
};

const getLayoutedElements = async (
    nodes: Node[],
    edges: Position[],
    options = {} as LayoutOptions) => {
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
    try {
        const layoutedGraph = await elk
            .layout(graph);
        return ({
            nodes: layoutedGraph.children?.map((node_1) => ({
                ...node_1,
                // React Flow expects a position property on the node instead of `x`
                // and `y` fields.
                position: { x: node_1.x, y: node_1.y },
            })),

            edges: layoutedGraph.edges,
        });
    } catch (message) {
        return console.error(message);
    }
};


export function JsonGraph({ nodes: initialNodes, edges: initialEdges }: JsonGraphProps) {
    function LayoutFlow() {
        const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
        const { fitView } = useReactFlow();

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
            <div className="h-full bg-[#1A1A1A] dark:bg-[#1A1A1A]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    fitView
                    minZoom={0.1}
                    maxZoom={2}
                    proOptions={{ hideAttribution: true }}
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

    return (
        <ReactFlowProvider>
            <LayoutFlow />
        </ReactFlowProvider>
    );
}
