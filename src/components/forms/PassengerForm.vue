<script setup>
import { birthYears, days } from '@/data/dateOptions';
import { monthNames } from '@/data/months';
import { computed } from 'vue';
import DropdownComponent from '../ui/DropdownComponent.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: '',
      nationality: '',
    }),
  },
  routeLabel: {
    type: String,
    default: 'Basic flight',
  },
  flightType: {
    type: String,
    default: 'Basic flight',
  },
})

const emit = defineEmits(['update:modelValue'])

// Create a computed proxy for two-way binding
const localForm = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <form class="row g-3 pb-2">
    <!-- Flight Segment -->
    <div>
      <p class="small-text-bold m-0">{{ routeLabel }}</p>
      <span>
        <span class="extra-small-text-regular m-0">{{ flightType }}</span>

      </span>
    </div>

    <div class="m-0">
      <hr />
    </div>

    <div class="m-0">
      <p class="small-text-bold m-0">Name</p>
      <p class="extra-small-text-regular m-0">
        Please make sure that you enter your name exactly as shown on your Valid ID
      </p>
    </div>

    <!-- Name -->

    <div class="col-12">
      <div class="row g-2">
        <div class="col-4 col-md-2">
          <label for="title" class="form-label extra-small-text-bold">Title<span class="text-danger">*</span></label>
          <DropdownComponent label="" placeholder="Select" v-model="localForm.title" :items="['Mr', 'Ms']" />
        </div>
        <div class="col-8 col-md-5">
          <label for="firstName" class="form-label extra-small-text-bold">First Name<span
              class="text-danger">*</span></label>
          <input type="text" class="form-control" id="firstName" v-model="localForm.firstName" />
        </div>
        <div class="col-12 col-md-5">
          <label for="lastName" class="form-label extra-small-text-bold">Last Name<span
              class="text-danger">*</span></label>
          <input type="text" class="form-control" id="lastName" v-model="localForm.lastName" />
        </div>
      </div>
    </div>


    <!-- Birth -->
    <div>
      <p class="small-text-bold m-0">Birth<span class="text-danger">*</span></p>
    </div>
    <div class="row ">
      <div class="col-12 d-flex gap-2 mt-1">
        <div class="dropdown-day">
          <DropdownComponent label="" placeholder="Day" v-model="localForm.day" :items="days" />
        </div>

        <div class="dropdown-month">
          <DropdownComponent label="" placeholder="Month" v-model="localForm.month" :items="monthNames" />
        </div>

        <div class="dropdown-year">
          <DropdownComponent label="" placeholder="Year" v-model="localForm.year" :items="birthYears" />
        </div>

      </div>

    </div>

    <div class="row mt-1">
      <div class="col-8">
        <label class="form-label small-text-bold">Nationality<span class="text-danger">*</span></label>
        <input v-model="localForm.nationality" type="text" class="form-control" />
      </div>
    </div>
  </form>
</template>

<style scoped>
.form-control {
  border-color: var(--color-primary) !important;
}
</style>
