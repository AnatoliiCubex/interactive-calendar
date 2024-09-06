import styled from "@emotion/styled";
import { CircularProgress, type SxProps, type Theme } from "@mui/material";
import { Grid as MuiGrid } from "@mui/material";

const Grid = styled(MuiGrid)`
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Loader = ({ sx }: { sx?: SxProps<Theme> }) => {
  return (
    <Grid container sx={sx}>
      <CircularProgress />
    </Grid>
  );
};
