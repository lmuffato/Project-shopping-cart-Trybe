/* eslint-disable no-unreachable */
window.onload = function onload() { };

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
  section.className = 'items';

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

async function getComputerPromise() {
  const resposta = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dado = await resposta.json();
  return dado;
}
    
 function getComputers({ results }) {
  results.forEach((result) => {
    const item = document.querySelector('.items');
    item.appendChild(createProductItemElement(result));
  });
}

async function getData() {
  try {
  getComputers(await
    getComputerPromise());
  } catch (error) {
    console.log('Falha de Execução');
  }
}

getData();