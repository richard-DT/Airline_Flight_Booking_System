<script setup>
import { useUserStore } from '@/stores/user.js'
import { Notyf } from 'notyf'
import { ref } from 'vue'
import api from '../api/api.js'


const userStore = useUserStore()
const { login } = userStore

// refs
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// notyf instance
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'bottom' }
})

const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      notyf.success('Login successful! Welcome back.')

    } else {
      notyf.error(result.message || 'Login failed. Please try again.')
    }
  } catch (error) {
    console.error(error)
    notyf.error('An unexpected error occurred. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

const getBookings = async () => {
  try {
    const res = await api.get('/bookings/history') // token is auto-attached
    console.log(res.data)
  } catch (err) {
    console.error(err)
  }
}
</script>


<template>
  <div class="container mx-auto pt-md-3 pb-md-5">
    <div class="row align-items-center justify-content-center g-0">
      <div class="col-md-6 d-none d-md-block py-5 px-0">
        <div class="login-image"></div>
      </div>

      <div class="col-md-6 col-sm-12 d-flex align-items-center justify-content-center px-4 py-5 p-md-5">
        <div class="w-100" style="max-width:720px;">
          <div class="">
            <div class="card-body">
              <h2 class="card-title text-center mb-4 fw-bold">Welcome Back!</h2>
              <p class="card-text text-center text-muted mb-4">
                Log into your Flyx account to manage your bookings.
              </p>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="emailInput" class="form-label fw-bold">Email address</label>
                  <input type="email" class="form-control py-2" id="emailInput" v-model="email"
                    placeholder="name@example.com" required />
                </div>
                <div class="mb-4">
                  <label for="passwordInput" class="form-label fw-bold">Password</label>
                  <input type="password" class="form-control py-2" id="passwordInput" v-model="password"
                    placeholder="Enter your password" required />
                </div>
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg fw-bold py-2" :disabled="isLoading">
                    <span v-if="!isLoading">Log In</span>
                    <span v-else><i class="fas fa-spinner fa-spin me-2"></i>Logging in .....</span>
                  </button>
                </div>
                <div class="text-center">
                  <a href="#" class="text-decoration-none">Forgot Password?</a>
                </div>
              </form>
            </div>
            <div class="text-center mt-4">
              <p class="mb-0">
                Don't have an account?
                <a href="./register" class="text-decoration-none fw-bold">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
.login-image {
  background-image: url("@/assets/images/login_image.jpg");
  background-size: cover;
  background-position: center;
  height: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.col-md-6>.login-image {
  display: block;
  min-height: 100%;
}

.login-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.bypass-container {
  max-width: 520px;
  background: #f8f9fa;
  border-left: 4px solid var(--color-primary);
  border-radius: 10px;
}

@media (max-width: 767px) {
  .login-image {
    display: none;
  }

  main.container-fluid {
    padding-top: 2rem;
  }
}
</style>
