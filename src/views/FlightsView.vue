<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import FlightListItem from '@/components/common/FlightListItem.vue';
import FlightSearchModifier from '@/components/common/FlightSearchModifier.vue';
import ProgressBar from '@/components/common/ProgressBar.vue';
import AirPlaneLandingIcon from '@/components/icons/AirPlaneLandingIcon.vue';
import AirPlaneTakeOffIcon from '@/components/icons/AirPlaneTakeOffIcon.vue';
import StickyButtonGroup from '@/components/ui/StickyButtonGroup.vue';
import { useFlightSearchStore } from '@/stores/flightSearch';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const flightStore = useFlightSearchStore()
const { flights, isSearching, error, selectedFlight } = storeToRefs(flightStore)

// sample flight object in flights array
// {
//     "pricePerCabin": {
//         "economy": 2172,
//         "business": 3258,
//         "first": 4344
//     },
//     "_id": "6914dd6a17ccd173ea89a281",
//     "airline": {
//         "_id": "690a96b902f2d8f5357437be",
//         "airlineId": "PAL",
//         "name": "Philippine Airlines",
//         "country": "Philippines",
//         "iataCode": "PR",
//         "icaoCode": "PAL",
//         "logoUrl": "/images/airlines/PAL.png",
//         "website": "https://www.philippineairlines.com",
//         "__v": 0,
//         "createdAt": "2025-11-05T00:13:45.910Z",
//         "updatedAt": "2025-11-05T00:13:45.910Z"
//     },
//     "flightNumber": "PR460",
//     "origin": {
//         "_id": "690a97dd27504c87ff1d822c",
//         "airportId": "MNL",
//         "name": "Ninoy Aquino International Airport",
//         "city": "Manila",
//         "country": "Philippines",
//         "type": "international",
//         "timezone": "Asia/Manila",
//         "latitude": 14.5086,
//         "longitude": 121.0197,
//         "__v": 0,
//         "createdAt": "2025-11-05T00:18:37.038Z",
//         "updatedAt": "2025-11-05T00:18:37.038Z"
//     },
//     "destination": {
//         "_id": "690a97dd27504c87ff1d822d",
//         "airportId": "CEB",
//         "name": "Mactan-Cebu International Airport",
//         "city": "Cebu",
//         "country": "Philippines",
//         "type": "international",
//         "timezone": "Asia/Manila",
//         "latitude": 10.3073,
//         "longitude": 123.978,
//         "__v": 0,
//         "createdAt": "2025-11-05T00:18:37.039Z",
//         "updatedAt": "2025-11-05T00:18:37.039Z"
//     },
//     "departureTime": "2025-11-14T05:00:00.000Z",
//     "arrivalTime": "2025-11-14T05:43:00.000Z",
//     "flightType": "domestic",
//     "status": "scheduled",
//     "flightDuration": 43,
//     "basePrice": 2172,
//     "createdAt": "2025-11-12T19:18:02.792Z",
//     "updatedAt": "2025-11-12T19:18:02.792Z",
//     "flightId": "FL-20251112-0016",
//     "__v": 0
// }

const filterAndSortModal = ref(null);

function showFilterAndSortModal() {
  filterAndSortModal.value.open()
}

const showFilter = ref(true)
const showSort = ref(true)


// Filters

// Time of Flight
const flightTimeType = ref('departure')
const quarterOfDay = ref('');

// Price Range
const minPrice = ref(0);
const maxPrice = ref(200000);

// Sorts
const sortBy = ref('departureEarliest');


