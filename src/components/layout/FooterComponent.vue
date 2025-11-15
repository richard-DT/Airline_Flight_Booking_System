<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const showModal = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");
const router = useRouter();

const TERMS_MESSAGE = `
Welcome to Flyx Airlines. By using our services, you agree to the following terms and conditions:
1. Flight bookings are subject to availability and confirmation.
2. Tickets are non-transferable and may not be resold.
3. Passengers must comply with all applicable laws and airport regulations.
4. Flyx Airlines is not liable for delays or cancellations beyond our control.
5. Changes or cancellations may incur fees as stated in our fare rules.
6. All personal information provided must be accurate and truthful.
`;

const PRIVACY_MESSAGE = `
At Flyx Airlines, your privacy is important to us. We are committed to protecting your personal information. 
- Information We Collect: Name, email, contact number, travel preferences, and booking details.
- How We Use Your Information: To process bookings, provide customer support, and send updates.
- Data Sharing: Only with trusted partners to fulfill services. We do not sell your information.
- Your Rights: Access, correct, or request deletion of your data. Opt-out of promotional communications.
- Data Security: We use technical and organizational measures to safeguard your data.
`;

const openModal = (title, message) => {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <footer class="container-fluid">
    <div class="pt-5 pb-2 container">
      <div class="row">
        <div class="col-md-3 offset-md-1 mb-3">
          <router-link to="/">
            <img class="img-fluid" src="@/assets/images/logo_white.png" alt="Flyx Logo" height="44" />
          </router-link>
        </div>
        <div class="col-6 col-md-2 mb-3">
          <h5>About Us</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <router-link to="/about" class="nav-link p-0 text-body-secondary">About Flyx</router-link>
            </li>
            <li class="nav-item mb-2">
              <router-link to="/about" class="nav-link p-0 text-body-secondary">Benefits</router-link>
            </li>
            <li class="nav-item mb-2">
              <router-link to="/about" class="nav-link p-0 text-body-secondary">Get Started</router-link>
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-2 mb-3">
          <h5>Contact Us</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <router-link to="/contact" class="nav-link p-0 text-body-secondary">Locations</router-link>
            </li>
            <li class="nav-item mb-2">
              <router-link to="/contact" class="nav-link p-0 text-body-secondary">Office Schedule</router-link>
            </li>
          </ul>
        </div>
        <div class="col-6 col-md-2 mb-3">
          <h5>Privacy</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2">
              <a href="#" class="nav-link p-0 text-body-white"
                 @click.prevent="openModal('Terms and Conditions', TERMS_MESSAGE)">
                Terms and Conditions
              </a>
            </li>
            <li class="nav-item mb-2">
              <a href="#" class="nav-link p-0 text-body-secondary"
                 @click.prevent="openModal('Privacy Notice', PRIVACY_MESSAGE)">
                Privacy Notice
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-5 mb-2 gap-5 d-flex justify-content-center footer-socials">
        <a href="#"><i class="bi bi-facebook fs-3"></i></a>
        <a href="#"><i class="bi bi-instagram fs-3"></i></a>
        <a href="#"><i class="bi bi-twitter-x fs-3"></i></a>
        <a href="#"><i class="bi bi-messenger fs-3"></i></a>
      </div>

      <div class="py-4 my-4 text-center">
        <p>© 2025 Flyx, Inc. All rights reserved.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal">
      <div class="modal d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content bg-white text-dark">
            <div class="modal-header">
              <h5 class="modal-title fw-bold fs-5">{{ modalTitle }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <pre class="m-0 fw-normal fs-6" style="white-space: pre-wrap; word-wrap: break-word;">
                {{ modalMessage }}
              </pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary fw-bold" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>


  </footer>
</template>

<style scoped>
footer {
  background-color: var(--color-primary) !important;
  color: var(--color-white);
}

footer a {
  color: var(--color-gray-4) !important;
  text-decoration: none !important;
}

footer a:hover {
  color: var(--color-white) !important;
}

footer .footer-socials a {
  color: inherit !important;
  text-decoration: none !important;
}


</style>
