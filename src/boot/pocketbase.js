import { boot } from 'quasar/wrappers'
import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.VITE_POCKETBASE_URL || 'https://toosag.pockethost.io')

export default boot(({ app, router }) => {
  app.config.globalProperties.$pb = pb

  router.beforeEach((to, from, next) => {
    // Check if route requires auth
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!pb.authStore.isValid) {
        // Not logged in, redirect to login
        return next('/login')
      }
    }

    // Redirect logged in users from /login or / (home) to /app
    if (pb.authStore.isValid && (to.path === '/login' || to.path === '/')) {
      return next('/app')
    }

    next()
  })
})

export { pb }
