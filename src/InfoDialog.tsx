import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Link,
  Typography,
  AvatarGroup,
  Stack,
} from "@mui/material";
import { Package } from "./types";
import MuiMarkdown from "mui-markdown";
import { format } from "date-fns";
import { Maintainer } from "./Maintainer";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  data: Package;
}

const InfoDialog: React.FC<CustomDialogProps> = ({ open, onClose, data }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
          {data.name}
        </DialogTitle>
        <DialogContent>
          <p style={{ marginRight: "5px" }}>
            <strong>Description:</strong>
            {data.description}
          </p>
          <p style={{ marginRight: "5px" }}>
            <strong>License:</strong> {data.license}
          </p>

          <p style={{ marginRight: "5px" }}>
            <strong>Latest:</strong>
            {data["dist-tags"].latest}
          </p>

          <p style={{ marginRight: "5px" }}>
            <strong>Last Updated:</strong>
            {format(new Date(data.time.modified), "dd.MM.yyyy")}
          </p>
          <p style={{ marginRight: "5px" }}>
            <strong>Homepage:</strong>{" "}
            <Link target="_blank" href={data.homepage}>
              {data.homepage}
            </Link>
          </p>
          <p style={{ marginRight: "5px" }}>
            <strong>Repository:</strong>{" "}
            <Link
              target="_blank"
              href={data.repository.url.replace(data.repository.type + "+", "")}
            >
              {data.repository.url.replace(data.repository.type + "+", "")}
            </Link>
          </p>
          <span style={{ fontWeight: "bold", marginRight: "5px" }}>
            Maintainer:{" "}
          </span>
          <Stack width="100%" alignItems="flex-start">
            <AvatarGroup max={10}>
              {data.maintainers.map((maintainer, index) => (
                // <span key={index}>
                //   {maintainer.name}
                //   {index < data.maintainers.length - 1 && ", "}
                // </span>
                <Maintainer key={maintainer.email} name={maintainer.name} />
              ))}
            </AvatarGroup>
          </Stack>

          <p style={{ marginRight: "5px" }}>
            <strong>Readme:</strong>
            <MuiMarkdown>{data.readme}</MuiMarkdown>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InfoDialog;
