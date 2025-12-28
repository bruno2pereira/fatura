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
      
      <!-- Filtro de Categoria -->
      <div class="col-12 col-md-auto">
        <q-select
          v-model="selectedInvoiceCategory"
          :options="invoiceCategoryOptions"
          label="Filtrar por Tipo"
          filled
          dense
          clearable
          @update:model-value="loadInvoices"
          style="min-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="filter_list" />
          </template>
        </q-select>
      </div>
      
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
          <q-btn 
            v-if="canAdd"
            unelevated 
            color="secondary" 
            icon="category" 
            :label="$q.screen.gt.xs ? 'Tipos' : undefined"
            @click="showCategoriesDialog = true" 
            class="full-width-xs"
          >
            <q-tooltip v-if="$q.screen.xs">Gerir Tipos</q-tooltip>
          </q-btn>
          <q-btn flat round color="grey-7" icon="arrow_back" @click="goBack">
            <q-tooltip>Voltar</q-tooltip>
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
      <template v-slot:body="props">
        <q-tr 
          :props="props" 
          class="cursor-pointer" 
          @click="openFile(props.row)"
        >
          <q-td 
            v-for="col in props.cols" 
            :key="col.name" 
            :props="props"
          >
            <template v-if="col.name === 'file'">
              <div v-if="isImage(props.row.file)">
                <q-avatar rounded size="40px">
                  <q-img :src="getThumbUrl(props.row)" spinner-color="white" />
                </q-avatar>
              </div>
              <q-icon 
                v-else
                :name="getFileIcon(props.row.file)" 
                color="primary"
                size="sm"
              />
            </template>
            <template v-else-if="col.name === 'category'">
              <q-badge 
                v-if="props.row.expand?.invoice_type"
                :color="props.row.expand.invoice_type.color || 'grey'" 
                :label="props.row.expand.invoice_type.name"
              />
              <span v-else class="text-grey-6">-</span>
            </template>
            <template v-else-if="col.name === 'is_document'">
              <q-icon 
                v-if="props.row.is_document" 
                name="check_circle" 
                color="green" 
                size="sm"
              >
                <q-tooltip>Está nos documentos</q-tooltip>
              </q-icon>
              <span v-else class="text-grey-6">-</span>
            </template>
            <template v-else-if="col.name === 'actions'">
              <div class="row items-center justify-end q-gutter-xs" @click.stop>
                <q-btn 
                  v-if="canEdit" 
                  flat 
                  round 
                  dense
                  color="primary" 
                  icon="edit" 
                  @click.stop="editInvoice(props.row)" 
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn 
                  v-if="canDelete" 
                  flat 
                  round 
                  dense
                  color="negative" 
                  icon="delete" 
                  @click.stop="deleteInvoice(props.row.id)" 
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </template>
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
        </q-tr>
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
          class="q-pa-sm cursor-pointer"
          @click="openFile(invoice)"
        >
          <q-card-section class="q-pa-sm">
            <div class="row items-start q-gutter-sm">
              <!-- File Preview -->
              <div class="col-auto">
                <div v-if="isImage(invoice.file)">
                  <q-avatar rounded size="60px">
                    <q-img :src="getThumbUrl(invoice)" spinner-color="white" />
                  </q-avatar>
                </div>
                <q-icon 
                  v-else
                  :name="getFileIcon(invoice.file)" 
                  color="primary" 
                  size="60px"
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
              <div class="col-auto row items-center q-gutter-xs" @click.stop>
                <q-btn 
                  v-if="canEdit"
                  flat 
                  round 
                  dense
                  color="primary" 
                  icon="edit" 
                  @click.stop="editInvoice(invoice)" 
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn 
                  v-if="canDelete"
                  flat 
                  round 
                  dense
                  color="negative" 
                  icon="delete" 
                  @click.stop="deleteInvoice(invoice.id)" 
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Upload/Edit Dialog -->
    <q-dialog v-model="showUploadDialog" :maximized="$q.screen.lt.md" @hide="resetForm">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 400px' : ''">
        <q-card-section>
          <div class="text-h6">{{ editingInvoiceId ? 'Editar Fatura' : 'Upload de Fatura' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="uploadInvoice" class="q-gutter-md">
            <!-- Show current file info when editing -->
            <div v-if="editingInvoiceId && currentFileName" class="q-mb-sm">
              <div class="text-caption text-grey-7">Ficheiro atual:</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-icon :name="getFileIcon(currentFileName)" color="primary" size="sm" />
                <span class="text-body2">{{ currentFileName }}</span>
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                Deixe em branco para manter o ficheiro atual
              </div>
            </div>

            <q-file 
              v-model="newInvoice.file" 
              :label="editingInvoiceId ? 'Substituir Ficheiro (opcional)' : 'Ficheiro da Fatura'" 
              filled 
              accept=".pdf,.png,.jpg,.jpeg" 
              :rules="editingInvoiceId ? [] : [val => !!val || 'Ficheiro é obrigatório']"
              clearable
            >
              <template v-slot:hint v-if="editingInvoiceId">
                Opcional - selecione apenas se quiser substituir o ficheiro
              </template>
            </q-file>
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

            <q-select
              v-model="newInvoice.invoice_type"
              :options="invoiceTypes"
              option-value="id"
              option-label="name"
              label="Tipo de Fatura"
              filled
              clearable
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="circle" :color="scope.opt.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <q-chip 
                  :color="scope.opt?.color || 'grey'" 
                  text-color="white"
                  dense
                >
                  {{ scope.opt?.name || 'Selecionar' }}
                </q-chip>
              </template>
            </q-select>

            <q-checkbox 
              v-model="newInvoice.is_document" 
              label="Marcar como documento da empresa"
              color="secondary"
            />
            
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup @click="resetForm" />
              <q-btn 
                :label="editingInvoiceId ? 'Guardar' : 'Enviar'" 
                type="submit" 
                color="primary" 
                :loading="uploading" 
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Invoice Types Management Dialog -->
    <q-dialog v-model="showCategoriesDialog" :maximized="$q.screen.lt.md">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 500px' : ''">
        <q-card-section>
          <div class="text-h6">Gerir Tipos de Fatura</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- Add New Type -->
          <q-form @submit="addInvoiceType" class="q-gutter-sm q-mb-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="newInvoiceType.name" 
                  filled 
                  dense
                  label="Nome do Tipo" 
                  placeholder="Ex: Alimentação"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="newInvoiceType.color"
                  :options="colorOptions"
                  label="Cor"
                  filled
                  dense
                  emit-value
                  map-options
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon name="circle" :color="scope.opt.value" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-2">
                <q-btn 
                  type="submit" 
                  color="primary" 
                  icon="add" 
                  label="Adicionar"
                  :loading="addingInvoiceType"
                  class="full-width"
                />
              </div>
            </div>
          </q-form>

          <q-separator class="q-my-md" />

          <!-- Types List -->
          <div class="text-subtitle2 q-mb-sm">Tipos Existentes</div>
          <q-list bordered separator>
            <q-item v-for="type in invoiceTypes" :key="type.id">
              <q-item-section avatar>
                <q-icon name="circle" :color="type.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ type.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn 
                  flat 
                  round 
                  dense 
                  color="negative" 
                  icon="delete" 
                  @click="deleteInvoiceType(type.id)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="invoiceTypes.length === 0">
              <q-item-section class="text-grey-6 text-center">
                Nenhum tipo criado
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
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
const invoiceTypes = ref([])
const loading = ref(false)
const uploading = ref(false)
const addingInvoiceType = ref(false)
const showUploadDialog = ref(false)
const showCategoriesDialog = ref(false)
const editingInvoiceId = ref(null)
const currentFileName = ref(null)
const selectedInvoiceCategory = ref(null)

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
  amount: null,
  invoice_type: null,
  is_document: false
})

