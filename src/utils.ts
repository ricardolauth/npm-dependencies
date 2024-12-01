import { ExtFile } from "@files-ui/react";
import axios from "axios";
import { GraphNode, GraphEdge } from "reagraph";
import { Package, Version } from "./types";

// interface Foo {
//   [key: string]: string;
// }

// interface PackageJson {
//   name: string;
//   version: string;
//   dependencies?: Foo;
//   description: string;
//   license: string;
// }

export interface GraphStruct {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// export interface Package {
//   name: string;
//   version: string;
//   dependencies?: Package[];
//   description: string;
//   license: string;
// }

export const cache = new Map<string, Package>();
const nodes = new Set<GraphNode>();
const edges = new Set<GraphEdge>();

export const getData = async (name: string) => {
  const entry = cache.get(name);
  if (entry) {
    return entry;
  }

  const url = `https://registry.npmjs.org/${name}`;
  console.log("get from registry", name);
  const { data } = await axios.get<Package>(url);
  cache.set(data.name, data);
  return data;
};

const formatVersion = (version: string) => {
  let v = version.split("||")[0].split(" - ")[0];
  if (RegExp(/\d+.\d+.\d+/).test(v)) {
    return v.replace("^", "").replace(">=", "").replace("~", "");
  }
  if (RegExp(/\d+.\d+/).test(v)) {
    const number = RegExp(/\d+.\d+/).exec(v);
    return `${number![0]}.0`;
  }
  if (RegExp(/\d+/).test(v)) {
    const number = RegExp(/\d+/).exec(v);
    return `${number![0]}.0.0`;
  }

  return "latest";
};

// const reduceGraph = (structArray: GraphStruct[]) =>
//   structArray.reduce((p, c) => {
//     return { edges: [...p.edges, ...c.edges], nodes: [...p.nodes, ...c.nodes] };
//   });
export const getGraphStructure = (): GraphStruct => {
  return { nodes: [...nodes.values()], edges: [...edges.values()] };
};

export const getDeps = async (source: Version) => {
  // TODO kurzer Fix für Präsi, damit wird dann nicht die dependency von nem random "dependencies"-projekt in npm displayed
  if (source.name !== "dependencies") {
    const pack = await getData(source.name);  
    const packVersionDeps =
      pack.versions[source.version ?? pack["dist-tags"].latest] ??
      pack.versions[pack["dist-tags"].latest];
    source = packVersionDeps;
  }

  const root = toNode(source);
  const childs = Object.entries(source.dependencies ?? {}).map((e) =>
    toChildNode(e[0], e[1])
  );

  const currentNodes = [root, ...childs];

  console.log(currentNodes);
  currentNodes.forEach((node) => nodes.add(node));

  //[root, ...childs]
  childs.map((c) => toEdge(root, c)).forEach((edge) => edges.add(edge));
  //await loadMore();
};

export const loadMore = async () => {
  if (nodes.size == 0) return;

  let more: Promise<void>[] = [];
  for (const node of nodes.values()) {
    if (!node.data.dependencies) {
      more.push(getDeps(toSource(node.id) as Version));
    }
  }

  console.log("more")
  console.log(more);
  await Promise.all(more);

  if (more.length > 0) {
    // await loadMore();
  }

  // const more = await Promise.all(
  //   nodes.values().
  //     .filter((n) => !n.data.dependencies)
  //     .map(async (d) => await getDeps(toSource(d.id) as Version))
  // );
  //const nodes = more.flatMap((m) => m.nodes);
  //const edges = more.flatMap((m) => m.edges);

  // console.log("nodes", nodes);
  // console.log("edges", edges);

  // const newgraph = {
  //   nodes: distinctByKey([...(data?.nodes ?? []), ...nodes], "id").sort(
  //     (a, b) => a.id.localeCompare(b.id)
  //   ),
  //   edges: [...(data?.edges ?? []), ...edges].sort((a, b) =>
  //     a.id.localeCompare(b.id)
  //   ), //distinctByKey(, "id"),
  // };
};

export const getDepsFromJson = async (file: ExtFile) => {
  console.log(file);
  const text = await file.file?.text();
  if (!text) {
    return;
  }
  const json: Version = JSON.parse(text);

  console.log(json.dependencies);
  const dependencies = Object.entries(json.dependencies ?? {})!.map((d) => [
    d[0],
    formatVersion(d[1]),
  ]);
  json.dependencies = Object.fromEntries(dependencies);
  return await getDeps(json);
};

export const distinctByKey = <T>(array: T[], key: keyof T) => [
  ...new Map(array.map((item) => [item[key], item])).values(),
];

const toSource = (id: string): Partial<Version> => {
  const idx = id.lastIndexOf("@");
  const name = id.substring(0, idx);
  const version = id.substring(idx + 1);

  return { name, version };
};

// export const convert = (pack: Package): GraphStruct => {
//   const current = toNode(pack);
//   const children = pack.dependencies?.map((p) => toNode(p)) ?? [];
//   const edges = children.map((c) => toEdge(current, c));
//   const graphs = pack.dependencies?.map(convert);
//   return {
//     nodes: [current, ...(graphs?.flatMap((g) => g.nodes) ?? [])],
//     edges: [...edges, ...(graphs?.flatMap((g) => g.edges) ?? [])],
//   };
// };

const toNode = (pack: Version): GraphNode => {
  const id = `${pack.name}@${formatVersion(pack.version)}`;
  return { id, label: id, data: pack };
};

const toChildNode = (name: string, version: string): GraphNode => {
  const id = `${name}@${formatVersion(version)}`;
  return { id, label: id, data: { name, version } };
};

const toEdge = (source: GraphNode, target: GraphNode): GraphEdge => {
  const id = `${source.id}->${target.id}`;
  return {
    id,
    source: source.id,
    target: target.id,
    label: target.data.version,
  };
};
