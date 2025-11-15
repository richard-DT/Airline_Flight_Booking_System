<script setup>
import ProgressBar from '@/components/common/ProgressBar.vue';
import StickyButtonGroup from '@/components/ui/StickyButtonGroup.vue';
import { useBookingStore } from '@/stores/booking';
import { formatDateReadable, formatTimeReadable } from '@/utils/date';
import { capitalize, formatMoney, formatTaxName } from '@/utils/string';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const bookingStore = useBookingStore();
const { bookedFlightDetails } = bookingStore;

// Graceful computed fallbacks
const flight = computed(() => bookedFlightDetails?.flights?.[0] || {})
const passengers = computed(() => bookedFlightDetails?.passengers || [])
const bookingContact = computed(() => bookedFlightDetails?.bookingContact || {})
const flightPrice = computed(() => bookedFlightDetails?.flightPrices?.[0] || {});
const taxesAndFees = computed(() => {
  if (!flightPrice.value?.taxes) return {};
  const { _id, ...taxesWithoutId } = flightPrice.value.taxes;
  return taxesWithoutId;
});

const origin = computed(() => flight.value?.origin || {});
const destination = computed(() => flight.value?.destination || {});

const departureTime = computed(() => flight.value?.departureTime || null);
const arrivalTime = computed(() => flight.value?.arrivalTime || null);
const flightNumber = computed(() => flight.value?.flightNumber || '—');
const departureTerminal = computed(() => bookedFlightDetails?.departureTerminal || '—');
const arrivalTerminal = computed(() => bookedFlightDetails?.arrivalTerminal || '—');

