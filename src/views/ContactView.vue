<script setup>
import { ref } from "vue";
import api from "../api/api.js";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const name = ref("");
const email = ref("");
const message = ref("");
const isLoading = ref(false);

// Inline error messages
const nameError = ref("");
const emailError = ref("");
const messageError = ref("");

const notyf = new Notyf({ duration: 3000, position: { x: "right", y: "bottom" } });

// Validation helpers
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidMessage = (msg) => msg.trim().length >= 10;
const isValidName = (n) => n.trim().length >= 2;

const validateForm = () => {
  let valid = true;

  if (!isValidName(name.value)) {
    nameError.value = "Please enter at least 2 characters.";
    valid = false;
  } else {
    nameError.value = "";
  }

  if (!isValidEmail(email.value)) {
    emailError.value = "Please enter a valid email address.";
    valid = false;
  } else {
    emailError.value = "";
  }

  if (!isValidMessage(message.value)) {
    messageError.value = "Message must be at least 10 characters.";
    valid = false;
  } else {
    messageError.value = "";
  }

  return valid;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isLoading.value) return;

  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await api.post("/contact", {
      name: name.value,
      email: email.value,
      message: message.value,
    });

    notyf.success("Thank you! Your message has been sent.");

    // Clear form and errors
    name.value = "";
    email.value = "";
    message.value = "";
    nameError.value = "";
    emailError.value = "";
    messageError.value = "";
  } catch (err) {
    console.error(err);
    notyf.error("Failed to send message. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto pt-md-3 pb-md-5">
    <div class="row align-items-center justify-content-center g-0">
      <!-- Left Side Image -->
      <div class="col-md-6 d-none d-md-block py-5 px-0">
        <div class="contact-image"></div>
      </div>

      <!-- Right Side Contact Form -->
      <div class="col-md-6 col-sm-12 d-flex align-items-center justify-content-center px-4 py-5 p-md-5">
        <div class="w-100" style="max-width: 720px;">
          <div class="card-body">
            <h2 class="text-center mb-4 fw-bold">Get in touch</h2>
            <p class="text-center text-muted mb-4">
              We'd love to hear from you! Please fill out the form below.
            </p>

            <form @submit="handleSubmit">
              <!-- Name Field -->
              <div class="mb-3">
                <label class="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  class="form-control py-2"
                  v-model="name"
                  placeholder="Your full name"
                  :class="{ 'is-invalid': nameError }"
                  required
                />
                <div v-if="nameError" class="invalid-feedback">{{ nameError }}</div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label class="form-label fw-bold">Email Address</label>
                <input
                  type="email"
                  class="form-control py-2"
                  v-model="email"
                  placeholder="name@example.com"
                  :class="{ 'is-invalid': emailError }"
                  required
                />
                <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
              </div>

              <!-- Message Field -->
              <div class="mb-4">
                <label class="form-label fw-bold">Message</label>
                <textarea
                  class="form-control py-2"
                  rows="4"
                  v-model="message"
                  placeholder="Write your message..."
                  :class="{ 'is-invalid': messageError }"
                  required
                ></textarea>
                <div v-if="messageError" class="invalid-feedback">{{ messageError }}</div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-2" :disabled="isLoading">
                  <span v-if="!isLoading">Send Message</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </span>
                </button>
              </div>
            </form>

            <p class="text-center text-muted mb-4">
              Office Address: 6th Flr. Oledan Square, Ayala Avenue. Makati City (Philippines)
              | Contact No: (02)711-8037 | Office Hours: Mon - Fri 8am to 5pm
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-image {
  background-image: url("../assets/images/contact_image.jpg");
  background-size: cover;
  background-position: center;
  height: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .contact-image {
    display: none;
  }
}
</style>
