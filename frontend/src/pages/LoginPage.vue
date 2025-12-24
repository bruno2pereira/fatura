<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my-card" style="width: 350px;">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Invoice App</div>
            <div class="text-subtitle2">Sign in to continue</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="email"
                label="Email"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type your email']"
              />

              <q-input
                filled
                type="password"
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type your password']"
              />

              <div>
                <q-btn label="Login" type="submit" color="primary" class="full-width" :loading="loading"/>
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
      message: 'Login failed. Please check your credentials.',
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
