/**
 * REQUIREMENT 4 - Local Storage
 */
 function saveStorage() {
  const cartItemsElement = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartItemsElement.innerHTML);
}

function loadStorage() {
  const cartItemsElement = document.querySelector('.cart__items');
  cartItemsElement.innerHTML = localStorage.getItem('cart');
}

/**
 * REQUIREMENT 1 - Product List
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
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

/**
 * REQUIREMENT 3 - Remove Product Of Cart
 */
function removeSingleProduct(event) {
  event.target.remove();
  saveStorage();
}

function cartItemClickListener() {
  const cartItemsElement = document.querySelector('.cart__items');
  cartItemsElement.addEventListener('click', removeSingleProduct);
}

/**
 * REQUIREMENT 6 - Clear Shopping Cart
 */
function emptyElement() {
  const cartItemsElement = document.querySelector('.cart__items');
  cartItemsElement.innerHTML = '';
  saveStorage();
}

function emptyCart() {
  const btnClearCartElement = document.querySelector('.empty-cart');
  btnClearCartElement.addEventListener('click', emptyElement);
}

/**
 * REQUIREMENT 7 - Loading
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
function loadingTimeout() {
  const loadingElement = document.querySelector('.loading');

  setTimeout(() => {
    loadingElement.classList.remove('display');
  }, 5000);
}

function loading() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.classList.add('display');
  loadingTimeout();
}

// Source: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
const fetchShoppingCart = () => {
  const product = 'computador';
  const loader = document.querySelector('.loading');
  loading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => object.results.forEach((productItem) => {
      document.querySelector('.items').appendChild(createProductItemElement(productItem));
      loader.remove();
    }))
    .catch((error) => {
      window.alert(`Error: ${error}`);
    });
};

/**
 * REQUIREMENT 2 - Add Item to Cart
 * Consultei o repositório do Majevski para resolver esse requisito.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/majevski-shopping-cart
 */
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Source: https://github.com/tryber/sd-010-a-project-shopping-cart/tree/29ce228c9180b050cce515732cbe94a0426deaa1
function addItemToCart() {
  const items = document.querySelector('.items');

  items.addEventListener('click', async (event) => {
    const itemSku = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${itemSku}`;
    const response = await fetch(endpoint)
      .then((object) => object.json());

    const item = { sku: itemSku, name: response.title, salePrice: response.price };
    const cartItems = document.querySelector('.cart__items');
    const cartItem = createCartItemElement(item);
    cartItems.appendChild(cartItem);

    saveStorage();
  });
}

window.onload = function onload() {
  fetchShoppingCart();
  emptyCart();
  cartItemClickListener();
  loadStorage();
  addItemToCart();
};
