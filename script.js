const classeItensNoCarrinho = '.cart__items';

// #11 - Salvar os itens do carrinho de compras no LocalStorage
// Feito com a ajuda da aluna Nathi Zebral - turma 10 - tribo A
const salvarLocalStorage = () => {
  const item = document.querySelector(classeItensNoCarrinho);
  localStorage.setItem('itensDoCarrinho', item.innerHTML);
};

// #10 - Ao clicar no item do carrinho de compras, verifica se o item clicado
// possui a classe "cart__item", se tiver remove o conteúdo.
function cartItemClickListener(event) {
  const { target } = event;
  if (target.classList.contains('cart__item')) {
    target.remove('li');
  }
  salvarLocalStorage();
}

// #12 - Recuperar os itens do carrinho de compras do LocalStorage
// Feito com a ajuda da aluna Nathi Zebral - turma 10 - tribo A
function recuperarLocalStorage() {
  const item = localStorage.getItem('itensDoCarrinho');
  const buscaListaItens = document.querySelector(classeItensNoCarrinho);
  buscaListaItens.innerHTML = item;
  const todosOsItens = document.querySelectorAll(classeItensNoCarrinho);
  [...todosOsItens].forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

// #9 - Recebe as informações de um único produto e coloca no carrinho de compras
// informando apenas o ID, descrição e preço (Achei melhor utilizar esses termos). 
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// #1 - Função que acessa a API do Mercado Livre buscando pelo termo "computador".
const acessarAPI = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const data = await response.json();
  return data.results;
};

// #4 - Função utilizada para criar um novo elemento com uma identificação, classe
// e texto baseado nas informações enviadas pela função "createProductItemElement".
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// #5 - Função que pega a imagem enviada pela função "createProductItemElement",
// cria uma TAG HTML do tipo "img", coloca essa TAG com a classe "item__image",
// indica a fonte da imagem (Parâmetro dessa mesma função) e retorna a imagem.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// #3 - Preciei mudar "sku" para "id", "name" para "title" e "image" para "thumbnail",
// pois são os nomes utilizados na API do Mercado Livre. Essa função separa os objetos
// "id, title e thumbnail" e também adiciona um botão para cada um desses novos elementos.
// A função também coloca tudo isso dentro de uma "section" com a classe "item".
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// #2 - Função que pega a busca feita na API do Mercado Livre e envia
// como parâmetro da função "createProductItemElement".
const resultadosAPI = async () => {
  const computadores = await acessarAPI();
  computadores.forEach((computador) => {
    const cadaItem = document.querySelector('.items');
    cadaItem.appendChild(createProductItemElement(computador)); 
  });
};

// #8 - Faz uma nova busca na API do Mercado Livre através do ID (Sku) do produto.
// Depois pega a informação recebida e envia para a função "createCartItemElement".
async function buscarItemNaAPI(ItemID) {
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const data = await response.json();
  createCartItemElement(data);
  document.querySelector('.cart__items').appendChild(createCartItemElement(data));
  salvarLocalStorage();
}

// #7 - Identifica e retorna o ID (Sku) do produto para a "const computadorID".
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// #6 - Identifica o click no botão do anúncio e envia
// o "target" para a função "getSkuFromProductItem".
const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((botao) => {
    botao.addEventListener('click', (event) => {
      const computadorID = getSkuFromProductItem(event.target.parentElement);
      buscarItemNaAPI(computadorID);
    });
  });  
};

window.onload = function onload() {
  acessarAPI();
  resultadosAPI().then(() => clickButton());
  recuperarLocalStorage();
};
