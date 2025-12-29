# Configuração do PocketBase - Passos Necessários

## 📋 Visão Geral
Este documento descreve as alterações necessárias no PocketBase para suportar o sistema de gestão de documentos e categorização de invoices.

## 🗄️ Coleções a Criar/Modificar

### 1. Modificar Coleção `invoices`

Adicione os seguintes campos à coleção existente `invoices`:

#### Novos Campos:

**invoice_type** (Relation)
- Tipo: Relation
- Collection: invoice_types
- Max select: 1
- Display fields: name
- Cascade delete: false (Set null)
- Required: Não

**is_document** (Boolean)
- Tipo: Bool
- Default value: false
- Required: Sim
- Descrição: Indica se a invoice deve aparecer também na secção de documentos

**is_entrance** (Boolean)
- Tipo: Bool
- Default value: false
- Required: Sim
- Descrição: Indica se é uma entrada (true) ou saída (false) de dinheiro

### 2. Criar Coleção `invoice_types`

Crie uma nova coleção chamada `invoice_types` com os seguintes campos:

**name** (Text)
- Tipo: Text
- Required: Sim
- Unique: Não
- Min length: 1
- Max length: 100
- Descrição: Nome do tipo (ex: Alimentação, Transporte, Material de Escritório)

**color** (Text)
- Tipo: Text
- Required: Sim
- Default value: blue
- Pattern: ^(blue|green|red|orange|purple|pink|amber|grey)$
- Descrição: Cor do badge (blue, green, red, orange, purple, pink, amber, grey)

#### Regras de Acesso (API Rules):

- **List/View**: `@request.auth.id != ""`
- **Create**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Update**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Delete**: `@request.auth.expand.role.code ?= "ADMIN"`

### 3. Criar Coleção `documents`

Crie uma nova coleção chamada `documents` com os seguintes campos:

**title** (Text)
- Tipo: Text
- Required: Sim
- Min length: 1
- Max length: 200
- Descrição: Título do documento

**description** (Text)
- Tipo: Text (Editor)
- Required: Não
- Max length: 1000
- Descrição: Descrição detalhada do documento

**file** (File)
- Tipo: File
- Required: Sim
- Max select: 1
- Max size: 10485760 (10 MB)
- Mime types: application/pdf, image/jpeg, image/png, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Protected: Não
- Thumbs: 100x100, 300x300

**category** (Relation)
- Tipo: Relation
- Collection: document_categories
- Max select: 1
- Display fields: name
- Cascade delete: false (Set null)
- Required: Não

#### Regras de Acesso (API Rules):

- **List/View**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Create**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Update**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Delete**: `@request.auth.expand.role.code ?= "ADMIN"`

### 4. Criar Coleção `document_categories`

Crie uma nova coleção chamada `document_categories` com os seguintes campos:

**name** (Text)
- Tipo: Text
- Required: Sim
- Unique: Não
- Min length: 1
- Max length: 100
- Descrição: Nome da categoria (ex: Contratos, Certificados, RH, Financeiro)

**color** (Text)
- Tipo: Text
- Required: Sim
- Default value: blue
- Pattern: ^(blue|green|red|orange|purple|pink|amber|grey)$
- Descrição: Cor do badge (blue, green, red, orange, purple, pink, amber, grey)

**parent** (Relation)
- Tipo: Relation
- Collection: document_categories
- Max select: 1
- Cascade delete: false (Set null)
- Required: Não
- Descrição: Categoria pai para estrutura em árvore (pastas)

#### Regras de Acesso (API Rules):

- **List/View**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Create**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Update**: `@request.auth.expand.role.code ?= "ADMIN"`
- **Delete**: `@request.auth.expand.role.code ?= "ADMIN"`

## 🔐 Permissões e Segurança

### Resumo das Permissões:

1. **Invoices**: 
   - Ver: Todos os utilizadores autenticados
   - Criar/Editar/Eliminar: ADMIN e EDITAR

2. **Invoice Types**: 
   - Ver: Todos os utilizadores autenticados
   - Criar/Editar/Eliminar: Apenas ADMIN

3. **Documents**: 
   - Tudo: Apenas ADMIN

4. **Document Categories**: 
   - Tudo: Apenas ADMIN

## 📝 Passos de Configuração

1. Aceda ao PocketBase Admin Dashboard
2. Vá para Collections
3. Modifique a coleção `invoices` adicionando os campos `invoice_type` e `is_document`
4. Crie a coleção `invoice_types` com os campos e regras especificados
5. Crie a coleção `documents` com os campos e regras especificados
6. Crie a coleção `document_categories` com os campos e regras especificados
7. Verifique todas as regras de acesso (API Rules) para cada coleção

## 🧪 Teste a Configuração

Após configurar, teste:

1. Login com utilizador ADMIN
2. Aceda à página de seleção (/)
3. Vá para Invoices:
   - Clique em "Tipos" para gerir tipos de invoice
   - Crie um novo tipo (ex: Alimentação, cor azul)
   - Crie uma nova invoice e selecione o tipo
   - Marque o checkbox "Marcar como documento da empresa"
4. Vá para Documentos:
   - Clique em "Categorias" para gerir categorias de documentos
   - Crie uma nova categoria (ex: Contratos, cor verde)
   - Crie um novo documento e selecione a categoria

## 💡 Funcionalidades Implementadas

✅ Página de seleção após login  
✅ Gestão de documentos da empresa (apenas ADMIN)  
✅ Categorização de documentos  
✅ Tipos/categorias para invoices  
✅ Filtro por categoria em invoices  
✅ Checkbox para marcar invoices como documentos  
✅ Gestão completa de categorias via UI  
✅ Navegação entre secções  

## 🔄 Relacionamento entre Invoices e Documentos

- Quando marca uma invoice com `is_document = true`, essa invoice pode ser considerada também como um documento da empresa
- Os documentos são uma secção separada com gestão própria
- Ambos têm sistemas de categorização independentes:
  - Invoices usam `invoice_types`
  - Documents usam `document_categories`

## 📊 Estrutura de Dados Exemplo

### Invoice Type:
```json
{
  "name": "Alimentação",
  "color": "green"
}
```

### Document Category:
```json
{
  "name": "Contratos",
  "color": "blue"
}
```

### Invoice (com tipo e marcado como documento):
```json
{
  "date": "2024-01-15",
  "description": "Fatura de almoço",
  "amount": 45.50,
  "file": "invoice.pdf",
  "invoice_type": "rel_invoice_type_id",
  "is_document": true,
  "uploaded_by": "user_id"
}
```

### Document:
```json
{
  "title": "Contrato de Trabalho - João Silva",
  "description": "Contrato de trabalho sem termo",
  "file": "contrato.pdf",
  "category": "rel_category_id"
}
```
