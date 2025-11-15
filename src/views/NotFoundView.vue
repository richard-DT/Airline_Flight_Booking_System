<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import airplane from '@/assets/images/airplane.png'

// Get current route
const route = useRoute()
const router = useRouter()

// Check if this page is logout
const isLogoutPage = route.path === '/logout'

onMounted(() => {
  // If logout page, clear saved data
  if (isLogoutPage) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})
</script>

<template>
  <div class="text-dark">
    <div class="d-flex align-items-center justify-content-center min-vh-100 px-2">
      <div class="text-center wrapper">
        <img :src="airplane" class="img-fluid mb-5" />

        <!-- If logout -->
        <template v-if="isLogoutPage">
          <h1 class="display-5 fw-bold text-success mb-3">You have logged-out successfully!</h1>
          <p class="fs-5">Thank you for visiting us. We hope to see you again soon!</p>
          <router-link :to="{ name: 'home' }" class="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn mt-4">
            Go Home
          </router-link>
        </template>

        <!-- If not found -->
        <template v-else>
          <h1 class="display-1 fw-bold">404</h1>
          <p class="fs-2 fw-medium mt-4">Oops! Page not found</p>
          <p class="mt-4 mb-5">The page you're looking for doesn't exist or has been moved.</p>
          <router-link :to="{ name: 'home' }" class="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
            Go Home
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: -200px;
}
</style>
