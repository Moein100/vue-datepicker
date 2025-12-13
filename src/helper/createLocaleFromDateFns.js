export function createLocaleFromDateFns(dateFnsLocale, customConfig = {}) {
  const months = dateFnsLocale.localize?.month
    ? Array.from({ length: 12 }, (_, i) => dateFnsLocale.localize.month(i, { width: 'wide' }))
    : customConfig.months || [];

  const monthsShort = dateFnsLocale.localize?.month
    ? Array.from({ length: 12 }, (_, i) =>
        dateFnsLocale.localize.month(i, { width: 'abbreviated' }),
      )
    : customConfig.monthsShort || [];

  const weekdays = dateFnsLocale.localize?.day
    ? Array.from({ length: 7 }, (_, i) => dateFnsLocale.localize.day(i, { width: 'wide' }))
    : customConfig.weekdays || [];

  const weekdaysShort = dateFnsLocale.localize?.day
    ? Array.from({ length: 7 }, (_, i) => dateFnsLocale.localize.day(i, { width: 'short' }))
    : customConfig.weekdaysShort || [];

  return {
    months,
    monthsShort,
    weekdays,
    weekdaysShort,
    ...customConfig,
  };
}
