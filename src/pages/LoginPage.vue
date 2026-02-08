<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient-primary">
        <q-card class="modern-card q-pa-lg" style="width: 90%; max-width: 400px; border-radius: 24px;">
          <q-card-section class="text-center q-mb-md">
            <div class="text-h4 text-weight-bold text-primary q-mb-xs">{{ $t('app.name') }}</div>
            <div class="text-subtitle1">{{ $t('auth.welcomeBack') }}</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
              <q-input
                outlined
                v-model="email"
                :label="$t('auth.email')"
                lazy-rules

                :rules="[ val => val && val.length > 0 || $t('errors.emailRequired')]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>

              <q-input
                outlined
                type="password"
                v-model="password"
                :label="$t('auth.password')"
                lazy-rules

                :rules="[ val => val && val.length > 0 || $t('errors.passwordRequired')]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
              </q-input>

              <div class="q-mt-lg">
                <q-btn 
                  :label="$t('auth.enter')" 
                  type="submit" 
                  color="primary" 
                  class="full-width q-py-sm text-weight-bold" 
                  rounded
                  unelevated
                  size="lg"
                  :loading="loading"
                  style="letter-spacing: 1px;"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pb } from 'boot/pocketbase'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  loading.value = true
  try {
    const authData = await pb.collection('users').authWithPassword(email.value, password.value)
    console.log('Logged in:', authData)
    router.push('/app')
  } catch (error) {
    console.error('Login failed:', error)
    $q.notify({
      color: 'negative',
      message: t('errors.loginFailed'),
      icon: 'report_problem',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Scoped styles if needed, but global classes handle most */
</style>
