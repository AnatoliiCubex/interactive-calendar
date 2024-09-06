export const calendarTimeframeBgColorGetter = (type: string) => {
  if (type === "challenge") {
    return "#eb3723";
  }

  if (type === "shop" || type === "simple") {
    return "#ebc623";
  }

  if (type === "push notification") {
    return "#3788d8";
  }

  if (type === "tournament") {
    return "#27c421";
  }
};
