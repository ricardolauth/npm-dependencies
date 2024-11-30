import { useEffect, useState } from "react";

import { darkTheme, GraphCanvas, GraphEdge, GraphNode } from "reagraph";
import {
  GraphStruct,
  distinctByKey,
  getDeps,
  getDepsFromJson,
  getGraphStructure,
  loadMore,
} from "./utils";
import { Dropzone, ExtFile } from "@files-ui/react";
import { Version } from "./types";
import Button from "@mui/material/Button";
import { Box, Grid, Grid2, Typography } from "@mui/material";
import { Pageview } from "@mui/icons-material";

function App() {
  const [data, setData] = useState<GraphStruct | undefined>(undefined);
  const [files, setFiles] = useState<ExtFile[]>([]);

  useEffect(() => {
    const file = files[0];
    if (!file) return;
    getDepsFromJson(file).then(() => {
      const d = getGraphStructure();
      console.log("data", d);
      setData(d);
    });
  }, [files]);

  useEffect(() => {
    //loadMore();
  }, [data]);

  const handleMore = async () => {
    await loadMore();
    setData(getGraphStructure());
  };

  return (
    <Box>
      {data && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "70%",
              height: "100%",
              //backgroundColor: "blue",
            }}
          >
            <GraphCanvas
              layoutType="treeTd2d"
              sizingType="default"
              //collapsedNodeIds={data?.nodes.map((n) => n.id)}
              draggable
              nodes={data?.nodes ?? []}
              edges={data?.edges ?? []}
              selections={["glodrei@0.0.1"]}
              //clusterAttribute="licence"
              //theme={darkTheme}
              labelType="all"
              lassoType="node"
              layoutOverrides={{ nodeLevelRatio: 5 }}
              onNodeClick={(node) => {
                //window.alert(node.data.name);
              }}
            />
          </div>

          <div
            style={{
              position: "fixed",
              width: "30%",
              top: 0,
              right: 0,
              borderLeft: "solid",
              height: "100%",
              padding: 8,
            }}
          >
            <Button variant="contained" onClick={handleMore}>
              More
            </Button>
            <Typography>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
              dolor sit amet.
            </Typography>
          </div>
        </>
      )}
      {!data && (
        <Box width={200} height={200}>
          <Dropzone value={files} onChange={(newFiles) => setFiles(newFiles)} />{" "}
        </Box>
      )}
    </Box>
  );
}

export default App;
