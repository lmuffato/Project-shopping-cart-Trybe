window.onload = function onload() { };

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
function updateLocalStorage() {
  const seletor = document.querySelector('section .cart__items');
  localStorage.brolySsj = seletor.innerHTML;
}

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function api() {
 const chamaApi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
 const produtos = await chamaApi.json();
  const lista = await produtos.results;
  return lista;
}

async function product() {
  const pedroApis = await api();
  const documentItens = document.querySelector('.items');
  pedroApis.forEach((element) => {
    const chamaObjeto = { sku: element.id, name: element.title, image: element.thumbnail };
    documentItens.appendChild(createProductItemElement(chamaObjeto));
  });
}

const buscaId = async (id) => {
 const chamaId = await fetch(`https://api.mercadolibre.com/items/${id}`);
 const ids = await chamaId.json();
 return ids;
};

function carregaCarrinho() {
  const seletor = document.querySelector('section .cart__items');
  seletor.innerHTML = localStorage.produtos;
  const seletorLi = document.querySelectorAll('section .cart__items li');
  seletorLi.forEach((event) => event.addEventListener('click', cartItemClickListener));
}

const button = async (id) => {
  const iten = await buscaId(id);
  const cart = createCartItemElement(iten);
  const novaOl = document.querySelector('.cart__items');
  novaOl.appendChild(cart);
  updateLocalStorage();
};
const addCart = async () => {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((lemento) => {
    const produtoId = lemento.parentElement.children[0].innerText;
    lemento.addEventListener('click', () => {
      button(produtoId);
    });
  });
};

window.onload = async function psipsiCarrega() {
  await product();
  await addCart();
  carregaCarrinho();
};