import axios from "axios";
import { GitHubUser } from "../types";
import { useEffect, useState } from "react";
import { Avatar, Tooltip } from "@mui/material";

interface Props {
  name: string;
}

const cache = new Map<string, GitHubUser>();
const getData = async (name: string) => {
  const d = cache.get(name);
  if (d) return d;

  const loaded = await axios.get<GitHubUser>(
    `https://api.github.com/users/${name}`
  );
  cache.set(name, loaded.data);
  return loaded.data;
};

export const Maintainer = ({ name }: Props) => {
  const [user, setUser] = useState<GitHubUser>();
  useEffect(() => {
    const load = async () => {
      const user = await getData(name);
      setUser(user);
    };
    load();
  }, []);

  return (
    <Tooltip title={name}>
      <Avatar
        alt={name}
        src={user?.avatar_url}
        onClick={() => window.open(user?.html_url, "_blank")}
      ></Avatar>
    </Tooltip>
  );
};
