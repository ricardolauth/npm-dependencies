import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Typography } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const AccordionWrapper = (props: Props) => {
  return (
    <Accordion defaultExpanded={props.defaultExpanded}>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
};
