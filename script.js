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

function cartItemClickListener() {
  const cartRmv2 = document.getElementsByClassName('cart__items')[0];
  cartRmv2.addEventListener('click', function (event) {
    event.target.remove();
    sub();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// MY CODE

const fetchApiElements = (search) => {
  const urlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  return new Promise((resolve) => {
    fetch(urlApi)
    .then((response) => { 
      response.json().then((data) => {
        const result = data.results;
        resolve(result);
      });
    });
  });
};

const fetchItemInfos = (id) => {
  const urlApi = `https://api.mercadolibre.com/items/${id}`;
  return new Promise((resolve) => {
    fetch(urlApi)
    .then((response) => {
      response.json().then((data) => {
        const result = data;
        resolve(result);
      });
    });
  });
};

function tookElements() {
  fetchApiElements('computador')
  .then((result) => {
    result.forEach((current) => {
      const { id: sku, title: name, thumbnail: image } = current;
      const elementFrame = createProductItemElement({ sku, name, image });
      const itemLocation = document.querySelector('.items');
      itemLocation.appendChild(elementFrame);
    });
  });
}

function fetchElementId(item) {
  fetchItemInfos(item)
    .then((result) => {
      const { id: sku, title: name, base_price: salePrice } = result;
      const cartElementFrame = createCartItemElement({ sku, name, salePrice });
      const cart = document.querySelector('.cart__items');
      cart.appendChild(cartElementFrame);
    });
}

function addToCart() {
  const items = document.querySelectorAll('.items');
  items.forEach((button) => {
    button.addEventListener('click', function (event) {
      const itemId = getSkuFromProductItem(event.target.parentNode);
      if (event.target.className === 'item__add') {
        fetchElementId(itemId);
        sum(itemId);
      }
    });
  });
}

function emptyCart() {
  const cartButton = document.querySelector('.empty-cart');
  cartButton.addEventListener('click', function () {
    const cart = document.querySelector('.cart__items');
    cart.innerText = '';
  });
}

async function sum(itemId) {
  let htmlPrice = document.querySelector('.total-price');
  await fetchItemInfos(itemId)
  .then((result) => {
    let productPrice = parseFloat(result.price);
    let currentPrice = parseFloat(htmlPrice.innerText);
    htmlPrice.innerText = currentPrice + productPrice;
  });
}

async function sub() {

}

window.onload = function onload() {
  tookElements();
  addToCart();
  emptyCart();
};
