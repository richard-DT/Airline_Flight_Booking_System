<template>
  <nav class="container px-0" v-click-outside="handleClickOutside">
    <div class="navbar navbar-expand-md navbar-light bg-white">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link class="navbar-brand" to="/">
          <img class="img-fluid" src="../../assets/images/logo_dark.png" alt="Flyx Logo" height="44" />
        </router-link>

        <!-- Toggle (visible on small screens) -->
        <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarNavAltMarkup"
          :aria-expanded="visible.toString()" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapsible nav with smooth transition -->
        <div ref="menu" class="navbar-collapse" :class="{ show: visible }" :style="collapseStyle"
          id="navbarNavAltMarkup">
          <div class="navbar-nav ms-auto gap-3">
            <router-link class="nav-link" to="/">Home</router-link>
            <router-link class="nav-link" to="/about">About</router-link>
            <router-link class="nav-link" to="/contact">Contact</router-link>
            <router-link class="nav-link" to="/profile" v-if="isLoggedIn && !isAdmin">Profile</router-link>
            <router-link class="nav-link" to="/admin" v-if="isLoggedIn && isAdmin">Dashboard</router-link>
            <router-link class="nav-link" to="/login" v-if="!isLoggedIn">Sign In</router-link>
            <button class="btn btn-outline-primary" @click="logout" v-if="isLoggedIn">Log out</button>
            <router-link class="btn btn-primary" to="/register" role="button" v-if="!isLoggedIn">Sign Up</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>


</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref } from 'vue';

const userStore = useUserStore();
const { logout } = userStore;
const { isLoggedIn, isAdmin } = storeToRefs(userStore)

const visible = ref(false)
const menu = ref(null)
const menuHeight = ref('0px')

// Smoothly toggle height on small screens
function toggleNavbar() {
  visible.value = !visible.value
  nextTick(() => {
    if (visible.value) {
      menuHeight.value = menu.value.scrollHeight + 'px'
    } else {
      menuHeight.value = '0px'
    }
  })
}

// Collapse when clicking outside
function handleClickOutside() {
  if (visible.value && window.innerWidth < 768) {
    visible.value = false
    menuHeight.value = '0px'
  }
}

// Let Bootstrap handle open state for md+ screens
const collapseStyle = computed(() => {
  return window.innerWidth >= 768
    ? { height: 'auto' }
    : { height: menuHeight.value, overflow: 'hidden', transition: 'height 0.3s ease' }
})
</script>

<style scoped>
nav .nav-link {
  color: var(--color-gray-3) !important;
  transition: color 0.3s ease;
}

nav .nav-link:hover {
  color: var(--color-primary) !important;
}

/* Smooth height animation */
.navbar-collapse {
  overflow: hidden;
  transition: height 0.3s ease;
}

/* Ensure auto height for md+ */
@media (min-width: 768px) {
  .navbar-collapse {
    height: auto !important;
    overflow: visible !important;
    transition: none !important;
  }
}
</style>
