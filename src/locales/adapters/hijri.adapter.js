function gregorianToJd(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

function jdToGregorian(jd) {
  let j = jd;
  let f = j + 1401 + Math.floor((Math.floor((4 * j + 274277) / 146097) * 3) / 4) - 38;
  let e = 4 * f + 3;
  let g = Math.floor((e % 1461) / 4);
  let h = 5 * g + 2;
  const D = Math.floor((h % 153) / 5) + 1;
  const M = ((Math.floor(h / 153) + 2) % 12) + 1;
  const Y = Math.floor(e / 1461) - 4716 + Math.floor((12 + 2 - M) / 12);
  return new Date(Y, M - 1, D);
}

function jdFromDate(date) {
  return gregorianToJd(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function islamicFromJd(jd) {
  const l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  return { iy: y, im: m, id: d };
}

function jdToIslamic(jd) {
  jd = Math.floor(jd) + 0.5;
  const days = jd - 1948439.5;
  const year = Math.floor((30 * days + 10646) / 10631);
  const firstDayOfYear = Math.floor(1948439 + 354 * (year - 1) + Math.floor((3 + 11 * year) / 30));
  const month = Math.min(12, Math.ceil((jd - firstDayOfYear + 1) / 29.5));
  const firstDayOfMonth = Math.floor(firstDayOfYear + Math.floor(29.5 * (month - 1)));
  const day = jd - firstDayOfMonth + 1;
  return { year, month, day: Math.floor(day) };
}

function islamicToJd(year, month, day) {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    1948439.5 -
    1
  );
}

// function hijriYearStartDays(year) {
//   return Math.floor((year - 1) * 354 + Math.floor((3 + 11 * year) / 30));
// }

export const HijriAdapter = {
  getToday() {
    const jd = jdFromDate(new Date());
    const i = islamicFromJd(jd);
    return {
      jy: i.iy,
      jm: i.im,
      jd: i.id,
      year: i.iy,
      month: i.im,
      day: i.id,
    };
  },

  getDaysInMonth(year, month) {
    if (month % 2 === 1) return 30;
    if (month !== 12) return 29;
    const isLeap = (11 * year + 14) % 30 < 11;
    return isLeap ? 30 : 29;
  },

  toDateObject(year, month, day) {
    const jd = islamicToJd(year, month, day);

    let g = jdToGregorian(Math.floor(jd));
    return g;
  },

  addMonths(date, months) {
    const jd = jdFromDate(date);
    const i = jdToIslamic(jd);
    let m = i.month + months;
    let y = i.year + Math.floor((m - 1) / 12);
    m = ((((m - 1) % 12) + 12) % 12) + 1;
    const d = Math.min(i.day, this.getDaysInMonth(y, m));
    return this.toDateObject(y, m, d);
  },

  addYears(date, years) {
    const jd = jdFromDate(date);
    const i = jdToIslamic(jd);
    const y = i.year + years;
    const m = i.month;
    const d = Math.min(i.day, this.getDaysInMonth(y, m));
    return this.toDateObject(y, m, d);
  },

  parse(str) {
    const [y, m, d] = String(str).split('-').map(Number);
    return this.toDateObject(y, m, d);
  },

  format(date) {
    const jd = jdFromDate(date);
    const i = islamicFromJd(jd);
    return `${i.iy}-${String(i.im).padStart(2, '0')}-${String(i.id).padStart(2, '0')}`;
  },

  getWeekday(year, month, day) {
    const jd = islamicToJd(year, month, day);
    const gregorianDate = jdToGregorian(jd);
    return (gregorianDate.getDay() + 1) % 7;
  },

  isLeapYear(year) {
    return (11 * year + 14) % 30 < 11;
  },
};
