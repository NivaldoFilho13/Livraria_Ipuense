// Troque pelo WhatsApp real da loja: país + DDD + número, sem +, espaços ou traços.
const WHATSAPP_NUMERO = "5588999999999";
const produtos = [
  {
    id: 1,
    nome: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Literatura",
    preco: 39.9,
    antes: 49.9,
    estoque: 3,
    imagem:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
    descricao:
      "Um clássico delicado sobre amizade, imaginação e os laços que criamos.",
  },
  {
    id: 2,
    nome: "Caderno Universitário",
    autor: "",
    categoria: "Papelaria",
    preco: 24.9,
    estoque: 12,
    imagem:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=85",
    descricao: "Caderno para organizar seus estudos, projetos e ideias.",
  },
  {
    id: 3,
    nome: "O Menino Maluquinho",
    autor: "Ziraldo",
    categoria: "Infantil",
    preco: 42.9,
    estoque: 2,
    imagem:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=85",
    descricao: "Uma leitura divertida que faz parte da infância de gerações.",
  },
  {
    id: 4,
    nome: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Literatura",
    preco: 32.9,
    estoque: 7,
    imagem:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85",
    descricao: "Um dos romances mais importantes da literatura brasileira.",
  },
  {
    id: 5,
    nome: "Kit Canetas Coloridas",
    autor: "",
    categoria: "Papelaria",
    preco: 29.9,
    antes: 36.9,
    estoque: 9,
    imagem:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
    descricao: "Cores para transformar anotações, desenhos e projetos.",
  },
  {
    id: 6,
    nome: "A Bíblia Sagrada",
    autor: "",
    categoria: "Bíblia & Religião",
    preco: 59.9,
    estoque: 4,
    imagem:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=700&q=85",
    descricao: "Edição para leitura, estudo e momentos de reflexão.",
  },
  {
    id: 7,
    nome: "Matemática Essencial",
    autor: "Equipe E10",
    categoria: "Didáticos",
    preco: 68.9,
    estoque: 5,
    imagem:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=85",
    descricao: "Apoio para praticar e dominar conteúdos fundamentais.",
  },
  {
    id: 8,
    nome: "Coleção de Quadrinhos",
    autor: "",
    categoria: "HQs & Mangás",
    preco: 27.9,
    estoque: 0,
    imagem:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=700&q=85",
    descricao: "Uma aventura ilustrada para leitores de todas as idades.",
  },
];
const dinheiro = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = (t) =>
  String(t).replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
