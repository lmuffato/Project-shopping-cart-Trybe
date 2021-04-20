// const fetch = require('node-fetch');

const getData = () => (
  new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
    .then((products) => resolve(products.results.map((product) => 
    ({ sku: product.id, name: product.title, image: product.thumbnail }))))
  .catch((err) => reject(err));
  })
);

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

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
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

const fillHtmlWithProducts = async () => {
  try {
  const computers = await getData();
  computers.forEach((computer) => {
    document.querySelector('.items').appendChild(createProductItemElement(computer));
  });
  } catch (err) {
    console.log(err);
  }
};

window.onload = function onload() {
  fillHtmlWithProducts();
};
