<template>
  <section class="datepicker__header">
    <CloseButtonIcon :width="24" :height="24" />
    <p>تاریخ را انتخاب نمایید</p>
  </section>
</template>

<script setup>
  import CloseButtonIcon from '../icons/CloseButtonIcon.vue';
</script>

<style lang="scss" scoped>
  .datepicker {
    &__header {
      @include customFlex(row, start, center);
      font-weight: 400;
      font-size: 12px;
      width: 100%;
      p {
        width: 100%;
        text-align: center;
      }
    }
  }
</style>
