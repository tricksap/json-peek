import { Graph } from "../JsonParser"

export default function addNodetoGraph(graph: Graph,data: {}){
    const positionX = (graph?.nodes?.length &&  graph.nodes[graph.nodes.length - 1]?.position?.x) || 0
    const xIncrement =200
    const newNode = 
        {
            id: `node-${graph.nodes.length + 1}`, 
            type: 'customNode', 
            position: { x:positionX + xIncrement, y: 200 }, 
            data: {
                type:"type",
                value: data,
            }
        }
        graph.nodes.push(newNode)
    return newNode.id
}