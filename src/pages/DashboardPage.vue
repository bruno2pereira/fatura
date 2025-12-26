<template>
  <q-page class="q-pa-md">
 <q-card flat bordered class="q-mb-md bg-white">
  <q-card-section class="q-pa-sm q-pa-md-md">
    <!-- Layout Responsivo: Vertical em mobile, Horizontal em desktop -->
    <div class="row q-col-gutter-sm">
      <!-- Título e Total -->
      <div class="col-12 col-md-auto">
        <div class="row items-center justify-between justify-md-start">
          <div :class="$q.screen.lt.md ? 'text-h6' : 'text-h6'" class="text-weight-bold q-mr-md text-grey-9">
            Invoices
          </div>
          <q-chip outline color="primary" icon="euro_symbol" class="text-weight-bold">
            Total: {{ totalSpend.toFixed(2) }}
          </q-chip>
        </div>
      </div>

      <div class="col-12 col-md"></div>
      
      <!-- Navegação de Data -->
      <div class="col-12 col-md-auto">
        <div class="row items-center justify-center bg-grey-2 rounded-borders q-pa-xs">
          <q-btn flat round dense size="sm" icon="chevron_left" color="grey-8" @click="prevMonth" />
          
          <q-btn 
            flat 
            dense 
            no-caps 
            class="q-px-sm text-grey-9" 
            :class="$q.screen.lt.sm ? 'text-caption' : 'text-subtitle2'"
            icon-right="event" 
            :label="currentMonthLabel"
          >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="selectedDate" range minimal mask="YYYY-MM-DD" emit-immediately @update:model-value="onDateChange">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fechar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          
          <q-btn flat round dense size="sm" icon="chevron_right" color="grey-8" @click="nextMonth" />
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="col-12 col-md-auto">
        <div class="row items-center justify-end q-gutter-x-sm">
          <q-btn 
            v-if="canAdd" 
            unelevated 
            color="primary" 
            icon="add" 
            :label="$q.screen.gt.xs ? 'Upload Invoice' : undefined"
            @click="showUploadDialog = true" 
            class="full-width-xs"
          >
            <q-tooltip v-if="$q.screen.xs">Upload Invoice</q-tooltip>
          </q-btn>
          <q-btn flat round color="grey-7" icon="logout" @click="logout">
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </q-card-section>
</q-card>


    <!-- Tabela para Desktop -->
    <q-table
      v-if="$q.screen.gt.sm"
      :rows="invoices"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nenhuma fatura encontrada para este período"
    >
      <template v-slot:body-cell-file="props">
        <q-td :props="props">
          <div v-if="isImage(props.row.file)">
             <a :href="getFileUrl(props.row)" target="_blank">
                <q-avatar rounded size="40px">
                  <q-img :src="getThumbUrl(props.row)" spinner-color="white" />
                </q-avatar>
                <q-tooltip>Ver Imagem</q-tooltip>
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
             <q-tooltip>Ver {{ props.row.file }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            v-if="canDelete" 
            flat 
            round 
            color="negative" 
            icon="delete" 
            @click="deleteInvoice(props.row.id)" 
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Cards para Mobile -->
    <div v-else>
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="3em" />
      </div>
      
      <div v-else-if="invoices.length === 0" class="text-center q-pa-md text-grey-6">
        Nenhuma fatura encontrada para este período
      </div>

      <div v-else class="q-gutter-sm">
        <q-card 
          v-for="invoice in invoices" 
          :key="invoice.id" 
          flat 
          bordered
          class="q-pa-sm"
        >
          <q-card-section class="q-pa-sm">
            <div class="row items-start q-gutter-sm">
              <!-- File Preview -->
              <div class="col-auto">
                <div v-if="isImage(invoice.file)">
                  <a :href="getFileUrl(invoice)" target="_blank">
                    <q-avatar rounded size="60px">
                      <q-img :src="getThumbUrl(invoice)" spinner-color="white" />
                    </q-avatar>
                  </a>
                </div>
                <q-btn 
                  v-else
                  flat 
                  round 
                  size="lg"
                  color="primary" 
                  :icon="getFileIcon(invoice.file)" 
                  type="a" 
                  :href="getFileUrl(invoice)" 
                  target="_blank" 
                />
              </div>

              <!-- Info -->
              <div class="col">
                <div class="text-subtitle2 text-weight-medium text-grey-9">
                  {{ invoice.description || 'Sem descrição' }}
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ date.formatDate(invoice.date, 'DD/MM/YYYY') }}
                </div>
                <div class="text-caption text-grey-6">
                  Por: {{ invoice.expand?.uploaded_by?.name || invoice.expand?.uploaded_by?.email || 'Desconhecido' }}
                </div>
                <div class="text-subtitle1 text-weight-bold text-primary q-mt-xs">
                  {{ invoice.amount ? `${invoice.amount.toFixed(2)} €` : '-' }}
                </div>
              </div>

              <!-- Actions -->
              <div class="col-auto" v-if="canDelete">
                <q-btn 
                  flat 
                  round 
                  dense
                  color="negative" 
                  icon="delete" 
                  @click="deleteInvoice(invoice.id)" 
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Upload Dialog -->
    <q-dialog v-model="showUploadDialog" :maximized="$q.screen.lt.md">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 400px' : ''">
        <q-card-section>
          <div class="text-h6">Upload de Fatura</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="uploadInvoice" class="q-gutter-md">
            <q-file 
              v-model="newInvoice.file" 
              label="Ficheiro da Fatura" 
              filled 
              accept=".pdf,.png,.jpg,.jpeg" 
              :rules="[val => !!val || 'Ficheiro é obrigatório']" 
            />
            <q-input 
              v-model="newInvoice.date" 
              filled 
              label="Data" 
              type="date" 
              :rules="[val => !!val || 'Data é obrigatória']" 
            />
            <q-input 
              v-model="newInvoice.description" 
              filled 
              label="Descrição" 
            />
            <q-input 
              v-model="newInvoice.amount" 
              filled 
              label="Valor" 
              type="number" 
              step="0.01" 
            />
            
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn label="Enviar" type="submit" color="primary" :loading="uploading" />
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
import imageCompression from 'browser-image-compression'
import { date, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()
const invoices = ref([])
const loading = ref(false)
const uploading = ref(false)
const showUploadDialog = ref(false)

// Function to get current month range
const getCurrentMonthRange = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    from: date.formatDate(firstDay, 'YYYY-MM-DD'),
    to: date.formatDate(lastDay, 'YYYY-MM-DD')
  }
}

