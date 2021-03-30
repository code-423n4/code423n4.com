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

const getDates = (starttime, endtime) => {
  const now = new Date().getTime();
  const start = new Date(starttime).getTime();
  const end = new Date(endtime).getTime();

  let state;
  if (now < start) {
    state = "soon";
  }
  if (now >= start && now <= end) {
    state = "active";
  }
  if (now > end) {
    state = "completed";
  }

  const startMonth = monthNames[new Date(starttime).getMonth()];
  const startDate = new Date(starttime).getDate();
  const endMonth = monthNames[new Date(endtime).getMonth()];
  const endDate = new Date(endtime).getDate();

  const t = {
    state,
    now,
    start,
    end,
    startMonth,
    startDate,
    endMonth,
    endDate,
    startDay: `${startMonth} ${startDate}`,
    endDay: `${endMonth} ${endDate}`,
  };

  return t;
};

// const getTimeState = (t) => {
//   let timeState;
//   if (t.now < t.start) {
//     return "soon";
//   }
//   if (t.now >= t.start && t.now <= t.end) {
//     return "active";
//   }
//   if (t.now > t.end) {
//     return "completed";
//   }
// };

export { getTimeRemaining, getDates };
