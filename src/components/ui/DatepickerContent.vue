<template>
  <section class="datepicker-content">
    <div v-if="currentView !== 'years'" class="datepicker-content__controls">
      <BaseButton
        variant="outline"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
        @click="toggleView('months')"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ getMonthName(currentMonth) }}
      </BaseButton>

      <BaseButton
        variant="outline"
        type="button"
        size="small"
        class="datepicker-content__controls-btn"
        @click="toggleView('years')"
      >
        <template #icon-right>
          <ArrowDownIcon :width="24" :height="24" />
        </template>
        {{ currentYear }}
      </BaseButton>
    </div>

    <template v-if="currentView === 'years'">
      <div class="datepicker-content__years-controls">
        <ArrowRightIcon :width="24" :height="24" @click="prevYearRange" />
        <p class="datepicker-content__years-controls-year">{{ currentYear }}</p>
        <ArrowLeftIcon :width="24" :height="24" @click="nextYearRange" />
      </div>
      <div class="datepicker-content__years">
        <BaseButton
          v-for="year in yearRange"
          :key="year"
          variant="secondary"
          size="small"
          :class="{ 'datepicker-content__years-btn--active': currentYear === year }"
          @click="selectYear(year)"
        >
          {{ year }}
        </BaseButton>
      </div>
    </template>

    <div v-if="currentView === 'months'" class="datepicker-content__months">
      <BaseButton
        v-for="month in MONTHS"
        :key="month"
        variant="secondary"
        size="small"
        :class="{ 'datepicker-content__months-btn--active': currentMonth === month }"
        @click="selectMonth(month)"
      >
        {{ getMonthName(month) }}
      </BaseButton>
    </div>

    <template v-if="currentView === 'days'">
      <div class="datepicker-content__weekdays">
        <span v-for="weekday in WEEKDAYS" :key="weekday" class="datepicker-content__weekday">
          {{ weekday }}
        </span>
      </div>
      <div class="datepicker-content__days">
        <BaseButton
          v-for="day in calendarDays"
          :key="day.id"
          variant="outline"
          :class="[
            'datepicker-content__day',
            { 'datepicker-content__day--selected': day.isSelected },
            { 'datepicker-content__day--prev-month': day.isPrevMonth },
            { 'datepicker-content__day--next-month': day.isNextMonth },
            { 'datepicker-content__day--in-range': day.isInRange },
            { 'datepicker-content__day--range-start': day.isRangeStart },
            { 'datepicker-content__day--range-end': day.isRangeEnd },
          ]"
          :disabled="day.isDisabled"
          @click="selectDay(day)"
        >
          {{ day.label }}
          <span v-if="day.isToday && !day.isSelected" class="datepicker-content__day-today-text"
            >امروز</span
          >
        </BaseButton>
      </div>
    </template>

    <TimePicker
      v-if="enableTime && currentView === 'days'"
      :selected-hour="selectedHour"
      :selected-minute="selectedMinute"
      :selected-period="selectedPeriod"
      :display-hour="displayHour"
      :hours="hours"
      :minutes="minutes"
      :time-format="timeFormat"
      :to-persian-numbers="toPersianNumbers"
      @select-hour="selectHour"
      @select-minute="selectMinute"
      @toggle-period="togglePeriod"
    />
  </section>
</template>

