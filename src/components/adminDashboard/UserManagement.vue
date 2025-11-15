<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api.js"; // Axios instance with baseURL + token

const users = ref([]);
const loading = ref(true);
const error = ref("");

// Fetch users from API
const fetchUsers = async () => {
  try {
    const res = await api.get("/users"); // GET /api/users
    users.value = res.data;
  } catch (err) {
    error.value = "Failed to load users.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Toggle role between "Customer" and "Admin"
const toggleRole = async (userId, currentRole) => {
  try {
    const newRole = currentRole === "Admin" ? "Customer" : "Admin";
    await api.patch(`/users/${userId}/role`, { role: newRole });
    const user = users.value.find((u) => u.userId === userId);
    if (user) user.role = newRole;
  } catch (err) {
    console.error(err);
    alert("Error updating role");
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div>
    <h2 class="text-center mb-4 fw-bold text-primary">User Management</h2>

    <div v-if="loading" class="text-center text-muted">Loading users...</div>
    <div v-if="error" class="text-danger text-center">{{ error }}</div>

    <div v-if="!loading && users.length">
    	<div class="d-flex justify-content-center">
    		<div class="table-responsive" style="max-width: 1000px; width: 100%;">
    			<table class="table table-striped table-bordered align-middle">
        <thead class="table-primary">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Date of Birth</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userId">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.mobileNumber }}</td>
            <td>{{ user.dateOfBirth }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="toggleRole(user.userId, user.role)"
              >
                Set as {{ user.role === "Admin" ? "Customer" : "Admin" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    		</div>
    	</div>
      
    </div>
  </div>
</template>

<style scoped>
.table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
