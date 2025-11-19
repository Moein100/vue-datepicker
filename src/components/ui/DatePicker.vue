<template>
  <main class="datepicker">
    <DatepickerHeader />
    <DatepickerContent />
    <BaseButton variant="primary" type="submit" size="md" block> تایید </BaseButton>
  </main>
</template>

<script setup>
  import DatepickerContent from './DatepickerContent.vue';
  import DatepickerHeader from './DatepickerHeader.vue';
  import BaseButton from '../common/BaseButton.vue';
</script>

<style scoped lang="scss">
  .datepicker {
    background-color: $gray-100;
    width: 360px;
    padding: 24px 16px 16px 16px;
    border-radius: $radius-8;
  }
</style>
