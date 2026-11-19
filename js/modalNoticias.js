
const caminhoJSON = "../dados/blogs.json";

let noticiasCarregadas = null;

// ========================================
// CARREGAMENTO DO JSON
// ========================================

async function carregarNoticias() {
    if (!noticiasCarregadas) {
        noticiasCarregadas = fetch(caminhoJSON)
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error("Erro ao carregar dados/blogs.json");
                }

                return resposta.json();
            })
            .catch(erro => {
                noticiasCarregadas = null;
                throw erro;
            });
    }

    return noticiasCarregadas;
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined && texto !== null) {
        elemento.textContent = texto;
    }

    return elemento;
}

function obterImagem(noticia) {
    return noticia.imagemCapa || noticia.imagem || "";
}

function obterLink(noticia) {
    return `blogIndividual.html?id=${encodeURIComponent(noticia.id)}`;
}

// ========================================
// CARD DESTAQUE DA HOME
// ========================================

function criarCardDestaque(noticia) {
    const card = criarElemento("a", "card-destaque");

    card.href = obterLink(noticia);
    card.dataset.noticiaId = noticia.id;

    const areaImagem = criarElemento("div", "card-destaque-imagem");

    const imagem = criarElemento("img");
    imagem.src = obterImagem(noticia);
    imagem.alt = noticia.alt || noticia.titulo;

    const badge = criarElemento(
        "span",
        "badge-destaque",
        "Destaque"
    );

    areaImagem.append(imagem, badge);

    const corpo = criarElemento("div", "card-destaque-corpo");

    const data = criarElemento(
        "span",
        "card-data",
        noticia.data
    );

    const titulo = criarElemento(
        "h3",
        "card-destaque-titulo",
        noticia.titulo
    );

    const resumo = criarElemento(
        "p",
        "card-destaque-resumo",
        noticia.resumo
    );

    const acao = criarElemento("span", "card-link-acao");

    acao.append(document.createTextNode("Leia a matéria "));

    const icone = document.createElement("i");
    icone.dataset.lucide = "arrow-right";

    acao.appendChild(icone);

    corpo.append(data, titulo, resumo, acao);

    card.append(areaImagem, corpo);

    return card;
}

// ========================================
// CARDS SECUNDÁRIOS DA HOME
// ========================================

function criarCardSecundario(noticia) {
    const card = criarElemento("a", "card-secundario");

    card.href = obterLink(noticia);
    card.dataset.noticiaId = noticia.id;

    const areaImagem = criarElemento(
        "div",
        "card-secundario-imagem"
    );

    const imagem = criarElemento("img");
    imagem.src = obterImagem(noticia);
    imagem.alt = noticia.alt || noticia.titulo;

    areaImagem.appendChild(imagem);

    const corpo = criarElemento(
        "div",
        "card-secundario-corpo"
    );

    const informacoes = criarElemento("div");

    const categoria = criarElemento(
        "span",
        "card-categoria",
        "Notícia"
    );

    const titulo = criarElemento(
        "h4",
        "card-secundario-titulo",
        noticia.titulo
    );

    informacoes.append(categoria, titulo);

    const acao = criarElemento("span", "card-link-acao");

    acao.append(document.createTextNode("Ver "));

    const icone = document.createElement("i");
    icone.dataset.lucide = "chevron-right";

    acao.appendChild(icone);

    corpo.append(informacoes, acao);

    card.append(areaImagem, corpo);

    return card;
}

// ========================================
// CARDS DA PÁGINA BLOGS
// ========================================

function criarCardBlog(noticia) {
    const card = criarElemento("article", "card-noticia");

    card.dataset.noticiaId = noticia.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    card.setAttribute(
        "aria-label",
        `Abrir notícia: ${noticia.titulo}`
    );

    const imagem = criarElemento("img");
    imagem.src = obterImagem(noticia);
    imagem.alt = noticia.alt || noticia.titulo;

    const titulo = criarElemento(
        "h2",
        "",
        noticia.titulo
    );

    const resumo = criarElemento(
        "p",
        "",
        noticia.resumo
    );

    const link = criarElemento("a", "", "mais...");
    link.href = obterLink(noticia);

    card.append(imagem, titulo, resumo, link);

    return card;
}

// ========================================
// RENDERIZAÇÃO AUTOMÁTICA
// ========================================

