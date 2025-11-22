function div(a, b) {
  return Math.floor(a / b);
}

function mod(a, b) {
  return a - Math.floor(a / b) * b;
}

export function toJalaali(gy, gm, gd) {
  if (gy instanceof Date) {
    gd = gy.getDate();
    gm = gy.getMonth() + 1;
    gy = gy.getFullYear();
  }

  let jy, jm, jd, days;

  gy = parseInt(gy);
  gm = parseInt(gm);
  gd = parseInt(gd);

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  if (gm > 2) {
    days =
      365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400) - 80 + gd + g_d_m[gm - 1];
  } else {
    days =
      365 * gy +
      div(gy + 3, 4) -
      div(gy + 99, 100) +
      div(gy + 399, 400) -
      80 +
      gd +
      g_d_m[gm - 1] -
      1;
  }

  jy += 33 * div(days, 12053);
  days = mod(days, 12053);

  jy += 4 * div(days, 1461);
  days = mod(days, 1461);

  if (days > 365) {
    jy += div(days - 1, 365);
    days = mod(days - 1, 365);
  }

  if (days < 186) {
    jm = 1 + div(days, 31);
    jd = 1 + mod(days, 31);
  } else {
    jm = 7 + div(days - 186, 30);
    jd = 1 + mod(days - 186, 30);
  }

  return { jy, jm, jd };
}

export function toGregorian(jy, jm, jd) {
  jy = parseInt(jy);
  jm = parseInt(jm);
  jd = parseInt(jd);

  let gy, gm, gd_temp, days;

  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }

  if (jm < 7) {
    days = (jm - 1) * 31;
  } else {
    days = (jm - 7) * 30 + 186;
  }

  days += 365 * jy + div(jy, 33) * 8 + div(mod(jy, 33) + 3, 4) + 78 + jd;

  gy += 400 * div(days, 146097);
  days = mod(days, 146097);

  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * div(days, 36524);
    days = mod(days, 36524);

    if (days >= 365) {
      days++;
    } else {
      leap = false;
    }
  }

  gy += 4 * div(days, 1461);
  days = mod(days, 1461);

  if (days >= 366) {
    leap = false;

    days--;
    gy += div(days, 365);
    days = mod(days, 365);
  }

  const g_d_m = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let i;

  for (i = 0; g_d_m[i + 1] <= days; i++) {
    days -= g_d_m[i + 1];
  }

  gm = i + 1;
  gd_temp = days + 1;

  return { gy, gm, gd: gd_temp };
}

export function isLeapJalaaliYear(jy) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];

  // const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];

  let jump;
  for (let i = 1; i <= 19; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;

  let leap = mod(mod(n + 1, 33) - 1, 4);

  if (leap === -1) {
    leap = 4;
  }

  return leap === 0;
}

export function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (isLeapJalaaliYear(jy)) return 30;
  return 29;
}

export function jalaaliToday() {
  const today = new Date();
  return toJalaali(today);
}

export function getJalaaliMonthName(month, locale = 'fa') {
  const months = {
    fa: [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ],
  };

  return months[locale][month - 1] || '';
}

export function getJalaaliWeekdays(locale = 'fa') {
  const weekdays = {
    fa: ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'],
  };

  return weekdays[locale] || weekdays.fa;
}

export function getJalaaliWeekday(jy, jm, jd) {
  const g = toGregorian(jy, jm, jd);
  const date = new Date(g.gy, g.gm - 1, g.gd);
  return (date.getDay() + 1) % 7;
}
