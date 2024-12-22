import { GraphInfo } from "../../pages/GraphPage";
import { CycleAnalytic } from "./CycleAnalytic";
import { MissingPeerAnalytic } from "./MissingPeerAnalytic";
import { DepracatedAnalytic } from "./DeprecatedAnalytic";

export interface AnalyticsProps extends GraphInfo {
  select: (nodeOrEdge: string[]) => void;
}

export const Analytics = (props: AnalyticsProps) => {
  return (
    <>
      <DepracatedAnalytic {...props} />
      <CycleAnalytic {...props} />
      <MissingPeerAnalytic {...props} />
    </>
  );
};
