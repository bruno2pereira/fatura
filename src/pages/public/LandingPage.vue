<template>
  <q-page>
    <!-- Immersive Hero Section -->
    <section class="hero-section relative-position overflow-hidden section-padding q-pb-none">
      <!-- Abstract Background Blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>

      <div class="container-limit q-mx-auto row items-center q-px-md relative-position z-top">
        <div class="col-12 col-md-6 q-pr-md-xl text-center text-md-left">
          <div class="text-overline text-primary text-weight-bold tracking-widest q-mb-sm">{{ $t('public.landing.overline') }}</div>
          <h1 class="text-h2 text-weight-bolder q-mb-md text-dark tight-line-height">
            {{ $t('public.landing.headline') }}<br/>
            <span class="text-gradient-primary">{{ $t('public.landing.headlineHighlight') }}</span>
          </h1>
          <p class="text-h6 text-weight-regular q-mb-xl text-grey-7" style="max-width: 500px; line-height: 1.6;">
            {{ $t('public.landing.description') }}
          </p>
          <div class="q-gutter-md row justify-center justify-md-start">
            <q-btn unelevated color="primary" size="lg" :label="$t('public.landing.ctaStart')" to="/login" no-caps class="shadow-lg hover-lift" />
            <q-btn outline color="primary" size="lg" :label="$t('public.landing.ctaLearnMore')" @click="scrollToFeatures" no-caps class="bg-white" />
          </div>

          <div class="row items-center q-mt-lg text-grey-6 text-caption justify-center justify-md-start">
            <q-icon name="check_circle" color="green" class="q-mr-xs" /> {{ $t('public.landing.noCard') }}
            <q-icon name="check_circle" color="green" class="q-ml-md q-mr-xs" /> {{ $t('public.landing.free') }}
          </div>
        </div>

        <div class="col-12 col-md-6 q-mt-xl q-mt-md-none text-center perspective-container">
          <!-- Floating Dashboard Mockup -->
          <div class="floating-dashboard glass q-pa-sm rounded-xl shadow-2xl">
             <q-img
              src="https://cdn.quasar.dev/img/layout-gallery/twitter-web.png"
              class="rounded-xl"
              style="min-height: 300px; max-width: 100%;"
              fit="cover position-top"
            >
              <div class="absolute-full flex flex-center bg-transparent-grad">
                 <!-- Mock UI Overlay -->
                 <div class="text-white text-center">
                    <q-icon name="analytics" size="80px" />
                    <div class="text-h6 q-mt-sm">{{ $t('public.landing.dashboardSecure') }}</div>
                 </div>
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </section>

    <!-- AdSense Block (Top) -->
    <div class="container-limit q-mx-auto q-mt-xl">
      <AdSenseBlock slotId="1234567890" />
    </div>

    <!-- Features Section (Diferencial Competitivo) -->
    <section id="features" class="section-padding bg-white relative-position">
       <div class="container-limit q-mx-auto q-px-md text-center">
        <div class="text-overline text-secondary text-weight-bold q-mb-sm">{{ $t('public.landing.featuresOverline') }}</div>
        <h2 class="text-h3 text-weight-bold text-dark q-mb-xl">{{ $t('public.landing.featuresHeadline') }} <span class="text-primary">{{ $t('public.landing.featuresHighlight') }}</span>.</h2>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4">
            <div class="feature-card q-pa-lg rounded-xl transition-all hover-lift">
              <div class="icon-box bg-blue-1 text-blue-9 q-mb-md">
                <q-icon name="security" size="32px" />
              </div>
              <h3 class="text-h5 text-weight-bold q-mb-sm text-dark">{{ $t('public.landing.feature1Title') }}</h3>
              <p class="text-grey-6 text-body1">
                {{ $t('public.landing.feature1Desc') }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card q-pa-lg rounded-xl transition-all hover-lift">
               <div class="icon-box bg-purple-1 text-purple-9 q-mb-md">
                <q-icon name="psychology" size="32px" />
              </div>
              <h3 class="text-h5 text-weight-bold q-mb-sm text-dark">{{ $t('public.landing.feature2Title') }}</h3>
              <p class="text-grey-6 text-body1">
                {{ $t('public.landing.feature2Desc') }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card q-pa-lg rounded-xl transition-all hover-lift">
               <div class="icon-box bg-pink-1 text-pink-9 q-mb-md">
                <q-icon name="tune" size="32px" />
              </div>
              <h3 class="text-h5 text-weight-bold q-mb-sm text-dark">{{ $t('public.landing.feature3Title') }}</h3>
              <p class="text-grey-6 text-body1">
                {{ $t('public.landing.feature3Desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="section-padding bg-grey-1 relative-position">
      <div class="container-limit q-mx-auto q-px-md text-center">
        <div class="row items-center justify-center q-gutter-x-xl text-grey-5 trust-icons">
           <div class="row items-center column-xs">
             <q-icon name="lock" size="40px" class="q-mr-sm" />
             <span class="text-h6 text-dark font-weight-medium">{{ $t('public.landing.trustSsl') }}</span>
           </div>
           <div class="row items-center column-xs">
             <q-icon name="block" size="40px" class="q-mr-sm" />
             <span class="text-h6 text-dark font-weight-medium">{{ $t('public.landing.trustNoData') }}</span>
           </div>
           <div class="row items-center column-xs">
             <q-icon name="euro_symbol" size="40px" class="q-mr-sm" />
             <span class="text-h6 text-dark font-weight-medium">{{ $t('public.landing.trustFree') }}</span>
           </div>
        </div>
      </div>
    </section>

    <!-- AdSense Block (Bottom) -->
    <div class="container-limit q-mx-auto q-my-xl">
      <AdSenseBlock slotId="0987654321" />
    </div>

    <!-- CTA Section -->
    <section class="section-padding bg-dark text-white text-center relative-position overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute-center bg-primary" style="width: 300px; height: 300px; filter: blur(150px); opacity: 0.2"></div>

      <div class="container-limit q-mx-auto q-px-md relative-position z-top">
        <h2 class="text-h3 text-weight-bold q-mb-md">{{ $t('public.landing.ctaHeadline') }}</h2>
        <p class="text-h6 q-mb-xl text-grey-4" style="max-width: 600px; margin: 0 auto 2rem;">
          {{ $t('public.landing.ctaDescription') }}
        </p>
        <q-btn unelevated color="white" text-color="dark" size="xl" :label="$t('public.landing.ctaButton')" to="/login" no-caps class="shadow-lg hover-scale" />
      </div>
    </section>

  </q-page>
</template>

<script setup>
import AdSenseBlock from 'components/ads/AdSenseBlock.vue'

const scrollToFeatures = () => {
  const el = document.getElementById('features')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-section {
  background-color: #f8fafc;
}

/* Abstract Background Blobs */
.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}
.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, var(--primary) 0%, rgba(0,0,0,0) 70%);
}
.blob-2 {
  bottom: 0;
  right: -10%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, var(--secondary) 0%, rgba(0,0,0,0) 70%);
}

.tight-line-height {
  line-height: 1.1;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

/* Floating Dashboard Animation */
.perspective-container {
  perspective: 1000px;
}
.floating-dashboard {
  transform: rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(10px);
}
.floating-dashboard:hover {
  transform: rotateY(0deg) rotateX(0deg) scale(1.02);
}

.bg-transparent-grad {
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
}

/* Feature Cards */
.icon-box {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
}

.rounded-xl {
  border-radius: 24px;
}

.text-dark {
  color: #0f172a;
}
</style>
