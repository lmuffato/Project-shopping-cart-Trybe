const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function getCartItems() {
  return document.querySelector('.cart__items');
}

function getStoragedCart() {
  if (!localStorage.getItem('storagedCart')) return [];
  return localStorage.getItem('storagedCart').split(',');
}

function setStoragedItem(itemId) {
  const storage = getStoragedCart();

  storage.push(itemId);
  localStorage.setItem('storagedCart', storage);
}

function removeStoragedItem(itemId) {
  let storage = getStoragedCart();
  storage = storage.filter((id) => id !== itemId);

  localStorage.setItem('storagedCart', storage);
}

function emptyStoragedCart() {
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

async function sumPrices() {
  const cart = document.querySelector('.cart');
  const cartItems = getCartItems().childNodes;
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

function cartItemClickListener(event) {
  const cartItems = getCartItems();
  const e = event.target;
  const itemId = e.textContent.split(' ')[1];
  
  cartItems.removeChild(e);
  removeStoragedItem(itemId);
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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
    const cartItems = getCartItems();
    const itemId = getSkuFromProductItem(e.parentElement);
    const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;

    const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
    setStoragedItem(sku);
    await sumPrices();
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

async function showProducts() {
  try {
    const products = await getProducts();
    const sectionItems = document.querySelector('.items');

    sectionItems.firstChild.remove();
    products.forEach(({ id: sku, title: name, thumbnail_id: imageId }) => {
      // https://trybecourse.slack.com/archives/C01L16B9XC7/p1618509977348900
      const image = `https://http2.mlstatic.com/D_NQ_NP_${imageId}-O.webp`;
      
      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
    itemAddEvent();
  } catch (error) {
    alert(error);
  }
}

async function loadCart() {
  try {
    const storage = getStoragedCart();
    const cartItems = getCartItems();
    const items = await Promise.all(storage.map(async (itemId) => {
      const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
      const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
      return { sku, name, salePrice };
    }));

    items.forEach(({ sku, name, salePrice }) => 
    cartItems.appendChild(createCartItemElement({ sku, name, salePrice })));
    sumPrices();
  } catch (error) {
    alert(error);
  }
}

function emptyCart() {
  const cartItems = getCartItems();
  cartItems.innerText = '';
  emptyStoragedCart();
  sumPrices();
}

function cartButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
}

function loading() {
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

window.onload = () => {
  loading();
  showProducts();
  loadCart();
  cartButton();
};