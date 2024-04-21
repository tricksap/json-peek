import { Graph } from "../JsonParser"


export default function addEdgestoGraph(graph: Graph, from: string, to: string){
    const newEdge =
    { id: `${from}-${to}`, source: `${from}`, target: `${to}` };
    graph.edges.push(newEdge)
}