const basePrice = computed(() => flightPrice.value?.basePrice || 0);
const travelInsuranceFee = computed(() => flightPrice.value?.addOns[0]?.price || 0);
const totalPrice = computed(() => bookedFlightDetails?.totalAmount || 0);
const cabinClass = computed(() => flightPrice.value?.cabin || '');
const seatNumbers = computed(() => bookedFlightDetails?.seatNumbers || []);

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

      <!-- Loading State -->
      <div v-if="!bookedFlightDetails" class="text-center my-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 small-text-regular">Loading booking details...</p>
      </div>

      <!-- Booking Summary -->
      <div v-else>
        <div class="px-2">
          <h6 class="normal-text-bold m-0">Booking Summary</h6>
          <p class="extra-small-text-regular m-0">
            Review your booking before proceeding to payment
          </p>
        </div>

        <div class="px-2 mt-4">
          <div class="row payment-card mx-0 mb-4">
            <div class="col-1 bg-primary rounded-start"></div>
            <div class="col-11 p-2 px-0 pt-0 bg-white container rounded-end p-md-4 pt-md-2">
              <div class="accordion accordion-flush" id="accordionFlushExample">
                <!-- FLIGHT INFO -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingFlight">
                    <button class="accordion-button collapsed px-2" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseFlight">
                      <div class="text-primary d-flex align-items-center flex-grow-1">
                        <span>
                          <p class="m-0 small-text-bold">
                            {{ `${origin.airportId || ''} - ${destination.airportId || ''}` }}
                          </p>
                          <p class="m-0 extra-small-text-regular">
                            {{ formatDateReadable(departureTime) }}
                          </p>
                          <p class="m-0 extra-small-text-regular">
                            {{ formatTimeReadable(departureTime) }} - {{ formatTimeReadable(arrivalTime) }}
                          </p>
                        </span>
                        <span class="extra-small-text-regular ms-auto">
                          <p class="my-0 me-1">Show details</p>
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div id="collapseFlight" class="accordion-collapse collapse show"
                    data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body px-2 pt-1 pb-2 container">
                      <p class="m-0 small-text-bold mb-1">Flight No. {{ flightNumber }}</p>

                      <div class="row px-3">
                        <p class="m-0 p-0 extra-small-text-bold">Departure</p>
                        <div class="col-4 px-0">
                          <p class="extra-small-text-regular m-0">{{ formatDateReadable(departureTime) }}</p>
                          <p class="extra-small-text-regular m-0">{{ formatTimeReadable(departureTime) }}</p>
                        </div>
                        <div class="col-8">
                          <p class="extra-small-text-bold m-0">
                            {{ origin.city }} ({{ origin.airportId }})
                          </p>
                          <p class="extra-small-text-regular m-0">{{ origin.name }}</p>
                          <p class="extra-small-text-regular m-0">{{ departureTerminal }}</p>
                        </div>
                      </div>

                      <div class="row px-3">
                        <p class="m-0 p-0 extra-small-text-bold">Arrival</p>
                        <div class="col-4 px-0">
                          <p class="extra-small-text-regular m-0">{{ formatDateReadable(arrivalTime) }}</p>
                          <p class="extra-small-text-regular m-0">{{ formatTimeReadable(arrivalTime) }}</p>
                        </div>
                        <div class="col-8">
                          <p class="extra-small-text-bold m-0">
                            {{ destination.city }} ({{ destination.airportId }})
                          </p>
                          <p class="extra-small-text-regular m-0">{{ destination.name }}</p>
                          <p class="extra-small-text-regular m-0">{{ arrivalTerminal }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- PASSENGER INFO -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingPassenger">
                    <button class="accordion-button collapsed px-2" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapsePassenger">
                      <div class="text-primary d-flex align-items-center flex-grow-1">
                        <span>
                          <p class="m-0 small-text-bold">
                            {{ bookingContact.firstName }} {{ bookingContact.lastName }}
                          </p>
                        </span>
                        <span class="small-text-bold ms-auto">
                          <p class="my-0 me-1">{{ formatMoney(basePrice * passengers.length) }}</p>
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div id="collapsePassenger" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body px-2 pb-2 container d-flex flex-column gap-1">
                      <div class="d-flex align-items-center">
                        <p class="m-0 small-text-regular mb-1">Flight No. {{ flightNumber }}</p>

                      </div>
                      <div class="d-flex align-items-center" v-for="(passenger, index) in passengers"
                        :key="passenger._id">
                        <div>
                          <i class="bi bi-person-fill"></i>
                          <span class="m-0 small-text-regular mb-1">
                            Seat: {{ seatNumbers[index] }} {{ capitalize(cabinClass) }}
                          </span>
                        </div>
                        <p class="m-0 small-text-regular mb-1 ms-auto"> {{ formatMoney(basePrice) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TRAVEL INSURANCE -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingInsurance">
                    <button class="accordion-button collapsed px-2" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseInsurance">
                      <div class="text-primary d-flex align-items-center flex-grow-1">
                        <span>
                          <p class="m-0 small-text-bold">Travel Insurance</p>
                        </span>
                        <span class="small-text-bold ms-auto">
                          <p class="my-0 me-1">{{ formatMoney(travelInsuranceFee) }}</p>
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div id="collapseInsurance" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body px-2 pb-2 container d-flex flex-column gap-1">
                      <div class="d-flex align-items-center">
                        <p class="m-0 small-text-regular mb-1">Flyx Travel Insurance</p>
                        <p class="m-0 small-text-regular mb-1 ms-auto">{{ formatMoney(travelInsuranceFee) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TAXES AND FEES -->
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingTaxes">
                    <button class="accordion-button collapsed px-2" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseTaxes">
                      <div class="text-primary d-flex align-items-center flex-grow-1">
                        <span>
                          <p class="m-0 small-text-bold">Taxes and Fees</p>
                        </span>
                        <span class="extra-small-text-regular ms-auto">
                          <p class="m-0 small-text-bold mb-1 ms-auto">{{ formatMoney(taxesAndFees.subtotal) }}</p>
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div id="collapseTaxes" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body px-2 pb-2 container d-flex flex-column gap-1">
                      <div class="d-flex align-items-center" v-for="(value, key) in taxesAndFees" :key="key">
                        <p class="m-0 mb-1 text-capitalize"
                          :class="key === 'subtotal' ? 'small-text-bold text-primary' : 'extra-small-text-regular'">{{
                            formatTaxName(key) }}</p>
                        <p class="m-0 mb-1 ms-auto"
                          :class="key === 'subtotal' ? 'small-text-bold text-primary' : 'extra-small-text-regular'"> {{
                            formatMoney(value) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TOTAL -->
                <div class="d-flex align-items-center px-2 py-3">
                  <span class="normal-text-bold">Total</span>
                  <span class="ms-auto normal-text-bold">{{ formatMoney(totalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TERMS ACCEPTANCE -->
        <div class="payment-card mx-2 small-text-regular p-3 mb-4 bg-white rounded">
          <div class="form-check d-flex align-items-start">
            <input class="form-check-input mt-1 me-2" type="checkbox" v-model="termsAccepted" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckDefault">
              <span>
                By clicking <strong>'Continue'</strong>, I confirm that I have read, understood, and accept the
                <strong class="text-primary cursor-pointer">Conditions of Carriage</strong>.
              </span>
            </label>
          </div>
        </div>

        <!-- BUTTONS -->
        <StickyButtonGroup primaryText="Continue" primaryLink="/payment-method" secondaryText="Back"
          secondaryLink="/add-ons" :showSecondary="true" :isPrimaryDisabled="!termsAccepted" />
      </div>
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
