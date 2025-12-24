<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 q-mr-md">Invoices</div>
      <q-space />
      <div class="q-mr-md">
        <q-btn flat dense icon="date_range" :label="currentMonthLabel">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedMonth" minimal mask="YYYY-MM" emit-immediately @update:model-value="onMonthChange">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
      <q-btn v-if="canAdd" color="primary" icon="add" label="Upload Invoice" @click="showUploadDialog = true" />
      <q-btn flat icon="logout" @click="logout" />
    </div>

    <q-table
      :rows="invoices"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="No invoices found for this month"
    >
      <template v-slot:body-cell-file="props">
        <q-td :props="props">
          <q-btn flat round color="primary" icon="description" type="a" :href="getFileUrl(props.row)" target="_blank" />
        </q-td>
      </template>
    </q-table>

    <!-- Upload Dialog -->
    <q-dialog v-model="showUploadDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Upload Invoice</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="uploadInvoice" class="q-gutter-md">
            <q-file v-model="newInvoice.file" label="Invoice File" filled accept=".pdf,.png,.jpg,.jpeg" :rules="[val => !!val || 'File is required']" />
            <q-input v-model="newInvoice.date" filled label="Date" type="date" :rules="[val => !!val || 'Date is required']" />
            <q-input v-model="newInvoice.description" filled label="Description" />
            <q-input v-model="newInvoice.amount" filled label="Amount" type="number" step="0.01" />
            
            <div class="row justify-end">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Upload" type="submit" color="primary" :loading="uploading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { pb } from 'boot/pocketbase'
import { date } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const invoices = ref([])
const loading = ref(false)
const uploading = ref(false)
const showUploadDialog = ref(false)
const selectedMonth = ref(date.formatDate(Date.now(), 'YYYY-MM'))

const newInvoice = ref({
  file: null,
  date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  description: '',
  amount: null
})

const currentUser = pb.authStore.model
const canAdd = computed(() => currentUser && currentUser.email === 'bruno.26.6.1993@gmail.com') 

const currentMonthLabel = computed(() => {
  return date.formatDate(selectedMonth.value + '-01', 'MMMM YYYY')
})

const columns = [
  { name: 'date', label: 'Date', field: row => date.formatDate(row.date, 'DD/MM/YYYY'), align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'amount', label: 'Amount', field: row => row.amount ? `${row.amount.toFixed(2)} €` : '-', align: 'right', sortable: true },
  { name: 'file', label: 'File', field: 'file', align: 'center' },
  { name: 'uploaded_by', label: 'Uploaded By', field: row => row.expand?.uploaded_by?.name || row.expand?.uploaded_by?.email || 'Unknown', align: 'left' }
]

const loadInvoices = async () => {
  loading.value = true
  try {
    // Filter by month
    // PocketBase date filter: "2023-01-01 00:00:00" <= date && date <= "2023-01-31 23:59:59"
    // Easier: date >= 'YYYY-MM-01' && date <= 'YYYY-MM-31'
    const startObj = new Date(selectedMonth.value + '-01')
    // Wait, addToDate(start, {months:1}) -> next month 1st.
    // To get last day of this month: first day next month minus 1 day.
    
    // Using string approach for safety:
    // '2023-01' -> start '2023-01-01 00:00:00.000Z'
    // Filter syntax: date >= "2023-01-01 00:00:00" && date <= "2023-01-31 23:59:59"
    
    // Let's rely on PB's fuzzy search or simple date string comparison part?
    // date >= "2023-01-01" && date < "2023-02-01"
    const nextMonth = date.formatDate(date.addToDate(startObj, { months: 1 }), 'YYYY-MM-01')
    
    const filter = `date >= "${selectedMonth.value}-01" && date < "${nextMonth}"`

    const records = await pb.collection('invoices').getList(1, 50, {
      filter: filter,
      sort: '-date',
      expand: 'uploaded_by'
    })
    invoices.value = records.items
  } catch (e) {
    console.error('Error loading invoices', e)
    if (e.status === 401) router.push('/login')
  } finally {
    loading.value = false
  }
}

const onMonthChange = () => {
  loadInvoices()
  // Popup doesn't close auto with q-date in proxy
}

watch(selectedMonth, () => {
   loadInvoices()
})

const uploadInvoice = async () => {
  if (!newInvoice.value.file) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', newInvoice.value.file)
    formData.append('date', newInvoice.value.date)
    if (newInvoice.value.description) formData.append('description', newInvoice.value.description)
    if (newInvoice.value.amount) formData.append('amount', newInvoice.value.amount)
    formData.append('uploaded_by', currentUser.id)

    await pb.collection('invoices').create(formData)
    showUploadDialog.value = false
    
    // Reset form
    newInvoice.value = {
      file: null,
      date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      description: '',
      amount: null
    }
    
    loadInvoices()
  } catch (e) {
    console.error('Upload failed', e)
    alert('Upload failed: ' + e.message)
  } finally {
    uploading.value = false
  }
}

const getFileUrl = (record) => {
  return pb.getFileUrl(record, record.file)
}

const logout = () => {
  pb.authStore.clear()
  router.push('/login')
}

onMounted(() => {
  if (!pb.authStore.isValid) {
    router.push('/login')
  } else {
    loadInvoices()
  }
})
</script>
