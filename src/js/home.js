// Seleção dos elementos do DOM
const inputName = document.getElementById("player-name");
const btnStart = document.getElementById("btn-start");
const formLogin = document.getElementById("login-form");
const difficultyButtons = document.querySelectorAll(".btn-diff"); // Seleciona todos os botões de dificuldade

let selectedDifficulty = ""; // Variável para armazenar o nível selecionado

// Função para validar se o formulário está preenchido corretamente
const validateForm = () => {
  const nameValue = inputName.value.trim();

  // Habilita o botão se o nome tiver 2+ letras e um nível estiver selecionado
  if (nameValue.length >= 2 && selectedDifficulty !== "") {
    btnStart.removeAttribute("disabled");
  } else {
    btnStart.setAttribute("disabled", "true");
  }
};

// Gerencia o clique nos botões de dificuldade
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove a classe 'active' de todos os botões para "limpar" a seleção anterior
    difficultyButtons.forEach((btn) => btn.classList.remove("active"));

    // Adiciona a classe 'active' apenas no botão que foi clicado
    button.classList.add("active");

    // Salva a dificuldade escolhida pegando o valor do atributo data-level
    selectedDifficulty = button.getAttribute("data-level");

    // Valida o formulário para checar se já pode liberar o botão de iniciar
    validateForm();
  });
});

// Checa a validação sempre que o usuário digitar no nome
inputName.addEventListener("input", validateForm);

// Função executada ao enviar o formulário
const startGame = (event) => {
  event.preventDefault();

  const playerName = inputName.value.trim();

  // Salva os dados no cache do navegador
  localStorage.setItem("devmemory_player", playerName);
  localStorage.setItem("devmemory_difficulty", selectedDifficulty);

  // Redireciona para a página do jogo
  window.location.href = "game.html";
};

// Intercepta o envio do formulário
formLogin.addEventListener("submit", startGame);
