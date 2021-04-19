/**
 * REQUIREMENT 4 - Local Storage
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
function saveStorage() {
  const olItems = document.getElementById('cart__items');
  localStorage.setItem('cart', olItems.innerHTML);
}

function loadStorage() {
  const olItems = document.getElementById('cart__items');
  olItems.innerHTML = localStorage.getItem('cart');
}

function createProductImageElement(imageSource) {
  const imgElement = document.createElement('img');
  imgElement.className = 'item__image';
  imgElement.src = imageSource;
  return imgElement;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// REQUIREMENT 3 - Remove Product Of Cart
function removeSingleProduct(event) {
  event.target.remove();
  saveStorage();
}

function cartItemClickListener() {
  const olItems = document.getElementById('cart__items');
  olItems.addEventListener('click', removeSingleProduct);
}

// REQUIREMENT 6 - Clear Shopping Cart
function emptyElement() {
  const cartItemsElement = document.querySelector('.cart__items');
  cartItemsElement.innerHTML = '';
  saveStorage();
}

function emptyCart() {
  const btnClearCartElement = document.querySelector('.empty-cart');
  btnClearCartElement.addEventListener('click', emptyElement);
}

// REQUIREMENT 7 - Loading
function removeLoading() {
  const loadingElement = document.querySelector('.loading');

  setTimeout(() => {
    loadingElement.classList.remove('display');
  }, 5000);
}

function addLoading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.classList.add('display');

  removeLoading();
}

/**
 * REQUIREMENT 1 - Product List
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
const fetchShoppingCart = (product) => {
  const loader = document.querySelector('.loading');
  addLoading();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => response.json())
    .then((object) => object.results.forEach((item) => {
      document
        .querySelector('.items')
        .appendChild(createProductItemElement(item));
      loader.remove();
    }));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

/**
 * REQUIREMENT 2 - Add Item to Cart
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
function addItemToCart() {
  const items = document.querySelector('.items');

  items.addEventListener('click', async (event) => {
    const itemSku = getSkuFromProductItem(event.target.parentNode);
    const response = await fetch(`https://api.mercadolibre.com/items/${itemSku}`)
      .then((object) => object.json());

    const item = { sku: itemSku, name: response.title, salePrice: response.price };
    const cartItemsList = document.querySelector('.cart__items');
    const sigleItem = createCartItemElement(item);
    cartItemsList.appendChild(sigleItem);

    saveStorage();
  });
}

window.onload = function onload() {
  fetchShoppingCart('computador');
  emptyCart();
  cartItemClickListener();
  loadStorage();
  addItemToCart();
};
