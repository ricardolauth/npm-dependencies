import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import { GraphCanvas, GraphEdge, GraphNode } from "reagraph";

interface Foo {
  [key: string]: string;
}

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Foo;
  description: string;
  license: string;
}

interface GraphStruct {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Package {
  name: string;
  version: string;
  dependencies?: Package[];
  description: string;
  license: string;
}

function App() {
  const [data, setData] = useState<GraphStruct | undefined>(undefined);

  const getData = async (name: string, version?: string) => {
    const url = `https://registry.npmjs.org/${name}/${version ?? "latest"}`;
    console.log(url);
    const { data } = await axios.get<PackageJson>(url);
    return data;
  };

  const formatVersion = (version: string) => {
    const str = RegExp(/\d+.\d+.\d+/).exec(version);
    const number = RegExp(/\d+/).exec(version)?.[0];
    const numberStr = number ? `${number}.0.0` : undefined;
    return str?.[0] ?? numberStr ?? "latest";
  };

  const getDeps = async (name: string, version?: string): Promise<Package> => {
    const raw = await getData(name, version);
    const pack: Package = { ...raw, dependencies: [] };
    if (raw.dependencies) {
      const promises = Object.entries(raw.dependencies).map(
        async (e) => await getDeps(e[0], formatVersion(e[1]))
      );

      pack.dependencies = await Promise.all(promises);
    }

    return pack;
  };

  const convert = (pack: Package): GraphStruct => {
    const current = toNode(pack);
    const children = pack.dependencies?.map((p) => toNode(p)) ?? [];
    const edges = children.map((c) => toEdge(current, c));
    const graphs = pack.dependencies?.map(convert);
    return {
      nodes: [current, ...(graphs?.flatMap((g) => g.nodes) ?? [])],
      edges: [...edges, ...(graphs?.flatMap((g) => g.edges) ?? [])],
    };
  };

  const toNode = (pack: Package): GraphNode => {
    const id = `${pack.name}@${pack.version}`;
    return { id, label: id };
  };
  const toEdge = (source: GraphNode, target: GraphNode): GraphEdge => {
    const id = `${source.id}->${target.id}`;
    return { id, label: id, source: source.id, target: target.id };
  };

  useEffect(() => {
    getDeps("reagraph").then((d) => {
      const graph = convert(d);
      setData(graph);
    });
  }, []);

  return <GraphCanvas nodes={data?.nodes ?? []} edges={data?.edges ?? []} />;
}

export default App;
