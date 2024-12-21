import { Dropzone } from "@files-ui/react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { GraphPageState } from "./App";
import { getSuggestions } from "../api";
import { SearchObj } from "../types";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  set: (state: GraphPageState) => void;
}

export const LandingPage = ({ set }: Props) => {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<SearchObj[]>([]);
  const loadSuggestions = useDebouncedCallback(async (v: string) => {
    const suggestions = await getSuggestions(v);
    setOptions(suggestions);
  }, 1000);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && text !== "") {
      set({ type: "package", name: text });
    }
  };

  const handleChange = async (v: string) => {
    setText(v);
    await loadSuggestions(v);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Stack gap={1} alignItems="center">
        <Typography variant="h1">Dependalyzer</Typography>
        <div style={{ height: 20 }} />
        <Stack flexDirection="row" width={400} gap={1}>
          <Autocomplete
            freeSolo
            fullWidth
            value={text}
            onChange={(_, v) => handleChange(v as string)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="react@18.0.0"
                onChange={(e) => handleChange(e.currentTarget.value)}
              />
            )}
            onKeyDown={handleKey}
            options={options.map((o) => `${o.package.name}`)}
          />
          <Tooltip title="Press STRG + Enter">
            <Button
              variant="outlined"
              onClick={() => set({ type: "package", name: text })}
            >
              Submit
            </Button>
          </Tooltip>
        </Stack>

        <Box width={400} height={400}>
          <Dropzone
            value={[]}
            label="Upload package.json"
            onChange={(newFiles) => set({ type: "file", file: newFiles[0] })}
            accept=".json"
            maxFiles={1}
          />{" "}
        </Box>
      </Stack>
    </Container>
  );
};
