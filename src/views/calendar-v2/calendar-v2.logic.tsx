import { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  type DatesSetArg,
  type EventClickArg,
  type EventContentArg,
  type EventDropArg,
} from "@fullcalendar/core";
import { type EventResizeDoneArg } from "@fullcalendar/interaction";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ListAltIcon from "@mui/icons-material/ListAlt";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import dayjs from "dayjs";
import { capitalize } from "lodash";
import { renderToString } from "react-dom/server";

import { formatChangedDateForCalendar } from "~/basics/utils/format-changed-date-for-calendar.util";
import { getAppModeFromPath, getLinkTo } from "~/basics/utils/mode.util";
import { calendarTimeframeBgColorGetter } from "~/basics/utils/promotion-color-getter.util";
import { setCorrectCalendarHours } from "~/basics/utils/set-correct-calendar-hours.util";
import { calendarTimeframes } from "~/views/calendar-v2/calendar-v2.mock";

import type FullCalendar from "@fullcalendar/react";
import type { ColCellContentArg } from "@fullcalendar/resource";
import type {
  CalendarEditEventTime,
  CalendarPendingChange,
  NormalizedCalendarTimeFrameGet,
  PromotionValidationResultResponse,
  SelectedCalendarEvent,
} from "~/basics/types/calendar.type";

