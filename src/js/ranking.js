import { storage } from "../data/storage.js";
// Seleção dos elementos visuais da tela de ranking.
const filterButtons = document.querySelectorAll(".btn-filter");
const rankingBody = document.getElementById("ranking-body");
const noDataMsg = document.getElementById("no-data-msg");
const rankingTable = document.querySelector(".ranking-table");
const btnBack = document.getElementById("btn-back");
const btnClearRanking = document.getElementById("btn-clear-ranking");

// Limpa todo o histórico do ranking após confirmação do usuário.
const clearRanking = () => {
  const confirmed = window.confirm("Deseja limpar todos os dados do ranking?");
  if (!confirmed) return;

  storage.clearRanking(); // Chama do módulo
  renderRanking(
    document.querySelector(".btn-filter.active")?.dataset.level || "facil",
  );
};

// Renderiza somente os melhores tempos daquele nível, em ordem crescente de tempo.
const renderRanking = (level) => {
  const rankingDB = storage.getRanking();

  const filteredAndSorted = rankingDB
    .filter((record) => record.level === level)
    .sort((a, b) => a.timeSeconds - b.timeSeconds);

  // Limpa a tabela para evitar registros duplicados na renderização.
  rankingBody.innerHTML = "";

  // Exibe a estrutura correta quando não há dados para o nível atual.
  if (filteredAndSorted.length === 0) {
    rankingTable.style.display = "none";
    noDataMsg.classList.remove("hidden");
  } else {
    rankingTable.style.display = "table";
    noDataMsg.classList.add("hidden");

    // Gera dinamicamente cada linha da tabela com posição, nome e tempo.
    filteredAndSorted.forEach((record, index) => {
      const tr = document.createElement("tr");
      const positionLabel = `${index + 1}º`;

      tr.innerHTML = `
                <td>${positionLabel}</td>
                <td><strong>${record.name}</strong></td>
                <td>${record.timeStr}</td>
            `;
      rankingBody.appendChild(tr);
    });
  }
};

// Alterna entre os níveis e atualiza a tabela correspondente.
filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    const clickedButton = event.target;
    clickedButton.classList.add("active");

    const selectedLevel = clickedButton.getAttribute("data-level");
    renderRanking(selectedLevel);
  });
});

// Ações dos botões de controle da página.
btnClearRanking.addEventListener("click", clearRanking);

btnBack.addEventListener("click", () => {
  window.location.href = "home.html";
});

// Inicializa a página com o nível Fácil selecionado por padrão.
renderRanking("facil");
