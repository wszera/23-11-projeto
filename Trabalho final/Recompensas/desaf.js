// Carregar dados salvos do localStorage
window.onload = function() {
    // Carregar usuários salvos, se houver
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Inicializa os usuários com 0 pontos se não houver dados salvos
        users = [
            { name: 'João', points: 0, friends: [] },
            { name: 'Maria', points: 0, friends: [] },
            { name: 'Carlos', points: 0, friends: [] }
        ];
    }

    // Carregar desafios salvos, se houver
    const savedChallenges = localStorage.getItem('challenges');
    if (savedChallenges) {
        challenges = JSON.parse(savedChallenges);
    }

    updateLeaderboard();
    renderChallenges();
};

// Dados de exemplo
let challenges = [];
let users = [
    { name: 'João', points: 0, friends: [] }, // Inicia com 0 pontos
    { name: 'Maria', points: 0, friends: [] },
    { name: 'Carlos', points: 0, friends: [] }
];

// Função auxiliar para exibir uma notificação (Sucesso ou Erro)
function showNotification(icon, title, text) {
    Swal.fire({ icon, title, text });
}

// Função para renderizar os desafios
function renderChallenges() {
    const challengesList = document.getElementById('challengesList');
    challengesList.innerHTML = ''; // Limpar lista antes de renderizar

    challenges.forEach((challenge, index) => {
        const challengeDiv = document.createElement('div');
        challengeDiv.classList.add('challenge-item');
        challengeDiv.innerHTML = `
            <strong>Desafio ${index + 1}:</strong> ${challenge.name} (${challenge.days} dias) 
            <span class="challenge-type">${challenge.type}</span>
            ${challenge.completedDays === challenge.days 
                ? '<span class="completed">Concluído!</span>' 
                : `<button onclick="startChallenge(${index})" class="btn">Começar</button>` 
            }
        `;
        challengesList.appendChild(challengeDiv);
    });
}

// Função para criar um novo desafio
document.getElementById('challengeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('challengeName').value;
    const days = parseInt(document.getElementById('challengeDays').value);
    const type = document.getElementById('challengeType').value;

    if (name && days > 0 && type) {
        challenges.push({ name, days, type, completedDays: 0, completed: false });
        renderChallenges();
        showNotification('success', 'Desafio Criado!', `Agora você pode começar a manter a sua consistência no desafio de ${type.toLowerCase()}!`);

        // Salvar desafios no localStorage
        localStorage.setItem('challenges', JSON.stringify(challenges));
    } else {
        showNotification('error', 'Erro', 'Preencha todos os campos corretamente!');
    }
});

// Função para começar um desafio
function startChallenge(index) {
    const challenge = challenges[index];
    challenge.completedDays++;

    if (challenge.completedDays === challenge.days) {
        challenge.completed = true;
        showNotification('success', 'Parabéns!', `Você completou o desafio de ${challenge.type}: ${challenge.name}`);
        addReward('Medalha de Ouro', 50);
    } else {
        showNotification('info', 'Continue!', `Você completou ${challenge.completedDays} de ${challenge.days} dias no desafio de ${challenge.type}.`);
    }

    // Salvar desafios no localStorage
    localStorage.setItem('challenges', JSON.stringify(challenges));

    renderChallenges(); // Re-renderiza os desafios para mostrar o status atualizado
}

// Função para adicionar recompensas
function addReward(name, points) {
    const rewardsList = document.getElementById('rewardsList');
    const rewardDiv = document.createElement('div');
    rewardDiv.innerHTML = `${name} - +${points} pontos`;
    rewardsList.appendChild(rewardDiv);

    // Atualizar pontos do usuário
    users[0].points += points;

    // Salvar os usuários no localStorage
    localStorage.setItem('users', JSON.stringify(users));

    updateLeaderboard();
}

// Função para atualizar o Quadro de Líderes
function updateLeaderboard() {
    const currentUser = users[0];

    const leaderboard = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
    leaderboard.innerHTML = '';

    // Filtra os amigos para exibir no ranking
    const friendsList = users.filter(u => currentUser.friends.includes(u.name) || u.name === currentUser.name);

    friendsList.sort((a, b) => b.points - a.points);

    friendsList.forEach((user, index) => {
        const row = leaderboard.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.points}</td>
        `;
    });
}

// Função para copiar o código de convite
document.getElementById('inviteButton').addEventListener('click', async function() {
    const inviteCode = document.getElementById('inviteCode');
    try {
        await navigator.clipboard.writeText(inviteCode.value);
        showNotification('success', 'Código copiado!', 'Agora você pode compartilhar esse código com seus amigos para que eles entrem no ranking!');
    } catch (err) {
        showNotification('error', 'Erro ao copiar', 'Houve um erro ao tentar copiar o código. Tente novamente.');
    }
});

// Função para adicionar amigo ao ranking
document.getElementById('addFriendButton').addEventListener('click', function() {
    const inviteCodeInput = document.getElementById('inviteCodeInput').value.trim();
    acceptInvite(inviteCodeInput);
});

// Função para adicionar amigo ao ranking após o convite
function acceptInvite(inviteCode) {
    const currentUser = users[0];

    const invitedUser = users.find(u => u.name === inviteCode);
    if (invitedUser && !currentUser.friends.includes(inviteCode)) {
        currentUser.friends.push(inviteCode);
        showNotification('success', 'Convite Aceito!', `${inviteCode} agora é seu amigo!`);
        updateLeaderboard();

        // Salvar os dados atualizados no localStorage
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        showNotification('error', 'Erro', 'Convite inválido ou já aceito.');
    }
}

function goBack() {
    window.history.back();
}


// Inicializar a aplicação
updateLeaderboard();
renderChallenges();