const carrinho = () => JSON.parse(localStorage.getItem("e10-carrinho") || "[]");
const produto = (id) => produtos.find((p) => p.id === Number(id));
function badge() {
  const b = document.querySelector("#badge-carrinho");
  if (b) b.textContent = carrinho().reduce((s, i) => s + i.qtd, 0);
}
function salvar(itens) {
  localStorage.setItem("e10-carrinho", JSON.stringify(itens));
  badge();
}
function aviso(texto, tipo = "sucesso") {
  const e = document.createElement("div");
  e.textContent = texto;
  e.className = tipo === "erro" ? "msg-erro" : "msg-sucesso";
  Object.assign(e.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: 99,
    boxShadow: "var(--sombra)",
  });
  document.body.append(e);
  setTimeout(() => e.remove(), 2800);
}
function adicionar(id, qtd = 1) {
  const itens = carrinho(),
    i = itens.find((x) => x.id === id);
  if (i) i.qtd += qtd;
  else itens.push({ id, qtd });
  salvar(itens);
  aviso("Adicionado ao carrinho!");
}
function whatsapp(texto) {
  window.open(
    "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto),
    "_blank",
    "noopener",
  );
}
function montarFiltros() {
  const cats = [...new Set(produtos.map((p) => p.categoria))],
    s = document.querySelector("#categoria"),
    a = document.querySelector("#atalhos-categorias");
  if (s)
    s.innerHTML =
      '<option value="">Todas as categorias</option>' +
      cats
        .map((c) => '<option value="' + esc(c) + '">' + esc(c) + "</option>")
        .join("");
  if (a)
    a.innerHTML = ["Todos", ...cats]
      .map(
        (c) =>
          '<button class="atalho-categoria ' +
          (c === "Todos" ? "ativo" : "") +
          '" data-categoria="' +
          esc(c === "Todos" ? "" : c) +
          '">' +
          esc(c) +
          "</button>",
      )
      .join("");
}
function catalogo() {
  const alvo = document.querySelector("#lista-produtos");
  if (!alvo) return;
  montarFiltros();
  const desenhar = () => {
    const busca = document.querySelector("#busca").value.trim().toLowerCase(),
      cat = document.querySelector("#categoria").value;
    const lista = produtos.filter(
      (p) =>
        (!busca || (p.nome + " " + p.autor).toLowerCase().includes(busca)) &&
        (!cat || p.categoria === cat),
    );
    alvo.innerHTML =
      lista
        .map(
          (p) =>
            '<article class="cartao-produto"><a class="imagem-wrap" href="produto.html?id=' +
            p.id +
            '"><img src="' +
            p.imagem +
            '" alt="' +
            esc(p.nome) +
            '">' +
            (p.antes ? '<span class="etiqueta-promocao">Oferta</span>' : "") +
            '</a><div class="info"><span class="categoria">' +
            esc(p.categoria) +
            '</span><h3><a href="produto.html?id=' +
            p.id +
            '">' +
            esc(p.nome) +
            "</a></h3>" +
            (p.autor ? '<span class="autor">' + esc(p.autor) + "</span>" : "") +
            '<span class="preco">' +
            dinheiro(p.preco) +
            "</span>" +
            (p.antes
              ? '<span class="preco-antigo">de ' + dinheiro(p.antes) + "</span>"
              : "") +
            '<span class="selo ' +
            (p.estoque <= 3 ? "ultimas" : "") +
            '">' +
            (p.estoque === 0
              ? "Sob encomenda"
              : p.estoque <= 3
                ? "Últimas unidades!"
                : "Em estoque") +
            "</span>" +
            (p.estoque
              ? '<button class="btn btn-primario" data-add="' +
                p.id +
                '">Adicionar ao carrinho</button>'
              : '<button class="btn btn-primario" data-encomenda="' +
                esc(p.nome) +
                '">Encomendar pelo WhatsApp</button>') +
            "</div></article>",
        )
        .join("") ||
      '<p>Nenhum produto encontrado. <a href="encomenda.html">Peça este livro por encomenda.</a></p>';
    alvo
      .querySelectorAll("[data-add]")
      .forEach((b) => (b.onclick = () => adicionar(Number(b.dataset.add))));
    alvo
      .querySelectorAll("[data-encomenda]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            whatsapp(
              "Olá! Gostaria de encomendar o livro: " +
                b.dataset.encomenda +
                ".",
            )),
      );
  };
  document.querySelector("#filtros").onsubmit = (e) => {
    e.preventDefault();
    desenhar();
  };
  document.querySelector("#categoria").onchange = desenhar;
  document.querySelectorAll("[data-categoria]").forEach(
    (b) =>
      (b.onclick = () => {
        document.querySelector("#categoria").value = b.dataset.categoria;
        document
          .querySelectorAll("[data-categoria]")
          .forEach((x) => x.classList.toggle("ativo", x === b));
        desenhar();
      }),
  );
  desenhar();
}
function detalhe() {
  const alvo = document.querySelector("#detalhe-produto");
  if (!alvo) return;
  const p =
    produto(new URLSearchParams(location.search).get("id")) || produtos[0];
  document.title = p.nome + " · E10 Livraria";
  alvo.innerHTML =
    '<article class="produto-detalhe"><img src="' +
    p.imagem +
    '" alt="' +
    esc(p.nome) +
    '"><div><span class="categoria">' +
    esc(p.categoria) +
    "</span><h1>" +
    esc(p.nome) +
    "</h1>" +
    (p.autor ? "<p><strong>Autor:</strong> " + esc(p.autor) + "</p>" : "") +
    "<p>" +
    esc(p.descricao) +
    '</p><p class="preco" style="font-size:1.7rem">' +
    dinheiro(p.preco) +
    (p.antes
      ? ' <span class="preco-antigo">' + dinheiro(p.antes) + "</span>"
      : "") +
    '</p><p class="selo ' +
    (p.estoque <= 3 ? "ultimas" : "") +
    '">' +
    (p.estoque === 0
      ? "Produto sem estoque: faça sua encomenda."
      : p.estoque <= 3
        ? "Apenas " + p.estoque + " unidade(s) disponível(is)."
        : "Produto disponível para entrega ou retirada.") +
    "</p>" +
    (p.estoque
      ? '<div style="display:flex;gap:12px;align-items:center"><div class="controle-qtd"><button type="button" data-menos>−</button><input id="qtd-produto" type="number" min="1" max="' +
        p.estoque +
        '" value="1"><button type="button" data-mais>+</button></div><button class="btn btn-primario" id="add-produto">Adicionar ao carrinho</button></div>'
      : '<button class="btn btn-primario" id="encomendar-produto">Encomendar pelo WhatsApp</button>') +
    '<p class="aviso-demo">Retirada na loja ou entrega em Ipu/CE.</p></div></article>';
  const q = document.querySelector("#qtd-produto");
  if (q) {
    document.querySelector("[data-menos]").onclick = () =>
      (q.value = Math.max(1, Number(q.value) - 1));
    document.querySelector("[data-mais]").onclick = () =>
      (q.value = Math.min(p.estoque, Number(q.value) + 1));
    document.querySelector("#add-produto").onclick = () =>
      adicionar(p.id, Number(q.value));
  } else
    document.querySelector("#encomendar-produto").onclick = () =>
      whatsapp("Olá! Gostaria de encomendar o livro: " + p.nome + ".");
}
function itens() {
  return carrinho()
    .map((i) => ({ ...i, produto: produto(i.id) }))
    .filter((i) => i.produto);
}
function renderCarrinho() {
  const alvo = document.querySelector("#conteudo-carrinho");
  if (!alvo) return;
  const lista = itens();
  if (!lista.length) {
    alvo.innerHTML =
      '<p>Seu carrinho está vazio. <a href="index.html">Voltar ao catálogo</a>.</p>';
    return;
  }
  const total = lista.reduce((s, i) => s + i.qtd * i.produto.preco, 0);
  alvo.innerHTML =
    '<table class="tabela-carrinho"><thead><tr><th>Produto</th><th>Preço</th><th>Quantidade</th><th>Subtotal</th><th></th></tr></thead><tbody>' +
    lista
      .map(
        (i) =>
          '<tr><td><div class="linha-carrinho-produto"><img src="' +
          i.produto.imagem +
          '" alt=""><span>' +
          esc(i.produto.nome) +
          "</span></div></td><td>" +
          dinheiro(i.produto.preco) +
          '</td><td><div class="controle-qtd"><button data-menos="' +
          i.id +
          '">−</button><input type="number" min="1" max="' +
          (i.produto.estoque || 99) +
          '" value="' +
          i.qtd +
          '" data-qtd="' +
          i.id +
          '"><button data-mais="' +
          i.id +
          '">+</button></div></td><td>' +
          dinheiro(i.qtd * i.produto.preco) +
          '</td><td><button class="remover" data-remover="' +
          i.id +
          '">Remover</button></td></tr>',
      )
      .join("") +
    '</tbody></table><p class="resumo-total">Total: ' +
    dinheiro(total) +
    '</p><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><a href="index.html">← Continuar comprando</a><a href="checkout.html" class="btn btn-primario">Finalizar pedido</a></div>';
  const alterar = (id, q) => {
    const x = carrinho(),
      i = x.find((v) => v.id === id);
    if (i) {
      i.qtd = Math.max(1, q);
      salvar(x);
      renderCarrinho();
    }
  };
  alvo
    .querySelectorAll("[data-qtd]")
    .forEach(
      (e) =>
        (e.onchange = () => alterar(Number(e.dataset.qtd), Number(e.value))),
    );
  alvo.querySelectorAll("[data-mais]").forEach(
    (e) =>
      (e.onclick = () => {
        const i = carrinho().find((x) => x.id === Number(e.dataset.mais));
        alterar(i.id, Math.min(i.qtd + 1, produto(i.id).estoque || 99));
      }),
  );
  alvo.querySelectorAll("[data-menos]").forEach(
    (e) =>
      (e.onclick = () => {
        const i = carrinho().find((x) => x.id === Number(e.dataset.menos));
        alterar(i.id, i.qtd - 1);
      }),
  );
  alvo.querySelectorAll("[data-remover]").forEach(
    (e) =>
      (e.onclick = () => {
        salvar(carrinho().filter((i) => i.id !== Number(e.dataset.remover)));
        renderCarrinho();
      }),
  );
}
function checkout() {
  const alvo = document.querySelector("#checkout");
  if (!alvo) return;
  const lista = itens();
  if (!lista.length) {
    alvo.innerHTML =
      '<p>Seu carrinho está vazio. <a href="index.html">Ver catálogo</a>.</p>';
    return;
  }
  const total = lista.reduce((s, i) => s + i.qtd * i.produto.preco, 0);
  alvo.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 320px;gap:30px"><form id="form-checkout"><h3>Como você quer receber?</h3><div class="opcoes-entrega"><label><input type="radio" name="entrega" value="Retirar na loja" checked> Retirar na loja</label><label><input type="radio" name="entrega" value="Entrega em domicílio"> Entrega em Ipu</label></div><div class="campo"><label for="checkout-nome">Seu nome</label><input id="checkout-nome" required placeholder="Nome completo"></div><div class="campo"><label for="checkout-endereco">Endereço (para entrega)</label><input id="checkout-endereco" placeholder="Rua, número, bairro"></div><div class="campo"><label for="checkout-pagamento">Pagamento</label><select id="checkout-pagamento"><option>Pix</option><option>Dinheiro</option><option>Cartão na retirada/entrega</option></select></div><div class="campo"><label for="checkout-observacoes">Observações</label><textarea id="checkout-observacoes" placeholder="Ex.: embrulho para presente"></textarea></div><button class="btn btn-primario">Enviar pedido pelo WhatsApp</button><p class="aviso-demo">O pedido será preparado em uma mensagem de WhatsApp para a loja.</p></form><div><h3>Resumo</h3>' +
    lista
      .map(
        (i) =>
          "<p>" +
          i.qtd +
          "x " +
          esc(i.produto.nome) +
          " — " +
          dinheiro(i.qtd * i.produto.preco) +
          "</p>",
      )
      .join("") +
    '<p class="resumo-total">Total: ' +
    dinheiro(total) +
    "</p></div></div>";
  document.querySelector("#form-checkout").onsubmit = (e) => {
    e.preventDefault();
    const nome = document.querySelector("#checkout-nome").value.trim(),
      entrega = document.querySelector('input[name="entrega"]:checked').value,
      endereco = document.querySelector("#checkout-endereco").value.trim(),
      pagamento = document.querySelector("#checkout-pagamento").value,
      obs = document.querySelector("#checkout-observacoes").value.trim();
    if (!nome) {
      aviso("Informe seu nome para enviar o pedido.", "erro");
      return;
    }
    if (entrega.includes("Entrega") && !endereco) {
      aviso("Informe o endereço de entrega.", "erro");
      return;
    }
    const linhas = lista
      .map(
        (i) =>
          i.qtd +
          "x " +
          i.produto.nome +
          " — " +
          dinheiro(i.qtd * i.produto.preco),
      )
      .join("\n");
    whatsapp(
      "Olá! Meu nome é " +
        nome +
        ".\n\nPedido:\n" +
        linhas +
        "\n\nTotal: " +
        dinheiro(total) +
        "\nEntrega: " +
        entrega +
        (endereco ? "\nEndereço: " + endereco : "") +
        "\nPagamento: " +
        pagamento +
        (obs ? "\nObservações: " + obs : ""),
    );
  };
}
function formularios() {
  document.querySelectorAll("form[data-demo-message]").forEach(
    (f) =>
      (f.onsubmit = (e) => {
        e.preventDefault();
        const s = f.querySelector("#senha"),
          c = f.querySelector("#confirmar");
        if (s && c && s.value !== c.value) {
          aviso("As senhas não coincidem.", "erro");
          return;
        }
        aviso(f.dataset.demoMessage);
        f.reset();
      }),
  );
}
document.addEventListener("DOMContentLoaded", () => {
  badge();
  catalogo();
  detalhe();
  renderCarrinho();
  checkout();
  formularios();
  document
    .querySelectorAll("[data-whatsapp]")
    .forEach((b) => (b.onclick = () => whatsapp(b.dataset.whatsapp)));
  const b = document.createElement("button");
  b.className = "whatsapp-flutuante";
  b.textContent = "💬 WhatsApp";
  b.onclick = () => whatsapp("Olá! Gostaria de falar com a E10 Livraria.");
  document.body.append(b);
});
