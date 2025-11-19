// -------------------------------
// Temas e palavras
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


// -------------------------------
// Variáveis principais
// -------------------------------
let jogadores = 0;
let impostor = 0;
let palavraEscolhida = "";
let temaSelecionado = "";
let jogadorAtual = 1;
let votos = {};


// -------------------------------
// Inicialização do menu
// -------------------------------
const temaSelect = document.getElementById("temaSelect");
Object.keys(temasEPalavras).forEach(tema => {
    const op = document.createElement("option");
    op.value = tema;
    op.textContent = tema;
    temaSelect.appendChild(op);
});


// -------------------------------
// Navegação entre telas
// -------------------------------
function mostrar(tela) {
    document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
    document.getElementById(tela).classList.remove("hidden");
}


// -------------------------------
// Início do jogo
// -------------------------------
function iniciarJogo() {
    jogadores = Number(document.getElementById("qtdJogadores").value);
    temaSelecionado = temaSelect.value;

    palavraEscolhida = pegarPalavraAleatoria(temaSelecionado);
    impostor = Math.floor(Math.random() * jogadores) + 1;

    jogadorAtual = 1;
    votos = {};

    mostrar("telaPalavra");
    atualizarPalavra();
}

function pegarPalavraAleatoria(tema) {
    const lista = temasEPalavras[tema];
    return lista[Math.floor(Math.random() * lista.length)];
}


// -------------------------------
// Exibição das palavras
// -------------------------------
function atualizarPalavra() {
    const texto = document.getElementById("textoPalavra");

    if (jogadorAtual === impostor) {
        texto.textContent = "Você é o IMPOSTOR!";
    } else {
        texto.textContent = palavraEscolhida;
    }
}

function proximoJogador() {
    jogadorAtual++;

    if (jogadorAtual > jogadores) {
        montarTelaVotacao();
        mostrar("telaVotacao");
        return;
    }

    atualizarPalavra();
}


// -------------------------------
// Votação
// -------------------------------
function montarTelaVotacao() {
    const div = document.getElementById("votacaoArea");
    div.innerHTML = "";

    for (let i = 1; i <= jogadores; i++) {
        const btn = document.createElement("button");
        btn.textContent = `Jogador ${i}`;
        btn.onclick = () => registrarVoto(i, btn);
        div.appendChild(btn);
    }
}

function registrarVoto(jogador, botao) {
    if (votos[jogador]) return;

    votos[jogador] = true;
    botao.style.background = "#4CAF50";
    botao.style.pointerEvents = "none";
}

function finalizarVotacao() {
    let maisVotado = null;
    let maiorQtde = 0;

    const contagem = {};

    for (let j in votos) {
        contagem[j] = (contagem[j] || 0) + 1;
        if (contagem[j] > maiorQtde) {
            maiorQtde = contagem[j];
            maisVotado = j;
        }
    }

    const texto = document.getElementById("resultadoTexto");

    if (Number(maisVotado) === impostor) {
        texto.textContent = `O impostor era o Jogador ${impostor}. Vocês venceram!`;
    } else {
        texto.textContent = `O impostor era o Jogador ${impostor}. Ele enganou todo mundo.`;
    }

    mostrar("telaResultado");
}


// -------------------------------
// Reinício
// -------------------------------
function reiniciarJogo() {
    mostrar("telaInicio");
}
