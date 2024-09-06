import { Button, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { modalStyle } from "~/basics/constants/style.constant";

import { useEditTimeframeTimeLogic } from "./edit-timeframe-time.logic";

import type {
  CalendarEditEventTime,
  SelectedCalendarEvent,
} from "~/basics/types/calendar.type";

type Props = {
  isEditingTimeframeTime: boolean;
  setIsEditingTimeframeTime: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: SelectedCalendarEvent | null;
  handleEditEventTime: (obj: CalendarEditEventTime) => void;
};

const EditTimeframeTime = (props: Props) => {
  const { isEditingTimeframeTime, setIsEditingTimeframeTime } = props;

  const { handlers, state } = useEditTimeframeTimeLogic(props);

  return (
    <Modal
      open={isEditingTimeframeTime}
      onClose={() => setIsEditingTimeframeTime(false)}
    >
      <Box
        sx={{
          ...modalStyle,
          maxWidth: "450px",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={dayjs.utc(state.fields.start)}
              onChange={(newValue) => {
                if (!newValue) return null;
                try {
                  handlers.handleChangeFields("start", newValue.toISOString());
                } catch (error) {
                  /* empty */
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  label='Start (UTC)'
                  InputLabelProps={{ shrink: true }}
                  error={false}
                  variant='standard'
                />
              )}
            />
            <DateTimePicker
              value={dayjs.utc(state.fields.end)}
              onChange={(newValue) => {
                if (!newValue) return null;
                try {
                  handlers.handleChangeFields("end", newValue.toISOString());
                } catch (error) {
                  /* empty */
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  label='End (UTC)'
                  InputLabelProps={{ shrink: true }}
                  error={false}
                  variant='standard'
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ display: "flex", gap: 5, mt: 8 }}>
          <Button
            fullWidth
            variant='contained'
            size='small'
            color='error'
            onClick={() => setIsEditingTimeframeTime(false)}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant='contained'
            size='small'
            onClick={handlers.handleConfirmChange}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTimeframeTime;
