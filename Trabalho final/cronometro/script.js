let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isPaused = false;
const timeDisplay = document.getElementById('time-display');
const historyList = document.getElementById('history-list');

// Função para formatar o tempo (HH:MM:SS)
function formatTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para iniciar o cronômetro
function startTimer() {
  if (!isPaused) {
    startTime = Date.now() - elapsedTime;
  } else {
    startTime = Date.now() - elapsedTime;
    isPaused = false;
  }

  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
  }, 1000);
}

// Função para pausar o cronômetro
function pauseTimer() {
  clearInterval(timerInterval);
  isPaused = true;
}

// Função para zerar o cronômetro
function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  isPaused = false;
  timeDisplay.textContent = '00:00:00';
}

// Função para salvar a atividade no histórico
function saveActivity() {
  const activityInput = document.getElementById('activity');
  const activity = activityInput.value.trim();
  
  if (activity && elapsedTime > 0) {
    // Criação de um novo item de histórico com a atividade e o tempo
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${activity}</span> <span>Tempo: ${formatTime(elapsedTime)}</span>`;
    historyList.appendChild(listItem);

    // Limpar o campo de entrada de atividade após salvar
    activityInput.value = ''; 
  }
}

// Função para salvar o histórico em um arquivo (opcional)
function saveHistoryToFile() {
  const historyItems = [];
  const listItems = historyList.querySelectorAll('li');

  listItems.forEach(item => {
    const activity = item.querySelector('span').textContent;
    const time = item.querySelector('span + span').textContent;
    historyItems.push({ activity, time });
  });

  // Converter o histórico em formato JSON e gerar o arquivo
  const blob = new Blob([JSON.stringify(historyItems, null, 2)], { type: 'application/json' });
  saveAs(blob, 'historico_atividades.json');
}
