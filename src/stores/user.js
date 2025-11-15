import api from '@/api/api';
import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  // Load user from localStorage or initialize empty
  const storedUser = JSON.parse(localStorage.getItem('user')) || {
    token: null,
    userId: null,
    email: null,
    firstName: null,
    lastName: null,
    mobileNumber: null,
    dateOfBirth: null,
    createdAt: null,
    role: null,
  };

  // Reactive state
  const user = reactive(storedUser);

  // Computed state
  const isLoggedIn = computed(() => !!(user.token && user.email));
  const isAdmin = computed(() => user.role === 'Admin');

  // Fetch user details
  async function getUserDetails(token) {
    if (!token) {
      logout();
      return;
    }

    try {
      const { data } = await api.get('/users/profile');
      Object.assign(user, {
        token,
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        createdAt: data.createdAt,
        role: data.role,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    }
  }

  // Login
  async function login(email, password) {
    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data.token) {
        user.token = data.token;
        localStorage.setItem('token', data.token);

        await getUserDetails(data.token);


        // Redirect by role
        if (user.role === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  }

  // Logout
  function logout() {
    Object.keys(user).forEach(key => (user[key] = null));
    localStorage.removeItem('token');
    try {
      router.push('/login');
    } catch {
      console.warn('Router not available during logout');
    }
  }


  // Watch for user changes and persist in localStorage
  watch(
    () => user,
    (newVal) => {
      localStorage.setItem('user', JSON.stringify(newVal));
    },
    { deep: true }
  );

  // Rehydrate token from localStorage
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    user.token = savedToken;
    getUserDetails(savedToken);
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    getUserDetails,
    login,
    logout,
  };
}, {
  persist: false,
});
