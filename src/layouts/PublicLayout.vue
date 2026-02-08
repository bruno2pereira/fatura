<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Glassmorphism Header -->
    <q-header class="glass text-dark q-py-sm" style="background-color: rgba(255,255,255,0.8);">
      <q-toolbar class="container-limit">
        <q-toolbar-title class="text-weight-bold">
          <router-link to="/" class="text-gradient-primary text-h5" style="text-decoration: none; letter-spacing: -1px;">
            <q-icon name="account_balance_wallet" color="primary" size="32px" class="q-mr-sm" />
            Toosag
          </router-link>
        </q-toolbar-title>

        <q-space />

        <!-- Desktop Navigation -->
        <div class="gt-sm row items-center q-gutter-md">
          <q-btn flat no-caps label="Blog" to="/blog" class="text-grey-8 text-weight-medium" />
          <q-btn flat no-caps label="Sobre Nós" to="/legal/about" class="text-grey-8 text-weight-medium" />
          <q-btn unelevated color="primary" label="Entrar na App" to="/app" no-caps class="q-px-lg rounded-borders" style="border-radius: 12px" />
        </div>

        <!-- Mobile Menu Button -->
        <div class="lt-md">
          <q-btn flat icon="menu" color="grey-8" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Modern Grid Footer -->
    <q-footer class="bg-white text-grey-8 section-padding border-top">
      <div class="container-limit q-mx-auto q-px-md">
        <div class="row q-col-gutter-xl">
          <!-- Brand Column -->
          <div class="col-12 col-md-4">
            <div class="text-h6 text-weight-bold text-gradient-primary q-mb-md">Toosag</div>
            <p class="text-body2 text-grey-6" style="line-height: 1.6;">
              A sua liberdade financeira começa com organização. 
              Privacidade total, sem automações invasivas.
            </p>
          </div>

          <!-- Links Column -->
          <div class="col-6 col-md-4">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Legal & Suporte</div>
            <div class="column q-gutter-sm">
              <router-link to="/legal/privacy" class="text-grey-6 hover:text-primary transition-colors" style="text-decoration: none">Privacidade</router-link>
              <router-link to="/legal/terms" class="text-grey-6 hover:text-primary transition-colors" style="text-decoration: none">Termos de Uso</router-link>
              <router-link to="/legal/about" class="text-grey-6 hover:text-primary transition-colors" style="text-decoration: none">Sobre Nós</router-link>
            </div>
          </div>

          <!-- Newsletter / Social Column -->
          <div class="col-6 col-md-4">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Mantenha-se atualizado</div>
            <p class="text-caption text-grey-6 q-mb-sm">Receba as últimas dicas de finanças no seu email.</p>
            <div class="row">
               <q-input dense outlined placeholder="Seu email" class="col bg-grey-1 rounded-borders" />
               <q-btn unelevated color="primary" label="OK" class="q-ml-sm" />
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl bg-grey-3" />

        <div class="row justify-between items-center text-caption text-grey-5">
          <div>&copy; {{ new Date().getFullYear() }} Toosag. Feito com ❤️ em Portugal.</div>
          <div class="row q-gutter-sm">
             <q-icon name="facebook" size="20px" class="cursor-pointer" />
             <q-icon name="ion-logo-twitter" size="20px" class="cursor-pointer" />
             <q-icon name="ion-logo-instagram" size="20px" class="cursor-pointer" />
          </div>
        </div>
      </div>
    </q-footer>

    <CookiesConsent />
  </q-layout>
</template>

<script setup>
import CookiesConsent from 'components/public/CookiesConsent.vue'
</script>

<style scoped>
.border-top {
  border-top: 1px solid #f1f5f9;
}
.transition-colors {
  transition: color 0.3s ease;
}
.hover\:text-primary:hover {
  color: var(--primary);
}
</style>
