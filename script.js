// const { identity } = require("cypress/types/lodash");

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const selectCartItem = document.querySelector('.cart__items');
  const targetToRemove = event.target;
  selectCartItem.removeChild(targetToRemove);

  return event;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const getItemByID = async (itemID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const data = await response.json();
  return data;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getButtonsID = async (event) => {
  const cartElements = document.querySelector('.cart__items');
    const itemTargeted = getSkuFromProductItem(event.target.parentNode);
    const computer = await getItemByID(itemTargeted);
    const obj = {
      sku: computer.id,
      name: computer.title,
      salePrice: computer.price,
    };
    cartElements.appendChild(createCartItemElement(obj));
  };

function createProductItemElement({ sku, name, image }) {
  const selectItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', getButtonsID);
  return selectItems.appendChild(section);
}

const getItem = () => {
        fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
        .then((response) => response.json()).then((data) => data.results.forEach((pc) => {
            const items = {
                sku: pc.id,
                name: pc.title,
                image: pc.thumbnail,
            };
    createProductItemElement(items);
        }));
};

window.onload = async function onload() { 
  await getItem();
};
