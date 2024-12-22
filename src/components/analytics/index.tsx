import { GraphInfo } from "../../pages/GraphPage";
import { CycleAnalytic } from "./CycleAnalytic";
import { MissingPeerAnalytic } from "./MissingPeerAnalytic";
import { DepracatedAnalytic } from "./DeprecatedAnalytic";
import { SingleMaintainerAnalytic } from "./SingleMaintainerAnalytic";

export interface AnalyticsProps extends GraphInfo {
  select: (nodeOrEdge: string[]) => void;
}

export const Analytics = (props: AnalyticsProps) => {
  return (
    <>
      <DepracatedAnalytic {...props} />
      <CycleAnalytic {...props} />
      <MissingPeerAnalytic {...props} />
      <SingleMaintainerAnalytic {...props} />
    </>
  );
};
