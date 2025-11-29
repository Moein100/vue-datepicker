const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNumbers(value) {
  if (value === null || value === undefined) return '';

  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);
}

export function toEnglishNumbers(value) {
  if (!value) return '';

  return String(value).replace(/[۰-۹]/g, (digit) => {
    return PERSIAN_DIGITS.indexOf(digit).toString();
  });
}

export function padZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

export function formatJalaaliDate(date, format, options = {}) {
  if (!date) return '';

  const { persianNumbers = true, locale } = options;
  const { jy, jm, jd, hour, minute } = date;

  let result = format;

  result = result.replace('YYYY', String(jy));
  result = result.replace('YY', String(jy).slice(-2));
  result = result.replace('MM', padZero(jm));
  result = result.replace('M', String(jm));
  result = result.replace('DD', padZero(jd));
  result = result.replace('D', String(jd));

  if (locale?.months && result.includes('MMMM')) {
    result = result.replace('MMMM', locale.months[jm - 1]);
  }

  if (locale?.weekdays && result.includes('dddd')) {
    result = result.replace('dddd', '');
  }

  if (persianNumbers) {
    result = toPersianNumbers(result);
  }

  return result;
}

export function formatTime(hour, minute, options = {}) {
  const { timeFormat = 24, persianNumbers = true } = options;

  let displayHour = hour;
  let suffix = '';

  if (timeFormat === 12) {
    suffix = hour >= 12 ? ' PM' : ' AM';
    displayHour = hour % 12 || 12;
  }

  const formatted = `${padZero(displayHour)}:${padZero(minute)}${suffix}`;

  return persianNumbers ? toPersianNumbers(formatted) : formatted;
}

export function formatJalaaliDateTime(dateTime, dateFormat, options = {}) {
  if (!dateTime) return '';

  let result = formatJalaaliDate(dateTime, dateFormat, options);

  if (dateTime.hour !== undefined && dateTime.minute !== undefined) {
    const timeStr = formatTime(dateTime.hour, dateTime.minute, options);
    result += ` ${timeStr}`;
  }

  return result;
}

export function formatDateRange(range, dateFormat, options = {}) {
  if (!range) return '';

  const { separator = ' - ', ...formatOptions } = options;
  const { start, end } = range;

  const startStr = start ? formatJalaaliDateTime(start, dateFormat, formatOptions) : '';
  const endStr = end ? formatJalaaliDateTime(end, dateFormat, formatOptions) : '';

  if (!startStr) return '';
  if (!endStr) return startStr;

  return `${startStr}${separator}${endStr}`;
}

export function formatMultipleDates(dates, dateFormat, options = {}) {
  if (!dates || !dates.length) return '';

  const { separator = '، ', ...formatOptions } = options;

  return dates.map((d) => formatJalaaliDateTime(d, dateFormat, formatOptions)).join(separator);
}
