<template>
  <section class="mt-4">
    <h2 class="text-center mb-4">Airlines Management</h2>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading airlines...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Table of airlines -->
    <div v-if="!loading && airlines.length" class="table-responsive">
      <button class="btn btn-primary mb-3" @click="openCreateModal">Add Airline</button>
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Airline ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>IATA</th>
            <th>ICAO</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(airline, index) in airlines" :key="airline._id">
            <td>{{ index + 1 }}</td>
            <td>{{ airline.airlineId }}</td>
            <td>{{ airline.name }}</td>
            <td>{{ airline.country }}</td>
            <td>{{ airline.iataCode }}</td>
            <td>{{ airline.icaoCode }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(airline)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteAirline(airline._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !airlines.length" class="text-center mt-5">
      <p>No airlines found.</p>
      <button class="btn btn-primary" @click="openCreateModal">Add Airline</button>
    </div>

    <!-- Modal: Create/Edit Airline -->
    <div
      class="modal fade"
      id="airlineModal"
      tabindex="-1"
      aria-labelledby="airlineModalLabel"
      aria-hidden="true"
      ref="airlineModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="airlineModalLabel">
              {{ isEditing ? "Edit Airline" : "Add Airline" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAirline">
              <div class="mb-3">
                <label class="form-label">Airline ID</label>
                <input v-model="form.airlineId" type="text" class="form-control" :disabled="isEditing" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Country</label>
                <input v-model="form.country" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">IATA Code</label>
                <input v-model="form.iataCode" type="text" class="form-control" maxlength="2" />
              </div>
              <div class="mb-3">
                <label class="form-label">ICAO Code</label>
                <input v-model="form.icaoCode" type="text" class="form-control" maxlength="3" />
              </div>
              <div class="mb-3">
                <label class="form-label">Logo URL</label>
                <input v-model="form.logoUrl" type="url" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Website</label>
                <input v-model="form.website" type="url" class="form-control" />
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ isEditing ? "Update" : "Create" }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../.././api/api.js";
import { Modal } from "bootstrap";

const airlines = ref([]);
const loading = ref(true);
const error = ref(null);

const airlineModalRef = ref(null);
let airlineModal = null;

const isEditing = ref(false);
const form = ref({
  airlineId: "",
  name: "",
  country: "",
  iataCode: "",
  icaoCode: "",
  logoUrl: "",
  website: "",
});

// Fetch all airlines
const fetchAirlines = async () => {
  try {
    loading.value = true;
    const res = await api.get("/airlines");
    airlines.value = res.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load airlines.";
  } finally {
    loading.value = false;
  }
};

// Open Create Modal
const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    airlineId: "",
    name: "",
    country: "",
    iataCode: "",
    icaoCode: "",
    logoUrl: "",
    website: "",
  };
  if (!airlineModal) airlineModal = new Modal(airlineModalRef.value);
  airlineModal.show();
};

// Open Edit Modal
const openEditModal = (airline) => {
  isEditing.value = true;
  form.value = { ...airline };
  if (!airlineModal) airlineModal = new Modal(airlineModalRef.value);
  airlineModal.show();
};

// Save airline (create or update)
const saveAirline = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/airlines/${form.value._id}`, form.value);
    } else {
      await api.post("/airlines", form.value);
    }
    airlineModal.hide();
    await fetchAirlines();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to save airline.");
  }
};

// Delete airline
const deleteAirline = async (id) => {
  if (!confirm("Are you sure you want to delete this airline?")) return;
  try {
    await api.delete(`/airlines/${id}`);
    await fetchAirlines();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete airline.");
  }
};

onMounted(fetchAirlines);
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
