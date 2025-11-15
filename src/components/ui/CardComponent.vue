<template>
  <div class="card shadow-sm position-relative text-primary" :class="isSelected ? 'selected' : ''">
    <!-- Conditional Badge -->
    <span v-if="badgeText" class="badge text-bg-primary position-absolute top-0 end-0 m-2 p-2">
      {{ badgeText }}
    </span>

    <img :src="image" class="card-img-top img-fluid" :alt="title" />
    <div class="card-body">
      <p><strong>{{ title }}</strong></p>
      <p class="card-text">{{ description }}</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="">
          <button class="btn btn-sm btn-primary" :class="!showPrimary ? 'visually-hidden' : ''"
            @click="$emit('primary-click', name)">
            {{ primaryText }}
          </button>
          <button class="btn btn-sm btn-secondary" :class="!showSecondary ? 'visually-hidden' : ''"
            @click="$emit('secondary-click', name)">
            {{ secondaryText }}
          </button>
        </div>
        <small class="text-body-secondary">{{ miscText }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  primaryText: { type: String, required: true },
  secondaryText: { type: String },
  miscText: { type: String },
  badgeText: { type: String },
  isSelected: { type: Boolean, default: false },
  name: { type: String, default: null },
  showPrimary: { type: Boolean, default: true },
  showSecondary: { type: Boolean, default: false },
})

defineEmits(['primary-click', 'secondary-click'])
</script>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 400px;
}

.card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.border-primary {
  border-color: var(--color-primary) !important;
}

.selected {
  outline: 2px solid var(--color-primary);
}

@media (max-width: 576px) {
  .card img {
    height: 180px;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .card img {
    height: 220px;
  }
}
</style>
