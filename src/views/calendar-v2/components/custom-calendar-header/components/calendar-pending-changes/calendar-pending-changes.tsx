import React from "react";

import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Typography,
} from "@mui/material";

import { useCalendarPenginChangesLogic } from "./calendar-pending-changes.logic";

import type {
  CalendarPendingChange,
  NormalizedCalendarTimeFrameGet,
} from "~/basics/types/calendar.type";

const MenuItem = styled(MuiMenuItem)`
  display: flex;
  background: white;
  padding: 4px;
  gap: 8px;
  justify-content: space-between;
  border-radius: 5px;
  align-items: center;

  &:hover {
    background: white;
    cursor: default;
  }
`;

type Props = {
  pendingChanges: CalendarPendingChange[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<CalendarPendingChange[]>
  >;
  setTimeFrames: React.Dispatch<
    React.SetStateAction<NormalizedCalendarTimeFrameGet[]>
  >;
  onRevertClick: () => void;
};

const CalendarPendingChanges = (props: Props) => {
  const { pendingChanges, setPendingChanges, setTimeFrames, onRevertClick } =
    props;

  const { data, handlers, setState, state } =
    useCalendarPenginChangesLogic(props);

  return (
    <>
      {/* <AreYouSureModal
        open={state.isOpenConfirmation}
        setOpen={setState.setIsOpenConfirmation}
        onAgreeClick={
          state.confirmationText.includes("revert")
            ? handlers.handleRevertClick
            : handlers.handlePublishClick
        }
        text={state.confirmationText}
      /> */}
      <Button
        color='warning'
        variant='contained'
        id='pending-changes-button'
        aria-controls={data.open ? "pending-changes-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={data.open ? "true" : undefined}
        onClick={handlers.handleClick}
        disabled={data.changesCounter === 0}
        size='small'
      >
        {data.changesCounter} pending changes
      </Button>

      <Menu
        id='pending-changes-menu'
        anchorEl={state.anchorEl}
        open={data.open}
        onClose={handlers.handleClose}
        PaperProps={{
          style: { borderRadius: "11px", border: "1px solid gray" },
        }}
        MenuListProps={{
          "aria-labelledby": "pending-changes-button",
          disableListWrap: true,
          sx: {
            py: 4,
            px: 3,

            gap: 4,
            display: "flex",
            flexDirection: "column",
          },
        }}
        transformOrigin={{
          vertical: "top",

          horizontal: "center",
        }}
      >
        {pendingChanges.map((change, index) => (
          <MenuItem key={change.timeFrameId}>
            <Typography>{index + 1}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Typography fontWeight={"bold"}>{change.title}</Typography>
              <Typography>{change.whatChanged}</Typography>
              <Typography variant='caption'>
                {change.type.toUpperCase()} | {change.slot || "No slot"} |
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() =>
                  handlers.handleScrollToTimeframe(
                    change.timeFrameId.toString()
                  )
                }
              >
                <RemoveRedEyeOutlinedIcon
                  fontSize='small'
                  sx={{ cursor: "pointer" }}
                />
              </IconButton>
              <IconButton
                onClick={() =>
                  handlers.handleDeletePendingChange(change.timeFrameId)
                }
              >
                <DeleteIcon fontSize='small' sx={{ cursor: "pointer" }} />
              </IconButton>
            </Box>
          </MenuItem>
        ))}
        <Box>
          <LoadingButton
            variant='contained'
            color='success'
            size='small'
            // disabled={window.location.href.includes('prod')}
            loading={state.isPublishing}
            sx={{ mr: 3 }}
            onClick={() => {
              setState.setIsOpenConfirmation(true);
              setState.setConfirmationText(
                "Are you sure you want to publish all changes?"
              );
            }}
          >
            Publish All ({data.changesCounter})
          </LoadingButton>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              setState.setIsOpenConfirmation(true);
              setState.setConfirmationText(
                "Are you sure you want to revert all changes?"
              );
            }}
            size='small'
          >
            Revert all
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CalendarPendingChanges;
