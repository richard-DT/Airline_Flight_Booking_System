<script setup>
import DatePicker from '@/components/common/DatePicker.vue';
import DestinationSelect from '@/components/common/DestinationSelect.vue';
import PaxCabinPicker from '@/components/common/PaxCabinPicker.vue';
import { useAirportsStore } from '@/stores/airports';
import { useFlightSearchStore } from '@/stores/flightSearch';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const airportStore = useAirportsStore();
const { airports, isLoading } = storeToRefs(airportStore);
const flightStore = useFlightSearchStore();
const {
  tripType,
  from,
  to,
  departureDate,
  returnDate,
  pax,
  cabin,
  isSearching,
  flights
} = storeToRefs(flightStore);
const { setFlightSearchData, searchFlights } = flightStore;
const isReturnDateDisabled = ref(tripType.value === 'oneWayTrip');


// --- Form state ---
const form = reactive({
  tripType: tripType,
  from: from,
  to: to,
  departureDate: departureDate,
  returnDate: returnDate,
  paxCabin: {
    pax: pax,
    cabin: cabin,
  },
});

// --- Validation errors ---
const errors = reactive({
  from: '',
  to: '',
  departureDate: '',
  returnDate: '',
});

// --- Watchers ---
watch(
  () => form.tripType,
  (val) => {
    isReturnDateDisabled.value = val === 'oneWayTrip';
    if (val === 'oneWayTrip') {
      form.returnDate = '';
      errors.returnDate = '';
    }
  }
);

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


// --- Functions ---
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

async function submitForm() {
  if (!validateForm()) return;

  // Update store
  setFlightSearchData({
    ...form,
    pax: form.paxCabin.pax,
    cabin: form.paxCabin.cabin,
    flightType: form.to.country === form.from.country ? 'domestic' : 'international'
  });

  // Search flights
  const success = await searchFlights();

  //Redirect users to flights results page
  if (success) router.push({ name: 'flights' });
}
</script>

<template>
  <form class="hero-form bg-white p-3 p-lg-5 pb-lg-4 mx-auto" @submit.prevent="submitForm">
    <div class="row g-3">
      <!-- Trip Type -->
      <div class="col-12 d-flex gap-4">
        <div class="form-check">
          <input class="form-check-input" type="radio" id="oneWayTrip" value="oneWayTrip" v-model="form.tripType" />
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
        <DestinationSelect label="Departure" v-model="form.from" :options="airports" placeholder="From"
          :is-disabled="isLoading" />
        <div class="text-danger small" style="min-height:1.5em">{{ errors.from }}</div>
      </div>

      <!-- Destination -->
      <div class="col-12 col-md-6 mt-2">
        <DestinationSelect label="Destination" v-model="form.to" :options="airports" placeholder="To"
          :is-disabled="isLoading" />
        <div class="text-danger small" style="min-height:1.5em">{{ errors.to }}</div>
      </div>

      <!-- Departure Date -->
      <div class="col-12 col-md-6 mt-2">
        <DatePicker label="Departure Date" v-model="form.departureDate" />
        <div class="text-danger small" style="min-height:1.5em">{{ errors.departureDate }}</div>
      </div>

      <!-- Return Date -->
      <div class="col-12 col-md-6 mt-2">
        <DatePicker label="Return Date" v-model="form.returnDate" :is-disabled="isReturnDateDisabled" />
        <div class="text-danger small" style="min-height:1.5em">{{ errors.returnDate }}</div>
      </div>

      <!-- Passengers & Cabin -->
      <div class="col-12 col-md-6 col-lg-4">
        <PaxCabinPicker v-model="form.paxCabin" />
      </div>

      <!-- Submit -->
      <div class="col-12 col-md-6 col-lg-4 ms-md-auto align-items-end d-flex mb-md-3">
        <button type="submit"
          class="btn btn-primary py-3 py-md-2 w-100 fw-bold d-flex justify-content-center gap-2 align-items-center"
          :disabled="isSearching">

          <div v-if="isSearching" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Searching...</span>
          </div>
          <i v-else class="bi bi-search"></i>
          <span v-if="isSearching">Searching...</span>
          <span v-else="isSearching">Search Flight</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.hero-form {
  color: var(--color-primary) !important;
  box-shadow: var(--shadow-card);
  border-radius: 15px;
  max-width: 1000px;
}

.hero-form .form-label {
  color: var(--color-primary) !important;
}

.hero-form .form-control {
  border: 0;
  background-color: var(--color-gray-6);
  text-align: center;
}
</style>
