import { ExtFile } from "@files-ui/react";
import { Metadata, SearchObj, SearchQuery, Version } from "./types";
import axios from "axios";
import { distinctByKey } from "./utils";

export interface Result {
  nodes: Metadata[];
  edges: string[];
}

export const getPackage = async (name: string, version?: string) => {
  return await axios.get<Result>("https://npmreg.azurewebsites.net/package", {
    params: {
      name,
      version,
    },
  });
};

export const getFileDeps = async (file: ExtFile) => {
  console.log(file);
  const text = await file.file?.text();
  if (!text) {
    return;
  }
  const json: Version = JSON.parse(text);
  const dependencies = await Promise.all(
    Object.entries(json.dependencies ?? {})!.map(([name, version]) =>
      getPackage(name, version)
    )
  );

  const rootId = `${json.name}@${json.version}`;

  const nodes = distinctByKey(
    dependencies.flatMap((d) => d.data.nodes),
    "_id"
  );
  const edges = Array.from(new Set(dependencies.flatMap((d) => d.data.edges)));
  const topLevel = nodes.filter((n) => !edges.some((e) => e.endsWith(n._id)));
  const topLevelEdges = topLevel.map((tl) => `${rootId}->${tl._id}`);

  return {
    nodes: [...nodes, { _id: rootId } as unknown as Metadata],
    edges: [...edges, ...topLevelEdges],
  };
};

export const getSuggestions = async (text: string): Promise<SearchObj[]> => {
  const data = await axios.get<SearchQuery>(
    " https://registry.npmjs.com/-/v1/search",
    {
      params: { text },
    }
  );
  return data.data.objects;
};
