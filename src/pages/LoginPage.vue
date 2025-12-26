<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my-card" :style="$q.screen.gt.xs ? 'width: 400px;' : 'width: 90%; max-width: 350px;'">
          <q-card-section class="text-center">
            <div :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'" class="text-weight-bold text-primary">NeonRetreat</div>
            <div class="text-subtitle2">Faça login para continuar</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="email"
                label="E-mail"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor insira o seu e-mail']"
              />

              <q-input
                filled
                type="password"
                v-model="password"
                label="Palavra-passe"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor insira a sua palavra-passe']"
              />

              <div>
                <q-btn label="Entrar" type="submit" color="primary" class="full-width" :loading="loading"/>
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
      icon: 'report_problem'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>
