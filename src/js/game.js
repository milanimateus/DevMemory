// Seleção dos elementos do DOM
const playerNameDisplay = document.getElementById("player-name-display");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameGrid = document.getElementById("game-grid");

// Elementos do Modal de Vitória
const victoryModal = document.getElementById("victory-modal");
const modalPlayer = document.getElementById("modal-player");
const modalLevel = document.getElementById("modal-level");
const modalTime = document.getElementById("modal-time");
const btnRestart = document.getElementById("btn-restart");
const btnSidebarRestart = document.getElementById("btn-sidebar-restart");
const btnMenu = document.getElementById("btn-menu");

// Recupera dados salvos na Home via localStorage
const playerName = localStorage.getItem("devmemory_player");
const difficulty = localStorage.getItem("devmemory_difficulty");

// Se o usuário acessar direto o game.html sem passar pela home, redireciona de volta
if (!playerName || !difficulty) {
  window.location.href = "home.html";
}

// Configurações de pares e tempo de exibição do erro conforme o nível
const difficultyConfig = {
  facil: { pairs: 4, errorTime: 1200, name: "Fácil" },
  medio: { pairs: 6, errorTime: 900, name: "Médio" },
  dificil: { pairs: 8, errorTime: 600, name: "Difícil" },
  expert: { pairs: 12, errorTime: 350, name: "Expert" },
};

const currentConfig = difficultyConfig[difficulty] || difficultyConfig.facil;

// Banco de dados contendo Logo (Devicon), Nome e Descrição Funcional
const languagesDatabase = [
  {
    name: "JavaScript",
    description:
      "Essencial para dar dinamismo e interatividade às páginas web.",
    icon: "devicon-javascript-plain colored",
  },
  {
    name: "Python",
    description:
      "Focada em legibilidade, muito usada em IA, dados e automação.",
    icon: "devicon-python-plain colored",
  },
  {
    name: "HTML5",
    description: "Linguagem de marcação para estruturar o conteúdo da web.",
    icon: "devicon-html5-plain colored",
  },
  {
    name: "CSS3",
    description: "Responsável pelo design, layout e estilização visual.",
    icon: "devicon-css3-plain colored",
  },
  {
    name: "Java",
    description:
      "Orientada a objetos, robusta e de ampla execução corporativa.",
    icon: "devicon-java-plain colored",
  },
  {
    name: "TypeScript",
    description: "Superset do JavaScript que adiciona tipagem estática.",
    icon: "devicon-typescript-plain colored",
  },
  {
    name: "PHP",
    description: "Linguagem de script voltada para o desenvolvimento backend.",
    icon: "devicon-php-plain colored",
  },
  {
    name: "C++",
    description: "Extensão de C, focada em alto desempenho e sistemas.",
    icon: "devicon-cplusplus-plain colored",
  },
  {
    name: "Ruby",
    description: "Dinâmica e expressiva, famosa pelo framework Ruby on Rails.",
    icon: "devicon-ruby-plain colored",
  },
  {
    name: "Go",
    description: "Criada pelo Google para alta concorrência e velocidade.",
    icon: "devicon-go-original-wordmark colored",
  },
  {
    name: "Rust",
    description: "Focada em segurança de memória e alta performance.",
    icon: "devicon-rust-plain colored",
  },
  {
    name: "Swift",
    description: "Desenvolvida pela Apple para ecossistemas iOS e macOS.",
    icon: "devicon-swift-plain colored",
  },
];

let timerInterval = null;
let secondsElapsed = 0;
let matchesCount = 0;
let movesCount = 0;
let firstCard = null;
let secondCard = null;
let isLocked = false; // Bloqueia cliques enquanto valida o par

// Renderiza dados iniciais no painel superior
playerNameDisplay.textContent = playerName;
levelDisplay.textContent = currentConfig.name;
scoreDisplay.textContent = "0";

// Função do Cronômetro
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

// Salva o resultado no Ranking do localStorage
const saveScoreToRanking = () => {
  const newRecord = {
    name: playerName,
    level: difficulty, // 'facil', 'medio', 'dificil', 'expert'
    timeStr: timerDisplay.textContent, // Formato "00:00" para exibir visualmente
    timeSeconds: secondsElapsed, // Formato numérico para facilitar a ordenação no ranking
  };

  // Busca o ranking salvo anteriormente ou cria um array vazio se for a primeira vez
  const rankingDB = JSON.parse(localStorage.getItem("devmemory_ranking")) || [];

  // Adiciona o novo recorde ao array
  rankingDB.push(newRecord);

  // Salva o array atualizado de volta no navegador (precisa ser convertido para string)
  localStorage.setItem("devmemory_ranking", JSON.stringify(rankingDB));
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
