<template>
  <div class="vertical-tabs d-flex flex-column flex-md-row">
    <!-- Sidebar Tabs -->
    <div class="nav flex-md-column nav-pills me-md-4 mb-3 mb-md-0 vertical-nav" role="tablist"
      aria-orientation="vertical">
      <button v-for="(tab, index) in tabs" :key="tab.label" class="nav-link text-start"
        :class="{ active: activeIndex === index }" @click="selectTab(index)">
        <i v-if="tab.icon" :class="['me-2', tab.icon]"></i>{{ tab.label }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="tab-content flex-grow-1 p-3 border rounded">
      <slot :activeTab="activeTab" :index="activeIndex" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue'])
const activeIndex = ref(props.modelValue)
const activeTab = computed(() => props.tabs[activeIndex.value])

function selectTab(index) {
  activeIndex.value = index
  emit('update:modelValue', index)
}

// keep sync with v-model
watch(() => props.modelValue, val => (activeIndex.value = val))
</script>

<style scoped>
.vertical-tabs {
  min-height: 300px;
}

/* Make the vertical nav wider on md+ screens */
.vertical-nav {
  width: 100%;
}

@media (min-width: 768px) {
  .vertical-nav {
    width: 220px;
  }
}

.nav-link {
  color: var(--bs-body-color);
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: var(--bs-light);
}

.nav-link.active {
  background-color: var(--color-primary, #0d6efd);
  color: white;
}

.tab-content {
  box-shadow: var(--shadow-card);
}
</style>
