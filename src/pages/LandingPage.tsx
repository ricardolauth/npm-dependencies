import { Dropzone, ExtFile } from "@files-ui/react";
import { Box } from "@mui/material";
import { useState } from "react";
import { GraphPageState } from "./App";

interface Props {
  set: (state: GraphPageState) => void;
}

export const LandingPage = ({ set }: Props) => {
  return (
    <Box width={200} height={200}>
      <Dropzone
        value={[]}
        onChange={(newFiles) => set({ type: "file", file: newFiles[0] })}
        accept="package.json"
        maxFiles={1}
      />{" "}
    </Box>
  );
};
