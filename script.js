// const fetch = require('node-fetch');

/* const fetchProduct = (url) => {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      fetch(url)
        .then(response => response.json())
        .then(data => console.log(data));
    } else {
      reject( new Error ('endpoint não encontrado'));
    }
  });
} */

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fechProductId = async (itemId) => {
  const URL = `https://api.mercadolibre.com/items/${itemId}`;
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  const cartList = document.querySelector('.cart__items');
  console.log(cartList);

  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  console.log(obj);

  const itemList = createCartItemElement(obj);
  cartList.appendChild(itemList);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const id = getSkuFromProductItem(event.target.parentNode);
  console.log(id);
  fechProductId(id);
}

const clickButton = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) =>
    button.addEventListener('click', cartItemClickListener));
};

const fetchProducts = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const dataFetch = await fetch(URL);
  const data = await dataFetch.json();

  const sectionItems = document.querySelector('.items');

  data.results.forEach(({ id, title, thumbnail }) => {
    const obj = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    const item = createProductItemElement(obj);
    sectionItems.appendChild(item);
  });

  clickButton();
};

window.onload = function onload() {
  fetchProducts();
};
