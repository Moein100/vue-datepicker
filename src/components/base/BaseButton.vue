<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'medium' },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
    label: String,
  });

  const btnClass = computed(() => [
    'btn',
    `btn--${props.size}`,
    `btn--${props.variant}`,
    { 'btn--block': props.block },
  ]);
</script>

<template>
  <button :type="props.type" :class="btnClass" :disabled="props.disabled">
    <span class="btn__icon btn__icon--start"><slot name="icon-left" /></span>
    <span class="btn__label"
      ><slot>{{ label }}</slot></span
    >
    <span class="btn__icon btn__icon--end"><slot name="icon-right" /></span>
  </button>
</template>
