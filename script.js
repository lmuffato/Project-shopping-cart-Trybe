const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function obtemItensDoCarrinho() {
  return document.querySelector('.cart__items');
}

function defineStorageProCarrinho() {
  if (!localStorage.getItem('storagedCart')) return [];
  return localStorage.getItem('storagedCart').split(',');
}

function defineStorageProItem(itemId) {
  const storage = defineStorageProCarrinho();

  storage.push(itemId);
  localStorage.setItem('storagedCart', storage);
}

function removeItemDoStorage(itemId) {
  let storage = defineStorageProCarrinho();
  storage = storage.filter((id) => id !== itemId);

  localStorage.setItem('storagedCart', storage);
}

function limpaStorageDoCarrinho() {
  localStorage.removeItem('storagedCart');
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

async function somaPreços() {
  const cart = document.querySelector('.cart');
  const cartItems = obtemItensDoCarrinho().childNodes;
  let totalPrice = 0;

  cartItems.forEach(({ innerText }) => {
    const price = Number(innerText.split('$')[1]);
    totalPrice += price;
  }, 0);

  if (document.querySelector('.total-price')) {
    const actualPrice = document.querySelector('.total-price');
    actualPrice.innerText = `${totalPrice}`;
  } else {
    cart.appendChild(createCustomElement('span', 'total-price', `${totalPrice}`));
  }
}

function callbackPraAddItemNoCart(event) {
  const cartItems = obtemItensDoCarrinho();
  const e = event.target;
  const itemId = e.textContent.split(' ')[1];

  cartItems.removeChild(e);
  removeItemDoStorage(itemId);
  somaPreços();
}

function criaElementoParaOItemDoCart({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', callbackPraAddItemNoCart);
  return li;
}

async function getItem(itemUrl) {
  const itemApi = await fetch(itemUrl);
  const item = await itemApi.json();

  if (item.error) throw new Error(item.error);
  return item;
}

async function setItem(event) {
  try {
    const e = event.target;
    const cartItems = obtemItensDoCarrinho();
    const itemId = getSkuFromProductItem(e.parentElement);
    const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;

    const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
    cartItems.appendChild(criaElementoParaOItemDoCart({ sku, name, salePrice }));
    defineStorageProItem(sku);
    await somaPreços();
  } catch (error) {
    alert(error);
  }
}

async function getProducts() {
  const productsApi = await fetch(api);
  const productsJson = await productsApi.json();
  const products = productsJson.results;

  if (productsJson.error) return productsJson.message;
  return products;
}

function itemAddEvent() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', setItem));
}

async function listaProdutos() {
  try {
    const products = await getProducts();
    const sectionItems = document.querySelector('.items');

    sectionItems.firstChild.remove();
    products.forEach(({ id: sku, title: name, thumbnail_id: imageId }) => {
      const image = `https://http2.mlstatic.com/D_NQ_NP_${imageId}-O.webp`;

      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
    itemAddEvent();
  } catch (error) {
    alert(error);
  }
}

async function loadCarrinho() {
  try {
    const storage = defineStorageProCarrinho();
    const cartItems = obtemItensDoCarrinho();
    const items = await Promise.all(storage.map(async (itemId) => {
      const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
      const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
      return { sku, name, salePrice };
    }));

    items.forEach(({ sku, name, salePrice }) => 
    cartItems.appendChild(criaElementoParaOItemDoCart({ sku, name, salePrice })));
    somaPreços();
  } catch (error) {
    alert(error);
  }
}

function limpaCarrinho() {
  const cartItems = obtemItensDoCarrinho();
  cartItems.innerText = '';
  limpaStorageDoCarrinho();
  somaPreços();
}

function botaoDoCarrinho() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', limpaCarrinho);
}

function loading() {
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

window.onload = () => {
  loading();
  listaProdutos();
  loadCarrinho();
  botaoDoCarrinho();
};