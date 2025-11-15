<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold" id="modalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="body">
            Default modal body content
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as bootstrap from 'bootstrap'
import { defineExpose, onMounted, ref } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Modal title'
  }
})

const modalElement = ref(null)
let modalInstance = null

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalElement.value)
})

// Expose modal controls to parent
const open = () => modalInstance?.show()
const close = () => modalInstance?.hide()

defineExpose({ open, close })
</script>
