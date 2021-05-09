const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function obtemElementoDoCart() {
  return document.querySelector('.cart__items');
}

function obtemStoregeDoCart() {
  if (!localStorage.obtemItem('storagedCart')) return [];
  return localStorage.obtemItem('storagedCart').split(',');
}

function defineStoregeDoCart(itemId) {
  const storage = obtemStoregeDoCart();
  storage.push(itemId);
  localStorage.defineItem('storagedCart', storage);
}

function removeItemDoStorage(itemId) {
  let storage = obtemStoregeDoCart();
  storage = storage.filter((id) => id !== itemId);

  localStorage.defineItem('storagedCart', storage);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemNoCartAoClicar(event) {
  const cart = obtemElementoDoCart();
  const e = event.target;
  const itemId = e.textContent.split(' ')[1];

  cart.removeChild(e);
  removeItemDoStorage(itemId);
}

function criaElementoNoCarrinho({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', addItemNoCartAoClicar);
  return li;
}

async function obtemItem(itemUrl) {
  const itemApi = await fetch(itemUrl);
  const item = await itemApi.json();

  if (item.error) throw new Error(item.error);
  return item;
}

async function defineItem(event) {
  try {
    const e = event.target;
    const cart = obtemElementoDoCart();
    const itemId = getSkuFromProductItem(e.parentElement);
    const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;

    const { id: sku, title: name, price: salePrice } = await obtemItem(itemUrl);
    cart.appendChild(criaElementoNoCarrinho({ sku, name, salePrice }));
    defineStoregeDoCart(sku);
  } catch (error) {
    alert(error);
  }
}

async function poeNoCarrinho() {
  try {
    const storage = obtemStoregeDoCart();
    const cart = obtemElementoDoCart();

    const items = await Promise.all(storage.map(async (itemId) => {
      const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
      const { id: sku, title: name, price: salePrice } = await obtemItem(itemUrl);
      return { sku, name, salePrice };
    }));

    items.forEach(({ sku, name, salePrice }) => 
    cart.appendChild(criaElementoNoCarrinho({ sku, name, salePrice })));
  } catch (error) {
    alert(error);
  }
}

async function obtemProdutos() {
  const productsApi = await fetch(api);
  const productsJson = await productsApi.json();
  const products = productsJson.results;

  if (productsJson.error) console.log(productsJson.message);
  return products;
}

function itemAddEvent() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', defineItem));
}

async function listaProdutos() {
  try {
    const products = await obtemProdutos();
    const sectionItems = document.querySelector('.items');
    products.forEach(({ id: sku, title: name, thumbnail_id: imageId }) => {
      const image = `https://http2.mlstatic.com/D_NQ_NP_${imageId}-O.webp`;
      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
    itemAddEvent();
  } catch (error) {
    alert(error);
  }
}

window.onload = () => {
  listaProdutos();
  poeNoCarrinho();
};