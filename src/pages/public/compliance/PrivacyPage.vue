<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">Política de Privacidade</h1>
    <p class="text-caption text-grey-7 q-mb-xl">Última atualização: {{ new Date().toLocaleDateString() }}</p>

    <div class="text-body1 q-gutter-y-md">
      <p>
        A sua privacidade é a nossa prioridade. No <strong>Toosag</strong> ("nós", "nosso"), acreditamos que os seus dados financeiros e pessoais são apenas seus. 
        Esta política descreve como recolhemos, usamos e protegemos as suas informações.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">1. Recolha de Dados</h2>
      <p>
        Recolhemos apenas as informações estritamente necessárias para o funcionamento do serviço:
        <ul>
          <li><strong>Informações da Conta:</strong> Nome, email e palavra-passe (encriptada).</li>
          <li><strong>Dados Financeiros e Documentos:</strong> Inseridos manualmente por si. Estes dados são armazenados de forma segura na nossa base de dados.</li>
        </ul>
        Não temos acesso automático às suas contas bancárias através de APIs (banco aberto/PSD2).
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">2. Uso das Informações</h2>
      <p>
        Utilizamos os seus dados exclusivamente para:
        <ul>
          <li>Fornecer, manter e melhorar a plataforma;</li>
          <li>Processar as suas transações e armazenar os seus documentos;</li>
          <li>Enviar comunicações técnicas ou recuperações de senha.</li>
        </ul>
        <strong>Nunca vendemos os seus dados pessoais ou financeiros a terceiros para fins de marketing.</strong>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">3. Publicidade e Cookies (Google AdSense)</h2>
      <p>
        Para manter este serviço gratuito, utilizamos o Google AdSense para exibir anúncios.
        <ul>
          <li>Terceiros, incluindo a Google, usam cookies para veicular anúncios com base em visitas anteriores do utilizador ao seu website ou a outros websites.</li>
          <li>O uso de cookies de publicidade pela Google permite que esta e os seus parceiros veiculem anúncios aos utilizadores com base nas suas visitas aos seus sites e/ou a outros sites na Internet.</li>
          <li>Pode optar por desativar a publicidade personalizada visitando as <a href="https://www.google.com/settings/ads" target="_blank">Definições de Anúncios</a>.</li>
        </ul>
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">4. Segurança dos Dados</h2>
      <p>
        Implementamos medidas de segurança robustas, incluindo encriptação em trânsito (SSL/TLS) e encriptação de dados sensíveis em repouso. 
        No entanto, nenhum método de transmissão pela Internet é 100% seguro.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">5. Os Seus Direitos (RGPD)</h2>
      <p>
        De acordo com o Regulamento Geral sobre a Proteção de Dados (RGPD), tem o direito de:
        <ul>
          <li>Aceder aos seus dados pessoais;</li>
          <li>Retificar dados incorretos;</li>
          <li>Solicitar a eliminação dos seus dados ("Direito ao Esquecimento");</li>
          <li>Exportar os seus dados.</li>
        </ul>
        Pode exercer estes direitos diretamente nas configurações da sua conta ou contactando-nos.
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
