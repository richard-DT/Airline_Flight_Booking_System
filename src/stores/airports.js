import api from "@/api/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAirportsStore = defineStore(
  "airports",
  () => {
    const airports = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const setAirports = (data) => {
      airports.value = data;
    };

    const fetchAirports = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        const res = await api.get("/airports");
        airports.value = res.data;
      } catch (err) {
        console.error("Error fetching airports:", err);
        error.value = err.response?.data?.message || "Failed to fetch airports";
      } finally {
        isLoading.value = false;
      }
    };

    const clearAirports = () => {
      airports.value = [];
    };

    return {
      airports,
      isLoading,
      error,
      setAirports,
      fetchAirports,
      clearAirports,
    };
  },
  {
    persist: true,
  }
);
