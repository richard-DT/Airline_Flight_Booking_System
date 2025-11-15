import api from '@/api/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAddonsStore } from './add-ons'
import { useContactStore } from './contact'
import { useFlightSearchStore } from './flightSearch'
import { usePassengersStore } from './passengers'

export const useBookingStore = defineStore('booking', () => {
  const flightStore = useFlightSearchStore();
  const passengersStore = usePassengersStore();
  const contactStore = useContactStore();
  const addOnsStore = useAddonsStore();
  const isBooking = ref(false);
  const bookingError = ref(null);

  const bookedFlightDetails = ref(null);
  const paidFlightDetails = ref(null);

  const bookingData = computed(() => ({
    flightId: flightStore.selectedFlight._id,
    passengers: passengersStore.passengers,
    cabin: flightStore.cabin,
    bookingContact: contactStore.contact,
    addOns: Object.values(addOnsStore.addOns).filter(a => a.selected)
      .map(a => ({ name: a.addOnName }))
  }))

  async function bookFlight() {
    try {
      isBooking.value = true;
      bookingError.value = null;
      const response = await api.post('/bookings', bookingData.value);
      bookedFlightDetails.value = response.data.booking
      return true;
    } catch (err) {
      console.error("Error booking flight:", err);
      bookingError.value = err.response?.data?.message || "Failed to book flight";
      return false;
    } finally {
      isBooking.value = false;
    }
  }


  function resetBooking() {
    passengersStore.resetPassengers();
    contactStore.resetContact();
    addOnsStore.resetAddOns();
    flightStore.clearSelectedFlight();
    flightStore.resetFlightSearch();
  }

  return {
    bookingData,
    bookFlight,
    bookedFlightDetails,
    paidFlightDetails,
    isBooking,
    bookingError,
    resetBooking
  }
},
  {
    persist: false
  }

)
