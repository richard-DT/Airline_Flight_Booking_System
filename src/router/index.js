import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public pages for guests & logged-in userss
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/flights', name: 'flights', component: () => import('../views/FlightsView.vue') },
    { path: '/guests', name: 'guests', component: () => import('../views/GuestsView.vue') },
    { path: '/add-ons', name: 'add-ons', component: () => import('../views/AddOnsView.vue') },
    { path: '/payment', name: 'payment', component: () => import('../views/PaymentView.vue') },
    { path: '/payment-method', name: 'payment-method', component: () => import('../views/PaymentMethodView.vue') },
    { path: '/confirmation', name: 'confirmation', component: () => import('../views/ConfirmationView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },

    // Guest-only
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },

    // Logged-in users
    { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true, role: 'Customer' } },

    // Admin
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { requiresAuth: true, role: 'Admin' } },

    // Fallback
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue') },

    // logout(sharing with the notfound page)
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: true }
    }


  ],
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Guest-only pages: prevent logged-in users
  if (to.meta.guestOnly && token) {
    if (user?.role === 'Admin') return next('/admin')
    return next('/profile')
  }

  // Auth-required pages: prevent guests
  if (to.meta.requiresAuth && !token) return next('/login')

  // Admin strict access: only /admin and /logout
  if (user?.role === 'Admin') {
    if (!['/admin', '/logout'].includes(to.path)) return next('/admin')
  }

  // Role-restricted pages for non-admin users
  if (to.meta.role && user?.role !== to.meta.role) {
    return next('/profile') // redirect non-admin users to their profile
  }

  next()
})

export default router
