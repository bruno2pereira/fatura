const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SelectionPage.vue') },
      { path: 'invoices', component: () => import('pages/DashboardPage.vue') },
      { path: 'documents', component: () => import('pages/DocumentsPage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
