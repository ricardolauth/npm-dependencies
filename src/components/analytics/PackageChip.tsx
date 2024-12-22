import { Chip } from "@mui/material";
import { AnalyticsProps } from "./GraphAnalytics";

export const PackageChip = ({
  graph,
  select,
  packageId,
}: Pick<AnalyticsProps, "select" | "graph"> & { packageId: string }) => {
  return (
    <Chip
      label={packageId}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        select([
          packageId,
          ...(graph?.edges
            .filter((e) => e.id.startsWith(packageId))
            .map((e) => e.id) ?? []),
        ]);
      }}
      clickable
    />
  );
};
