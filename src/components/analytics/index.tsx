import { MissingPeerAnalytic } from "./MissingPeerAnalytic";
import { DepracatedAnalytic } from "./DeprecatedAnalytic";
import { SingleMaintainerAnalytic } from "./SingleMaintainerAnalytic";
import { LicenseAnalytic } from "./LicenseAnalytic";
import { Result } from "../../api";

export interface AnalyticsProps extends Result {
  select: (nodeOrEdge: string[]) => void;
}

export const Analytics = (props: AnalyticsProps) => {
  return (
    <>
      <DepracatedAnalytic {...props} />
      {/* <CycleAnalytic {...props} /> */}
      <MissingPeerAnalytic {...props} />
      <SingleMaintainerAnalytic {...props} />
      <LicenseAnalytic {...props} />
    </>
  );
};
