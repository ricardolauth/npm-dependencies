import { Chip } from "@mui/material";
import { AnalyticsProps } from "./analytics";

export const PackageChip = ({
  edges,
  select,
  packageId,
}: AnalyticsProps & { packageId: string }) => {
  return (
    <Chip
      label={packageId}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        select([
          packageId,
          ...(edges.filter((e) => e.startsWith(packageId)) ?? []),
        ]);
      }}
      clickable
    />
  );
};
