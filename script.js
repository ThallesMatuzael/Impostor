// -------------------------------
// Temas e Palavras
// -------------------------------
const temasEPalavras = {
    "Comidas": [
        "Pizza", "Hambúrguer", "Coxinha", "Sushi", "Strogonoff",
        "Lasanha", "Tapioca", "Açaí", "Feijoada", "Brigadeiro",
        "Cuscuz", "Bolo de Cenoura", "Arroz Carreteiro", "Baião de Dois"
    ],

    "Animais": [
        "Cachorro", "Gato", "Elefante", "Jacaré", "Lobo",
        "Tartaruga", "Macaco", "Girafa", "Tubarão", "Falcão",
        "Capivara", "Pavão", "Lhama", "Coala"
    ],

    "Objetos": [
        "Cadeira", "Controle", "Chave", "Computador", "Garrafa",
        "Lanterna", "Relógio", "Escova", "Fone de Ouvido", "Bicicleta",
        "Lápis", "Carregador", "Ventilador", "Panela"
    ],

    "Lugares": [
        "Praia", "Shopping", "Escola", "Igreja", "Cinema",
        "Parque", "Farmácia", "Supermercado", "Aeroporto", "Estádio",
        "Museu", "Zoológico", "Restaurante", "Hospital"
    ],

    "Famosos": [
        "Oruam", "Vini Jr", "Virgínia Fonseca",
        "Lula", "Bolsonaro", "Alexandre de Moraes",
        "Neymar", "Anitta", "Gusttavo Lima",
        "Whindersson Nunes", "Luísa Sonza", "Felipe Neto",
        "Johnny Depp", "Zendaya", "The Rock",
        "Taylor Swift", "Messi", "Cristiano Ronaldo"
    ]
};


// ----------------------------------------
// Variáveis de Jogo
// ----------------------------------------
let jogadores = 0;
let listaJogadores = [];
let impostor = 0;
let palavraEscolhida = "";
let temaSelecionado = "";
let jogadorAtual = 0;
let votos = {};


// ----------------------------------------
// Preencher temaSelect
// ----------------------------------------
const temaSelect = document.getElementById("temaSelect");

Object.keys(temasEPalavras).forEach(tema => {
    let op = document.createElement("option");
    op.value = tema;
    op.textContent = tema;
    temaSelect.appendChild(op);
});

// deixa o primeiro tema selecionado automaticamente
temaSelect.selectedIndex = 0;


// ----------------------------------------
// Sistema de Troca de Telas
// ----------------------------------------
function mostrar(id) {
    document.querySelectorAll(".container").forEach(t => t.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}


// ----------------------------------------
// Tela 2 — Inserção de Nomes
// ----------------------------------------
function irParaNomes() {
    jogadores = Number(document.getElementById("qtdJogadores").value);
    temaSelecionado = temaSelect.value;

    if (!temaSelecionado) {
        alert("Escolha um tema antes de continuar!");
        return;
    }

    if (jogadores < 3) {
        alert("Coloque pelo menos 3 jogadores pra brincadeira render.");
        return;
    }

    const lista = document.getElementById("listaNomes");
    lista.innerHTML = "";
    listaJogadores = [];

    for (let i = 1; i <= jogadores; i++) {
        const input = document.createElement("input");
        input.placeholder = `Nome do Jogador ${i}`;
        input.id = `jogador${i}`;
        lista.appendChild(input);
    }

    mostrar("telaNomes");
}


// ----------------------------------------
// Iniciar o Jogo
// ----------------------------------------
function iniciarJogo() {
    listaJogadores = [];

    for (let i = 1; i <= jogadores; i++) {
        const nome = document.getElementById(`jogador${i}`).value.trim();
        listaJogadores.push(nome || `Jogador ${i}`);
    }

    palavraEscolhida = pegarPalavraAleatoria(temaSelecionado);
    impostor = Math.floor(Math.random() * jogadores);

    jogadorAtual = 0;
    votos = {};

    atualizarPalavra();
    mostrar("telaPalavra");
}

function pegarPalavraAleatoria(tema) {
    const lista = temasEPalavras[tema];
    return lista[Math.floor(Math.random() * lista.length)];
}


// ----------------------------------------
// Mostrar palavra / impostor
// ----------------------------------------
function atualizarPalavra() {
    document.getElementById("textoJogador").textContent =
        `Agora é: ${listaJogadores[jogadorAtual]}`;

    if (jogadorAtual === impostor) {
        document.getElementById("textoPalavra").textContent = "VOCÊ É O IMPOSTOR!";
    } else {
        document.getElementById("textoPalavra").textContent = palavraEscolhida;
    }
}

function proximoJogador() {
    jogadorAtual++;

    if (jogadorAtual >= jogadores) {
        montarVotacao();
        mostrar("telaVotacao");
        return;
    }

    atualizarPalavra();
}


// ----------------------------------------
// Votação
// ----------------------------------------
function montarVotacao() {
    const area = document.getElementById("votacaoArea");
    area.innerHTML = "";

    for (let i = 0; i < jogadores; i++) {
        const btn = document.createElement("button");
        btn.textContent = listaJogadores[i];

        btn.onclick = () => {
            if (votos["jaVotou"]) {
                alert("Calma, jovem... só 1 voto por jogador.");
                return;
            }

            votos["jaVotou"] = true; // cada pessoa só vota uma vez
            votos[i] = (votos[i] || 0) + 1;

            btn.style.background = "#4CAF50";
            btn.style.pointerEvents = "none";
        };

        area.appendChild(btn);
    }
}

function finalizarVotacao() {
    let vencedor = null;
    let maior = 0;

    for (let jogador in votos) {
        if (jogador === "jaVotou") continue;
        if (votos[jogador] > maior) {
            maior = votos[jogador];
            vencedor = Number(jogador);
        }
    }

    const resultado = document.getElementById("resultadoTexto");

    if (vencedor === impostor) {
        resultado.textContent =
            `${listaJogadores[impostor]} era o IMPÓSTOR! Mandaram bem!`;
    } else {
        resultado.textContent =
            `${listaJogadores[impostor]} era o IMPOSTOR... e enganou geral.`;
    }

    mostrar("telaResultado");
}


// ----------------------------------------
// Reiniciar
// ----------------------------------------
function reiniciarJogo() {
    mostrar("telaInicio");
}
