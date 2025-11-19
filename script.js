/* TEMAS */
const temas = {
  locais: ["Túnel", "Praia", "Shopping", "Escola", "Hospital", "Restaurante", "Estádio", "Biblioteca", "Aeroporto"],
  objetos: ["Celular", "Chave", "Bola", "Livro", "Relógio", "Faca", "Cadeira", "Computador", "Copo"],
  personagens: ["Mickey", "Goku", "Naruto", "Bob Esponja", "Homem-Aranha", "Scooby-Doo", "Pikachu", "Ben 10"],
  profissoes: ["Médico", "Professor", "Engenheiro", "Advogado", "Piloto", "Bombeiro", "Padeiro", "Cantor", "Policial"],
  animais: ["Cachorro", "Gato", "Elefante", "Tubarão", "Leão", "Macaco", "Coruja", "Cavalo", "Cobra"]
};

/* ESTADO CENTRAL */
const estado = {
  jogadores: [],
  palavra: "",
  impostor: "",
  indice: 0,
  fase: "nome",
  votos: {},
  tema: ""
};

/* TROCAR TELAS */
function trocarTela(atual, proxima, fundo = "") {
  document.body.className = fundo;
  document.getElementById(atual).classList.add("hidden");
  document.getElementById(proxima).classList.remove("hidden");
}

/* NOMES AUTO */
function gerarNomes() {
  const qtd = parseInt(document.getElementById("qtd").value);
  document.getElementById("nomes").value =
    Array.from({ length: qtd }, (_, i) => `Jogador ${i + 1}`).join("\n");
}

/* COLETAR JOGADORES */
function selecionarTema() {
  const lista = document.getElementById("nomes").value.trim();
  if (!lista) return alert("Digite ou gere os nomes!");

  estado.jogadores = lista.split("\n").map(n => n.trim());
  trocarTela("menu", "temaSelecao");
}

/* COMEÇAR JOGO */
function iniciarJogo() {
  estado.tema = document.getElementById("temaEscolhido").value;
  const palavras = temas[estado.tema];

  estado.palavra = palavras[Math.floor(Math.random() * palavras.length)];
  estado.impostor = estado.jogadores[Math.floor(Math.random() * estado.jogadores.length)];
  estado.indice = 0;
  estado.fase = "nome";

  trocarTela("temaSelecao", "jogo");
  atualizarJogo();
}

/* MOSTRAR INFO */
function atualizarJogo() {
  const nome = estado.jogadores[estado.indice];
  document.getElementById("nomeAtual").textContent = nome;

  if (estado.fase === "nome") {
    document.getElementById("mensagem").textContent = `Passe o celular para ${nome}`;
  } else {
    document.getElementById("mensagem").textContent =
      nome === estado.impostor ? "Você é o IMPOSTOR! 🤫" : "Palavra: " + estado.palavra;
  }
}

/* CONFIRMAR */
function confirmar() {
  if (estado.fase === "nome") {
    estado.fase = "palavra";
  } else {
    estado.indice++;
    estado.fase = "nome";

    if (estado.indice >= estado.jogadores.length) {
      trocarTela("jogo", "transicao", "transicaoTela");
      return;
    }
  }
  atualizarJogo();
}

/* VOTAÇÃO */
function iniciarVotacao() {
  estado.votos = {};
  estado.indice = 0;

  trocarTela("transicao", "votacao", "votacaoTela");
  mostrarVotador();
}

function mostrarVotador() {
  const nome = estado.jogadores[estado.indice];
  document.getElementById("votador").textContent = `${nome}, é a sua vez!`;

  const opcoes = document.getElementById("opcoesVoto");
  opcoes.innerHTML = "";

  estado.jogadores.forEach(j => {
    const btn = document.createElement("button");
    btn.textContent = j;

    if (j === nome) {
      btn.classList.add("disabled");
    } else {
      btn.onclick = () => votar(j);
    }

    opcoes.appendChild(btn);
  });
}

function votar(alvo) {
  estado.votos[alvo] = (estado.votos[alvo] || 0) + 1;

  estado.indice++;
  if (estado.indice >= estado.jogadores.length) {
    mostrarResultado();
  } else {
    mostrarVotador();
  }
}

/* RESULTADO */
function mostrarResultado() {
  trocarTela("votacao", "resultado");

  const maisVotado = Object.keys(estado.votos).reduce((a, b) =>
    estado.votos[a] > estado.votos[b] ? a : b
  );

  let texto = `O mais votado foi ${maisVotado} com ${estado.votos[maisVotado]} voto(s).\n`;
  texto += maisVotado === estado.impostor
    ? "O grupo venceu! 🎉"
    : `O impostor (${estado.impostor}) venceu! 😈`;

  document.getElementById("resultadoTexto").textContent = texto;
}

/* REINICIAR */
function reiniciar() {
  trocarTela("resultado", "temaSelecao");
}

function voltarMenu() {
  document.getElementById("nomes").value = "";
  trocarTela("resultado", "menu");
}
