// vamos lá
window.onload = function onload() { };

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

function cartItemClickListener(event) {
  console.log(event);
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
  const theTargetId = await item.target.parentNode.firstChild.lastChild.innerText;
  const endPoint = `https://api.mercadolibre.com/items/MLB${theTargetId}`;
  const response = await fetch(endPoint);
  const asJson = await response.json();
  const asObj = {
    sku: asJson.id,
    name: asJson.title,
    salePrice: asJson.price,
  };
  const weGonnaAppend = createCartItemElement(asObj);
  document.getElementsByClassName('cart__items')[0].appendChild(weGonnaAppend);
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
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const asJson = await response.json();
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

insertIntens();