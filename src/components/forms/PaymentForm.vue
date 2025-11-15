<script setup>
import { useBookingStore } from '@/stores/booking';
import { formatMoney } from '@/utils/string';
import { defineEmits, reactive, watch } from 'vue';

const bookingStore = useBookingStore();
const { bookedFlightDetails } = bookingStore;
const emit = defineEmits(['submit'])

const form = reactive({
  cardNumber: '',
  firstName: '',
  lastName: '',
  cvv: '',
  expDate: '',
  streetAddress: '',
  city: '',
  country: '',
  contactNumber: '',
  email: '',
})

const errors = reactive({})

// --- AUTO FORMAT CARD NUMBER ---
watch(
  () => form.cardNumber,
  (newVal) => {
    // Remove all non-digit characters
    let digits = newVal.replace(/\D/g, '')
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    // Prevent recursive update
    if (formatted !== newVal) {
      form.cardNumber = formatted
    }
  }
)

// --- VALIDATION ---
function validateForm() {
  let valid = true
  Object.keys(form).forEach((key) => (errors[key] = ''))

  if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s+/g, ''))) {
    errors.cardNumber = 'Card number must be 13-19 digits.'
    valid = false
  }
  if (!form.firstName) { errors.firstName = 'First name is required.'; valid = false }
  if (!form.lastName) { errors.lastName = 'Last name is required.'; valid = false }
  if (!/^\d{3,4}$/.test(form.cvv)) { errors.cvv = 'CVV must be 3-4 digits.'; valid = false }
  if (!/^\d{2}\/\d{2}$/.test(form.expDate)) { errors.expDate = 'Expiration date must be MM/YY.'; valid = false }
  if (!form.streetAddress) { errors.streetAddress = 'Street address is required.'; valid = false }
  if (!form.city) { errors.city = 'City is required.'; valid = false }
  if (!form.country) { errors.country = 'Country is required.'; valid = false }
  if (!form.contactNumber) { errors.contactNumber = 'Contact number is required.'; valid = false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Invalid email address.'; valid = false }

  return valid
}

// --- SUBMIT FORM ---
const submitForm = () => {
  if (!validateForm()) {
    return { valid: false, errors }
  }

  // Remove spaces from card number before sending to backend
  const sanitizedData = {
    ...form,
    cardNumber: form.cardNumber.replace(/\s+/g, ''),
  }

  return { valid: true, data: sanitizedData }
}

defineExpose({ submitForm })
</script>


