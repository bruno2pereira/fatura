<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-gradient-primary">
        <q-card class="modern-card q-pa-lg" style="width: 90%; max-width: 400px; border-radius: 24px;">
          <q-card-section class="text-center q-mb-md">
            <div class="text-h4 text-weight-bold text-primary q-mb-xs">NeonRetreat</div>
            <div class="text-subtitle1 text-grey-7">Bem-vindo de volta</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
              <q-input
                outlined
                v-model="email"
                label="E-mail"
                lazy-rules
                bg-color="grey-1"
                :rules="[ val => val && val.length > 0 || 'Por favor insira o seu e-mail']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>

              <q-input
                outlined
                type="password"
                v-model="password"
                label="Palavra-passe"
                lazy-rules
                bg-color="grey-1"
                :rules="[ val => val && val.length > 0 || 'Por favor insira a sua palavra-passe']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
              </q-input>

              <div class="q-mt-lg">
                <q-btn 
                  label="Entrar" 
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
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    $q.notify({
      color: 'negative',
      message: 'Login falhou. Por favor verifique as suas credenciais.',
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
