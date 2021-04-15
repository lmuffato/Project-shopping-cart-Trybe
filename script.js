const clearList = () => {
  const list = document.querySelector('.list');
  const listItems = list.querySelectorAll('.cart__item');
  listItems.forEach((item) => item.remove());
};

// resolução ex5

const sumItems = (cartItems) => {
  const prices = cartItems.map((object) => object.salePrice);
  return prices.reduce((currentValue, number) => currentValue + number);
};

async function updateTotal() {
  let sum = 0;
  const value = document.querySelector('.total-price');
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  if (cartItems !== null) {
    sum = sumItems(cartItems);
  }
  value.innerText = `${sum}`;
}

// fim exercicio 5

// inicio funçoes do local storage

const addLocalStorage = (object) => {
  let storage = [];
  if (localStorage.getItem('cart') !== null) {
    storage = JSON.parse(localStorage.getItem('cart'));
    storage.push(object);
  } else storage.push(object);

  localStorage.setItem('cart', JSON.stringify(storage));
};

async function clearStorage() {
  localStorage.removeItem('cart');
  await updateTotal();
}
  
const sideFunction = (storage, sku) => {
  const removed = [];
    storage.forEach((object) => {
    if (object.sku !== sku) {
      removed.push(object);
    }
  });
  localStorage.setItem('cart', JSON.stringify(removed));
};

const removeLocalStorage = (sku) => {
  const storage = JSON.parse(localStorage.getItem('cart'));
  if (storage.length === 1) {
    clearStorage();
  } else {
    sideFunction(storage, sku);
    console.log(sku);
}
};

// fim funções do local storage

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

// Exercicio 3 inicio

async function cartItemClickListener(event) {
  const id = event.target.innerText.split(' ')[1];
  removeLocalStorage(id);
  await updateTotal();
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Exercicio 3 fim

// Exercicio 6 inicio

const ListenClearBtn = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    clearStorage();
    clearList();
  });
};

// exercicio 6 fim

// begin update cart (exercicio4)

const appendCartItem = (object) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(object));
};

async function updateCart() {
  const storage = JSON.parse(localStorage.getItem('cart'));
  if (storage !== null) {
    storage.forEach((object) => appendCartItem(object));
  }
  await updateTotal();
}

// end update cart (exercicio4)

// Inicio ex 2 (add to cart)

// const fetch = require('node-fetch'); 

const createCartObject = ({ id, title, price }) => ({
  sku: id,
  name: title,
  salePrice: price,
});

async function fetchId(id) {  
  const APIUrlId = `https://api.mercadolibre.com/items/${id}`;

  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  return fetch(APIUrlId, myObject)
  .then((response) => response.json())
  .then((data) => addLocalStorage(createCartObject(data)));
}
  
async function addToCart() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((item) => {
    item.addEventListener('click', async () => {
      const id = getSkuFromProductItem(item.parentElement);
      await fetchId(id);
      clearList();
      updateCart();
    });
  });
}

// Final resolução ex 2

// Início resolução exercicio 1

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
  const APIUrlComputador = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  
  return fetch(APIUrlComputador, myObject)
  .then((response) => response.json())
  .then((data) => data.results);
};

// Final resolução ex 1

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
    updateCart();
    start();
    ListenClearBtn();
  };
