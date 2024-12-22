import { Routes, Route, Navigate, useNavigate } from "react-router";
import { LandingPage } from "./LandingPage";
import { GraphPage } from "./GraphPage";
import { ExtFile } from "@files-ui/react";
import { useState } from "react";
import NotFoundPage from "./NotFoundPage";
type File = {
  type: "file";
  file: ExtFile;
};

type Package = {
  type: "package";
  name: string;
};

export type GraphPageState = File | Package;

function App() {
  const navigate = useNavigate();
  const [graphPageState, setGraphPageState] = useState<GraphPageState>();

  const handleSetGraphState = (state: GraphPageState) => {
    setGraphPageState(state);
    navigate("/graph");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage set={handleSetGraphState} />} />
      <Route
        path="/graph"
        element={
          <>
            {graphPageState && <GraphPage graphPageState={graphPageState} />}
            {!graphPageState && <Navigate to="/" />}
          </>
        }
      />
      <Route path="/404" Component={NotFoundPage}></Route>
    </Routes>
  );
}

export default App;
