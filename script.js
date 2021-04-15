const cartItems = '.cart__items';

function getItemsPrices() {
  const cartLi = document.querySelector(cartItems);
  localStorage.setItem('items', cartLi.innerHTML);
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
  event.target.remove();
  getItemsPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProducts() {
  const getProduct = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((data) => data.results);
    getProduct.forEach((item) => {
    const receivedItems = { sku: item.id, name: item.title, image: item.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(receivedItems));
  });
}

const createCartItem = () => {
  const allItems = document.querySelector('.items');
  allItems.addEventListener('click', async (event) => {
   const idSku = getSkuFromProductItem(event.target.parentNode);
   const getItems = await fetch(`https://api.mercadolibre.com/items/${idSku}`)
    .then((result) => result.json());
   const getPrice = { sku: idSku, name: getItems.title, salePrice: getItems.price };
   const cartLoad = createCartItemElement(getPrice);
   document.querySelector('ol.cart__items').appendChild(cartLoad);
   getItemsPrices();
 });
};

window.onload = function onload() { };
fetchProducts();
createCartItem();
