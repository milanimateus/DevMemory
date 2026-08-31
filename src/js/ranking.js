// Seleção dos elementos do DOM
const filterButtons = document.querySelectorAll(".btn-filter");
const rankingBody = document.getElementById("ranking-body");
const noDataMsg = document.getElementById("no-data-msg");
const rankingTable = document.querySelector(".ranking-table");
const btnBack = document.getElementById("btn-back");
const btnClearRanking = document.getElementById("btn-clear-ranking");

// Busca os dados do ranking no cache do navegador
const getRankingData = () => {
  return JSON.parse(localStorage.getItem("devmemory_ranking")) || [];
};

const clearRanking = () => {
  const confirmed = window.confirm("Deseja limpar todos os dados do ranking?");

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("devmemory_ranking");
  renderRanking(document.querySelector(".btn-filter.active")?.dataset.level || "facil");
};

// Renderiza a tabela com base no nível de dificuldade selecionado
const renderRanking = (level) => {
  const rankingDB = getRankingData();

  // Filtra apenas as partidas do nível escolhido e ordena por tempo (crescente)
  const filteredAndSorted = rankingDB
    .filter((record) => record.level === level)
    .sort((a, b) => a.timeSeconds - b.timeSeconds);

  // Limpa a tabela antes de injetar os novos dados
  rankingBody.innerHTML = "";

  // Lida com a exibição caso não haja recordes
  if (filteredAndSorted.length === 0) {
    rankingTable.style.display = "none"; // Oculta a tabela
    noDataMsg.classList.remove("hidden"); // Exibe a mensagem de aviso
  } else {
    rankingTable.style.display = "table"; // Mostra a tabela
    noDataMsg.classList.add("hidden"); // Oculta a mensagem de aviso

    // Cria dinamicamente as linhas (<tr>) para cada recorde
    filteredAndSorted.forEach((record, index) => {
      const tr = document.createElement("tr");

      // Lógica para adicionar medalhas aos 3 primeiros colocados
      let positionLabel = `${index + 1}º`;

      tr.innerHTML = `
                <td>${positionLabel}</td>
                <td><strong>${record.name}</strong></td>
                <td>${record.timeStr}</td>
            `;
      rankingBody.appendChild(tr);
    });
  }
};

// Adiciona o evento de clique nos botões de filtro
filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // Remove a classe 'active' de todos os botões
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Adiciona 'active' apenas no botão clicado
    const clickedButton = event.target;
    clickedButton.classList.add("active");

    // Pega o nível do atributo 'data-level' e atualiza a tabela
    const selectedLevel = clickedButton.getAttribute("data-level");
    renderRanking(selectedLevel);
  });
});

// Ação do botão de limpar ranking
btnClearRanking.addEventListener("click", clearRanking);

// Ação do botão de voltar
btnBack.addEventListener("click", () => {
  window.location.href = "home.html";
});

// Inicialização: Ao abrir a página, renderiza o ranking da dificuldade "Fácil"
renderRanking("facil");