<script setup>
  import BaseButton from '../common/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';
  import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '../icons/ArrowRightIcon.vue';
  import TimePicker from './TimePicker.vue';
  import { useDatePicker } from '@/composables/useDatePicker';

  const props = defineProps({
    locale: { type: String, default: 'fa' },
    mode: { type: String, default: 'single' },
    initialValue: { type: [Object, String], default: null },
    minDate: { type: [Object, String], default: null },
    maxDate: { type: [Object, String], default: null },
    enableTime: { type: Boolean, default: false },
    timeFormat: { type: [String, Number], default: 24 },
  });

  const emit = defineEmits([
    'update:selectedDate',
    'update:currentView',
    'update:rangeSelection',
    'update:multipleSelection',
  ]);

  const {
    currentView,
    currentYear,
    currentMonth,
    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,
    selectedDate,
    rangeStart,
    rangeEnd,
    multipleDates,
    enableTime,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    displayHour,
    hours,
    minutes,
    timeFormat,
    toggleView: toggleViewInternal,
    selectMonth: selectMonthInternal,
    selectYear: selectYearInternal,
    selectDay: selectDayInternal,
    selectHour: selectHourInternal,
    selectMinute: selectMinuteInternal,
    togglePeriod: togglePeriodInternal,
    confirmSelection: confirmSelectionInternal,
    getMonthName,
    nextYearRange,
    prevYearRange,
    toPersianNumbers,
  } = useDatePicker({
    locale: props.locale,
    mode: props.mode,
    initialValue: props.initialValue,
    minDate: props.minDate,
    maxDate: props.maxDate,
    enableTime: props.enableTime,
    timeFormat: props.timeFormat,
  });

  function toggleView(view) {
    toggleViewInternal(view);
    emit('update:currentView', currentView.value);
  }

  function selectMonth(month) {
    selectMonthInternal(month);
    emit('update:currentView', currentView.value);
  }

  function selectYear(year) {
    selectYearInternal(year);
    emit('update:currentView', currentView.value);
  }

  function selectDay(day) {
    selectDayInternal(day);
    if (props.mode === 'range') {
      emit('update:rangeSelection', { start: rangeStart.value, end: rangeEnd.value });
    } else if (props.mode === 'multiple') {
      emit('update:multipleSelection', multipleDates.value);
    } else {
      emit('update:selectedDate', selectedDate.value);
    }
  }

  function selectHour(hour) {
    selectHourInternal(hour);
  }

  function selectMinute(minute) {
    selectMinuteInternal(minute);
  }

  function togglePeriod() {
    togglePeriodInternal();
  }

  function confirmSelection() {
    return confirmSelectionInternal();
  }

  defineExpose({
    confirmSelection,
  });
</script>

<style scoped lang="scss">
  .datepicker-content {
    @include customFlex(column, space-between, normal, 20px);
    margin-bottom: 20px;

    &__controls {
      @include customFlex(row, space-between, center);
      gap: 8px;
      &-btn {
        height: 24px;
        padding: 0;
        border: none;
      }
    }

    &__months,
    &__years {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 12px;
      column-gap: 29px;
      width: 100%;
      &-btn--active {
        background-color: $primary-500;
        color: $white-100;
      }
    }
    &__years-controls {
      @include customFlex(row, space-between, center);
      height: 24px;
      cursor: pointer;
      &-year {
        font-weight: 400;
        font-size: 12px;
      }
    }

    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 16px;
      font-size: 12px;
      font-weight: 400;
      font-family: 'IRANYekan';
      background-color: $gray-50;
      height: 16px;
      width: 100%;
      border-radius: 4px;
      padding-left: 2px;
    }

    &__weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
    }

    &__days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      row-gap: 16px;
      column-gap: 0;
      font-weight: 400;
      font-size: 14px;
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      font-family: 'IRANYekan';
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include customFlex(column, start, center);
      position: relative;

      &--selected {
        background-color: $primary-500;
        color: $white-100;
      }

      &--range-start,
      &--range-end {
        color: $white-100;
        z-index: 1;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          width: 32px;
          height: 32px;
          background-color: $primary-500;
          border-radius: 10px;
          z-index: -1;
        }
      }

      &--range-start {
        background: linear-gradient(to right, rgba($primary-300, 0.15) 50%, transparent 50%);
        border-radius: 0;
      }

      &--range-end {
        background: linear-gradient(to left, rgba($primary-300, 0.15) 50%, transparent 15%);
        border-radius: 0;
      }

      &--prev-month,
      &--next-month {
        color: $gray-300;
      }

      &--in-range {
        background-color: rgba($primary-300, 0.15);
        border-radius: 0;
      }

      &-today-text {
        color: $primary-400;
        font-weight: 400;
        font-size: 10px;
      }
    }
  }
</style>
