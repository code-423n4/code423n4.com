const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const left = (total) => {
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

const getTimeRemaining = (endtime) => {
  const total = Date.parse(endtime) - Date.parse(new Date());
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

// gracePeriod is just is tested for existing; it doesn't use the value.
const getDates = (starttime, endtime, gracePeriod) => {
  const now = new Date().getTime();
  const start = new Date(starttime).getTime();
  const end = new Date(endtime).getTime();

  let state;
  if (now >= start && now <= end) {
    state = "active";
  }
  if (now < start) {
    state = "soon";
  }
  if (now > end) {
    state = "completed";
  }

  let graceAmount = 0;
  if (gracePeriod) {
    graceAmount = 1000 * 60 * 60 * 50; // 8 hours in milliseconds
  }
  let inGracePeriod = now >= start && now - graceAmount <= end; // true or false

  const startMonth = monthNames[new Date(starttime).getMonth()];
  const startYear = new Date(starttime).getFullYear();
  const startDate = new Date(starttime).getDate();
  const endMonth = monthNames[new Date(endtime).getMonth()];
  const endYear = new Date(endtime).getFullYear();
  const endDate = new Date(endtime).getDate();
  const daysDuration = Math.round(
    ((((((((end - start) * 1) / 1000) * 1) / 60) * 1) / 60) * 1) / 24
  );

  const t = {
    state,
    now,
    start,
    end,
    inGracePeriod,
    startMonth,
    startDate,
    endMonth,
    endDate,
    startDay: `${startMonth} ${startDate}`,
    endDay: `${endMonth} ${endDate}`,
    startYear,
    endYear,
    daysDuration,
  };

  return t;
};

export { getTimeRemaining, getDates };
