import { storage } from "../data/storage.js";
// Seleção dos elementos da tela inicial do jogo.
const inputName = document.getElementById("player-name");
const btnStart = document.getElementById("btn-start");
const formLogin = document.getElementById("login-form");
const difficultyButtons = document.querySelectorAll(".btn-diff");

// Guarda a dificuldade escolhida pelo usuário para ser reutilizada na página do jogo.
let selectedDifficulty = "";

// Verifica se o formulário está válido antes de liberar o botão de iniciar.
const validateForm = () => {
  const nameValue = inputName.value.trim();

  // O nome precisa ter ao menos 3 caracteres e uma dificuldade precisa estar ativa.
  if (nameValue.length >= 3 && selectedDifficulty !== "") {
    btnStart.removeAttribute("disabled");
  } else {
    btnStart.setAttribute("disabled", "true");
  }
};

// Atualiza o estado visual dos botões de nível e registra a dificuldade selecionada.
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove a seleção anterior para garantir que apenas um nível fique ativo.
    difficultyButtons.forEach((btn) => btn.classList.remove("active"));

    // Marca o botão clicado como selecionado.
    button.classList.add("active");

    // Pega o valor informado no atributo data-level para mapear a dificuldade.
    selectedDifficulty = button.getAttribute("data-level");

    // Revalida o formulário para liberar ou bloquear o início do jogo.
    validateForm();
  });
});

// Valida novamente sempre que o jogador digitar no campo de nome.
inputName.addEventListener("input", validateForm);

const startGame = (event) => {
  event.preventDefault();
  const playerName = inputName.value.trim();

  // Usando a API limpa que você acabou de criar
  storage.saveSession(playerName, selectedDifficulty);

  window.location.href = "game.html";
};

formLogin.addEventListener("submit", startGame);
