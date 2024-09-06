import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";

import { modalStyle } from "~/basics/constants/style.constant";
import { UtcDateTimePicker } from "~/components/common/utc-date-time-picker/utc-date-time-picker";

import { useCalendarAddNewTimeFrameLogic } from "./calendar-add-new-time-frame.logic";

import type { NormalizedCalendarTimeFrameGet } from "~/basics/types/calendar.type";

dayjs.extend(utc);

const types = ["promotion", "challenge", "tournament"];

type Props = {
  handleAddNewTimeframe: (newTimeFrame: NormalizedCalendarTimeFrameGet) => void;
};

const CalendarAddNewTimeframe = ({ handleAddNewTimeframe }: Props) => {
  const { handlers, setState, state } = useCalendarAddNewTimeFrameLogic({
    handleAddNewTimeframe,
  });

  return (
    <>
      <Button
        variant='contained'
        size='small'
        color='success'
        onClick={() => setState.setIsOpenModal(true)}
      >
        Add new timeframes
      </Button>

      <Modal open={state.isOpenModal} onClose={handlers.handleClose}>
        <Box
          sx={{
            ...modalStyle,
            width: "100%",
            maxWidth: "550px",
            textAlign: "center",
          }}
        >
          <Typography variant='h4' color={"text.primary"}>
            Add new timeframes to Calendar
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              my: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 5,
                flexWrap: "wrap",
              }}
            >
              <UtcDateTimePicker
                sx={{ width: "100%" }}
                value={state.fields.start}
                label={"Start (UTC)"}
                onChange={(value) =>
                  handlers.handleChangeFields("start", value)
                }
              />
              <UtcDateTimePicker
                sx={{ width: "100%" }}
                value={state.fields.end}
                label={"End (UTC)"}
                onChange={(value) => handlers.handleChangeFields("end", value)}
              />
            </Box>

            <FormControl size='small' variant='standard'>
              <InputLabel>Select entity type</InputLabel>
              <Select
                sx={{ textAlign: "left" }}
                size='small'
                variant='standard'
                value={state.fields.type}
                label='Select entity type'
                onChange={(e) =>
                  handlers.handleChangeFields("type", e.target.value as string)
                }
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size='small'
              sx={{
                mb: 3,
              }}
            >
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                disableCloseOnSelect
                loading={state.isLoadingOptions}
                onChange={(e, newValue) => {
                  if (!newValue) return;
                  setState.setSelectedEntities((prev) => [...prev, newValue]);
                }}
                inputValue={state.searchString}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason !== "input") return;
                  setState.setSearchString(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Search entity by keyword'
                    variant='standard'
                  />
                )}
                options={state.searchOptions
                  .filter((entity) => !entity.title!.includes("Child-"))
                  .map((option, i) => ({
                    ...option,
                    label: `${i + 1}. ${option.title}`,
                  }))}
              />
            </FormControl>
            {state.selectedEntities.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                  gap: 1,
                  maxHeight: "250px",
                  overflow: "auto",
                }}
              >
                {state.selectedEntities.map((entity, index) => (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    key={index}
                  >
                    <Typography>
                      {index + 1}. {entity.title} (ID: {entity.id})
                    </Typography>

                    <IconButton
                      onClick={() =>
                        setState.setSelectedEntities((prev) =>
                          prev.filter((entity, idx) => index !== idx)
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
          <LoadingButton
            variant='contained'
            fullWidth
            // loading={isLoadingOptions}
            disabled={
              !state.selectedEntities ||
              Object.values(state.fields).some((val) => !val)
            }
            onClick={handlers.handleConfirmClick}
          >
            Confirm
          </LoadingButton>
        </Box>
      </Modal>
    </>
  );
};

export default CalendarAddNewTimeframe;