const newInvoiceType = ref({
  name: '',
  color: 'blue'
})

const colorOptions = [
  { label: 'Azul', value: 'blue' },
  { label: 'Verde', value: 'green' },
  { label: 'Vermelho', value: 'red' },
  { label: 'Laranja', value: 'orange' },
  { label: 'Roxo', value: 'purple' },
  { label: 'Rosa', value: 'pink' },
  { label: 'Amarelo', value: 'amber' },
  { label: 'Cinza', value: 'grey' }
]

const invoiceCategoryOptions = computed(() => {
  return [
    { label: 'Todos', value: null },
    ...invoiceTypes.value.map(type => ({ label: type.name, value: type.id }))
  ]
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

// Determine if user can edit (ADMIN or EDITAR)
const canEdit = computed(() => {
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
  { name: 'category', label: 'Tipo', field: 'category', align: 'left' },
  { name: 'amount', label: 'Amount', field: row => row.amount ? `${row.amount.toFixed(2)} €` : '-', align: 'right', sortable: true },
  { name: 'file', label: 'File', field: 'file', align: 'center' },
  { name: 'is_document', label: 'Doc', field: 'is_document', align: 'center' },
  { name: 'uploaded_by', label: 'Uploaded By', field: row => row.expand?.uploaded_by?.name || row.expand?.uploaded_by?.email || 'Unknown', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const loadInvoiceTypes = async () => {
  try {
    const records = await pb.collection('invoice_types').getList(1, 50, {
      sort: 'name'
    })
    invoiceTypes.value = records.items
  } catch (e) {
    console.error('Error loading invoice types', e)
  }
}

const loadInvoices = async () => {
  loading.value = true
  try {
    let filters = []
    
    if (typeof selectedDate.value === 'string') {
        const startOfDay = `${selectedDate.value} 00:00:00`
        const endOfDay = `${selectedDate.value} 23:59:59`
        filters.push(`date >= "${startOfDay}" && date <= "${endOfDay}"`)
    } else if (selectedDate.value && selectedDate.value.from && selectedDate.value.to) {
        const startOfDay = `${selectedDate.value.from} 00:00:00`
        const endOfDay = `${selectedDate.value.to} 23:59:59`
        filters.push(`date >= "${startOfDay}" && date <= "${endOfDay}"`)
    }

    if (selectedInvoiceCategory.value) {
      filters.push(`invoice_type = "${selectedInvoiceCategory.value}"`)
    }

    const filter = filters.length > 0 ? filters.join(' && ') : ''

    const records = await pb.collection('invoices').getList(1, 50, {
      filter: filter,
      sort: '-date',
      expand: 'uploaded_by,invoice_type'
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
  // When creating, file is required. When editing, it's optional
  if (!editingInvoiceId.value && !newInvoice.value.file) {
    return
  }
  
  uploading.value = true
  try {
    const formData = new FormData()
    
    // Only process and add file if one was selected
    if (newInvoice.value.file) {
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
      
      formData.append('file', fileToUpload)
    }
    
    // Always add other fields
    formData.append('date', newInvoice.value.date)
    if (newInvoice.value.description) formData.append('description', newInvoice.value.description)
    if (newInvoice.value.amount) formData.append('amount', newInvoice.value.amount)
    if (newInvoice.value.invoice_type) formData.append('invoice_type', newInvoice.value.invoice_type)
    formData.append('is_document', newInvoice.value.is_document)
    
    // Check if we're editing or creating
    if (editingInvoiceId.value) {
      // Update existing invoice
      await pb.collection('invoices').update(editingInvoiceId.value, formData)
      $q.notify({
        color: 'positive',
        message: 'Fatura atualizada com sucesso',
        icon: 'check'
      })
    } else {
      // Create new invoice
      formData.append('uploaded_by', pb.authStore.model.id)
      await pb.collection('invoices').create(formData)
      $q.notify({
        color: 'positive',
        message: 'Fatura criada com sucesso',
        icon: 'check'
      })
    }
    
    showUploadDialog.value = false
    resetForm()
    loadInvoices()
  } catch (e) {
    console.error('Operation failed', e)
    $q.notify({
      color: 'negative',
      message: editingInvoiceId.value ? 'Falha ao atualizar fatura' : 'Falha ao criar fatura',
      icon: 'report_problem',
      caption: e.message
    })
  } finally {
    uploading.value = false
  }
}

const resetForm = () => {
  newInvoice.value = {
    file: null,
    date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
    description: '',
    amount: null,
    invoice_type: null,
    is_document: false
  }
  editingInvoiceId.value = null
  currentFileName.value = null
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

const openFile = (invoice) => {
  const url = getFileUrl(invoice)
  window.open(url, '_blank')
}

const editInvoice = (invoice) => {
  // Populate the form with the invoice data
  newInvoice.value = {
    file: null, // File can't be pre-populated
    date: date.formatDate(invoice.date, 'YYYY-MM-DD'),
    description: invoice.description || '',
    amount: invoice.amount || null,
    invoice_type: invoice.invoice_type || null,
    is_document: invoice.is_document || false
  }
  
  // Store the invoice ID and current file name
  editingInvoiceId.value = invoice.id
  currentFileName.value = invoice.file
  
  // Show the dialog
  showUploadDialog.value = true
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

const goBack = () => {
  router.push('/')
}

const logout = () => {
  pb.authStore.clear()
  router.push('/login')
}

const addInvoiceType = async () => {
  if (!newInvoiceType.value.name) return
  
  addingInvoiceType.value = true
  try {
    await pb.collection('invoice_types').create(newInvoiceType.value)
    $q.notify({
      color: 'positive',
      message: 'Tipo criado com sucesso',
      icon: 'check'
    })
    newInvoiceType.value = { name: '', color: 'blue' }
    loadInvoiceTypes()
  } catch (e) {
    console.error('Error creating invoice type', e)
    $q.notify({
      color: 'negative',
      message: 'Falha ao criar tipo',
      icon: 'report_problem'
    })
  } finally {
    addingInvoiceType.value = false
  }
}

const deleteInvoiceType = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem a certeza que deseja eliminar este tipo?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await pb.collection('invoice_types').delete(id)
      loadInvoiceTypes()
      $q.notify({
        color: 'positive',
        message: 'Tipo eliminado com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting invoice type', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar tipo',
        icon: 'report_problem'
      })
    }
  })
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

onMounted(async () => {
  if (!pb.authStore.isValid) {
    router.push('/login')
  } else {
    await fetchCurrentUser()
    await loadInvoiceTypes()
    await loadInvoices()
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.q-table tbody tr.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
