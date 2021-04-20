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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const removeLoading = () => {
  const h1 = document.querySelector('h1');
  h1.remove();
};

async function showComputers() {
  const fatherSection = document.getElementsByClassName('items')[0];
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  removeLoading();
  data.results.forEach((result) => {
    fatherSection.appendChild(createProductItemElement(result));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveItems = () => {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('listaCarrinho', ol.innerHTML);
};

const getItems = () => {
  const ol = document.querySelector('.cart__items');
  const getItem = localStorage.getItem('listaCarrinho');
  ol.innerHTML = getItem;
};

function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
  saveItems(); 
}

const removeItems = () => {
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const parent = event.target.parentNode;
  const getSku = getSkuFromProductItem(parent);
  const ol = document.querySelector('ol');
  const response = await fetch(`https://api.mercadolibre.com/items/${getSku}`);
  const data = await response.json();
  const cartItem = createCartItemElement(data);
  ol.appendChild(cartItem);
  saveItems();
}

const addEventListener1 = async () => {
  await showComputers();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => addToCart(event));
  });
};

const clearAll = () => {
  const ol = document.querySelector('ol');
  ol.innerHTML = '';
};

const emptyCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearAll);
};

window.onload = function onload() {
  addEventListener1();
  getItems();
  removeItems();
  emptyCart();
};
