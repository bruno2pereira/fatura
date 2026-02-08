<template>
  <div v-if="!accepted" class="cookie-consent fixed-bottom bg-grey-10 text-white q-pa-md z-max shadow-up-2">
    <div class="row items-center justify-between container-limit q-mx-auto">
      <div class="col-12 col-md-8">
        <div class="text-bold q-mb-xs">{{ $t('public.cookies.title') }} 🍪</div>
        <div class="text-caption">
          {{ $t('public.cookies.description') }}
          <router-link to="/legal/privacy" class="text-primary text-weight-bold">{{ $t('public.cookies.learnMore') }}</router-link>.
        </div>
      </div>
      <div class="col-12 col-md-4 text-right q-mt-sm q-mt-md-none">
        <q-btn flat color="white" :label="$t('public.cookies.decline')" @click="decline" class="q-mr-sm" />
        <q-btn unelevated color="primary" :label="$t('public.cookies.acceptAll')" @click="accept" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const accepted = ref(true)

const STORAGE_KEY = 'cookie_consent_status'

onMounted(() => {
  const status = localStorage.getItem(STORAGE_KEY)
  if (!status) {
    accepted.value = false
  }
})

const accept = () => {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  accepted.value = true
}

const decline = () => {
  localStorage.setItem(STORAGE_KEY, 'declined')
  accepted.value = true
}
</script>

<style scoped>
.container-limit {
  max-width: 1200px;
  width: 100%;
}
</style>
