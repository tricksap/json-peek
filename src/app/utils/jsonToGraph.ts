import { Node, Edge } from "reactflow";

export interface JsonNode extends Node {
  data: {
    label: string;
    value?: string;
    type: "object" | "array" | "primitive" | "root";
    fullPath: string;
  };
}

let nodeIdCounter = 0;

export function jsonToGraph(json: unknown): {
  nodes: JsonNode[];
  edges: Edge[];
} {
  nodeIdCounter = 0;
  const nodes: JsonNode[] = [];
  const edges: Edge[] = [];

  if (json === null || json === undefined) {
    return { nodes, edges };
  }

  const rootId = getNextId();
  nodes.push(createNode(rootId, "root", json, "root", 0, 0, "root"));

  processNode(json, rootId, nodes, edges, "root", 1);

  layoutNodes(nodes, edges);

  return { nodes, edges };
}

function getNextId(): string {
  return `node-${nodeIdCounter++}`;
}

function createNode(
  id: string,
  key: string,
  value: unknown,
  type: "object" | "array" | "primitive" | "root",
  x: number,
  y: number,
  fullPath: string
): JsonNode {
  let label = key;
  let displayValue: string | undefined;

  if (type === "primitive") {
    if (typeof value === "string") {
      displayValue = `"${value}"`;
    } else {
      displayValue = String(value);
    }
    label = `${key}: ${displayValue}`;
  } else if (type === "array") {
    label = `${key} [${(value as unknown[]).length}]`;
  } else if (type === "object" && key !== "root") {
    label = `${key} {}`;
  }

  return {
    id,
    type: "customNode",
    position: { x, y },
    data: {
      label,
      value: displayValue,
      type,
      fullPath,
    },
  };
}

function processNode(
  value: unknown,
  parentId: string,
  nodes: JsonNode[],
  edges: Edge[],
  parentPath: string,
  level: number
): void {
  if (value && typeof value === "object") {
    const entries = Array.isArray(value)
      ? value.map((item, index) => [String(index), item])
      : Object.entries(value);

    entries.forEach(([key, val]) => {
      const nodeId = getNextId();
      const fullPath = `${parentPath}.${key}`;
      const nodeType = getNodeType(val);

      nodes.push(createNode(nodeId, key, val, nodeType, 0, 0, fullPath));

      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
        animated: true,
      });

      if (nodeType === "object" || nodeType === "array") {
        processNode(val, nodeId, nodes, edges, fullPath, level + 1);
      }
    });
  }
}

function getNodeType(value: unknown): "object" | "array" | "primitive" {
  if (Array.isArray(value)) {
    return "array";
  }
  if (value && typeof value === "object") {
    return "object";
  }
  return "primitive";
}

function layoutNodes(nodes: JsonNode[], edges: Edge[]): void {
  if (nodes.length === 0) return;

  const nodeMap = new Map<string, JsonNode>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source)!.push(edge.target);
  });

  const levelMap = new Map<string, number>();

  function calculateLevels(nodeId: string, level: number): void {
    levelMap.set(nodeId, level);
    const children = childrenMap.get(nodeId) || [];
    children.forEach((childId) => calculateLevels(childId, level + 1));
  }

  if (nodes.length > 0) {
    calculateLevels(nodes[0].id, 0);
  }

  const levelGroups = new Map<number, string[]>();
  levelMap.forEach((level, nodeId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(nodeId);
  });

  const HORIZONTAL_SPACING = 200;
  const VERTICAL_SPACING = 120;

  levelGroups.forEach((nodeIds, level) => {
    const totalWidth = (nodeIds.length - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.position = {
          x: startX + index * HORIZONTAL_SPACING,
          y: level * VERTICAL_SPACING,
        };
      }
    });
  });
}

export function validateJson(jsonString: string): {
  valid: boolean;
  error?: string;
  data?: unknown;
} {
  try {
    const data = JSON.parse(jsonString);
    return { valid: true, data };
  } catch (e) {
    const error = e as SyntaxError;
    return { valid: false, error: error.message };
  }
}

export function formatJson(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    return JSON.stringify(data, null, 2);
  } catch {
    return jsonString;
  }
}
