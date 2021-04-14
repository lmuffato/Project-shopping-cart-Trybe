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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Início resolução exercicio 2

const createCartObject = (object) => ({
  sku: object.id,
  name: object.title,
  salePrice: object.price,
});

// const fetch = require('node-fetch');

const appendCartItem = (object) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(createCartObject(object)));
};

const fetchId = (id) => {
  const APIUrlId = `https://api.mercadolibre.com/items/${id}`;
  
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(APIUrlId, myObject)
  .then((response) => response.json())
  .then((data) => appendCartItem(data));
};

const addToCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((item) => {
    item.addEventListener('click', () => {
      fetchId(item.parentElement.querySelector('.item__sku').innerHTML);
    });
  });
};

// Final resolução ex 2

// Início resolução exercicio 1

const APIUrlComputador = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const tratarElemento = (objeto) => ({
    sku: objeto.id,
    name: objeto.title,
    image: objeto.thumbnail,
    salePrice: objeto.price,
  });

const createItem = (array) => {
  const items = document.querySelector('.items');
  array.forEach((element) => {
    items.appendChild(createProductItemElement(tratarElemento(element)));
  });
  addToCart();
};

const fetchAPI = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  
  return fetch(APIUrlComputador, myObject)
  .then((response) => response.json())
  .then((data) => data.results);
};

// Final resolução ex 1

// Inicio resolução exercicio 6

const clearList = () => {
  const list = document.querySelector('.list');
  const listItems = list.querySelectorAll('.cart__item');
  listItems.forEach((item) => item.remove());
};

const clearCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', clearList);
};

// Final resolução exercicio 6

// Inicio resolução exercicio 7

const createloading = () => {
  const title = document.createElement('H1');
  title.className = 'loading';
  title.innerText = 'Loading...';

  return title;
};

const start = () => {
  const section = document.querySelector('.items');
  section.appendChild(createloading());
  setTimeout(() => { 
    const promisseList = fetchAPI(); 
    const loading = document.querySelector('.loading');
    loading.remove();
    promisseList.then((array) => createItem(array));
  });
};

// Final resolução exercicio 7

window.onload = function onload() { 
  start();
  clearCart();
};