const filteredAndSortedFlights = computed(() => {
  if (!flights.value) return [];

  // Make a shallow copy
  let list = [...flights.value];

  // ----------------------------
  // 1. FILTERING
  // ----------------------------

  // TIME FILTER (departure/arrival)
  if (quarterOfDay.value) {
    const quarterRanges = {
      '1Q': [0, 6],         // 12 AM - 6 AM
      '2Q': [6, 12],        // 6 AM - 12 PM
      '3Q': [12, 18],       // 12 PM - 6 PM
      '4Q': [18, 24],       // 6 PM - 12 AM
    };

    const [minHour, maxHour] = quarterRanges[quarterOfDay.value];

    list = list.filter(flight => {
      const time = new Date(
        flightTimeType.value === 'departure'
          ? flight.departureTime
          : flight.arrivalTime
      );

      const hour = time.getHours();
      return hour >= minHour && hour < maxHour;
    });
  }

  // PRICE FILTER
  list = list.filter(flight => {
    return (
      flight.basePrice >= minPrice.value &&
      flight.basePrice <= maxPrice.value
    );
  });

  // ----------------------------
  // 2. SORTING
  // ----------------------------

  list.sort((a, b) => {
    switch (sortBy.value) {
      case 'departureEarliest':
        return new Date(a.departureTime) - new Date(b.departureTime);

      case 'arrivalEarliest':
        return new Date(a.arrivalTime) - new Date(b.arrivalTime);

      case 'durationShortest':
        return a.flightDuration - b.flightDuration;

      case 'priceCheapest':
        return a.basePrice - b.basePrice;

      default:
        return 0;
    }
  });

  return list;
});

function resetFiltersAndSort() {
  // Filters
  flightTimeType.value = 'departure';
  quarterOfDay.value = '';
  minPrice.value = 0;
  maxPrice.value = 200000;

  // Sorting
  sortBy.value = 'departureEarliest';
}


watch(minPrice, (val) => {
  if (val > maxPrice.value - 1000) {
    minPrice.value = maxPrice.value - 1000;
  }
});

watch(maxPrice, (val) => {
  if (val < minPrice.value + 1000) {
    maxPrice.value = minPrice.value + 1000;
  }
});

function toggleFilter() {
  showFilter.value = !showFilter.value
}

function toggleSort() {
  showSort.value = !showSort.value
}

</script>

