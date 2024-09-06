import React from "react";

import { Box, Button, Chip, TextField, Typography } from "@mui/material";

import { useHomeViewStyle } from "~/views/home-view/home-view.style";

export const HomeView = () => {
  const sx = useHomeViewStyle();

  return (
    <Box sx={sx.wrapper}>
      <Typography variant='h1'>h1</Typography>
      <Typography variant='h2'>h2</Typography>
      <Typography variant='body1'>Default</Typography>
      <Button>button</Button>
      <TextField label='Input' placeholder='add' />
    </Box>
  );
};
