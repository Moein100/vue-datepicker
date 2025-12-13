import { computed, watch } from 'vue';
import { getCalendarAdapter } from '@/locales/adapters/createCalendarAdapterManager.js';
import { useI18nStore } from '@/store/i18n.js';
import { isSameDate } from '@/utils/datepicker';
import { CALENDAR_CONFIG } from '@/constants/datepicker';

export function useCalendarGrid(options) {
  const { year, month, selection, constraints, locale } = options;

  const i18n = useI18nStore();

  syncLocale(locale, i18n);

  const adapter = computed(() => getCalendarAdapter(i18n.calendarType));
  const today = computed(() => adapter.value.getToday());

  function resolveMonthYear(offset = 0) {
    let y = year.value;
    let m = month.value + offset;

    while (m > 12) {
      m -= 12;
      y++;
    }

    while (m < 1) {
      m += 12;
      y--;
    }

    return { y, m };
  }

  function buildDateObject(y, m, d) {
    return {
      jy: y,
      jm: m,
      jd: d,
      year: y,
      month: m,
      day: d,
    };
  }

  function createDayMeta(day, offset = 0) {
    const { y, m } = resolveMonthYear(offset);
    const date = buildDateObject(y, m, day);

    const isCurrentMonth = offset === 0;

    return {
      key: isCurrentMonth ? day : `${offset > 0 ? 'next' : 'prev'}-${day}`,
      id: `${y}-${m}-${day}`,

      day,
      date,

      isCurrentMonth,
      isPrevMonth: offset < 0,
      isNextMonth: offset > 0,

      isToday: isSameDate(date, today.value),
      isDisabled: constraints?.isDisabled(date) ?? false,

      isSelected: selection.isSelected(date),
      isInRange: selection.isInRange(date),
      isRangeStart: selection.isRangeStart(date),
      isRangeEnd: selection.isRangeEnd(date),
    };
  }

  const prevMonthDays = computed(() => {
    const weekday = adapter.value.getWeekday?.(year.value, month.value, 1) ?? 0;

    if (weekday === 0) return [];

    const { y, m } = resolveMonthYear(-1);
    const totalDays = adapter.value.getDaysInMonth(y, m);

    return Array.from({ length: weekday }, (_, i) =>
      createDayMeta(totalDays - (weekday - 1 - i), -1),
    );
  });

  const currentMonthDays = computed(() => {
    const totalDays = adapter.value.getDaysInMonth(year.value, month.value);
    return Array.from({ length: totalDays }, (_, i) => createDayMeta(i + 1));
  });

  const nextMonthDays = computed(() => {
    const filled = prevMonthDays.value.length + currentMonthDays.value.length;

    const remaining = CALENDAR_CONFIG.TOTAL_CELLS - filled;

    return remaining > 0
      ? Array.from({ length: remaining }, (_, i) => createDayMeta(i + 1, 1))
      : [];
  });

  const days = computed(() => [
    ...prevMonthDays.value,
    ...currentMonthDays.value,
    ...nextMonthDays.value,
  ]);

  const weeksCount = computed(() => Math.ceil(days.value.length / CALENDAR_CONFIG.DAYS_IN_WEEK));

  const weeks = computed(() => chunk(days.value, CALENDAR_CONFIG.DAYS_IN_WEEK));

  return {
    days,
    weeks,
    weeksCount,
  };
}

function syncLocale(locale, i18n) {
  if (!locale) return;

  watch(
    () => locale.value,
    (value) => {
      if (value) {
        i18n.setLocale(value);
      }
    },
    { immediate: true },
  );
}

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
