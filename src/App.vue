<template>
  <nav_bar />
  <br>
  <!-- Mensagem de boas-vindas -->
  <div v-if="showWelcomeMessage" class="welcome-wrapper">
    <div class="welcome-message p-8 max-w-lg text-center bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h1 class="text-3xl font-extrabold text-white mb-4">Bem-vindo ao Calendário de Obrigações Fiscais!</h1>
      <p class="text-lg text-white opacity-90">Para visualizar o calendário, clique no botão correspondente disponível na barra de navegação acima.</p>
    </div>
  </div>

  <RouterView/>
</template>

<script>
import nav_bar from './components/nav_bar.vue'

export default {
  name: 'App',
  components: {
    nav_bar
  },
  computed: {
    showWelcomeMessage() {
      // Verifica se a rota atual é a rota inicial ("/") ou qualquer outra rota específica
      return this.$route.path === '/';
    }
  }
}
</script>

<style>
/* Estilo para o wrapper da mensagem */
.welcome-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh; /* Ajuste conforme necessário */
  margin-top: 2rem; /* Ajuste o espaço acima da mensagem se necessário */
}

body {
  background-color: aliceblue;
}
</style>