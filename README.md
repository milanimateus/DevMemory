# DevMemory

Projeto da Atividade Prática 1 da disciplina GAC116 - Programação Web da UFLA (Universidade Federal de Lavras).

O DevMemory é um jogo da memória responsivo, desenvolvido com HTML5, CSS3 e JavaScript puro, com foco em usabilidade, experiência de jogo e persistência de dados no navegador.

## 1. 🎯 Objetivo do jogo

O objetivo principal do jogo é encontrar todos os pares de cartas no menor tempo possível e com o menor número de tentativas, acumulando pontos ao longo da partida. Ao finalizar a rodada, o desempenho do jogador é registrado em um ranking, incentivando a competitividade e o progresso contínuo.

## 2. 🕹️ Regras do jogo

1. O jogador inicia uma partida e visualiza o tabuleiro com cartas viradas para baixo.
2. Ao clicar em duas cartas, elas são viradas para revelar seus desenhos ou símbolos.
3. Se as duas cartas forem iguais, o jogador acumula pontos e mantém as cartas viradas na mesa.
4. Se as duas cartas forem diferentes, elas voltam a ficar viradas para baixo após um curto intervalo.
5. O jogo continua até que todas as combinações tenham sido encontradas.
6. Quando todas os pares forem acertados, a partida é considerada concluída e o resultado final é exibido.
7. O desempenho do jogador é calculado com base no tempo e na quantidade de tentativas, contribuindo para a classificação no ranking.

## 3. 🛠️ Tecnologias Utilizadas

- HTML5
  - Estruturação das páginas e componentes do jogo.
  - Organização do conteúdo em páginas separadas para home, jogo e ranking.

- CSS3
  - Desenvolvimento do layout responsivo para mobile, tablet e desktop.
  - Uso de CSS Grid e Flexbox para organização das telas e do tabuleiro.
  - Aplicação de animações 3D de flip nas cartas para melhorar a experiência visual do jogo.
  - Ajustes de estilo para garantir uma interface moderna e acessível.

- JavaScript (Vanilla)
  - Manipulação do DOM para renderização dinâmica do jogo.
  - Controle de estado da aplicação, como cartas viradas, tempo, pontuação e vitórias.
  - Persistência de dados local com armazenamento no navegador para o ranking e informações do jogador.
  - Lógica da mecânica do jogo, incluindo embaralhamento, comparação de cartas e condição de vitória.

## 4. ⚙️ Instruções de Instalação

1. Clone este repositório em sua máquina:

   ```bash
   git clone https://github.com/seu-usuario/DevMemory.git
   ```

2. Acesse a pasta do projeto.
3. Abra o arquivo `src/index.html` diretamente no navegador.
4. O jogo funciona sem a necessidade de build, instaladores ou dependências externas.

> O projeto foi desenvolvido para ser executado de forma simples e leve, sem frameworks ou processos de compilação.

## 5. 🌐 Link da Publicação

- https://milanimateus.github.io/DevMemory/src/pages/home.html

## 6. 📄 Licença

Este projeto utiliza a licença MIT. A licença MIT é uma licença permissiva que permite o uso, cópia, modificação e distribuição do software, desde que a atribuição de copyright e a licença original sejam mantidas.

## 7. 📚 Informações Acadêmicas

```json
{
  "nome": "DevMemory",
  "descricao": "Jogo da memória interativo com sistema de ranking, desenvolvido com HTML, CSS e JS puros para a disciplina de Programação Web.",
  "autores": "Mateus Milani Rodrigues",
  "turma": "14A"
}
```

---

Desenvolvido como parte da Atividade Prática 1 da disciplina GAC116 - Programação Web da UFLA.
