import { Chip, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export interface LicenseDetail {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
  html_url: string;
  description: string;
  implementation: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
  featured: boolean;
}

const cache = new Map<string, LicenseDetail>();
const getData = async (name: string) => {
  const d = cache.get(name);
  if (d) return d;

  const loaded = await axios.get<LicenseDetail>(
    `https://api.github.com/licenses/${name}`
  );
  cache.set(name, loaded.data);
  return loaded.data;
};

interface Props {
  name: string;
}

export const LicenseTags = ({ name }: Props) => {
  const [license, setLicense] = useState<LicenseDetail>();
  useEffect(() => {
    const load = async () => {
      const user = await getData(name);
      setLicense(user);
    };
    load();
  }, []);

  if (!license) return null;

  return (
    <Stack gap={1} flexDirection="row" overflow="hidden" flexWrap="wrap">
      {license.permissions.map((per) => (
        <Chip label={per} color="success" variant="outlined" size="small" />
      ))}
      {license.limitations.map((lim) => (
        <Chip label={lim} color="warning" variant="outlined" size="small" />
      ))}
    </Stack>
  );
};
