<template>
  <br>
  <br>
  <div class="container mx-auto p-4">
    <div class="w-full max-w-screen-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <!-- botão para abrir o resumo do mês -->
      <div class="flex justify-end mb-4">
        <button
          @click="openSummaryModal"
          class="px-2 py-1 md:px-4 md:py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-transform transform hover:scale-105 text-sm md:text-base"
        >
          Resumo do Mês
        </button>
      </div>

      <!-- título do calendário -->
      <h1 class="text-2xl md:text-4xl font-extrabold mb-8 text-center text-gray-800">
        Calendário de Vencimentos
      </h1>

      <!-- navegação do calendário (anterior, mês/ano, próximo) -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="previousMonth"
          class="px-2 py-1 md:px-4 md:py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-transform transform hover:scale-105 text-sm md:text-base"
        >
          Anterior
        </button>
        <div class="text-xl md:text-2xl font-semibold text-green-600 text-center flex-1">
          {{ monthYear }}
        </div>
        <button
          @click="nextMonth"
          class="px-2 py-1 md:px-4 md:py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-transform transform hover:scale-105 text-sm md:text-base"
        >
          Próximo
        </button>
      </div>

      <!-- títulos dos dias da semana -->
      <div class="grid grid-cols-7 gap-1 text-center font-semibold text-green-600 text-xs sm:text-sm md:text-base lg:text-lg">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      <!-- dias do calendário -->
      <div class="grid grid-cols-7 gap-1 mt-4">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="relative border p-1 md:p-2 rounded-lg bg-gray-100 shadow transition-all duration-200 transform hover:scale-105 min-w-[40px] text-center"
          :class="{
            'bg-green-200 text-green-700': eventsOnDay(day.date).length > 0,
            'bg-gray-200': day.date === null,
          }"
        >
          <!-- data do dia -->
          <div v-if="day.date" class="font-bold text-green-600 text-xs sm:text-sm md:text-base">
            {{ day.date }}
          </div>

          <!-- exibição dos eventos do dia -->
          <div
            v-if="eventsOnDay(day.date).length > 0"
            class="absolute inset-0 p-1 flex flex-col justify-center items-center space-y-1 overflow-hidden"
          >
            <!-- eventos visíveis do dia -->
            <div
              v-for="(event, index) in visibleEvents(day.date)"
              :key="event.id"
              class="bg-green-500 text-white rounded px-1 py-0.5 shadow cursor-pointer hover:bg-green-600 transition-transform transform hover:scale-110 truncate text-[8px] sm:text-xs md:text-sm whitespace-nowrap overflow-hidden"
              @click="toggleTooltip(day.date, event)"
            >
              {{ event.title }}
            </div>
            <!-- indicação de mais eventos -->
            <div
              v-if="eventsOnDay(day.date).length > 2"
              class="text-xs text-green-600 cursor-pointer"
              @click="showAllEvents(day.date)"
            >
              +{{ eventsOnDay(day.date).length - 2 }} mais
            </div>
          </div>

          <!-- tooltip para eventos do dia -->
          <transition name="fade" mode="out-in">
            <div
              v-if="tooltip.visible && tooltip.date === day.date && tooltip.event.id === tooltip.selectedEventId"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-green-700 text-white rounded shadow-lg text-xs z-10 max-w-xs md:max-w-sm"
              :class="{ 'tooltip-mobile': isMobile }"
            >
              <div class="whitespace-pre-wrap max-h-24 overflow-auto">
                <p>{{ tooltip.event.title }} ({{ tooltip.event.type }})</p>
                <span v-if="tooltip.event.bimestral">
                  Referente a: {{ getReferenciaMes(tooltip.event, 1) }} e deve ser entregue até {{ getEntregaMes(tooltip.event, 1) }}
                </span>
                <span v-else-if="tooltip.event.mesSubsequente">
                  Referente a: {{ getReferenciaMes(tooltip.event, 1) }} e deve ser entregue até {{ getEntregaMes(tooltip.event, 0) }}
                </span>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- modal para ver todos os eventos -->
      <transition name="modal-fade">
        <div v-if="showAllEventsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div class="bg-white p-4 md:p-6 rounded-lg shadow-xl text-gray-800 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-105">
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-center">Eventos do Dia {{ selectedDate }}</h2>
            <ul class="space-y-2">
              <li
                v-for="event in allEvents"
                :key="event.id"
                class="text-xs sm:text-sm bg-green-500 rounded px-3 py-2 shadow relative cursor-pointer"
                @click="toggleEventTooltip(event)"
              >
                {{ event.title }} ({{ event.type }})
                <!-- tooltip para detalhes do evento no modal -->
                <div v-if="eventTooltip.visible && eventTooltip.event.id === event.id" class="absolute left-full top-0 ml-2 w-48 p-2 bg-green-700 text-white rounded shadow-lg text-xs z-10">
                  Referente a: {{ getReferenciaMes(event, event.bimestral ? 1 : 1) }} e deve ser entregue até {{ getEntregaMes(event, event.bimestral ? 1 : 0) }}
                </div>
              </li>
            </ul>
            <!-- botão para fechar o modal -->
            <button @click="closeAllEventsModal" class="w-full py-2 mt-4 bg-red-400 rounded-md hover:bg-red-300 transition-all duration-200 transform hover:scale-105 text-white">
              Fechar
            </button>
          </div>
        </div>
      </transition>

      <!-- modal para resumo do mês -->
      <transition name="modal-fade">
        <div
          v-if="showSummaryModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-8"
        >
          <div
            class="bg-gradient-to-br from-green-100 via-white to-green-50 p-12 rounded-3xl shadow-2xl w-full max-w-3xl mx-8 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-105 relative"
          >
            <!-- botão de fechar (x) -->
            <button
              @click="closeSummaryModal"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
              aria-label="Fechar"
            >
              <i class="fas fa-times text-xl"></i>
            </button>

            <!-- cabeçalho do modal de resumo -->
            <h2
              class="text-lg md:text-3xl font-extrabold mb-10 text-center text-green-800 flex items-center justify-center"
            >
              <i class="fas fa-calendar-alt text-green-500 mr-4 animate-pulse"></i>
              Resumo de {{ monthYear }}
            </h2>

            <!-- container para exibir eventos na horizontal -->
            <div class="flex flex-wrap gap-10 justify-start">
              <div
                v-for="type in eventTypes"
                :key="type"
                class="flex-1 min-w-[260px] mb-10 p-10 bg-white rounded-xl shadow-lg border border-green-200 hover:shadow-xl hover:bg-green-50 transition-shadow duration-300"
              >
                <!-- cabeçalho de tipo de evento -->
                <h3
                  class="text-lg md:text-xl font-semibold text-green-700 mb-6 flex items-center"
                >
                  <i
                    class="mr-4 text-green-500 hover:text-green-600 transition-colors duration-300"
                  ></i>
                  {{ type }}
                </h3>

                <!-- lista de eventos do tipo -->
                <ul class="space-y-5">
                  <li
                    v-for="event in eventsInMonthByType(type)"
                    :key="event.id"
                    class="flex flex-col text-green-900 text-sm sm:text-base"
                  >
                    <!-- informação do evento -->
                    <div class="flex items-start mb-2">
                      <i class="fas fa-calendar-day text-green-500 mr-3"></i>
                      <span>{{ event.title }} - {{ event.day }} de {{ monthYear }}</span>
                    </div>
                    <!-- informação adicional sobre o evento -->
                    <div
                      class="text-sm text-green-600 flex items-center"
                      v-if="event.bimestral || event.mesSubsequente"
                    >
                      <i class="fas fa-info-circle mr-2 text-green-400"></i>
                      Referente a: {{ getReferenciaMes(event, event.bimestral ? 1 : 1) }} e
                      deve ser entregue até {{ getEntregaMes(event, event.bimestral ? 1 : 0) }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

export default {
  data() {
    return {
      currentMonth: dayjs().month(), // mês atual (0-indexado)
      currentYear: dayjs().year(), // ano atual
      tooltip: {
        visible: false,
        date: null,
        event: null,
        selectedEventId: null,
      },
      showAllEventsModal: false,
      showSummaryModal: false,
      selectedDate: null,
      allEvents: [],
      eventTooltip: {
        visible: false,
        event: null,
      },
    };
  },
  computed: {
    // retorna o nome do mês e o ano atual
    monthYear() {
      return dayjs().month(this.currentMonth).year(this.currentYear).format('MMMM YYYY');
    },
    // calcula os dias do mês atual
    calendarDays() {
      const daysInMonth = dayjs().month(this.currentMonth).year(this.currentYear).daysInMonth();
      const firstDayOfMonth = dayjs().month(this.currentMonth).year(this.currentYear).startOf('month').day();
      const days = [];
      // adiciona dias vazios antes do primeiro dia do mês
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ date: null });
      }
      // adiciona os dias do mês
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: i });
      }
      return days;
    },
    // lista dos eventos cadastrados
    events() {
      return [
        { id: 1, title: 'ICMS MG', type: 'Imposto', day: 8, frequencia: 'mensal', mesSubsequente: true },
        { id: 2, title: 'ICMS SP', type: 'Imposto', day: 20, frequencia: 'mensal', mesSubsequente: true },
        { id: 3, title: 'ISS IGA', type: 'Imposto', day: 10, frequencia: 'mensal', mesSubsequente: true },
        { id: 4, title: 'ISS DELTA', type: 'Imposto', day: 20, frequencia: 'mensal', mesSubsequente: true },
        { id: 5, title: 'DCTF', type: 'Declaração', day: 14, frequencia: 'mensal', bimestral: true },
        { id: 6, title: 'PIS', type: 'Imposto', day: 25, frequencia: 'mensal', mesSubsequente: true },
        { id: 7, title: 'COFINS', type: 'Imposto', day: 25, frequencia: 'mensal', mesSubsequente: true },
        { id: 10, title: 'DEFIS', type: 'Declaração', day: 30, frequencia: 'anual', month: 3 },
        { id: 11, title: 'DASN SIMEI', type: 'Declaração', day: 30, frequencia: 'anual', month: 4 },
        { id: 12, title: 'ECF', type: 'Declaração', day: 30, frequencia: 'anual', month: 7 },
        { id: 13, title: 'ECD', type: 'Declaração', day: 30, frequencia: 'anual', month: 5 },
        { id: 14, title: 'SPED Contribuições', type: 'Declaração', day: 25, frequencia: 'mensal', bimestral: true },
        { id: 15, title: 'SPED Fiscal', type: 'Declaração', day: 25, frequencia: 'mensal', bimestral: true },
        { id: 16, title: 'DAPI', type: 'Declaração', day: 8, frequencia: 'mensal', bimestral: true },
        { id: 17, title: 'GIA SP', type: 'Declaração', day: 20, frequencia: 'mensal', bimestral: true },
        { id: 18, title: 'DAS', type: 'Imposto', day: 20, frequencia: 'mensal', mesSubsequente: true },
        { id: 20, title: 'DIFAL SP', type: 'Imposto', day: 20, frequencia: 'mensal', mesSubsequente: true },
        { id: 22, title: 'DIFAL MG', type: 'Imposto', day: 2, frequencia: 'mensal', mesSubsequente: true },
        { id: 23, title: 'SEDIF', type: 'Declaração', day: 28, frequencia: 'mensal', mesSubsequente: true },
        { id: 24, title: 'SINTEGRA', type: 'Declaração', day: 15, frequencia: 'mensal', mesSubsequente: true },
      ];
    },
    // tipos de eventos disponíveis
    eventTypes() {
      return ['Imposto', 'Declaração'];
    },
    // filtra eventos que ocorrem no mês atual
    eventsInMonth() {
      return this.events.filter(event => {
        if (event.frequencia === 'trimestral' && [2, 5, 8, 11].includes(this.currentMonth)) {
          return true;
        }
        if (event.frequencia === 'anual' && event.month === this.currentMonth + 1) {
          return true;
        }
        if (event.bimestral && (this.currentMonth + 1) % 2 === 0) {
          return true;
        }
        if (event.mesSubsequente || event.frequencia === 'mensal') {
          return true;
        }
        return false;
      });
    },
  },
  methods: {
    // abre o modal de resumo do mês
    openSummaryModal() {
      this.showSummaryModal = true;
    },
    // fecha o modal de resumo do mês
    closeSummaryModal() {
      this.showSummaryModal = false;
    },
    // retorna eventos do mês filtrados por tipo
    eventsInMonthByType(type) {
      return this.eventsInMonth.filter(event => event.type === type);
    },
    // filtra eventos que ocorrem em um dia específico
    eventsOnDay(day) {
      return this.events.filter((event) => {
        if (event.frequencia === 'trimestral' && [2, 5, 8, 11].includes(this.currentMonth)) {
          return event.day === day;
        }
        if (event.frequencia === 'anual') {
          return event.day === day && event.month === this.currentMonth + 1;
        }
        if (event.bimestral) {
          const referenceMonth = (this.currentMonth - 1 + 12) % 12;
          return event.day === day && this.currentMonth === referenceMonth + 1;
        }
        return event.day === day;
      });
    },
    // limita a exibição dos eventos a dois por dia
    visibleEvents(day) {
      return this.eventsOnDay(day).slice(0, 2);
    },
    // abre o modal para ver todos os eventos do dia
    showAllEvents(date) {
      this.selectedDate = date;
      this.allEvents = this.eventsOnDay(date);
      this.showAllEventsModal = true;
    },
    // fecha o modal de todos os eventos
    closeAllEventsModal() {
      this.showAllEventsModal = false;
    },
    // obtém o mês de referência de um evento
    getReferenciaMes(event, offset = 1) {
      const referenciaMonth = (this.currentMonth - offset + 12) % 12;
      return dayjs().month(referenciaMonth).year(this.currentYear).format('MMMM YYYY');
    },
    // obtém o mês de entrega de um evento
    getEntregaMes(event, offset = 1) {
      const entregaMonth = (this.currentMonth + offset) % 12;
      const entregaYear = entregaMonth < this.currentMonth ? this.currentYear + 1 : this.currentYear;
      return dayjs().month(entregaMonth).year(entregaYear).format('MMMM YYYY');
    },
    // alterna a visibilidade do tooltip de um evento
    toggleTooltip(date, event) {
      if (this.tooltip.visible && this.tooltip.selectedEventId === event.id) {
        this.hideTooltip();
      } else {
        this.showTooltip(date, event);
      }
    },
    // exibe o tooltip de um evento
    showTooltip(date, event) {
      this.tooltip.visible = true;
      this.tooltip.date = date;
      this.tooltip.event = event;
      this.tooltip.selectedEventId = event.id;
    },
    // esconde o tooltip de um evento
    hideTooltip() {
      this.tooltip.visible = false;
      this.tooltip.date = null;
      this.tooltip.event = null;
      this.tooltip.selectedEventId = null;
    },
    // alterna a visibilidade do tooltip de um evento no modal
    toggleEventTooltip(event) {
      if (this.eventTooltip.visible && this.eventTooltip.event.id === event.id) {
        this.hideEventTooltip();
      } else {
        this.showEventTooltip(event);
      }
    },
    // exibe o tooltip de um evento no modal
    showEventTooltip(event) {
      if (event.mesSubsequente || event.bimestral) {
        this.eventTooltip.visible = true;
        this.eventTooltip.event = event;
      }
    },
    // esconde o tooltip de um evento no modal
    hideEventTooltip() {
      this.eventTooltip.visible = false;
      this.eventTooltip.event = null;
    },
    // navega para o mês anterior
    previousMonth() {
      this.currentMonth -= 1;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      }
    },
    // navega para o próximo mês
    nextMonth() {
      this.currentMonth += 1;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear += 1;
      }
    },
  },
};
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.grid-cols-7 .relative {
  min-height: 100px;
}

/* estilo para o tooltip em dispositivos móveis */
.tooltip-mobile {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 300px;
  z-index: 50;
}

/* ajustes para telas pequenas */
@media (max-width: 400px) {
  .text-xs {
    font-size: 10px;
  }

  .truncate {
    max-width: 50px; /* limita o tamanho do texto para garantir truncagem */
  }
}
</style>