<template>
  <form class="payment-card mx-0 mb-4" @submit.prevent>
    <!-- Header -->
    <div class="bg-primary text-white py-3 px-3 normal-text-bold">
      Credit or Debit
    </div>

    <!-- Card Type Section -->
    <div class="d-flex py-3 justify-content-between align-items-center px-4">
      <div class="form-check d-none d-md-block">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
        <label class="form-check-label small-text-regular" for="flexRadioDefault2">
          Debit, Credit or Prepaid Cards
        </label>
      </div>
      <div class="d-flex align-items-center justify-content-center flex-grow-1 flex-md-grow-0 gap-1">
        <img src="@/assets/images/amex.png" alt="Amex" />
        <img src="@/assets/images/discover.png" alt="Discover" />
        <img src="@/assets/images/mastercard.png" alt="Mastercard" />
        <img src="@/assets/images/visa.png" alt="Visa" />
      </div>
    </div>

    <div class="px-2">
      <hr class="my-3 mx-2" />
    </div>

    <div class="mx-3 mb-3 border d-flex align-items-center justify-content-start gap-2 p-3 banner">
      <span>
        <i class="bi bi-lock-fill fs-1"></i>
      </span>
      <span class="text-primary small-text-regular">
        <p class="m-0 text-primary small-text-bold">
          Pay with confidence
        </p>
        <p class="m-0 text-primary small-text-regular">
          All transactions are secured and encrypted
        </p>
      </span>
    </div>
    <div class="text-center my-4">
      <p class="large-text-regular">Total Amount: <span class="fw-bold">{{ formatMoney(bookedFlightDetails.totalAmount
        || 0) }}</span></p>

    </div>

    <!-- Main Form Section -->
    <div class="d-flex flex-column gap-4 flex-md-row px-2">
      <!-- Card Details -->
      <div class="container px-0">
        <div class="px-2">
          <p class="normal-text-regular m-0">Card Details</p>
        </div>

        <div class="row px-2 gy-2">
          <div class="col-12">
            <label for="cardNumber" class="form-label extra-small-text-bold">Card Number<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="cardNumber" v-model="form.cardNumber" inputmode="numeric"
              maxlength="19" placeholder="XXXX XXXX XXXX XXXX" />
            <small class="text-danger">{{ errors.cardNumber }}</small>
          </div>
          <div class="col-12">
            <label for="firstName" class="form-label extra-small-text-bold">First Name<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="firstName" v-model="form.firstName" />
            <small class="text-danger">{{ errors.firstName }}</small>
          </div>
          <div class="col-12">
            <label for="lastName" class="form-label extra-small-text-bold">Last Name<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="lastName" v-model="form.lastName" />
            <small class="text-danger">{{ errors.lastName }}</small>
          </div>
        </div>

        <div class="row px-2 pt-2">
          <div class="col-4">
            <label for="cvv" class="form-label extra-small-text-bold">CVV<span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="cvv" v-model="form.cvv" maxlength="4" />
            <small class="text-danger">{{ errors.cvv }}</small>
          </div>
          <div class="col-8">
            <label for="expDate" class="form-label extra-small-text-bold">Expiration Date<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="expDate" v-model="form.expDate" placeholder="MM/YY"
              maxlength="5" />
            <small class="text-danger">{{ errors.expDate }}</small>
          </div>
        </div>
      </div>

      <!-- Billing Address -->
      <div class="container px-0">
        <div class="px-2">
          <p class="normal-text-regular m-0">Billing Address</p>
        </div>

        <div class="row px-2 gy-2 mb-4">
          <div class="col-12">
            <label for="streetAddress" class="form-label extra-small-text-bold">Street Address<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="streetAddress" v-model="form.streetAddress" />
            <small class="text-danger">{{ errors.streetAddress }}</small>
          </div>
          <div class="col-12">
            <label for="city" class="form-label extra-small-text-bold">City/Town<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="city" v-model="form.city" />
            <small class="text-danger">{{ errors.city }}</small>
          </div>
          <div class="col-12">
            <label for="country" class="form-label extra-small-text-bold">Country<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="country" v-model="form.country" />
            <small class="text-danger">{{ errors.country }}</small>
          </div>
          <div class="col-12">
            <label for="contactNumber" class="form-label extra-small-text-bold">Contact Number<span
                class="text-danger">*</span></label>
            <input type="text" class="form-control" id="contactNumber" v-model="form.contactNumber" maxlength="13" />
            <small class="text-danger">{{ errors.contactNumber }}</small>
          </div>
          <div class="col-12">
            <label for="email" class="form-label extra-small-text-bold">Email<span class="text-danger">*</span></label>
            <input type="email" class="form-control" id="email" v-model="form.email" />
            <small class="text-danger">{{ errors.email }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="bg-secondary p-2 m-3 payment-disclaimer rounded">
      <p class="extra-small-text-regular mb-0">
        <strong>Disclaimer</strong>: Flyx authenticates all debit and credit card transactions, and reserves
        the right to refuse you, or your baggage, if in the exercise of reasonable discretion, we determine
        that the payment of your fare has been done fraudulently or unlawfully. Some banks may charge
        additional fees for this transaction.
      </p>
    </div>

  </form>
</template>

<style scoped>
.payment-disclaimer,
.banner {
  background-color: var(--color-gray-5) !important;
}

.payment-method-container {
  max-width: 1000px !important;
}

img {
  height: 25px;
}

.text-danger {
  font-size: 0.8rem;
}

.form-control {
  border-color: var(--color-primary) !important;
}
</style>
