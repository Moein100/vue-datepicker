<script setup>
  import { ref } from 'vue';
  import DatepickerInput from './components/datepicker/DatepickerInput.vue';

  const selectedDateTime = ref(null);
  const selectedRange = ref(null);
</script>

<template>
  <div class="container">
    <div>
      <DatepickerInput
        v-model="selectedDateTime"
        mode="multiple"
        :enable-time="true"
        :time-format="24"
        placeholder="انتخاب تاریخ و زمان"
      />
    </div>

    <div>
      <DatepickerInput
        v-model="selectedRange"
        mode="single"
        :enable-time="true"
        :time-format="'12'"
        placeholder="انتخاب تاریخ و زمان"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