<template>
  <div class="container-fluid d-flex flex-column p-0 flight flights-page">
    <div class="container-fluid px-2 pt-1 pb-2">
      <!-- Progress -->
      <ProgressBar title="Flights" :steps="5" :currentStep="1" />

      <div class="container flights-results-container">
        <!-- Modify search -->
        <FlightSearchModifier />

        <!-- Filters header -->
        <div class="mx-1 mt-1 mb-3 py-2 d-flex justify-content-between align-items-center smaller-text"
          v-if="flights.length !== 0">
          <span class="d-flex gap-1 justify-content-between align-items-center cursor-pointer"
            @click="showFilterAndSortModal">
            <i class="bi bi-funnel"></i>
            Filters
          </span>
          <span class="cursor-pointer" @click="showFilterAndSortModal">Sort by: Earliest first</span>
        </div>

        <!-- Results -->
        <div class="list-group">
          <div v-if="isSearching" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 small">Searching flights...</p>
          </div>

          <div v-else-if="error" class="alert alert-danger text-center mt-2">
            {{ error }}. Please try again.
          </div>

          <div v-else-if="flights.length === 0" class="text-center py-5">
            <p class="text-muted">No flights found.</p>
          </div>

          <FlightListItem v-else v-for="(flight, index) in filteredAndSortedFlights" :key="flight.flightNumber"
            :flightData="flight" :index="index" />

        </div>
      </div>
    </div>

    <!-- Sticky Button -->
    <StickyButtonGroup primaryText="Continue" primaryLink="/guests" secondaryText="Back" :showSecondary="false"
      v-if="filteredAndSortedFlights.length !== 0" :isPrimaryDisabled="!selectedFlight" />
  </div>

  <BaseModal ref="filterAndSortModal" title="Filter and Sort">
    <template #body>
      <!-- Filter by -->
      <div class=" py-2">
        <div class="d-flex justify-content-between align-items-center cursor-pointer" @click="toggleFilter">
          <h6 class="mb-0 fw-bold fs-5">Filter by</h6>
          <i class="bi" :class="showFilter ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </div>

        <transition name="collapse">
          <div v-if="showFilter" class="mt-2">
            <!-- Time of flight -->
            <div class="mt-4">
              <p class="m-0 mb-2">Time of flight</p>
            </div>

            <div class="btn-group w-100 mb-2" role="group" aria-label="Basic radio toggle button group">
              <!-- Departure -->
              <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="departure"
                v-model="flightTimeType" />
              <label class="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-1"
                for="btnradio1">
                <AirPlaneTakeOffIcon width="18" height="12" />
                Departure
              </label>

              <!-- Arrival -->
              <input type="radio" class="btn-check" name="btnradio" id="btnradio2" value="arrival"
                v-model="flightTimeType" />
              <label class="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-1"
                for="btnradio2">
                <AirPlaneLandingIcon width="18" height="12" />
                Arrival
              </label>
            </div>

            <!-- Time options -->
            <div class="form-check">
              <input class="form-check-input" type="radio" id="1Q" name="timeOfFlight" value="1Q"
                v-model="quarterOfDay" />
              <label class="form-check-label" for="1Q">12:00 AM - 06:00 AM</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="2Q" name="timeOfFlight" value="2Q"
                v-model="quarterOfDay" />
              <label class="form-check-label" for="2Q">06:01 AM - 12:00 PM</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="3Q" name="timeOfFlight" value="3Q"
                v-model="quarterOfDay" />
              <label class="form-check-label" for="3Q">12:01 PM - 06:00 PM</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="4Q" name="timeOfFlight" value="4Q"
                v-model="quarterOfDay" />
              <label class="form-check-label" for="4Q">06:01 PM - 11:59 PM</label>
            </div>

            <!-- Price range -->
            <div class="mt-4 mb-4">
              <h6 class="mb-3">Price range</h6>

              <div class="position-relative" style="height: 20px;">
                <!-- Min slider -->
                <input type="range" class="form-range slider-min position-absolute top-0 start-0 w-100" min="0"
                  max="200000" step="1000" v-model.number="minPrice" :max="maxPrice - 1000" />

                <!-- Max slider -->
                <input type="range" class="form-range slider-max position-absolute top-0 start-0 w-100" min="0"
                  max="200000" step="1000" v-model.number="maxPrice" :min="minPrice + 1000"
                  style="background: transparent;" />
              </div>

              <div class="d-flex justify-content-between">
                <span>₱{{ minPrice.toLocaleString() }}</span>
                <span>₱{{ maxPrice.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Sort by -->
      <div class="py-2 mt-4">
        <div class="d-flex justify-content-between align-items-center cursor-pointer" @click="toggleSort">
          <h6 class="mb-0 fw-bold fs-5">Sort by</h6>
          <i class="bi" :class="showSort ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </div>

        <transition name="collapse">
          <div v-if="showSort" class="mt-2">
            <!-- Your sort controls go here -->
            <div class="form-check">
              <input class="form-check-input" type="radio" name="sortOptions" id="departureEarliest"
                value="departureEarliest" checked v-model="sortBy" />
              <label class="form-check-label" for="departureEarliest">
                Departure: Earliest first
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="sortOptions" id="arrivalEarliest"
                value="arrivalEarliest" v-model="sortBy" />
              <label class="form-check-label" for="arrivalEarliest">
                Arrival: Earliest first
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="sortOptions" id="durationShortest"
                value="durationShortest" v-model="sortBy" />
              <label class="form-check-label" for="durationShortest">
                Flight duration: Shortest first
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="radio" name="sortOptions" id="priceCheapest" value="priceCheapest"
                v-model="sortBy" />
              <label class="form-check-label" for="priceCheapest">
                Price: Lowest first
              </label>
            </div>
          </div>
        </transition>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-outline-primary w-100" @click="resetFiltersAndSort">
        Reset Filters & Sorting
      </button>
    </template>
  </BaseModal>
</template>


<style scoped>
.flights-page {
  max-width: 800px;
}

.cursor-pointer {
  cursor: pointer;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}

.slider-min,
.slider-max {
  pointer-events: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
}

.slider-min::-webkit-slider-thumb,
.slider-max::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
}

.slider-min::-webkit-slider-thumb {
  background: #dee2e6;
  z-index: 3;
  position: relative;
}

.slider-max::-webkit-slider-thumb {
  background: var(--color-primary);
}

.slider-min {
  z-index: 2;
}

.slider-max {
  z-index: 3;
}

.slider-min,
.slider-max {
  background: #dee2e6;
}

.slider-min::before,
.slider-max::before {
  content: "";
  position: absolute;
  height: 8px;
  border-radius: 5px;
  background: #0d6efd;
  z-index: 1;
}
</style>
