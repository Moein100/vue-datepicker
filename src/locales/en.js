import { localeManager } from './localeManager.js';

const enLocale = {
  months: [
    'Farvardin',
    'Ordibehesht',
    'Khordad',
    'Tir',
    'Mordad',
    'Shahrivar',
    'Mehr',
    'Aban',
    'Azar',
    'Dey',
    'Bahman',
    'Esfand',
  ],
  weekdays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  weekdaysFull: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  direction: 'ltr',
  todayText: 'Today',
  selectDateText: 'Select a date',
  selectTimeText: 'Select time',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  clearText: 'Clear',
  hourText: 'Hour',
  minuteText: 'Minute',
  periodText: 'Period',
  selectedTimeText: 'Selected time',
  startDateText: 'Start date',
  endDateText: 'End date',
};

localeManager.register('en', enLocale);

export default enLocale;
