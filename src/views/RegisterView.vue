<script setup>
import { Notyf } from "notyf";
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";


const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const mobileNumber = ref("");
const dateOfBirth = ref("");
const isLoading = ref(false);

// validation errors
const errors = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  mobileNumber: "",
  dateOfBirth: "",
});

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "bottom" },
});

// validate individual fields
const validateField = (field) => {
  switch (field) {
    case "firstName":
      errors.value.firstName = firstName.value.trim() ? "" : "First name is required.";
      break;
    case "lastName":
      errors.value.lastName = lastName.value.trim() ? "" : "Last name is required.";
      break;
    case "email":
      errors.value.email = /^\S+@\S+\.\S+$/.test(email.value)
        ? ""
        : "Please enter a valid email address.";
      break;
    case "password":
      errors.value.password =
        password.value.length >= 6 ? "" : "Password must be at least 6 characters.";
      break;
    case "confirmPassword":
      errors.value.confirmPassword =
        password.value === confirmPassword.value
          ? ""
          : "Passwords do not match.";
      break;
    case "mobileNumber":
      errors.value.mobileNumber = /^\d{11}$/.test(mobileNumber.value)
        ? ""
        : "Mobile number must be 11 digits and numeric.";
      break;
    case "dateOfBirth":
      errors.value.dateOfBirth = dateOfBirth.value ? "" : "Date of birth is required.";
      break;
  }
};

// validate all fields at once
const validateForm = () => {
  Object.keys(errors.value).forEach((key) => validateField(key));
  return Object.values(errors.value).every((msg) => msg === "");
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    notyf.error("Please fix the errors before submitting.");
    return;
  }

  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const res = await api.post("/users/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      mobileNumber: mobileNumber.value,
      dateOfBirth: dateOfBirth.value,
    });

    console.log("Registration response:", res.data);
    notyf.success("Registration successful!");
    router.push("/login");
  } catch (err) {
    console.error("Registration error response:", err.response);

    if (err.response && err.response.data) {
      notyf.error(err.response.data.error || "Registration failed!");
    } else {
      notyf.error("Registration failed! Please check your network or backend.");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto pt-md-3 pb-md-5">
    <div class="row align-items-center justify-content-center g-0">
      <!-- Left Side: Image -->
      <div class="col-md-6 d-none d-md-block p-0">
        <div class="register-image h-full"></div>
      </div>

      <!-- Right Side: Registration Form -->
      <div class="col-md-6 col-sm-12 d-flex align-items-center justify-content-center px-4 py-5 p-md-5">
        <div class="w-100" style="max-width:720px;">
          <div class="">
            <div class="card-body">
              <h2 class="card-title text-center mb-4 fw-bold">Create Your Account</h2>
              <p class="card-text text-center text-muted mb-4">
                Join Flyx to explore seamless travel booking.
              </p>

              <form @submit="handleRegister" novalidate>
                <div class="row g-3 mb-3">
                  <div class="col">
                    <label class="form-label fw-bold">First Name</label>
                    <input class="form-control py-2" v-model="firstName" @blur="validateField('firstName')" type="text"
                      placeholder="First Name" required />
                    <small v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</small>
                  </div>

                  <div class="col">
                    <label class="form-label fw-bold">Last Name</label>
                    <input class="form-control py-2" v-model="lastName" @blur="validateField('lastName')" type="text"
                      placeholder="Last Name" required />
                    <small v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Email Address</label>
                  <input class="form-control py-2" v-model="email" @blur="validateField('email')" type="email"
                    placeholder="Email" required />
                  <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Mobile Number</label>
                  <input class="form-control py-2" v-model="mobileNumber" @blur="validateField('mobileNumber')"
                    type="text" placeholder="Mobile Number" required />
                  <small v-if="errors.mobileNumber" class="text-danger">{{ errors.mobileNumber }}</small>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Date of Birth</label>
                  <input class="form-control py-2" v-model="dateOfBirth" @blur="validateField('dateOfBirth')"
                    type="date" required />
                  <small v-if="errors.dateOfBirth" class="text-danger">{{ errors.dateOfBirth }}</small>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Password</label>
                  <input class="form-control py-2" v-model="password" @blur="validateField('password')" type="password"
                    placeholder="Password" required />
                  <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold">Confirm Password</label>
                  <input class="form-control py-2" v-model="confirmPassword" @blur="validateField('confirmPassword')"
                    type="password" placeholder="Confirm Password" required />
                  <small v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</small>
                </div>

                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg fw-bold py-2" :disabled="isLoading">
                    <span v-if="!isLoading">Sign Up</span>
                    <span v-else>
                      <i class="fas fa-spinner fa-spin me-2"></i> Registering...
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <div class="text-center mt-4">
              <p class="mb-0">
                Already have an account?
                <router-link to="/login" class="text-decoration-none fw-bold">Sign In</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-image {
  background-image: url("@/assets/images/register_image.jpg");
  background-size: cover;
  background-position: center;
  height: 480px;
}

.text-danger {
  font-size: 0.875rem;
}
</style>
