const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function getCartElement() {
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
  const cart = getCartElement();
  const e = event.target;
  const itemId = e.textContent.split(' ')[1];
  
  cart.removeChild(e);
  removeStoragedItem(itemId);
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
    const cart = getCartElement();
    const itemId = getSkuFromProductItem(e.parentElement);
    const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;

    const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
    cart.appendChild(createCartItemElement({ sku, name, salePrice }));
    setStoragedItem(sku);
  } catch (error) {
    alert(error);
  }
}

async function getProducts() {
  const productsApi = await fetch(api);
  const productsJson = await productsApi.json();
  const products = productsJson.results;
  
  if (productsJson.error) console.log(productsJson.message);
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
    const cart = getCartElement();

    const items = await Promise.all(storage.map(async (itemId) => {
      const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
      const { id: sku, title: name, price: salePrice } = await getItem(itemUrl);
      return { sku, name, salePrice };
    }));

    items.forEach(({ sku, name, salePrice }) => 
    cart.appendChild(createCartItemElement({ sku, name, salePrice })));
  } catch (error) {
    alert(error);
  }
}

window.onload = () => {
  showProducts();
  loadCart();
};