/* eslint-disable no-use-before-define */
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

const addItens = (itensApi) => {
  itensApi.forEach((item) => {
    const classItems = document.querySelectorAll('.items');
    classItems[0].appendChild(createProductItemElement(item));
  });
};

const receiveApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          const itensApi = data.results;
          addItens(itensApi);
        });
    });
}; // Obtive ajuda da Carolina Vasconcelos na finalização deste requisito, obrigado :)

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const itemID = (id) => {
  const cartItems = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const itensCart = data;
          cartItems.appendChild(createCartItemElement(itensCart));
        });
    });
};

const sendItens = (event) => {
  const buttons = event.target.parentNode;
  const idItens = getSkuFromProductItem(buttons);
  itemID(idItens);
};

const addEvent = () => document
  .querySelector('.items')
  .addEventListener('click', sendItens);

window.onload = function onload() {
  receiveApi();
  addEvent();
};