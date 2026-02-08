const routes = [
  // Public Routes
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: '', component: () => import('pages/public/LandingPage.vue') },
      { path: 'blog', component: () => import('pages/public/blog/BlogIndexPage.vue') },
      { path: 'blog/:slug', component: () => import('pages/public/blog/BlogPostPage.vue') },
      { path: 'legal/privacy', component: () => import('pages/public/compliance/PrivacyPage.vue') },
      { path: 'legal/terms', component: () => import('pages/public/compliance/TermsPage.vue') }, // Will create file next
      { path: 'legal/about', component: () => import('pages/public/compliance/AboutPage.vue') }, // Will create file next
    ]
  },

  // App Routes (Authenticated)
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SelectionPage.vue') },
      { path: 'invoices', component: () => import('pages/DashboardPage.vue') },
      { path: 'documents', component: () => import('pages/DocumentsPage.vue') },
      { path: 'balance', component: () => import('pages/BalancePage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
