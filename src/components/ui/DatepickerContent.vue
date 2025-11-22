<template>
  <section class="datepicker-content">
    <div class="datepicker-content__controls">
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
        {{ toPersianNumbers(currentYear) }}
      </BaseButton>
    </div>

    <template v-if="currentView === 'years'">
      <div class="datepicker-content__years-controls">
        <ArrowRightIcon :width="24" :height="24" />
        <p class="datepicker-content__years-controls-year">{{ toPersianNumbers(currentYear) }}</p>
        <ArrowLeftIcon :width="24" :height="24" />
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
          ]"
          :disabled="day.isDisabled"
          @click="selectDay(day)"
        >
          {{ day.label }}
          <span v-if="day.isToday" class="datepicker-content__day-today-text">امروز</span>
        </BaseButton>
      </div>
    </template>
  </section>
</template>

<script setup>
  import BaseButton from '../common/BaseButton.vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';
  import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '../icons/ArrowRightIcon.vue';
  import { useDatePicker } from '@/composables/useDatePicker';

  const props = defineProps({
    locale: { type: String, default: 'fa' },
  });

  const {
    currentView,
    currentYear,
    currentMonth,
    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,
    toggleView,
    selectMonth,
    selectYear,
    selectDay,
    getMonthName,
    toPersianNumbers,
  } = useDatePicker({ locale: props.locale });
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
      gap: 16px;
      font-weight: 400;
      font-size: 14px;
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      font-family: 'IRANYekan';
      font-variant-numeric: normal;
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include customFlex(column, start, center);

      &--selected {
        background-color: $primary-500;
        color: $white-100;
        width: 32px;
        height: 32px;
      }

      &--prev-month,
      &--next-month {
        color: $gray-300;
      }

      &-today-text {
        color: $primary-400;
        font-weight: 400;
        font-size: 10px;
      }
    }
  }
</style>
