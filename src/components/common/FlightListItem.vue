<script setup>
import { useFlightSearchStore } from '@/stores/flightSearch'
import { formatMinutes, formatTimeReadable } from '@/utils/date'
import { getTotalPassengers } from '@/utils/flightSearch'
import { formatMoney } from '@/utils/string'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AirPlaneTakeLandingIcon from '../icons/AirPlaneLandingIcon.vue'
import AirPlaneTakeOffIcon from '../icons/AirPlaneTakeOffIcon.vue'

// Store setup
const flightStore = useFlightSearchStore()
const { selectFlight, clearSelectedFlight } = flightStore
const { selectedFlight, pax, cabin } = storeToRefs(flightStore)

const props = defineProps({
  flightData: { type: Object, required: true },
  index: { type: Number, required: true }
})

// Computed: check if this flight is selected
const isSelected = computed(() =>
  selectedFlight.value?.flightNumber === props.flightData.flightNumber
)

// Toggle selection
function handleSelect() {
  if (isSelected.value) {
    clearSelectedFlight()
  } else {
    selectFlight(props.flightData)
  }
}

const {
  departureTime,
  arrivalTime,
  origin,
  destination,
  flightDuration,
  flightNumber,
  airline,
  pricePerCabin
} = props.flightData

const totalPassengers = getTotalPassengers(pax.value);
const totalPrice = pricePerCabin[cabin.value.toLowerCase()] * totalPassengers;
</script>

<template>
  <div class="list-group-item list-group-item-action container mb-1 border shadow-md position-relative"
    :class="[index % 2 === 0 ? 'list-even' : 'list-odd', { selected: isSelected }]" @click="handleSelect">
    <!-- Checkmark icon -->
    <transition name="fade">
      <i v-if="isSelected" class="bi bi-check-circle-fill checkmark position-absolute text-primary"></i>
    </transition>

    <div class="row text-primary">
      <!-- Left side (flight info) -->
      <div class="col-9 px-0 d-md-flex flex-row justify-content-around w-50">
        <div class="d-flex gap-2 align-items-center p-2 pe-0">
          <!-- Departure -->
          <span class="d-flex align-items-start flex-column">
            <p class="m-0 small-text fw-bold">{{ formatTimeReadable(departureTime) }}</p>
            <span class="d-flex gap-1 align-items-center">
              <slot name="departure-icon">
                <AirPlaneTakeOffIcon width="18" height="12" />
              </slot>
              <span class="smaller-text">{{ origin.airportId }}</span>
            </span>
          </span>

          <!-- Arrow -->
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.7435 0.75L24.4919 5.51471M24.4919 5.51471L19.7435 10.2794M24.4919 5.51471H0.75"
              stroke="#092C4C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <!-- Arrival -->
          <span class="d-flex justify-content-between align-items-start flex-column">
            <p class="m-0 small-text fw-bold">{{ formatTimeReadable(arrivalTime) }}</p>
            <span class="d-flex gap-1 align-items-center">
              <slot name="arrival-icon">
                <AirPlaneTakeLandingIcon width="18" height="12" />
              </slot>
              <span class="smaller-text">{{ destination.airportId }}</span>
            </span>
          </span>
        </div>

        <!-- Duration + flight number -->
        <div class="d-flex gap-5 align-items-center p-2">
          <span class="smaller-text fw-bold">{{ formatMinutes(flightDuration) }}</span>
          <span class="smaller-text fw-bold">{{ flightNumber }}</span>
        </div>
      </div>

      <!-- Right side (price) -->
      <div
        class="col-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-around gap-1 p-0 w-50 ps-5 ps-sm-0">
        <div class="order-sm-2">
          <p class="small-text m-0">All-in fare</p>
          <p class="fw-bold m-0">{{ formatMoney(totalPrice) }}</p>
        </div>
        <div class="order-sm-1">
          <span class="d-flex align-items-center justify-content-start gap-1">
            <img :src="`/images/airlines/${airline.airlineId}.png`" alt="Airline Logo" class="carrier-logo" />
            <p class="extra-small-text-regular m-0">{{ airline.name }}</p>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-odd {
  background-color: var(--color-gray-6);
}

.list-even {
  background-color: var(--color-white);
}

.carrier-logo {
  width: 16px;
  height: 16px;
}

.list-group-item:hover {
  background-color: color-mix(in srgb, var(--color-primary) 20%, white);
  color: white;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

/* Highlight selected */
.selected {
  border: 2px solid var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 10%, white);
}

/* Checkmark positioning */
.checkmark {
  top: 8px;
  right: 10px;
  font-size: 1.4rem;
}

/* Fade-in animation for the icon */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
