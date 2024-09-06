export const formatChangedDateForCalendar = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "UTC",
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};
