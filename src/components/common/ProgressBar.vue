<template>
  <div class="container pt-4 pb-3 custom-progress-bar">
    <h3 class="text-center mb-4 fw-bold">{{ title }}</h3>

    <div class="position-relative mb-4 mx-1">
      <!-- Progress Line -->
      <div class="progress" style="height: 10px;">
        <div class="progress-bar" role="progressbar" :style="{ width: animatedWidth }" aria-valuemin="0"
          aria-valuemax="100"></div>
      </div>

      <!-- Circles -->
      <div class="position-absolute top-50 start-0 translate-middle-y w-100 d-flex justify-content-between">
        <div v-for="(step, index) in steps" :key="index" class="circle" :class="circleClass(index)">
          <i v-if="index < currentStep" class="bi bi-check"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Progress' },
  steps: { type: Number, default: 5 },
  currentStep: { type: Number, default: 1 },
})

const animatedWidth = ref('0%')

const progressWidth = computed(() => {
  return ((props.currentStep - 1) / (props.steps - 1)) * 100 + '%'
})

onMounted(() => {
  // delay triggers transition on mount
  requestAnimationFrame(() => {
    animatedWidth.value = progressWidth.value
  })
})

function circleClass(index) {
  if (index < props.currentStep - 1) return 'completed'
  if (index === props.currentStep - 1) return 'active'
  return 'not-yet-started'
}
</script>

<style scoped>
.custom-progress-bar {
  max-width: 500px;
}

.progress {
  background-color: #e9ecef;
  border-radius: 5px;
}

.progress-bar {
  background-color: var(--color-primary, #0d6efd);
  transition: width 0.6s ease;
}

/* Circles */
.circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.circle.completed {
  background-color: var(--color-primary, #0d6efd);
  color: white;
  border-color: var(--color-primary, #0d6efd);
}

.circle.active {
  border-color: var(--color-primary, #0d6efd);
}

.circle.not-yet-started {
  opacity: 0.5;
}

.bi {
  height: 22px !important;
}
</style>
