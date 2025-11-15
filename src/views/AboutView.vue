<script setup>



</script>

<template>
  <div class="container-fluid pt-4">
    <section class="hero-about container px-md-5">
      <div class="container">
        <div class="w-100 mx-auto text-left" style="max-width: 700px;">
          <h1 class="display-5 fw-bold mb-3">About Flyx</h1>
          <p class="lead text-white-75">
            Welcome to Flyx — your all-in-one airline booking companion. We make planning your trip simple,
            fast, and stress-free. From flight comparison to seat selection and travel extras, everything
            you need is in one modern app.
          </p>
        </div>
      </div>
    </section>
    <section class="container py-5">
      <div class="row g-4 mb-5">
        <div class="col-md-6">
          <div class="card1 p-4 h-100 shadow-sm">
            <h4 class="fw-bold text-primary mb-2 ms-4">Find & Compare Flights</h4>
            <p class="text-muted mb-0 ms-4">Search across airlines and filter by price, duration, and
              layovers to find the best itinerary for your trip.</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card1 p-4 h-100 shadow-sm">
            <h4 class="fw-bold text-primary mb-2 ms-4">Seat Selection</h4>
            <p class="text-muted mb-0 ms-4">Choose the best seat for comfort — we show real-time seat maps
              so you can make informed choices.</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card1 p-4 h-100 shadow-sm">
            <h4 class="fw-bold text-primary mb-2 ms-4">Travel Extras</h4>
            <p class="text-muted mb-0 ms-4">Add baggage, travel insurance, and other essentials at checkout
              — all with transparent pricing.</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card1 p-4 h-100 shadow-sm">
            <h4 class="fw-bold text-primary mb-2 ms-4">Instant Confirmations</h4>
            <p class="text-muted mb-0 ms-4">Receive immediate booking confirmations and real-time flight
              updates directly in the app.</p>
          </div>
        </div>
      </div>
      <div class="text-center pt-3 border-top">
        <p class="text-muted w-75 mx-auto">
          Built with privacy and reliability in mind. We never share personal data with third parties without
          consent, and we use secure encryption for payments and sensitive information.
        </p>
      </div>
    </section>
    <section class="container hero-section hero-get-started text-white py-5 mb-5 px-md-5" id="getStarted">
      <div class="container">
        <h2 class="display-6 fw-bold mb-4">Get Started</h2>
        <p class="lead mb-4">
          Ready to book your next trip? Use Flyx to compare, select, and checkout — all in minutes.
        </p>
        <router-link to="/" class="btn btn-light btn-lg me-3 fw-bold">Book a Flight</router-link>
        <router-link to="/login" class="btn btn-outline-light btn-lg fw-bold">Sign In</router-link>

        <div class="row mt-5">
          <div class="col-md-12">
            <h4 class="fw-bold mb-3">Why Flyx</h4>
            <ul class="list-unstyled">
              <li class="mb-2">Fast search and checkout flow</li>
              <li class="mb-2">Clear pricing for baggage & extras</li>
              <li class="mb-2">Real-time flight status & notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-about {
  position: relative;
  animation: bgFade 12s ease-in-out infinite;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #ffffff;
  padding: 6rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

@keyframes bgFade {
  0% {
    background-image: url("@/assets/images/about_image.jpg");
  }

  50% {
    background-image: url("@/assets/images/about3.png");
  }

  100% {
    background-image: url("@/assets/images/about_image.jpg");
  }
}

.hero-about::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(9, 44, 76, 0.7), rgba(9, 44, 76, 0.7));
  z-index: 1;
}

.hero-about .container {
  position: relative;
  z-index: 2;
}

.hero-about h1 {
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.hero-about p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
}

.card1 {
  background-color: #ffffff;
  color: var(--color-gray-2);
  border: 1px solid var(--color-gray-5);
  transition: all 0.3s ease;
}

.card1 h4 {
  color: var(--color-primary);
}

.card1:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-card);
}

.border-top {
  border-top: 1px solid var(--color-gray-5) !important;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

.btn-light {
  color: var(--color-primary) !important;
}

.btn-outline-light:hover {
  background-color: #ffffff !important;
  color: var(--color-primary) !important;
}

.footer-blue {
  background-color: var(--color-primary) !important;
  color: var(--color-white);
}

a,
.btn,
.card {
  transition: all 0.3s ease-in-out;
}

.card1 {
  position: relative;
  border-radius: 1.5rem !important;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card1::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 8mm;
  height: 100%;
  background-color: var(--color-primary);
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
}

.card1:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hero-get-started {
  background: linear-gradient(rgba(9, 44, 76, 0.7), rgba(9, 44, 76, 0.7)),
    url("@/assets/images/about1.jpg") center/cover no-repeat;
}

.hero-section h1,
.hero-section h2,
.hero-section p,
.hero-section .btn {
  animation: fadeInUp 1s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
