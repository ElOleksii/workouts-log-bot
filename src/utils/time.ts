const KYIV_TIMEZONE = "Europe/Kyiv";

export const getKyivDayBounds = (date: Date) => {
  const kyivDateStr = date.toLocaleDateString("uk-UA", {
    timeZone: KYIV_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [day, month, year] = kyivDateStr.split(".").map(Number);

  const startOfDay = new Date(
    new Date(year!, month! - 1, day!).toLocaleString("en-US", {
      timeZone: KYIV_TIMEZONE,
    }),
  );
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const formatKyivDate = (date: Date): string => {
  return date.toLocaleDateString("uk-UA", {
    timeZone: KYIV_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
