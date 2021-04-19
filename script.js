// const { default: fetch } = require('node-fetch');

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

const loadingMsg = () => {
  const loading = document.createElement('h1');
  loading.classList = 'loading';
  loading.innerText = 'Loading...';
  const containerItems = document.querySelector('.items');
  containerItems.appendChild(loading);
};

const fetchProducts = async (product) => {
  loadingMsg();
  const endpointpcs = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const response = await fetch(endpointpcs);
  const data = await response.json();
  document.querySelector('.loading').remove();
  return data.results.forEach((element) => {
    createProductItemElement(element);
  });    
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
  
const fetchPcIds = async (pcId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${pcId}`);
  const pcIdData = await response.json();
  return pcIdData;
};
// console.log(fetchPcIds());

function cartItemClickListener(_event) {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}

const addCart = async (e) => {
  const pcId = getSkuFromProductItem(e.target.patentNode);
  const data = await fetchPcIds(pcId);
  const { id, title, price } = data;

  const cart = createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(cart);
};

const clickToCart = () => {
  const cartBtn = document.querySelectorAll('.item__add');
  cartBtn.forEach((button) => {
    button.addEventListener('click', addCart);
  });
};

window.onload = function onload() { 
  fetchProducts('computador')
    .then(() => clickToCart()); 
};