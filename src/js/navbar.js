// js/navbar.js
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    // Alterna a classe 'active' para animar o ícone e mostrar o menu
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Fecha o menu automaticamente se clicar em um link (útil para navegação)
  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}
