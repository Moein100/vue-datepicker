<script setup>
  import { ref } from 'vue';
  import DatepickerInput from './components/ui/DatepickerInput.vue';

  const selectedDateTime = ref(null);
</script>

<template>
  <div class="container">
    <div>
      <DatepickerInput
        v-model="selectedDateTime"
        mode="single"
        :enable-time="true"
        :time-format="24"
        placeholder="انتخاب تاریخ و زمان"
      />
      <p v-if="selectedDateTime">تاریخ و زمان انتخاب شده: {{ JSON.stringify(selectedDateTime) }}</p>
    </div>

    <div>
      <DatepickerInput
        v-model="selectedRange"
        mode="single"
        :enable-time="true"
        :time-format="'12'"
        placeholder="انتخاب تاریخ و زمان"
      />
      <p v-if="selectedRange">تاریخ و زمان انتخاب شده: {{ JSON.stringify(selectedRange) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
