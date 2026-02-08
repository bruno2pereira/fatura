<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">Termos de Uso</h1>
    <p class="text-caption text-grey-7 q-mb-xl">Última atualização: {{ new Date().toLocaleDateString() }}</p>

    <div class="text-body1 q-gutter-y-md">
      <h2 class="text-h5 text-weight-bold q-mt-xl">1. Aceitação dos Termos</h2>
      <p>
        Ao criar uma conta ou utilizar o <strong>Toosag</strong>, concorda em ficar vinculado a estes Termos de Uso. 
        Se não concordar, não deverá utilizar o serviço.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">2. Descrição do Serviço</h2>
      <p>
        O Toosag é uma plataforma SaaS que permite aos utilizadores registar e organizar manualmente as suas finanças pessoais e documentos.
        <strong>Isenção de Responsabilidade:</strong> Nós não fornecemos aconselhamento financeiro, legal ou fiscal profissional. 
        A ferramenta serve apenas para fins de organização e informação.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">3. Responsabilidades do Utilizador</h2>
      <p>
        O utilizador é o único responsável:
        <ul>
          <li>Pela veracidade e precisão dos dados inseridos;</li>
          <li>Por manter a confidencialidade da sua senha de acesso;</li>
          <li>Por garantir que os documentos carregados não violam leis ou direitos de terceiros.</li>
        </ul>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">4. Propriedade Intelectual</h2>
      <p>
        O software, design e código-fonte da plataforma são propriedade exclusiva do Toosag. 
        Os dados inseridos pelo utilizador permanecem propriedade do utilizador.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">5. Limitação de Responsabilidade</h2>
      <p>
        Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou incapacidade de usar o serviço, 
        incluindo perda de dados ou lucros cessantes.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">6. Modificações</h2>
      <p>
        Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos os utilizadores sobre alterações significativas.
      </p>
    </div>
  </q-page>
</template>

<script setup>
</script>

<style scoped>
.container-limit {
  max-width: 800px;
  width: 100%;
}
</style>
