<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0.5 }
})

const emit = defineEmits(['update:modelValue'])

const label = computed(() => props.modelValue.toFixed(1))
</script>

<template>
  <div class="tolerance-control">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <label class="small text-secondary-emphasis mb-0" for="tolerance-range">Tolerancia</label>
      <span class="badge text-bg-secondary">{{ label }}°</span>
    </div>
    <input
      id="tolerance-range"
      class="form-range"
      type="range"
      min="0.1"
      max="2"
      step="0.1"
      :value="modelValue"
      @input="emit('update:modelValue', Number($event.target.value))"
    />
  </div>
</template>