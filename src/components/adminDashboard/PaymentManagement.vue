<template>
  <section class="mt-4">
    <h2 class="text-center mb-4">Payments Management</h2>

    <!-- Loading state -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading all payments...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Filter -->
    <div class="mb-3 d-flex justify-content-between">
      <input
        v-model="searchTerm"
        @input="filterPayments"
        type="text"
        class="form-control w-50"
        placeholder="Search by Payment ID, Booking ID, or Status"
      />
      <select v-model="statusFilter" @change="filterPayments" class="form-select w-25">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Success">Success</option>
        <option value="Failed">Failed</option>
        <option value="Refunded">Refunded</option>
      </select>
    </div>

    <!-- Table -->
    <div v-if="!loading && payments.length" class="table-responsive">
      <table class="table table-striped table-bordered align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Payment ID</th>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in filteredPayments" :key="payment._id">
            <td>{{ index + 1 }}</td>
            <td>{{ payment.paymentId }}</td>
            <td>{{ payment.bookingId?.bookingId || "N/A" }}</td>
            <td>₱{{ payment.amount.toLocaleString() }}</td>
            <td>{{ formatDate(payment.paymentDate) }}</td>
            <td>{{ payment.paymentMethod }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning text-dark': payment.status === 'Pending',
                  'bg-success': payment.status === 'Success',
                  'bg-danger': payment.status === 'Failed',
                  'bg-info': payment.status === 'Refunded'
                }"
              >
                {{ payment.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="viewPayment(payment)">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && !payments.length" class="text-center mt-5">
      <p>No payments found.</p>
    </div>

    <!-- Modal: Payment Details -->
    <div
      class="modal fade"
      id="paymentModal"
      tabindex="-1"
      aria-hidden="true"
      ref="paymentModalRef"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Payment Details — {{ selectedPayment?.paymentId }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedPayment">
            <p><strong>Booking ID:</strong> {{ selectedPayment.bookingId?.bookingId }}</p>
            <p><strong>Amount:</strong> ₱{{ selectedPayment.amount.toLocaleString() }}</p>
            <p><strong>Payment Method:</strong> {{ selectedPayment.paymentMethod }}</p>
            <p><strong>Status:</strong>
              <select v-model="selectedPayment.status" class="form-select w-auto d-inline-block me-2">
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
              <button class="btn btn-sm btn-primary" @click="updateStatus(selectedPayment)">Update</button>
            </p>
            <p><strong>Payment Date:</strong> {{ formatDate(selectedPayment.paymentDate) }}</p>

            <h6 class="mt-3">Billing Info</h6>
            <p>
              {{ selectedPayment.billingInfo.firstName }} {{ selectedPayment.billingInfo.lastName }}<br/>
              {{ selectedPayment.billingInfo.streetAddress }}, {{ selectedPayment.billingInfo.city }}, {{ selectedPayment.billingInfo.country }}<br/>
              Email: {{ selectedPayment.billingInfo.email }} | Contact: {{ selectedPayment.billingInfo.contactNumber }}
            </p>

            <h6 class="mt-3">Card Info</h6>
            <p>
              **** **** **** {{ selectedPayment.cardInfo.last4 }}<br/>
              Expiry: {{ selectedPayment.cardInfo.expDate }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../../api/api.js";
import { Modal } from "bootstrap";

const payments = ref([]);
const filteredPayments = ref([]);
const loading = ref(true);
const error = ref("");
const selectedPayment = ref(null);
const paymentModalRef = ref(null);
let paymentModal = null;

const searchTerm = ref("");
const statusFilter = ref("");

// Format date
const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

// Fetch payments
const fetchPayments = async () => {
  loading.value = true;
  try {
    const res = await api.get("/payments");
    payments.value = res.data;
    filterPayments();
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load payments.";
  } finally {
    loading.value = false;
  }
};

// Filter payments
const filterPayments = () => {
  filteredPayments.value = payments.value.filter((p) => {
    const matchesTerm =
      !searchTerm.value ||
      p.paymentId.includes(searchTerm.value) ||
      p.bookingId?.bookingId.includes(searchTerm.value);
    const matchesStatus =
      !statusFilter.value || p.status === statusFilter.value;
    return matchesTerm && matchesStatus;
  });
};

// View modal
const viewPayment = (payment) => {
  selectedPayment.value = { ...payment };
  if (!paymentModal) {
    paymentModal = new Modal(paymentModalRef.value);
  }
  paymentModal.show();
};

// Update status
const updateStatus = async (payment) => {
  try {
    const res = await api.patch(`/payments/${payment._id}/status`, { status: payment.status });
    alert("Payment status updated!");
    fetchPayments();
  } catch (err) {
    alert("Failed to update payment status.");
  }
};

onMounted(fetchPayments);
watch([searchTerm, statusFilter], filterPayments);
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
