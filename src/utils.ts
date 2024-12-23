import { GraphNode, GraphEdge } from "reagraph";

export const toNode = (id: string): GraphNode => {
  return { id, label: id };
};

export const toEdge = (id: string): GraphEdge => {
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
