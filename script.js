const cartItems = document.querySelector('.cart__items');

function transformKeys(productArray) {
  const arrays = productArray.map((produto) => {
    const {
      id: sku,
      title: name,
      price: salePrice,
      thumbnail: image,
    } = produto;
    return { sku, name, salePrice, image };
  });
  return arrays;
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

function setLocalStorage() {
  const listaProdutos = cartItems.innerHTML;
  localStorage.setItem('userSession', listaProdutos);
}

function fetchCartItemsValue() {
  const prices = [];
  cartItems.childNodes.forEach((item) => {
    const text = item.innerHTML;
    const split = text.split(':');
    const price = split[split.length - 1].trim().replace('$', '');
    return prices.push(price);
  });
  const toNumber = prices.map((item) => Number(item));
  if (toNumber.length <= 1) {
    return toNumber;
  }
  const totalPrice = toNumber.reduce((acc, currVal) => acc + currVal);
  return totalPrice;
}

async function sumCartItems() {
  const displayPrice = document.body.querySelector('.total-price');
  const totalPrice = fetchCartItemsValue();
  displayPrice.innerHTML = totalPrice;
}

function cartItemClickListener(event) {
  cartItems.removeChild(event.target);
  localStorage.removeItem('userSession');
  setLocalStorage();
  sumCartItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseToJson = await response.json();
  const parseKeys = transformKeys([responseToJson]);
  cartItems.appendChild(createCartItemElement(parseKeys[0]));
  setLocalStorage();
  sumCartItems();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  button.addEventListener('click', () => {
    addToCart(sku);
  });
  section.appendChild(button);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function insertItems(produtos) {
  const itemSession = document.querySelector('.items');
  produtos.forEach((item) => {
    const insertElement = createProductItemElement(item);
    itemSession.appendChild(insertElement);
  });
}

async function getProductsByName() {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const responseToJson = await response.json();
  const { results } = responseToJson;
  const produtos = transformKeys(results);
  return insertItems(produtos);
}

function getUserSession() {
  const content = localStorage.getItem('userSession');
  cartItems.innerHTML = content;
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) =>
    item.addEventListener('click', cartItemClickListener));
}

document.querySelector('.empty-cart').addEventListener('click', () => {
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => item.remove());
  localStorage.removeItem('userSession');
  sumCartItems();
});

setTimeout(() => {
  document.body.removeChild(document.querySelector('.loading'));
}, 2000);

window.onload = function onload() {
  getProductsByName();
  getUserSession();
  sumCartItems();
};
