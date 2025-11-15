<template>
  <div class="container my-5 flex-grow-1 mx-auto px-2">
    <!-- Header -->
    <div class="profile-header mb-5 text-center text-md-start">
      <h1 class="fw-bold">Hello, {{ user.firstName }}!</h1>
      <p class="text-muted">
        Manage your flights, view status, and review past bookings.
      </p>
    </div>

    <!-- Add Booking Button -->
    <div class="d-flex justify-content-center justify-content-md-end mb-4">
      <button class="btn btn-primary fw-bold px-4 py-2" @click="toggleFlightSearch" :disabled="isLoading">
        <i class="bi bi-plus-lg me-2"></i>
        <span v-if="!isLoading">Add Booking</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </span>
      </button>

    </div>

    <!-- Flight Search Form (Toggled) -->
    <transition name="fade">
      <div v-if="showFlightSearch" class="mb-5 border rounded-3 p-4 bg-light shadow-sm">
        <h5 class="fw-bold mb-3">Search for Flights</h5>
        <FlightSearchForm />
      </div>
    </transition>

    <!-- Booking Tabs -->
    <ul class="nav nav-tabs profile-tabs mb-4" id="profileTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="current-tab" data-bs-toggle="tab" data-bs-target="#current-status"
          type="button" role="tab" aria-controls="current-status" aria-selected="true">
          Booking Status
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#booking-history" type="button"
          role="tab" aria-controls="booking-history" aria-selected="false">
          Booking History
        </button>
      </li>
    </ul>

    <div class="tab-content" id="profileTabContents">
      <!-- Current booking tab -->
      <!-- Current booking tab -->
      <div class="tab-pane fade show active" id="current-status" role="tabpanel" aria-labelledby="current-tab">
        <div v-if="currentBooking && currentBooking.flights && currentBooking.flights.length"
          class="alert alert-info shadow-sm border-0" role="alert">
          <h4 class="alert-heading">
            Upcoming Flight:
            {{ currentBooking.flights[0].origin.airportId }}
            to
            {{ currentBooking.flights[0].destination.airportId }}
          </h4>

          <p class="mb-2">
            Flight <strong>{{ currentBooking.flights[0].flightNumber }}</strong>.
            Departure:
            {{ formatDateReadable(currentBooking.flights[0].departureTime) }}
            at
            {{ formatTimeReadable(currentBooking.flights[0].departureTime) }}.
            Status:
            <span class="badge ms-1 px-2 py-1" :class="{
              'bg-success text-light': currentBooking.status?.toLowerCase() === 'confirmed',
              'bg-warning text-dark': ['pending', 'created'].includes(currentBooking.status?.toLowerCase()),
              'bg-danger text-light': currentBooking.status?.toLowerCase() === 'cancelled'
            }" style="font-size: 0.9rem;">
              {{ currentBooking.status }}
            </span>
          </p>

          <hr />
          <p class="mb-0">
            Your E-Ticket and check-in details are available below.
          </p>
        </div>

        <div v-else class="text-center p-5 border rounded bg-light">
          <p class="fw-bold mb-1">You have no upcoming flights.</p>
          <p class="text-muted">Start by adding a new booking.</p>
        </div>
      </div>



      <!-- Booking history tab -->
      <div class="tab-pane fade" id="booking-history" role="tabpanel" aria-labelledby="history-tab">
        <div v-for="booking in bookingHistory" :key="booking.bookingId" class="card shadow-sm mb-3 border-0">
          <div class="card-body">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
              <div>
                <h5 class="fw-bold mb-1">
                  {{ booking.flights[0].origin.airportId }} → {{ booking.flights[0].destination.airportId }}
                </h5>
                <p class="mb-1 text-muted">
                  Flight {{ booking.flights[0].flightNumber }} •
                  {{ formatDateReadable(booking.flights[0].departureTime) }}
                </p>
                <small class="text-secondary">Total paid: {{ formatMoney(booking.totalAmount) }} PHP</small>
              </div>

              <span class="badge fs-6 mt-3 mt-md-0" :class="{
                'bg-success': booking.status === 'Completed',
                'bg-warning text-dark': booking.status === 'Cancelled',
                'bg-info text-dark': booking.status === 'Confirmed'
              }">
                {{ booking.status }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="bookingHistory.length === 0" class="text-center p-5 border rounded bg-light mt-5">
          <p class="fw-bold mb-1">No booking history found.</p>
          <p class="text-muted">Start booking your flights today!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/api.js';
import FlightSearchForm from '@/components/common/FlightSearchForm.vue';
import { useUserStore } from '@/stores/user';
import { formatDateReadable, formatTimeReadable } from '@/utils/date';
import { formatMoney } from '@/utils/string';
import { Notyf } from "notyf";
import { onMounted, ref } from 'vue';


const userStore = useUserStore();
const { user } = userStore;

const currentBooking = ref(null);
const bookingHistory = ref([]);
const showFlightSearch = ref(false);
const isLoading = ref(false);


const notyf = new Notyf({ duration: 3000, position: { x: "right", y: "bottom" } });


const toggleFlightSearch = () => {
  showFlightSearch.value = !showFlightSearch.value;
};

// Fetch current booking
const fetchCurrentBooking = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/bookings/current');
    currentBooking.value = res.data || null;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      currentBooking.value = null;
      console.info("No current booking found.");
    } else {
      console.error("Error fetching current booking:", err);
      notyf.error("Failed to load your current booking.");
    }
  } finally {
    isLoading.value = false;
  }
};

// Fetch booking history
const fetchBookingHistory = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/bookings/history');
    bookingHistory.value = res.data;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load booking history.");
  } finally {
    isLoading.value = false;
  }
};




onMounted(() => {
  fetchCurrentBooking();
  fetchBookingHistory();
});
</script>

<style scoped>
/* Smooth transition for flight search form */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .profile-header h1 {
    font-size: 1.8rem;
  }

  .profile-tabs {
    flex-wrap: wrap;
  }
}
</style>
