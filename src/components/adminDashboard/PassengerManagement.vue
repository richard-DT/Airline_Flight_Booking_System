<template>
  <section class="mt-4">
    <h2 class="text-center mb-4">Passengers Management</h2>

    <!-- Search/filter bar -->
    <div class="mb-3 d-flex justify-content-center">
      <input
        type="text"
        class="form-control w-50"
        placeholder="Search by Booking ID or Name..."
        v-model="searchQuery"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading passengers...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Table of passengers -->
    <div v-if="!loading && filteredPassengers.length" class="table-responsive">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Passenger ID</th>
            <th>Booking ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Nationality</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in filteredPassengers" :key="p._id">
            <td>{{ index + 1 }}</td>
            <td>{{ p.passengerId }}</td>
            <td>{{ p.bookingId?.bookingId || "N/A" }}</td>
            <td>{{ p.firstName }}</td>
            <td>{{ p.lastName }}</td>
            <td>{{ p.nationality }}</td>
            <td>{{ formatDate(p.dateOfBirth) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="openEdit(p)">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !filteredPassengers.length" class="text-center mt-5">
      <p>No passengers found.</p>
    </div>

    <!-- Modal: Edit Passenger -->
    <div
      class="modal fade"
      id="passengerModal"
      tabindex="-1"
      aria-labelledby="passengerModalLabel"
      aria-hidden="true"
      ref="passengerModalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="passengerModalLabel">
              Edit Passenger — {{ selectedPassenger?.passengerId }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedPassenger">
            <form @submit.prevent="updatePassenger">
              <div class="mb-2">
                <label>First Name</label>
                <input v-model="passengerForm.firstName" class="form-control" required />
              </div>
              <div class="mb-2">
                <label>Last Name</label>
                <input v-model="passengerForm.lastName" class="form-control" required />
              </div>
              <div class="mb-2">
                <label>Nationality</label>
                <input v-model="passengerForm.nationality" class="form-control" required />
              </div>
              <div class="mb-2">
                <label>Date of Birth</label>
                <input v-model="passengerForm.dateOfBirth" type="date" class="form-control" required />
              </div>

              <div class="d-flex justify-content-end mt-3">
                <button type="submit" class="btn btn-primary me-2">Update</button>
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/api.js";
import { Modal } from "bootstrap";

const passengers = ref([]);
const loading = ref(true);
const error = ref("");
const selectedPassenger = ref(null);
const passengerModalRef = ref(null);
let passengerModal = null;
const searchQuery = ref("");

// Form state
const passengerForm = ref({
  firstName: "",
  lastName: "",
  nationality: "",
  dateOfBirth: "",
});

// Format date
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

// Fetch all passengers
const fetchPassengers = async () => {
  loading.value = true;
  try {
    const res = await api.get("/passengers");
    passengers.value = res.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load passengers.";
  } finally {
    loading.value = false;
  }
};

// Filtered passengers
const filteredPassengers = computed(() => {
  if (!searchQuery.value.trim()) return passengers.value;

  const query = searchQuery.value.toLowerCase();
  return passengers.value.filter((p) => {
    const bookingId = p.bookingId?.bookingId?.toLowerCase() || "";
    const firstName = p.firstName.toLowerCase();
    const lastName = p.lastName.toLowerCase();
    return bookingId.includes(query) || firstName.includes(query) || lastName.includes(query);
  });
});

// Open edit modal
const openEdit = (p) => {
  selectedPassenger.value = p;
  passengerForm.value = {
    firstName: p.firstName,
    lastName: p.lastName,
    nationality: p.nationality,
    dateOfBirth: p.dateOfBirth,
  };
  if (!passengerModal) passengerModal = new Modal(passengerModalRef.value);
  passengerModal.show();
};

// Close modal
const closeModal = () => {
  passengerModal.hide();
  selectedPassenger.value = null;
};

// Update passenger
const updatePassenger = async () => {
  try {
    await api.patch(`/passengers/${selectedPassenger.value._id}`, passengerForm.value);
    closeModal();
    fetchPassengers();
  } catch (err) {
    alert("Failed to update passenger.");
  }
};

onMounted(fetchPassengers);
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
