import { Link, Stack } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";
import { useMemo } from "react";
import { Metadata } from "../../types";
import { LicenseTags } from "../LicenseTags";

export const LicenseAnalytic = ({ nodes, edges, select }: AnalyticsProps) => {
  const analytics = useMemo(() => {
    const packages = nodes.flatMap((f) => (f.license ? [f] : [])) ?? [];
    const res: Record<string, Metadata[]> = packages.reduce(function (r, a) {
      r[a.license!] = r[a.license!] || [];
      r[a.license!].push(a);
      return r;
    }, Object.create(null));
    return res;
  }, [nodes]);

  const len = Object.keys(analytics).length;

  return (
    <AccordionWrapper
      title={`Licenses (${len})`}
      defaultExpanded={len !== 0 && len < 10}
    >
      <Stack flexDirection="column" gap={1} p={1} justifyContent="center">
        {Object.entries(analytics)?.map(([license, packs]) => (
          <Stack
            key={license}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Stack>
              <Link
                target="_blank"
                href={`https://opensource.org/license/${license}`}
                color="textPrimary"
              >
                {license}
              </Link>
              <LicenseTags name={license} />
            </Stack>
            <Stack width={250} gap={1}>
              {packs.map((pack) => (
                <PackageChip
                  key={pack._id}
                  packageId={pack._id}
                  edges={edges}
                  nodes={nodes}
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
