import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContactStore = defineStore('contact', () => {
  const contact = ref({
    title: '',
    firstName: '',
    lastName: '',
    countryCode: '',
    mobileNumber: '',
    email: '',
    confirmEmail: '',
    useFirstGuestDetails: false
  })

  function setContact(data) {
    contact.value = data
  }

  function resetContact() {
    contact.value = {
      title: '',
      firstName: '',
      lastName: '',
      countryCode: '',
      mobileNumber: '',
      email: '',
      confirmEmail: '',
      useFirstGuestDetails: false
    }
  }

  return {
    contact,
    setContact,
    resetContact
  }
}, {
  persist: false
})
