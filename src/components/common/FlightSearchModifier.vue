<script setup>
import { cabinTypes } from '@/data/flights'
import { useAirportsStore } from '@/stores/airports'
import { useFlightSearchStore } from '@/stores/flightSearch'
import { formatDateReadable } from '@/utils/date'
import { Modal } from 'bootstrap'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DropdownComponent from '../ui/DropdownComponent.vue'
import DatePicker from './DatePicker.vue'
import DestinationSelect from './DestinationSelect.vue'

const { airports } = useAirportsStore();
const flightStore = useFlightSearchStore()
const { tripType, from, to, departureDate, returnDate, pax, cabin, flights } = storeToRefs(flightStore)
const totalPassengers = computed(() => pax.value.adults + pax.value.children + pax.value.infants)

// Modal reference
let modalInstance = null
const modalEl = ref(null)

// Form state
const form = reactive({
  tripType: flightStore.tripType,
  from: flightStore.from,
  to: flightStore.to,
  departureDate: flightStore.departureDate,
  returnDate: flightStore.returnDate,
  pax: flightStore.pax,
  cabin: flightStore.cabin,
});

const isReturnDateDisabled = ref(flightStore.tripType === 'oneWayTrip');

// --- Validation errors ---
const errors = reactive({
  from: '',
  to: '',
  departureDate: '',
  returnDate: '',
});

watch(
  () => ({ ...form }),
  (newForm) => {
    if (newForm.from) errors.from = '';
    if (newForm.to) errors.to = '';
    if (newForm.departureDate) errors.departureDate = '';
    if (newForm.tripType === 'roundTrip' && newForm.returnDate) errors.returnDate = '';
  },
  { deep: true }
);

watch(
  () => form.tripType,
  (val) => {
    isReturnDateDisabled.value = val === 'oneWayTrip';
    if (val === 'oneWayTrip') {
      form.returnDate = '';
      errors.returnDate = ''; // clear return date error if switching to one way
    }
  }
);

onMounted(() => {
  if (modalEl.value) modalInstance = new Modal(modalEl.value)
})

function validateForm() {
  let valid = true;
  errors.from = '';
  errors.to = '';
  errors.departureDate = '';
  errors.returnDate = '';

  if (!form.from) { errors.from = 'Departure cannot be empty'; valid = false; }
  if (!form.to) { errors.to = 'Destination cannot be empty'; valid = false; }
  if (form.from && form.to) {
    const sameAirport =
      form.from.airportId && form.to.airportId
        ? form.from.airportId === form.to.airportId
        : form.from === form.to;

    if (sameAirport) {
      errors.from = 'Departure and destination cannot be the same';
      errors.to = 'Departure and destination cannot be the same';
      valid = false;
    }
  }
  if (!form.departureDate) { errors.departureDate = 'Departure date cannot be empty'; valid = false; }
  if (form.tripType === 'roundTrip' && !form.returnDate) { errors.returnDate = 'Return date cannot be empty'; valid = false; }

  return valid;
}

function openModal() {
  modalInstance?.show()
}

function increment(key) {
  form.pax[key]++
}

function decrement(key) {
  if (key === 'adults' && form.pax.adults <= 1) return
  if (form.pax[key] > 0) form.pax[key]--
}


async function handleSubmit() {
  // ✅ Validate before proceeding
  const isValid = validateForm();
  if (!isValid) return;

  // Update store only if valid
  flightStore.setFlightSearchData({
    ...form,
    flightType: form.to.country === form.from.country ? 'domestic' : 'international'
  });

  // Search for flights
  const success = await flightStore.searchFlights();

  modalInstance?.hide();
}
</script>


