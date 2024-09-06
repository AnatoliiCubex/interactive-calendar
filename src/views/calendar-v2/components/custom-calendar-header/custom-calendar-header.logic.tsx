import type React from "react";
import { useEffect, useState } from "react";

import { capitalize } from "@mui/material";

import { formatChangedDateForCalendar } from "../../../../basics/utils/format-changed-date-for-calendar.util";

import type FullCalendar from "@fullcalendar/react";
import type {
  CalendarPendingChange,
  NormalizedCalendarTimeFrameGet,
} from "~/basics/types/calendar.type";

type Props = {
  calendarRef: React.MutableRefObject<FullCalendar | null>;
  pendingChanges: CalendarPendingChange[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<CalendarPendingChange[]>
  >;
  isViewBySlot: boolean;
  setIsViewBySlot: React.Dispatch<React.SetStateAction<boolean>>;
  timeFrames: NormalizedCalendarTimeFrameGet[];
  setTimeFrames: React.Dispatch<
    React.SetStateAction<NormalizedCalendarTimeFrameGet[]>
  >;
  slotDuration: string;
  setSlotDuration: React.Dispatch<React.SetStateAction<string>>;
};

export const useCustomCalendarHeaderLogic = (props: Props) => {
  const {
    calendarRef,
    setPendingChanges,
    setIsViewBySlot,
    timeFrames,
    setTimeFrames,
    setSlotDuration,
  } = props;

  const [newTimeframeId, setNewTimeframeId] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const ref = calendarRef.current!.getApi();

  const handleShowNext = () => {
    setPendingChanges([]);
    ref.next();
  };

  const handleShowPrev = () => {
    setPendingChanges([]);
    ref.prev();
  };

  const handleShowToday = () => {
    setPendingChanges([]);
    ref.today();
  };

  const handleChangeViewToDay = () => {
    setPendingChanges([]);
    ref.changeView("resourceTimelineDay");
  };

  const handleChangeViewToWeek = () => {
    setPendingChanges([]);
    ref.changeView("resourceTimelineWeek");
  };

  const handleShowNext7Days = () => {
    setPendingChanges([]);
    ref.changeView("resourceTimeline");

    // Calculate the end date for the next 7 days
    const today = new Date();
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 8);

    // Set the visible range to the next 7 days
    ref.setOption("visibleRange", {
      start: today.toISOString().slice(0, 10),
      end: next7Days.toISOString().slice(0, 10),
    });
    setSlotDuration("10:00:00");
  };

  const handleDateRangeChange = () => {
    setPendingChanges([]);
    ref.changeView("resourceTimeline");

    const startDate = (
      document.getElementById("start_date") as HTMLInputElement
    ).value;
    const endDate = (document.getElementById("end_date") as HTMLInputElement)
      .value;

    if (startDate && endDate) {
      ref.setOption("visibleRange", {
        start: startDate,
        end: endDate,
      });
    }

    // ref.gotoDate(startDate);
  };

  const handleAddNewTimeframe = (
    newTimeFrame: NormalizedCalendarTimeFrameGet
  ) => {
    const formattedStart = formatChangedDateForCalendar(newTimeFrame.start);
    const formattedEnd = formatChangedDateForCalendar(newTimeFrame.end);

    const newTimeFrameInfo = {
      timeFrameId: newTimeFrame.time_frame_id,
      entityId: newTimeFrame.entityId,
      title: newTimeFrame.title,
      whatChanged: `Added timeframe, start: ${formattedStart}, end: ${formattedEnd}`,
      type: capitalize(newTimeFrame.entityType),
      slot: newTimeFrame.slot,
      start: newTimeFrame.start,
      end: newTimeFrame.end,
      originalEvent: null,
    };

    setPendingChanges((prev) => [...prev, newTimeFrameInfo]);

    setNewTimeframeId(newTimeFrame.time_frame_id as string);
    setTimeFrames((prev) => [
      ...prev,
      {
        ...newTimeFrame,
        start: new Date(newTimeFrame.start).toISOString().slice(0, 19),
        end: new Date(newTimeFrame.end).toISOString().slice(0, 19),
      },
    ]);
  };

  const handleViewBySlot = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setIsViewBySlot(checked);
    if (checked) {
      // updateSearchParams({ "view-by-slot": true });
    } else {
      // updateSearchParams({}, ["view-by-slot"]);
    }
  };

  const handleChangeSlotDuration = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSlotDuration(e.target.value);
    // updateSearchParams({ "cell-time": e.target.value }, []);
  };

  useEffect(() => {
    if (
      !newTimeframeId ||
      !timeFrames.find((tf) => tf.time_frame_id === newTimeframeId)
    )
      return;

    const element = document.querySelector(
      `[data-time_frame_id="${newTimeframeId}"]`
    );

    if (element) {
      element.scrollIntoView();
      setNewTimeframeId("");
    }
  }, [newTimeframeId]);

  return {
    data: {},
    state: { anchorEl },
    setState: { setAnchorEl },
    handlers: {
      handleChangeViewToDay,
      handleChangeViewToWeek,
      handleShowNext7Days,
      handleDateRangeChange,
      handleViewBySlot,
      handleChangeSlotDuration,
      handleAddNewTimeframe,
      handleShowToday,
      handleShowPrev,
      handleShowNext,
    },
  };
};
