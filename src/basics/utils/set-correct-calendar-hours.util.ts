import { type EventDropArg } from "@fullcalendar/core";
import { type EventResizeDoneArg } from "@fullcalendar/interaction";

export const setCorrectCalendarHours = (
  e: EventResizeDoneArg | EventDropArg,
  frame: "start" | "end"
) => {
  if (!e.event._instance) return;

  const date = new Date(e.event._instance.range[frame]);

  // Set the rounding interval (e.g., 30 minutes)
  const roundingInterval = 30;

  // Round the minutes to the nearest interval
  const roundedMinutes =
    Math.round(date.getMinutes() / roundingInterval) * roundingInterval;
  date.setMinutes(roundedMinutes);

  return date;
};
