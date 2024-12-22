import {
  CircularProgress,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GraphCanvas } from "reagraph";
import { getFileDeps, getPackage, Result } from "../api";
import { Metadata } from "../types";
import { GraphStruct, convert } from "../utils";
import InfoDialog from "../components/InfoDialog";
import { GraphPageState } from "./App";
import { useNavigate } from "react-router";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CloseIcon from "@mui/icons-material/Close";
import { Analytics } from "../components/analytics";

interface Props {
  graphPageState: GraphPageState;
}

export interface GraphInfo {
  result?: Result;
  graph?: GraphStruct;
}

export const GraphPage = (props: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<GraphInfo>({});
  const [dialogPackage, setDialogPackage] = useState<Metadata>();
  const [selection, setSelection] = useState<string[]>([]);

  const { graph, result } = info;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const start = new Date();
      let res;
      if (props.graphPageState.type === "file") {
        res = await getFileDeps(props.graphPageState.file);
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
        res = response.data;
      }
      if (!res || res.flat.length === 0) {
        return navigate("/404");
      }

      const graph = convert(res.tree);
      setInfo({ result: res, graph });
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
            layoutType="treeTd3d"
            sizingType="default"
            maxDistance={25000}
            layoutOverrides={{
              linkDistance: 500,
              centerInertia: 0,
              nodeSeparation: Infinity,
            }}
            draggable
            nodes={graph?.nodes ?? []}
            edges={graph?.edges ?? []}
            labelType="all"
            lassoType="node"
            selections={selection}
            onNodeClick={async (node) => {
              const data = result?.flat?.find((p) => p._id === node.id);
              data && setDialogPackage(data);
            }}
          />
          <Drawer
            sx={{
              width: 500,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 500,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
            <DialogTitle>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5">Details</Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Analytics
                {...info}
                select={(nodeOrEdge) => {
                  console.log(nodeOrEdge);
                  setSelection(nodeOrEdge);
                }}
              />
            </DialogContent>
          </Drawer>
        </>
      )}
      {!open && (
        <Fab
          onClick={() => setOpen(true)}
          color="primary"
          aria-label="show details pane"
          sx={{ position: "fixed", right: 50, bottom: 30 }}
        >
          <QueryStatsIcon />
        </Fab>
      )}
      {dialogPackage && (
        <InfoDialog
          open={!!dialogPackage && dialogPackage._id !== graph?.nodes[0].id}
          onClose={() => setDialogPackage(undefined)}
          data={dialogPackage}
        />
      )}
    </>
  );
};
