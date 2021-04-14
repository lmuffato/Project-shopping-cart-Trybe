/* eslint-disable no-new */
/* eslint-disable no-unreachable */

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// Requisito 1
// Requisito feito com a referência de código do Felipe Muller
// Link: https://github.com/tryber/sd-010-a-project-shopping-cart/blob/7186f9c6b920d6ba685a2c87bcb48e7c2488a5ec/script.js
const getPromiseComputer = (product) => (
   new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
      .then((response) => {
        response.json().then((data) => {
          resolve(data);
        });
      });
  })
);

const AppendItem = async (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((element) => {
    const result = createProductItemElement(element);
    items.appendChild(result);
  });
};

window.onload = function onload() { 
  getPromiseComputer('computador')
    .then((result) => AppendItem(result));
};
