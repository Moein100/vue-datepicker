<template>
  <section class="datepicker-content">
    <div class="datepicker-content__controls">
      <div class="datepicker-content__dropdown">
        <select class="datepicker-content__select">
          <option value="1">فروردین</option>
        </select>
        <ArrowDownIcon :width="24" :height="24" />
      </div>

      <div class="datepicker-content__dropdown">
        <select class="datepicker-content__select">
          <option value="1">1404</option>
        </select>
        <ArrowDownIcon :width="24" :height="24" />
      </div>
    </div>

    <div class="datepicker-content__weekdays">
      <span v-for="weekday in weekdays" :key="weekday" class="datepicker-content__weekday">
        {{ weekday }}
      </span>
    </div>

    <div class="datepicker-content__days">
      <button
        v-for="day in calendarDays"
        :key="day.id"
        :class="[
          'datepicker-content__day',
          {
            'datepicker-content__day--selected': day.isSelected,
          },
        ]"
        :disabled="day.isDisabled"
        @click="selectDay(day)"
      >
        {{ day.label }}
      </button>
    </div>
  </section>
</template>

<script setup>
  import { ref } from 'vue';
  import ArrowDownIcon from '../icons/ArrowDownIcon.vue';

  const weekdays = ['شنبه', '1شنبه', '2شنبه', '3شنبه', '4شنبه', '5شنبه', 'جمعه'];

  const calendarDays = ref(
    Array.from({ length: 31 }, (_, i) => ({
      id: i + 1,
      label: i + 1,
      isSelected: false,
      isToday: i + 1 === 15,
      isDisabled: false,
      isOtherMonth: false,
    })),
  );

  function selectDay(day) {
    calendarDays.value.forEach((d) => (d.isSelected = false));
    day.isSelected = true;
  }
</script>

<style scoped lang="scss">
  .datepicker-content {
    margin: 16px 0;

    &__controls {
      @include customFlex(row, space-between, center);
      gap: 8px;
      margin-bottom: 16px;
    }

    &__dropdown {
      position: relative;
      flex: 1;
      @include customFlex(row, space-between, center);
      border-radius: 4px;
      padding: 8px 12px;
    }

    &__select {
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      width: 100%;
    }

    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 16px;
      font-size: 12px;
      font-weight: 400;
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
      font-size: 14;
    }

    &__day {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      width: 32px;
      height: 32px;
      cursor: pointer;
      @include customFlex(row, center, center);

      &--selected {
        background-color: $primary-500;
        color: $white-100;
        width: 32px;
        height: 32px;
      }
    }
  }
</style>
