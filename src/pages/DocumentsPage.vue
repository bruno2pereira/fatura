<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-mb-md bg-white">
      <q-card-section class="q-pa-sm q-pa-md-md">
        <div class="row q-col-gutter-sm">
          <!-- Título e Contadores -->
          <div class="col-12 col-md-auto">
            <div class="row items-center justify-between justify-md-start">
              <div :class="$q.screen.lt.md ? 'text-h6' : 'text-h6'" class="text-weight-bold q-mr-md text-grey-9">
                Documentos
              </div>
              <q-chip outline color="secondary" icon="folder" class="text-weight-bold">
                Total: {{ documents.length }}
              </q-chip>
            </div>
          </div>

          <div class="col-12 col-md"></div>

          <!-- Filtro de Categoria -->
          <div class="col-12 col-md-auto">
            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              label="Filtrar por Categoria"
              filled
              dense
              clearable
              @update:model-value="loadDocuments"
              style="min-width: 200px"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>

          <!-- Botões de Ação -->
          <div class="col-12 col-md-auto">
            <div class="row items-center justify-end q-gutter-x-sm">
              <q-btn 
                unelevated 
                color="secondary" 
                icon="add" 
                :label="$q.screen.gt.xs ? 'Novo Documento' : undefined"
                @click="showUploadDialog = true" 
                class="full-width-xs"
              >
                <q-tooltip v-if="$q.screen.xs">Novo Documento</q-tooltip>
              </q-btn>
              <q-btn 
                unelevated 
                color="primary" 
                icon="category" 
                :label="$q.screen.gt.xs ? 'Categorias' : undefined"
                @click="showCategoriesDialog = true" 
                class="full-width-xs"
              >
                <q-tooltip v-if="$q.screen.xs">Gerir Categorias</q-tooltip>
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
      :rows="documents"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nenhum documento encontrado"
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
                color="secondary"
                size="sm"
              />
            </template>
            <template v-else-if="col.name === 'category'">
              <q-badge 
                v-if="props.row.expand?.category"
                :color="props.row.expand.category.color || 'grey'" 
                :label="props.row.expand.category.name"
              />
              <span v-else class="text-grey-6">Sem categoria</span>
            </template>
            <template v-else-if="col.name === 'actions'">
              <div class="row items-center justify-end q-gutter-xs" @click.stop>
                <q-btn 
                  flat 
                  round 
                  dense
                  color="primary" 
                  icon="edit" 
                  @click.stop="editDocument(props.row)" 
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  round 
                  dense
                  color="negative" 
                  icon="delete" 
                  @click.stop="deleteDocument(props.row.id)" 
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
        <q-spinner color="secondary" size="3em" />
      </div>
      
      <div v-else-if="documents.length === 0" class="text-center q-pa-md text-grey-6">
        Nenhum documento encontrado
      </div>

      <div v-else class="q-gutter-sm">
        <q-card 
          v-for="doc in documents" 
          :key="doc.id" 
          flat 
          bordered
          class="q-pa-sm cursor-pointer"
          @click="openFile(doc)"
        >
          <q-card-section class="q-pa-sm">
            <div class="row items-start q-gutter-sm">
              <!-- File Preview -->
              <div class="col-auto">
                <div v-if="isImage(doc.file)">
                  <q-avatar rounded size="60px">
                    <q-img :src="getThumbUrl(doc)" spinner-color="white" />
                  </q-avatar>
                </div>
                <q-icon 
                  v-else
                  :name="getFileIcon(doc.file)" 
                  color="secondary" 
                  size="60px"
                />
              </div>

              <!-- Info -->
              <div class="col">
                <div class="text-subtitle2 text-weight-medium text-grey-9">
                  {{ doc.title || 'Sem título' }}
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ doc.description || 'Sem descrição' }}
                </div>
                <div class="q-mt-xs">
                  <q-badge 
                    v-if="doc.expand?.category"
                    :color="doc.expand.category.color || 'grey'" 
                    :label="doc.expand.category.name"
                  />
                  <span v-else class="text-caption text-grey-6">Sem categoria</span>
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  {{ date.formatDate(doc.created, 'DD/MM/YYYY HH:mm') }}
                </div>
              </div>

              <!-- Actions -->
              <div class="col-auto row items-center q-gutter-xs" @click.stop>
                <q-btn 
                  flat 
                  round 
                  dense
                  color="primary" 
                  icon="edit" 
                  @click.stop="editDocument(doc)" 
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  round 
                  dense
                  color="negative" 
                  icon="delete" 
                  @click.stop="deleteDocument(doc.id)" 
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Upload/Edit Document Dialog -->
    <q-dialog v-model="showUploadDialog" :maximized="$q.screen.lt.md" @hide="resetForm">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 500px' : ''">
        <q-card-section>
          <div class="text-h6">{{ editingDocumentId ? 'Editar Documento' : 'Novo Documento' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveDocument" class="q-gutter-md">
            <q-input 
              v-model="newDocument.title" 
              filled 
              label="Título" 
              :rules="[val => !!val || 'Título é obrigatório']"
            />

            <q-input 
              v-model="newDocument.description" 
              filled 
              label="Descrição" 
              type="textarea"
              rows="3"
            />

            <q-select
              v-model="newDocument.category"
              :options="categories"
              option-value="id"
              option-label="name"
              label="Categoria"
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

            <!-- Show current file info when editing -->
            <div v-if="editingDocumentId && currentFileName" class="q-mb-sm">
              <div class="text-caption text-grey-7">Ficheiro atual:</div>
              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-icon :name="getFileIcon(currentFileName)" color="secondary" size="sm" />
                <span class="text-body2">{{ currentFileName }}</span>
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                Deixe em branco para manter o ficheiro atual
              </div>
            </div>

            <q-file 
              v-model="newDocument.file" 
              :label="editingDocumentId ? 'Substituir Ficheiro (opcional)' : 'Ficheiro'" 
              filled 
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
              :rules="editingDocumentId ? [] : [val => !!val || 'Ficheiro é obrigatório']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup @click="resetForm" />
              <q-btn 
                :label="editingDocumentId ? 'Guardar' : 'Criar'" 
                type="submit" 
                color="secondary" 
                :loading="uploading" 
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Categories Management Dialog -->
    <q-dialog v-model="showCategoriesDialog" :maximized="$q.screen.lt.md">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 500px' : ''">
        <q-card-section>
          <div class="text-h6">Gerir Categorias</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- Add New Category -->
          <q-form @submit="addCategory" class="q-gutter-sm q-mb-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="newCategory.name" 
                  filled 
                  dense
                  label="Nome da Categoria" 
                  placeholder="Ex: Contratos"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="newCategory.color"
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
                  color="secondary" 
                  icon="add" 
                  :loading="addingCategory"
                  class="full-width"
                />
              </div>
            </div>
          </q-form>

          <q-separator class="q-my-md" />

          <!-- Categories List -->
          <div class="text-subtitle2 q-mb-sm">Categorias Existentes</div>
          <q-list bordered separator>
            <q-item v-for="category in categories" :key="category.id">
              <q-item-section avatar>
                <q-icon name="circle" :color="category.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ category.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn 
                  flat 
                  round 
                  dense 
                  color="negative" 
                  icon="delete" 
                  @click="deleteCategory(category.id)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-item v-if="categories.length === 0">
              <q-item-section class="text-grey-6 text-center">
                Nenhuma categoria criada
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
import { ref, onMounted, computed } from 'vue'
import { pb } from 'boot/pocketbase'
import { date, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import imageCompression from 'browser-image-compression'

const router = useRouter()
const $q = useQuasar()
const documents = ref([])
const categories = ref([])
const loading = ref(false)
const uploading = ref(false)
const addingCategory = ref(false)
const showUploadDialog = ref(false)
const showCategoriesDialog = ref(false)
const editingDocumentId = ref(null)
const currentFileName = ref(null)
const selectedCategory = ref(null)

const newDocument = ref({
  title: '',
  description: '',
  file: null,
  category: null
})

const newCategory = ref({
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

const categoryOptions = computed(() => {
  return [
    { label: 'Todas', value: null },
    ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
  ]
})

const columns = [
  { name: 'title', label: 'Título', field: 'title', align: 'left', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'file', label: 'Ficheiro', field: 'file', align: 'center' },
  { name: 'created', label: 'Data', field: row => date.formatDate(row.created, 'DD/MM/YYYY'), align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const loadCategories = async () => {
  try {
    const records = await pb.collection('document_categories').getList(1, 50, {
      sort: 'name'
    })
    categories.value = records.items
  } catch (e) {
    console.error('Error loading categories', e)
  }
}

const loadDocuments = async () => {
  loading.value = true
  try {
    let filter = ''
    if (selectedCategory.value) {
      filter = `category = "${selectedCategory.value}"`
    }

    const records = await pb.collection('documents').getList(1, 100, {
      filter: filter,
      sort: '-created',
      expand: 'category'
    })
    documents.value = records.items
  } catch (e) {
    console.error('Error loading documents', e)
    if (e.status === 401) router.push('/login')
  } finally {
    loading.value = false
  }
}

const saveDocument = async () => {
  if (!editingDocumentId.value && !newDocument.value.file) {
    return
  }
  
  uploading.value = true
  try {
    const formData = new FormData()
    
    if (newDocument.value.file) {
      const file = newDocument.value.file
      let fileToUpload = file

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
        }
      }
      
      formData.append('file', fileToUpload)
    }
    
    formData.append('title', newDocument.value.title)
    if (newDocument.value.description) formData.append('description', newDocument.value.description)
    if (newDocument.value.category) formData.append('category', newDocument.value.category)
    
    if (editingDocumentId.value) {
      await pb.collection('documents').update(editingDocumentId.value, formData)
      $q.notify({
        color: 'positive',
        message: 'Documento atualizado com sucesso',
        icon: 'check'
      })
    } else {
      await pb.collection('documents').create(formData)
      $q.notify({
        color: 'positive',
        message: 'Documento criado com sucesso',
        icon: 'check'
      })
    }
    
    showUploadDialog.value = false
    resetForm()
    loadDocuments()
  } catch (e) {
    console.error('Operation failed', e)
    $q.notify({
      color: 'negative',
      message: editingDocumentId.value ? 'Falha ao atualizar documento' : 'Falha ao criar documento',
      icon: 'report_problem',
      caption: e.message
    })
  } finally {
    uploading.value = false
  }
}

const resetForm = () => {
  newDocument.value = {
    title: '',
    description: '',
    file: null,
    category: null
  }
  editingDocumentId.value = null
  currentFileName.value = null
}

const editDocument = (doc) => {
  newDocument.value = {
    title: doc.title || '',
    description: doc.description || '',
    file: null,
    category: doc.category || null
  }
  
  editingDocumentId.value = doc.id
  currentFileName.value = doc.file
  showUploadDialog.value = true
}

const deleteDocument = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem a certeza que deseja eliminar este documento?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await pb.collection('documents').delete(id)
      loadDocuments()
      $q.notify({
        color: 'positive',
        message: 'Documento eliminado com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting document', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar documento',
        icon: 'report_problem'
      })
    }
  })
}

const addCategory = async () => {
  if (!newCategory.value.name) return
  
  addingCategory.value = true
  try {
    await pb.collection('document_categories').create(newCategory.value)
    $q.notify({
      color: 'positive',
      message: 'Categoria criada com sucesso',
      icon: 'check'
    })
    newCategory.value = { name: '', color: 'blue' }
    loadCategories()
  } catch (e) {
    console.error('Error creating category', e)
    $q.notify({
      color: 'negative',
      message: 'Falha ao criar categoria',
      icon: 'report_problem'
    })
  } finally {
    addingCategory.value = false
  }
}

const deleteCategory = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem a certeza que deseja eliminar esta categoria?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await pb.collection('document_categories').delete(id)
      loadCategories()
      $q.notify({
        color: 'positive',
        message: 'Categoria eliminada com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting category', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar categoria',
        icon: 'report_problem'
      })
    }
  })
}

const openFile = (doc) => {
  const url = getFileUrl(doc)
  window.open(url, '_blank')
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
  if (['doc', 'docx'].includes(ext)) return 'article'
  if (['xls', 'xlsx'].includes(ext)) return 'table_chart'
  return 'description'
}

const goBack = () => {
  router.push('/')
}

const logout = () => {
  pb.authStore.clear()
  router.push('/login')
}

onMounted(async () => {
  if (!pb.authStore.isValid) {
    router.push('/login')
    return
  }

  // Check if user is admin
  try {
    const user = await pb.collection('users').getOne(pb.authStore.model.id, {
      expand: 'role'
    })
    const isAdmin = user?.expand?.role?.some(role => role.code === 'ADMIN')
    
    if (!isAdmin) {
      $q.notify({
        color: 'negative',
        message: 'Acesso negado. Apenas administradores podem aceder a esta página.',
        icon: 'report_problem'
      })
      router.push('/')
      return
    }
  } catch (e) {
    console.error('Error checking user permissions', e)
    router.push('/')
    return
  }

  await loadCategories()
  await loadDocuments()
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
