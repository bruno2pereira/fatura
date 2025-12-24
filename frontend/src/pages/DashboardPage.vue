<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 q-mr-md">Invoices</div>
      <q-space />
      
      <div class="q-mr-md text-subtitle1">
        Total: <b>{{ totalSpend.toFixed(2) }} €</b>
      </div>

      <div class="q-mr-md">
        <q-btn flat dense icon="event" :label="currentMonthLabel">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" minimal mask="YYYY-MM-DD" emit-immediately @update:model-value="onDateChange">
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
      no-data-label="No invoices found for this date"
    >
      <template v-slot:body-cell-file="props">
        <q-td :props="props">
          <div v-if="isImage(props.row.file)">
             <a :href="getFileUrl(props.row)" target="_blank">
                <q-avatar rounded size="40px">
                  <q-img :src="getThumbUrl(props.row)" spinner-color="white" />
                </q-avatar>
                <q-tooltip>View Image</q-tooltip>
             </a>
          </div>
          <q-btn 
            v-else
            flat 
            round 
            color="primary" 
            :icon="getFileIcon(props.row.file)" 
            type="a" 
            :href="getFileUrl(props.row)" 
            target="_blank" 
          >
             <q-tooltip>View {{ props.row.file }}</q-tooltip>
          </q-btn>
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
// Changed to full date for daily filtering
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))

const newInvoice = ref({
  file: null,
  date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  description: '',
  amount: null
})

const currentUser = ref(pb.authStore.model)

// Determine if user can add based on Role (ADMIN)
const canAdd = computed(() => {
  return currentUser.value?.expand?.role?.filter(role => role.code === 'ADMIN').length > 0


})

const currentMonthLabel = computed(() => {
  return date.formatDate(selectedDate.value, 'DD MMMM YYYY')
})

const totalSpend = computed(() => {
  return invoices.value.reduce((total, invoice) => {
    return total + (invoice.amount || 0)
  }, 0)
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
    // Filter by specific day
    // date >= "YYYY-MM-DD 00:00:00" && date <= "YYYY-MM-DD 23:59:59"
    const startOfDay = `${selectedDate.value} 00:00:00`
    const endOfDay = `${selectedDate.value} 23:59:59`
    
    const filter = `date >= "${startOfDay}" && date <= "${endOfDay}"`

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

const onDateChange = () => {
  loadInvoices()
}

watch(selectedDate, () => {
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
    formData.append('uploaded_by', pb.authStore.model.id)

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

const getThumbUrl = (record) => {
  return pb.getFileUrl(record, record.file, { thumb: '100x100' })
}

const isImage = (filename) => {
  if (!filename) return false
  const ext = filename.split('.').pop().toLowerCase()
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
}

const getFileIcon = (filename) => {
  if (!filename) return 'description'
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext)) return 'picture_as_pdf'
  return 'description'
}

const logout = () => {
  pb.authStore.clear()
  router.push('/login')
}

const fetchCurrentUser = async () => {
  if (pb.authStore.isValid && pb.authStore.model) {
    try {
      const user = await pb.collection('users').getOne(pb.authStore.model.id, {
        expand: 'role'
      })
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
    loadInvoices()
  }
})
</script>
