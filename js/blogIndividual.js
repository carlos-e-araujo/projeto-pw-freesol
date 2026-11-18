async function carregarBlog() {

    // Recupera o ID informado na URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    // Recupera o elemento onde o artigo será exibido
    const artigo = document.getElementById("blogConteudo");

    // Verifica se o elemento existe
    if (!artigo) {
        console.error("Elemento blogConteudo não encontrado!");
        return;
    }

    try {

        // Busca os blogs no arquivo JSON
        const resposta = await fetch("../dados/blogs.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        const blogs = await resposta.json();
        console.log("BLOGS CARREGADOS:", blogs);
        console.log("ID DA URL:", id);

        // Procura o blog correspondente ao ID
        const blog = blogs.find(item => String(item.id) === id);
        console.log("BLOG ENCONTRADO:", blog);

        // Verifica se o blog existe
        if (!blog) {
            artigo.innerHTML = "<h1>Blog não encontrado!</h1>";
            return;
        }

        // Atualiza o título da página
        document.title = "FreeSol - " + blog.titulo;

        // Monta o cabeçalho do artigo
        artigo.innerHTML = `
            <span>POST</span>

            <h1>${blog.titulo}</h1>

            <h3 class="informacoes">
                📅 ${blog.data} &nbsp; • &nbsp; 👤 ${blog.autor}
            </h3>

            <img src="${blog.imagem}" alt="${blog.alt}">
        `;

        // Percorre o conteúdo do artigo
        blog.conteudo.forEach(item => {

            if (item.tipo === "paragrafo") {

                artigo.innerHTML += `
                    <p>${item.texto}</p>
                `;

            } else if (item.tipo === "titulo") {

                artigo.innerHTML += `
                    <section class="conquistas">
                        <h2>${item.texto}</h2>
                        <ul></ul>
                    </section>
                `;

            } else if (item.tipo === "lista") {

                const lista = artigo.querySelector(".conquistas ul");

                if (lista) {

                    item.itens.forEach(texto => {
                        lista.innerHTML += `<li>${texto}</li>`;
                    });

                }

            }

        });

    } catch (erro) {

        console.error("Erro ao carregar o blog:", erro);
        artigo.innerHTML = "<h1>Erro ao carregar o artigo.</h1>";

    }

}

// Executa a função
carregarBlog();
