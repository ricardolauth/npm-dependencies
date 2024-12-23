import { Stack } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";
import { useMemo } from "react";
import { Metadata } from "../../types";
import { Maintainer } from "../Maintainer";

export const SingleMaintainerAnalytic = ({
  nodes,
  edges,
  select,
}: AnalyticsProps) => {
  const analytics = useMemo(() => {
    const packages = nodes.filter((f) => f.maintainers?.length === 1) ?? [];
    const res: Record<string, Metadata[]> = packages.reduce(function (r, a) {
      r[a.maintainers![0].name] = r[a.maintainers![0].name] || [];
      r[a.maintainers![0].name].push(a);
      return r;
    }, Object.create(null));
    return res;
  }, [nodes]);

  const len = Object.keys(analytics).length;

  return (
    <AccordionWrapper
      title={`Dependency with only one maintainer (${len})`}
      defaultExpanded={len !== 0 && len < 10}
    >
      <Stack flexDirection="column" gap={1} p={1} justifyContent="center">
        {Object.entries(analytics)?.map(([name, packs]) => (
          <Stack key={name} flexDirection="row" justifyContent="space-between">
            <Maintainer name={name} />
            <Stack width={250} gap={1}>
              {packs.map((pack) => (
                <PackageChip
                  key={pack._id}
                  packageId={pack._id}
                  nodes={nodes}
                  edges={edges}
                  select={select}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </AccordionWrapper>
  );
};
