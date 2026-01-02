<template>
  <q-page class="q-pa-md">
    <!-- Header/Filter Card -->
    <q-card class="modern-card q-mb-md">
      <q-card-section class="q-pa-sm q-pa-md-md">
        <div class="row q-col-gutter-sm items-center">
          <!-- Título -->
          <div class="col-12 col-md-auto">
            <div class="row items-center q-gutter-x-sm">
              <div class="text-h6 text-weight-bold text-grey-9">
                Documentos
              </div>
              <q-chip outline color="secondary" icon="folder" class="text-weight-bold">
                Total: {{ filteredDocuments.length }}
              </q-chip>
            </div>
          </div>

          <!-- Breadcrumbs -->
          <div class="col-12 col-md">
            <q-breadcrumbs class="text-grey-8 q-px-md" active-color="secondary">
              <template v-slot:separator>
                <q-icon size="1.2em" name="chevron_right" color="grey-5" />
              </template>
              <q-breadcrumbs-el 
                v-for="crumb in breadcrumbs" 
                :key="crumb.id" 
                :label="crumb.name" 
                icon="folder"
                class="cursor-pointer hover-link"
                @click="selectCategory(crumb.id)"
              />
            </q-breadcrumbs>
          </div>

          <!-- Procura -->
          <div class="col-12 col-md-auto">
            <div class="row items-center q-gutter-x-md">
              <q-toggle
                v-model="showSubcategoryDocs"
                label="Incluir sub-pastas"
                color="secondary"
                dense
                class="q-mr-sm"
              >
                <q-tooltip>Mostrar documentos desta pasta e de todas as sub-pastas</q-tooltip>
              </q-toggle>

              <q-input
                v-model="searchQuery"
                label="Procurar em tudo"
                filled
                dense
                clearable
                style="min-width: 250px"
                class="bg-white"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="col-12 col-md-auto">
            <div class="row items-center justify-end q-gutter-x-sm">
              <q-btn 
                unelevated 
                color="secondary" 
                icon="add" 
                :label="$q.screen.gt.xs ? 'Novo' : undefined"
                @click="showUploadDialog = true" 
              >
                <q-tooltip>Novo Documento</q-tooltip>
              </q-btn>
              <q-btn 
                unelevated 
                color="primary" 
                icon="account_tree" 
                :label="$q.screen.gt.xs ? 'Pastas' : undefined"
                @click="showCategoriesDialog = true" 
              >
                <q-tooltip>Gerir Árvore de Pastas</q-tooltip>
              </q-btn>
              <q-btn flat round color="grey-7" icon="arrow_back" @click="goBack">
                <q-tooltip>Voltar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Main Content: Folders + Files -->
    <div class="q-col-gutter-md row">
      <!-- Loading State -->
      <div v-if="loading" class="col-12 text-center q-pa-xl">
        <q-spinner color="secondary" size="3em" />
        <div class="text-grey-7 q-mt-md">A carregar...</div>
      </div>

      <!-- Folders Section -->
      <template v-if="!loading && currentSubCategories.length > 0 && !searchQuery">
        <div 
          v-for="cat in currentSubCategories" 
          :key="cat.id" 
          class="col-12 col-sm-6 col-md-3 col-lg-2"
        >
          <q-card 
            class="modern-card folder-card cursor-pointer" 
            @click="selectCategory(cat.id)"
          >
            <q-card-section class="flex items-center no-wrap">
              <q-icon name="folder" :color="cat.color || 'blue'" size="2rem" class="q-mr-md" />
              <div class="text-subtitle2 text-weight-medium ellipsis">
                {{ cat.name }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <!-- Files Section -->
      <div class="col-12">
        <div class="text-subtitle2 text-grey-7 q-mb-sm q-mt-md" v-if="!searchQuery && filteredDocuments.length > 0">
          Ficheiros nesta pasta
        </div>
        <div class="text-subtitle2 text-grey-7 q-mb-sm q-mt-md" v-else-if="searchQuery">
          Resultados da pesquisa
        </div>

        <q-card class="modern-card">
          <q-table
            :rows="filteredDocuments"
            :columns="columns"
            row-key="id"
            :loading="loading"
            flat
            no-data-label="Nenhum ficheiro encontrado nesta pasta"
            :rows-per-page-options="[10, 20, 50]"
          >
          <template v-slot:body="props">
            <q-tr 
              :props="props" 
              class="cursor-pointer" 
              @click="openFile(props.row)"
              :class="{ 'bg-blue-1': props.row.type === 'invoice' }"
            >
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'file'">
                  <div v-if="isImage(props.row.file)">
                    <q-avatar rounded size="40px">
                      <q-img :src="getThumbUrl(props.row)" spinner-color="white" />
                    </q-avatar>
                  </div>
                  <q-icon 
                    v-else
                    :name="getFileIcon(props.row.file)" 
                    :color="props.row.type === 'invoice' ? 'primary' : 'secondary'"
                    size="sm"
                  />
                </template>
                <template v-else-if="col.name === 'actions'">
                  <div class="row items-center justify-end q-gutter-xs" @click.stop v-if="props.row.type === 'document'">
                    <q-btn flat round dense color="primary" icon="edit" @click.stop="editDocument(props.row)" />
                    <q-btn flat round dense color="negative" icon="delete" @click.stop="deleteDocument(props.row)" />
                  </div>
                  <div v-else class="text-caption text-grey-6">Fatura</div>
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!loading && currentSubCategories.length === 0 && filteredDocuments.length === 0" 
        class="col-12 text-center q-pa-xl"
      >
        <q-icon name="folder_open" size="4rem" color="grey-4" />
        <div class="text-grey-6 q-mt-md text-h6">Esta pasta está vazia</div>
        <q-btn 
          flat 
          color="secondary" 
          label="Adicionar Documento" 
          icon="add" 
          class="q-mt-sm" 
          @click="showUploadDialog = true" 
        />
      </div>
    </div>

    <!-- Upload/Edit Document Dialog -->
    <q-dialog v-model="showUploadDialog" :maximized="$q.screen.lt.md" @hide="resetForm">
      <q-card :style="$q.screen.gt.sm ? 'min-width: 500px' : ''">
        <q-card-section>
          <div class="text-h6">{{ editingDocumentId ? 'Editar Documento' : 'Novo Documento' }}</div>
          <div class="text-caption" v-if="!editingDocumentId">
            A carregar na pasta: {{ breadcrumbs[breadcrumbs.length - 1].name }}
          </div>
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
              :options="categoryOptions"
              label="Pasta de Destino"
              filled
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="folder" />
              </template>
            </q-select>

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

            <div class="row justify-end q-gutter-sm q-mt-md">
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
      <q-card :style="$q.screen.gt.sm ? 'min-width: 600px' : ''">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">Gestão de Pastas (Árvore)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Form to Add/Edit Category -->
            <div class="col-12 col-md-5">
              <div class="text-subtitle2 q-mb-sm">Nova Pasta / Sub-pasta</div>
              <q-form @submit="addCategory" class="q-gutter-sm">
                <q-input v-model="newCategory.name" filled dense label="Nome da Pasta" />
                
                <q-select
                  v-model="newCategory.parent"
                  :options="categoryOptions"
                  label="Pasta Pai"
                  filled
                  dense
                  emit-value
                  map-options
                />

                <q-select
                  v-model="newCategory.color"
                  :options="colorOptions"
                  label="Cor"
                  filled
                  dense
                  emit-value
                  map-options
                />

                <q-btn 
                  type="submit" 
                  color="secondary" 
                  label="Criar Pasta" 
                  icon="add" 
                  :loading="addingCategory"
                  class="full-width"
                />
              </q-form>
            </div>

            <!-- Category Tree View -->
            <div class="col-12 col-md-7">
              <div class="text-subtitle2 q-mb-sm">Estrutura Atual</div>
              <div class="scroll" style="max-height: 400px">
                <q-tree
                  :nodes="categoryTree"
                  node-key="id"
                  default-expand-all
                >
                  <template v-slot:default-header="prop">
                    <div class="row items-center q-gutter-x-sm full-width">
                      <q-icon name="folder" :color="prop.node.color || 'blue'" />
                      <div class="text-weight-bold">{{ prop.node.label }}</div>
                      <q-space />
                      <q-btn 
                        flat round dense size="xs" color="negative" icon="delete" 
                        @click.stop="deleteCategory(prop.node.id)"
                      />
                    </div>
                  </template>
                </q-tree>
              </div>
            </div>
          </div>
        </q-card-section>
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
import { useAuth } from 'src/composables/useAuth'

const router = useRouter()
const $q = useQuasar()
const { checkAdmin } = useAuth()
const documents = ref([])
const categories = ref([])
const loading = ref(false)
const uploading = ref(false)
const addingCategory = ref(false)
const showUploadDialog = ref(false)
const showCategoriesDialog = ref(false)
const editingDocumentId = ref(null)
const currentFileName = ref(null)
const currentCategoryId = ref(null) // Categoria atual (pasta)
const searchQuery = ref('')
const showSubcategoryDocs = ref(false) // Toggle para mostrar sub-pastas

const newDocument = ref({
  title: '',
  description: '',
  file: null,
  category: null
})

const newCategory = ref({
  name: '',
  color: 'blue',
  parent: null
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

// Constrói a árvore de categorias para o q-tree
const categoryTree = computed(() => {
  const build = (parentId = null) => {
    return categories.value
      .filter(cat => (cat.parent || null) === parentId)
      .map(cat => ({
        id: cat.id,
        label: cat.name,
        name: cat.name,
        color: cat.color,
        icon: 'folder',
        children: build(cat.id)
      }))
  }
  return build(null)
})

// Categorias no nível atual para mostrar como pastas
const currentSubCategories = computed(() => {
  const currentId = currentCategoryId.value || null
  return categories.value.filter(cat => (cat.parent || null) === currentId)
})

// Breadcrumbs para navegação
const breadcrumbs = computed(() => {
  const crumbs = [{ id: null, name: 'Raiz' }]
  if (!currentCategoryId.value) return crumbs

  const findPath = (targetId, path = []) => {
    const cat = categories.value.find(c => c.id === targetId)
    if (!cat) return path
    const newPath = [cat, ...path]
    if (cat.parent) return findPath(cat.parent, newPath)
    return newPath
  }

  const path = findPath(currentCategoryId.value)
  return [...crumbs, ...path]
})

const categoryOptions = computed(() => {
  return [
    { label: 'Raiz (Sem Categoria)', value: null },
    ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
  ]
})

const filteredDocuments = computed(() => {
  let docs = documents.value
  
  // Se houver pesquisa, ignora a categoria atual e pesquisa em tudo
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return docs.filter(doc => 
      (doc.title && doc.title.toLowerCase().includes(query)) ||
      (doc.description && doc.description.toLowerCase().includes(query)) ||
      (doc.expand?.category?.name && doc.expand.category.name.toLowerCase().includes(query))
    )
  }

  // Se o toggle estiver ativo, buscar IDs de todas as subcategorias recursivamente
  if (showSubcategoryDocs.value) {
    const currentId = currentCategoryId.value || null
    const allChildIds = getAllChildrenIds(currentId)
    const categoryIdsToShow = [currentId, ...allChildIds]
    return docs.filter(doc => categoryIdsToShow.includes(doc.category || null))
  }

  // Se não estiver numa categoria, não mostra listagem por defeito (conforme pedido)
  // A menos que o toggle de sub-pastas esteja ativo (tratado acima)
  if (!currentCategoryId.value) return []

  // Caso contrário, mostra apenas documentos da categoria atual
  return docs.filter(doc => (doc.category || null) === currentCategoryId.value)
})

// Função auxiliar para pegar IDs de todos os filhos (recursivo)
const getAllChildrenIds = (parentId) => {
  const pId = parentId || null
  const children = categories.value.filter(cat => (cat.parent || null) === pId)
  let ids = children.map(c => c.id)
  
  children.forEach(child => {
    ids = [...ids, ...getAllChildrenIds(child.id)]
  })
  
  return ids
}

const columns = [
  { name: 'title', label: 'Título', field: 'title', align: 'left', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'file', label: 'Ficheiro', field: 'file', align: 'center' },
  { name: 'created', label: 'Data', field: row => date.formatDate(row.created, 'DD/MM/YYYY'), align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const loadCategories = async () => {
  try {
    const records = await pb.collection('document_categories').getFullList({
      sort: 'name'
    })
    categories.value = records
  } catch (e) {
    console.error('Error loading categories', e)
  }
}

const loadDocuments = async () => {
  loading.value = true
  try {
    const docRecords = await pb.collection('documents').getList(1, 500, {
      sort: '-created',
      expand: 'category'
    })

    const normalizedDocs = docRecords.items.map(doc => ({
      ...doc,
      type: 'document'
    }))

    const invRecords = await pb.collection('invoices').getList(1, 200, {
      filter: 'is_document = true',
      sort: '-created',
      expand: 'invoice_type'
    })

    const normalizedInvoices = invRecords.items.map(inv => {
      const matchedCat = categories.value.find(c => c.name === inv.expand?.invoice_type?.name)
      
      return {
        ...inv,
        type: 'invoice',
        category: matchedCat?.id || null,
        title: inv.description || 'Fatura',
        description: `${inv.is_entrance ? '(Entrada)' : '(Saída)'} Valor: ${inv.amount?.toFixed(2)}€ - Data: ${date.formatDate(inv.date, 'DD/MM/YYYY')}`,
        expand: {
          category: matchedCat || (inv.expand?.invoice_type ? {
            name: inv.expand.invoice_type.name,
            color: inv.expand.invoice_type.color
          } : null)
        }
      }
    })

    documents.value = [...normalizedDocs, ...normalizedInvoices].sort((a, b) => 
      new Date(b.created) - new Date(a.created)
    )
  } catch (e) {
    console.error('Error loading documents', e)
    if (e.status === 401) router.push('/login')
  } finally {
    loading.value = false
  }
}

const selectCategory = (id) => {
  currentCategoryId.value = id
  searchQuery.value = '' 
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
    category: currentCategoryId.value 
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

const deleteDocument = (doc) => {
  $q.dialog({
    title: 'Confirmar',
    message: `Tem a certeza que deseja eliminar este ${doc.type === 'invoice' ? 'fatura' : 'documento'}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const collection = doc.type === 'invoice' ? 'invoices' : 'documents'
      await pb.collection(collection).delete(doc.id)
      loadDocuments()
      $q.notify({
        color: 'positive',
        message: 'Eliminado com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar',
        icon: 'report_problem'
      })
    }
  })
}

const addCategory = async () => {
  if (!newCategory.value.name) return
  
  addingCategory.value = true
  try {
    await pb.collection('document_categories').create({
      ...newCategory.value,
      parent: newCategory.value.parent || '' // PocketBase handles empty string as null for relations usually, but let's be safe
    })
    $q.notify({
      color: 'positive',
      message: 'Pasta criada com sucesso',
      icon: 'check'
    })
    newCategory.value = { name: '', color: 'blue', parent: newCategory.value.parent }
    loadCategories()
  } catch (e) {
    console.error('Error creating category', e)
    $q.notify({
      color: 'negative',
      message: 'Falha ao criar pasta',
      icon: 'report_problem'
    })
  } finally {
    addingCategory.value = false
  }
}

const deleteCategory = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem a certeza que deseja eliminar esta pasta? Ficheiros nesta pasta ficarão órfãos.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await pb.collection('document_categories').delete(id)
      if (currentCategoryId.value === id) currentCategoryId.value = null
      loadCategories()
      $q.notify({
        color: 'positive',
        message: 'Pasta eliminada com sucesso',
        icon: 'check'
      })
    } catch (e) {
      console.error('Error deleting category', e)
      $q.notify({
        color: 'negative',
        message: 'Falha ao eliminar pasta',
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
  return pb.files.getURL(record, record.file)
}

const getThumbUrl = (record) => {
  return pb.files.getURL(record, record.file, { thumb: '100x100' })
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


onMounted(async () => {
  if (!pb.authStore.isValid) {
    router.push('/login')
    return
  }


  if (!checkAdmin()) return

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

.folder-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--q-secondary);
}

.hover-link:hover {
  text-decoration: underline;
  color: var(--q-primary);
}
</style>
