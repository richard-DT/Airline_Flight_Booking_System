<template>
  <div class="py-3 px-3 d-flex gap-2 sticky-bottom-btn flex-md-row justify-content-md-end">
    <!-- Primary Button -->
    <template v-if="primaryFunction">
      <button type="button"
        class="btn btn-primary w-100 p-2 order-md-2 order-2 d-flex align-items-center justify-content-center"
        :disabled="isPrimaryDisabled || isLoading" @click="handlePrimaryClick">
        <template v-if="isLoading">
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ primaryLoadingText }}
        </template>
        <template v-else>
          {{ primaryText }}
        </template>
      </button>
    </template>

    <template v-else-if="!isPrimaryDisabled && !isLoading">
      <router-link :to="primaryLink"
        class="btn btn-primary w-100 p-2 order-md-2 order-2 d-flex align-items-center justify-content-center">
        {{ primaryText }}
      </router-link>
    </template>

    <template v-else>
      <button type="button"
        class="btn btn-primary w-100 p-2 order-md-2 order-2 d-flex align-items-center justify-content-center" disabled>
        <template v-if="isLoading">
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ primaryLoadingText }}
        </template>
        <template v-else>
          {{ primaryText }}
        </template>
      </button>
    </template>

    <!-- Secondary Button -->
    <router-link v-if="showSecondary" :to="secondaryLink" class="btn btn-secondary w-100 p-2"
      :class="{ disabled: isSecondaryDisabled }" @click.prevent="handleSecondaryClick">
      {{ secondaryText }}
    </router-link>
  </div>
</template>

<script setup>
const props = defineProps({
  primaryText: { type: String, default: 'Continue' },
  primaryLink: { type: [String, Object], default: null },
  primaryFunction: { type: Function, default: null },
  secondaryText: { type: String, default: 'Back' },
  secondaryLink: { type: [String, Object], default: null },
  showSecondary: { type: Boolean, default: true },
  isPrimaryDisabled: { type: Boolean, default: false },
  isSecondaryDisabled: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  primaryLoadingText: { type: String, default: 'Loading...' },
})

function handlePrimaryClick(e) {
  if (props.isPrimaryDisabled || props.isLoading) {
    e.preventDefault()
    return
  }
  props.primaryFunction?.()
}

function handleSecondaryClick(e) {
  if (props.isSecondaryDisabled) {
    e.preventDefault()
  }
}
</script>

<style scoped>
.sticky-bottom-btn {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem;
  z-index: 100;
}

@media (min-width: 992px) {
  .btn {
    max-width: 25%;
  }
}

.btn[disabled],
.btn.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
