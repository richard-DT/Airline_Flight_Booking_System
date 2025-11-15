<script setup>
import logo from '@/assets/images/logo_dark.png';
import { useBookingStore } from '@/stores/booking';
import { formatDateReadable } from '@/utils/date';
import { capitalize, formatMoney, formatTaxName } from '@/utils/string';


const bookingStore = useBookingStore();
const { paidFlightDetails } = bookingStore;

const { paymentId, billingInfo, cardInfo, paymentDate, amount, bookingId, _id } = paidFlightDetails;
const flightPrice = bookingId.flightPrices[0];


function downloadReceipt() {
  const baseURL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_LOCAL
      : import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_PROD;

  window.open(`${baseURL}/payments/receipt/${_id}`, '_blank');
}

</script>

<template>
  <div class="mb-4">
    <div class="row mx-0 align-items-stretch">
      <!-- Left color accent bar -->
      <div class="col-1 bg-primary rounded-start"></div>

      <!-- Main content -->
      <div class="col-11 bg-white rounded-end p-3 p-md-4 receipt">
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2 mb-1">
            <img :src="logo" class="logo" />
            <span class="normal-text-bold">Receipt</span>
          </div>
          <p class="extra-small-text-regular">
            Receipt No: <span class="extra-small-text-bold">{{ paymentId }}</span>
          </p>
        </div>
        <div class="">
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">Name:</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">{{ billingInfo.firstName }} {{ billingInfo.lastName }}
            </p>
          </div>
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">Payment Date:</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">{{ formatDateReadable(paymentDate) }}</p>
          </div>
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">Card Number:</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">CARD xxxx xxxx xxxx {{ cardInfo.last4 }}</p>
          </div>
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">{{ capitalize(flightPrice.cabin) }} - Base Price</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">{{ formatMoney(flightPrice.basePrice) }}</p>
          </div>
          <div class="d-flex" v-for="addOn in flightPrice.addOns">
            <p class="p-0 m-0 extra-small-text-bold">{{ formatTaxName(addOn.name) }}</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">{{ formatMoney(addOn.price) }}</p>
          </div>
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">Taxes and Fees:</p>
            <p class="ms-auto p-0 m-0 extra-small-text-regular">{{ formatMoney(flightPrice.taxes.subtotal) }}</p>
          </div>
          <div class="d-flex">
            <p class="p-0 m-0 extra-small-text-bold">Total:</p>
            <p class="ms-auto p-0 m-0 extra-small-text-bold">{{ formatMoney(amount) }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Download button -->
    <div class="d-flex justify-content-end mt-3">
      <button class="download-btn" @click="downloadReceipt">
        <i class="bi bi-download me-2"></i>
        Download Receipt
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 1.3rem;
}

.receipt {
  box-shadow: var(--shadow-card);
}

.download-btn {
  background-color: #092c4c;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.25s ease, transform 0.15s ease;
}

.download-btn:hover {
  background-color: #0c3d66;
  transform: translateY(-1px);
}

.download-btn:active {
  transform: translateY(1px);
}

p {
  margin: 0;
}
</style>
