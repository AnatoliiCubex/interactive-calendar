import React, { useEffect, useState } from "react";

import { Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { modalStyle } from "~/basics/constants/style.constant";

import type { SelectedCalendarEvent } from "~/basics/types/calendar.type";
import type { SetState } from "~/basics/types/example.type";

type Props = {
  isOpen: boolean;
  setIsOpen: SetState<boolean>;
  selectedEvent: SelectedCalendarEvent | null;
};

const DuplicateTimeframeUntil = (props: Props) => {
  const { isOpen, setIsOpen, selectedEvent } = props;

  const [endDate, setEndDate] = useState("");
  const [gap, setGap] = useState(0);
  const [numberOfOccurrences, setNumberOfOccurrences] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
    setEndDate("");
    setGap(0);
    setNumberOfOccurrences(0);
  };

  useEffect(() => {
    if (!endDate || !gap || !selectedEvent) return;

    const calculateOccurrences = () => {
      const startDateTime = new Date(selectedEvent.start);
      const endDateTime = new Date(selectedEvent.end);
      const duplicateUntil = new Date(endDate);

      const differenceInMinutes =
        ((startDateTime.getTime() - endDateTime.getTime()) / 60000) * -1;
      let occurrences = 0;

      while (endDateTime <= duplicateUntil) {
        const nextOccurrenceTime =
          endDateTime.getTime() + differenceInMinutes + gap * 60000;
        if (nextOccurrenceTime <= duplicateUntil.getTime()) {
          occurrences++;
          endDateTime.setTime(nextOccurrenceTime);
        }
      }

      setNumberOfOccurrences(occurrences);
    };

    calculateOccurrences();
  }, [endDate, gap]);

  if (!selectedEvent) return null;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          ...modalStyle,
          maxWidth: "550px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 5 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={dayjs.utc(endDate)}
              onChange={(newValue) => {
                if (!newValue) return null;
                try {
                  setEndDate(newValue.toISOString().slice(0, 19));
                } catch (error) {
                  /* empty */
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size='small'
                  label={<Typography fontSize={16}>End (UTC)</Typography>}
                  error={false}
                  InputLabelProps={{ shrink: true }}
                  variant='standard'
                />
              )}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            placeholder='enter integer'
            label={
              <Typography fontSize={16}>
                Gap between timeframes (in minutes)
              </Typography>
            }
            type='number'
            size='small'
            value={gap || ""}
            InputLabelProps={{ shrink: true }}
            variant='standard'
            onChange={(e) => setGap(+e.target.value)}
          />
        </Box>

        <Typography>
          Number of occurrences that will be added: {numberOfOccurrences}
        </Typography>
      </Box>
    </Modal>
  );
};

export default DuplicateTimeframeUntil;
