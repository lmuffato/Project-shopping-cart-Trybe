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

async function getItems() { 
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const object = await response.json();
  const { results } = object;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const resultItem = {
      sku: result.id, 
      name: result.title,
      image: result.thumbnail,
    };
    itemsElement.appendChild(createProductItemElement(resultItem));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, base_price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItem(e) {
  const productId = getSkuFromProductItem(e.target.parentNode);
  const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const object = await response.json();
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(object));
}

window.onload = function onload() {
  getItems()
  .then(() => {
    const buttons = document.querySelectorAll('.item__add');
    buttons.forEach((button) => button.addEventListener('click', getItem));
  });
};
