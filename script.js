const product = class Product {
  constructor(sku, name, price, image) {
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.image = image;
  }

  static getUrlProducts() {
    return 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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

  static async getProduct(url, sku) {
    return fetch(`${url}/${sku}`).then((response) => response.json());
  }
};

function getSectionItems() {
  return document.getElementById('__items');
}

function getOlCartItems() {
  return document.getElementById('__cart_ol');
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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function initCatalog(products) {
  products.forEach((productItem) => {
    const section = createProductItemElement(productItem);
    getSectionItems().appendChild(section);
  });
}

function clearCart() {
  getOlCartItems().innerHTML = '';
}

async function insertItemToCartListener() {
  const url = 'https://api.mercadolibre.com/items';
  const items = document.getElementsByClassName('item');
  const buttonsAdd = document.getElementsByClassName('item__add');

  for (let i = 0; i < items.length; i += 1) {
    const sku = getSkuFromProductItem(items[i]);
    getProductsAPI(`${url}/${sku}`)
        .then((item) => {
          const productFormat = { sku: item.id, name: item.title, salePrice: item.price };
          buttonsAdd[i].addEventListener('click', () => {
            const li = createCartItemElement(productFormat);
            getOlCartItems().appendChild(li);
          });
        });
  }
}

async function init() {
  const products = await product.getProducts();
  await initCatalog(products);
}

window.onload = function onload() {
  init().then();

  //const buttonClear = document.getElementsByClassName('empty-cart')[0];

  //await insertItemToCartListener();

  //buttonClear.addEventListener('click', clearCart);
};