<template>
  <nav
    class="fixed w-full top-0 z-20 border-b shadow-md transition-colors duration-300"
    :style="{ backgroundColor: isDarkMode ? '#004d40' : '#4CAF50', borderColor: isDarkMode ? '#004d40' : '#388E3C' }"
  >
    <div class="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
      <!-- Ícone e título -->
      <div class="flex items-center space-x-3">
        <i
          class="fas fa-calendar-alt text-2xl"
          :style="{ color: isDarkMode ? '#E0F2F1' : '#004d40' }"
        ></i>
        <span
          class="text-2xl font-semibold"
          :style="{ color: isDarkMode ? '#E0F2F1' : '#004d40' }"
          >Calendário Fiscal</span
        >
      </div>
      <!-- Botão do menu para dispositivos móveis -->
      <div class="md:hidden">
        <button
          @click="toggleMenu"
          class="p-2 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
          :style="{
            color: isDarkMode ? '#E0F2F1' : '#004d40',
            backgroundColor: isDarkMode ? '#00796b' : '#A5D6A7',
          }"
        >
          <span class="sr-only">Abrir menu principal</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <!-- Menu de navegação -->
      <div
        :class="{
          'hidden': !menuOpen,
          'block': menuOpen,
          'absolute top-full left-0 w-full bg-white md:bg-transparent md:static': true,
        }"
        class="md:flex md:items-center md:w-auto"
      >
        <ul
          class="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 transition-all duration-300 border md:border-0 rounded-lg p-4 md:p-0"
          :style="{
            borderColor: isDarkMode ? '#004d40' : '#388E3C',
            backgroundColor: isDarkMode ? '#004d40' : '#A5D6A7',
          }"
        >
          <li>
            <RouterLink
              to="/faturamento"
              class="block py-2 px-4 rounded-lg md:bg-transparent md:p-0 transition-colors duration-300 hover:bg-green-600 hover:text-white"
              :class="{ 'active-tab': activeTab === 'Emitir Faturamento' }"
              :style="{
                color: isDarkMode ? '#E0F2F1' : '#004d40',
                backgroundColor: activeTab === 'Emitir Faturamento'
                  ? '#388E3C'
                  : 'transparent',
              }"
              @click="setActiveTab('Emitir Faturamento')"
              >Exibir calendário</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "nav_bar",
  data() {
    return {
      menuOpen: false,
      activeTab: "", // Adicione a propriedade activeTab para controlar a aba ativa
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style>
/* Adicione o CSS para Font Awesome */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

/* Estilo adicional para o botão ativo */
.active-tab {
  background-color: #388e3c !important;
  color: white !important;
}
</style>
