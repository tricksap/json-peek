import { Graph } from "../JsonParser";
import { MarkerType } from "reactflow";

export default function addEdgestoGraph(
  graph: Graph,
  from: string,
  to: string
) {
  const newEdge = {
    id: `${from}-${to}`,
    source: `${from}`,
    target: `${to}`,
    type: "bezier",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      animated: true,
      width: 10,
      height: 10,
      color: "#3B6978",
    },
    style: {
      strokeWidth: 4,
      stroke: "#3B6978",
    },
  };
  graph.edges.push(newEdge);
}
