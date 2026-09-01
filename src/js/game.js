import { storage } from "../data/storage.js";
import { languagesDatabase, difficultyConfig } from "../data/database.js";
// Seleção dos elementos principais da tela de jogo.
const playerNameDisplay = document.getElementById("player-name-display");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameGrid = document.getElementById("game-grid");

// Elementos do modal de vitória e botões de ação.
const victoryModal = document.getElementById("victory-modal");
const modalPlayer = document.getElementById("modal-player");
const modalLevel = document.getElementById("modal-level");
const modalTime = document.getElementById("modal-time");
const btnRestart = document.getElementById("btn-restart");
const btnSidebarRestart = document.getElementById("btn-sidebar-restart");
const btnMenu = document.getElementById("btn-menu");

const { playerName, difficulty } = storage.getSession();

if (!playerName || !difficulty) {
  window.location.href = "home.html";
}

const currentConfig = difficultyConfig[difficulty] || difficultyConfig.facil;

let timerInterval = null;
let secondsElapsed = 0;
let matchesCount = 0;
let movesCount = 0;
let firstCard = null;
let secondCard = null;
let isLocked = false; // Bloqueia cliques enquanto valida a tentativa atual.

// Atualiza a área lateral com os dados do jogador e da dificuldade escolhida.
playerNameDisplay.textContent = playerName;
levelDisplay.textContent = currentConfig.name;
scoreDisplay.textContent = "0";

// Inicia o cronômetro do jogo assim que o tabuleiro for montado.
const startTimer = () => {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const seconds = String(secondsElapsed % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
};

// Algoritmo Fisher-Yates para embaralhar as cartas de forma justa
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Inicializa o Tabuleiro do Jogo
const initGame = () => {
  // Pega a quantidade exata de linguagens para o nível selecionado
  const selectedLanguages = languagesDatabase.slice(0, currentConfig.pairs);

  // Duplica cada linguagem para formar os pares
  const cardPairs = [...selectedLanguages, ...selectedLanguages];

  // Embaralha o array completo
  shuffleArray(cardPairs);

  gameGrid.innerHTML = "";

  // Adiciona uma classe no grid para ajudar a estilizar colunas via CSS de acordo com o nível
  gameGrid.className = `grid grid-${difficulty}`;

  // Cria os elementos HTML de cada carta dinamicamente
  cardPairs.forEach((lang) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", lang.name);

    card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="card-placeholder"></span>
                </div>
                <div class="card-back">
                    <i class="${lang.icon} card-icon"></i>
                    <h3 class="card-title">${lang.name}</h3>
                    <p class="card-desc">${lang.description}</p>
                </div>
            </div>
        `;

    card.addEventListener("click", flipCard);
    gameGrid.appendChild(card);
  });

  startTimer();
};

// Salva o resultado no ranking, atualizando o melhor tempo do jogador em cada nível.
const saveScoreToRanking = () => {
  const newRecord = {
    name: playerName,
    level: difficulty,
    timeStr: timerDisplay.textContent,
    timeSeconds: secondsElapsed,
  };

  storage.saveScore(newRecord);
};

// Comportamento de clique para virar a carta
function flipCard() {
  if (isLocked) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

// Valida se as duas cartas viradas são iguais
const checkForMatch = () => {
  movesCount++;
  scoreDisplay.textContent = String(movesCount);

  const isMatch =
    firstCard.getAttribute("data-name") ===
    secondCard.getAttribute("data-name");

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
};

// Se acertou o par
const disableCards = () => {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matchesCount++;

  resetBoard();

  // Verifica condição de vitória
  if (matchesCount === currentConfig.pairs) {
    clearInterval(timerInterval);
    saveScoreToRanking(); // <--- Função adicionada aqui!
    showVictoryModal();
  }
};

// Se errou o par (desvira após o tempo limite configurado para o nível)
const unflipCards = () => {
  isLocked = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, currentConfig.errorTime);
};

// Limpa as variáveis de seleção temporária
const resetBoard = () => {
  [firstCard, secondCard, isLocked] = [null, null, false];
};

// Exibe o modal de vitória com as estatísticas finais
const showVictoryModal = () => {
  modalPlayer.textContent = playerName;
  modalLevel.textContent = currentConfig.name;
  modalTime.textContent = timerDisplay.textContent;
  victoryModal.classList.remove("hidden");
};

// Ações dos botões do modal de vitória
btnRestart.addEventListener("click", () => {
  window.location.reload();
});

btnSidebarRestart.addEventListener("click", () => {
  window.location.reload();
});

btnMenu.addEventListener("click", () => {
  window.location.href = "home.html";
});

// Executa a inicialização ao carregar a página
initGame();