<template>
  <div class="py-3 row mx-0 text-white bg-primary rounded-3">
    <div class="col-8" v-if="flights.length !== 0">
      <div class="d-flex gap-3 align-items-center flex-wrap">
        <!-- From airport -->
        <div class="text-center text-md-start">
          <p class="m-0 normal-text-bold">{{ from?.airportId }}</p>
          <p class="m-0 extra-small-text-regular text-break d-none d-md-block">{{ from?.name }}</p>
        </div>

        <!-- Arrow icon -->
        <i class="bi bi-airplane fs-4 rotate-90"></i>

        <!-- To airport -->
        <div class="text-center text-md-start">
          <p class="m-0 normal-text-bold">{{ to?.airportId }}</p>
          <p class="m-0 extra-small-text-regular text-break d-none d-md-block">{{ to?.name }}</p>
        </div>
      </div>
      <span>
        <p class="m-0 fw-light small-text">
          {{ formatDateReadable(departureDate) }}
          {{ returnDate ? ` - ${formatDateReadable(returnDate)}` : '' }}
        </p>
      </span>
      <span class="d-flex gap-3 fw-light align-items-center small-text">
        <p class="m-0">{{ tripType === 'oneWayTrip' ? 'One way' : 'Round trip' }}</p>
        <p class="m-0">{{ cabin }}</p>
        <p class="m-0">{{ totalPassengers }} Pax</p>
      </span>
    </div>

    <div class=" d-flex  align-items-center"
      :class="`${flights.length === 0 ? 'col-12 justify-content-center' : 'col-4 justify-content-end'}`">
      <button class="btn btn-secondary float-end" @click="openModal">
        {{ flights.length === 0 ? 'Search Flight' : 'Modify' }}
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="modifyModal" tabindex="-1" aria-labelledby="modifyModalLabel" aria-hidden="true"
    ref="modalEl">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-primary medium-text-bold" id="modifyModalLabel">
            {{ flights.length === 0 ? 'Search Flight' : 'Modify Search' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="row g-3">
            <!-- Trip Type -->
            <div class="col-12 d-flex gap-4">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="oneWayTrip" value="oneWayTrip"
                  v-model="form.tripType" />
                <label class="form-check-label" for="oneWayTrip">One Way</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="roundTrip" value="roundTrip" v-model="form.tripType"
                  disabled />
                <label class="form-check-label" for="roundTrip">Round Trip</label>
              </div>
            </div>

            <!-- Departure -->
            <div class="col-12 col-md-6 mt-2">
              <DestinationSelect label="Departure" v-model="form.from" :options="airports" placeholder="From" />
              <small class="text-danger error-text">
                {{ errors.from || '\u00A0' }} <!-- non-breaking space when empty -->
              </small>
            </div>

            <!-- Destination -->
            <div class="col-12 col-md-6 mt-2">
              <DestinationSelect label="Destination" v-model="form.to" :options="airports" placeholder="To" />
              <small class="text-danger error-text">
                {{ errors.to || '\u00A0' }}
              </small>
            </div>

            <!-- Departure Date -->
            <div class="col-12 col-md-6 mt-2">
              <DatePicker label="Departure Date" v-model="form.departureDate" />
              <small class="text-danger error-text">
                {{ errors.departureDate || '\u00A0' }}
              </small>
            </div>

            <!-- Return Date -->
            <div class="col-12 col-md-6 mt-2">
              <DatePicker label="Return Date" v-model="form.returnDate" :is-disabled="isReturnDateDisabled" />
              <small class="text-danger error-text">
                {{ errors.returnDate || '\u00A0' }}
              </small>
            </div>

            <!-- Passengers -->
            <div class="col-6 col-md-6 mt-2">
              <label class="form-label fw-semibold">Passengers</label>
              <div v-for="(count, key) in form.pax" :key="key"
                class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-capitalize">{{ key }}</span>
                <div class="btn-group">
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="decrement(key)">-</button>
                  <span class="px-3 pt-1">{{ count }}</span>
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="increment(key)">+</button>
                </div>
              </div>
            </div>
            <!-- Cabin -->
            <div class="col-4 col-md-3 mt-2">
              <DropdownComponent label="Cabin Class" v-model="form.cabin" :items="cabinTypes" />
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="flightStore.isSearching">
            <span v-if="flightStore.isSearching">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>

              Searching...

            </span>
            <span v-else>Apply</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.rotate-90 {
  transform: rotate(90deg);
  display: inline-block;
}

.error-text {
  display: block;
  min-height: 1rem;
}
</style>
