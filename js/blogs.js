// Variáveis globais da aplicação
var dados = [];
var indexEdicao = -1;

/**
 * Lê os dados da aplicação (do localStorage ou do arquivo blogs.json)
 */
async function loadData() {
    try {
        var dadosSalvos = localStorage.getItem("blogs");

        if (dadosSalvos) {
            dados = JSON.parse(dadosSalvos);
        } else {
            var response = await fetch("../dados/blogs.json");
            if (!response.ok) {
                throw new Error("Erro ao obter dados: " + response.status);
            }
            dados = await response.json();
            salvarDados();
        }

        renderizarPosts();

    } catch (err) {
        alert("Ocorreu um erro ao carregar os dados!");
        console.error(err);
    }
}

/**
 * Salva o array de posts no localStorage
 */
function salvarDados() {
    localStorage.setItem("blogs", JSON.stringify(dados));
}

/**
 * Renderiza os cards na página de blogs (e na home se existir)
 */
function renderizarPosts() {
    var listaBlogs = document.getElementById("listaNoticias");

    if (listaBlogs) {
        listaBlogs.innerHTML = "";

        if (dados.length === 0) {
            listaBlogs.innerHTML = "<p>Nenhum post cadastrado.</p>";
            return;
        }

        for (var i = 0; i < dados.length; i++) {
            var post = dados[i];
            var article = document.createElement("article");
            article.className = "card-noticia";

            var resumo = post.texto.length > 120 ? post.texto.substring(0, 120) + "..." : post.texto;

            article.innerHTML = `
                <div class="card-imagem-area" onclick="verPost(${i})">
                    <img src="${post.imagem}" alt="${post.titulo}">
                </div>
                <div class="card-conteudo-area">
                    <h2 onclick="verPost(${i})">${post.titulo}</h2>
                    <p onclick="verPost(${i})">${resumo}</p>
                    <div class="card-rodape">
                        <button type="button" class="btn-ler-mais" onclick="verPost(${i})">Ler mais ›</button>
                        <div class="card-botoes-gestao">
                            <button type="button" class="btn-icone-acao btn-editar" onclick="abrirModalEditar(${i})" title="Editar Post">
                                <i data-lucide="pencil"></i>
                            </button>
                            <button type="button" class="btn-icone-acao btn-excluir" onclick="excluirPost(${i})" title="Excluir Post">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            listaBlogs.appendChild(article);
        }
    }

    // Na home (index.html), renderiza nos estilos nativos da home (card-destaque e card-secundario)
    var containerHome = document.querySelector(".noticias-conteudo");
    if (containerHome) {
        containerHome.innerHTML = "";

        if (dados.length === 0) {
            containerHome.innerHTML = "<p>Nenhuma notícia cadastrada.</p>";
            return;
        }

        // Primeiro card em destaque
        var p1 = dados[0];
        var resumoDestaque = p1.texto.length > 130 ? p1.texto.substring(0, 130) + "..." : p1.texto;

        var htmlDestaque = `
            <a class="card-destaque" href="blogs.html">
                <div class="card-destaque-imagem">
                    <img src="${p1.imagem}" alt="${p1.titulo}">
                    <span class="badge-destaque">Destaque</span>
                </div>
                <div class="card-destaque-corpo">
                    <h3 class="card-destaque-titulo">${p1.titulo}</h3>
                    <p class="card-destaque-resumo">${resumoDestaque}</p>
                    <span class="card-link-acao">Leia a matéria <i data-lucide="arrow-right"></i></span>
                </div>
            </a>
        `;

        // Demais cards secundários
        var htmlSecundarios = "";
        if (dados.length > 1) {
            htmlSecundarios += '<div class="noticias-secundarias">';
            for (var j = 1; j < Math.min(dados.length, 3); j++) {
                var p = dados[j];
                htmlSecundarios += `
                    <a class="card-secundario" href="blogs.html">
                        <div class="card-secundario-imagem">
                            <img src="${p.imagem}" alt="${p.titulo}">
                        </div>
                        <div class="card-secundario-corpo">
                            <div>
                                <span class="card-categoria">Notícia</span>
                                <h4 class="card-secundario-titulo">${p.titulo}</h4>
                            </div>
                            <span class="card-link-acao">Ver <i data-lucide="chevron-right"></i></span>
                        </div>
                    </a>
                `;
            }
            htmlSecundarios += '</div>';
        }

        containerHome.innerHTML = htmlDestaque + htmlSecundarios;
    }

    // Atualiza os ícones do Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Abre o modal para ler o post completo
 */
function verPost(index) {
    var post = dados[index];
    if (!post) return;

    var modal = document.getElementById("modalVerPost");
    if (!modal) return;

    document.getElementById("verPostTitulo").innerText = post.titulo;
    document.getElementById("verPostImagem").src = post.imagem;
    document.getElementById("verPostImagem").alt = post.titulo;
    document.getElementById("verPostTexto").innerText = post.texto;

    modal.showModal();

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Fecha o modal de visualização
 */
function fecharModalVerPost() {
    var modal = document.getElementById("modalVerPost");
    if (modal) {
        modal.close();
    }
}

/**
 * Abre o modal de formulário para adicionar um novo post
 */
function abrirModalAdicionar() {
    indexEdicao = -1;
    document.getElementById("modalFormTitulo").innerText = "Adicionar Novo Post";
    document.getElementById("inputTitulo").value = "";
    document.getElementById("inputImagem").value = "../img/imagem1.jpg";
    document.getElementById("inputTexto").value = "";

    var modal = document.getElementById("modalFormulario");
    if (modal) {
        modal.showModal();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

/**
 * Abre o modal de formulário para editar um post existente
 */
function abrirModalEditar(index) {
    indexEdicao = index;
    var post = dados[index];

    document.getElementById("modalFormTitulo").innerText = "Editar Post";
    document.getElementById("inputTitulo").value = post.titulo;
    document.getElementById("inputImagem").value = post.imagem;
    document.getElementById("inputTexto").value = post.texto;

    var modal = document.getElementById("modalFormulario");
    if (modal) {
        modal.showModal();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

/**
 * Fecha o modal de formulário
 */
function fecharModalFormulario() {
    var modal = document.getElementById("modalFormulario");
    if (modal) {
        modal.close();
    }
}

/**
 * Salva o post (adiciona novo ou atualiza existente)
 */
function salvarPost(event) {
    event.preventDefault();

    var titulo = document.getElementById("inputTitulo").value.trim();
    var imagem = document.getElementById("inputImagem").value.trim() || "../img/imagem1.jpg";
    var texto = document.getElementById("inputTexto").value.trim();

    if (!titulo || !texto) {
        alert("Preencha o título e o texto!");
        return;
    }

    if (indexEdicao === -1) {
        // Novo post inserido no início da lista
        var novoId = Date.now();
        dados.unshift({
            id: novoId,
            titulo: titulo,
            imagem: imagem,
            texto: texto
        });
    } else {
        // Edição do post
        dados[indexEdicao].titulo = titulo;
        dados[indexEdicao].imagem = imagem;
        dados[indexEdicao].texto = texto;
    }

    salvarDados();
    renderizarPosts();
    fecharModalFormulario();
}

/**
 * Exclui um post da lista
 */
function excluirPost(index) {
    var confirmou = confirm("Deseja realmente excluir este post?");
    if (confirmou) {
        dados.splice(index, 1);
        salvarDados();
        renderizarPosts();
    }
}

// Inicia o carregamento
loadData();
