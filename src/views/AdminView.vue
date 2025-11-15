<template>
  <main class="container mt-5 mx-auto">
    <div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
      <button class="btn btn-primary" @click="section = 'users'">User Management</button>
      <button class="btn btn-primary" @click="section = 'flights'">Flights Management</button>
      <button class="btn btn-primary" @click="section = 'bookings'">Bookings Management</button>
      <button class="btn btn-primary" @click="section = 'airlines'">Airlines Management</button>
      <button class="btn btn-primary" @click="section = 'airports'">Airports Management</button>
      <button class="btn btn-primary" @click="section = 'passengers'">Passengers Management</button>
      <button class="btn btn-primary" @click="section = 'payments'">Payments Management</button>
    </div>

    <!-- Conditional rendering of components -->
    <div v-if="section === 'users'">
      <UserManagement />
    </div>

    <div v-if="section === 'flights'">
      <FlightManagement />
    </div>

    <div v-if="section === 'bookings'">
      <BookingManagement />
    </div>

    <div v-if="section === 'airlines'">
      <AirlineManagement />
    </div>

    <div v-if="section === 'airports'">
      <AirportManagement />
    </div>

    <div v-if="section === 'passengers'">
      <PassengerManagement />
    </div>

    <div v-if="section === 'payments'">
      <PaymentManagement />
    </div>

  </main>
</template>

<script setup>
import { ref } from "vue";
import UserManagement from "@/components/adminDashboard/UserManagement.vue";
import FlightManagement from "@/components/adminDashboard/FlightManagement.vue";
import BookingManagement from "@/components/adminDashboard/BookingManagement.vue";
import AirlineManagement from "@/components/adminDashboard/AirlineManagement.vue";
import AirportManagement from "@/components/adminDashboard/AirportManagement.vue";
import PassengerManagement from "@/components/adminDashboard/PassengerManagement.vue";
import PaymentManagement from "@/components/adminDashboard/PaymentManagement.vue";

const section = ref("users"); // default section
</script>


<style scoped>
button {
  min-width: 150px;
}
</style>
