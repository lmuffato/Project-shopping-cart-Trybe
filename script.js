const product = class Product {
  constructor(sku, name, salePrice, image) {
    this.sku = sku;
    this.name = name;
    this.salePrice = salePrice;
    this.image = image;
  }

  static getUrlProducts() {
    return 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  }

  static getUrlProduct(sku) {
    const url = 'https://api.mercadolibre.com/items';
    return `${url}/${sku}`;
  }

  static async getProducts(url = this.getUrlProducts()) {
    const products = [];
    await fetch(url)
        .then((response) => response.json())
        .then((data) => data.results.forEach((productItem) => {
          const { id, title, price, thumbnail } = productItem;
          products.push(new Product(id, title, price, thumbnail));
    }));
    return products;
  }

  static async getProduct(sku) {
    return fetch(this.getUrlProduct(sku))
        .then((response) => response.json())
        .then((productItem) => {
          const { id, title, price, thumbnail } = productItem;
          return new Product(id, title, price, thumbnail);
        });
  }
};

let productsOnCart = 0;

// código da função retirado: https://love2dev.com/blog/javascript-remove-from-array/
function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value;
  });
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
  // Remove from array
  const productRemove = productsOnCart.find((productItem) => productItem.sku === event.target.id);
  productsOnCart = arrayRemove(productsOnCart, productRemove);

  // remove from OL
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function createLoadingBox() {
  const boxLoading = document.createElement('section');
  boxLoading.classList.add('loading-section');

  const spanLoading = document.createElement('span');
  spanLoading.classList.add('loading');
  spanLoading.innerText = 'Loading...';

  boxLoading.appendChild(spanLoading);
  document.getElementsByTagName('body')[0].appendChild(boxLoading);
}

function getSectionItems() {
  return document.getElementById('__items');
}

function getLoadingBoxElement() {
  return document.getElementsByClassName('loading-section')[0];
}

function getMainContainerElement() {
  return document.getElementsByClassName('container')[0];
}

function getTotalPriceElement() {
  return document.getElementsByClassName('total-price')[0];
}

function getOlCartItems() {
  return document.getElementById('__cart_ol');
}

function getButtonItem(item) {
  return item.querySelector('button.item__add');
}

function loadCart() {
  productsOnCart.forEach((productItem) => {
    const cartItem = createCartItemElement(productItem);
    getOlCartItems().appendChild(cartItem);
  });
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(productsOnCart));
}

function getCart() {
  let cart = localStorage.getItem('cart');
  cart = JSON.parse(cart);
  return cart === null ? [] : cart;
}

async function loadCartTotalValue() {
  const totalPriceElement = getTotalPriceElement();
  try {
    const productsPrices = productsOnCart.map((productItem) => productItem.salePrice);
    const totalValue = productsPrices.reduce((acc, curValue) => acc + curValue, 0);
    totalPriceElement.innerText = totalValue;
  } catch (error) {
    totalPriceElement.innerText = 0;
  }
}

async function olObserver(mutationList) {
  if (mutationList[0].type === 'childList') {
    saveCart();
    loadCartTotalValue().then();
  }
}

function initOlObserver(callback,
                        target,
                        options = { attributes: true, childList: true, subtree: true }) {
  const observer = new MutationObserver(callback);
  observer.observe(target, options);
}

function clearCart() {
  getOlCartItems().innerHTML = '';
  productsOnCart = [];
}

async function initClearCartButton() {
  const buttonClear = document.getElementsByClassName('empty-cart')[0];
  buttonClear.addEventListener('click', clearCart);
}

async function addItemToCart(sku) {
  const productItem = await product.getProduct(sku);
  productsOnCart.push(productItem);
  const itemLi = createCartItemElement(productItem);
  getOlCartItems().appendChild(itemLi);
}

function initAddCartListener() {
  const items = document.getElementsByClassName('item');
  Array.from(items).forEach((item) => {
    const sku = getSkuFromProductItem(item);
    const button = getButtonItem(item);
    button.addEventListener('click', () => addItemToCart(sku));
  });
}

async function initCatalog(products) {
  products.forEach((productItem) => {
    const section = createProductItemElement(productItem);
    getSectionItems().appendChild(section);
  });
}

function initPageVisible() {
  getLoadingBoxElement().remove();
  getMainContainerElement().classList.remove('invisible');
}

function initLoadingInitial() {
  createLoadingBox();
  getMainContainerElement().classList.add('invisible');
}

async function init() {
  initLoadingInitial();
  productsOnCart = getCart();
  initOlObserver(olObserver, getOlCartItems());
  loadCart();
  const products = await product.getProducts();
  await initCatalog(products);
  initPageVisible();
  initAddCartListener();
  initClearCartButton().then();
}

window.onload = function onload() {
  init().then();
};