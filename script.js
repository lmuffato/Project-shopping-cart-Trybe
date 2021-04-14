window.onload = function onload() { };

const cartItemsClass = '.cart__items';
const totalPrice = '.total-price';
let prices = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const loading = () => {
  const loadingElement = document.createElement('p');
  loadingElement.classList.add('loading');
  loadingElement.innerText = 'loading...';
  document.body.appendChild(loadingElement);
};

const stopLoading = () => {
  const loadingCreated = document.querySelector('.loading');
  loadingCreated.remove();
};

function saveItems() {
  const cartList = document.querySelector(cartItemsClass);
  localStorage.setItem('cart', cartList.innerHTML);
  const totalPriceText = document.querySelector(totalPrice);
  localStorage.setItem('price', totalPriceText.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveItems();
 }

 function getItemsStorage() {
  const cart = document.querySelector(cartItemsClass);
  cart.innerHTML = localStorage.getItem('cart');
  const cartItems = document.getElementsByClassName('cart__item');
  [...cartItems].forEach((item) => item.addEventListener('click', cartItemClickListener));
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

async function getItems() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  loading();
  const response = await fetch(endpoint);
  const object = await response.json();
  const pcs = object.results;
  const itemsElement = document.querySelector('.items');

  pcs.forEach((pc) => {
    const pcItem = {
      sku: pc.id,
      name: pc.title,
      image: pc.thumbnail,
    };
    const item = createProductItemElement(pcItem);
    itemsElement.appendChild(item);
  });
  stopLoading();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const totalValue = async (price) => {
  const priceRound = (Math.round(price * 100)) / 100;
  prices.push(priceRound);
  const sum = prices.reduce((acc, curr) => acc + curr, 0);
  const total = (Math.round(sum * 100)) / 100;
  const priceText = document.querySelector(totalPrice);
  priceText.innerHTML = `${total}`;
  };

const itemToCart = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    const skuItem = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${skuItem}`;
    const response = await fetch(endpoint)
      .then((res) => res.json());
    const item = {
      sku: skuItem,
      name: response.title,
      salePrice: response.price,
    };
    const element = createCartItemElement(item);
    const cart = document.querySelector('.cart__items');
    cart.appendChild(element);
    totalValue(item.salePrice);
    saveItems();
  });
};

const clearCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const allItems = document.querySelector(cartItemsClass);
    allItems.innerHTML = '';
    const priceText = document.querySelector(totalPrice);
    priceText.innerHTML = `${0}`;
    prices = [];
    saveItems();
  });
};

getItems();
itemToCart();
getItemsStorage();
clearCart();