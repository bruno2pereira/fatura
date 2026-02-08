<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">{{ $t('public.terms.title') }}</h1>
    <p class="text-caption text-grey-7 q-mb-xl">{{ $t('public.terms.lastUpdate') }} {{ new Date().toLocaleDateString() }}</p>

    <div class="text-body1 q-gutter-y-md">
      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section1Title') }}</h2>
      <p>{{ $t('public.terms.section1Text', { app: 'Toosag' }) }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section2Title') }}</h2>
      <p>
        {{ $t('public.terms.section2Text') }}
        <br/><strong>{{ $t('public.terms.section2Disclaimer') }}</strong>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section3Title') }}</h2>
      <p>
        {{ $t('public.terms.section3Text') }}
        <ul>
          <li>{{ $t('public.terms.section3Item1') }}</li>
          <li>{{ $t('public.terms.section3Item2') }}</li>
          <li>{{ $t('public.terms.section3Item3') }}</li>
        </ul>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section4Title') }}</h2>
      <p>{{ $t('public.terms.section4Text') }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section5Title') }}</h2>
      <p>{{ $t('public.terms.section5Text') }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.terms.section6Title') }}</h2>
      <p>{{ $t('public.terms.section6Text') }}</p>
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
