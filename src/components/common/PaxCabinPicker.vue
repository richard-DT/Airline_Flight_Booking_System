<script setup>
import { cabinTypes } from '@/data/flights'
import { Modal } from 'bootstrap'
import { onMounted, ref, watch } from 'vue'
import DropdownComponent from '../ui/DropdownComponent.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      pax: { adults: 1, children: 0, infants: 0 },
      cabin: 'Economy'
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const modal = ref(null)
const modalEl = ref(null)

// Temporary state for the modal
const tempPax = ref({
  adults: props.modelValue?.pax?.adults ?? 1,
  children: props.modelValue?.pax?.children ?? 0,
  infants: props.modelValue?.pax?.infants ?? 0,
})
const tempCabin = ref(props.modelValue?.cabin ?? 'Economy')

// Input display state (only updated on Save)
const displayText = ref(`${(tempPax.value.adults + tempPax.value.children + tempPax.value.infants)} Pax, ${tempCabin.value}`)

onMounted(() => {
  modal.value = new Modal(modalEl.value)
})

// Keep modal in sync if parent updates v-model
watch(
  () => props.modelValue,
  (newVal) => {
    tempPax.value = {
      adults: newVal?.pax?.adults ?? 1,
      children: newVal?.pax?.children ?? 0,
      infants: newVal?.pax?.infants ?? 0,
    }
    tempCabin.value = newVal?.cabin ?? 'Economy'
    displayText.value = `${tempPax.value.adults + tempPax.value.children + tempPax.value.infants} Pax, ${tempCabin.value}`
  }
)

function openModal() {
  modal.value.show()
}

function increment(key) {
  tempPax.value[key]++
}

function decrement(key) {
  // Prevent adults from going below 1
  if (key === 'adults' && tempPax.value.adults <= 1) return
  if (tempPax.value[key] > 0) tempPax.value[key]--
}

function saveChanges() {
  modal.value.hide()
  // Update the input and emit
  displayText.value = `${tempPax.value.adults + tempPax.value.children + tempPax.value.infants} Pax, ${tempCabin.value}`
  emit('update:modelValue', { pax: { ...tempPax.value }, cabin: tempCabin.value })
}
</script>

<template>
  <div class="mb-3">
    <label class="form-label fw-semibold">Passengers & Cabin</label>
    <input type="text" class="form-control" :value="displayText" readonly @click="openModal" />

    <div class="modal fade" tabindex="-1" aria-hidden="true" ref="modalEl">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Passengers & Cabin</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Passengers</label>
              <div v-for="(count, key) in tempPax" :key="key"
                class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-capitalize">{{ key }}</span>
                <div class="btn-group">
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="decrement(key)">-</button>
                  <span class="px-3 pt-1">{{ count }}</span>
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="increment(key)">+</button>
                </div>
              </div>
            </div>

            <div class="mt-4 w-25">
              <DropdownComponent label="Cabin Class" v-model="tempCabin" :items="cabinTypes" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveChanges">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.btn-group button {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
