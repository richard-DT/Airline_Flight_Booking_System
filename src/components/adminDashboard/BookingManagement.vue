<template>
  <section class="mt-4">
    <h2 class="text-center mb-4">Bookings Management</h2>

    <!-- Filters -->
    <div class="mb-3 d-flex gap-2 justify-content-center flex-wrap">
      <select v-model="filterStatus" class="form-select w-auto">
        <option value="">All Status</option>
        <option value="created">Created</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input type="date" v-model="filterStartDate" class="form-control w-auto" />
      <input type="date" v-model="filterEndDate" class="form-control w-auto" />

      <input type="text" v-model="filterBookingId" placeholder="Booking ID" class="form-control w-auto" />

      <button class="btn btn-primary" @click="fetchBookings">Filter</button>
      <button class="btn btn-secondary" @click="resetFilters">Reset</button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading all bookings...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Table of bookings -->
    <div v-if="!loading && bookings.length" class="table-responsive">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Booking ID</th>
            <th>User Email</th>
            <th>Trip Type</th>
            <th>Passengers</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="booking._id">
            <td>{{ index + 1 }}</td>
            <td>{{ booking.bookingId }}</td>
            <td>{{ booking.userId?.email || "N/A" }}</td>
            <td>{{ booking.tripType }}</td>
            <td>{{ booking.passengerCount }}</td>
            <td>₱{{ booking.totalAmount?.toLocaleString() }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning text-dark': booking.status === 'created',
                  'bg-info': booking.status === 'confirmed',
                  'bg-success': booking.status === 'completed',
                  'bg-danger': booking.status === 'cancelled'
                }"
              >
                {{ booking.status }}
              </span>
            </td>
            <td>{{ formatDate(booking.bookingDate) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="viewBooking(booking)">
                View
              </button>
              <select v-model="booking.status" class="form-select form-select-sm w-auto d-inline" @change="updateStatus(booking)">
                <option value="created">Created</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button class="btn btn-sm btn-danger ms-1" @click="cancelBooking(booking)">
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !bookings.length" class="text-center mt-5">
      <p>No bookings found.</p>
    </div>

    <!-- Modal: View Booking Details -->
    <div
      class="modal fade"
      id="bookingModal"
      tabindex="-1"
      aria-labelledby="bookingModalLabel"
      aria-hidden="true"
      ref="bookingModalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="bookingModalLabel">
              Booking Details — {{ selectedBooking?.bookingId }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedBooking">
            <p><strong>User:</strong> {{ selectedBooking.userId?.email }}</p>
            <p><strong>Trip Type:</strong> {{ selectedBooking.tripType }}</p>
            <p><strong>Total Amount:</strong> ₱{{ selectedBooking.totalAmount?.toLocaleString() }}</p>
            <p><strong>Status:</strong> {{ selectedBooking.status }}</p>
            <p><strong>Booking Date:</strong> {{ formatDate(selectedBooking.bookingDate) }}</p>

            <h6 class="mt-4">Passengers:</h6>
            <ul>
              <li v-for="p in selectedBooking.passengers" :key="p._id">
                {{ p.firstName }} {{ p.lastName }} — {{ p.email }}
              </li>
            </ul>

            <h6 class="mt-4">Flights:</h6>
            <ul>
              <li v-for="f in selectedBooking.flights" :key="f._id">
                {{ f.origin?.name }} → {{ f.destination?.name }}
                <br />
                <small>{{ f.airline?.name }} | {{ f.flightNumber }}</small>
              </li>
            </ul>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../.././api/api"; // your axios instance
import { Modal } from "bootstrap";

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedBooking = ref(null);
const bookingModalRef = ref(null);
let bookingModal = null;

// Filters
const filterStatus = ref("");
const filterStartDate = ref("");
const filterEndDate = ref("");
const filterBookingId = ref("");

// Format date
const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

// Fetch bookings with optional filters
const fetchBookings = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = {};
    if (filterStatus.value) params.status = filterStatus.value;
    if (filterStartDate.value) params.startDate = filterStartDate.value;
    if (filterEndDate.value) params.endDate = filterEndDate.value;
    if (filterBookingId.value) params.bookingId = filterBookingId.value;

    const res = await api.get("/bookings/admin", { params });
    bookings.value = res.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load bookings.";
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filterStatus.value = "";
  filterStartDate.value = "";
  filterEndDate.value = "";
  filterBookingId.value = "";
  fetchBookings();
};

// View booking modal
const viewBooking = (booking) => {
  selectedBooking.value = booking;
  if (!bookingModal) bookingModal = new Modal(bookingModalRef.value);
  bookingModal.show();
};

// Update booking status
const updateStatus = async (booking) => {
  try {
    await api.put(`/bookings/admin/${booking._id}/status`, { status: booking.status });
    alert("Status updated successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update status.");
  }
};

// Cancel booking
const cancelBooking = async (booking) => {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  try {
    await api.put(`/bookings/admin/${booking._id}/status`, { status: "cancelled" });
    booking.status = "cancelled";
    alert("Booking cancelled successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to cancel booking.");
  }
};

onMounted(fetchBookings);
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.modal-body {
  line-height: 1.6;
}
</style>
