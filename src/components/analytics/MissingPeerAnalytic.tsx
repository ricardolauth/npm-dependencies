import { Divider, Stack, Typography } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";
import { maxSatisfying } from "semver";
import { packNameVerFromId } from "../../utils";
import { useMemo } from "react";

export const MissingPeerAnalytic = ({
  graph,
  result,
  select,
}: AnalyticsProps) => {
  const isVersionAvailable = (versionString: string, versions: string[]) => {
    if (versionString === "latest") versionString = "*";
    const version = maxSatisfying(versions, versionString, true);

    return !!version;
  };

  const missingPeerDependency = () => {
    const missingDeps = new Map<string, string[]>();
    const depsWithPeer = result?.flat.filter((dep) => !!dep.peerDependencies);
    for (const pack of depsWithPeer ?? []) {
      const parents =
        graph?.edges
          .filter((p) => p.id.endsWith(pack._id))
          .map((p) => p.id.split("->")[0]) ?? [];

      for (const parent of parents) {
        const siblingsOfPeerPack =
          graph?.edges
            .filter((c) => c.id.startsWith(parent))
            .map((c) => c.id.split("->")[1])
            .map((c) => packNameVerFromId(c)) ?? [];

        for (const [name, range] of Object.entries(
          pack.peerDependencies ?? {}
        )) {
          const availableVersions = siblingsOfPeerPack
            .filter((s) => s.name === name)
            .flatMap((s) => (s.version ? [s.version] : [])); // remove undefined values
          if (!isVersionAvailable(range, availableVersions)) {
            const prev = missingDeps.get(pack._id) ?? [];
            missingDeps.set(pack._id, [...prev, `${name}@${range}`]);
          }
        }
      }
    }
    console.log(missingDeps);
    return [...missingDeps.entries()];
  };

  const analytics = useMemo(() => missingPeerDependency(), [result, graph]);

  const len = analytics.length;

  return (
    <AccordionWrapper
      title={`Missing peer dependency (${len})`}
      defaultExpanded={len !== 0 && len < 10}
    >
      <Stack gap={1} p={1}>
        {analytics?.map(([pack, missing], idx) => (
          <Stack key={pack} pt={idx == 0 ? 0 : 1} gap={1}>
            <PackageChip packageId={pack} graph={graph} select={select} />
            <Typography>is missing:</Typography>
            {missing.map((m) => (
              <Typography pl={2}>{m}</Typography>
            ))}
            {idx !== analytics.length - 1 && <Divider />}
          </Stack>
        ))}
      </Stack>
    </AccordionWrapper>
  );
};
