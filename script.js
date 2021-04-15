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
  console.log(productsOnCart);

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

function getSectionItems() {
  return document.getElementById('__items');
}

function getOlCartItems() {
  return document.getElementById('__cart_ol');
}

function getButtonItem(item) {
  return item.querySelector('button.item__add');
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
  productsOnCart = [];
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

async function init() {
  const products = await product.getProducts();
  await initCatalog(products);
  await initAddCartListener();
  initClearCartButton().then();
}

window.onload = function onload() {
  init().then();
};