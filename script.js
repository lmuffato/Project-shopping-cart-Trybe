/* const fetch = require('node-fetch'); */

// ------------------------------------------
/* const shopCar = document.querySelector('section.cart'); */
const carList = document.querySelector('ol.cart__items');

function toReal(number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function removeCartElement(e) {
  (e.target).remove();
}

function addCart(e) {
  const id = e.target.parentNode.querySelector('span.item__sku').innerText;
  const price = e.target.parentNode.querySelector('span.item__price').innerText;
  const title = e.target.parentNode.querySelector('span.item__title').innerText;
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', removeCartElement);

  carList.appendChild(li);
}

function createProductItemElement({ sku: id, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createButton.addEventListener('click', addCart);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createCustomElement('span', 'item__preco', toReal(price)));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButton);

  return section;
}

// ------- GET Data and Add market list --------

async function getData(QUERY) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data.results;
}

async function addDataList(QUERY) {
  const productList = await getData(QUERY);
  const marketSection = document.querySelector('section.items');

  productList.forEach((product) => {
    const item = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
      price: product.price,
    });

    marketSection.appendChild(item);
  });
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

addDataList('computador');
