import { ExtFile } from "@files-ui/react";
import { Metadata, SearchObj, SearchQuery, Version } from "./types";
import axios from "axios";

interface Result {
  tree: Record<string, object>;
  flat: Metadata[];
  cycles: string[][];
}

export const getPackage = async (name: string, version?: string) => {
  return await axios.get<Result>("https://npmreg.azurewebsites.net/package", {
    params: { name, version },
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
  const depObj = Object.fromEntries(
    dependencies.flatMap((d) => Object.entries(d.data.tree))
  );
  console.log("depsOb", depObj);
  let result: Record<string, object> = {};
  result[json.name] = depObj;

  return {
    tree: result,
    flat: dependencies.flatMap((d) => d.data.flat),
    cycles: dependencies.flatMap((d) => d.data.cycles),
  };
};

// https://www.npmjs.com/search/suggestions?q=rea

export const getSuggestions = async (text: string): Promise<SearchObj[]> => {
  const data = await axios.get<SearchQuery>(
    " https://registry.npmjs.com/-/v1/search",
    {
      params: { text },
    }
  );
  return data.data.objects.slice(0, 15);
};
