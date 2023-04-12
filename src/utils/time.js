import format from "date-fns-tz/format";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";

import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

const left = (total) => {
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

const getTimeRemaining = (contestTimer) => {
  const endTime =
    contestTimer.contestStatus === "active"
      ? contestTimer.end
      : contestTimer.start;
  const total = endTime - Date.now();
  if (total > 0) {
    return {
      total: total,
      days: left(total).days,
      seconds: left(total).seconds,
      minutes: left(total).minutes,
      hours: left(total).hours,
      hh: ("0" + left(total).hours).slice(-2),
      mm: ("0" + left(total).minutes).slice(-2),
      ss: ("0" + left(total).seconds).slice(-2),
    };
  } else {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hh: "00",
      mm: "00",
      ss: "00",
    };
  }
};

const getDates = (start, end) => {
  const now = Date.now();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  let contestStatus;

  switch (true) {
    case now >= startTime && now <= endTime:
      contestStatus = "active";
      break;
    case now < startTime:
      contestStatus = "soon";
      break;
    case now >= endTime:
      contestStatus = "completed";
      break;
    default:
      contestStatus = "-";
  }

  const daysDuration = differenceInCalendarDays(endDate, startDate);
  const parsedEndTime = parseISO(end);
  const parsedStartTime = parseISO(start);
  const endUtc = format(
    utcToZonedTime(parsedEndTime, "UTC"),
    "d MMMM - h:mm a zzz",
    {
      timeZone: "UTC",
    }
  );
  const startUtc = format(
    utcToZonedTime(parsedStartTime, "UTC"),
    "d MMMM - h:mm a zzz",
    {
      timeZone: "UTC",
    }
  );
  const endLocal = format(endDate, "(d MMMM - h:mm a zzz)");
  const startLocal = format(startDate, "(d MMMM - h:mm a zzz)");

  const t = {
    contestStatus,
    start: startTime,
    end: endTime,
    startDay: isValid(startDate) ? format(startDate, "d MMMM yyyy") : "",
    endDay: isValid(endDate) ? format(endDate, "d MMMM yyyy") : "",
    startTime: isValid(startDate) ? startUtc + " " + startLocal : "",
    endTime: isValid(endDate) ? endUtc + " " + endLocal : "",
    daysDuration,
  };

  return t;
};

export { getTimeRemaining, getDates };
