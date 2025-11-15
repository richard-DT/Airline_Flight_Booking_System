import api from '@/api/api'
import { getTotalPassengers } from '@/utils/flightSearch'
import { buildUrl } from '@/utils/urlBuilder'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightSearchStore = defineStore(
  'flightSearch',
  () => {
    // Search Form Data
    const tripType = ref('oneWayTrip')
    const from = ref(null)
    const to = ref(null)
    const departureDate = ref('')
    const returnDate = ref('')
    const pax = ref({ adults: 1, children: 0, infants: 0 })
    const flightType = ref('');
    const cabin = ref('Economy')

    // Search Results
    const flights = ref([]);
    const isSearching = ref(false);
    const error = ref(null);

    // Selected Flight
    const selectedFlight = ref(null);

    async function searchFlights() {
      // Reset selected flight

      selectedFlight.value = null;

      const url = buildUrl("/flights/search", {
        origin: from.value.airportId,
        destination: to.value.airportId,
        departureDate: departureDate.value,
        returnDate: returnDate.value,
        passengers: getTotalPassengers(pax.value),
        cabin: cabin.value,
        tripType: tripType.value,
        flightType: flightType.value
      });

      try {
        isSearching.value = true;
        error.value = null;
        const response = await api.get(url);

        const now = new Date();
        const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        flights.value = response.data.results.filter(flight => {
          if (!flight.departureTime) return false;

          const depTime = new Date(flight.departureTime);
          return depTime >= twoHoursLater;
        });

        return true;
      } catch (err) {
        console.error("Error fetching flights:", err);
        error.value = err.response?.data?.message || "Failed to fetch flights";
        return false;
      } finally {
        isSearching.value = false;
      }
    }


    function setFlightSearchData(data) {
      tripType.value = data.tripType || tripType.value
      flightType.value = data.flightType || flightType.value
      from.value = data.from || from.value
      to.value = data.to || to.value
      departureDate.value = data.departureDate || departureDate.value
      returnDate.value = data.returnDate || returnDate.value
      pax.value = data.pax || pax.value
      cabin.value = data.cabin || cabin.value
    }

    function resetFlightSearch() {
      flightType.value = ''
      tripType.value = 'oneWayTrip'
      from.value = null
      to.value = null
      departureDate.value = ''
      returnDate.value = ''
      pax.value = { adults: 1, children: 0, infants: 0 }
      cabin.value = 'Economy'
    }


    function selectFlight(flight) {
      selectedFlight.value = flight;
    }

    function clearSelectedFlight() {
      selectedFlight.value = null;
    }

    return {
      tripType, flightType, from, to, departureDate, returnDate, pax, cabin,
      flights, isSearching, selectedFlight, error,
      setFlightSearchData, resetFlightSearch, searchFlights,
      selectFlight, clearSelectedFlight
    }
  },
  {
    persist: false,
  }
)
