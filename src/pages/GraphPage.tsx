import { ExtFile } from "@files-ui/react";
import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GraphCanvas } from "reagraph";
import { getFileDeps, getPackage } from "../api";
import { Metadata, Package } from "../types";
import { GraphStruct, convert } from "../utils";
import InfoDialog from "../components/InfoDialog";
import { GraphPageState } from "./App";
import { useNavigate } from "react-router";

interface Props {
  graphPageState: GraphPageState;
}

interface GraphInfo {
  cycles: string[][];
}

export const GraphPage = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<GraphStruct | undefined>(undefined);
  const [packages, setPackages] = useState<Metadata[]>();
  const [info, setInfo] = useState<GraphInfo>();
  const [selectedPackage, setSelectedPackage] = useState<Metadata>();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const start = new Date();
      let result;
      if (props.graphPageState.type === "file") {
        result = await getFileDeps(props.graphPageState.file);
      } else {
        let name: string;
        let version: string | undefined;
        const arr = props.graphPageState.name.split("@");
        if (arr.length === 1) {
          name = arr[0];
        } else {
          version = arr[arr.length - 1];
          name = arr.slice(0, arr.length - 1).join("@");
          console.log("name", name);
          console.log("version", version);
        }

        const response = await getPackage(name, version);
        result = response.data;
      }
      if (!result || result.flat.length === 0) {
        return navigate("/404");
      }

      setGraph(convert(result.tree));
      setPackages(result.flat);
      setInfo({ cycles: result.cycles });
      const end = new Date();
      console.log((end.getTime() - start.getTime()) / 1000, "sec");
      setLoading(false);
    };
    load();
  }, [props.graphPageState]);
  return (
    <>
      {loading && (
        <CircularProgress sx={{ top: "50%", left: "50%", position: "fixed" }} />
      )}
      {graph && (
        <>
          <GraphCanvas
            key={"graph"}
            layoutType="hierarchicalTd"
            sizingType="default"
            draggable
            nodes={graph?.nodes ?? []}
            edges={graph?.edges ?? []}
            labelType="all"
            lassoType="node"
            selections={
              [
                //  "reagraph@4.21.0", //mark graph node by id
                //  "reagraph@4.21.0->glodrei@0.0.1", // mark edge
              ]
            }
            //layoutOverrides={{ nodeLevelRatio: 5, nodeSeparation: 2 }}
            onNodeClick={async (node) => {
              const data = packages?.find((p) => p._id === node.id);
              data && setSelectedPackage(data);
            }}
          />
          <Drawer
            sx={{
              width: 400,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 400,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="right"
            open={true}
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
          </Drawer>
        </>
      )}
      {selectedPackage && (
        <InfoDialog
          open={!!selectedPackage && selectedPackage._id !== graph?.nodes[0].id}
          onClose={() => setSelectedPackage(undefined)}
          data={selectedPackage}
        />
      )}
    </>
  );
};
