function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const somarValorDoProduto = async () => {
  const totalPrice = document.querySelector('.total-price');
  const itensDocarrinho = await document.querySelectorAll('.cart__item');
  let soma = 0;
  itensDocarrinho.forEach((item) => {
    const capturarValor = parseFloat(item.innerHTML.split('$')[1]);
    soma += capturarValor;
  });
  totalPrice.innerHTML = soma;
};

function cartItemClickListener(event) {
  event.target.remove();
  somarValorDoProduto();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const removeTextoLoading = () => {
  const spanElement = document.querySelector('.loading');
  spanElement.remove();
};

const pegarLista = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

const pegarItemPeloID = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const salvarCarrinhoLocalStorage = async () => {
  const listaDeItemDoCarrinho = document.querySelector('ol.cart__items');
  await localStorage.setItem('carrinho', listaDeItemDoCarrinho.innerHTML);
};

const regatarItemCarrinho = async () => {
  const listaDeItemDoCarrinho = document.querySelector('.cart__items');
  listaDeItemDoCarrinho.innerHTML = localStorage.getItem('carrinho');
};

const adcionarItemNoCarrinho = async (even) => {
  const id = getSkuFromProductItem(even.target.parentElement);
  const dadosItem = await pegarItemPeloID(id);
  const elementoDoCarrinho = createCartItemElement(dadosItem);
  const listaDoCarrinho = document.querySelector('.cart__items');
  listaDoCarrinho.appendChild(elementoDoCarrinho);
  salvarCarrinhoLocalStorage();
  somarValorDoProduto();
};

const addEventButton = () => {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((botao) => {
    botao.addEventListener('click', adcionarItemNoCarrinho);
  });
};

async function mostrarLista() {
  const iterarItens = await pegarLista();
  removeTextoLoading();
  iterarItens.forEach((element) => {
    const itens = document.querySelector('.items');
    itens.appendChild(createProductItemElement(element));
  });
  addEventButton();
}

const limparCarrinho = () => {
  const itens = document.querySelectorAll('.cart__item');
  itens.forEach((item) => item.remove());
};

const onclickLimparCarrinho = () => {
  document
    .querySelector('.empty-cart')
    .addEventListener('click', limparCarrinho);
};

window.onload = function onload() {
  pegarLista();
  mostrarLista();
  regatarItemCarrinho();
  onclickLimparCarrinho();
};
