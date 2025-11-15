<template>
  <svg :width="width" :height="height" viewBox="0 0 26 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
    <path d="M19.7435 0.75L24.4919 5.51471M24.4919 5.51471L19.7435 10.2794M24.4919 5.51471H0.75"
      stroke="var(--color-white)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup>
defineProps({
  width: {
    type: [String, Number],
    default: 26,
  },
  height: {
    type: [String, Number],
    default: 12,
  },
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
