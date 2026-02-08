<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">{{ $t('public.privacy.title') }}</h1>
    <p class="text-caption text-grey-7 q-mb-xl">{{ $t('public.privacy.lastUpdate') }} {{ new Date().toLocaleDateString() }}</p>

    <div class="text-body1 q-gutter-y-md">
      <p>{{ $t('public.privacy.intro', { app: 'Toosag' }) }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.privacy.section1Title') }}</h2>
      <p>
        {{ $t('public.privacy.section1Text') }}
        <ul>
          <li><strong>{{ $t('public.privacy.section1Item1') }}</strong></li>
          <li><strong>{{ $t('public.privacy.section1Item2') }}</strong></li>
        </ul>
        {{ $t('public.privacy.section1Footer') }}
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.privacy.section2Title') }}</h2>
      <p>
        {{ $t('public.privacy.section2Text') }}
        <ul>
          <li>{{ $t('public.privacy.section2Item1') }}</li>
          <li>{{ $t('public.privacy.section2Item2') }}</li>
          <li>{{ $t('public.privacy.section2Item3') }}</li>
        </ul>
        <strong>{{ $t('public.privacy.section2Footer') }}</strong>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.privacy.section3Title') }}</h2>
      <p>
        {{ $t('public.privacy.section3Text') }}
        <ul>
          <li>{{ $t('public.privacy.section3Item1') }}</li>
          <li>{{ $t('public.privacy.section3Item2') }}</li>
          <li>{{ $t('public.privacy.section3Item3', { link: '' }) }} <a href="https://www.google.com/settings/ads" target="_blank">{{ $t('public.privacy.section3Link') }}</a>.</li>
        </ul>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.privacy.section4Title') }}</h2>
      <p>{{ $t('public.privacy.section4Text') }}</p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">{{ $t('public.privacy.section5Title') }}</h2>
      <p>
        {{ $t('public.privacy.section5Text') }}
        <ul>
          <li>{{ $t('public.privacy.section5Item1') }}</li>
          <li>{{ $t('public.privacy.section5Item2') }}</li>
          <li>{{ $t('public.privacy.section5Item3') }}</li>
          <li>{{ $t('public.privacy.section5Item4') }}</li>
        </ul>
        {{ $t('public.privacy.section5Footer') }}
      </p>
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
