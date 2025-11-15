<script setup>
import ProgressBar from '@/components/common/ProgressBar.vue'
import ContactInfoForm from '@/components/forms/ContactInfoForm.vue'
import PassengerForm from '@/components/forms/PassengerForm.vue'
import StickyButtonGroup from '@/components/ui/StickyButtonGroup.vue'
import VerticalTabs from '@/components/ui/VerticalTabs.vue'
import { useContactStore } from '@/stores/contact'
import { useFlightSearchStore } from '@/stores/flightSearch'
import { usePassengersStore } from '@/stores/passengers'
import { computed, ref, watch } from 'vue'

// Stores
const flightStore = useFlightSearchStore();
const { pax, to, from, cabin } = flightStore;
const passengersStore = usePassengersStore();
const contactStore = useContactStore();

const activeTabIndex = ref(0);

// Generate Passenger Tabs
const tabItems = computed(() => {
  if (!from || !to) return [];
  const items = []
  let id = 1

  const createTabs = (count, type) => {
    for (let i = 0; i < count; i++) {
      items.push({
        id: id++,
        label: `${type} ${i + 1}`,
        icon: 'bi bi-person',
        itenerary: `${from.airportId} ⟶ ${to.airportId}`,
        cabin: `${cabin} Class`,
      })
    }
  }

  createTabs(pax.adults, 'Adult')
  createTabs(pax.children, 'Child')
  createTabs(pax.infants, 'Infant')

  return items
})

// Local Refs (sync with Pinia)
const passengerForms = ref(passengersStore.passengers || [])
const contactForm = ref({ ...contactStore.contact })


// Computed: overall form validity
const areFormsValid = computed(() => {
  // Check all passenger forms
  const allPassengersFilled = passengerForms.value.every(p =>
    p.title && p.firstName && p.lastName && p.day && p.month && p.year && p.nationality
  )

  // Check contact form
  const contactFilled =
    contactForm.value.title &&
    contactForm.value.firstName &&
    contactForm.value.lastName &&
    contactForm.value.email &&
    contactForm.value.confirmEmail

  return allPassengersFilled && contactFilled
})


// Copy First Guest to Contact
function copyFirstGuestDetails(isChecked) {
  if (isChecked && passengerForms.value.length > 0) {
    const firstPassenger = passengerForms.value[0]
    contactForm.value = {
      ...contactForm.value,
      title: firstPassenger.title || '',
      firstName: firstPassenger.firstName || '',
      lastName: firstPassenger.lastName || '',
      useFirstGuestDetails: true,
    }
  } else {
    contactForm.value = {
      ...contactForm.value,
      title: '',
      firstName: '',
      lastName: '',
      useFirstGuestDetails: false,
    }
  }
}

// Watchers
watch(
  tabItems,
  (newTabs) => {
    passengerForms.value = newTabs.map((_, index) => {
      return (
        passengerForms.value[index] || {
          title: '',
          firstName: '',
          lastName: '',
          day: '',
          month: '',
          year: '',
          nationality: '',
        }
      )
    })
  },
  { immediate: true }
)
// Sync passenger forms to Pinia
watch(passengerForms, (v) => {
  passengersStore.setPassengers(v)
}, { deep: true })

// Sync contact form to Pinia
watch(contactForm, (v) => {
  contactStore.setContact(v)
}, { deep: true })

// Redirect users to home if they proceeded to this page without selected flight
defineOptions({
  beforeRouteEnter(to, from, next) {
    const flightStore = useFlightSearchStore()
    if (!flightStore.selectedFlight) {
      next('/');
    } else {
      next()
    }
  },
})


</script>

<template>
  <div class="container-fluid d-flex flex-column p-0 flight guests-page">
    <div class="container-fluid px-2 pt-1 pb-2">
      <!-- Progress Bar -->
      <ProgressBar title="Guests" :steps="5" :currentStep="2" />

      <!-- Passenger Information -->
      <div class="px-2 mb-4">
        <h6 class="normal-text-bold">Passenger Information</h6>
        <p class="extra-small-text-regular mt-0 mb-3">
          Please complete all passenger details. Fields marked with <span class="text-danger">*</span> are mandatory.
        </p>
        <VerticalTabs :tabs="tabItems" v-model="activeTabIndex">
          <template #default="{ activeTab, index }">
            <PassengerForm v-if="tabItems[index]" :key="tabItems[index].id" v-model="passengerForms[index]"
              :routeLabel="activeTab.itenerary" :flightType="activeTab.cabin" />
          </template>
        </VerticalTabs>
      </div>

      <!-- Contact Information -->
      <div class="px-2 mb-3">
        <h6 class="mb-3 normal-text-bold">Contact Information</h6>
        <ContactInfoForm v-model="contactForm" @useGuestDetails="copyFirstGuestDetails" />
      </div>

      <!-- Sticky Button -->
      <StickyButtonGroup primaryText="Continue" primaryLink="/add-ons" secondaryText="Back" secondaryLink="/flights"
        :showSecondary="true" :isPrimaryDisabled="!areFormsValid" />
    </div>
  </div>
</template>

<style scoped>
.guests-page {
  max-width: 800px;
}
</style>
