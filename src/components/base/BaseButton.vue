<template>
  <button :type="props.type" :class="buttonClass" :disabled="props.disabled">
    <span class="button__icon button__icon--left"><slot name="icon-left" /></span>
    <span class="button__label"
      ><slot>{{ label }}</slot></span
    >
    <span class="button__icon button__icon--right"><slot name="icon-right" /></span>
  </button>
</template>

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

  const buttonClass = computed(() => [
    'button',
    `button--${props.size}`,
    `button--${props.variant}`,
    { 'button--block': props.block },
  ]);
</script>

<style lang="scss">
  .button {
    @include flex(inline-flex, center, center, spacing(8));
    border: 0;
    border-radius: radius(12);
    cursor: pointer;
    font-family: inherit;
    font-size: font-size(16);
    font-weight: font-weight(semibold);
    padding: spacing(8) spacing(16);

    &--block {
      width: 100%;
      height: 48px;
    }

    &--primary {
      background-color: get-color(primary, 600);
      color: get-color(text, white);
    }
    &--secondary {
      border: 1px solid get-color(gray, 200);
      height: 55px;
      width: 90px;
    }
    &--outline {
      border: none;
      background-color: transparent;
    }

    &--small {
      padding: spacing(8) spacing(14);
      font-size: font-size(12);
      font-weight: font-weight(normal);
    }

    &--medium {
      font-size: font-size(16);
      font-weight: font-weight(semibold);
    }

    &--large {
      padding: spacing(14) spacing(24);
      font-size: font-size(16);
    }
  }
</style>
