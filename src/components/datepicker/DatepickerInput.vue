<template>
  <div class="datepicker">
    <div class="datepicker__input-container">
      <BaseInput
        ref="inputRef"
        type="text"
        class="datepicker__input"
        :model-value="formattedDate"
        :placeholder="computedPlaceholder"
        :style="{ fontFamily }"
        readonly
        @click="togglePicker"
      />

      <BaseButton type="button" variant="icon" class="datepicker__input-icon" @click="togglePicker">
        <template #icon-left>
          <CalendarIcon />
        </template>
      </BaseButton>
    </div>

    <Transition name="datepicker-fade">
      <div v-if="isOpen" class="datepicker__overlay" @click="closePicker">
        <div class="datepicker__overlay-content" @click.stop>
          <DatePicker
            v-model="internalValue"
            :mode="mode"
            :min-date="minDate"
            :max-date="maxDate"
            :years-before="yearsBefore"
            :years-after="yearsAfter"
            :locale="currentLocale"
            :enable-time="enableTime"
            :time-format="timeFormat"
            :enable-locale-selector="enableLocaleSelector"
            @confirm="handleConfirm"
            @close="closePicker"
            @change="handleChange"
            @update:locale="handleLocaleChange"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import DatePicker from './DatePicker.vue';
  import CalendarIcon from '../icons/CalendarIcon.vue';
  import BaseInput from '../base/BaseInput.vue';
  import BaseButton from '../base/BaseButton.vue';
  import { toLocalizedNumbers } from '@/locales';
  import { useI18nStore } from '@/store/i18n';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'range', 'multiple'].includes(value),
    },
    placeholder: {
      type: String,
      default: null,
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    locale: {
      type: String,
      default: null,
    },
    minDate: {
      type: [Date, String],
      default: null,
    },
    maxDate: {
      type: [Date, String],
      default: null,
    },
    yearsBefore: {
      type: Number,
      default: 50,
    },
    yearsAfter: {
      type: Number,
      default: 50,
    },
    enableTime: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: [String, Number],
      default: 24,
    },
    enableLocaleSelector: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'change',
    'confirm',
    'open',
    'close',
    'update:locale',
  ]);

  const i18nStore = useI18nStore();
  const isOpen = ref(false);
  const inputRef = ref(null);

  const currentLocale = computed(() => props.locale || i18nStore.currentLocale);
  const computedPlaceholder = computed(
    () => props.placeholder || i18nStore.getText('selectDateText'),
  );

  const fontFamily = computed(() => {
    const fontMap = {
      jalali: 'IRANYekan',
      hijri: 'IRANYekan',
      gregorian: 'Arial, sans-serif',
      chinese: 'Microsoft YaHei, SimHei, sans-serif',
    };
    return fontMap[i18nStore.calendarType] || 'Arial, sans-serif';
  });

  const formattedDate = computed(() => {
    if (!internalValue.value) return '';

    const normalizeValue = (value, defaultValue = 0) => {
      if (typeof value === 'number' && !isNaN(value)) {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return !isNaN(parsed) ? parsed : defaultValue;
      }
      if (typeof value === 'object' && value !== null) {
        console.warn('[DatepickerInput] Invalid date field (object):', value);
        return defaultValue;
      }
      return defaultValue;
    };

    const sanitizeDateObject = (date) => {
      if (!date || typeof date !== 'object') return null;

      if ('jy' in date || 'jm' in date || 'jd' in date) {
        const sanitized = {
          jy: normalizeValue(date.jy, 1403),
          jm: normalizeValue(date.jm, 1),
          jd: normalizeValue(date.jd, 1),
        };

        if ('hour' in date || 'minute' in date) {
          sanitized.hour = normalizeValue(date.hour, 0);
          sanitized.minute = normalizeValue(date.minute, 0);
        }

        return sanitized;
      }

      if ('year' in date || 'month' in date || 'day' in date) {
        const sanitized = {
          year: normalizeValue(date.year, 2024),
          month: normalizeValue(date.month, 1),
          day: normalizeValue(date.day, 1),
        };

        if ('hour' in date || 'minute' in date) {
          sanitized.hour = normalizeValue(date.hour, 0);
          sanitized.minute = normalizeValue(date.minute, 0);
        }

        return sanitized;
      }

      return null;
    };

    const isValidDateObject = (date) => {
      if (!date || typeof date !== 'object') return false;

      if ('jy' in date && 'jm' in date && 'jd' in date) {
        return (
          typeof date.jy === 'number' &&
          typeof date.jm === 'number' &&
          typeof date.jd === 'number' &&
          !isNaN(date.jy) &&
          !isNaN(date.jm) &&
          !isNaN(date.jd)
        );
      }

      if ('year' in date && 'month' in date && 'day' in date) {
        return (
          typeof date.year === 'number' &&
          typeof date.month === 'number' &&
          typeof date.day === 'number' &&
          !isNaN(date.year) &&
          !isNaN(date.month) &&
          !isNaN(date.day)
        );
      }

      return false;
    };

    const formatSingle = (date) => {
      let processedDate = date;

      if (!isValidDateObject(date)) {
        console.warn('[DatepickerInput] Invalid date format, attempting to sanitize:', date);
        processedDate = sanitizeDateObject(date);

        if (!processedDate) {
          console.error('[DatepickerInput] Could not sanitize date:', date);
          return '';
        }
      }

      const { jy, jm, jd, year, month, day, hour, minute } = processedDate;
      const numberSystem = i18nStore.numberSystem;

      const y = jy ?? year;
      const m = jm ?? month;
      const d = jd ?? day;

      let str = props.format
        .replace('YYYY', String(y))
        .replace('MM', String(m).padStart(2, '0'))
        .replace('DD', String(d).padStart(2, '0'));
      str = toLocalizedNumbers(str, numberSystem);

      if (
        props.enableTime &&
        hour != null &&
        minute != null &&
        typeof hour === 'number' &&
        typeof minute === 'number'
      ) {
        const h = toLocalizedNumbers(String(hour).padStart(2, '0'), numberSystem);
        const m = toLocalizedNumbers(String(minute).padStart(2, '0'), numberSystem);
        str += ` ${h}:${m}`;
      }
      return str;
    };

    try {
      if (props.mode === 'range') {
        const { start, end } = internalValue.value || {};
        if (!start) return '';

        let sanitizedStart = start;
        if (!isValidDateObject(start)) {
          sanitizedStart = sanitizeDateObject(start);
          if (!sanitizedStart) return '';
        }

        if (end) {
          let sanitizedEnd = end;
          if (!isValidDateObject(end)) {
            sanitizedEnd = sanitizeDateObject(end);
          }

          if (sanitizedEnd) {
            return `${formatSingle(sanitizedStart)} - ${formatSingle(sanitizedEnd)}`;
          }
        }
        return formatSingle(sanitizedStart);
      }

      if (props.mode === 'multiple') {
        if (!Array.isArray(internalValue.value) || !internalValue.value.length) return '';

        const processedDates = internalValue.value
          .map((date) => {
            if (isValidDateObject(date)) return date;
            return sanitizeDateObject(date);
          })
          .filter((date) => date !== null);

        if (!processedDates.length) return '';
        return processedDates.map(formatSingle).join('، ');
      }

      return formatSingle(internalValue.value);
    } catch (error) {
      console.error('[DatepickerInput] Error formatting date:', error);
      return '';
    }
  });

  const togglePicker = () => {
    isOpen.value = !isOpen.value;
    emit(isOpen.value ? 'open' : 'close');
  };

  function closePicker() {
    isOpen.value = false;
    emit('close');
  }

  const internalState = ref(props.modelValue);

  function handleConfirm(date) {
    internalState.value = date;
    emit('update:modelValue', date);
    emit('confirm', date);
    closePicker();
  }

  const handleChange = (date) => emit('change', date);
  const handleLocaleChange = (newLocale) => emit('update:locale', newLocale);

  const internalValue = computed({
    get: () => props.modelValue ?? internalState.value,
    set: (val) => {
      internalState.value = val;
      emit('update:modelValue', val);
    },
  });
</script>

<style scoped lang="scss">
  .datepicker {
    &-wrapper {
      position: relative;
      max-width: 250px;
    }

    &__input-container {
      position: relative;
      width: 100%;
    }

    &__input {
      width: 250px;
      padding: 12px 16px;
      border: 1px solid $gray-200;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      background-color: $white-100;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: $primary-500;
      }

      &::placeholder {
        color: $gray-300;
      }

      &-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $gray-300;
        transition: color 0.2s;

        &:hover {
          color: $primary-500;
        }
      }
    }

    &__overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;

      &-content {
        position: relative;
        z-index: 1001;
        animation: slideUp 0.3s ease;
      }
    }

    &-fade-enter-active,
    &-fade-leave-active {
      transition: opacity 0.2s ease;
    }

    &-fade-enter-from,
    &-fade-leave-to {
      opacity: 0;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
</style>
