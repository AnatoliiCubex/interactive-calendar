import React from "react";

import styled from "@emotion/styled";
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import CalendarAddNewTimeframe from "./components/calendar-add-new-time-frame/calendar-add-new-time-frame";
import CalendarHeaderFilters from "./components/calendar-header-filters/calendar-header-filters";
import CalendarPendingChanges from "./components/calendar-pending-changes/calendar-pending-changes";
import { useCustomCalendarHeaderLogic } from "./custom-calendar-header.logic";

import type FullCalendar from "@fullcalendar/react";
import type {
  CalendarPendingChange,
  NormalizedCalendarTimeFrameGet,
} from "~/basics/types/calendar.type";
import type { SetState } from "~/basics/types/example.type";

const Wrapper = styled(Box)`
  background: white;
`;

type Props = {
  calendarRef: React.MutableRefObject<FullCalendar | null>;
  pendingChanges: CalendarPendingChange[];
  isViewBySlot: boolean;
  timeFrames: NormalizedCalendarTimeFrameGet[];
  slotDuration: string;
  setPendingChanges: SetState<CalendarPendingChange[]>;
  setTimeFrames: SetState<NormalizedCalendarTimeFrameGet[]>;
  setIsViewBySlot: SetState<boolean>;
  setSlotDuration: SetState<string>;
};

const CustomCalendarHeader = (props: Props) => {
  const {
    pendingChanges,
    setPendingChanges,
    isViewBySlot,
    setTimeFrames,
    slotDuration,
  } = props;

  const { data, handlers, setState, state } =
    useCustomCalendarHeaderLogic(props);

  return (
    <Wrapper
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 4,
        px: 2,
        pt: 10,
        pb: 5,
        mb: 5,
      }}
    >
      <Box
        sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}
      >
        <Button
          variant='contained'
          size='small'
          onClick={handlers.handleChangeViewToDay}
        >
          Day
        </Button>
        <Button
          variant='contained'
          size='small'
          onClick={handlers.handleChangeViewToWeek}
        >
          Week
        </Button>
        <Button
          variant='contained'
          size='small'
          onClick={handlers.handleShowNext7Days}
        >
          Next 7 days
        </Button>
        <Typography>Custom: </Typography>
        <TextField
          id='start_date'
          type='date'
          size='small'
          sx={{
            maxWidth: "125px",
          }}
          onChange={handlers.handleDateRangeChange}
        />
        -
        <TextField
          id='end_date'
          type='date'
          size='small'
          sx={{ maxWidth: "125px", svg: { color: "Highlight" } }}
          onChange={handlers.handleDateRangeChange}
        />
        |
        <FormControlLabel
          sx={{ border: "none", p: 0, mr: 2 }}
          control={
            <Switch
              checked={isViewBySlot}
              onChange={handlers.handleViewBySlot}
            />
          }
          label={<Typography color={"text.primary"}>View by slot</Typography>}
        />
        |
        <TextField
          sx={{ maxWidth: "150px" }}
          label='Cell time (00:00:00 format)'
          value={slotDuration}
          InputLabelProps={{ shrink: true }}
          onChange={handlers.handleChangeSlotDuration}
          size='small'
        />
        |
        <CalendarHeaderFilters
          anchorEl={state.anchorEl}
          setAnchorEl={setState.setAnchorEl}
        />
        |
        <CalendarAddNewTimeframe
          handleAddNewTimeframe={handlers.handleAddNewTimeframe}
        />
      </Box>
      <CalendarPendingChanges
        pendingChanges={pendingChanges}
        setPendingChanges={setPendingChanges}
        setTimeFrames={setTimeFrames}
        onRevertClick={handlers.handleShowToday}
      />
      <ButtonGroup
        color='primary'
        variant='contained'
        sx={{ display: "flex", alignItems: "center" }}
        size='small'
      >
        <Button onClick={handlers.handleShowPrev}>Prev</Button>
        <Button onClick={handlers.handleShowToday}>Today</Button>
        <Button onClick={handlers.handleShowNext}>Next</Button>
      </ButtonGroup>
    </Wrapper>
  );
};

export default CustomCalendarHeader;