function renderizarNoticias(noticias) {

    // PÁGINA INICIAL
    const containerHome = document.querySelector(
        ".noticias-conteudo"
    );

    if (containerHome) {
        containerHome.innerHTML = "";

        if (noticias.length === 0) {
            containerHome.textContent =
                "Nenhuma notícia cadastrada.";
        } else {
            // Primeira notícia como destaque
            containerHome.appendChild(
                criarCardDestaque(noticias[0])
            );

            // Demais notícias como cards secundários
            if (noticias.length > 1) {
                const secundarias = criarElemento(
                    "div",
                    "noticias-secundarias"
                );

                noticias.slice(1).forEach(noticia => {
                    secundarias.appendChild(
                        criarCardSecundario(noticia)
                    );
                });

                containerHome.appendChild(secundarias);
            }
        }
    }

    // PÁGINA DE BLOGS
    const containerBlogs = document.getElementById(
        "listaNoticias"
    );

    if (containerBlogs) {
        containerBlogs.innerHTML = "";

        if (noticias.length === 0) {
            containerBlogs.textContent =
                "Nenhuma notícia cadastrada.";
        } else {
            noticias.forEach(noticia => {
                containerBlogs.appendChild(
                    criarCardBlog(noticia)
                );
            });
        }
    }

    // Atualiza os ícones
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ========================================
// CRIAÇÃO DO MODAL
// ========================================

function criarModalNoticias() {
    const modal = document.createElement("dialog");

    modal.id = "modalNoticia";
    modal.className = "modal-noticia";

    const conteudo = criarElemento(
        "div",
        "modal-noticia-conteudo"
    );

    const botaoFechar = criarElemento(
        "button",
        "modal-noticia-fechar",
        "×"
    );

    botaoFechar.type = "button";

    botaoFechar.setAttribute(
        "aria-label",
        "Fechar notícia"
    );

    const imagem = criarElemento(
        "img",
        "modal-noticia-imagem"
    );

    const data = criarElemento(
        "span",
        "modal-noticia-data"
    );

    const titulo = criarElemento(
        "h2",
        "modal-noticia-titulo"
    );

    const autor = criarElemento(
        "p",
        "modal-noticia-autor"
    );

    const texto = criarElemento(
        "div",
        "modal-noticia-texto"
    );

    conteudo.append(
        botaoFechar,
        imagem,
        data,
        titulo,
        autor,
        texto
    );

    modal.appendChild(conteudo);

    document.body.appendChild(modal);

    return modal;
}

const modal = criarModalNoticias();

const conteudoModal = modal.querySelector(
    ".modal-noticia-conteudo"
);

const imagemModal = modal.querySelector(
    ".modal-noticia-imagem"
);

const dataModal = modal.querySelector(
    ".modal-noticia-data"
);

const tituloModal = modal.querySelector(
    ".modal-noticia-titulo"
);

const autorModal = modal.querySelector(
    ".modal-noticia-autor"
);

const textoModal = modal.querySelector(
    ".modal-noticia-texto"
);

const botaoFechar = modal.querySelector(
    ".modal-noticia-fechar"
);

// ========================================
// CONTEÚDO DA NOTÍCIA
// ========================================

function adicionarConteudoNoticia(noticia) {
    textoModal.innerHTML = "";

    (noticia.conteudo || []).forEach(item => {

        if (item.tipo === "paragrafo") {
            const paragrafo = criarElemento(
                "p",
                "",
                item.texto
            );

            textoModal.appendChild(paragrafo);
        }

        else if (item.tipo === "titulo") {
            const titulo = criarElemento(
                "h3",
                "",
                item.texto
            );

            textoModal.appendChild(titulo);
        }

        else if (item.tipo === "lista") {
            const lista = document.createElement("ul");

            (item.itens || []).forEach(texto => {
                const itemLista = criarElemento(
                    "li",
                    "",
                    texto
                );

                lista.appendChild(itemLista);
            });

            textoModal.appendChild(lista);
        }

    });
}

// ========================================
// BLOQUEIO DA ROLAGEM
// ========================================

function bloquearScroll() {
    document.documentElement.classList.add("modal-aberto");
    document.body.classList.add("modal-aberto");
}

function liberarScroll() {
    document.documentElement.classList.remove("modal-aberto");
    document.body.classList.remove("modal-aberto");
}

// ========================================
// ABRIR NOTÍCIA
// ========================================

async function abrirNoticia(id) {
    try {
        const noticias = await carregarNoticias();

        const noticia = noticias.find(
            item => String(item.id) === String(id)
        );

        if (!noticia) {
            console.error("Notícia não encontrada:", id);
            return;
        }

        imagemModal.src = obterImagem(noticia);

        imagemModal.alt =
            noticia.alt || noticia.titulo;

        dataModal.textContent = noticia.data || "";

        tituloModal.textContent =
            noticia.titulo || "";

        autorModal.textContent = noticia.autor
            ? `Por ${noticia.autor}`
            : "";

        adicionarConteudoNoticia(noticia);

        conteudoModal.scrollTop = 0;

        if (!modal.open) {
            modal.showModal();
            bloquearScroll();
        }

    } catch (erro) {
        console.error(
            "Erro ao abrir notícia:",
            erro
        );
    }
}

// ========================================
// FECHAR MODAL
// ========================================

function fecharModal() {
    if (modal.open) {
        modal.close();
    }
}

botaoFechar.addEventListener(
    "click",
    fecharModal
);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        fecharModal();
    }
});

modal.addEventListener("close", liberarScroll);

// ========================================
// CLIQUES NOS CARDS
// ========================================

document.addEventListener("click", event => {
    const card = event.target.closest(
        "[data-noticia-id]"
    );

    if (!card) {
        return;
    }

    event.preventDefault();

    abrirNoticia(card.dataset.noticiaId);
});

// ========================================
// ACESSIBILIDADE PELO TECLADO
// ========================================

document.addEventListener("keydown", event => {
    if (
        event.key !== "Enter" &&
        event.key !== " "
    ) {
        return;
    }

    const card = event.target.closest(
        "[data-noticia-id]"
    );

    if (
        !card ||
        card.tagName === "A" ||
        modal.open ||
        event.target !== card
    ) {
        return;
    }

    event.preventDefault();

    abrirNoticia(card.dataset.noticiaId);
});

// ========================================
// INICIALIZAÇÃO
// ========================================

async function inicializarNoticias() {
    try {
        const noticias = await carregarNoticias();

        renderizarNoticias(noticias);

    } catch (erro) {
        console.error(
            "Erro ao carregar notícias:",
            erro
        );

        const containerHome = document.querySelector(
            ".noticias-conteudo"
        );

        const containerBlogs = document.getElementById(
            "listaNoticias"
        );

        if (containerHome) {
            containerHome.textContent =
                "Não foi possível carregar as notícias.";
        }

        if (containerBlogs) {
            containerBlogs.textContent =
                "Não foi possível carregar as notícias.";
        }
    }
}

inicializarNoticias();
