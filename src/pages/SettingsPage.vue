<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="modern-card" style="width: 100%; max-width: 500px">
      <q-card-section class="bg-gradient-primary text-white q-pa-lg">
        <div class="text-h6">{{ $t('profile.settings') }}</div>
        <div class="text-subtitle2">{{ $t('profile.changeLanguage') }}</div>
      </q-card-section>

      <q-card-section class="q-pa-lg text-black"  >
        <div class="q-gutter-y-md">
          <q-select
            v-model="currentLocale"
            :options="localeOptions"
            :label="$t('auth.language')"
            outlined
            emit-value
            map-options
            @update:model-value="changeLanguage"
          >
            <template v-slot:prepend>
              <q-icon name="language" />
            </template>
          </q-select>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 q-mb-sm">{{ $t('profile.personalInfo') }}</div>
          <q-input
            v-model="user.name"
            :label="$t('profile.firstName')"
            outlined
            readonly
            dense
          />
          <q-input
            v-model="user.email"
            :label="$t('auth.email')"
            outlined
            readonly
            dense
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat color="primary" icon="arrow_back" :label="$t('common.back')" @click="router.back()" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { pb } from 'boot/pocketbase'
import { useQuasar } from 'quasar'

const { t, locale } = useI18n()
const router = useRouter()
const $q = useQuasar()

const user = computed(() => pb.authStore.model || {})

const currentLocale = ref(locale.value)

const localeOptions = computed(() => [
  { label: t('languages.pt-PT'), value: 'pt-PT' },
  { label: t('languages.en-US'), value: 'en-US' }
])

const changeLanguage = (val) => {
  locale.value = val
  localStorage.setItem('user-locale', val)
  $q.notify({
    message: t('profile.updateSuccess'),
    color: 'positive',
    icon: 'check_circle',
    position: 'top'
  })
}

// Watch for locale changes to update the labels in localeOptions if needed
watch(locale, () => {
  // Locale options might need to be refreshed if labels are translated
})
</script>

<style lang="scss" scoped>
.modern-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

// Dark mode support
:deep(.body--dark) {
  .modern-card {
    background: #1e1e1e;
    color: white;
  }
}
</style>
