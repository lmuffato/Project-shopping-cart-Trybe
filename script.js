function sumPrices() {
  const classCartItem = '.cart__item';
  const cartItems = [...document.querySelectorAll(classCartItem)];
  const prices = cartItems.map(({ innerHTML }) => innerHTML.match(/PRICE: \$([\s\S]+)/)[1]);
  console.log(prices);
  let sum = 0;
  prices.forEach((price) => { sum += parseFloat(price); });
  sum = parseFloat(sum.toFixed(2));

  const printPrice = document.querySelector('.total-price');
  printPrice.innerHTML = `${sum}`;
}

function storagedCartItems() {
  if (localStorage.getItem('cartItems')) {
    return JSON.parse(localStorage.getItem('cartItems'));
  }
  return [];
}

function setStorage(cartItemsArray) {
  localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
}

function allCartItems() {
  const classCartItem = '.cart__item';
  const cartItems = [...document.querySelectorAll(classCartItem)];
  const allItems = cartItems.map((cartItem) => {
    const item = cartItem.innerHTML
      .match(/SKU: ([\S]+) \| NAME: ([\s\S]+) \| PRICE: \$([\s\S]+)/);
    return {
      sku: item[1],
      name: item[2],
      salePrice: item[3],
    };
  });
  return allItems;
}

function updateStorage() {
  const cartItems = allCartItems();
  setStorage(cartItems);
}
// ****

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const { target } = event;
  target.remove();
  updateStorage();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(itemId) {
  const cartListLocation = document.querySelector('.cart__items');
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await fetchItem.json();

  const cartItem = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const createCartList = createCartItemElement(cartItem);
  cartListLocation.appendChild(createCartList);
  updateStorage();
  sumPrices();
}

function addToCartClickListener(event) {
  const getitemId = getSkuFromProductItem(event.target.parentNode);
  addToCart(getitemId);
}

function ClickAddToCartButton() {
  const addToCartButton = document.querySelectorAll('.item__add');
  addToCartButton.forEach((button) =>
    button.addEventListener('click', addToCartClickListener));
}

function loadStorage() {
  const cartListLocation = document.querySelector('.cart__items');
  const cartItems = storagedCartItems();
  cartItems.forEach((cartItem) => {
    cartListLocation.appendChild(createCartItemElement(cartItem));
  });
  sumPrices();
}

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

async function fetchItems() {
  const fetchApi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getJson = await fetchApi.json();
  const getItems = getJson.results;
  
  getItems.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const creatItem = createProductItemElement(item);
    document.querySelector('.items').appendChild(creatItem);
  });
  ClickAddToCartButton();
}

function clearCart() {
  document.querySelector('ol.cart__items').innerHTML = '';
  updateStorage();
  sumPrices();
}

const clearCartClickListener = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
};

window.onload = function onload() {
  fetchItems();
  loadStorage();
  sumPrices();
  clearCartClickListener();
};
