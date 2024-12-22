import { Stack } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";
import { useMemo } from "react";

export const DepracatedAnalytic = ({
  graph,
  result,
  select,
}: AnalyticsProps) => {
  const analytics = useMemo(
    () => result?.flat.filter((f) => f.deprecated ?? false),
    [result]
  );

  return (
    <>
      {analytics && analytics.length > 0 && (
        <AccordionWrapper title="Deprecated Dependency">
          <Stack flexDirection="row" gap={1} p={1}>
            {analytics?.map((pack) => (
              <PackageChip
                key={pack._id}
                packageId={pack._id}
                graph={graph}
                select={select}
              />
            ))}
          </Stack>
        </AccordionWrapper>
      )}
    </>
  );
};
