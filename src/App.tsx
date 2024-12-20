import { useEffect, useState } from "react";

import { GraphCanvas } from "reagraph";
import { GraphStruct, convert } from "./utils";
import { Dropzone, ExtFile } from "@files-ui/react";
import { Box, Typography } from "@mui/material";
import InfoDialog from "./InfoDialog";
import { Metadata, Package } from "./types";
import { getFileDeps } from "./api";

interface GraphInfo {
  cycles: string[][];
}

function App() {
  const [graph, setGraph] = useState<GraphStruct | undefined>(undefined);
  const [packages, setPackages] = useState<Metadata[]>();
  const [info, setInfo] = useState<GraphInfo>();
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package>();

  // // TODO ich hatte keinen Bock auf unendliche Fehlermeldungen in der Konsole, sollte man prob noch besser machen
  // let keyCounter = 0;

  useEffect(() => {
    const load = async () => {
      const start = new Date();
      const file = files[0];
      if (!file) return;
      const result = await getFileDeps(file);
      if (!result) return;
      setGraph(convert(result.tree));
      setPackages(result.flat);
      setInfo({ cycles: result.cycles });
      const end = new Date();
      console.log((end.getTime() - start.getTime()) / 1000, "sec");
    };
    load();
  }, [files]);

  // useEffect(() => {
  //   const load = async () => {
  //     let i = 0;
  //     while (i < 3) {
  //       await loadMore();
  //     }
  //     setData(getGraphStructure());
  //   };
  //   load();
  //   loadMore();
  // }, []);

  // const handleMore = async () => {
  //   await loadMore();
  //   setData(getGraphStructure());
  // };

  return (
    <Box>
      {graph && (
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
              key={"graph"}
              layoutType="hierarchicalTd"
              sizingType="default"
              draggable
              nodes={graph?.nodes ?? []}
              edges={graph?.edges ?? []}
              labelType="all"
              lassoType="node"
              //layoutOverrides={{ nodeLevelRatio: 5, nodeSeparation: 2 }}
              onNodeClick={async (node) => {
                // const data = await getData(node.data.name);
                // setSelectedPackage(data);
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
      {!graph && (
        <Box width={200} height={200}>
          <Dropzone value={files} onChange={(newFiles) => setFiles(newFiles)} />{" "}
        </Box>
      )}
      {selectedPackage && (
        <InfoDialog
          open={
            !!selectedPackage &&
            selectedPackage.name !== graph?.nodes[0].data.name
          }
          onClose={() => setSelectedPackage(undefined)}
          data={selectedPackage}
        />
      )}
    </Box>
  );
}

export default App;
