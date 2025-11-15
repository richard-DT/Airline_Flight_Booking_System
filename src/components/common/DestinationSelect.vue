<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: () => `combo-${Math.random().toString(36).slice(2, 8)}`
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Type or select destination'
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const searchTerm = ref('');
const isOpen = ref(false);
const selectedValue = ref(props.modelValue);

// --- Sync external v-model value ---
watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
    if (val) {
      searchTerm.value = `${val.city} — ${val.airportId}`;
    } else {
      searchTerm.value = '';
    }
  },
  { immediate: true }
);

// --- Grouped & filtered options ---
const groupedOptions = computed(() => {
  const term = searchTerm.value.toLowerCase().replace(/[^a-z0-9 ]/gi, ''); // remove special chars

  const filtered = props.options.filter(opt => {
    const text = `${opt.city} ${opt.country} ${opt.name} ${opt.airportId}`.toLowerCase();
    return text.includes(term);
  });

  const groups = {};
  filtered.forEach(opt => {
    if (!groups[opt.country]) groups[opt.country] = [];
    groups[opt.country].push(opt);
  });

  return Object.keys(groups)
    .sort()
    .map(country => ({
      country,
      airports: groups[country].sort((a, b) => a.city.localeCompare(b.city))
    }));
});

// --- Select option ---
function selectOption(option) {
  searchTerm.value = `${option.city} — ${option.airportId}`;
  selectedValue.value = option;
  emit('update:modelValue', option);
  isOpen.value = false;
}

function closeDropdown() {
  setTimeout(() => (isOpen.value = false), 150);
}

// --- Clear search term on focus to show all options ---
function onFocus() {
  isOpen.value = true;
  searchTerm.value = '';
}
</script>

<template>
  <div class="position-relative">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>

    <!-- Input Field -->
    <input type="text" class="form-control" :id="id" v-model="searchTerm" :placeholder="placeholder" @focus="onFocus"
      @blur="closeDropdown" :disabled="isDisabled" />

    <!-- Dropdown -->
    <ul v-if="isOpen" class="list-group position-absolute w-100 mt-1 z-3" style="max-height: 260px; overflow-y: auto;">
      <!-- Loop on each country group -->
      <template v-for="group in groupedOptions" :key="group.country">
        <li class="list-group-item bg-light fw-bold text-uppercase small" style="cursor: default;">
          {{ group.country }}
        </li>

        <li v-for="option in group.airports" :key="option.airportId" class="list-group-item list-group-item-action"
          :class="{ active: option.airportId === selectedValue?.airportId }" @mousedown.prevent="selectOption(option)">
          <div class="fw-semibold">
            {{ option.city }} — {{ option.airportId }}
          </div>
          <div class="small fw-light">{{ option.name }}</div>
        </li>
      </template>

      <li v-if="groupedOptions.length === 0" class="list-group-item text-center text-muted" style="cursor: default;">
        No airports found
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-group-item {
  cursor: pointer;
}

.list-group-item.active {
  background-color: var(--bs-primary);
  color: white;
}

.list-group-item .small {
  font-size: 0.85rem;
}
</style>
