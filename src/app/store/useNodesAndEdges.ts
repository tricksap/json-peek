import create from 'zustand';

const useNodesAndEdges = create((set) => ({
  nodes: [],
  edges: [],
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  resetNodes:()=>set(()=>({nodes:[]})),
  resetEdges:()=>set(()=>({edges:[]}))

}));

export default useNodesAndEdges;