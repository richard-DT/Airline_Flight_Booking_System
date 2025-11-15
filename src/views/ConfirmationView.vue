<script setup>
import BoardingPass from '@/components/common/BoardingPass.vue';
import ProgressBar from '@/components/common/ProgressBar.vue';
import ReceiptCard from '@/components/common/ReceiptCard.vue';
import { useBookingStore } from '@/stores/booking';


const bookingStore = useBookingStore();
const { paidFlightDetails } = bookingStore;

const passengers = paidFlightDetails?.bookingId.passengers;

defineOptions({
  beforeRouteEnter(to, from, next) {
    const bookingStore = useBookingStore();
    const paidFlightDetails = bookingStore.paidFlightDetails;

    if (!paidFlightDetails) {
      next('/');
    } else {
      next();
    }
  }
});
</script>

<template>
  <div class="container-fluid d-flex flex-column p-0 flight confirmation-page">
    <div class="container-fluid px-2 pt-1 pb-2">
      <!-- Progress Bar -->
      <ProgressBar title="Confirmation" :steps="5" :currentStep="6" />

      <!-- Confirmation Message -->
      <div class="px-2">
        <div class="d-flex align-items-center mb-2">
          <div class="bg-success rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0">
            <i class="bi bi-check text-white fs-6"></i>
          </div>
          <span class="normal-text-bold">Your flight is confirmed!</span>
        </div>
        <p class="extra-small-text-regular mx-0">
          Your booking is complete. Check your flight details below
          and get ready for your trip.
        </p>

        <p class="extra-small-text-regular mx-0">
          You can track your <strong>booking and flight status</strong> anytime from your <strong>user account</strong>
          using your booking number.
        </p>
        <p class="extra-small-text-regular mx-0 mb-4">
          Don't have an account yet?
          <router-link :to="{ path: '/register' }" target="_blank">
            Sign up
          </router-link>
          here to easily manage your flights and future bookings.
        </p>
      </div>

      <!-- Boarding Passes -->
      <div class="px-2 mb-4">
        <h6 class="normal-text-bold">Boarding Pass</h6>
        <p class="extra-small-text-regular mt-0 mb-3">
          Present this boarding pass at the gate and keep it until baggage claim.
        </p>
      </div>
      <BoardingPass v-for="(passenger, index) in passengers" :bookingDetails="paidFlightDetails.bookingId"
        :passengerDetails="passenger" :index="index" />

      <!-- Receipt -->
      <div class="px-2 mb-4">
        <h6 class="normal-text-bold">Receipt</h6>
        <p class="extra-small-text-regular mt-0 mb-3">
          Here's everything included in your flight purchase.
        </p>
      </div>

      <ReceiptCard />

    </div>
  </div>
</template>

<style scoped>
.confirmation-page {
  max-width: 600px;
}

.rounded-circle {
  width: 22px;
  height: 22px;
  margin-bottom: 1px;
}

.confirmation-card {
  box-shadow: var(--shadow-card) !important;
}
</style>
