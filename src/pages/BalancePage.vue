<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md justify-center">
      <!-- Balance Card -->
      <div class="col-12 col-md-8">
        <q-card class="modern-card bg-gradient-primary text-white q-mb-md">
          <q-card-section class="text-center q-py-lg">
            <div class="text-h6 opacity-7">Balance Total</div>
            <div class="text-h2 text-weight-bold q-my-sm">
              <q-spinner v-if="loadingBalance" color="white" size="1em" />
              <span v-else>{{ formatCurrency(totalBalance) }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Last 5 Transactions -->
      <div class="col-12 col-md-8">
        <q-card class="modern-card">
          <q-card-section>
            <div class="text-h6 text-grey-9 q-mb-md">Últimas 5 Transações</div>
            
            <div v-if="loadingInvoices" class="text-center q-pa-md">
              <q-spinner color="primary" size="2em" />
            </div>
            
            <q-list separator v-else>
              <q-item v-if="invoices.length === 0" class="text-center text-grey-6 q-pa-md">
                Nenhuma transação encontrada
              </q-item>

              <q-item v-for="invoice in invoices" :key="invoice.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar :color="invoice.is_entrance ? 'positive' : 'negative'" text-color="white" icon="attach_money" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ invoice.description || 'Sem descrição' }}</q-item-label>
                  <q-item-label caption>{{ formatDate(invoice.date) }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div :class="invoice.is_entrance ? 'text-positive' : 'text-negative'" class="text-subtitle1 text-weight-bold">
                    {{ invoice.is_entrance ? '+' : '-' }} {{ formatCurrency(invoice.amount) }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-8 flex justify-center q-mt-md">
         <q-btn flat color="grey-7" icon="arrow_back" label="Voltar" @click="$router.go(-1)" />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pb } from 'boot/pocketbase'
import { date } from 'quasar'

const loadingBalance = ref(false)
const loadingInvoices = ref(false)
const totalBalance = ref(0)
const invoices = ref([])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value || 0)
}

const formatDate = (dateString) => {
  return date.formatDate(dateString, 'DD/MM/YYYY')
}

const loadBalance = async () => {
  loadingBalance.value = true
  try {
    // Fetch from balance collection
    // detailed doc: https://pocketbase.io/docs/api-records/
    const result = await pb.collection('balance').getList(1, 1)
    console.log('Balance result:', result)
    if (result.items.length > 0) {
        // Assuming the field is named 'amount' or 'total' or 'balance'
        // I will try to inspect the first item keys if needed, but standard guess:
        const record = result.items[0]
        console.log('Balance record:', record)
        // Try common names
        totalBalance.value = record.total || 0
    }
  } catch (e) {
    console.error('Error loading balance:', e)
  } finally {
    loadingBalance.value = false
  }
}

const loadLastTransactions = async () => {
  loadingInvoices.value = true
  try {
    const result = await pb.collection('invoices').getList(1, 5, {
      sort: '-date',
      expand: 'uploaded_by'
    })
    invoices.value = result.items
  } catch (e) {
    console.error('Error loading transactions:', e)
  } finally {
    loadingInvoices.value = false
  }
}

onMounted(() => {
  loadBalance()
  loadLastTransactions()
})
</script>

<style scoped>
.modern-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.opacity-7 {
  opacity: 0.7;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
}
</style>
