const API = {
  _loading: null,
  requestsInProgress: 0,
  // this getter idea is from Murilo
  get loading() {
    if (this._loading === null) {
      this._loading = document.createElement('p');
      this._loading.innerText = 'loading...';
      this._loading.classList.add('.loading');
    }
    return this._loading;
  },
  appendMessage() {
    document.body.appendChild(this.loading);
  },
  removeMessage() {
    document.body.removeChild(this.loading);
  },
  async fetch(url) {
    this.appendMessage();
    this.requestsInProgress++;
    const data = await fetch(url);
    this.requestsInProgress--;
    if (this.requestsInProgress === 0) this.removeMessage();
    return data;
  },
};
// Not satisfied that this function fetches and processes the data 
async function processItemInfo(itemID) {
  const data = await API.fetch(`https://api.mercadolibre.com/items/${itemID}`);
  return { id, title, price } = await data.json();
};

const cart = {
  _section: null,
  separator: '|',
  get section() {
    if (this._section === null) {
      this._section = document.querySelector('.cart__items');
      const clearBtn = document.querySelector('.empty-cart');
      clearBtn.addEventListener('click', () => this.clear());
    }
    return this._section;
  },
  async loadStorage() {
    const data = localStorage.getItem('carList');
    if (!data) return;
    await this.processItems(data);
  },
  updateStorage() {
    const regEx = /SKU: (.*) \| NAME: (.*) \| PRICE: \$(.*)/;
    const data = [...this.section.children];
    if (data.length === 0) {
      localStorage.removeItem('carList');
      return;
    }
    localStorage.setItem('carList', data.map(({ innerText }) =>
      innerText.match(regEx)[1]).join(this.separator));
  },
  updateTotalPrice() {
    const totalPrice = document.getElementById('totalPrice');
    const regEx = /PRICE: \$(\d+\.?\d*)/;
    const sum = [...this.section.children].reduce((acc, { innerText }) =>
      acc + parseFloat(innerText.match(regEx)[1]), 0);
    totalPrice.innerText = `${parseFloat(sum.toFixed(2))}`;
  },
  async fetchItems(data) {
    const items = data.split(this.separator);
    const fetchItems = items.reduce((acc, cur) => acc.push(processItemInfo(cur)) ? acc : null, []);
    return Promise.all(fetchItems);
  },
  async processItems(data) {
    const items = await this.fetchItems(data);
    items.forEach(({ id: sku, title: name, price: salePrice }) => cart.add({ sku, name, salePrice }))
  },
  add(item) {
    this.section.appendChild(this.createCartItemElement(item));
    this.updateStorage();
    this.updateTotalPrice();
  },
  remove(item) {
    this.section.removeChild(item);
    this.updateStorage();
    this.updateTotalPrice();
  },
  clear() {
    while (this.section.lastElementChild) {
      this.section.removeChild(this.section.lastElementChild);
    }
    this.updateStorage();
    this.updateTotalPrice();
  },
  createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', (event) => this.remove(event.target));
    return li;
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
};

const products = {
  _section: null,
  get section() {
    if (this._section === null) {
      this._section = document.querySelector('.items');
      this._section.addEventListener('click', this.tryAddToCart);
    }
    return this._section;
  },
  async tryAddToCart({ target: { nodeName, parentElement } }) {
    if (nodeName !== 'BUTTON') return;
    const product = getSkuFromProductItem(parentElement);
    const { id: sku, title: name, price: salePrice } =
      await processItemInfo(product);
    cart.add({ sku, name, salePrice });
  },
  add({ id, title, thumbnail }) {
    const product = this.createProductItemElement({ sku: id, name: title, image: thumbnail });
    this.section.appendChild(product);
  },
  async fetch() {
    const data = await API.fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const json = await data.json();
    json.results.forEach((item) => {
      products.add(item);
    });
  },
  createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    // High quality image hack, thanks to Renzo
    img.src = imageSource.replace('I.jpg', 'O.webp');
    return img;
  },
  createCustomElement(element, className, innerText) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    return e;
  },
  createProductItemElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';

    section.appendChild(this.createCustomElement('span', 'item__sku', sku));
    section.appendChild(this.createCustomElement('span', 'item__title', name));
    section.appendChild(this.createProductImageElement(image));
    section.appendChild(this.createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    return section;
  },
};

// The async keyword is not needed here, since we are not awaiting anything
window.onload = async function onload() {
  products.fetch();
  cart.loadStorage();
};
