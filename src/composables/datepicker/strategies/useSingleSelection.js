import { isSameDate, parseJalaaliDateTime } from '@/utils/datepicker';
import { ref, readonly } from 'vue';

export function useSingleSelection(initialValue = null) {
  const selected = ref(parseJalaaliDateTime(initialValue));

  function select(date) {
    selected.value = { ...date };
  }

  function isSelected(date) {
    return isSameDate(selected.value, date);
  }

  function getValue() {
    return selected.value ? { ...selected.value } : null;
  }

  function clear() {
    selected.value = null;
  }

  function isInRange() {
    return false;
  }

  function isRangeStart() {
    return false;
  }

  function isRangeEnd() {
    return false;
  }

  return {
    selected: readonly(selected),
    select,
    isSelected,
    getValue,
    clear,
    isInRange,
    isRangeStart,
    isRangeEnd,
  };
}
