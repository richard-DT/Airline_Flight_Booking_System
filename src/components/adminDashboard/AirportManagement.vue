<template>
  <section class="mt-4">
    <h2 class="text-center mb-4">Airports Management</h2>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading all airports...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Table of airports -->
    <div v-if="!loading && airports.length" class="table-responsive">
      <button class="btn btn-success mb-3" @click="openModal('create')">+ Add Airport</button>
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Airport ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Country</th>
            <th>Type</th>
            <th>Timezone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(airport, index) in airports" :key="airport._id">
            <td>{{ index + 1 }}</td>
            <td>{{ airport.airportId }}</td>
            <td>{{ airport.name }}</td>
            <td>{{ airport.city }}</td>
            <td>{{ airport.country }}</td>
            <td>{{ airport.type }}</td>
            <td>{{ airport.timezone }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" @click="openModal('edit', airport)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteAirport(airport._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !airports.length" class="text-center mt-5">
      <p>No airports found.</p>
    </div>

    <!-- Modal: Create/Edit Airport -->
    <div class="modal fade" id="airportModal" tabindex="-1" aria-labelledby="airportModalLabel" aria-hidden="true"
      ref="airportModalRef">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="airportModalLabel">
              {{ modalMode === 'create' ? 'Add New Airport' : 'Edit Airport' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="mb-3 col-md-4">
                  <label class="form-label">Airport ID</label>
                  <input type="text" v-model="form.airportId" class="form-control" :disabled="modalMode === 'edit'"
                    required>
                </div>
                <div class="mb-3 col-md-8">
                  <label class="form-label">Name</label>
                  <input type="text" v-model="form.name" class="form-control" required>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-4">
                  <label class="form-label">City</label>
                  <input type="text" v-model="form.city" class="form-control" required>
                </div>
                <div class="mb-3 col-md-4">
                  <label class="form-label">Country</label>
                  <input type="text" v-model="form.country" class="form-control" required>
                </div>
                <div class="mb-3 col-md-4">
                  <label class="form-label">Type</label>
                  <select v-model="form.type" class="form-select">
                    <option value="international">International</option>
                    <option value="domestic">Domestic</option>
                    <option value="regional">Regional</option>
                    <option value="military">Military</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Timezone</label>
                <input type="text" v-model="form.timezone" class="form-control" placeholder="e.g. Asia/Manila" required>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ modalMode === 'create' ? 'Add Airport' : 'Save Changes'
                }}</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import api from "@/api/api";
import axios from "axios";
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";

const airports = ref([]);
const loading = ref(true);
const error = ref(null);

const modalMode = ref("create");
const form = ref({
  airportId: "",
  name: "",
  city: "",
  country: "",
  type: "international",
  timezone: "",
});
const airportModalRef = ref(null);
let airportModal = null;


const fetchAirports = async () => {
  try {
    loading.value = true;
    const res = await api.get('/airports');
    airports.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load airports.";
  } finally {
    loading.value = false;
  }
};

const openModal = (mode, airport = null) => {
  modalMode.value = mode;
  if (mode === "edit" && airport) {
    form.value = { ...airport };
  } else {
    form.value = {
      airportId: "",
      name: "",
      city: "",
      country: "",
      type: "international",
      timezone: "",
    };
  }

  if (!airportModal) {
    airportModal = new Modal(airportModalRef.value);
  }
  airportModal.show();
};

const submitForm = async () => {
  try {
    if (modalMode.value === "create") {
      await axios.post(API_URL, form.value);
    } else {
      await axios.put(`${API_URL}/${form.value._id}`, form.value);
    }
    airportModal.hide();
    fetchAirports();
  } catch (err) {
    alert(err.response?.data?.message || "Operation failed.");
  }
};

const deleteAirport = async (id) => {
  if (!confirm("Are you sure you want to delete this airport?")) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    fetchAirports();
  } catch (err) {
    alert(err.response?.data?.message || "Delete failed.");
  }
};

onMounted(fetchAirports);
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
