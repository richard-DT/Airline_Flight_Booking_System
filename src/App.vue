<script setup>
import { RouterView } from 'vue-router';
import FooterComponent from './components/layout/FooterComponent.vue';
import NavbarComponent from './components/layout/NavbarComponent.vue';
</script>

<template>
  <div class="app-container">
    <header>
      <NavbarComponent />
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer>
      <FooterComponent />
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  /* pushes footer to bottom if content is short */
}
</style>
