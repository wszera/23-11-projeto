// Obter dados do localStorage
const activitiesFromLocalStorage = JSON.parse(localStorage.getItem('activities')) || [];
const tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks')) || [];
const streakFromLocalStorage = parseInt(localStorage.getItem('streak')) || 0;

// Função para formatar tempo (auxiliar)
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

// Função para contar atividades e tarefas concluídas por tipo
function getCompletedTasksByType() {
  const taskCompletionStats = {
    saude: 0,
    estudo: 0,
    lazer: 0,
    trabalho: 0,
    outros: 0
  };

  // Contar tarefas concluídas por tipo
  tasksFromLocalStorage.forEach(task => {
    if (task.completed) {
      if (task.tag === 'saude') taskCompletionStats.saude++;
      if (task.tag === 'estudo') taskCompletionStats.estudo++;
      if (task.tag === 'lazer') taskCompletionStats.lazer++;
      if (task.tag === 'trabalho') taskCompletionStats.trabalho++;
      if (task.tag === 'outros') taskCompletionStats.outros++;
    }
  });

  // Contar atividades concluídas por tipo
  activitiesFromLocalStorage.forEach(activity => {
    if (activity.completed) {
      const activityTag = activity.tag || 'outros'; // Garantir que a tag esteja disponível, ou use 'outros'
      if (activityTag === 'saude') taskCompletionStats.saude++;
      if (activityTag === 'estudo') taskCompletionStats.estudo++;
      if (activityTag === 'lazer') taskCompletionStats.lazer++;
      if (activityTag === 'trabalho') taskCompletionStats.trabalho++;
      if (activityTag === 'outros') taskCompletionStats.outros++;
    }
  });

  return taskCompletionStats;
}

// Preencher os dados para o gráfico
const activityData = {
  labels: ["Saúde", "Estudo", "Lazer", "Trabalho", "Outros"],
  data: [
    tasksFromLocalStorage.filter(task => task.tag === "saude" && task.completed).length +
    activitiesFromLocalStorage.filter(activity => activity.tag === "saude" && activity.completed).length,
    tasksFromLocalStorage.filter(task => task.tag === "estudo" && task.completed).length +
    activitiesFromLocalStorage.filter(activity => activity.tag === "estudo" && activity.completed).length,
    tasksFromLocalStorage.filter(task => task.tag === "lazer" && task.completed).length +
    activitiesFromLocalStorage.filter(activity => activity.tag === "lazer" && activity.completed).length,
    tasksFromLocalStorage.filter(task => task.tag === "trabalho" && task.completed).length +
    activitiesFromLocalStorage.filter(activity => activity.tag === "trabalho" && activity.completed).length,
    tasksFromLocalStorage.filter(task => task.tag === "outros" && task.completed).length +
    activitiesFromLocalStorage.filter(activity => activity.tag === "outros" && activity.completed).length
  ]
};

// Inicializa o gráfico de atividades
function initActivityChart() {
  const ctx = document.getElementById("activityChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: activityData.labels,
      datasets: [{
        label: "Frequência de Atividade",
        data: activityData.data,
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#9c27b0", "#e91e63"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Exibe as estatísticas de atividades e tarefas
function displayActivityStats() {
  const statsContainer = document.getElementById("activityStats");

  // Limpar conteúdo anterior
  statsContainer.innerHTML = '';

  // Exibir streak (sequência de dias)
  const streakItem = document.createElement("li");
  streakItem.textContent = `Sequência de Dias Concluídos: ${streakFromLocalStorage} dias`;
  statsContainer.appendChild(streakItem);

  // Obter dados de tarefas e atividades concluídas por tipo
  const completedTasksByType = getCompletedTasksByType();

  // Exibir frequência de atividades e tarefas concluídas
  activityData.labels.forEach((activity, index) => {
    const frequency = activityData.data[index];
    const completedCount = completedTasksByType[activity.toLowerCase()];

    const listItem = document.createElement("li");
    listItem.textContent = `${activity}: ${frequency} tarefas concluídas (${completedCount} dias concluídos neste tipo de atividade)`;
    statsContainer.appendChild(listItem);
  });
}

// Exibe o histórico de atividades e tarefas
function displayCompetitionHistory() {
  const historyContainer = document.getElementById("competitionHistory");

  // Limpar conteúdo anterior
  historyContainer.innerHTML = '';

  // Exibir o histórico de atividades (agora incluindo atividades e tarefas)
  activitiesFromLocalStorage.forEach(activity => {
    const listItem = document.createElement("li");
    listItem.textContent = `Data: ${activity.date}, Atividade: ${activity.name}, Duração: ${formatTime(activity.duration)}`;
    historyContainer.appendChild(listItem);
  });

  tasksFromLocalStorage.forEach(task => {
    const listItem = document.createElement("li");
    listItem.textContent = `Tarefa: ${task.name} - Status: ${task.completed ? 'Concluída' : 'Não Concluída'}`;
    historyContainer.appendChild(listItem);
  });
}

// Inicializa a página
window.onload = function() {
  initActivityChart();  // Inicializa o gráfico
  displayActivityStats();  // Exibe as estatísticas
  displayCompetitionHistory();  // Exibe o histórico de atividades
};
