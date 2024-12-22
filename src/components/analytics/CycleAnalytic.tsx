import { Stack } from "@mui/material";
import { Paper } from "@mui/material";
import { PackageChip } from "../PackageChip";
import { AnalyticsProps } from ".";
import { AccordionWrapper } from "../AccordionWrapper";

export const CycleAnalytic = ({ result, select }: AnalyticsProps) => {
  const handleShowCycle = (cycle: string[]) => {
    const result: string[] = [];
    for (let i = 0; i < cycle.length; i++) {
      const edge = `${cycle[i]}->${cycle[i + 1]}`;
      result.push(edge);
    }

    result.push(`${cycle[cycle.length - 1]}->${cycle[0]}`);
    select(result);
  };

  const len = result?.cycles.length ?? 0;

  return (
    <AccordionWrapper
      title={`Cyclic dependencies (${len})`}
      defaultExpanded={len !== 0 && len < 10}
    >
      <Stack gap={2}>
        {result?.cycles.map((cycle) => (
          <Paper
            elevation={2}
            onClick={() => handleShowCycle(cycle)}
            sx={{
              display: "flex",
              flexDirection: "row",
              p: 1,
              gap: 1,
              overflow: "hidden",
              flexWrap: "wrap",
              "&:hover": {
                boxShadow: 5,
              },
            }}
          >
            {cycle.map((packageId) => (
              <PackageChip packageId={packageId} select={select} />
            ))}
          </Paper>
        ))}
      </Stack>
    </AccordionWrapper>
  );
};
