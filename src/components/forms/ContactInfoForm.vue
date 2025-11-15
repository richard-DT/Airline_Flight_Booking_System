<script setup>
import { computed } from 'vue'
import DropdownComponent from '../ui/DropdownComponent.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      firstName: '',
      lastName: '',
      countryCode: '',
      mobileNumber: '',
      email: '',
      confirmEmail: '',
      useFirstGuestDetails: false,
    }),
  },
  routeLabel: String,
  flightType: String,
})

const emit = defineEmits(['update:modelValue', 'useGuestDetails'])

const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

</script>

<template>
  <div class="row guests-card mx-0 border rounded overflow-hidden">
    <div class="col-md-2 bg-primary d-none d-md-block"></div>
    <div class="col-12 col-md-10 p-3 bg-white">
      <form class="row g-3">
        <!-- Use guest details switch -->
        <div class="col-12">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="useGuestDetails"
              v-model="localForm.useFirstGuestDetails"
              @change="emit('useGuestDetails', localForm.useFirstGuestDetails)" />
            <label class="form-check-label extra-small-text-regular" for="useGuestDetails">
              Use first guest's details
            </label>
          </div>
        </div>

        <!-- Name fields -->
        <div class="col-12">
          <div class="row g-2">
            <div class="col-4 col-md-2">
              <label for="title" class="form-label extra-small-text-bold">Title<span
                  class="text-danger">*</span></label>
              <DropdownComponent label="" placeholder="Select" v-model="localForm.title" :items="['Mr', 'Ms']"
                :is-disabled="localForm.useFirstGuestDetails" />
            </div>
            <div class="col-8 col-md-5">
              <label for="firstName" class="form-label extra-small-text-bold">First Name<span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" :disabled="localForm.useFirstGuestDetails" id="firstName"
                v-model="localForm.firstName" />
            </div>
            <div class="col-12 col-md-5">
              <label for="lastName" class="form-label extra-small-text-bold">Last Name<span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" :disabled="localForm.useFirstGuestDetails" id="lastName"
                v-model="localForm.lastName" />
            </div>
          </div>
        </div>

        <!-- Contact section -->
        <div class="col-12">
          <p class="small-text-bold m-0 mt-2">Contact</p>
        </div>

        <!-- Phone fields -->
        <div class="col-12 mt-0">
          <div class="row g-2">
            <div class="col-4 col-md-4">
              <label for="countryCode" class="form-label extra-small-text-bold">Country Code<span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" id="countryCode" v-model="localForm.countryCode"
                placeholder="e.g. +63" maxlength="4" />
            </div>
            <div class="col-8 col-md-8">
              <label for="mobileNumber" class="form-label extra-small-text-bold">Mobile Number<span
                  class="text-danger">*</span></label>
              <input type="text" class="form-control" id="mobileNumber" v-model="localForm.mobileNumber"
                placeholder="e.g. 9123456789" maxlength="10" />
            </div>
          </div>
        </div>

        <!-- Email fields -->
        <div class="col-12 col-md-9">
          <label for="email" class="form-label small-text-bold">Email<span class="text-danger">*</span></label>
          <input type="email" class="form-control" id="email" v-model="localForm.email"
            placeholder="email@example.com" />
        </div>

        <div class="col-12 col-md-9">
          <label for="confirmEmail" class="form-label small-text-bold">Confirm Email<span
              class="text-danger">*</span></label>
          <input type="email" class="form-control" id="confirmEmail" v-model="localForm.confirmEmail"
            placeholder="email@example.com" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-control {
  border-color: var(--color-primary) !important;
}

.guests-card {
  box-shadow: var(--shadow-card);
}
</style>
