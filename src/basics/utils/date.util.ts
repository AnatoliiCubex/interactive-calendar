export const formatTimeFrameForCalendarPublish = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};

export const formatSelectedCalendarTimeframe = (
  dateString?: string | Date
): string => {
  if (!dateString) return "";
  const date = new Date(dateString);

  let hours: string | number = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;

  let minutes: string | number = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const startTime = hours + ":" + minutes;
  // + ':00';

  return `${date.getDate()}/${
    1 + date.getMonth()
  }/${date.getFullYear()} ${startTime}`;
};
