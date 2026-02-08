<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">{{ $t('public.about.title') }}</h1>

    <div class="text-body1 q-gutter-y-md">
      <p class="text-h6 text-weight-regular text-grey-8">
        {{ $t('public.about.tagline') }}
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.about.missionTitle') }}</h2>
      <p>{{ $t('public.about.missionText') }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.about.teamTitle') }}</h2>
      <p>{{ $t('public.about.teamText') }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.about.commitmentTitle') }}</h2>
      <p>{{ $t('public.about.commitmentText') }}</p>

      <q-separator class="q-my-xl" />

      <div class="text-center">
        <h3 class="text-h4 text-weight-bold q-mb-md">{{ $t('public.about.ctaTitle') }}</h3>
        <p class="q-mb-lg">{{ $t('public.about.ctaText') }}</p>
        <q-btn color="primary" :label="$t('public.about.ctaButton')" to="/login" size="lg" no-caps />
      </div>
    </div>
  </q-page>
</template>

<script setup>
</script>

<style scoped>
.container-limit {
  max-width: 800px;
  width: 100%;
}
</style>
