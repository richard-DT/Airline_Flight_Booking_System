<script setup>
import api from '@/api/api';
import ProgressBar from '@/components/common/ProgressBar.vue';
import PaymentForm from '@/components/forms/PaymentForm.vue';
import StickyButtonGroup from '@/components/ui/StickyButtonGroup.vue';
import { useBookingStore } from '@/stores/booking';
import { Notyf } from 'notyf';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const notyf = new Notyf();
const router = useRouter();
const paymentForm = ref(null)
const bookingStore = useBookingStore();
const { bookedFlightDetails } = bookingStore;
const { paidFlightDetails } = storeToRefs(bookingStore);

const isLoading = ref(false);

const handlePayment = async () => {
  try {
    isLoading.value = true;

    // Validate form
    const result = paymentForm.value.submitForm()
    if (!result.valid) {
      console.log('Form validation failed:', result.errors)
      return
    }

    // Prepare request body
    const {
      firstName,
      lastName,
      streetAddress,
      city,
      country,
      contactNumber,
      email,
      cardNumber,
      cvv,
      expDate,
    } = result.data

    const reqBody = {
      bookingId: bookedFlightDetails._id,
      amount: bookedFlightDetails.totalAmount,
      paymentMethod: 'Credit Card',
      billingInfo: { firstName, lastName, streetAddress, city, country, contactNumber, email },
      cardInfo: { cardNumber, cvv, expDate },
    }

    // Call API
    const response = await api.post('/payments/charge', reqBody)

    // Handle API response
    if (response.data.status === 'Success') {
      paidFlightDetails.value = response.data.payment
      notyf.success("Your booking is confirmed")
      router.push('/confirmation')
    }
  } catch (error) {
    console.error('Error during payment:', error)
    notyf.error(error.response.data.message)
  } finally {
    isLoading.value = false;
  }
}

const termsAccepted = ref(false);

defineOptions({
  beforeRouteEnter(to, from, next) {
    const bookingStore = useBookingStore();
    const bookedFlightDetails = bookingStore.bookedFlightDetails;

    if (!bookedFlightDetails) {
      next('/');
    } else {
      next();
    }
  }
});
</script>

<template>
  <div class="container-fluid d-flex flex-column p-0 flight payment-page">
    <div class="container-fluid px-2 pt-1 pb-2">
      <!-- Progress Bar -->
      <ProgressBar title="Payment" :steps="5" :currentStep="4" />

      <div class="px-2 mb-4">
        <h6 class="normal-text-bold m-0">Payment</h6>
        <p class="extra-small-text-regular m-0">Securely complete your payment below.</p>
      </div>

      <div class="px-2">
        <PaymentForm ref="paymentForm" />
      </div>

      <div class="payment-card mx-2 small-text-regular p-3 mb-4 bg-white rounded">
        <div class="form-check d-flex align-items-start">
          <input class="form-check-input mt-1 me-2" type="checkbox" value="" id="flexCheckDefault"
            v-model="termsAccepted" />
          <label class="form-check-label" for="flexCheckDefault">
            <span>
              I fully understand that all information is handled in accordance with Flyx Privacy
              Policy in effect at the time of booking. Flyx also
              reserves the right to share information with the government authorities and aviation
              partners of the purpose completing the booking
              transaction needed for the flight.
            </span>
          </label>
        </div>
      </div>
      <!-- Sticky Button -->
      <StickyButtonGroup primaryText="Continue" :primaryFunction="handlePayment" secondaryText="Back"
        secondaryLink="/payment" :showSecondary="true" :isPrimaryDisabled="!termsAccepted"
        primaryLoadingText="Processing..." :isLoading="isLoading" />
    </div>
  </div>
</template>

<style scoped>
.payment-page {
  max-width: 800px;
  margin: 0 auto;
}

.payment-card {
  box-shadow: var(--shadow-card);
  border-radius: 10px;
  overflow: hidden;
}

.payment-disclaimer {
  background-color: var(--color-gray-5) !important;
}
</style>
