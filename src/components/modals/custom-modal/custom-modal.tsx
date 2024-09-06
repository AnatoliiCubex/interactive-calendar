import type { PropsWithChildren } from "react";
import React from "react";

import { LoadingButton } from "@mui/lab";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { modalStyle } from "~/basics/constants/style.constant";

import type { LoadingButtonProps } from "@mui/lab";
import type { ButtonProps, ModalProps, SxProps } from "@mui/material";

type Props = ModalProps &
  PropsWithChildren & {
    additionalStyles?: SxProps;
    cancelButtonProps?: ButtonProps;
    confirmButtonProps?: LoadingButtonProps;
    hideCancelButton?: boolean;
    heading?: string;
  };

const CustomModal = (props: Props) => {
  const {
    additionalStyles = {},
    cancelButtonProps = {},
    confirmButtonProps = {},
    hideCancelButton,
    heading,
    children,
    ...modalProps
  } = props;

  const sx = {
    ...modalStyle,
    ...additionalStyles,
  } as SxProps;

  return (
    <Modal {...modalProps}>
      <Box sx={sx}>
        {heading ? (
          <Typography variant='h4' mb={5}>
            {heading}
          </Typography>
        ) : null}
        {children}

        <Box sx={{ display: "flex", gap: 6, mt: 5 }}>
          {hideCancelButton ? null : (
            <Button
              variant='contained'
              size='small'
              fullWidth
              color='error'
              {...cancelButtonProps}
            >
              {cancelButtonProps.children || "Cancel"}
            </Button>
          )}
          <LoadingButton
            variant='contained'
            size='small'
            fullWidth
            color='success'
            {...confirmButtonProps}
          >
            {confirmButtonProps.children || "Confirm"}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
