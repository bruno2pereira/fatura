# Sistema de Gestão de Invoices e Documentos 📄

## 🎉 Novas Funcionalidades Implementadas

### 1. Página de Seleção Inicial
Após o login, o utilizador é redirecionado para uma página de seleção onde pode escolher entre:
- **Invoices**: Gestão de faturas e despesas
- **Documentos**: Organização de documentos da empresa (apenas ADMIN)

### 2. Sistema de Categorização de Invoices
- Adicione tipos/categorias às suas invoices (ex: Alimentação, Transporte, Material de Escritório)
- Filtre invoices por tipo
- Gerir tipos através do botão "Tipos" (apenas ADMIN)
- Cada tipo tem um nome e uma cor associada

### 3. Marcar Invoices como Documentos
- Novo checkbox no formulário de invoice: "Marcar como documento da empresa"
- Permite identificar quais invoices devem ser consideradas documentos importantes
- Visível na tabela através de um ícone ✓

### 4. Gestão de Documentos (apenas ADMIN)
Nova secção dedicada para organizar documentos da empresa:
- Upload de documentos (PDF, Word, Excel, Imagens)
- Categorização de documentos
- Sistema independente das invoices
- Busca e filtro por categoria

## 🚀 Como Usar

### Configurar o PocketBase
1. Siga as instruções no ficheiro `POCKETBASE_SETUP.md`
2. Crie as coleções necessárias: `invoice_types`, `documents`, `document_categories`
3. Modifique a coleção `invoices` para adicionar os campos `invoice_type` e `is_document`

### Utilizar o Sistema

#### Como ADMIN:

**Gerir Tipos de Invoice:**
1. Aceda a Invoices
2. Clique em "Tipos"
3. Adicione novos tipos (nome + cor)
4. Os tipos aparecem no formulário de criação/edição de invoices

**Criar Invoice com Tipo:**
1. Clique em "Upload Invoice"
2. Preencha os dados normais
3. Selecione um tipo de fatura
4. Marque "Marcar como documento da empresa" se necessário
5. Submeter

**Filtrar Invoices:**
- Use o filtro "Filtrar por Tipo" para ver apenas invoices de um tipo específico

**Gerir Documentos:**
1. Na página de seleção, clique em "Documentos"
2. Clique em "Categorias" para gerir categorias de documentos
3. Clique em "Novo Documento" para adicionar documentos
4. Organize por categorias
5. Use o filtro para procurar documentos por categoria

#### Como Utilizador Normal:

- Acesso apenas à secção de Invoices
- Pode ver tipos e categorias
- Não pode criar/editar/eliminar (dependendo das permissões do role)

## 📊 Estrutura de Navegação

```
Login → Página de Seleção
          ├── Invoices
          │   ├── Lista de invoices
          │   ├── Filtro por tipo
          │   ├── Upload/Editar invoice
          │   └── Gerir Tipos (ADMIN)
          │
          └── Documentos (ADMIN apenas)
              ├── Lista de documentos
              ├── Filtro por categoria
              ├── Upload/Editar documento
              └── Gerir Categorias
```

## 🎨 Recursos Visuais

- Design moderno com gradientes
- Badges coloridos para categorias e tipos
- Interface responsiva (desktop e mobile)
- Animações suaves nas transições
- Ícones intuitivos

## 🔧 Detalhes Técnicos

### Páginas Criadas:
- `SelectionPage.vue`: Página de seleção inicial
- `DocumentsPage.vue`: Gestão de documentos
- Modificações em `DashboardPage.vue`: Adicionado suporte a tipos e is_document

### Rotas:
- `/`: Página de seleção
- `/invoices`: Lista de invoices
- `/documents`: Gestão de documentos (ADMIN)

### Novas Coleções PocketBase:
- `invoice_types`: Tipos de invoices
- `documents`: Documentos da empresa
- `document_categories`: Categorias de documentos

## 🔐 Permissões

| Funcionalidade | ADMIN | EDITAR | Outros |
|----------------|-------|--------|--------|
| Ver Invoices | ✅ | ✅ | ✅ |
| Criar/Editar Invoices | ✅ | ✅ | ❌ |
| Eliminar Invoices | ✅ | ✅ | ❌ |
| Gerir Tipos de Invoice | ✅ | ❌ | ❌ |
| Aceder Documentos | ✅ | ❌ | ❌ |
| Gerir Documentos | ✅ | ❌ | ❌ |
| Gerir Categorias | ✅ | ❌ | ❌ |

## 📝 Próximos Passos

1. Configure o PocketBase seguindo o ficheiro `POCKETBASE_SETUP.md`
2. Teste o sistema com um utilizador ADMIN
3. Crie alguns tipos de invoice e categorias de documentos
4. Adicione invoices e documentos para testar

## 🐛 Resolução de Problemas

**Erro ao carregar tipos/categorias:**
- Verifique se as coleções foram criadas no PocketBase
- Confirme as regras de acesso (API Rules)

**Não consigo aceder a Documentos:**
- Apenas utilizadores com role ADMIN podem aceder
- Verifique se o utilizador tem o role correto

**Filtros não funcionam:**
- Verifique se há dados nas respetivas coleções
- Confirme que as relações estão configuradas corretamente

## 💡 Dicas

- Use cores consistentes para categorias relacionadas
- Crie categorias gerais antes de começar a adicionar documentos
- Marque apenas invoices realmente importantes como documentos
- Use filtros para encontrar rapidamente o que procura

---

**Desenvolvido com ❤️ usando Vue 3 + Quasar + PocketBase**
