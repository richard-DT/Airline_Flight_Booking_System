<script setup>
import getawayImage1 from '@/assets/images/getaway1.jpg';
import getawayImage2 from '@/assets/images/getaway2.jpg';
import getawayImage3 from '@/assets/images/getaway3.jpg';
import FlightSearchForm from '@/components/common/FlightSearchForm.vue';
import CardComponent from '@/components/ui/CardComponent.vue';
import { useAirportsStore } from '@/stores/airports';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const airportStore = useAirportsStore();
const isReady = ref(false);

function handleGetAwayClick() {
  router.push('/flights');
}

onMounted(async () => {
  try {
    await airportStore.fetchAirports();
  } catch (error) {
    console.error("Failed to fetch airports:", error);
  } finally {
    isReady.value = true;
  }
});


</script>

<template>
  <div v-if="!isReady" class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="container-fluid d-flex flex-column min-vh-100 p-0">
    <div class="container-fluid p-0">
      <section class="hero container py-5">
        <h1
          class="hero-title d-flex flex-column justify-content-center align-items-center gap-2 fw-bold fs-1 mb-5 mt-5 pt-md-5">
          <span>Smarter Flights</span>
          <span>Seamless Booking</span>
        </h1>

        <!-- Flight Search Form -->
        <div class="container px-0 mb-md-5 pb-md-5">
          <FlightSearchForm />
        </div>
      </section>

      <!-- Getaways Section -->
      <section class="getaways">
        <div class="container py-5">
          <h2 class="section-title mb-1">Discover the world's favorite getaways!</h2>
          <p class="mb-5">From beaches to cities — your dream destination awaits.</p>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <CardComponent :image="getawayImage1" title="Iloilo"
                description="Discover Iloilo: heritage streets, Spanish-era churches, delicious batchoy, and nearby beaches for the perfect quick escape"
                primaryText="Book Now" miscText="PHP 1,299" @primary-click="handleGetAwayClick" />
            </div>
            <div class="col-md-6 col-lg-4">
              <CardComponent :image="getawayImage2" title="Macau"
                description="Macau dazzles with a mix of glitzy casinos, Portuguese heritage, cobblestone streets, and world-famous egg tarts."
                primaryText="Book Now" miscText="PHP 4,900" @primary-click="handleGetAwayClick" />
            </div>
            <div class="col-md-6 col-lg-4">
              <CardComponent :image="getawayImage3" title="Laoag"
                description="Laoag charms with historic churches, wind-swept sand dunes, and vibrant local markets—a gateway to Ilocos Norte's rich culture."
                primaryText="Book Now" miscText="PHP 1,472" @primary-click="handleGetAwayClick" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background:
    linear-gradient(rgba(var(--color-primary-rgb), 0.7), rgba(var(--color-primary-rgb), 0.7)),
    url('../assets/images/hero_bg.jpg') no-repeat center center;
  background-size: cover;
  max-width: 100% !important;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
  color: var(--color-white)
}

.getaway-card {
  border-radius: 10px;
  box-shadow: var(--shadow-card);
}

.getaway-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
</style>
