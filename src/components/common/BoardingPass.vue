<script setup>
import logo from '@/assets/images/logo_dark.png';
import { formatDateTime } from '@/utils/date';
import { capitalize } from '@/utils/string';
import { computed } from 'vue';
import LeftCircleLine from '../icons/LeftCircleLine.vue';
import RightCircleLine from '../icons/RightCircleLine.vue';


const props = defineProps({
  bookingDetails: {
    type: Object,
  },
  passengerDetails: {
    type: Object,
  },
  index: {
    type: Number,
    default: 0
  }
})

const qrData = computed(() => {
  return `BookingID:${props.bookingDetails?.bookingId || ''}\nPassenger:${props.passengerDetails?.firstName || ''} ${props.passengerDetails?.lastName || ''}\nFlight:${props.bookingDetails?.flights?.[0]?.flightNumber || ''}`;
});
const qrDataJSON = computed(() => JSON.stringify(qrData.value));

function downloadBoardingPass() {
  const baseURL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_LOCAL
      : import.meta.env.VITE_AIRLINE_BOOKING_SYSTEM_API_PROD;

  window.open(`${baseURL}/tickets/${props.bookingDetails._id}/${props.passengerDetails._id}?passengerIndex=${props.index}`, '_blank');
}

</script>

<template>
  <div class="mb-4">
    <div class="row mx-0 align-items-stretch">
      <!-- Left color accent bar -->
      <div class="col-1 bg-primary rounded-start"></div>

      <!-- Main content -->
      <div class="col-11 bg-white rounded-end p-3 p-md-4 boarding-pass">
        <div class="row g-3 align-items-start">
          <!-- Flight details -->
          <div class="col-12 col-md-8">
            <div class="mb-3">
              <div class="d-flex align-items-center gap-2 mb-1">
                <img :src="logo" class="logo" />
                <span class="normal-text-bold">Boarding Pass</span>
              </div>
              <p class="extra-small-text-regular">
                Booking No: <span class="extra-small-text-bold">{{ props.bookingDetails.bookingId }}</span>
              </p>
            </div>

            <!-- Route -->
            <div class="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
              <span>
                <p class="large-text-bold mb-0">{{ props.bookingDetails.flights[0].origin.airportId }}</p>
                <p class="small-text-regular text-muted">From</p>
              </span>
              <span>
                <LeftCircleLine />
              </span>
              <span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M27.2065 14.0001C27.195 12.6291 25.3315 11.6331 23.093 11.6331H18.3705C17.7145 11.6331 17.468 11.5276 17.0815 11.0821L9.20647 2.49206C8.96047 2.21106 8.65547 2.07056 8.30397 2.07056H6.94447C6.63997 2.07056 6.46447 2.34006 6.61647 2.66806L10.6715 11.6331L4.71797 12.3126L2.59697 8.42206C2.44497 8.12906 2.18697 8.00006 1.79997 8.00006H1.29697C0.991969 8.00006 0.792969 8.19906 0.792969 8.50406V19.4961C0.792969 19.8011 0.991969 19.9886 1.29697 19.9886H1.80097C2.18747 19.9886 2.44547 19.8596 2.59747 19.5786L4.71847 15.6876L10.672 16.3676L6.61697 25.3326C6.46497 25.6486 6.64047 25.9296 6.94497 25.9296H8.30497C8.65597 25.9296 8.96097 25.7776 9.20697 25.5081L17.082 16.9066C17.4685 16.4726 17.715 16.3671 18.371 16.3671H23.0935C25.332 16.3671 27.195 15.3596 27.2065 14.0001Z"
                    fill="#092C4C" />
                </svg>
              </span>
              <span>
                <RightCircleLine />
              </span>
              <span>
                <p class="large-text-bold mb-0">{{ props.bookingDetails.flights[0].destination.airportId }}</p>
                <p class="small-text-regular text-muted">To</p>
              </span>
            </div>

            <!-- Flight info -->
            <div class="d-flex flex-wrap gap-4 mb-4">
              <span>
                <p class="normal-text-bold mb-0">{{ props.bookingDetails.flights[0].flightNumber }}</p>
                <p class="extra-small-text-regular text-muted">Flight</p>
              </span>
              <span>
                <p class="normal-text-bold mb-0">{{ props.bookingDetails.seatNumbers[index] }}</p>
                <p class="extra-small-text-regular text-muted">Seat</p>
              </span>
              <span>
                <p class="normal-text-bold mb-0">{{ props.bookingDetails.departureTerminal }}</p>
                <p class="extra-small-text-regular text-muted">Terminal</p>
              </span>
              <span>
                <p class="normal-text-bold mb-0">{{ props.bookingDetails.departureGate }}</p>
                <p class="extra-small-text-regular text-muted">Gate</p>
              </span>
              <span>
                <p class="normal-text-bold mb-0">{{ capitalize(props.bookingDetails.flightPrices[0].cabin) }}</p>
                <p class="extra-small-text-regular text-muted">Class</p>
              </span>
            </div>

            <!-- Passenger info -->
            <div class="d-flex flex-wrap gap-4">
              <span>
                <p class="normal-text-bold mb-0">{{ `${props.passengerDetails.firstName}
                  ${props.passengerDetails.lastName}` }}</p>
                <p class="extra-small-text-regular text-muted">Passenger</p>
              </span>
              <span>
                <p class="normal-text-bold mb-0">{{ formatDateTime(props.bookingDetails.flights[0].departureTime) }}</p>
                <p class="extra-small-text-regular text-muted">Departure</p>
              </span>
            </div>
          </div>

          <!-- QR code section -->
          <div
            class="col-12 col-md-4 d-flex justify-content-start justify-content-md-end align-items-center gap-2 flex-md-column">
            <div class="qr-placeholder">
              <p class="small-text-regular text-muted mb-1 text-center">QR Code</p>
              <div class="qr-box">
                <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrDataJSON}`"
                  class="img-fluid" />
              </div>

            </div>
            <div class="tex-start d-flex flex-column gap-2">
              <p class="qr-note">
                Scan this QR code to access your booking details.
              </p>

              <p class="qr-note">
                Arrive at the gate at least 30 minutes before departure.
              </p>
              <p class="qr-note">
                Follow crew instructions at all times for safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download button -->
    <div class="d-flex justify-content-end mt-3">
      <button class="download-btn" @click="downloadBoardingPass">
        <i class="bi bi-download me-2"></i>
        Download Boarding Pass
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 1.3rem;
}

.boarding-pass {
  box-shadow: var(--shadow-card);
}

.qr-placeholder {
  text-align: center;
}

.qr-box {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-note {
  font-size: 10px;
  color: #666;
  margin-top: 4px;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .qr-box {
    width: 120px;
    height: 120px;
  }
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
