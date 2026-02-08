<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Glassmorphism Header -->
    <q-header class="glass text-dark q-py-sm" style="background-color: rgba(255, 255, 255, 0.8)">
      <q-toolbar class="container-limit">
        <q-toolbar-title class="text-weight-bold">
          <router-link
            to="/"
            class="text-gradient-primary text-h5"
            style="text-decoration: none; letter-spacing: -1px"
          >
            <q-icon name="account_balance_wallet" color="primary" size="32px" class="q-mr-sm" />
            {{ $t('app.name') }}
          </router-link>
        </q-toolbar-title>

        <q-space />

        <!-- Desktop Navigation -->
        <div class="gt-sm row items-center q-gutter-md">
          <q-btn
            flat
            no-caps
            :label="$t('public.header.blog')"
            to="/blog"
            class="text-grey-8 text-weight-medium"
          />
          <q-btn
            flat
            no-caps
            :label="$t('public.header.about')"
            to="/legal/about"
            class="text-grey-8 text-weight-medium"
          />
          <q-btn
            unelevated
            color="primary"
            :label="$t('public.header.enterApp')"
            to="/app"
            no-caps
            class="q-px-lg rounded-borders"
            style="border-radius: 12px"
          />
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
    <footer class="bg-white text-grey-8 section-padding border-top">
      <div class="container-limit q-mx-auto q-px-md">
        <div class="row q-col-gutter-xl">
          <!-- Brand Column -->
          <div class="col-12 col-md-4">
            <div class="text-h6 text-weight-bold text-gradient-primary q-mb-md">
              {{ $t('app.name') }}
            </div>
            <p class="text-body2 text-grey-6" style="line-height: 1.6">
              {{ $t('public.footer.tagline') }}
            </p>
          </div>

          <!-- Links Column -->
          <div class="col-6 col-md-4">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">
              {{ $t('public.footer.legal') }}
            </div>
            <div class="column q-gutter-sm">
              <router-link
                to="/legal/privacy"
                class="text-grey-6 hover:text-primary transition-colors"
                style="text-decoration: none"
                >{{ $t('public.footer.privacy') }}</router-link
              >
              <router-link
                to="/legal/terms"
                class="text-grey-6 hover:text-primary transition-colors"
                style="text-decoration: none"
                >{{ $t('public.footer.terms') }}</router-link
              >
              <router-link
                to="/legal/about"
                class="text-grey-6 hover:text-primary transition-colors"
                style="text-decoration: none"
                >{{ $t('public.footer.about') }}</router-link
              >
            </div>
          </div>

          <!-- Newsletter / Social Column -->
          <div class="col-6 col-md-4">
            <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">
              {{ $t('public.footer.newsletter') }}
            </div>
            <p class="text-caption text-grey-6 q-mb-sm">{{ $t('public.footer.newsletterDesc') }}</p>
            <div class="row">
              <q-input
                dense
                outlined
                :placeholder="$t('public.footer.emailPlaceholder')"
                class="col bg-grey-1 rounded-borders"
              />
              <q-btn unelevated color="primary" label="OK" class="q-ml-sm" />
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl bg-grey-3" />

        <div class="row justify-between items-center text-caption text-grey-5">
          <div>
            &copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}.
            {{ $t('public.footer.copyright') }}
          </div>
        </div>
      </div>
    </footer>

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
