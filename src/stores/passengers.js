import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePassengersStore = defineStore('passengers', () => {
  const passengers = ref([])

  function setPassengers(data) {
    const formattedData = data.map((passenger) => { return { ...passenger, dateOfBirth: `${passenger.year}-${passenger.month}-${passenger.day}` } })
    passengers.value = formattedData
  }

  function resetPassengers() {
    passengers.value = []
  }

  return {
    passengers,
    setPassengers,
    resetPassengers
  }
}, {
  persist: false
})
