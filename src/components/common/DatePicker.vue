<template>
  <div class="position-relative" ref="wrapperRef">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>

    <div class="input-group">
      <input type="text" class="form-control" :id="id" :placeholder="placeholder" v-model="displayDate"
        @focus="openCalendar" readonly :disabled="isDisabled" />
      <span class="input-group-text bg-light" @click="toggleCalendar" :class="{ 'opacity-50': isDisabled }"
        :style="{ cursor: isDisabled ? 'not-allowed' : 'pointer' }">
        <i class="bi bi-calendar-event"></i>
      </span>
    </div>

    <!-- Calendar Popup -->
    <div v-if="isOpen" ref="calendarRef"
      class="calendar-container shadow p-3 mt-1 bg-white rounded position-absolute z-3" style="width: 100%;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="prevMonth">
          &lt;
        </button>
        <strong>{{ monthNames[currentMonth] }} {{ currentYear }}</strong>
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="nextMonth">
          &gt;
        </button>
      </div>

      <div class="calendar-grid text-center">
        <div class="fw-bold small" v-for="day in weekDays" :key="day">{{ day }}</div>

        <div v-for="(date, index) in calendarDays" :key="index" class="calendar-day small" :class="{
          'text-muted': date.getMonth() !== currentMonth,
          'bg-primary text-white rounded': isSelected(date),
          'disabled-date text-muted': isPastDate(date)
        }" :style="{ cursor: isPastDate(date) ? 'not-allowed' : 'pointer' }"
          @click="!isPastDate(date) && selectDate(date)">
          {{ date.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: () => `date-${Math.random().toString(36).slice(2, 8)}`
  },
  label: String,
  placeholder: {
    type: String,
    default: 'Select a date'
  },
  modelValue: String, // stores YYYY-MM-DD in parent
  isDisabled: {
    type: Boolean,
    default: false
  },
})


const isDisabled = toRef(props, 'isDisabled')

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const calendarRef = ref(null)
const wrapperRef = ref(null)
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null)

const today = new Date()
today.setHours(0, 0, 0, 0) // normalize time

const currentMonth = ref(selectedDate.value?.getMonth() ?? today.getMonth())
const currentYear = ref(selectedDate.value?.getFullYear() ?? today.getFullYear())

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Format date as "06-Nov-2025"
function formatDate(date) {
  if (!date) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const displayDate = computed(() => formatDate(selectedDate.value))

watch(selectedDate, val => {
  if (val) {
    const year = val.getFullYear()
    const month = String(val.getMonth() + 1).padStart(2, '0')
    const day = String(val.getDate()).padStart(2, '0')
    const localIso = `${year}-${month}-${day}`
    emit('update:modelValue', localIso)

  } else {
    emit('update:modelValue', '')
  }
})

// Generate calendar days
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())
  const end = new Date(lastDay)
  end.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

  const days = []
  let date = new Date(start)
  while (date <= end) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
})

// Disable past dates
function isPastDate(date) {
  return date < today
}

function selectDate(date) {
  selectedDate.value = date
  isOpen.value = false
}

function isSelected(date) {
  return (
    selectedDate.value &&
    date.toDateString() === selectedDate.value.toDateString()
  )
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function toggleCalendar() {
  if (!isDisabled.value) isOpen.value = !isOpen.value
}

function openCalendar() {
  if (!isDisabled.value) isOpen.value = true
}

function handleMouseDownOutside(event) {
  if (isOpen.value && wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    setTimeout(() => (isOpen.value = false), 150)
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleMouseDownOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleMouseDownOutside)
})
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}

.calendar-day:hover {
  background-color: #e9ecef;
}

.disabled-date {
  opacity: 0.5;
  pointer-events: none;
}

.calendar-day.bg-primary {
  color: white !important;
}
</style>
