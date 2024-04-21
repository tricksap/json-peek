import create from 'zustand';

const useNodesAndEdges = create((set) => ({
  nodes: [],
  edges: [],
  addNode: (node: any) => set((state: { nodes: any; }) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge: any) => set((state: { edges: any; }) => ({ edges: [...state.edges, edge] })),
  resetNodes:()=>set(()=>({nodes:[]})),
  resetEdges:()=>set(()=>({edges:[]}))

}));

export default useNodesAndEdges;