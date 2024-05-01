import {create} from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
interface IuseNodesAndEdges{
    nodes: any[];
    edges: any[];  
    addNode: (node: any) => void;
    addEdge: (edge: any) => void;
    resetNodes: () => void;
    resetEdges: () => void;
  }

const useNodesAndEdges = create<IuseNodesAndEdges>((set,get) => ({
  nodes: [],
  edges: [],
  addNode: (node: any) => set((state: { nodes: any; }) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge: any) => set((state: { edges: any; }) => ({ edges: [...state.edges, edge] })),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  resetNodes:()=>set(()=>({nodes:[]})),
  resetEdges:()=>set(()=>({edges:[]}))

}));

export default useNodesAndEdges;