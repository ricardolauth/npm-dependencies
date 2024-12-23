import { Stack } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";
import { useMemo } from "react";

export const DepracatedAnalytic = (props: AnalyticsProps) => {
  const { nodes } = props;
  const analytics = useMemo(
    () => nodes.filter((f) => f.deprecated ?? false),
    [nodes]
  );

  const len = analytics?.length ?? 0;

  return (
    <AccordionWrapper
      title={`Deprecated dependency (${len})`}
      defaultExpanded={len !== 0 && len < 10}
    >
      <Stack
        flexDirection="row"
        gap={1}
        p={1}
        flexWrap="wrap"
        overflow="hidden"
      >
        {analytics?.map((pack) => (
          <PackageChip key={pack._id} packageId={pack._id} {...props} />
        ))}
      </Stack>
    </AccordionWrapper>
  );
};
