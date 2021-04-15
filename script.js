const API_URL_PRODUCTS = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const API_URL_ITEM = 'https://api.mercadolibre.com/items/';

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const appendProduct = (product) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(product));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItem = (item) => {
  const cart = document.querySelector('.cart');
  cart.appendChild(createCartItemElement(item));
};

const fetchItem = (sku) => fetch(`${API_URL_ITEM}${sku}`)
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => console.log(error));

const cartButtonEvent = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const sku = e.target.parentNode.firstChild.innerHTML;
      fetchItem(sku)
      .then((data) => addCartItem(data));
    });
  });
};

const fetchProducts = () => {
  fetch(API_URL_PRODUCTS)
  .then((response) => response.json())
  .then(({ results }) => results.forEach((product) => appendProduct(product)))
  .then(() => cartButtonEvent()) 
  .catch((error) => console.log(error));
};

window.onload = function onload() { 
  fetchProducts();
};
