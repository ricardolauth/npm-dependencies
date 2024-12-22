import { GraphNode, GraphEdge } from "reagraph";

export interface GraphStruct {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const toNode = (id: string): GraphNode => {
  return { id, label: id };
};

const toEdge = (id: string): GraphEdge => {
  const [source, target] = id.split("->");
  return {
    id,
    source: source,
    target: target,
  };
};

export const distinctByKey = <T>(array: T[], key: keyof T) => [
  ...new Map(array.map((item) => [item[key], item])).values(),
];

export const distinctFlat = <T>(array: T[][]): T[][] =>
  [...new Set(array.map((v) => v.join(";"))).values()].map((v) =>
    v.split(";")
  ) as T[][];

export const convert = (tree: Record<string, object>): GraphStruct => {
  const nodes = new Set<string>();
  const edges = new Set<string>();
  toGraph({ tree, nodes, edges });
  return {
    edges: Array.from(edges).map((e) => toEdge(e)),
    nodes: Array.from(nodes).map((n) => toNode(n)),
  };
};
type Task = {
  tree: Record<string, object>;
  nodes: Set<string>;
  edges: Set<string>;
};
const toGraph = ({ tree, nodes, edges }: Task) => {
  Object.keys(tree).forEach((n) => {
    nodes.add(n);
    Object.keys(tree[n]).forEach((c) => {
      edges.add(`${n}->${c}`);
    });
    if (Object.keys(tree[n]).length > 0) {
      toGraph({ tree: tree[n] as Record<string, object>, edges, nodes });
    }
  });
};

export const packNameVerFromId = (packId: string) => {
  let name: string;
  let version: string | undefined;
  const arr = packId.split("@");
  if (arr.length === 1) {
    name = arr[0];
  } else {
    version = arr[arr.length - 1];
    name = arr.slice(0, arr.length - 1).join("@");
  }
  return { name, version };
};
