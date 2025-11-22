<template>
  <main class="datepicker">
    <DatepickerHeader />
    <DatepickerContent
      :locale="locale"
      :initial-value="modelValue"
      :min-date="minDate"
      :max-date="maxDate"
      @update:selected-date="onDateSelect"
      ref="contentRef"
    />
    <BaseButton variant="primary" type="submit" size="medium" block @click="handleConfirm">
      تایید
    </BaseButton>
  </main>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import DatepickerContent from './DatepickerContent.vue';
  import DatepickerHeader from './DatepickerHeader.vue';
  import BaseButton from '../common/BaseButton.vue';

  defineProps({
    modelValue: {
      type: [Object, String],
      default: null,
    },
    locale: {
      type: String,
      default: 'fa',
    },
    minDate: {
      type: [Object, String],
      default: null,
    },
    maxDate: {
      type: [Object, String],
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'confirm', 'open', 'close', 'change']);

  const contentRef = ref(null);

  function onDateSelect(date) {
    emit('change', date);
  }

  function handleConfirm() {
    if (contentRef.value) {
      const confirmedDate = contentRef.value.confirmSelection();
      if (confirmedDate) {
        emit('update:modelValue', confirmedDate);
        emit('confirm', confirmedDate);
      }
    }
  }

  onMounted(() => {
    emit('open');
  });

  onUnmounted(() => {
    emit('close');
  });
</script>

<style scoped lang="scss">
  .datepicker {
    background-color: $gray-100;
    width: 360px;
    padding: 24px 16px 16px 16px;
    border-radius: $radius-8;
    @include customFlex(column, space-between, 12px);
  }
</style>
