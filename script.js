// vamos lá

const listInCart = document.querySelector('.cart__items');

const saveCartInfo = () => {
  localStorage.setItem('cart', listInCart.innerHTML);
};

// const fetch = require("node-fetch");

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// req 3

function cartItemClickListener(event) {
  const theTarget = event.target;
  listInCart.removeChild(theTarget);
  saveCartInfo();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// req 2

const insertInCart = async (item) => {
  const theTargetId = item.target.parentElement.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${theTargetId}`;
  const response = await fetch(endPoint);
  const asJson = await response.json();
  const asObj = {
    sku: asJson.id,
    name: asJson.title,
    salePrice: asJson.price,
  };
  const weGonnaAppend = createCartItemElement(asObj);
  listInCart.appendChild(weGonnaAppend);
  saveCartInfo();
};

// add eventLis

const addEventLisOnItens = () => {
  const elementsItemAdd = document.getElementsByClassName('item__add');
  const arr = [...elementsItemAdd];
  arr.forEach((element) => element.addEventListener('click', insertInCart));
};

// requesito 1

const insertIntens = async () => {
  const itensSection = document.querySelector('.items');
  const loading = document.createElement('section');
  loading.innerText = 'Carregando...';
  loading.className = 'loading';
  itensSection.appendChild(loading);
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const asJson = await response.json();
  loading.parentElement.removeChild(loading);
  const resultsArr = asJson.results;
  resultsArr.forEach((result) => {
    const resultAsObj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    itensSection.appendChild(createProductItemElement(resultAsObj));
  });
  addEventLisOnItens();
};

// requesito 6

const clearCart = () => {
  const arr = [...listInCart.children];
  arr.forEach((element) => listInCart.removeChild(element));
  saveCartInfo();
};

document.querySelector('.empty-cart').addEventListener('click', clearCart);

window.onload = function onload() {
  const previCart = localStorage.getItem('cart');
  if (previCart !== null) listInCart.innerHTML = previCart;
  insertIntens();
};

// obrigado rogerio e murilo