export const useCalendarV2PageLogic = () => {
  const [isViewBySlot, setIsViewBySlot] = useState(false);
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [slotDuration, setSlotDuration] = useState("00:30:00");

  const [timeFrames, setTimeFrames] = useState<
    NormalizedCalendarTimeFrameGet[]
  >([]);
  const [pendingChanges, setPendingChanges] = useState<CalendarPendingChange[]>(
    []
  );

  const [selectedEvent, setSelectedEvent] =
    useState<SelectedCalendarEvent | null>(null);
  const [timeframeAnchorEl, setTimeframeAnchorEl] =
    useState<HTMLElement | null>(null);
  const [promotionValidationResult, setPromotionValidationResult] =
    useState<PromotionValidationResultResponse | null>(null);

  const [isEditingTimeframeTime, setIsEditingTimeframeTime] = useState(false);
  const [isOpenDuplicateUntil, setIsOpenDuplicateUntil] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refCalendar = useRef<FullCalendar | null>(null);

  const handleClose = () => {
    setTimeframeAnchorEl(null);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = timeFrames.find(
      (tf) =>
        tf.time_frame_id === clickInfo.event._def.extendedProps.time_frame_id
    );

    if (!event) return;

    const obj = {
      time_frame_id: event.time_frame_id,
      entityId: event.entityId,
      title: event.title,
      type: capitalize(event.entityType),
      start: event.start,
      end: event.end,
    };

    setTimeframeAnchorEl(clickInfo.el);
    setSelectedEvent(obj);
  };

  const handleDeleteTimeframe = (timeframeId: number) => {
    const eventIndex = timeFrames.findIndex(
      (t) => t.time_frame_id === timeframeId
    );

    setTimeFrames((prev) => {
      const timeFramesCopy = [...prev];
      timeFramesCopy[eventIndex] = {
        ...timeFramesCopy[eventIndex],
        backgroundColor: "gray",
        editable: false,
        durationEditable: false,
      };

      return timeFramesCopy;
    });

    const timeFrame = timeFrames[eventIndex];
    const changedEventIndex = pendingChanges.findIndex(
      (t) => t.timeFrameId === timeframeId
    );

    const formattedStart = formatChangedDateForCalendar(timeFrame.start);

    const formattedEnd = formatChangedDateForCalendar(timeFrame.end);

    const changedTimeFrameInfo = {
      timeFrameId: timeFrame.time_frame_id,
      entityId: timeFrame.entityId,
      title: timeFrame.title,
      whatChanged: `Removed timeframe, start: ${formattedStart}, end: ${formattedEnd}`,
      type: capitalize(timeFrame.entityType),
      slot: timeFrame.slot,
      start: timeFrame.start,
      end: timeFrame.end,
      originalEvent: timeFrame,
    };

    if (changedEventIndex === -1) {
      setPendingChanges((prev) => [...prev, changedTimeFrameInfo]);
    } else {
      setPendingChanges((prev) => {
        const arrayCopy = [...prev];
        arrayCopy[changedEventIndex] = {
          ...changedTimeFrameInfo,
          originalEvent: arrayCopy[changedEventIndex].originalEvent,
        };
        return arrayCopy;
      });
    }

    handleClose();
  };

  const handleValidatePromotion = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);

      const validationResult: PromotionValidationResultResponse = {
        id: +selectedEvent.entityId,
        message: "",
        success: true,
      };

      setPromotionValidationResult(validationResult);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }

    handleClose();
  };

  const handleDuplicateTimeframe = (timeframeId: number) => {
    const timeFrame = timeFrames.find((tf) => tf.time_frame_id === timeframeId);

    if (!timeFrame) return;

    const newId = globalThis.crypto.randomUUID();
    const newTimeframeId = globalThis.crypto.randomUUID();

    setTimeFrames((prev) => [
      ...prev,
      {
        ...timeFrame,
        backgroundColor: "gray",
        id: newId,
        time_frame_id: newTimeframeId,
      },
    ]);

    const formattedStart = formatChangedDateForCalendar(timeFrame.start);

    const formattedEnd = formatChangedDateForCalendar(timeFrame.end);

    const changedTimeFrameInfo = {
      timeFrameId: newTimeframeId,
      entityId: timeFrame.entityId,
      title: timeFrame.title,
      whatChanged: `Duplicated timeframe, start: ${formattedStart}, end: ${formattedEnd}`,
      type: capitalize(timeFrame.entityType),
      slot: timeFrame.slot,
      start: timeFrame.start,
      end: timeFrame.end,
      originalEvent: null,
    };

    setPendingChanges((prev) => [...prev, changedTimeFrameInfo]);

    handleClose();
  };

  const handleResizeOrDropEvent = (e: EventResizeDoneArg | EventDropArg) => {
    const timeFrame = timeFrames.find(
      (tf) => tf.time_frame_id === e.event._def.extendedProps.time_frame_id
    );

    if (!timeFrame || timeFrame.editable === false) return;

    const eventIndex = timeFrames.findIndex(
      (t) => t.time_frame_id === e.event._def.extendedProps.time_frame_id
    );

    const start = setCorrectCalendarHours(e, "start");
    const end = setCorrectCalendarHours(e, "end");

    if (start && end) {
      setTimeFrames((prev) => {
        const timeFramesCopy = [...prev];
        timeFramesCopy[eventIndex] = {
          ...timeFramesCopy[eventIndex],
          backgroundColor: "gray",
          start: start.toISOString().slice(0, 19),
          end: end.toISOString().slice(0, 19),
        };

        return timeFramesCopy;
      });

      const changedEventIndex = pendingChanges.findIndex(
        (t) => t.timeFrameId === e.event._def.extendedProps.time_frame_id
      );
      const pendingChange: CalendarPendingChange | undefined =
        pendingChanges[changedEventIndex];

      const formattedStart = formatChangedDateForCalendar(start);

      const formattedEnd = formatChangedDateForCalendar(end);

      const changedTimeFrameInfo = {
        timeFrameId: timeFrame.time_frame_id,
        entityId: timeFrame.entityId,
        title: timeFrame.title,
        whatChanged: `${
          pendingChange && pendingChange.whatChanged.includes("Duplicated")
            ? "Duplicated"
            : pendingChange && pendingChange.whatChanged.includes("Added")
            ? "Added"
            : "Changed"
        } timeframe, start: ${formattedStart}, end: ${formattedEnd}`,
        type: capitalize(timeFrame.entityType),
        slot: timeFrame.slot,
        start: start.toISOString(),
        end: end.toISOString(),
        originalEvent: timeFrame,
      };

      if (changedEventIndex === -1) {
        setPendingChanges((prev) => [...prev, changedTimeFrameInfo]);
      } else {
        setPendingChanges((prev) => {
          const arrayCopy = [...prev];
          arrayCopy[changedEventIndex] = {
            ...changedTimeFrameInfo,
            originalEvent: arrayCopy[changedEventIndex].originalEvent,
          };

          return arrayCopy;
        });
      }
    }
  };

  const handleEditEventTime = (obj: CalendarEditEventTime) => {
    const timeFrame = timeFrames.find(
      (tf) => tf.time_frame_id === obj.time_frame_id
    );

    if (!timeFrame || !timeFrame.editable) return;

    const eventIndex = timeFrames.findIndex(
      (t) => t.time_frame_id === obj.time_frame_id
    );

    const start = new Date(obj.start);
    const end = new Date(obj.end);

    start.setHours(start.getHours() + 2);
    end.setHours(end.getHours() + 2);

    setTimeFrames((prev) => {
      const timeFramesCopy = [...prev];
      timeFramesCopy[eventIndex] = {
        ...timeFramesCopy[eventIndex],
        backgroundColor: "gray",
        start: start.toISOString().slice(0, 19),
        end: end.toISOString().slice(0, 19),
      };

      return timeFramesCopy;
    });

    const changedEventIndex = pendingChanges.findIndex(
      (t) => t.timeFrameId === obj.time_frame_id
    );
    const pendingChange: CalendarPendingChange | undefined =
      pendingChanges[changedEventIndex];

    const formattedStart = formatChangedDateForCalendar(start);

    const formattedEnd = formatChangedDateForCalendar(end);

    const changedTimeFrameInfo = {
      timeFrameId: timeFrame.time_frame_id,
      entityId: timeFrame.entityId,
      title: timeFrame.title,
      whatChanged: `${
        pendingChange && pendingChange.whatChanged.includes("Duplicated")
          ? "Duplicated"
          : pendingChange && pendingChange.whatChanged.includes("Added")
          ? "Added"
          : "Changed"
      } timeframe, start: ${formattedStart}, end: ${formattedEnd}`,
      type: capitalize(timeFrame.entityType),
      slot: timeFrame.slot,
      start: obj.start,
      end: obj.end,
      originalEvent: timeFrame,
    };

    if (changedEventIndex === -1) {
      setPendingChanges((prev) => [...prev, changedTimeFrameInfo]);
    } else {
      setPendingChanges((prev) => {
        const arrayCopy = [...prev];
        arrayCopy[changedEventIndex] = {
          ...changedTimeFrameInfo,
          originalEvent: arrayCopy[changedEventIndex].originalEvent,
        };

        return arrayCopy;
      });
    }
  };

  const actionsWithTimeframe = [
    {
      icon: <OpenInNewIcon />,
      title: "Open in a new tab",
      isLink: true,
      to: (type: string, id: string | number) =>
        getLinkTo(
          `/${
            type === "tournament" ? "tournament_prototype" : `${type}s`
          }/${id}/view`,
          getAppModeFromPath(window.location.href)
        ),
    },
    {
      icon: <CheckCircleOutlineOutlinedIcon />,
      title: "Validate",
      isLink: false,
      to: (type: string, id: string | number) => "",
      onClick: handleValidatePromotion,
    },
    {
      icon: <ContentCopyIcon />,
      title: "Duplicate",
      isLink: false,
      to: (type: string, id: string | number) => "",
      onClick: (timeFrameId: number) => handleDuplicateTimeframe(timeFrameId),
    },
    {
      icon: <EventRepeatIcon />,
      title: "[TEST] Duplicate until",
      isLink: false,
      to: (type: string, id: string | number) => "",
      onClick: (timeFrameId: number) => setIsOpenDuplicateUntil(true),
    },
    {
      icon: <ListAltIcon />,
      title: "See all timeframes",
      isLink: true,
      to: (type: string, id: string | number) =>
        getLinkTo(
          `/${
            type === "tournament"
              ? "new_tournament_prototype"
              : `${type === "promotion" ? "promotion" : "challenges"}`
          }/schedule/${id}/view`,
          getAppModeFromPath(window.location.href)
        ),
    },
    {
      icon: <AccessAlarmIcon />,
      title: "Edit time",
      isLink: false,
      to: (type: string, id: string | number) => "",
      onClick: (timeFrameId: number) => setIsEditingTimeframeTime(true),
    },
    {
      icon: <DeleteIcon />,
      title: "Delete",
      isLink: false,
      to: (type: string, id: string | number) => "",
      onClick: (timeFrameId: number) => handleDeleteTimeframe(timeFrameId),
    },
  ];

  const renderResourceName = (data: ColCellContentArg) => {
    return data.groupValue;
  };

  const RenderEventContentComponent = (eventInfo: EventContentArg) => {
    const event = eventInfo.event;

    return (
      <b
        style={{
          textDecoration: pendingChanges
            .find(
              (change) =>
                change.timeFrameId === event._def.extendedProps.time_frame_id
            )
            ?.whatChanged.includes("Removed")
            ? "line-through"
            : "",
        }}
      >
        {/* {capitalize(event._def.extendedProps.entityType)}_ */}
        {event.title} ({event._def.extendedProps.status.toUpperCase()})
      </b>
    );
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const container = document.createElement("div");
    container.dataset.time_frame_id =
      eventInfo.event._def.extendedProps.time_frame_id;

    const render = renderToString(
      <RenderEventContentComponent {...eventInfo} />
    );

    container.innerHTML = render;

    const arrayOfDomNodes = [container];

    return { domNodes: arrayOfDomNodes };
  };

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      const formattedRes: NormalizedCalendarTimeFrameGet[] =
        calendarTimeframes.data.map((tf) => {
          const type =
            tf.entity_type === "simple" || tf.entity_type === "shop"
              ? "promotion"
              : tf.entity_type;
          const res = {
            resourceId: `${type}-${tf.title}`,
            title: `${tf.title}`,
            start: tf.start_time,
            status: tf.status,
            end: tf.end_time,
            id: tf.unique_id,
            time_frame_id: tf.timeframe_id,
            children:
              tf.children_ids && tf.children_ids.length > 0
                ? tf.children_ids
                : [],
            entityType: type,
            entityId: tf.entity_id,
            backgroundColor: calendarTimeframeBgColorGetter(tf.entity_type),
            editable: true,
            durationEditable: true,
            slot: tf.slot,
            slot_priority: tf.slot_priority,
          };
          return res;
        });

      formattedRes && setTimeFrames(formattedRes);
    }, 300);

    setIsLoading(false);

    return () => clearTimeout(timeout);
  }, [currentDate, calendarTimeframes]);

  return {
    state: {
      loading,
      isLoading,
      isViewBySlot,
      timeFrames,
      selectedEvent,
      pendingChanges,
      timeframeAnchorEl,
      slotDuration,
      refCalendar,
      actionsWithTimeframe,
      isEditingTimeframeTime,
      isOpenDuplicateUntil,
      promotionValidationResult,
    },
    setState: {
      setIsViewBySlot,
      setCurrentDate,
      setTimeFrames,
      setPendingChanges,
      setSlotDuration,
      setIsEditingTimeframeTime,
      setIsOpenDuplicateUntil,
      setPromotionValidationResult,
    },
    handlers: {
      handleClose,
      handleEventClick,
      handleDeleteTimeframe,
      handleDuplicateTimeframe,
      handleResizeOrDropEvent,
      handleEditEventTime,
      renderEventContent,
      renderResourceName,
    },
  };
};
