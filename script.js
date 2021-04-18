const cartItems = document.querySelector('.cart__items');

function transformKeys(arrayDeObjs) {
  const arrays = arrayDeObjs.map((produto) => {
    const { id: sku, title: name, price: salePrice, thumbnail: image } = produto;
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

function cartItemClickListener(event) {
  cartItems.removeChild(event.target);
  localStorage.removeItem('userSession');
  setLocalStorage();
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
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
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
  const sessao = document.querySelector('.items');
  produtos.forEach((item) => {
    const insertElement = createProductItemElement(item);
    sessao.appendChild(insertElement);
  });
}

async function getProductsByName() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseToJson = await response.json();
  const { results } = responseToJson;
  const produtos = transformKeys(results);
  return insertItems(produtos);
}

function getUserSession() {
  const content = localStorage.getItem('userSession');
  cartItems.innerHTML = content;
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

document.querySelector('.empty-cart').addEventListener('click', () => {
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => item.remove());
  localStorage.removeItem('userSession');
});

window.onload = function onload() {
  getProductsByName();
  getUserSession();
 };