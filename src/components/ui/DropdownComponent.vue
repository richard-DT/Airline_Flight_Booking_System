<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: 'Dropdown' },
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select' },
  isDisabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'select'])

const isOpen = ref(false)
const selected = ref(props.modelValue)

watch(() => props.modelValue, val => {
  selected.value = val
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => (isOpen.value = false)

const onSelect = (item) => {
  selected.value = item
  emit('update:modelValue', item)
  emit('select', item)
  close()
}
</script>

<template>
  <div class="dropdown-wrapper" v-click-outside="close">
    <label v-if="label" class="form-label fw-bold">{{ label }}</label>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" @click="toggle" :disabled="isDisabled">
        {{ selected || placeholder }}
      </button>

      <ul class="dropdown-menu" :class="{ show: isOpen }">
        <!-- Optional "Select" placeholder shown as disabled item -->
        <li v-if="placeholder && !selected">
          <a class="dropdown-item disabled text-muted" href="#">
            {{ placeholder }}
          </a>
        </li>

        <li v-for="(item, index) in items" :key="index">
          <a class="dropdown-item" href="#" @click.prevent="onSelect(item)">
            {{ item }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  box-sizing: border-box;
  min-width: 100%;
  width: auto;
  max-width: 200px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.btn-secondary {
  border: 1px solid var(--color-primary) !important;
}

.btn-secondary:disabled {
  background-color: var(--bs-secondary-bg) !important;
  opacity: 1;
}
</style>