const selectedDate = ref(getCurrentMonthRange())

const newInvoice = ref({
  file: null,
  date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  description: '',
  amount: null
})

const currentUser = ref(pb.authStore.model)

// Determine if user can add based on Role (ADMIN)
const canAdd = computed(() => {
  return currentUser.value?.expand?.role?.some(role => role.code === 'ADMIN')
})

// Determine if user can delete (ADMIN or EDITAR)
const canDelete = computed(() => {
  return currentUser.value?.expand?.role?.some(role => ['ADMIN', 'EDITAR'].includes(role.code))
})

const currentMonthLabel = computed(() => {
  if (typeof selectedDate.value === 'string') {
     return date.formatDate(selectedDate.value, 'DD/MM/YYYY')
  }

  if (selectedDate.value && selectedDate.value.from && selectedDate.value.to) {
    const fromDate = new Date(selectedDate.value.from)
    const toDate = new Date(selectedDate.value.to)

    const isSameYear = fromDate.getFullYear() === toDate.getFullYear()
    const isSameMonth = fromDate.getMonth() === toDate.getMonth()

    if (isSameYear && isSameMonth) {
      const startsOnFirst = fromDate.getDate() === 1
      const lastDayOfMonth = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0).getDate()
      const endsOnLast = toDate.getDate() === lastDayOfMonth

      if (startsOnFirst && endsOnLast) {
        const label = fromDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
        return label.charAt(0).toUpperCase() + label.slice(1)
      }
    }

    const from = date.formatDate(selectedDate.value.from, 'DD/MM/YYYY')
    const to = date.formatDate(selectedDate.value.to, 'DD/MM/YYYY')
    return `${from} - ${to}`
  }
  return 'Select Date'
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
  { name: 'uploaded_by', label: 'Uploaded By', field: row => row.expand?.uploaded_by?.name || row.expand?.uploaded_by?.email || 'Unknown', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const loadInvoices = async () => {
  loading.value = true
  try {
    let filter = ''
    
    if (typeof selectedDate.value === 'string') {
        const startOfDay = `${selectedDate.value} 00:00:00`
        const endOfDay = `${selectedDate.value} 23:59:59`
        filter = `date >= "${startOfDay}" && date <= "${endOfDay}"`
    } else if (selectedDate.value && selectedDate.value.from && selectedDate.value.to) {
        const startOfDay = `${selectedDate.value.from} 00:00:00`
        const endOfDay = `${selectedDate.value.to} 23:59:59`
        filter = `date >= "${startOfDay}" && date <= "${endOfDay}"`
    }

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

// Monthly Navigation
const prevMonth = () => {
  let currentRefDate
  if (typeof selectedDate.value === 'string') {
      currentRefDate = new Date(selectedDate.value)
  } else {
      currentRefDate = new Date(selectedDate.value.from)
  }
  
  // Go to previous month
  const prevMonthDate = date.subtractFromDate(currentRefDate, { months: 1 })
  
  // Set to full month range
  const firstDay = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1)
  const lastDay = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0)
  
  selectedDate.value = {
    from: date.formatDate(firstDay, 'YYYY-MM-DD'),
    to: date.formatDate(lastDay, 'YYYY-MM-DD')
  }
  loadInvoices()
}

const nextMonth = () => {
   let currentRefDate
  if (typeof selectedDate.value === 'string') {
      currentRefDate = new Date(selectedDate.value)
  } else {
      currentRefDate = new Date(selectedDate.value.from)
  }

  const nextMonthDate = date.addToDate(currentRefDate, { months: 1 })
   
  const firstDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 1)
  const lastDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0)
  
  selectedDate.value = {
    from: date.formatDate(firstDay, 'YYYY-MM-DD'),
    to: date.formatDate(lastDay, 'YYYY-MM-DD')
  }
  loadInvoices()
}


watch(selectedDate, () => {
   // handled by onDateChange or direct calls, but keeping just in case
   // loadInvoices() 
   // Commented out to avoid double load if onDateChange is used
})

const uploadInvoice = async () => {
  if (!newInvoice.value.file) return
  uploading.value = true
  try {
    const file = newInvoice.value.file
    let fileToUpload = file

    // Compress if it's an image
    if (file && file.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        fileToUpload = await imageCompression(file, options)
      } catch (error) {
        console.error('Compression failed:', error)
        // Fallback to original file if compression fails
      }
    }

    const formData = new FormData()
    formData.append('file', fileToUpload)
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
    alert('Upload falhou: ' + e.message)
  } finally {
    uploading.value = false
  }
}

const deleteInvoice = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem a certeza que deseja eliminar esta fatura?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await pb.collection('invoices').delete(id)
      loadInvoices()
      $q.notify({
        color: 'positive',
        message: 'Fatura eliminada com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting invoice', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar fatura',
        icon: 'report_problem'
      })
    }
  })
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
