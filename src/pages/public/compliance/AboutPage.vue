<template>
  <q-page padding class="container-limit q-mx-auto">
    <h1 class="text-h3 text-weight-bold q-mb-md">Sobre Nós</h1>

    <div class="text-body1 q-gutter-y-md">
      <p class="text-h6 text-weight-regular text-grey-8">
        Acreditamos que a tecnologia deve servir o utilizador, não vigiá-lo.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">A Nossa Missão</h2>
      <p>
        A nossa missão é empoderar indivíduos a retomarem o controlo da sua vida financeira através da consciência e organização, sem abdicar da sua privacidade digital.
        Num mundo onde "grátis" significa frequentemente que os seus dados são o produto, nós escolhemos um caminho diferente.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">Quem Somos</h2>
      <p>
        Somos uma equipa de entusiastas por tecnologia e finanças pessoais, cansados de aplicações que exigem as suas senhas bancárias para funcionar. 
        Desenvolvemos o Toosag para ser o santuário digital da sua vida económica e documental.
      </p>

      <h2 class="text-h5 text-weight-bold q-mt-xl">O Nosso Compromisso</h2>
      <p>
        <strong>Transparência total.</strong> Financiamos o desenvolvimento e manutenção desta plataforma através de publicidade ética e visível, 
        em vez de minerar os seus dados nos bastidores. O que você insere aqui, fica aqui.
      </p>

      <q-separator class="q-my-xl" />

      <div class="text-center">
        <h3 class="text-h4 text-weight-bold q-mb-md">Junte-se a nós</h3>
        <p class="q-mb-lg">Comece hoje a organizar a sua vida financeira com total liberdade.</p>
        <q-btn color="primary" label="Criar Conta Gratuita" to="/login" size="lg" no-caps />
      </div>
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
