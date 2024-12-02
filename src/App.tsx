import { useEffect, useState } from "react";

import { GraphCanvas, InternalGraphNode } from "reagraph";
import {
  GraphStruct,
  getData,
  getDepsFromJson,
  getGraphStructure,
  loadMore,
} from "./utils";
import { Dropzone, ExtFile } from "@files-ui/react";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import InfoDialog from "./InfoDialog";
import { Package } from "./types";

function App() {
  const [data, setData] = useState<GraphStruct | undefined>(undefined);
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package>();

  // TODO ich hatte keinen Bock auf unendliche Fehlermeldungen in der Konsole, sollte man prob noch besser machen
  let keyCounter = 0;

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
            }}
          >
            <GraphCanvas
              key={keyCounter++}
              // layoutType="treeTd2d"
              sizingType="default"
              draggable
              nodes={data?.nodes ?? []}
              edges={data?.edges ?? []}
              labelType="all"
              lassoType="node"
              layoutOverrides={{ nodeLevelRatio: 5, nodeSeparation: 2 }}
              onNodeClick={async (node) => {
                const data = await getData(node.data.name);
                setSelectedPackage(data);
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
      {selectedPackage && (
        <InfoDialog
          open={
            !!selectedPackage &&
            selectedPackage.name !== data?.nodes[0].data.name
          }
          onClose={() => setSelectedPackage(undefined)}
          data={selectedPackage}
        />
      )}
    </Box>
  );
}

export default App;
