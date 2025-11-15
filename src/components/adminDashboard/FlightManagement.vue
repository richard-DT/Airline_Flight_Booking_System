<template>
  <div class="text-center">
    <h2 class="text-primary mb-4">Flight Management</h2>
    <button class="btn btn-success mb-3" @click="openCreateModal">Add New Flight</button>

    <div v-if="loading" class="text-muted">Loading flights...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <table v-if="!loading && flights.length" class="table table-striped table-bordered align-middle">
      <thead class="table-primary">
        <tr>
          <th>Flight ID</th>
          <th>Airline</th>
          <th>Flight Number</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Type</th>
          <th>Status</th>
          <th>Base Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="flight in flights" :key="flight._id">
          <td>{{ flight.flightId }}</td>
          <td>{{ flight.airline.name }} ({{ flight.airline.iataCode }})</td>
          <td>{{ flight.flightNumber }}</td>
          <td>{{ flight.origin.city }}</td>
          <td>{{ flight.destination.city }}</td>
          <td>{{ dayjs(flight.departureTime).format("YYYY-MM-DD HH:mm") }}</td>
          <td>{{ dayjs(flight.arrivalTime).format("YYYY-MM-DD HH:mm") }}</td>
          <td>{{ flight.flightType }}</td>
          <td>{{ flight.status }}</td>
          <td>{{ flight.basePrice.toFixed(2) }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" @click="openEditModal(flight)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="deleteFlight(flight._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal (one modal for both create and edit) -->
    <div class="modal fade" id="flightModal" tabindex="-1" aria-hidden="true" ref="flightModalRef">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ modalMode === 'create' ? 'Add Flight' : 'Edit Flight' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="modalMode === 'create' ? createFlight() : updateFlight()">
              <div class="mb-2">
                <label>Airline</label>
                <select v-model="flightForm.airline" class="form-select" required>
                  <option v-for="a in airlines" :key="a._id" :value="a._id">{{ a.name }}</option>
                </select>
              </div>
              <div class="mb-2">
                <label>Flight Number</label>
                <input v-model="flightForm.flightNumber" class="form-control" required />
              </div>
              <div class="mb-2">
                <label>Origin</label>
                <select v-model="flightForm.origin" class="form-select" required>
                  <option v-for="a in airports" :key="a._id" :value="a._id">{{ a.city }} ({{ a.airportId }})</option>
                </select>
              </div>
              <div class="mb-2">
                <label>Destination</label>
                <select v-model="flightForm.destination" class="form-select" required>
                  <option v-for="a in airports" :key="a._id" :value="a._id">{{ a.city }} ({{ a.airportId }})</option>
                </select>
              </div>
              <div class="mb-2">
                <label>Departure Time</label>
                <input v-model="flightForm.departureTime" type="datetime-local" class="form-control" required/>
              </div>
              <div class="mb-2">
                <label>Arrival Time</label>
                <input v-model="flightForm.arrivalTime" type="datetime-local" class="form-control" required/>
              </div>
              <div class="mb-2">
                <label>Flight Type</label>
                <select v-model="flightForm.flightType" class="form-select">
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div class="mb-2">
                <label>Status</label>
                <select v-model="flightForm.status" class="form-select">
                  <option value="scheduled">Scheduled</option>
                  <option value="boarding">Boarding</option>
                  <option value="departed">Departed</option>
                  <option value="arrived">Arrived</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="mb-2">
                <label>Base Price</label>
                <input v-model.number="flightForm.basePrice" type="number" class="form-control" required/>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <button type="submit" class="btn btn-primary me-2">{{ modalMode === 'create' ? 'Create' : 'Update' }}</button>
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api.js";
import dayjs from "dayjs";
import { Modal } from "bootstrap";

const flights = ref([]);
const loading = ref(true);
const error = ref("");

const airlines = ref([]);
const airports = ref([]);

const flightForm = ref({
  airline: "",
  flightNumber: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  flightType: "domestic",
  status: "scheduled",
  basePrice: 0,
});

const selectedFlight = ref(null);
const modalMode = ref("create");
const flightModalRef = ref(null);
let flightModal = null;

const fetchFlights = async () => {
  loading.value = true;
  try {
    const res = await api.get("/flights");
    flights.value = res.data;
  } catch (err) {
    error.value = "Failed to load flights";
  } finally {
    loading.value = false;
  }
};

const fetchOptions = async () => {
  try {
    const [airlineRes, airportRes] = await Promise.all([api.get("/airlines"), api.get("/airports")]);
    airlines.value = airlineRes.data;
    airports.value = airportRes.data;
  } catch (err) {
    console.error("Failed to load options", err);
  }
};

const openCreateModal = () => {
  modalMode.value = "create";
  resetForm();
  if (!flightModal) flightModal = new Modal(flightModalRef.value);
  flightModal.show();
};

const openEditModal = (flight) => {
  modalMode.value = "edit";
  selectedFlight.value = flight;
  flightForm.value = {
    airline: flight.airline._id,
    flightNumber: flight.flightNumber,
    origin: flight.origin._id,
    destination: flight.destination._id,
    departureTime: dayjs(flight.departureTime).format("YYYY-MM-DDTHH:mm"),
    arrivalTime: dayjs(flight.arrivalTime).format("YYYY-MM-DDTHH:mm"),
    flightType: flight.flightType,
    status: flight.status,
    basePrice: flight.basePrice,
  };
  if (!flightModal) flightModal = new Modal(flightModalRef.value);
  flightModal.show();
};

const closeModal = () => {
  if (flightModal) flightModal.hide();
};

const resetForm = () => {
  flightForm.value = {
    airline: "",
    flightNumber: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    flightType: "domestic",
    status: "scheduled",
    basePrice: 0,
  };
  selectedFlight.value = null;
};

const createFlight = async () => {
  try {
    await api.post("/flights", flightForm.value);
    closeModal();
    resetForm();
    fetchFlights();
  } catch {
    alert("Failed to create flight");
  }
};

const updateFlight = async () => {
  try {
    await api.patch(`/flights/${selectedFlight.value._id}`, flightForm.value);
    closeModal();
    resetForm();
    fetchFlights();
  } catch {
    alert("Failed to update flight");
  }
};

const deleteFlight = async (id) => {
  if (!confirm("Are you sure you want to delete this flight?")) return;
  try {
    await api.delete(`/flights/${id}`);
    fetchFlights();
  } catch {
    alert("Failed to delete flight");
  }
};

onMounted(() => {
  fetchFlights();
  fetchOptions();
});
</script>

<style scoped>
.table { margin:auto; width:95%; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
</style>
