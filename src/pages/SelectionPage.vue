<template>
  <q-page class="flex flex-center bg-gradient-primary">
    <div class="selection-container">
      <div class="text-center q-mb-xl">
        <h3 class="text-h3 text-weight-bold text-white q-mb-md">{{ $t('app.welcome') }}</h3>
        <p class="text-h6 text-white-7">{{ $t('app.chooseArea') }}</p>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <!-- Invoices Card -->
        <div class="col-12 col-sm-6 col-md-5">
          <q-card 
            class="selection-card cursor-pointer" 
            @click="goToInvoices"
          >
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="receipt_long" size="80px" color="primary" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">{{ $t('selection.invoices') }}</div>
              <p>
                {{ $t('selection.invoicesDesc') }}
              </p>
            </q-card-section>
            <q-card-section>
              <div class="row items-center justify-center">
                <q-icon name="arrow_forward" color="primary" />
                <span class="q-ml-sm text-primary text-weight-medium">{{ $t('selection.access') }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Documents Card -->
        <div class="col-12 col-sm-6 col-md-5" v-if="isAdmin">
          <q-card 
            class="selection-card cursor-pointer" 
            @click="goToDocuments"
          >
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="folder_open" size="80px" color="secondary" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">{{ $t('selection.documents') }}</div>
              <p>
                {{ $t('selection.documentsDesc') }}
              </p>
            </q-card-section>
            <q-card-section>
              <div class="row items-center justify-center">
                <q-icon name="arrow_forward" color="secondary" />
                <span class="q-ml-sm text-secondary text-weight-medium">{{ $t('selection.access') }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Balance Card -->
        <div class="col-12 col-sm-6 col-md-5" v-if="isAdmin">
          <q-card 
            class="selection-card cursor-pointer" 
            @click="goToBalance"
          >
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="account_balance_wallet" size="80px" color="accent" class="q-mb-md" />
              <div class="text-h5 text-weight-bold q-mb-sm">{{ $t('selection.balance') }}</div>
              <p>
                {{ $t('selection.balanceDesc') }}
              </p>
            </q-card-section>
            <q-card-section>
              <div class="row items-center justify-center">
                <q-icon name="arrow_forward" color="accent" />
                <span class="q-ml-sm text-accent text-weight-medium">{{ $t('selection.access') }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

    
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { pb } from 'boot/pocketbase'

const router = useRouter()
const currentUser = ref(pb.authStore.record)

const isAdmin = computed(() => {
  return currentUser.value?.expand?.role?.some(role => role.code === 'ADMIN')
})

const goToInvoices = () => {
  router.push('/app/invoices')
}

const goToDocuments = () => {
  router.push('/app/documents')
}

const goToBalance = () => {
  router.push('/app/balance')
}



const fetchCurrentUser = async () => {
  if (pb.authStore.isValid && pb.authStore.record) {
    try {
      const user = await pb.collection('users').getOne(pb.authStore.record.id, {
        expand: 'role'
      })
      pb.authStore.save(pb.authStore.token, user)
      currentUser.value = user
    } catch (e) {
      console.error("Error fetching user role", e)
    }
  }
}

onMounted(() => {
  if (!pb.authStore.isValid) {
    router.push('/login')
  } else {
    fetchCurrentUser()
  }
})
</script>

<style scoped>


.selection-container {
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
}

.selection-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
}

.selection-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.cursor-pointer {
  cursor: pointer;
}

.text-white-7 {
  color: rgba(255, 255, 255, 0.7);
}
</style>
