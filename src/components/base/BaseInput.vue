<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    size: { type: String, default: 'medium' },
  });

  const emit = defineEmits(['update:modelValue', 'click', 'focus', 'blur', 'keydown', 'keyup']);

  const inputClass = computed(() => ['input', `input--${props.size}`]);

  function handleInput(event) {
    emit('update:modelValue', event.target.value);
  }

  function handleClick(event) {
    emit('click', event);
  }

  function handleFocus(event) {
    emit('focus', event);
  }

  function handleBlur(event) {
    emit('blur', event);
  }

  function handleKeydown(event) {
    emit('keydown', event);
  }

  function handleKeyup(event) {
    emit('keyup', event);
  }
</script>

<template>
  <input
    :type="props.type"
    :class="inputClass"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    @input="handleInput"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  />
</template>
